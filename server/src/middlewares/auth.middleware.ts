import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../database/prisma";

interface JwtPayload {
  id: string;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// ============================================================
//  AUTHENTICATE — cek token valid
// ============================================================

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Token tidak ditemukan",
    });
    return;
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Token tidak valid atau sudah kadaluarsa",
    });
  }
}

// ============================================================
//  AUTHORIZE — cek role
// ============================================================

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Role ${req.user.role} tidak punya akses ke resource ini`,
      });
      return;
    }

    next();
  };
}

// ============================================================
//  PERMISSION MAP — granular per feature
// ============================================================

const permissions: Record<string, string[]> = {
  // User management
  "user.create":  ["OWNER", "ADMIN"],
  "user.read":    ["OWNER", "ADMIN"],
  "user.update":  ["OWNER", "ADMIN"],
  "user.delete":  ["OWNER"],

  // Menu management
  "menu.create":  ["OWNER", "ADMIN"],
  "menu.read":    ["OWNER", "ADMIN", "KASIR"],
  "menu.update":  ["OWNER", "ADMIN"],
  "menu.delete":  ["OWNER", "ADMIN"],

  // Order management
  "order.create":  ["OWNER", "ADMIN", "KASIR"],
  "order.read":    ["OWNER", "ADMIN", "KASIR"],
  "order.update":  ["OWNER", "ADMIN", "KASIR"],
  "order.cancel":  ["OWNER", "ADMIN"],

  // Payment
  "payment.create":  ["OWNER", "ADMIN", "KASIR"],
  "payment.read":    ["OWNER", "ADMIN", "KASIR"],
  "payment.refund":  ["OWNER"],

  // Report
  "report.read":  ["OWNER", "ADMIN"],

  // Activity log
  "activity.read":  ["OWNER"],

  // Settings
  "settings.update":  ["OWNER"],
};

export function can(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const allowed = permissions[permission];

    if (!allowed) {
      res.status(500).json({
        success: false,
        message: `Permission ${permission} tidak terdaftar`,
      });
      return;
    }

    if (!allowed.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Anda tidak punya permission: ${permission}`,
      });
      return;
    }

    next();
  };
}