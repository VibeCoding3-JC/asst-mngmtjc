# 📚 API Documentation - IT Asset Management System

**Base URL:** `http://localhost:5000/api` (Development) | `https://api.yourdomain.com/api` (Production)

**Version:** 1.0.0

---

## 📋 Table of Contents

1. [Authentication](#1-authentication)
2. [Users](#2-users)
3. [Assets](#3-assets)
4. [Categories](#4-categories)
5. [Locations](#5-locations)
6. [Transactions](#6-transactions)
7. [Dashboard](#7-dashboard)
8. [Error Codes](#8-error-codes)

---

## 🔐 Authentication Overview

Semua endpoint (kecuali login) memerlukan JWT token di header:

```
Authorization: Bearer <access_token>
```

**Token Types:**
- **Access Token**: Berlaku 15 menit, digunakan untuk setiap request
- **Refresh Token**: Berlaku 1 hari, disimpan di HTTP-only cookie

---

## 1. Authentication

### 1.1 Login

Autentikasi user dan mendapatkan token.

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@company.com",
  "password": "admin123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Administrator",
      "email": "admin@company.com",
      "role": "admin",
      "department": "IT"
    }
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Email atau password salah",
  "code": "INVALID_CREDENTIALS"
}
```

---

### 1.2 Register (Admin Only)

Mendaftarkan user baru. Hanya admin yang bisa register user.

```
POST /auth/register
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "staff",
  "department": "Finance",
  "phone": "08123456789"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "User berhasil didaftarkan",
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440001",
    "name": "John Doe",
    "email": "john@company.com",
    "role": "staff"
  }
}
```

---

### 1.3 Logout

Menghapus refresh token dan cookie.

```
DELETE /auth/logout
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Logout berhasil",
  "data": null
}
```

---

### 1.4 Refresh Token

Mendapatkan access token baru menggunakan refresh token.

```
GET /auth/token
```
**Note:** Refresh token dikirim otomatis via HTTP-only cookie.

**Response Success (200):**
```json
{
  "success": true,
  "message": "Token berhasil diperbarui",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.5 Get Current User

Mendapatkan data user yang sedang login.

```
GET /auth/me
```
**Requires:** `Authorization: Bearer <token>`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data user berhasil diambil",
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Administrator",
    "email": "admin@company.com",
    "role": "admin",
    "department": "IT",
    "phone": "08123456789",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 2. Users

### 2.1 Get All Users

Mendapatkan daftar semua user dengan pagination.

```
GET /users
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`, `staff`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Nomor halaman |
| limit | number | 10 | Jumlah data per halaman |
| search | string | "" | Pencarian nama/email |
| role | string | "" | Filter by role (admin/staff/employee) |

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data user berhasil diambil",
  "data": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Administrator",
      "email": "admin@company.com",
      "role": "admin",
      "department": "IT",
      "is_active": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 5,
    "totalPages": 1
  }
}
```

---

### 2.2 Get User by ID

```
GET /users/:id
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`, `staff`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data user berhasil diambil",
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Administrator",
    "email": "admin@company.com",
    "role": "admin",
    "department": "IT",
    "phone": "08123456789",
    "is_active": true
  }
}
```

---

### 2.3 Get User's Assets

Mendapatkan daftar aset yang dipinjam user.

```
GET /users/:id/assets
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`, `staff`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data aset user berhasil diambil",
  "data": [
    {
      "uuid": "asset-uuid-1",
      "asset_code": "LAP-2024-00001",
      "name": "Laptop Dell XPS 15",
      "status": "assigned"
    }
  ]
}
```

---

### 2.4 Create User (Admin Only)

```
POST /users
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "password": "password123",
  "role": "employee",
  "department": "Marketing",
  "phone": "08123456789"
}
```

---

### 2.5 Update User (Admin Only)

```
PUT /users/:id
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`

**Request Body:**
```json
{
  "name": "Jane Doe Updated",
  "department": "Sales",
  "is_active": false
}
```

---

### 2.6 Delete User (Admin Only)

Soft delete - menonaktifkan user.

```
DELETE /users/:id
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`

---

## 3. Assets

### 3.1 Get All Assets

```
GET /assets
```
**Requires:** `Authorization: Bearer <token>`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Nomor halaman |
| limit | number | 10 | Jumlah data per halaman |
| search | string | "" | Pencarian nama/kode/serial |
| category | string | "" | Filter by category UUID |
| location | string | "" | Filter by location UUID |
| status | string | "" | Filter by status |
| holder | string | "" | Filter by holder UUID |

**Status Values:**
- `available` - Tersedia
- `assigned` - Sedang dipinjam
- `repair` - Dalam perbaikan
- `retired` - Sudah dibuang

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data aset berhasil diambil",
  "data": [
    {
      "uuid": "asset-uuid-1",
      "asset_code": "LAP-2024-00001",
      "name": "Laptop Dell XPS 15",
      "serial_number": "DELL123456",
      "brand": "Dell",
      "model": "XPS 15 9520",
      "status": "available",
      "purchase_price": 25000000,
      "category": {
        "uuid": "cat-uuid",
        "name": "Laptop"
      },
      "location": {
        "uuid": "loc-uuid",
        "name": "Kantor Pusat",
        "address": "Jl. Sudirman No. 1"
      },
      "holder": null
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 50,
    "totalPages": 5
  }
}
```

