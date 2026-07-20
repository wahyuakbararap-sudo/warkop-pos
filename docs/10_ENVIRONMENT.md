# 10_ENVIRONMENT.md

# Smart Warkop POS Environment Configuration

Version: 1.0.0

---

# Environment Rules

- Jangan pernah hardcode secret.
- Semua konfigurasi menggunakan Environment Variable.
- Pisahkan environment Development, Staging, dan Production.
- Jangan commit file `.env` ke repository.
- Hanya commit `.env.example`.

---

# Environment Files

```
.env
.env.local
.env.development
.env.staging
.env.production
.env.example
```

---

# Backend Environment

## Application

```env
NODE_ENV=development
APP_NAME=Smart Warkop POS
APP_PORT=3001
APP_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
CUSTOMER_URL=http://localhost:3002
```

---

## JWT

```env
JWT_SECRET=
JWT_EXPIRES_IN=1d

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=30d
```

---

## Database

```env
DATABASE_URL=
DATABASE_POOL_SIZE=20
```

---

## Redis

```env
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
REDIS_DB=0
```

---

## Queue

```env
QUEUE_PREFIX=smart-warkop
```

---

## Storage

```env
UPLOAD_DRIVER=local
UPLOAD_MAX_SIZE=5242880
UPLOAD_ALLOWED=image/jpeg,image/png,image/webp
UPLOAD_PATH=uploads
```

---

## Payment Gateway (Pakasir)

```env
PAKASIR_BASE_URL=
PAKASIR_API_KEY=
PAKASIR_MERCHANT_ID=
PAKASIR_WEBHOOK_SECRET=
```

---

## QRIS

```env
QRIS_PROVIDER=pakasir
QRIS_EXPIRED_MINUTES=15
```

---

## Email (Future)

```env
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

---

## WhatsApp (Future)

```env
WHATSAPP_PROVIDER=
WHATSAPP_API_KEY=
```

---

## Security

```env
BCRYPT_ROUNDS=12

RATE_LIMIT_WINDOW=60

RATE_LIMIT_MAX=100

CORS_ORIGIN=http://localhost:3000,http://localhost:3002
```

---

## Logging

```env
LOG_LEVEL=info

LOG_RETENTION_DAYS=30
```

---

## Backup

```env
BACKUP_ENABLED=true

BACKUP_SCHEDULE=0 2 * * *

BACKUP_RETENTION_DAYS=30

BACKUP_PATH=backups
```

---

## Cache

```env
CACHE_ENABLED=true

CACHE_TTL=300
```

---

## Feature Flags

```env
FEATURE_QR_ORDER=true

FEATURE_EXPENSE=true

FEATURE_EXPORT=true

FEATURE_NOTIFICATION=true

FEATURE_MULTI_TENANT=true

FEATURE_DARK_MODE=false
```

---

# Frontend Environment

```env
NEXT_PUBLIC_APP_NAME=Smart Warkop POS

NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

NEXT_PUBLIC_CUSTOMER_URL=http://localhost:3002

NEXT_PUBLIC_QR_ORDER=true
```

---

# Customer App Environment

```env
NEXT_PUBLIC_STORE_NAME=Smart Warkop POS

NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

NEXT_PUBLIC_PAYMENT_PROVIDER=pakasir
```

---

# Production Requirements

- Semua secret minimal 32 karakter.
- JWT Secret harus berbeda dengan Refresh Secret.
- Database wajib menggunakan SSL jika didukung.
- Redis tidak boleh terbuka ke publik.
- API hanya menerima request melalui HTTPS.
- Gunakan reverse proxy (Nginx).

---

# Git Rules

File yang boleh di-commit:

```
.env.example
```

File yang tidak boleh di-commit:

```
.env

.env.local

.env.production

.env.development

.env.staging
```

Tambahkan ke `.gitignore`.

---

# Validation Rules

Saat aplikasi dijalankan:

- Validasi seluruh environment.
- Jika ada variable wajib yang kosong, aplikasi gagal startup.
- Tampilkan pesan error yang jelas.
- Jangan menjalankan aplikasi dengan konfigurasi tidak lengkap.

---

# Environment Categories

| Category | Required |
|----------|----------|
| Application | ✅ |
| JWT | ✅ |
| Database | ✅ |
| Redis | ✅ |
| Payment | ✅ |
| Storage | ✅ |
| Security | ✅ |
| Cache | Optional |
| Email | Future |
| WhatsApp | Future |

---

# Environment Goals

- Aman untuk Production.
- Mudah dipindahkan antar server.
- Mendukung Development, Staging, dan Production.
- Tidak ada konfigurasi yang di-hardcode.
- Semua secret tersimpan di environment variable.