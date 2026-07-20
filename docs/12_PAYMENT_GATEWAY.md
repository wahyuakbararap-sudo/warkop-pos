# 12_PAYMENT_GATEWAY.md

# Smart Warkop POS Payment Gateway

Version: 1.0.0

Payment Provider: Pakasir

Status: Production Ready

---

# Overview

Smart Warkop POS menggunakan Pakasir sebagai payment gateway utama
untuk menerima pembayaran online dari Customer QR Order.

Kasir juga dapat menerima pembayaran secara manual menggunakan:

- Cash
- QRIS Manual

---

# Supported Payment Methods

## Manual

- Cash
- QRIS Manual

---

## Online (Pakasir)

- QRIS
- DANA
- GoPay
- OVO
- ShopeePay
- Virtual Account

---

# Payment Flow

```
Customer

↓

Checkout

↓

Backend

↓

Pakasir API

↓

Invoice Created

↓

Customer Payment

↓

Webhook

↓

Verify Signature

↓

Update Payment

↓

Update Sale

↓

Notification

↓

Dashboard Update
```

---

# Manual Payment Flow

```
Kasir

↓

Checkout

↓

Cash

atau

QRIS Manual

↓

Payment Success

↓

Sale Completed
```

---

# QR Order Payment Flow

```
Customer

↓

Scan QR Meja

↓

Pilih Menu

↓

Checkout

↓

Create Invoice

↓

Pakasir

↓

Customer Bayar

↓

Webhook

↓

Order Masuk Dashboard
```

---

# API Endpoint

## Create Invoice

```
POST /payment/create
```

---

## Payment Status

```
GET /payment/status/:invoice
```

---

## Webhook

```
POST /payment/webhook
```

---

## Retry Payment

```
POST /payment/retry
```

---

# Invoice

Invoice harus memiliki:

- Invoice Number
- Merchant ID
- Sale ID
- Customer Name
- Table Number
- Payment Method
- Total Amount
- Expired Time
- Status

Invoice Number harus unik.

---

# Payment Status

```
PENDING

PAID

FAILED

EXPIRED

CANCELLED

REFUNDED
```

---

# Sale Status

```
WAITING_PAYMENT

PAID

WAITING

PROCESSING

READY

COMPLETED

CANCELLED
```

---

# Webhook Rules

Webhook adalah satu-satunya sumber kebenaran status pembayaran online.

Frontend tidak boleh mengubah status pembayaran.

Kasir tidak boleh menandai pembayaran online sebagai lunas secara manual.

---

# Webhook Validation

Backend wajib memverifikasi:

- Signature
- Merchant ID
- Invoice Number
- Amount
- Payment Status

Jika salah satu validasi gagal:

- Tolak webhook.
- Simpan log.
- Jangan ubah data transaksi.

---

# Idempotency

Webhook dapat dikirim lebih dari satu kali.

Backend harus:

- Mengecek apakah invoice sudah diproses.
- Mengabaikan webhook duplikat.
- Tidak membuat transaksi ganda.

---

# Payment Expiration

Default:

15 Menit

Jika melewati batas waktu:

```
Payment

↓

Expired

↓

Sale Cancelled

↓

Customer harus checkout ulang
```

---

# Payment Retry

Customer dapat:

- Membuat invoice baru.
- Melanjutkan checkout.

Invoice lama otomatis dianggap tidak berlaku.

---

# Refund

Versi saat ini:

Tidak mendukung refund otomatis.

Jika diperlukan:

- Refund dilakukan manual oleh Owner/Admin.

---

# Notification

Saat pembayaran berhasil:

Kasir menerima:

- Order Baru

Customer melihat:

- Pembayaran Berhasil

Owner melihat:

- Penjualan Baru

---

# Audit Log

Catat:

- Invoice Created
- Payment Success
- Payment Failed
- Payment Expired
- Payment Cancelled
- Retry Payment
- Webhook Received
- Webhook Failed

---

# Database Update

Jika pembayaran berhasil:

Update:

- payments
- sales
- notifications
- audit_logs

Semua dilakukan dalam satu database transaction.

---

# Security

- Gunakan HTTPS.
- Verifikasi signature webhook.
- Jangan percaya data dari frontend.
- Jangan expose API Key.
- Simpan secret di Environment Variable.
- Semua request menggunakan TLS.

---

# Error Handling

Jika API Pakasir gagal:

- Simpan log.
- Tampilkan pesan yang ramah kepada pengguna.
- Jangan membuat data transaksi yang tidak lengkap.

---

# Timeout Rules

Jika request ke gateway timeout:

- Tandai pembayaran sebagai Pending.
- Berikan opsi cek status ulang.
- Jangan langsung menganggap pembayaran gagal.

---

# Reconciliation

Admin dapat melakukan sinkronisasi ulang status pembayaran.

Flow:

```
Admin

↓

Sync Payment

↓

Check Gateway

↓

Update Database
```

---

# Future Payment Features

- Split Bill
- Tips
- Partial Payment
- E-Wallet Lainnya
- Auto Refund
- Multi Gateway
- Subscription Payment

---

# Payment Principles

- Backend adalah sumber kebenaran.
- Webhook menentukan status pembayaran.
- Semua transaksi menggunakan invoice unik.
- Tidak boleh ada transaksi ganda.
- Semua aktivitas pembayaran dicatat ke Audit Log.
- Seluruh perubahan data pembayaran dilakukan secara atomik menggunakan database transaction.
- Sistem harus tetap konsisten meskipun terjadi retry, timeout, atau webhook dikirim berulang.