---

### 3.2 Get Asset by ID

```
GET /assets/:id
```
**Requires:** `Authorization: Bearer <token>`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data aset berhasil diambil",
  "data": {
    "uuid": "asset-uuid-1",
    "asset_code": "LAP-2024-00001",
    "name": "Laptop Dell XPS 15",
    "serial_number": "DELL123456",
    "brand": "Dell",
    "model": "XPS 15 9520",
    "specifications": "Intel i7, 16GB RAM, 512GB SSD",
    "status": "available",
    "purchase_date": "2024-01-15",
    "purchase_price": 25000000,
    "vendor": "Dell Indonesia",
    "warranty_end": "2027-01-15",
    "notes": null,
    "current_value": 22500000,
    "category": {
      "uuid": "cat-uuid",
      "name": "Laptop",
      "depreciation_rate": 10
    },
    "location": {
      "uuid": "loc-uuid",
      "name": "Kantor Pusat",
      "building": "Gedung A",
      "floor": "Lantai 5",
      "room_number": "501"
    },
    "holder": null
  }
}
```

---

### 3.3 Get Asset Statistics

```
GET /assets/stats
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`, `staff`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Statistik aset berhasil diambil",
  "data": {
    "total_assets": 150,
    "total_value": 2500000000,
    "by_status": [
      { "status": "available", "count": 80 },
      { "status": "assigned", "count": 50 },
      { "status": "repair", "count": 15 },
      { "status": "retired", "count": 5 }
    ],
    "by_category": [
      { "category.name": "Laptop", "count": 50 },
      { "category.name": "Monitor", "count": 40 },
      { "category.name": "Printer", "count": 30 }
    ]
  }
}
```

---

### 3.4 Get Asset History

Mendapatkan riwayat transaksi aset.

```
GET /assets/:id/history
```
**Requires:** `Authorization: Bearer <token>`

**Response Success (200):**
```json
{
  "success": true,
  "message": "5 riwayat transaksi ditemukan",
  "data": [
    {
      "uuid": "trx-uuid-1",
      "action_type": "checkout",
      "transaction_date": "2024-03-01T10:00:00.000Z",
      "notes": "Expected return: 2024-03-15",
      "employee": {
        "uuid": "user-uuid",
        "name": "John Doe",
        "department": "IT"
      },
      "admin": {
        "uuid": "admin-uuid",
        "name": "Administrator"
      }
    }
  ]
}
```

---

### 3.5 Create Asset

```
POST /assets
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`, `staff`

**Request Body:**
```json
{
  "name": "Laptop Lenovo ThinkPad",
  "category_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "location_uuid": "660e8400-e29b-41d4-a716-446655440000",
  "serial_number": "LEN987654",
  "brand": "Lenovo",
  "model": "ThinkPad X1 Carbon",
  "specifications": "Intel i7, 16GB RAM, 512GB SSD",
  "purchase_date": "2024-03-01",
  "purchase_price": 22000000,
  "vendor": "Lenovo Indonesia",
  "warranty_end": "2027-03-01",
  "notes": "Untuk departemen IT"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Aset berhasil ditambahkan",
  "data": {
    "uuid": "new-asset-uuid",
    "asset_code": "LAP-2024-00002",
    "name": "Laptop Lenovo ThinkPad",
    "status": "available",
    "category": {
      "uuid": "cat-uuid",
      "name": "Laptop"
    },
    "location": {
      "uuid": "loc-uuid",
      "name": "Kantor Pusat",
      "building": "Gedung A"
    }
  }
}
```

---

### 3.6 Update Asset

```
PUT /assets/:id
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`, `staff`

**Request Body:**
```json
{
  "name": "Laptop Lenovo ThinkPad X1 Gen 10",
  "specifications": "Intel i9, 32GB RAM, 1TB SSD",
  "notes": "Upgraded RAM"
}
```

---

### 3.7 Delete Asset (Admin Only)

```
DELETE /assets/:id
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`

**Note:** Aset yang sedang dipinjam tidak bisa dihapus.

---

## 4. Categories

### 4.1 Get All Categories (Paginated)

```
GET /categories
```
**Requires:** `Authorization: Bearer <token>`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Nomor halaman |
| limit | number | 10 | Jumlah per halaman |
| search | string | "" | Pencarian nama |

---

### 4.2 Get All Categories (For Dropdown)

```
GET /categories/all
```
**Requires:** `Authorization: Bearer <token>`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data kategori berhasil diambil",
  "data": [
    {
      "uuid": "cat-uuid-1",
      "name": "Laptop",
      "description": "Komputer portabel",
      "depreciation_rate": 10
    },
    {
      "uuid": "cat-uuid-2",
      "name": "Monitor",
      "description": "Layar komputer",
      "depreciation_rate": 15
    }
  ]
}
```

---

### 4.3 Create Category (Admin Only)

```
POST /categories
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`

**Request Body:**
```json
{
  "name": "Printer",
  "description": "Perangkat cetak",
  "depreciation_rate": 20
}
```

---

### 4.4 Update Category (Admin Only)

```
PUT /categories/:id
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`

---

### 4.5 Delete Category (Admin Only)

```
DELETE /categories/:id
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`

**Note:** Kategori dengan aset tidak bisa dihapus.

---

## 5. Locations

### 5.1 Get All Locations (Paginated)

```
GET /locations
```
**Requires:** `Authorization: Bearer <token>`

---

### 5.2 Get All Locations (For Dropdown)

```
GET /locations/all
```
**Requires:** `Authorization: Bearer <token>`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data lokasi berhasil diambil",
  "data": [
    {
      "uuid": "loc-uuid-1",
      "name": "Kantor Pusat",
      "building": "Gedung A",
      "floor": "Lantai 5",
      "room_number": "501",
      "address": "Jl. Sudirman No. 1"
    }
  ]
}
```

---

### 5.3 Get Location Assets

Mendapatkan daftar aset di lokasi tertentu.

```
GET /locations/:id/assets
```
**Requires:** `Authorization: Bearer <token>`

---

### 5.4 Create Location (Admin Only)

```
POST /locations
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`

**Request Body:**
```json
{
  "name": "Kantor Cabang Jakarta",
  "building": "Gedung B",
  "floor": "Lantai 3",
  "room_number": "301",
  "address": "Jl. Gatot Subroto No. 10",
  "is_active": true
}
```

---

## 6. Transactions

### 6.1 Get All Transactions

```
GET /transactions
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`, `staff`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Nomor halaman |
| limit | number | 10 | Jumlah per halaman |
| type | string | "" | Filter action_type |
| asset | string | "" | Filter by asset UUID |
| startDate | string | "" | Filter from date (YYYY-MM-DD) |
| endDate | string | "" | Filter to date (YYYY-MM-DD) |

**Action Types:**
- `checkout` - Peminjaman aset
- `checkin` - Pengembalian aset
- `transfer` - Pemindahan lokasi
- `repair` - Kirim perbaikan
- `repair_complete` - Selesai perbaikan
- `dispose` - Penghapusan aset

---

### 6.2 Checkout Asset (Pinjam)

Meminjamkan aset ke user.

```
POST /transactions/checkout
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`, `staff`

**Request Body:**
```json
{
  "asset_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "user_uuid": "660e8400-e29b-41d4-a716-446655440000",
  "expected_return_date": "2024-04-01",
  "notes": "Untuk project ABC"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Aset berhasil dipinjamkan",
  "data": {
    "uuid": "trx-uuid",
    "action_type": "checkout",
    "transaction_date": "2024-03-15T10:00:00.000Z",
    "asset": {
      "uuid": "asset-uuid",
      "asset_code": "LAP-2024-00001",
      "name": "Laptop Dell XPS 15"
    },
    "employee": {
      "uuid": "user-uuid",
      "name": "John Doe",
      "department": "IT"
    }
  }
}
```

---

### 6.3 Checkin Asset (Kembalikan)

Mengembalikan aset dari user.

```
POST /transactions/checkin
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`, `staff`

**Request Body:**
```json
{
  "asset_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "location_uuid": "660e8400-e29b-41d4-a716-446655440000",
  "condition_notes": "Baik, tidak ada kerusakan",
  "notes": "Dikembalikan tepat waktu"
}
```

---

### 6.4 Transfer Asset

Memindahkan aset ke lokasi lain.

```
POST /transactions/transfer
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`, `staff`

**Request Body:**
```json
{
  "asset_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "to_location_uuid": "770e8400-e29b-41d4-a716-446655440000",
  "notes": "Dipindahkan ke kantor cabang"
}
```

