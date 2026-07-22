import { Router, Request, Response } from "express";
import { authenticate, authorize, can } from "../middlewares/auth.middleware";
import prisma from "../database/prisma";

const router = Router();

// ============================================================
//  SEMUA ROLE BISA AKSES
// ============================================================

router.get(
  "/dashboard",
  authenticate,
  async (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Selamat datang di dashboard",
    });
  }
);

// ============================================================
//  HANYA OWNER & ADMIN
// ============================================================

router.get(
  "/users",
  authenticate,
  authorize("OWNER", "ADMIN"),
  async (_req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });

      res.json({ success: true, data: users });
    } catch {
      res.status(500).json({ success: false, message: "Gagal mengambil data" });
    }
  }
);

// ============================================================
//  HANYA OWNER
// ============================================================

router.get(
  "/activity-logs",
  authenticate,
  authorize("OWNER"),
  async (_req: Request, res: Response) => {
    try {
      const logs = await prisma.activityLog.findMany({
        include: {
          user: { select: { name: true, email: true, role: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      res.json({ success: true, data: logs });
    } catch {
      res.status(500).json({ success: false, message: "Gagal mengambil data" });
    }
  }
);

// ============================================================
//  CONTOH PAKAI can() — granular permission
// ============================================================

router.post(
  "/menu",
  authenticate,
  can("menu.create"),
  async (req: Request, res: Response) => {
    try {
      const { name, price, categoryId, description } = req.body;

      const menu = await prisma.menu.create({
        data: { name, price, categoryId, description },
      });

      await prisma.activityLog.create({
        data: {
          action: "MENU_CREATE",
          detail: `Menu "${name}" ditambahkan`,
          userId: req.user!.id,
        },
      });

      res.status(201).json({ success: true, data: menu });
    } catch {
      res.status(500).json({ success: false, message: "Gagal membuat menu" });
    }
  }
);

export default router;