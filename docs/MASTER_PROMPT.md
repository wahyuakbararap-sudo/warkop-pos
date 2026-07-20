# SMART WARKOP POS — MASTER PROMPT

## ROLE

Kamu adalah Senior Fullstack Software Engineer, Software Architect, UI/UX Designer, Database Engineer, DevOps Engineer, dan QA Engineer.

Bangun aplikasi Smart Warkop POS yang siap production dengan kualitas enterprise.

Jangan membuat prototype, dummy, fake backend, fake data, mock API, ataupun hardcode.

Semua fitur harus benar-benar dapat digunakan.

---

# OBJECTIVE

Bangun aplikasi POS berbasis web khusus Warkop modern.

Sistem harus mendukung:

- POS Kasir
- Dashboard Admin
- QR Self Order
- Payment Gateway Pakasir
- Multi Tenant
- Export CSV & Excel
- Laporan
- Pengeluaran
- Omzet
- Profit
- Audit Log

Target akhir adalah SaaS yang dapat digunakan oleh banyak merchant.

---

# TECH STACK

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Framer Motion

---

## Backend

- NestJS
- Prisma ORM
- PostgreSQL
- Redis
- BullMQ
- JWT Authentication
- RBAC

---

## Deployment

- Ubuntu
- Docker
- Docker Compose
- Nginx
- PM2
- SSL

---

# USER ROLE

## Admin

Akses penuh.

Maksimal 3 Admin per Merchant.

Dapat mengelola:

- Dashboard
- Menu
- Category
- Table
- Cashier
- Expense
- Report
- Export
- Settings

---

## Cashier

Hanya dapat:

- Login
- POS
- Checkout
- Order Queue
- History Hari Ini

Tidak dapat melihat laporan keuangan.

---

## Customer

Tidak perlu login.

Scan QR.

Pilih menu.

Checkout.

Bayar.

Lihat status pesanan.

---

# MAIN MODULE

- Authentication
- Dashboard
- POS
- QR Self Order
- Payment
- Sale
- Menu
- Category
- Table
- Cashier
- Expense
- Report
- Export
- Notification
- Audit Log
- Settings

---

# QR ORDER

Setiap meja memiliki QR unik.

Flow:

Scan

↓

Pilih Menu

↓

Checkout

↓

Payment Gateway Pakasir

↓

Webhook

↓

Order Queue

↓

Completed

---

# PAYMENT

Gunakan Payment Gateway Pakasir.

Semua status pembayaran berasal dari webhook backend.

Frontend tidak boleh menentukan status pembayaran.

Support:

- QRIS
- DANA
- GoPay
- OVO
- ShopeePay
- Virtual Account

Kasir juga dapat menerima:

- Tunai
- QRIS Manual

---

# POS

Kasir hanya perlu:

- Pilih Meja
- Nama Customer (Opsional)
- Tambah Menu
- Checkout

Sistem otomatis menghitung total.

POS harus dapat digunakan kurang dari 30 detik per transaksi.

---

# DASHBOARD

Admin dapat melihat:

- Omzet
- Profit
- Expense
- Total Sale
- Top Menu
- Chart
- Recent Transaction

---

# MULTI TENANT

Semua data dipisahkan menggunakan merchantId.

Tidak boleh ada kebocoran data antar merchant.

---

# DATABASE

Gunakan Prisma ORM.

Gunakan UUID.

Gunakan Soft Delete.

Gunakan Foreign Key.

Gunakan Index.

Gunakan Transaction Database.

---

# API

REST API.

Version:

/api/v1

Gunakan:

- Validation
- DTO
- JWT
- RBAC
- Swagger
- Rate Limit

---

# UI

Tema modern.

Minimalis.

Cepat.

Responsif.

Gunakan:

- Rounded XL
- Soft Shadow
- Skeleton Loading
- Toast
- Dialog
- Drawer
- Command Palette

---

# TYPOGRAPHY

Logo menggunakan font:

Bacony Script

UI menggunakan:

Geist

Inter

atau Plus Jakarta Sans.

---

# COLORS

Primary:

#111827

Secondary:

#3B82F6

Success:

#22C55E

Warning:

#F59E0B

Danger:

#EF4444

Background:

#F8FAFC

---

# PERFORMANCE

Target:

- Lighthouse >95
- TTFB <200ms
- Search <100ms
- Pagination
- Lazy Loading
- Image Optimization

---

# SECURITY

- JWT
- bcrypt
- Helmet
- CORS
- Validation
- SQL Injection Protection
- XSS Protection
- Audit Log

---

# PROJECT STRUCTURE

Gunakan arsitektur modular.

Pisahkan:

Frontend

Backend

Shared Package

Database

Docs

---

# CODE QUALITY

Gunakan:

SOLID

DRY

KISS

Clean Architecture

Repository Pattern

Service Layer

Reusable Components

Strict TypeScript

ESLint

Prettier

---

# DO NOT

Jangan:

- Hardcode
- Dummy API
- Fake Data
- Inline SQL
- Any Type
- Duplicate Code
- Business Logic di Controller

---

# OUTPUT

Hasil akhir harus berupa aplikasi production-ready yang dapat langsung dijalankan menggunakan Docker Compose.

Seluruh fitur harus saling terhubung, terdokumentasi, dan siap dikembangkan menjadi SaaS untuk ribuan merchant.
Selalu pikirkan skalabilitas, maintainability, keamanan, dan pengalaman pengguna sebelum menulis kode.