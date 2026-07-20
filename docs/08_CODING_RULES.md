# 08_CODING_RULES.md

# Smart Warkop POS Coding Rules

Version: 1.0.0

---

# General Rules

- Gunakan TypeScript Strict Mode.
- Tidak boleh menggunakan any.
- Tidak boleh menggunakan console.log pada production.
- Tidak boleh menggunakan hardcode.
- Semua konfigurasi menggunakan Environment Variable.
- Semua kode wajib mengikuti Clean Architecture.
- Semua fitur harus reusable.
- Semua fungsi harus memiliki satu tanggung jawab (Single Responsibility).

---

# Clean Code

Wajib mengikuti:

- SOLID
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- YAGNI (You Aren't Gonna Need It)
- Separation of Concerns

---

# Naming Convention

## Variable

Gunakan camelCase.

Contoh
customerName
grandTotal
paymentStatus

---

## Function

Gunakan camelCase.
createSale()

calculateTotal()

verifyPayment()

generateInvoice()

---

## Component

Gunakan PascalCase.
DashboardCard

SaleTable

CheckoutModal

MenuCard

---

## File

Gunakan kebab-case.
checkout-modal.tsx

sale-table.tsx

dashboard-card.tsx

---

## Folder

Gunakan lowercase.
sales

payments

dashboard

---

# Import Rules

Urutan import.
1. React

2. Third Party

3. Internal Package

4. Components

5. Hooks

6. Utils

7. Types

8. Styles

---

# Component Rules

- Maksimal 300 baris per file.
- Pisahkan logic dari UI.
- Jangan membuat komponen yang terlalu besar.
- Gunakan reusable component.
- Hindari prop drilling.

---

# Hooks Rules

Gunakan Custom Hook untuk:

- API
- State
- Form
- Filter
- Pagination

Contoh
useDashboard()

useSale()

useExpense()

usePayment()

---

# API Rules

- Gunakan REST API.
- Selalu gunakan DTO.
- Validasi menggunakan Zod atau class-validator.
- Gunakan HTTP Status yang benar.
- Jangan mengembalikan stack trace ke frontend.

---

# Response Format

Success
{
  "success": true,
  "message": "Success",
  "data": {}
}

Error
{
  "success": false,
  "message": "Validation Error",
  "errors": []
}

---

# Database Rules

- Gunakan Prisma ORM.
- Selalu gunakan Transaction untuk proses penting.
- Jangan gunakan Raw SQL kecuali benar-benar diperlukan.
- Selalu gunakan Index.
- Gunakan UUID sebagai Primary Key.
- Terapkan Soft Delete.

---

# Security Rules

- Password wajib di-hash menggunakan bcrypt.
- JWT wajib memiliki expiration.
- Semua endpoint menggunakan RBAC.
- Validasi semua input.
- Gunakan Rate Limiter.
- Gunakan Helmet.
- Gunakan CORS.
- Jangan pernah menyimpan password dalam bentuk plain text.

---

# Authentication Rules

- Access Token menggunakan JWT.
- Refresh Token disimpan dengan aman.
- Logout menghapus session aktif.
- Password minimal 8 karakter.

---

# Validation Rules

Semua request wajib divalidasi.

Contoh:

- Required
- Email
- Phone Number
- UUID
- Enum
- Decimal
- Integer
- String Length

---

# Error Handling

Gunakan Global Exception Filter.

Jangan gunakan try-catch berulang jika dapat ditangani secara global.

Semua error dicatat ke Audit Log.

---

# Logging Rules

Catat aktivitas berikut:

- Login
- Logout
- Sale
- Payment
- Expense
- Export
- Setting
- Error

---

# Git Rules

Branch:
main

develop

feature/*

fix/*

hotfix/*

Commit Message:
feat:

fix:

refactor:

docs:

style:

test:

chore:

---

# UI Rules

- Gunakan shadcn/ui.
- Gunakan Tailwind CSS.
- Gunakan Framer Motion untuk animasi ringan.
- Semua halaman harus responsive.
- Gunakan Skeleton Loading.
- Gunakan Toast Notification.
- Gunakan Dialog untuk konfirmasi.

---

# State Management

Gunakan:

- Zustand untuk Global State.
- TanStack Query untuk Server State.
- React Hook Form untuk Form.

---

# Performance Rules

- Lazy Loading.
- Code Splitting.
- Memoization jika diperlukan.
- Debounce pada Search.
- Pagination untuk data besar.
- Virtualization jika data sangat banyak.

---

# File Upload Rules

- Validasi tipe file.
- Validasi ukuran file.
- Rename file menggunakan UUID.
- Simpan path di database.
- Jangan simpan file di database.

---

# Payment Rules

- Status pembayaran hanya berasal dari webhook backend.
- Frontend tidak boleh mengubah status pembayaran.
- Verifikasi signature webhook.