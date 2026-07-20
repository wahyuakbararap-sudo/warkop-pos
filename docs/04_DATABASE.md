# 04_DATABASE.md

# Smart Warkop POS Database Design

Version: 1.0.0

---

# Database

Engine

- PostgreSQL

ORM

- Prisma ORM

Primary Key

- UUID

Timezone

- Asia/Jakarta

Soft Delete

- Enabled

Transaction

- Enabled

---

# Database Principles

- Multi Tenant
- ACID Transaction
- Foreign Key
- Soft Delete
- UUID
- Indexing
- Audit Logging
- Row Isolation
- Secure by Default

---

# ENUM

## UserRole

- OWNER
- ADMIN
- CASHIER

---

## SaleStatus

- WAITING_PAYMENT
- PAID
- WAITING
- PROCESSING
- READY
- COMPLETED
- CANCELLED

---

## PaymentStatus

- PENDING
- PAID
- FAILED
- EXPIRED
- CANCELLED
- REFUNDED

---

## PaymentMethod

- CASH
- QRIS
- DANA
- GOPAY
- OVO
- SHOPEEPAY
- BANK_TRANSFER

---

## MenuStatus

- ACTIVE
- INACTIVE
- SOLD_OUT

---

## TableStatus

- AVAILABLE
- OCCUPIED
- DISABLED

---

# TABLES

## merchants

| Field | Type |
|--------|------|
| id | UUID |
| name | String |
| slug | String |
| logo | String |
| phone | String |
| email | String |
| address | Text |
| timezone | String |
| currency | String |
| createdAt | DateTime |
| updatedAt | DateTime |

---

## users

| Field | Type |
|--------|------|
| id | UUID |
| merchantId | UUID |
| fullName | String |
| username | String |
| password | String |
| role | Enum |
| isActive | Boolean |
| lastLogin | DateTime |
| createdAt | DateTime |
| updatedAt | DateTime |

---

## categories

| Field | Type |
|--------|------|
| id | UUID |
| merchantId | UUID |
| name | String |
| sortOrder | Int |
| createdAt | DateTime |

---

## menus

| Field | Type |
|--------|------|
| id | UUID |
| merchantId | UUID |
| categoryId | UUID |
| name | String |
| description | Text |
| image | String |
| price | Decimal |
| status | Enum |
| badge | String |
| createdAt | DateTime |

---

## tables

| Field | Type |
|--------|------|
| id | UUID |
| merchantId | UUID |
| number | String |
| qrCode | String |
| status | Enum |

---

## sales

| Field | Type |
|--------|------|
| id | UUID |
| merchantId | UUID |
| invoice | String |
| cashierId | UUID |
| tableId | UUID |
| customerName | String |
| paymentMethod | Enum |
| paymentStatus | Enum |
| saleStatus | Enum |
| subtotal | Decimal |
| discount | Decimal |
| tax | Decimal |
| serviceCharge | Decimal |
| grandTotal | Decimal |
| notes | Text |
| createdAt | DateTime |

---

## sale_items

| Field | Type |
|--------|------|
| id | UUID |
| saleId | UUID |
| menuId | UUID |
| menuName | String |
| qty | Integer |
| price | Decimal |
| subtotal | Decimal |
| note | Text |

---

## payments

| Field | Type |
|--------|------|
| id | UUID |
| saleId | UUID |
| invoice | String |
| gateway | String |
| method | Enum |
| status | Enum |
| amount | Decimal |
| reference | String |
| paidAt | DateTime |
| expiredAt | DateTime |
| rawResponse | JSON |

---

## expenses

| Field | Type |
|--------|------|
| id | UUID |
| merchantId | UUID |
| title | String |
| category | String |
| amount | Decimal |
| description | Text |
| expenseDate | Date |

---

## notifications

| Field | Type |
|--------|------|
| id | UUID |
| merchantId | UUID |
| title | String |
| message | Text |
| type | String |
| isRead | Boolean |

---

## audit_logs

| Field | Type |
|--------|------|
| id | UUID |
| merchantId | UUID |
| userId | UUID |
| action | String |
| module | String |
| entityId | UUID |
| ipAddress | String |
| userAgent | String |
| createdAt | DateTime |

---

## settings

| Field | Type |
|--------|------|
| id | UUID |
| merchantId | UUID |
| storeName | String |
| logo | String |
| phone | String |
| address | Text |
| timezone | String |
| currency | String |
| tax | Decimal |
| serviceCharge | Decimal |

---

## login_sessions

| Field | Type |
|--------|------|
| id | UUID |
| userId | UUID |
| refreshToken | String |
| ipAddress | String |
| device | String |
| expiredAt | DateTime |

---

# Relationships

Merchant

├── Users

├── Categories

├── Menus

├── Tables

├── Sales

├── Expenses

├── Notifications

├── AuditLogs

└── Settings

Category

└── Menus

Table

└── Sales

User

└── Sales

Sale

├── SaleItems
└── Payments


---

# Indexes

Create Index

- merchantId
- invoice
- username
- categoryId
- tableId
- cashierId
- paymentStatus
- saleStatus
- createdAt
- expenseDate

---

# Unique Constraint

Merchant.slug

User.username + merchantId

Table.number + merchantId

Sale.invoice

Category.name + merchantId

---

# Foreign Key

users.merchantId → merchants.id

categories.merchantId → merchants.id

menus.categoryId → categories.id

menus.merchantId → merchants.id

tables.merchantId → merchants.id

sales.merchantId → merchants.id

sales.cashierId → users.id

sales.tableId → tables.id

sale_items.saleId → sales.id

sale_items.menuId → menus.id

payments.saleId → sales.id

expenses.merchantId → merchants.id

notifications.merchantId → merchants.id

audit_logs.userId → users.id

settings.merchantId → merchants.id

login_sessions.userId → users.id

---

# Soft Delete

Menggunakan deletedAt pada:

- Users
- Categories
- Menus
- Tables
- Sales
- Expenses

Data tidak boleh dihapus permanen.

---

# Multi Tenant

Semua query wajib menggunakan merchantId.

Contoh

WHERE merchantId = session.merchantId

Tidak boleh ada query lintas Merchant.

---

# Transaction

Gunakan Prisma Transaction pada:

- Checkout
- Payment
- Add Order
- Cancel Sale
- Expense
- Close Shift

---

# Backup Strategy

- Daily Backup
- Weekly Backup
- Monthly Backup

Restore harus dapat dilakukan tanpa kehilangan integritas data.

---

# Performance

- UUID Primary Key
- Database Index
- Pagination
- Cursor Pagination
- Query Optimization
- Lazy Loading
- Connection Pooling

---

# Security

- Password Hashing
- JWT
- RBAC
- Audit Log
- SQL Injection Protection
- XSS Protection
- Rate Limiting

---

# Future Tables

- branches
- inventories
- inventory_logs
- suppliers
- purchases
- purchase_items
- vouchers
- promotions
- memberships
- loyalty_points
- kitchen_displays
- printers
- shift_reports
- stock_movements
- webhook_logs

---

# Database Goals

- Production Ready
- Multi Tenant
- Highly Scalable
- High Performance
- Maintainable
- Secure
- Easy Migration
- SaaS Ready
- Millions of Transactions Support