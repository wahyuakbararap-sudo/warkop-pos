import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../database/prisma";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// ============================================================
//  REGISTER
// ============================================================

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi",
      });
      return;
    }

    const exists = await prisma.user.findUnique({ where: { email } });

    if (exists) {
      res.status(409).json({
        success: false,
        message: "Email sudah terdaftar",
      });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role || "KASIR",
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "USER_REGISTER",
        detail: `User ${user.name} (${user.email}) terdaftar sebagai ${user.role}`,
        userId: user.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Gagal registrasi",
    });
  }
});

// ============================================================
//  LOGIN
// ============================================================

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "Akun sudah dinonaktifkan",
      });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    await prisma.activityLog.create({
      data: {
        action: "USER_LOGIN",
        detail: `User ${user.name} (${user.email}) login`,
        userId: user.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Gagal login",
    });
  }
});

// ============================================================
//  LOGOUT — catat activity, client hapus token
// ============================================================

router.post("/logout", authenticate, async (req: Request, res: Response) => {
  try {
    await prisma.activityLog.create({
      data: {
        action: "USER_LOGOUT",
        detail: `User ID ${req.user!.id} logout`,
        userId: req.user!.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Logout berhasil, hapus token di client",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Gagal logout",
    });
  }
});

// ============================================================
//  GET CURRENT USER
// ============================================================

router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data user",
    });
  }
});

// ============================================================
//  CHANGE PASSWORD
// ============================================================

router.put("/change-password", authenticate, async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Password lama dan baru wajib diisi",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    const valid = await bcrypt.compare(oldPassword, user!.password);

    if (!valid) {
      res.status(401).json({
        success: false,
        message: "Password lama salah",
      });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { password: hashed },
    });

    await prisma.activityLog.create({
      data: {
        action: "PASSWORD_CHANGE",
        detail: `User ${user!.name} mengganti password`,
        userId: req.user!.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password berhasil diganti",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Gagal mengganti password",
    });
  }
});

export default router;