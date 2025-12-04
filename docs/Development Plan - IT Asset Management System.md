# 📋 Development Plan - IT Asset Management System

**Versi Dokumen:** 1.1  
**Tanggal:** 4 Desember 2025  
**Status:** IN PROGRESS - Fase 6 (Deployment)
**Repository:** https://github.com/VibeCoding3-JC/asst-mngmtjc

---

## 📌 Ringkasan Proyek

| Item | Detail |
|------|--------|
| **Nama Proyek** | IT Asset Management System (ITAM) |
| **Tech Stack** | Backend: Node.js + Express + Sequelize + MySQL |
| | Frontend: React.js + Tailwind CSS + Axios |
| **Arsitektur** | Three-Tier Monolithic (REST API) |
| **Estimasi Timeline** | 6-8 Minggu (tergantung kompleksitas & resource) |

---

## 📂 Struktur Folder Proyek

```
it-asset-management/
├── backend/
│   ├── config/
│   │   └── Database.js
│   ├── controllers/
│   │   ├── AssetController.js
│   │   ├── AuthController.js
│   │   ├── CategoryController.js
│   │   ├── LocationController.js
│   │   ├── TransactionController.js
│   │   └── UserController.js
│   ├── middleware/
│   │   ├── AuthMiddleware.js
│   │   ├── RoleMiddleware.js
│   │   └── ValidationMiddleware.js
│   ├── models/
│   │   ├── AssetModel.js
│   │   ├── CategoryModel.js
│   │   ├── LocationModel.js
│   │   ├── TransactionModel.js
│   │   ├── UserModel.js
│   │   └── index.js
│   ├── routes/
│   │   ├── AssetRoutes.js
│   │   ├── AuthRoutes.js
│   │   ├── CategoryRoutes.js
│   │   ├── LocationRoutes.js
│   │   ├── TransactionRoutes.js
│   │   └── UserRoutes.js
│   ├── utils/
│   │   ├── ResponseFormatter.js
│   │   └── Validators.js
│   ├── .env
│   ├── .env.example
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   └── Loader.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   └── forms/
│   │   │       ├── AssetForm.jsx
│   │   │       ├── UserForm.jsx
│   │   │       └── TransactionForm.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useFetch.js
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   └── Login.jsx
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── assets/
│   │   │   │   ├── AssetList.jsx
│   │   │   │   ├── AssetDetail.jsx
│   │   │   │   ├── AddAsset.jsx
│   │   │   │   └── EditAsset.jsx
│   │   │   ├── users/
│   │   │   │   ├── UserList.jsx
│   │   │   │   ├── AddUser.jsx
│   │   │   │   └── EditUser.jsx
│   │   │   ├── transactions/
│   │   │   │   ├── TransactionList.jsx
│   │   │   │   ├── Checkout.jsx
│   │   │   │   └── Checkin.jsx
│   │   │   ├── categories/
│   │   │   │   └── CategoryList.jsx
│   │   │   ├── locations/
│   │   │   │   └── LocationList.jsx
│   │   │   └── reports/
│   │   │       └── Reports.jsx
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── database/
│   ├── migrations/
│   └── seeders/
│
├── docs/
│   └── api-documentation.md
│
└── README.md
```

---

# 🎯 FASE 1: SETUP & FOUNDATION (Minggu 1)

## 1.1 Backend - Project Setup

### Checklist Tasks:

- [x] **1.1.1** Inisialisasi proyek Node.js dengan `npm init`
- [x] **1.1.2** Install dependencies utama:
  - [x] express
  - [x] sequelize
  - [x] mysql2
  - [x] dotenv
  - [x] cors
  - [x] cookie-parser
  - [x] jsonwebtoken
  - [x] argon2 (untuk password hashing)
  - [x] joi (untuk validasi)
  - [x] uuid
- [x] **1.1.3** Install dev dependencies:
  - [x] nodemon
  - [ ] eslint (opsional)
- [x] **1.1.4** Setup file `.env` dan `.env.example`
- [x] **1.1.5** Konfigurasi `package.json` scripts (start, dev)
- [x] **1.1.6** Setup entry point `index.js` dengan Express dasar
- [x] **1.1.7** Konfigurasi CORS dan middleware dasar
- [x] **1.1.8** Test server running di port 5000

### Deliverables:
- Server Express berjalan
- Environment variables terkonfigurasi
- CORS aktif

---

## 1.2 Backend - Database Configuration

### Checklist Tasks:

- [x] **1.2.1** Setup MySQL database (buat database baru)
- [x] **1.2.2** Buat file `config/Database.js` dengan Sequelize
- [x] **1.2.3** Test koneksi database berhasil
- [x] **1.2.4** Setup connection pooling

### Environment Variables yang diperlukan:
```
DB_HOST=localhost
DB_NAME=it_asset_management
DB_USER=root
DB_PASS=your_password
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
```

---

## 1.3 Frontend - Project Setup

### Checklist Tasks:

- [x] **1.3.1** Inisialisasi proyek React dengan Vite (`npm create vite@latest`)
- [x] **1.3.2** Install dependencies utama:
  - [x] react-router-dom
  - [x] axios
  - [x] tailwindcss
  - [x] postcss
  - [x] autoprefixer
  - [x] @heroicons/react (icons)
  - [x] react-hot-toast (notifications)
  - [x] date-fns (date formatting)
- [x] **1.3.3** Setup Tailwind CSS (`npx tailwindcss init -p`)
- [x] **1.3.4** Konfigurasi `tailwind.config.js`
- [x] **1.3.5** Setup `index.css` dengan Tailwind directives
- [x] **1.3.6** Setup file `.env` untuk API URL
- [x] **1.3.7** Buat struktur folder sesuai rencana
- [x] **1.3.8** Test aplikasi React berjalan di browser

