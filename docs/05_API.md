# 05_API.md

# Smart Warkop POS API Documentation

Version: 1.0.0

---

# Base URL

/api/v1

---

# Authentication

POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
GET    /auth/me
PATCH  /auth/change-password

---

# Dashboard

GET    /dashboard/overview
GET    /dashboard/chart
GET    /dashboard/top-menu
GET    /dashboard/recent-sales

---

# Merchant

GET    /merchant/profile
PATCH  /merchant/profile

GET    /merchant/settings
PATCH  /merchant/settings

---

# Cashier

GET    /cashier
GET    /cashier/:id

POST   /cashier

PATCH  /cashier/:id

DELETE /cashier/:id

PATCH  /cashier/:id/status

PATCH  /cashier/:id/reset-password

---

# Category

GET    /categories

GET    /categories/:id

POST   /categories

PATCH  /categories/:id

DELETE /categories/:id

PATCH  /categories/:id/sort

---

# Menu

GET    /menus

GET    /menus/:id

POST   /menus

PATCH  /menus/:id

DELETE /menus/:id

PATCH  /menus/:id/status

PATCH  /menus/:id/badge

PATCH  /menus/:id/sold-out

POST   /menus/import

GET    /menus/export

---

# Table

GET    /tables

GET    /tables/:id

POST   /tables

PATCH  /tables/:id

DELETE /tables/:id

PATCH  /tables/:id/status

POST   /tables/:id/generate-qr

GET    /tables/:id/download-qr

---

# QR Order

GET    /qr/:tableCode

POST   /qr/cart

PATCH  /qr/cart

DELETE /qr/cart/item

POST   /qr/checkout

GET    /qr/status/:invoice

---

# Sale

GET    /sales

GET    /sales/:id

POST   /sales

PATCH  /sales/:id

PATCH  /sales/:id/status

POST   /sales/:id/add-item

DELETE /sales/:id/item/:itemId

POST   /sales/:id/cancel

POST   /sales/:id/reorder

GET    /sales/history

---

# Payment

POST   /payment/create

GET    /payment/:invoice

POST   /payment/webhook

POST   /payment/retry

GET    /payment/status/:invoice

---

# Expense

GET    /expenses

GET    /expenses/:id

POST   /expenses

PATCH  /expenses/:id

DELETE /expenses/:id

---

# Report

GET    /reports/daily

GET    /reports/weekly

GET    /reports/monthly

GET    /reports/custom

GET    /reports/profit

GET    /reports/export/csv

GET    /reports/export/excel

---

# Notification

GET    /notifications

PATCH  /notifications/:id/read

PATCH  /notifications/read-all

DELETE /notifications/:id

---

# Audit Log

GET    /audit-logs

GET    /audit-logs/:id

---

# Upload

POST   /upload/image

DELETE /upload/image

---

# Health

GET    /health

GET    /ping

---

# Security

- JWT Authentication
- RBAC
- Rate Limiter
- Helmet
- CORS
- Input Validation
- DTO Validation
- Zod Validation
- Prisma Transaction
- Audit Log

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

# HTTP Status

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

500 Internal Server Error

---

# API Rules

- Semua endpoint menggunakan JSON
- Semua endpoint menggunakan Versioning
- Semua endpoint Admin wajib JWT
- Semua endpoint wajib memvalidasi merchantId
- Gunakan Soft Delete
- Gunakan Pagination
- Gunakan Search
- Gunakan Sorting
- Gunakan Filtering
- Semua perubahan dicatat ke Audit Log