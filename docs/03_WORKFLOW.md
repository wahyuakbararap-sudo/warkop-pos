# 03_WORKFLOW.md

# Smart Warkop POS Workflow

Version: 1.0.0

---

# System Workflow
Owner/Admin
      │
      ▼
 Login
      │
      ▼
 Dashboard
      │
      ├──────────────┐
      │              │
      ▼              ▼
 Management      POS Kasir
      │              │
      ▼              ▼
 Database      Transaction
      │              │
      └──────┬───────┘
             ▼
        Dashboard Update

---

# Login Workflow
User

↓

Input Username

↓

Input Password

↓

Validate

↓

JWT Generate

↓

Load Permission

↓

Dashboard

---

# Merchant Setup Workflow
Owner Login

↓

Setup Merchant

↓

Tambah Admin

↓

Tambah Kasir

↓

Tambah Kategori

↓

Tambah Menu

↓

Tambah Meja

↓

Generate QR

↓

Siap Digunakan

---

# Manual POS Workflow
Customer Datang

↓

Kasir Login

↓

Pilih Meja

↓

Input Nama Customer

↓

Tambah Menu

↓

Tambah Catatan (Opsional)

↓

Checkout

↓

Pilih Pembayaran

↓

Cash / QRIS Manual

↓

Payment Success

↓

Sale Created

↓

Order Queue

↓

Processing

↓

Ready

↓

Completed

---

# QR Order Workflow
Customer

↓

Scan QR

↓

Website Customer

↓

Lihat Menu

↓

Tambah Keranjang

↓

Checkout

↓

Create Invoice

↓

Payment Gateway Pakasir

↓

Webhook

↓

Payment Success

↓

Sale Created

↓

Order Queue

↓

Processing

↓

Ready

↓

Completed

---

# Payment Workflow
Checkout

↓

Invoice

↓

Gateway

↓

Customer Bayar

↓

Webhook

↓

Verify Signature

↓

Verify Amount

↓

Update Payment

↓

Update Sale

↓

Create Notification

↓

Dashboard Update

---

# Dashboard Workflow
Sale

↓

Database

↓

Analytics

↓

Dashboard

↓

Realtime Update

---

# Expense Workflow
Admin

↓

Tambah Expense

↓

Save

↓

Database

↓

Profit Recalculate

↓

Dashboard Update

---

# Menu Workflow
Admin

↓

Tambah Menu

↓

Upload Foto

↓

Publish

↓

POS

↓

QR Customer

---

# Table Workflow
Admin

↓

Tambah Meja

↓

Generate QR

↓

Download QR

↓

Print QR

↓

Tempel di Meja

---

# Order Queue Workflow
Order Baru

↓

Waiting

↓

Processing

↓

Ready

↓

Completed

Jika dibatalkan
Waiting

↓

Cancelled

---

# Add Order Workflow
Customer

↓

Tambah Pesanan

↓

Kasir

↓

Tambah Item

↓

Update Total

↓

Queue Update

---

# Export Workflow
Admin

↓

Pilih Data

↓

Pilih Periode

↓

Generate

↓

CSV / Excel

↓

Download

---

# Report Workflow
Sale

+

Expense

↓

Calculation

↓

Profit

↓

Dashboard

↓

Export

---

# Notification Workflow
Payment Success

↓

Notification

↓

Kasir

↓

Order Baru

---

# Authentication Workflow
Request

↓

JWT

↓

Middleware

↓

Role Check

↓

Merchant Check

↓

Endpoint

---

# Multi Tenant Workflow
Request

↓

JWT

↓

Merchant ID

↓

Filter Data

↓

Response

Tidak boleh ada akses lintas Merchant.

---

# Audit Workflow

Semua aktivitas dicatat.

- Login
- Logout
- Tambah Menu
- Edit Menu
- Hapus Menu
- Tambah Expense
- Checkout
- Payment
- Cancel
- Export
- Setting

↓

Audit Log

---

# Daily Closing Workflow
Kasir

↓

Close Shift

↓

Hitung Total Cash

↓

Verifikasi

↓

Simpan

↓

Dashboard Update

---

# Error Workflow
Request

↓

Validation

↓

Success

atau

↓

Error

↓

Audit Log

---

# Backup Workflow
Scheduler

↓

Backup Database

↓

Compress

↓

Cloud Storage

↓

Success Notification

---

# Future Workflow

- Kitchen Display System
- Thermal Printer
- Inventory
- Purchase Order
- Supplier
- Loyalty Point
- Membership
- Voucher
- Promo
- Multi Branch
- Mobile App
- AI Analytics

---

# Workflow Principles

- Semua transaksi berasal dari Sale.
- Semua pembayaran diverifikasi oleh Backend.
- Semua laporan berasal dari Sale dan Expense.
- Semua data dipisahkan menggunakan merchantId.
- Semua perubahan dicatat pada Audit Log.
- Dashboard selalu menggunakan data realtime.
- Customer dapat memesan melalui QR atau Kasir.
- Admin memiliki akses penuh.
- Cashier hanya mengakses operasional harian.
- Sistem harus tetap konsisten meskipun terjadi retry, refresh, atau webhook ganda.