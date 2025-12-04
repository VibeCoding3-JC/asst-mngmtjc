-- =====================================================
-- IT Asset Management System - Database Setup Script
-- =====================================================
-- Jalankan script ini di MySQL client atau phpMyAdmin

-- 1. Buat Database
CREATE DATABASE IF NOT EXISTS it_asset_management 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. Gunakan Database
USE it_asset_management;

-- 3. Verifikasi
SELECT 'Database it_asset_management berhasil dibuat!' AS Status;

-- =====================================================
-- CATATAN:
-- Setelah menjalankan script ini, pastikan file .env
-- di folder backend sudah dikonfigurasi dengan benar:
-- 
-- DB_HOST=localhost
-- DB_NAME=it_asset_management
-- DB_USER=root
-- DB_PASS=<password_mysql_anda>
-- DB_PORT=3306
-- =====================================================