### Deliverables:
- Aplikasi React dengan Vite berjalan
- Tailwind CSS aktif
- Struktur folder siap

---

# 🎯 FASE 2: DATABASE MODELS & MIGRATIONS (Minggu 1-2)

## 2.1 Model Users

### Checklist Tasks:

- [x] **2.1.1** Buat file `models/UserModel.js`
- [x] **2.1.2** Definisikan schema:
  - [x] id (INT, PK, Auto Increment)
  - [x] uuid (VARCHAR(36), Unique, Not Null)
  - [x] name (VARCHAR(100), Not Null)
  - [x] email (VARCHAR(100), Unique, Not Null)
  - [x] password (VARCHAR(255), Nullable)
  - [x] role (ENUM: 'admin', 'staff', 'employee')
  - [x] department (VARCHAR(100), Nullable)
  - [x] phone (VARCHAR(20), Nullable)
  - [x] is_active (BOOLEAN, Default true)
  - [x] refresh_token (TEXT, Nullable)
  - [x] created_at (DATETIME)
  - [x] updated_at (DATETIME)
- [x] **2.1.3** Setup validasi field
- [x] **2.1.4** Test sync model ke database

---

## 2.2 Model Categories

### Checklist Tasks:

- [x] **2.2.1** Buat file `models/CategoryModel.js`
- [x] **2.2.2** Definisikan schema:
  - [x] id (INT, PK, Auto Increment)
  - [x] uuid (VARCHAR(36), Unique, Not Null)
  - [x] name (VARCHAR(100), Unique, Not Null)
  - [x] description (TEXT, Nullable)
  - [x] created_at (DATETIME)
  - [x] updated_at (DATETIME)
- [x] **2.2.3** Setup validasi field
- [x] **2.2.4** Test sync model ke database

---

## 2.3 Model Locations

### Checklist Tasks:

- [x] **2.3.1** Buat file `models/LocationModel.js`
- [x] **2.3.2** Definisikan schema:
  - [x] id (INT, PK, Auto Increment)
  - [x] uuid (VARCHAR(36), Unique, Not Null)
  - [x] name (VARCHAR(150), Not Null)
  - [x] building (VARCHAR(100), Nullable)
  - [x] floor (VARCHAR(20), Nullable)
  - [x] room_number (VARCHAR(50), Nullable)
  - [x] description (TEXT, Nullable)
  - [x] created_at (DATETIME)
  - [x] updated_at (DATETIME)
- [x] **2.3.3** Setup validasi field
- [x] **2.3.4** Test sync model ke database

---

## 2.4 Model Assets

### Checklist Tasks:

- [x] **2.4.1** Buat file `models/AssetModel.js`
- [x] **2.4.2** Definisikan schema:
  - [x] id (INT, PK, Auto Increment)
  - [x] uuid (VARCHAR(36), Unique, Not Null)
  - [x] asset_code (VARCHAR(50), Unique, Not Null) - Auto generated
  - [x] name (VARCHAR(150), Not Null)
  - [x] serial_number (VARCHAR(100), Unique, Nullable)
  - [x] brand (VARCHAR(100), Nullable)
  - [x] model (VARCHAR(100), Nullable)
  - [x] category_id (INT, FK -> categories)
  - [x] location_id (INT, FK -> locations)
  - [x] current_holder_id (INT, FK -> users, Nullable)
  - [x] status (ENUM: 'available', 'in_use', 'under_repair', 'disposed')
  - [x] purchase_date (DATE, Nullable)
  - [x] purchase_price (DECIMAL(15,2), Nullable)
  - [x] vendor (VARCHAR(150), Nullable)
  - [x] warranty_end (DATE, Nullable)
  - [x] specifications (TEXT, Nullable)
  - [x] notes (TEXT, Nullable)
  - [x] created_at (DATETIME)
  - [x] updated_at (DATETIME)
- [x] **2.4.3** Setup validasi field (termasuk unique constraints)
- [x] **2.4.4** Setup index pada serial_number, asset_code, name
- [x] **2.4.5** Test sync model ke database

---

## 2.5 Model Transactions

### Checklist Tasks:

- [x] **2.5.1** Buat file `models/TransactionModel.js`
- [x] **2.5.2** Definisikan schema:
  - [x] id (INT, PK, Auto Increment)
  - [x] uuid (VARCHAR(36), Unique, Not Null)
  - [x] asset_id (INT, FK -> assets)
  - [x] type (ENUM: 'checkout', 'checkin', 'transfer', 'repair', 'repair_complete', 'disposal')
  - [x] from_user_id (INT, FK -> users, Nullable)
  - [x] to_user_id (INT, FK -> users, Nullable)
  - [x] from_location_id (INT, FK -> locations, Nullable)
  - [x] to_location_id (INT, FK -> locations, Nullable)
  - [x] performed_by_id (INT, FK -> users) - Admin/Staff yang memproses
  - [x] transaction_date (DATETIME, Not Null)
  - [x] expected_return_date (DATE, Nullable)
  - [x] notes (TEXT, Nullable)
  - [x] created_at (DATETIME)
  - [x] updated_at (DATETIME)
- [x] **2.5.3** Setup validasi field
- [x] **2.5.4** Test sync model ke database

---

## 2.6 Model Associations (Relasi)

### Checklist Tasks:

- [x] **2.6.1** Buat file `models/index.js` untuk mengatur relasi
- [x] **2.6.2** Setup relasi:
  - [x] Category hasMany Assets
  - [x] Asset belongsTo Category
  - [x] Location hasMany Assets
  - [x] Asset belongsTo Location
  - [x] User hasMany Assets (as holder)
  - [x] Asset belongsTo User (as holder)
  - [x] Asset hasMany Transactions
  - [x] Transaction belongsTo Asset
  - [x] Transaction belongsTo User (as fromUser)
  - [x] Transaction belongsTo User (as toUser)
  - [x] Transaction belongsTo User (as performedBy)
  - [x] Transaction belongsTo Location (as fromLocation)
  - [x] Transaction belongsTo Location (as toLocation)
- [x] **2.6.3** Test eager loading bekerja
- [x] **2.6.4** Sync semua model ke database

---

## 2.7 Database Seeder

### Checklist Tasks:

- [x] **2.7.1** Buat seeder untuk data Admin default (admin@company.com / admin123)
- [x] **2.7.2** Buat seeder untuk Categories default:
  - [x] Laptop
  - [x] Desktop/PC
  - [x] Monitor
  - [x] Server
  - [x] Network Device
  - [x] Printer
  - [x] Accessories
- [x] **2.7.3** Buat seeder untuk Locations default
- [x] **2.7.4** Buat seeder untuk dummy assets (sample data)

---

# 🎯 FASE 3: BACKEND API DEVELOPMENT (Minggu 2-3)

## 3.1 Authentication Module

### 3.1.1 Auth Controller

#### Checklist Tasks:

- [x] **3.1.1.1** Buat file `controllers/AuthController.js`
- [x] **3.1.1.2** Implementasi fungsi `register`:
  - [x] Validasi input
  - [x] Hash password dengan Argon2
  - [x] Simpan user ke database
  - [x] Return success response
- [x] **3.1.1.3** Implementasi fungsi `login`:
  - [x] Validasi email & password
  - [x] Verifikasi password dengan Argon2
  - [x] Generate Access Token (15 menit)
  - [x] Generate Refresh Token (1 hari)
  - [x] Simpan Refresh Token ke database
  - [x] Set Refresh Token di HttpOnly Cookie
  - [x] Return Access Token & user data
- [x] **3.1.1.4** Implementasi fungsi `logout`:
  - [x] Hapus Refresh Token dari database
  - [x] Clear cookie
- [x] **3.1.1.5** Implementasi fungsi `refreshToken`:
  - [x] Validasi Refresh Token dari cookie
  - [x] Verifikasi token di database
  - [x] Generate Access Token baru
  - [x] Return Access Token baru
- [x] **3.1.1.6** Implementasi fungsi `getMe`:
  - [x] Return data user yang sedang login

### 3.1.2 Auth Middleware

#### Checklist Tasks:

- [x] **3.1.2.1** Buat file `middleware/AuthMiddleware.js`
- [x] **3.1.2.2** Implementasi `verifyToken`:
  - [x] Extract token dari Authorization header
  - [x] Verify JWT token
  - [x] Attach user data ke request
- [x] **3.1.2.3** Implementasi `checkRole`:
  - [x] Validasi role user terhadap required roles
  - [x] Return 403 jika tidak authorized

### 3.1.3 Auth Routes

#### Checklist Tasks:

- [x] **3.1.3.1** Buat file `routes/AuthRoutes.js`
- [x] **3.1.3.2** Setup routes:
  - [x] POST `/api/auth/register` (Admin only)
  - [x] POST `/api/auth/login`
  - [x] DELETE `/api/auth/logout`
  - [x] GET `/api/auth/token`
  - [x] GET `/api/auth/me`

---

## 3.2 User Management Module

### 3.2.1 User Controller

#### Checklist Tasks:

- [x] **3.2.1.1** Buat file `controllers/UserController.js`
- [x] **3.2.1.2** Implementasi fungsi `getUsers`:
  - [x] Pagination
  - [x] Search by name/email
  - [x] Filter by role, department
- [x] **3.2.1.3** Implementasi fungsi `getUserById`
- [x] **3.2.1.4** Implementasi fungsi `createUser`:
  - [x] Untuk menambah employee (non-login user)
- [x] **3.2.1.5** Implementasi fungsi `updateUser`
- [x] **3.2.1.6** Implementasi fungsi `deleteUser`:
  - [x] Soft delete (set is_active = false)
- [x] **3.2.1.7** Implementasi fungsi `getUserAssets`:
  - [x] Get semua aset yang dipegang user

### 3.2.2 User Routes

#### Checklist Tasks:

- [x] **3.2.2.1** Buat file `routes/UserRoutes.js`
- [x] **3.2.2.2** Setup routes:
  - [x] GET `/api/users` (Admin, Staff)
  - [x] GET `/api/users/:id` (Admin, Staff)
  - [x] POST `/api/users` (Admin)
  - [x] PUT `/api/users/:id` (Admin)
  - [x] DELETE `/api/users/:id` (Admin)
  - [x] GET `/api/users/:id/assets` (Admin, Staff)

---

## 3.3 Category Management Module

### Checklist Tasks:

- [x] **3.3.1** Buat file `controllers/CategoryController.js`
- [x] **3.3.2** Implementasi CRUD functions:
  - [x] getCategories (dengan count assets per category)
  - [x] getCategoryById
  - [x] createCategory
  - [x] updateCategory
  - [x] deleteCategory (cek tidak ada aset terkait)
- [x] **3.3.3** Buat file `routes/CategoryRoutes.js`
- [x] **3.3.4** Setup routes:
  - [x] GET `/api/categories`
  - [x] GET `/api/categories/:id`
  - [x] POST `/api/categories` (Admin)
  - [x] PUT `/api/categories/:id` (Admin)
  - [x] DELETE `/api/categories/:id` (Admin)

---

## 3.4 Location Management Module

### Checklist Tasks:

- [x] **3.4.1** Buat file `controllers/LocationController.js`
- [x] **3.4.2** Implementasi CRUD functions:
  - [x] getLocations (dengan count assets per location)
  - [x] getLocationById
  - [x] createLocation
  - [x] updateLocation
  - [x] deleteLocation (cek tidak ada aset terkait)
  - [x] getLocationAssets
- [x] **3.4.3** Buat file `routes/LocationRoutes.js`
- [x] **3.4.4** Setup routes:
  - [x] GET `/api/locations`
  - [x] GET `/api/locations/:id`
  - [x] GET `/api/locations/:id/assets`
  - [x] POST `/api/locations` (Admin)
  - [x] PUT `/api/locations/:id` (Admin)
  - [x] DELETE `/api/locations/:id` (Admin)

---

## 3.5 Asset Management Module

### 3.5.1 Asset Controller

#### Checklist Tasks:

- [x] **3.5.1.1** Buat file `controllers/AssetController.js`
- [x] **3.5.1.2** Implementasi fungsi `getAssets`:
  - [x] Pagination (page, limit)
  - [x] Search by name, serial_number, asset_code
  - [x] Filter by category, location, status
  - [x] Sorting (created_at)
  - [x] Include relasi (category, location, holder)
- [x] **3.5.1.3** Implementasi fungsi `getAssetById`:
  - [x] Include semua relasi
  - [x] Calculate current book value
- [x] **3.5.1.4** Implementasi fungsi `createAsset`:
  - [x] Validasi input (Joi)
  - [x] Auto-generate asset_code
  - [x] Cek unique serial_number
  - [x] Set default status = 'available'
  - [x] Return created asset
- [x] **3.5.1.5** Implementasi fungsi `updateAsset`:
  - [x] Validasi input
  - [x] Cek unique constraints
  - [x] Return updated asset
- [x] **3.5.1.6** Implementasi fungsi `deleteAsset`:
  - [x] Hard delete (admin only)
  - [x] Cek tidak sedang in_use
- [x] **3.5.1.7** Implementasi fungsi `getAssetHistory`:
  - [x] Get transaction history untuk aset tertentu
- [x] **3.5.1.8** Implementasi fungsi `getAssetStats`:
  - [x] Statistics by status and category

### 3.5.2 Asset Routes

#### Checklist Tasks:

- [x] **3.5.2.1** Buat file `routes/AssetRoutes.js`
- [x] **3.5.2.2** Setup routes:
  - [x] GET `/api/assets`
  - [x] GET `/api/assets/stats`
  - [x] GET `/api/assets/:id`
  - [x] POST `/api/assets`
  - [x] PUT `/api/assets/:id`
  - [x] DELETE `/api/assets/:id` (Admin)
  - [x] GET `/api/assets/:id/history`

---

## 3.6 Transaction Module (Check-in/Check-out)

### 3.6.1 Transaction Controller

#### Checklist Tasks:

- [x] **3.6.1.1** Buat file `controllers/TransactionController.js`
- [x] **3.6.1.2** Implementasi fungsi `checkout`:
  - [x] Validasi aset status = 'available'
  - [x] Validasi user exists
  - [x] Update asset: status = 'in_use', current_holder_id = user_id
  - [x] Create transaction record: type = 'checkout'
  - [x] Return success response
- [x] **3.6.1.3** Implementasi fungsi `checkin`:
  - [x] Validasi aset status = 'in_use'
  - [x] Validasi location exists
  - [x] Update asset: status = 'available', current_holder_id = null, location_id
  - [x] Create transaction record: type = 'checkin'
  - [x] Return success response
- [x] **3.6.1.4** Implementasi fungsi `transfer`:
  - [x] Transfer aset antar lokasi
- [x] **3.6.1.5** Implementasi fungsi `repairAsset`:
  - [x] Update status = 'under_repair'
- [x] **3.6.1.6** Implementasi fungsi `completeRepair`:
  - [x] Update status = 'available'
- [x] **3.6.1.7** Implementasi fungsi `disposeAsset`:
  - [x] Update status = 'disposed'
- [x] **3.6.1.8** Implementasi fungsi `getTransactions`:
  - [x] List semua transaksi dengan filter
- [x] **3.6.1.9** Implementasi fungsi `getTransactionById`

### 3.6.2 Transaction Routes

#### Checklist Tasks:

- [x] **3.6.2.1** Buat file `routes/TransactionRoutes.js`
- [x] **3.6.2.2** Setup routes:
  - [x] GET `/api/transactions`
  - [x] GET `/api/transactions/:id`
  - [x] POST `/api/transactions/checkout`
  - [x] POST `/api/transactions/checkin`
  - [x] POST `/api/transactions/transfer`
  - [x] POST `/api/transactions/repair`
  - [x] POST `/api/transactions/repair/complete`
  - [x] POST `/api/transactions/dispose`

---

## 3.7 Dashboard & Reports Module

### Checklist Tasks:

- [x] **3.7.1** Buat file `controllers/DashboardController.js`
- [x] **3.7.2** Implementasi fungsi `getDashboardStats`:
  - [x] Total assets, users, categories, locations
  - [x] Assets by status (available, in_use, under_repair, disposed)
  - [x] Assets by category
  - [x] Recent transactions (10 terakhir)
  - [x] Transaction summary (last 30 days)
  - [x] Monthly trends (last 6 months)
  - [x] Overdue assets
  - [x] Assets with expiring warranty (30 hari ke depan)
- [x] **3.7.3** Implementasi fungsi `getQuickStats`:
  - [x] Quick stats for header widgets
- [x] **3.7.4** Setup routes:
  - [x] GET `/api/dashboard`
  - [x] GET `/api/dashboard/quick`

---

## 3.8 Utility & Validation

### Checklist Tasks:

- [x] **3.8.1** Buat file `utils/ResponseFormatter.js`:
  - [x] successResponse(data, message, meta)
  - [x] errorResponse(message, errorCode, errors)
  - [x] paginationMeta(page, limit, total)
- [x] **3.8.2** Buat file `utils/Validators.js`:
  - [x] Joi schemas untuk setiap entity
- [x] **3.8.3** Buat file `middleware/ValidationMiddleware.js`:
  - [x] Middleware untuk validasi request body
- [x] **3.8.4** Error handling global di Express

---

## 3.9 Main Routes Index

### Checklist Tasks:

- [x] **3.9.1** Update `index.js` untuk include semua routes
- [ ] **3.9.2** Test semua endpoint dengan Postman/Thunder Client
- [ ] **3.9.3** Dokumentasi API (opsional: Swagger)

---

# 🎯 FASE 4: FRONTEND DEVELOPMENT (Minggu 3-5)

## 4.1 Base Setup & Configuration

### Checklist Tasks:

- [x] **4.1.1** Setup Axios instance dengan base URL
- [x] **4.1.2** Implementasi Axios Interceptor untuk Refresh Token
- [x] **4.1.3** Setup React Router dengan routes dasar
- [x] **4.1.4** Buat AuthContext untuk state management auth
- [x] **4.1.5** Buat ProtectedRoute component
- [x] **4.1.6** Setup Toast notifications

---

## 4.2 Common Components

### Checklist Tasks:

- [x] **4.2.1** Buat komponen `Button.jsx`:
  - [x] Variants: primary, secondary, danger, outline
  - [x] States: loading, disabled
- [x] **4.2.2** Buat komponen `Input.jsx`:
  - [x] Support label, error message, icon
- [x] **4.2.3** Buat komponen `Select.jsx`:
  - [x] Dropdown dengan search (opsional)
- [x] **4.2.4** Buat komponen `Modal.jsx`:
  - [x] Reusable modal dengan header, body, footer
- [x] **4.2.5** Buat komponen `Table.jsx`:
  - [x] Pagination
  - [x] Sorting
  - [x] Empty state
- [x] **4.2.6** Buat komponen `Badge.jsx`:
  - [x] Status badges dengan warna sesuai status
- [x] **4.2.7** Buat komponen `Loader.jsx`:
  - [x] Full page loader
  - [x] Inline loader
- [x] **4.2.8** Buat komponen `Card.jsx`:
  - [x] Stat card untuk dashboard
- [x] **4.2.9** Buat komponen `SearchBar.jsx`
- [x] **4.2.10** Buat komponen `ConfirmDialog.jsx`

---

## 4.3 Layout Components

### Checklist Tasks:

- [x] **4.3.1** Buat komponen `Sidebar.jsx`:
  - [x] Logo
  - [x] Navigation menu
  - [x] Active state
  - [x] Collapse/expand (responsive)
- [x] **4.3.2** Buat komponen `Navbar.jsx`:
  - [x] User info
  - [x] Logout button
  - [x] Mobile menu toggle
- [x] **4.3.3** Buat komponen `Layout.jsx`:
  - [x] Wrap Sidebar + Navbar + Content

---

## 4.4 Authentication Pages

### Checklist Tasks:

- [x] **4.4.1** Buat halaman `Login.jsx`:
  - [x] Form email & password
  - [x] Validasi form
  - [x] Handle login API
  - [x] Redirect ke dashboard setelah login
  - [x] Error handling
- [x] **4.4.2** Handle persistent auth (cek token saat load)
- [x] **4.4.3** Implementasi logout functionality

---

## 4.5 Dashboard Page

### Checklist Tasks:

- [x] **4.5.1** Buat halaman `Dashboard.jsx`:
  - [x] Stat cards: Total Assets, Available, Assigned, In Repair
  - [x] Chart: Assets by Category (pie chart/bar chart)
  - [x] Chart: Assets by Status
  - [x] Table: Recent Transactions
  - [x] Alert: Assets with expiring warranty
- [x] **4.5.2** Fetch data dari Dashboard API
- [x] **4.5.3** Loading states

---

## 4.6 Asset Management Pages

### Checklist Tasks:

- [x] **4.6.1** Buat halaman `AssetList.jsx`:
  - [x] Table dengan kolom: Asset Tag, Name, Category, Location, Status, Holder, Actions
  - [x] Search bar (by name, serial, tag)
  - [x] Filter dropdowns (category, location, status)
  - [x] Pagination
  - [x] Link ke detail, edit
  - [x] Button tambah aset
  - [x] Status badges berwarna
- [x] **4.6.2** Buat halaman `AssetDetail.jsx`:
  - [x] Detail info aset
  - [x] Spesifikasi (JSON display)
  - [x] Current holder info
  - [x] Tab: Transaction History
  - [x] Quick actions: Checkout/Checkin buttons
- [x] **4.6.3** Buat halaman `AssetForm.jsx`:
  - [x] Form input semua field
  - [x] Dropdown untuk category & location
  - [x] Validasi form
  - [x] Submit ke API
  - [x] Success notification & redirect
- [x] **4.6.4** Edit mode pada `AssetForm.jsx`:
  - [x] Pre-fill form dengan data existing
  - [x] Update ke API
  - [x] Handle validation errors

---

## 4.7 User Management Pages

### Checklist Tasks:

- [x] **4.7.1** Buat halaman `UserList.jsx`:
  - [x] Table dengan kolom: Name, Email, Role, Department, Status, Actions
  - [x] Search & filter
  - [x] Pagination
- [x] **4.7.2** Buat halaman `UserForm.jsx`:
  - [x] Form untuk tambah employee
  - [x] Role selection
- [x] **4.7.3** Edit mode pada `UserForm.jsx`
- [ ] **4.7.4** Buat halaman `UserDetail.jsx` (opsional):
  - [ ] Lihat assets yang dipegang user

---

## 4.8 Transaction Pages

### Checklist Tasks:

- [x] **4.8.1** Buat halaman `TransactionList.jsx`:
  - [x] Table: Date, Asset, Action, Employee, Admin, Notes
  - [x] Filter by action type, date range
  - [x] Read-only (audit trail)
- [x] **4.8.2** Buat halaman/modal `Checkout.jsx`:
  - [x] Select asset (hanya yang available)
  - [x] Select employee
  - [x] Date & notes
  - [x] Submit & update status
- [x] **4.8.3** Buat halaman/modal `Checkin.jsx`:
  - [x] Select asset (hanya yang assigned)
  - [x] Select condition
  - [x] Notes
  - [x] Submit & update status

---

## 4.9 Master Data Pages

### Checklist Tasks:

- [x] **4.9.1** Buat halaman `CategoryList.jsx`:
  - [x] CRUD categories
  - [x] Inline edit atau modal
- [x] **4.9.2** Buat halaman `LocationList.jsx`:
  - [x] CRUD locations
  - [x] Inline edit atau modal

---

## 4.10 Reports Page

### Checklist Tasks:

- [x] **4.10.1** Buat halaman `Reports.jsx`:
  - [x] Filter options
  - [x] Preview data
  - [x] Charts visualization (Pie, Bar, Line Charts)
  - [x] Export to PDF ✅
  - [x] Export to Excel ✅
- [x] **4.10.2** Buat utility `exportUtils.js`:
  - [x] exportToExcel() - menggunakan library xlsx
  - [x] exportToPDF() - menggunakan library jspdf + jspdf-autotable
  - [x] formatAssetDataForExport()
  - [x] formatTransactionDataForExport()
- [x] **4.10.3** Implementasi Export di halaman AssetList:
  - [x] Export PDF button
  - [x] Export Excel button
  - [x] Export dengan filter aktif

---

# 🎯 FASE 5: INTEGRATION & TESTING (Minggu 5-6)

## 5.1 API Integration Testing

### Checklist Tasks:

- [x] **5.1.1** Test semua Auth endpoints
- [x] **5.1.2** Test semua User CRUD endpoints
- [x] **5.1.3** Test semua Category CRUD endpoints
- [x] **5.1.4** Test semua Location CRUD endpoints
- [x] **5.1.5** Test semua Asset CRUD endpoints
- [x] **5.1.6** Test Transaction checkout flow
- [x] **5.1.7** Test Transaction checkin flow
- [x] **5.1.8** Test Dashboard stats
- [x] **5.1.9** Test error handling & validation

### Backend Test Summary:
| Test Suite | Tests | Status |
|------------|-------|--------|
| Auth API | 4 | ✅ PASS |
| Dashboard API | 5 | ✅ PASS |
| Categories API | 4 | ✅ PASS |
| Locations API | 3 | ✅ PASS |
| Assets API | 8 | ✅ PASS |
| Users API | 10 | ✅ PASS |
| Transactions API | 9 | ✅ PASS |
| **Total** | **43** | ✅ ALL PASS |

---

## 5.2 Frontend Integration Testing

### Checklist Tasks:

- [x] **5.2.1** Test login/logout flow
- [x] **5.2.2** Test token refresh otomatis
- [x] **5.2.3** Test protected routes
- [x] **5.2.4** Test form validations
- [x] **5.2.5** Test CRUD operations di setiap modul
- [x] **5.2.6** Test pagination & filtering
- [x] **5.2.7** Test checkout/checkin workflow
- [x] **5.2.8** Test responsive design
- [x] **5.2.9** Test Export PDF functionality
- [x] **5.2.10** Test Export Excel functionality

### Frontend Component Test Summary:
| Component | Tests | Status |
|-----------|-------|--------|
| Button | 10 | ✅ PASS |
| Input | 11 | ✅ PASS |
| Modal | 6 | ✅ PASS |
| Badge | 13 | ✅ PASS |
| Card | 14 | ✅ PASS |
| Login Page | 8 | ✅ PASS |
| **Total** | **62** | ✅ ALL PASS |

### Manual Testing Summary:
| Feature | Status | Notes |
|---------|--------|-------|
| Login/Logout | ✅ PASS | Tested with admin@company.com |
| Dashboard | ✅ PASS | Stats & charts working |
| Asset CRUD | ✅ PASS | Create, Read, Update, Delete working |
| Asset Export PDF | ✅ PASS | Downloads daftar-aset-[date].pdf |
| Asset Export Excel | ✅ PASS | Downloads daftar-aset-[date].xlsx |
| Transaction Checkout | ✅ PASS | Status changes available→assigned |
| Transaction Checkin | ✅ PASS | Status changes assigned→available |
| Category CRUD | ✅ PASS | Inline edit working |
| Location CRUD | ✅ PASS | Inline edit working |
| User CRUD | ✅ PASS | Working |
| Reports Export PDF | ✅ PASS | Downloads laporan-ringkasan-[date].pdf |
| Reports Export Excel | ✅ PASS | Downloads laporan-aset-[date].xlsx |

---

## 5.3 Security Testing

### Checklist Tasks:

- [x] **5.3.1** Test akses endpoint tanpa token (harus 401)
- [x] **5.3.2** Test akses endpoint dengan role tidak sesuai (harus 403)
- [x] **5.3.3** Test SQL injection pada input forms
- [x] **5.3.4** Verify HttpOnly & Secure flags pada cookies
- [x] **5.3.5** Test XSS prevention
- [x] **5.3.6** Verify password hashing

