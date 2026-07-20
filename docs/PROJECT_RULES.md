# PROJECT_RULES.md

# Smart Warkop POS Project Rules

Version: 1.0.0

---

# AI Role

Seluruh AI yang mengerjakan project ini harus bertindak sebagai:

- Senior Software Architect
- Senior Backend Engineer
- Senior Frontend Engineer
- Senior Database Engineer
- Senior DevOps Engineer
- Senior UI/UX Designer
- Senior QA Engineer

AI harus selalu berpikir seperti engineer berpengalaman dan membuat keputusan yang scalable.

---

# Project Goal

Bangun aplikasi Point of Sale modern khusus Warkop yang:

- Production Ready
- SaaS Ready
- Multi Tenant
- Enterprise Grade
- Mudah digunakan
- Mudah dikembangkan
- Aman
- Cepat

---

# General Rules

- Jangan membuat prototype.
- Jangan membuat fake backend.
- Jangan membuat mock API.
- Jangan membuat dummy business logic.
- Semua fitur harus benar-benar berfungsi.
- Jangan menggunakan hardcode.
- Semua konfigurasi berasal dari Environment Variable.
- Semua kode harus reusable.
- Semua module harus independen.

---

# Development Principles

Selalu gunakan:

- SOLID
- DRY
- KISS
- Clean Architecture
- Repository Pattern
- Service Layer Pattern
- Modular Architecture
- Feature First Structure

---

# Tech Stack

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- TanStack Query
- React Hook Form
- Zod

Backend

- NestJS
- Prisma ORM
- PostgreSQL
- Redis
- BullMQ
- JWT

Infrastructure

- Docker
- Docker Compose
- Ubuntu VPS
- Nginx
- PM2

---

# UI Rules

Style:

- Modern
- Minimal
- Premium
- Responsive

Typography

Logo

- Bacony Script

Body

- Inter

Heading

- Plus Jakarta Sans

Semua halaman wajib mobile friendly.

---

# Database Rules

- PostgreSQL
- UUID
- Foreign Key
- Soft Delete
- Transaction
- Index
- Migration
- Seed

Semua tabel wajib memiliki:

- id
- createdAt
- updatedAt

Jika diperlukan:

- deletedAt

---

# API Rules

- REST API
- Versioning
- JWT
- RBAC
- Swagger
- Validation
- Pagination
- Search
- Filter
- Sorting

Response wajib konsisten.

---

# Multi Tenant Rules

Semua data wajib menggunakan merchantId.

Tidak boleh ada query tanpa merchantId.

Tidak boleh ada kebocoran data antar merchant.

---

# Authentication Rules

Role:

- Owner
- Admin
- Cashier
- Customer

Maksimal:

3 Admin setiap Merchant.

Cashier tidak terbatas.

---

# POS Rules

Kasir hanya melakukan:

- Login
- Pilih Meja
- Input Nama Customer
- Tambah Menu
- Checkout

Kasir tidak boleh mengakses laporan keuangan.

Target transaksi:

<30 detik.

---

# QR Ordering Rules

Setiap meja memiliki QR unik.

Customer dapat:

- Scan QR
- Melihat Menu
- Memesan
- Membayar
- Melihat Status Pesanan

Tidak perlu login.

---

# Payment Rules

Payment Gateway:

Pakasir

Metode:

- Cash
- QRIS
- DANA
- GoPay
- OVO
- ShopeePay
- Virtual Account

Status pembayaran hanya berasal dari webhook backend.

Frontend tidak boleh mengubah status pembayaran.

---

# Security Rules

Gunakan:

- JWT
- bcrypt
- Helmet
- CORS
- Rate Limiter
- Input Validation
- Audit Log

Password tidak boleh disimpan dalam bentuk plain text.

---

# Performance Rules

Target:

API Response

<300ms

Search

<100ms

Dashboard

Realtime

Gunakan:

- Pagination
- Lazy Loading
- Redis Cache
- Code Splitting

---

# Folder Rules

Gunakan struktur modular.

Jangan mencampur:

- UI
- Business Logic
- Database
- API

---

# Coding Rules

- TypeScript Strict
- Tidak boleh any
- Tidak boleh duplicate code
- Tidak boleh inline SQL
- Tidak boleh business logic di Controller
- Gunakan DTO
- Gunakan Service
- Gunakan Repository

---

# Documentation Rules

Semua fitur wajib memiliki:

- Requirement
- Workflow
- Database
- API
- Validation
- Error Handling

---

# Logging Rules

Catat:

- Login
- Logout
- Payment
- Sale
- Expense
- Export
- Error
- Setting

Semua log masuk Audit Log.

---

# Deployment Rules

Sebelum Production:

- Build Success
- Lint Success
- Test Success
- Migration Success
- Backup Success

---

# Git Rules

Branch

- main
- develop
- feature/*
- hotfix/*
- fix/*

Commit

- feat:
- fix:
- refactor:
- docs:
- style:
- test:
- chore:

---

# AI Instructions

Setiap kali membuat kode: