# SPEC_LOCK.md

# Smart Warkop POS Specification Lock

Version: 1.0.0

Status: 🔒 LOCKED

Last Updated: 2026-07-20

---

# Purpose

Dokumen ini merupakan pengunci (Specification Lock) seluruh project Smart Warkop POS.

Mulai saat dokumen ini dibuat, seluruh spesifikasi dianggap FINAL.

AI tidak diperbolehkan mengubah requirement tanpa instruksi eksplisit dari Owner Project.

Dokumen ini menjadi **Single Source of Truth** untuk seluruh proses development.

---

# Project Status

Status

```
LOCKED
```

Phase

```
Development Ready
```

---

# AI Instructions

AI wajib:

- Membaca seluruh folder `/docs`.
- Memahami semua requirement sebelum membuat kode.
- Mengikuti seluruh dokumen tanpa pengecualian.
- Bertanya jika menemukan requirement yang ambigu.
- Menjaga kompatibilitas dengan fitur yang sudah ada.
- Mengutamakan maintainability, security, dan scalability.

---

# AI Forbidden

AI DILARANG:

- Menambah fitur baru.
- Menghapus fitur yang sudah ditentukan.
- Mengubah workflow.
- Mengubah role permission.
- Mengubah struktur database.
- Mengubah endpoint API.
- Mengubah folder structure.
- Mengubah business logic.
- Mengubah payment flow.
- Mengubah multi tenant architecture.
- Mengubah branding.
- Mengubah stack teknologi.
- Mengganti library utama.
- Mengubah UX flow.
- Mengubah naming convention.
- Mengubah coding standard.
- Menghapus audit log.
- Menghapus validation.
- Mengubah export system.
- Mengubah QR Ordering.
- Mengubah POS Workflow.

Semua perubahan di atas hanya boleh dilakukan jika Owner Project memberikan instruksi secara langsung.

---

# AI Allowed

AI hanya diperbolehkan:

- Memperbaiki bug.
- Memperbaiki typo.
- Refactoring tanpa mengubah behavior.
- Meningkatkan performa.
- Meningkatkan keamanan.
- Menambahkan komentar kode.
- Menambahkan unit test.
- Menambahkan integration test.
- Menambahkan E2E test.
- Mengoptimalkan query.
- Mengoptimalkan rendering.
- Mengurangi duplicate code.
- Memperbaiki memory leak.
- Memperbaiki race condition.
- Memperbaiki error handling.
- Memperbaiki logging.

---

# Source Priority

Jika terjadi konflik antar dokumen, gunakan urutan prioritas berikut:

1. SPEC_LOCK.md
2. MASTER_PROMPT.md
3. PROJECT_RULES.md
4. 01_PROJECT_OVERVIEW.md
5. 02_REQUIREMENTS.md
6. 03_WORKFLOW.md
7. 04_DATABASE.md
8. 05_API.md
9. 06_UI_UX.md
10. 07_FOLDER_STRUCTURE.md
11. 08_CODING_RULES.md
12. 09_TODO.md
13. 10_ENVIRONMENT.md
14. 11_DEPLOYMENT.md
15. 12_PAYMENT_GATEWAY.md
16. 13_BRANDING.md

---

# Locked Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- TanStack Query
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

---

## Infrastructure

- Docker
- Docker Compose
- Ubuntu VPS
- Nginx
- PM2

---

## Payment

- Pakasir Payment Gateway
- Cash
- QRIS Manual

---

# Locked Core Features

- Authentication
- Multi Tenant
- Dashboard
- POS Kasir
- QR Self Ordering
- Menu Management
- Category Management
- Table Management
- Cashier Management
- Expense Management
- Sales Management
- Report
- Export CSV
- Export Excel
- Audit Log
- Notification
- Merchant Settings

---

# Locked User Roles

- Owner
- Admin
- Cashier
- Customer

Rule:

- Maksimal 3 Admin per Merchant.
- Unlimited Cashier.
- Customer tidak perlu login.

---

# Locked Development Flow

```
Planning

↓

Documentation

↓

Implementation

↓

Testing

↓

Optimization

↓

Deployment

↓

Production
```

Tidak boleh melompati tahapan.

---

# Code Quality Requirements

Seluruh kode wajib:

- Lulus Build.
- Lulus Lint.
- Lulus Type Check.
- Lulus Test.
- Menggunakan TypeScript Strict Mode.
- Tidak menggunakan `any`.
- Tidak memiliki hardcoded secret.
- Mengikuti Clean Architecture.
- Mengikuti SOLID.
- Mengikuti DRY.
- Mengikuti KISS.
- Mengikuti Repository Pattern.
- Mengikuti Service Layer Pattern.

---

# Performance Requirements

Target minimum:

- API Response < 300ms
- Search < 100ms
- Checkout < 30 detik
- Dashboard Realtime
- Lighthouse ≥ 95

---

# Security Requirements

Wajib:

- JWT
- bcrypt
- RBAC
- HTTPS
- Helmet
- CORS
- Rate Limiter
- Audit Log
- Input Validation
- SQL Injection Protection
- XSS Protection

---

# Definition of Done

Sebuah fitur dianggap selesai jika:

- Requirement selesai.
- UI selesai.
- Backend selesai.
- Database selesai.
- API selesai.
- Validation selesai.
- Error Handling selesai.
- Responsive.
- Lulus Testing.
- Lulus Build.
- Lulus Lint.
- Terdokumentasi.

---

# Change Policy

Seluruh perubahan spesifikasi harus dilakukan dengan:

1. Persetujuan Owner Project.
2. Revisi dokumen terkait.
3. Pembaruan versi dokumentasi.
4. Pembaruan SPEC_LOCK.md jika diperlukan.

Tidak diperbolehkan melakukan perubahan langsung pada implementasi tanpa memperbarui dokumentasi.

---

# Final Statement

Mulai saat dokumen ini aktif, Smart Warkop POS memasuki fase **Specification Locked**.

Seluruh AI, developer, dan contributor wajib mengikuti seluruh dokumen di dalam folder `/docs`.

Implementasi harus mengikuti spesifikasi yang telah dikunci, dan tidak boleh menambahkan, mengurangi, atau mengubah fitur di luar instruksi Owner Project.

Status Akhir:

```
🔒 SPECIFICATION LOCKED
READY FOR DEVELOPMENT
PRODUCTION-ORIENTED
SAAS-READY
```