### Security Test Summary:
| Test Category | Tests | Status |
|---------------|-------|--------|
| Unauthorized Access (No Token) | 5 | ✅ PASS |
| Role-Based Access Control | 3 | ✅ PASS |
| SQL Injection Prevention | 4 | ✅ PASS |
| Cookie Security Flags | 1 | ✅ PASS |
| XSS Prevention | 2 | ✅ PASS |
| Password Hashing | 4 | ✅ PASS |
| Additional Security Checks | 3 | ✅ PASS |
| **Total** | **22** | ✅ ALL PASS |

---

## 5.4 State Machine Testing

### Checklist Tasks:

- [x] **5.4.1** Test: Available -> Checkout -> Assigned ✓
- [x] **5.4.2** Test: Assigned -> Checkin (good) -> Available ✓
- [x] **5.4.3** Test: Assigned -> Checkin (damaged) -> Repair ✓
- [x] **5.4.4** Test: Repair -> Complete -> Available ✓
- [x] **5.4.5** Test: Tidak bisa checkout aset yang sudah Assigned (BLOCK)
- [x] **5.4.6** Test: Tidak bisa checkout aset yang In Repair (BLOCK)
- [x] **5.4.7** Test: Tidak bisa checkout aset yang Retired (BLOCK)

### State Machine Test Summary:
| Test Category | Tests | Status |
|---------------|-------|--------|
| Available -> Assigned | 2 | ✅ PASS |
| Assigned -> Available | 2 | ✅ PASS |
| Assigned -> Repair | 1 | ✅ PASS |
| Repair -> Available | 1 | ✅ PASS |
| Block Invalid Transitions | 3 | ✅ PASS |
| Additional Validations | 2 | ✅ PASS |
| **Total** | **11** | ✅ ALL PASS |

---

# 🎯 FASE 6: DEPLOYMENT PREPARATION (Minggu 6-7)

## 6.0 CI/CD Setup (GitHub Actions)

### Checklist Tasks:

- [x] **6.0.1** Buat workflow file `.github/workflows/ci-test.yml`
- [x] **6.0.2** Setup MySQL service container untuk backend tests
- [x] **6.0.3** Konfigurasi Jest untuk output JSON report + coverage
- [x] **6.0.4** Konfigurasi Vitest untuk output JSON report
- [x] **6.0.5** Implementasi PR comment dengan github-script
- [x] **6.0.6** Handle update existing comment (tidak create baru setiap run)
- [x] **6.0.7** Add badge status ke README
- [x] **6.0.8** Buat README.md dengan dokumentasi proyek
- [x] **6.0.9** Setup .gitignore file
- [x] **6.0.10** Initial commit dengan semua files (119 files, 30,369 lines)
- [x] **6.0.11** Push ke GitHub repository (VibeCoding3-JC/asst-mngmtjc)

### Workflow Features:
- ✅ Trigger on push/PR ke branch `main` dan `develop`
- ✅ Backend tests dengan Jest + MySQL service
- ✅ Frontend tests dengan Vitest
- ✅ Coverage report untuk backend
- ✅ Auto-comment hasil test ke Pull Request
- ✅ Final status check job

## 6.1 Production Configuration

### Backend Checklist:

- [x] **6.1.1** Setup production environment variables (`.env.production`)
- [x] **6.1.2** Configure production database (MySQL) - database.js sudah support multi-env
- [x] **6.1.3** Setup CORS untuk production domain (via `CLIENT_URL` env)
- [x] **6.1.4** Disable development logs (via `NODE_ENV` check)
- [x] **6.1.5** Setup PM2 (`ecosystem.config.cjs`)
- [x] **6.1.6** Configure HTTPS/SSL - Dokumentasi Nginx + Let's Encrypt

### Frontend Checklist:

- [x] **6.1.7** Build production (`npm run build`) - ✅ Built successfully
- [x] **6.1.8** Configure production API URL (`.env.production`)
- [x] **6.1.9** Optimize bundle size (`vite.config.js` - terser, chunking)
- [x] **6.1.10** Setup hosting documentation (`docs/DEPLOYMENT.md`)

---

## 6.2 Documentation

### Checklist Tasks:

- [ ] **6.2.1** Update README.md dengan:
  - [ ] Installation steps
  - [ ] Environment setup
  - [ ] Running locally
  - [ ] Deployment steps
- [ ] **6.2.2** API Documentation (endpoints, request/response)
- [ ] **6.2.3** User manual (basic usage guide)

---

## 6.3 User Acceptance Testing (UAT)

### Checklist Tasks:

- [ ] **6.3.1** Siapkan test environment
- [ ] **6.3.2** Buat test scenarios
- [ ] **6.3.3** Conduct UAT dengan stakeholder
- [ ] **6.3.4** Collect feedback
- [ ] **6.3.5** Fix bugs from UAT
- [ ] **6.3.6** Final approval

---

# 📊 Progress Tracking Summary

## Overall Progress

| Fase | Nama | Progress | Status |
|------|------|----------|--------|
| 1 | Setup & Foundation | 100% | ✅ Completed |
| 2 | Database Models | 100% | ✅ Completed |
| 3 | Backend API | 100% | ✅ Completed |
| 4 | Frontend Development | 100% | ✅ Completed |
| 5 | Integration & Testing | 100% | ✅ Completed |
| 6 | Deployment Preparation | 80% | 🔄 In Progress |

**Legend:**
- ⬜ Not Started
- 🔄 In Progress
- ✅ Completed
- ⚠️ Blocked

---

## Complete Test Summary

