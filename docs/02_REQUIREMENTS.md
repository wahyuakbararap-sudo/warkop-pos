# 02_REQUIREMENTS.md

# Smart Warkop POS Requirements

Version: 1.0.0

---

# Functional Requirements

## Authentication

### Login

- Admin dapat login.
- Cashier dapat login.
- JWT Authentication.
- Session Management.
- Remember Login.
- Logout.

---

## Dashboard

Admin dapat melihat:

- Omzet Hari Ini
- Profit Hari Ini
- Total Sales
- Total Expense
- Total Order
- Pending Order
- Recent Sales
- Top Selling Menu
- Sales Chart
- Active Cashier

Realtime.

---

## Merchant

Merchant memiliki:

- Nama Toko
- Logo
- Nomor HP
- Email
- Alamat
- Jam Operasional
- Timezone
- Mata Uang

---

## Cashier Management

Admin dapat:

- Tambah Kasir
- Edit Kasir
- Nonaktifkan Kasir
- Reset Password
- Hapus Kasir

Maksimal 3 Admin.

Jumlah Kasir tidak dibatasi.

---

## Category

Admin dapat:

- Tambah
- Edit
- Hapus
- Ubah Urutan

---

## Menu

Admin dapat:

- Tambah Menu
- Edit Menu
- Hapus Menu
- Upload Foto
- Ubah Harga
- Sold Out
- Active / Inactive
- Badge
- Best Seller
- Promo

---

## Table

Admin dapat:

- Tambah Meja
- Edit Meja
- Hapus Meja
- Generate QR
- Download QR
- Print QR

Status:

- Available
- Occupied
- Disabled

---

## POS

Kasir dapat:

- Pilih Meja
- Input Nama Customer
- Tambah Menu
- Edit Qty
- Hapus Item
- Catatan Pesanan
- Checkout

Total dihitung otomatis.

---

## QR Order

Customer:

- Scan QR
- Lihat Menu
- Cari Menu
- Tambah Keranjang
- Edit Qty
- Checkout
- Bayar
- Lihat Status

---

## Payment

Support:

- Cash
- QRIS Manual
- Pakasir Payment Gateway

Gateway:

- QRIS
- DANA
- GoPay
- OVO
- ShopeePay
- Virtual Account

Webhook wajib digunakan.

---

## Sale

Data Sale:

- Invoice
- Cashier
- Customer
- Table
- Item
- Qty
- Price
- Total
- Status

Status:

- Waiting Payment
- Paid
- Waiting
- Processing
- Ready
- Completed
- Cancelled

---

## Order Queue

Kasir dapat melihat:

- Waiting
- Processing
- Ready

Admin dapat mengubah status.

---

## Expense

Admin dapat:

- Tambah
- Edit
- Hapus

Kategori:

- Bahan
- Gaji
- Listrik
- Air
- Internet
- Operasional
- Lainnya

---

## Report

Laporan:

- Harian
- Mingguan
- Bulanan
- Custom

Menampilkan:

- Omzet
- Profit
- Expense
- Jumlah Sale
- Menu Terlaris

---

## Export

Export:

- CSV
- Excel

Support:

- Sales
- Expense
- Report

---

## Notification

Notifikasi:

- Order Baru
- Payment Success
- Payment Failed
- Menu Sold Out
- Shift Closed

---

## Audit Log

Catat:

- Login
- Logout
- Tambah Menu
- Edit Menu
- Hapus Menu
- Checkout
- Payment
- Expense
- Export
- Setting

---

## Setting

Merchant dapat mengatur:

- Nama
- Logo
- Alamat
- Nomor HP
- Payment
- Printer
- Theme
- Pajak
- Service Charge

---

# Non Functional Requirements

## Performance

- Response API <300ms
- Search <100ms
- Dashboard Realtime
- Pagination
- Lazy Loading

---

## Security

- JWT
- RBAC
- bcrypt
- Helmet
- CORS
- Rate Limit
- Input Validation
- Audit Log

---

## Scalability

Support:

- Multi Merchant
- Multi Admin
- Unlimited Cashier
- Unlimited Menu
- Unlimited Table
- Unlimited Sales

---

## Availability

Target Uptime:

99.9%

---

## Compatibility

Desktop

Tablet

Mobile

Chrome

Safari

Edge

Firefox

---

## Backup

- Daily Backup
- Weekly Backup
- Restore

---

## Maintainability

- Clean Architecture
- SOLID
- DRY
- Modular
- TypeScript Strict Mode

---

## Future Features

- Kitchen Display
- Inventory
- Stock Management
- Supplier
- Purchase Order
- Membership
- Loyalty Point
- Voucher
- Promo
- Multi Branch
- AI Analytics
- Mobile App
- WhatsApp Notification

---

# Acceptance Criteria

- Kasir dapat menyelesaikan transaksi <30 detik.
- Customer dapat memesan hanya dengan scan QR.
- Dashboard menampilkan data realtime.
- Semua pembayaran online tervalidasi webhook.
- Semua laporan akurat.
- Tidak ada kebocoran data antar merchant.
- Sistem siap digunakan sebagai SaaS production.