---

### 6.5 Send for Repair

Mengirim aset untuk perbaikan.

```
POST /transactions/repair
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`, `staff`

**Request Body:**
```json
{
  "asset_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "repair_vendor": "Dell Service Center",
  "estimated_cost": 1500000,
  "estimated_return_date": "2024-04-01",
  "notes": "Keyboard rusak"
}
```

---

### 6.6 Complete Repair

Menyelesaikan perbaikan dan mengembalikan aset.

```
POST /transactions/repair/complete
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`, `staff`

**Request Body:**
```json
{
  "asset_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "location_uuid": "660e8400-e29b-41d4-a716-446655440000",
  "repair_cost": 1200000,
  "notes": "Keyboard sudah diganti"
}
```

---

### 6.7 Dispose Asset (Admin Only)

Menghapuskan/membuang aset.

```
POST /transactions/dispose
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`

**Request Body:**
```json
{
  "asset_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "disposal_reason": "Rusak tidak bisa diperbaiki",
  "disposal_value": 500000,
  "notes": "Dijual ke pihak ketiga"
}
```

---

## 7. Dashboard

### 7.1 Get Dashboard Statistics

```
GET /dashboard
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`, `staff`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data dashboard berhasil diambil",
  "data": {
    "summary": {
      "total_assets": 150,
      "available_assets": 80,
      "assigned_assets": 50,
      "repair_assets": 15,
      "retired_assets": 5,
      "total_value": 2500000000
    },
    "by_category": [
      { "name": "Laptop", "count": 50 },
      { "name": "Monitor", "count": 40 }
    ],
    "by_location": [
      { "name": "Kantor Pusat", "count": 100 },
      { "name": "Kantor Cabang", "count": 50 }
    ],
    "recent_transactions": [
      {
        "uuid": "trx-uuid",
        "action_type": "checkout",
        "transaction_date": "2024-03-15T10:00:00.000Z",
        "asset": { "name": "Laptop Dell XPS 15" },
        "employee": { "name": "John Doe" }
      }
    ]
  }
}
```

---

### 7.2 Get Quick Stats

```
GET /dashboard/quick
```
**Requires:** `Authorization: Bearer <token>` | **Role:** `admin`, `staff`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Quick stats berhasil diambil",
  "data": {
    "total_assets": 150,
    "available_assets": 80,
    "assigned_assets": 50,
    "repair_assets": 15
  }
}
```

---

## 8. Error Codes

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Request tidak valid |
| 401 | Unauthorized - Token tidak valid/expired |
| 403 | Forbidden - Tidak memiliki akses |
| 404 | Not Found - Resource tidak ditemukan |
| 500 | Server Error - Kesalahan server |

### Application Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Email atau password salah |
| `ACCOUNT_DISABLED` | Akun dinonaktifkan |
| `NO_REFRESH_TOKEN` | Refresh token tidak ada |
| `INVALID_REFRESH_TOKEN` | Refresh token tidak valid |
| `TOKEN_EXPIRED` | Access token expired |
| `UNAUTHORIZED` | Tidak memiliki akses |
| `ASSET_NOT_FOUND` | Aset tidak ditemukan |
| `ASSET_NOT_AVAILABLE` | Aset tidak tersedia |
| `ASSET_IN_USE` | Aset sedang digunakan |
| `ASSET_NOT_IN_USE` | Aset tidak sedang dipinjam |
| `ASSET_UNDER_REPAIR` | Aset sedang diperbaiki |
| `USER_NOT_FOUND` | User tidak ditemukan |
| `EMAIL_EXISTS` | Email sudah terdaftar |
| `CATEGORY_NOT_FOUND` | Kategori tidak ditemukan |
| `LOCATION_NOT_FOUND` | Lokasi tidak ditemukan |
| `SERIAL_EXISTS` | Serial number sudah ada |
| `PASSWORD_MISMATCH` | Password tidak cocok |
| `VALIDATION_ERROR` | Data tidak valid |
| `SERVER_ERROR` | Kesalahan server |

---

## 📮 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 100,
    "totalPages": 10
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Pesan error",
  "code": "ERROR_CODE"
}
```

---

## 🧪 Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"admin123"}'
```

### Get Assets with Token
```bash
curl http://localhost:5000/api/assets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Asset
```bash
curl -X POST http://localhost:5000/api/assets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Test",
    "category_uuid": "CATEGORY_UUID",
    "location_uuid": "LOCATION_UUID"
  }'
```

---

## 📝 Postman Collection

Import file `IT-Asset-Management.postman_collection.json` untuk testing lengkap di Postman.

---

**Last Updated:** December 2024
**Version:** 1.0.0