### Backend Tests (Jest + Supertest)
| Test Suite | Tests | Status |
|------------|-------|--------|
| Auth API | 4 | ✅ PASS |
| Dashboard API | 5 | ✅ PASS |
| Categories API | 4 | ✅ PASS |
| Locations API | 3 | ✅ PASS |
| Assets API | 8 | ✅ PASS |
| Users API | 10 | ✅ PASS |
| Transactions API | 9 | ✅ PASS |
| Security Tests | 22 | ✅ PASS |
| State Machine Tests | 11 | ✅ PASS |
| **Backend Total** | **76** | ✅ ALL PASS |

### Frontend Tests (Vitest + React Testing Library)
| Test Suite | Tests | Status |
|------------|-------|--------|
| Button Component | 10 | ✅ PASS |
| Input Component | 11 | ✅ PASS |
| Modal Component | 6 | ✅ PASS |
| Badge Component | 13 | ✅ PASS |
| Card Component | 14 | ✅ PASS |
| Login Page | 8 | ✅ PASS |
| **Frontend Total** | **62** | ✅ ALL PASS |

### E2E Tests (Playwright)
| Test Suite | Tests | Status |
|------------|-------|--------|
| Auth Flow | 4 | ✅ PASS |
| Dashboard | 3 | ✅ PASS |
| Asset Management | 7 | ✅ PASS |
| Transaction Workflow | 7 | ✅ PASS |
| Navigation & Master Data | 9 | ✅ PASS |
| **E2E Total** | **30** | ✅ ALL PASS |

### Grand Total
| Category | Tests | Status |
|----------|-------|--------|
| Backend API + Security + State Machine | 76 | ✅ PASS |
| Frontend Components | 62 | ✅ PASS |
| E2E Tests | 30 | ✅ PASS |
| **GRAND TOTAL** | **168** | ✅ ALL PASS |

---

## Risk & Dependencies

| ID | Risk/Dependency | Mitigation |
|----|-----------------|------------|
| R1 | MySQL server tidak tersedia | Setup local MySQL atau gunakan Docker |
| R2 | Perubahan requirements di tengah jalan | Dokumentasikan change request |
| R3 | Performance issue dengan data besar | Implement proper indexing & pagination |
| D1 | Backend harus selesai sebelum Frontend testing | Prioritaskan backend development |
| D2 | Model harus selesai sebelum Controller | Selesaikan Fase 2 sebelum Fase 3 |

---

## Notes & Decisions Log

| Date | Decision/Note |
|------|---------------|
| 2024-12-04 | Initial plan created based on design document |
| 2024-12-04 | Plan approved, development started |
| 2024-12-04 | Fase 1 (Setup) completed |
| 2024-12-04 | Fase 2 (Database Models) completed |
| 2024-12-04 | Fase 3 (Backend API) completed - all controllers and routes implemented |
| 2024-12-04 | Schema updated: Location model uses building/floor/room_number instead of address |
| 2024-12-04 | Schema updated: Asset uses asset_code (auto-generated) instead of asset_tag |
| 2024-12-04 | Schema updated: Transaction uses type-based fields (from/to user/location) |
| 2024-12-04 | Fase 4 (Frontend) completed - all pages and components implemented |
| 2024-12-04 | Fase 5 Backend Testing: Jest + Supertest - 43 tests PASSED |
| 2024-12-04 | Fase 5 Frontend Testing: Vitest + React Testing Library - 62 tests PASSED |
| 2024-12-04 | Bug Fixed: ENUM status mismatch in TransactionController (in_use→assigned, under_repair→repair) |
| 2024-12-04 | Fase 5 E2E Testing: Playwright - 30 tests PASSED |
| 2024-12-04 | Fase 5 Security Testing: 22 tests PASSED (unauthorized, RBAC, SQL injection, XSS, cookies, passwords) |
| 2024-12-04 | Fase 5 State Machine Testing: 11 tests PASSED (all valid/invalid transitions) |
| 2024-12-04 | Fase 5 COMPLETED - Total 168 tests ALL PASSED |
| 2024-12-04 | Export PDF/Excel implemented using jspdf, jspdf-autotable, xlsx libraries |
| 2024-12-04 | Bug Fixed: Frontend menggunakan .id tapi backend expect .uuid - semua files diperbaiki |
| 2024-12-04 | Bug Fixed: AssetDetail import transactionAPI.getByAsset() → assetAPI.getHistory() |
| 2024-12-04 | Export berfungsi di Reports.jsx dan AssetList.jsx |
| 2024-12-04 | Manual Testing: Login, CRUD, Export PDF/Excel - ALL WORKING ✅ |
| 2024-12-04 | GitHub Actions CI/CD workflow implemented (.github/workflows/ci-test.yml) |
| 2024-12-04 | PR auto-comment dengan test results summary |
| 2024-12-04 | README.md created dengan dokumentasi proyek |
| 2024-12-04 | Git repository initialized dengan .gitignore |
| 2024-12-04 | Initial commit: 119 files, 30,369 insertions |
| 2024-12-04 | Pushed to GitHub: https://github.com/VibeCoding3-JC/asst-mngmtjc |
| 2024-12-04 | GitHub Actions CI workflow akan auto-run pada setiap push/PR |

---

## Approval Section

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Project Manager | | | ⬜ Pending |
| Tech Lead | | | ⬜ Pending |
| Developer | | | ⬜ Pending |

---

**Catatan:**
- Plan ini dapat direvisi sesuai kebutuhan setelah approval
- Setiap task yang selesai harap di-update checklistnya
- Meeting review progress dilakukan mingguan

---

*Document Version: 1.0*  
*Last Updated: 4 Desember 2024*
