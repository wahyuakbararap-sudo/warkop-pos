import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Order counter (resets on server restart)
let orderCounter = 0;
const JWT_SECRET = process.env.JWT_SECRET || "warkop-pos-secret-key";

// Initialize order counter from database
async function initOrderCounter() {
  try {
    const lastOrder = await prisma.order.findFirst({
      orderBy: { createdAt: "desc" },
      select: { orderCode: true },
    });
    if (lastOrder) {
      const match = lastOrder.orderCode.match(/ORD-(\d+)/);
      if (match) {
        orderCounter = parseInt(match[1], 10);
        console.log(`[INIT] Order counter initialized to ${orderCounter}`);
      }
    }
  } catch (e) {
    console.error("[INIT] Failed to init order counter:", e);
  }
}

// Middleware
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Ensure uploads directory exists
import fs from "fs";
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// File upload
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ============================================================
//  AUTH MIDDLEWARE
// ============================================================

interface AuthRequest extends express.Request {
  user?: { id: string; role: string; branchId?: string };
}

function authMiddleware(req: AuthRequest, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token tidak ditemukan" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; branchId?: string };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token tidak valid" });
  }
}

function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Akses ditolak" });
    }
    next();
  };
}

// ============================================================
//  AUTH ROUTES
// ============================================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username dan password wajib diisi" });

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: "Username atau password salah" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Username atau password salah" });

    if (!user.isActive) return res.status(403).json({ error: "Akun nonaktif" });

    const token = jwt.sign(
      { id: user.id, role: user.role, branchId: user.branchId },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    await prisma.activityLog.create({
      data: { action: "Login", detail: "Login berhasil", userId: user.id },
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, username: user.username, role: user.role, branchId: user.branchId },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { branch: true },
    });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });
    res.json({ id: user.id, name: user.name, username: user.username, role: user.role, branchId: user.branchId, branch: user.branch });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
//  USER ROUTES
// ============================================================

app.get("/api/users", authMiddleware, requireRole("OWNER", "ADMIN"), async (req: AuthRequest, res) => {
  try {
    const where: any = {};
    if (req.user!.role !== "OWNER") where.branchId = req.user!.branchId;
    const users = await prisma.user.findMany({ where, include: { branch: true }, orderBy: { createdAt: "desc" } });
    res.json(users.map((u) => ({ ...u, password: undefined })));
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/users", authMiddleware, requireRole("OWNER", "ADMIN"), async (req, res) => {
  try {
    const { name, username, password, role, branchId } = req.body;
    const hashed = await bcrypt.hash(password || "password", 10);
    const user = await prisma.user.create({
      data: { name, username, password: hashed, role, branchId },
    });
    res.json({ ...user, password: undefined });
  } catch (error: any) {
    if (error.code === "P2002") return res.status(400).json({ error: "Username sudah dipakai" });
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/users/:id", authMiddleware, requireRole("OWNER", "ADMIN"), async (req, res) => {
  try {
    const { name, role, branchId, password, isActive } = req.body;
    const data: any = { name, role, branchId, isActive };
    if (password) data.password = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({ where: { id: req.params.id }, data });
    res.json({ ...user, password: undefined });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/users/:id", authMiddleware, requireRole("OWNER"), async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User dihapus" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
//  CATEGORY ROUTES
// ============================================================

app.get("/api/categories", authMiddleware, async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({ include: { _count: { select: { menus: true } } } });
    res.json(categories);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/categories", authMiddleware, requireRole("OWNER", "ADMIN"), async (req, res) => {
  try {
    const category = await prisma.category.create({ data: req.body });
    res.json(category);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
//  MENU ROUTES
// ============================================================

app.get("/api/menus", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const where: any = {};
    if (req.query.categoryId) where.categoryId = req.query.categoryId;
    if (req.query.branchId) where.branchId = req.query.branchId;
    const menus = await prisma.menu.findMany({ where, include: { category: true } });
    res.json(menus);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/menus", authMiddleware, requireRole("OWNER", "ADMIN"), upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, categoryId, branchId, isAvailable } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;
    const menu = await prisma.menu.create({
      data: { name, description, price: parseInt(price), categoryId, branchId, image, isAvailable: isAvailable !== "false" },
    });
    res.json(menu);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/menus/:id", authMiddleware, requireRole("OWNER", "ADMIN"), upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, categoryId, isAvailable } = req.body;
    const data: any = { name, description, price: parseInt(price), categoryId, isAvailable: isAvailable !== "false" };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const menu = await prisma.menu.update({ where: { id: req.params.id }, data });
    res.json(menu);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/menus/:id", authMiddleware, requireRole("OWNER", "ADMIN"), async (req, res) => {
  try {
    await prisma.menu.delete({ where: { id: req.params.id } });
    res.json({ message: "Menu dihapus" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
//  TABLE ROUTES
// ============================================================

app.get("/api/tables", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const where: any = {};
    if (req.query.branchId) where.branchId = req.query.branchId;
    const tables = await prisma.table.findMany({ where, orderBy: { number: "asc" } });
    res.json(tables);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/tables", authMiddleware, requireRole("OWNER", "ADMIN"), async (req, res) => {
  try {
    const table = await prisma.table.create({ data: req.body });
    res.json(table);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/tables/:id", authMiddleware, async (req, res) => {
  try {
    const table = await prisma.table.update({ where: { id: req.params.id }, data: req.body });
    res.json(table);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/tables/:id", authMiddleware, requireRole("OWNER", "ADMIN"), async (req, res) => {
  try {
    await prisma.table.delete({ where: { id: req.params.id } });
    res.json({ message: "Meja dihapus" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
//  ORDER ROUTES
// ============================================================

app.get("/api/orders", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const where: any = {};
    if (req.query.branchId) where.branchId = req.query.branchId;
    if (req.query.status) where.status = req.query.status;
    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { menu: true } }, table: true, user: true, payment: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders.map((o) => ({ ...o, user: { ...o.user, password: undefined } })));
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/orders", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { tableId, items, customerName, notes, branchId } = req.body;

    orderCounter++;
    const orderCode = `ORD-${String(orderCounter).padStart(3, "0")}`;

    const order = await prisma.order.create({
      data: {
        orderCode,
        userId: req.user!.id,
        tableId,
        branchId: branchId || req.user!.branchId,
        customerName,
        notes,
        items: {
          create: items.map((item: any) => ({
            menuId: item.menuId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.quantity * item.price,
          })),
        },
      },
      include: { items: { include: { menu: true } }, table: true },
    });

    // Update table status after order creation
    if (tableId) {
      await prisma.table.update({ where: { id: tableId }, data: { status: "OCCUPIED" } });
      // Fetch updated table to return in response
      const updatedTable = await prisma.table.findUnique({ where: { id: tableId } });
      if (updatedTable) {
        order.table = updatedTable;
      }
    }

    await prisma.activityLog.create({
      data: { action: "Buat Order", detail: `${order.orderCode} dibuat`, userId: req.user!.id },
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/orders/:id/status", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { items: true, table: true, payment: true },
    });

    if ((status === "CANCELLED") && order.tableId) {
      await prisma.table.update({ where: { id: order.tableId }, data: { status: "AVAILABLE" } });
    }
    // COMPLETED tidak ubah table — tetep OCCUPIED sampe kasir ganti manual

    await prisma.activityLog.create({
      data: { action: `Order ${status}`, detail: `${order.orderCode} → ${status}`, userId: req.user!.id },
    });

    res.json(order);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/orders/:id/items", authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    await prisma.orderItem.deleteMany({ where: { orderId: req.params.id } });
    await prisma.orderItem.createMany({
      data: items.map((item: any) => ({
        orderId: req.params.id,
        menuId: item.menuId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price,
      })),
    });
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { menu: true } }, table: true, payment: true },
    });
    res.json(order);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
//  PAYMENT ROUTES
// ============================================================

app.post("/api/payments", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { orderId, method, receivedAmount } = req.body;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) return res.status(404).json({ error: "Order tidak ditemukan" });

    const total = order.items.reduce((s, i) => s + i.subtotal, 0);
    const change = receivedAmount ? receivedAmount - total : 0;

    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount: total,
        method,
        status: "PAID",
        paidAt: new Date(),
        receivedAmount,
        changeAmount: change > 0 ? change : 0,
      },
    });

    await prisma.order.update({ where: { id: orderId }, data: { status: "COMPLETED" } });

    // Table tidak diubah — tetep OCCUPIED sampe kasir ganti manual

    await prisma.activityLog.create({
      data: { action: "Pembayaran", detail: `${order.orderCode} - ${method} - Rp ${total}`, userId: req.user!.id },
    });

    res.json(payment);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/payments", authMiddleware, async (_req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { order: { include: { items: { include: { menu: true } }, table: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(payments);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
//  BRANCH ROUTES
// ============================================================

app.get("/api/branches", authMiddleware, async (_req, res) => {
  try {
    const branches = await prisma.branch.findMany({ orderBy: { createdAt: "desc" } });
    res.json(branches);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/branches", authMiddleware, requireRole("OWNER"), async (req, res) => {
  try {
    const branch = await prisma.branch.create({ data: req.body });
    res.json(branch);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/branches/:id", authMiddleware, requireRole("OWNER"), async (req, res) => {
  try {
    const branch = await prisma.branch.update({ where: { id: req.params.id }, data: req.body });
    res.json(branch);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
//  INVENTORY ROUTES
// ============================================================

app.get("/api/inventory", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const where: any = {};
    if (req.query.branchId) where.branchId = req.query.branchId;
    const items = await prisma.inventoryItem.findMany({ where, orderBy: { name: "asc" } });
    res.json(items);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/inventory", authMiddleware, requireRole("OWNER", "ADMIN"), async (req, res) => {
  try {
    const item = await prisma.inventoryItem.create({ data: req.body });
    res.json(item);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/inventory/:id", authMiddleware, requireRole("OWNER", "ADMIN"), async (req, res) => {
  try {
    const item = await prisma.inventoryItem.update({ where: { id: req.params.id }, data: req.body });
    res.json(item);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/inventory/:id", authMiddleware, requireRole("OWNER", "ADMIN"), async (req, res) => {
  try {
    await prisma.inventoryItem.delete({ where: { id: req.params.id } });
    res.json({ message: "Stok dihapus" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
//  ACTIVITY LOG ROUTES
// ============================================================

app.get("/api/activities", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const where: any = {};
    if (req.query.branchId) where.user = { branchId: req.query.branchId };
    const logs = await prisma.activityLog.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json(logs.map((l) => ({ ...l, user: { ...l.user, password: undefined } })));
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
//  SEED DATA
// ============================================================

app.post("/api/seed", async (_req, res) => {
  try {
    // Seed branches
    const branches = await Promise.all([
      prisma.branch.upsert({ where: { id: "br1" }, update: {}, create: { id: "br1", name: "Warkop Pusat", address: "Jl. Merdeka No. 10, Jakarta", phone: "081234567890" } }),
      prisma.branch.upsert({ where: { id: "br2" }, update: {}, create: { id: "br2", name: "Warkop Cabang 2", address: "Jl. Sudirman No. 25, Jakarta", phone: "081234567891" } }),
    ]);

    // Seed users
    const hashed = await bcrypt.hash("password", 10);
    await Promise.all([
      prisma.user.upsert({ where: { username: "budi" }, update: {}, create: { name: "Budi Santoso", username: "budi", password: hashed, role: "OWNER", branchId: "br1" } }),
      prisma.user.upsert({ where: { username: "dewi" }, update: {}, create: { name: "Dewi Lestari", username: "dewi", password: hashed, role: "ADMIN", branchId: "br1" } }),
      prisma.user.upsert({ where: { username: "rizki" }, update: {}, create: { name: "Rizki Pratama", username: "rizki", password: hashed, role: "KASIR", branchId: "br1" } }),
    ]);

    // Seed categories
    const cats = await Promise.all([
      prisma.category.upsert({ where: { name: "Kopi" }, update: {}, create: { name: "Kopi", description: "Minuman kopi" } }),
      prisma.category.upsert({ where: { name: "Non-Kopi" }, update: {}, create: { name: "Non-Kopi", description: "Minuman non-kopi" } }),
      prisma.category.upsert({ where: { name: "Makanan Berat" }, update: {}, create: { name: "Makanan Berat", description: "Nasi & mie" } }),
      prisma.category.upsert({ where: { name: "Snack" }, update: {}, create: { name: "Snack", description: "Camilan ringan" } }),
    ]);

    // Seed tables
    for (let i = 1; i <= 8; i++) {
      await prisma.table.upsert({ where: { number_branchId: { number: i, branchId: "br1" } }, update: {}, create: { number: i, name: `Meja ${i}`, branchId: "br1" } });
    }
    await prisma.table.upsert({ where: { number_branchId: { number: 9, branchId: "br1" } }, update: {}, create: { number: 9, name: "Counter", branchId: "br1" } });

    // Seed menus
    const catMap: Record<string, string> = {};
    for (const cat of cats) {
      catMap[cat.name] = cat.id;
    }

    const menuData = [
      { name: "Kopi Susu", description: "Kopi robusta + susu segar", price: 18000, categoryId: catMap["Kopi"], branchId: "br1" },
      { name: "Americano", description: "Espresso + air panas", price: 15000, categoryId: catMap["Kopi"], branchId: "br1" },
      { name: "Cappuccino", description: "Espresso + susu + foam", price: 22000, categoryId: catMap["Kopi"], branchId: "br1" },
      { name: "Espresso", description: "Single shot espresso", price: 12000, categoryId: catMap["Kopi"], branchId: "br1" },
      { name: "Kopi Gula Aren", description: "Kopi + gula aren asli", price: 20000, categoryId: catMap["Kopi"], branchId: "br1" },
      { name: "Matcha Latte", description: "Matcha premium + susu", price: 22000, categoryId: catMap["Non-Kopi"], branchId: "br1" },
      { name: "Teh Tarik", description: "Teh + susu kental manis", price: 12000, categoryId: catMap["Non-Kopi"], branchId: "br1" },
      { name: "Lemon Tea", description: "Teh + lemon segar", price: 15000, categoryId: catMap["Non-Kopi"], branchId: "br1" },
      { name: "Nasi Goreng Spesial", description: "Nasi goreng + telur + ayam", price: 25000, categoryId: catMap["Makanan Berat"], branchId: "br1" },
      { name: "Mie Goreng", description: "Mie goreng + telur + sayur", price: 22000, categoryId: catMap["Makanan Berat"], branchId: "br1" },
      { name: "Nasi Ayam Geprek", description: "Nasi + ayam geprek + sambal", price: 28000, categoryId: catMap["Makanan Berat"], branchId: "br1" },
      { name: "Roti Bakar", description: "Roti bakar coklat/keju", price: 15000, categoryId: catMap["Snack"], branchId: "br1" },
      { name: "Pisang Goreng", description: "Pisang goreng crispy (4 pcs)", price: 12000, categoryId: catMap["Snack"], branchId: "br1" },
      { name: "Kentang Goreng", description: "French fries + saus", price: 18000, categoryId: catMap["Snack"], branchId: "br1" },
      { name: "Cireng Bumbu Rujak", description: "Cireng crispy + bumbu rujak", price: 10000, categoryId: catMap["Snack"], branchId: "br1" },
    ];

    for (const menu of menuData) {
      await prisma.menu.upsert({
        where: { id: `seed-${menu.name.toLowerCase().replace(/\s+/g, "-")}` },
        update: {},
        create: { id: `seed-${menu.name.toLowerCase().replace(/\s+/g, "-")}`, ...menu },
      });
    }

    // Seed inventory
    const inventoryData = [
      { name: "Kopi Robusta", unit: "kg", quantity: 15, minStock: 5, price: 80000, branchId: "br1" },
      { name: "Susu Segar", unit: "liter", quantity: 20, minStock: 10, price: 18000, branchId: "br1" },
      { name: "Gula Aren", unit: "kg", quantity: 8, minStock: 3, price: 45000, branchId: "br1" },
      { name: "Teh Celup", unit: "box", quantity: 25, minStock: 10, price: 15000, branchId: "br1" },
      { name: "Matcha Powder", unit: "kg", quantity: 2, minStock: 2, price: 120000, branchId: "br1" },
      { name: "Nasi", unit: "kg", quantity: 30, minStock: 15, price: 12000, branchId: "br1" },
      { name: "Ayam Fillet", unit: "kg", quantity: 10, minStock: 5, price: 55000, branchId: "br1" },
    ];

    for (const inv of inventoryData) {
      await prisma.inventoryItem.upsert({
        where: { id: `seed-${inv.name.toLowerCase().replace(/\s+/g, "-")}` },
        update: {},
        create: { id: `seed-${inv.name.toLowerCase().replace(/\s+/g, "-")}`, ...inv },
      });
    }

    res.json({ message: "Seed data berhasil", branches: branches.length, menus: menuData.length, inventory: inventoryData.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Seed error" });
  }
});

// ============================================================
//  START
// ============================================================

initOrderCounter().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});