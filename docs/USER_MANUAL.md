# 📖 User Manual - IT Asset Management System

**Versi:** 1.0.0  
**Terakhir Diperbarui:** Desember 2024

---

## 📋 Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Memulai Aplikasi](#2-memulai-aplikasi)
3. [Login & Autentikasi](#3-login--autentikasi)
4. [Dashboard](#4-dashboard)
5. [Manajemen Aset](#5-manajemen-aset)
6. [Transaksi Aset](#6-transaksi-aset)
7. [Manajemen Kategori](#7-manajemen-kategori)
8. [Manajemen Lokasi](#8-manajemen-lokasi)
9. [Manajemen User](#9-manajemen-user)
10. [Laporan & Export](#10-laporan--export)
11. [Pengaturan Profil](#11-pengaturan-profil)
12. [FAQ & Troubleshooting](#12-faq--troubleshooting)

---

## 1. Pendahuluan

### 1.1 Tentang Aplikasi

**IT Asset Management System** adalah aplikasi berbasis web untuk mengelola aset IT perusahaan. Aplikasi ini membantu tim IT untuk:

- 📦 Melacak semua aset IT (laptop, monitor, printer, dll)
- 👥 Mengelola peminjaman aset ke karyawan
- 📍 Memantau lokasi dan perpindahan aset
- 🔧 Mencatat riwayat perbaikan aset
- 📊 Membuat laporan inventaris

### 1.2 Role Pengguna

| Role | Hak Akses |
|------|-----------|
| **Admin** | Akses penuh ke semua fitur, termasuk kelola user dan hapus data |
| **Staff** | Kelola aset, transaksi, dan lihat laporan. Tidak bisa hapus data permanen |
| **Employee** | Hanya lihat aset yang dipinjam (fitur terbatas) |

### 1.3 Akun Default

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@company.com` | `admin123` |
| Staff | `staff@company.com` | `staff123` |

> ⚠️ **Penting:** Segera ganti password default setelah login pertama kali!

---

## 2. Memulai Aplikasi

### 2.1 Persyaratan Sistem

- **Browser:** Chrome, Firefox, Edge, Safari (versi terbaru)
- **Koneksi Internet:** Stabil untuk akses ke server
- **Resolusi Layar:** Minimal 1280 x 720 pixel

### 2.2 Mengakses Aplikasi

1. Buka browser web
2. Ketik URL aplikasi:
   - **Development:** `http://localhost:5173`
   - **Production:** `https://yourdomain.com`
3. Halaman login akan muncul

---

## 3. Login & Autentikasi

### 3.1 Cara Login

1. Buka halaman login
2. Masukkan **Email** yang terdaftar
3. Masukkan **Password**
4. Klik tombol **"Login"**

![Login Page](./images/login-page.png)

### 3.2 Lupa Password

Jika lupa password, hubungi Administrator untuk reset password.

### 3.3 Session & Timeout

- Session login berlaku selama **24 jam**
- Jika tidak aktif selama 15 menit, token akan di-refresh otomatis
- Setelah 24 jam, Anda akan diminta login ulang

### 3.4 Logout

1. Klik nama Anda di pojok kanan atas
2. Pilih **"Logout"**
3. Anda akan kembali ke halaman login

---

## 4. Dashboard

Dashboard adalah halaman utama setelah login yang menampilkan ringkasan data.

### 4.1 Widget Statistik

| Widget | Deskripsi |
|--------|-----------|
| **Total Aset** | Jumlah seluruh aset yang terdaftar |
| **Tersedia** | Aset yang siap dipinjam |
| **Dipinjam** | Aset yang sedang digunakan karyawan |
| **Dalam Perbaikan** | Aset yang sedang diperbaiki |

### 4.2 Grafik

- **Aset per Kategori:** Pie chart distribusi aset berdasarkan kategori
- **Aset per Lokasi:** Bar chart jumlah aset di setiap lokasi
- **Trend Transaksi:** Line chart aktivitas transaksi bulanan

### 4.3 Transaksi Terbaru

Menampilkan 5 transaksi terakhir dengan informasi:
- Jenis transaksi
- Nama aset
- User terkait
- Waktu transaksi

### 4.4 Navigasi Cepat

Klik pada widget statistik untuk langsung ke halaman terkait:
- Klik "Tersedia" → Filter aset dengan status tersedia
- Klik "Dipinjam" → Filter aset yang sedang dipinjam

---

## 5. Manajemen Aset

### 5.1 Melihat Daftar Aset

1. Klik menu **"Aset"** di sidebar
2. Halaman daftar aset akan muncul

#### Fitur Pencarian & Filter:

| Filter | Fungsi |
|--------|--------|
| **Search** | Cari berdasarkan kode, nama, atau serial number |
| **Kategori** | Filter berdasarkan kategori aset |
| **Lokasi** | Filter berdasarkan lokasi aset |
| **Status** | Filter: Tersedia, Dipinjam, Perbaikan, Retired |

#### Kolom Tabel:

| Kolom | Deskripsi |
|-------|-----------|
| Kode Aset | Kode unik auto-generated (format: XXX-YYYY-NNNNN) |
| Nama | Nama aset |
| Kategori | Kategori aset |
| Lokasi | Lokasi penempatan aset |
| Status | Status ketersediaan aset |
| Pemegang | User yang memegang aset (jika dipinjam) |
| Aksi | Tombol View, Edit, Delete |

### 5.2 Menambah Aset Baru

1. Klik tombol **"+ Tambah Aset"** (pojok kanan atas)
2. Isi form dengan data berikut:

| Field | Wajib | Keterangan |
|-------|-------|------------|
| Nama Aset | ✅ | Nama deskriptif aset |
| Kategori | ✅ | Pilih dari dropdown |
| Lokasi | ✅ | Pilih lokasi penempatan |
| Serial Number | ❌ | Nomor seri dari pabrik |
| Brand | ❌ | Merek aset |
| Model | ❌ | Model/tipe aset |
| Spesifikasi | ❌ | Detail spesifikasi teknis |
| Tanggal Pembelian | ❌ | Tanggal akuisisi |
| Harga Pembelian | ❌ | Harga beli (Rupiah) |
| Vendor | ❌ | Nama supplier/vendor |
| Garansi Berakhir | ❌ | Tanggal akhir garansi |
| Catatan | ❌ | Catatan tambahan |

3. Klik **"Simpan"**
4. Aset akan otomatis mendapat kode unik

### 5.3 Melihat Detail Aset

1. Klik tombol **"👁 View"** pada baris aset
2. Halaman detail menampilkan:
   - Informasi lengkap aset
   - Nilai buku saat ini (dengan kalkulasi depresiasi)
   - Pemegang saat ini (jika dipinjam)
   - Riwayat transaksi aset

### 5.4 Mengedit Aset

1. Klik tombol **"✏️ Edit"** pada baris aset
2. Ubah data yang diperlukan
3. Klik **"Update"**

> ⚠️ **Catatan:** Kode aset tidak bisa diubah setelah dibuat.

### 5.5 Menghapus Aset (Admin Only)

1. Klik tombol **"🗑 Delete"** pada baris aset
2. Konfirmasi penghapusan
3. Aset akan dihapus permanen

> ⚠️ **Peringatan:** 
> - Aset yang sedang dipinjam tidak bisa dihapus
> - Penghapusan bersifat permanen dan tidak bisa dibatalkan

### 5.6 Status Aset

| Status | Warna | Deskripsi |
|--------|-------|-----------|
| **Available** | 🟢 Hijau | Aset tersedia untuk dipinjam |
| **Assigned** | 🔵 Biru | Aset sedang dipinjam user |
| **Repair** | 🟡 Kuning | Aset dalam perbaikan |
| **Retired** | 🔴 Merah | Aset sudah dibuang/dispose |

---

## 6. Transaksi Aset

Menu Transaksi digunakan untuk mencatat semua aktivitas aset.

### 6.1 Jenis Transaksi

| Jenis | Deskripsi | Perubahan Status |
|-------|-----------|------------------|
| **Checkout** | Meminjamkan aset ke user | Available → Assigned |
| **Checkin** | Mengembalikan aset dari user | Assigned → Available |
| **Transfer** | Memindahkan aset ke lokasi lain | Lokasi berubah |
| **Repair** | Mengirim aset untuk perbaikan | Any → Repair |
| **Complete Repair** | Aset selesai diperbaiki | Repair → Available |
| **Dispose** | Membuang/menghapuskan aset | Any → Retired |

### 6.2 Checkout (Pinjam Aset)

Untuk meminjamkan aset ke karyawan:

1. Buka menu **"Transaksi"**
2. Klik tab **"Checkout"**
3. Isi form:

| Field | Wajib | Keterangan |
|-------|-------|------------|
| Pilih Aset | ✅ | Pilih aset yang tersedia |
| Pilih User | ✅ | Pilih karyawan peminjam |
| Tanggal Kembali | ❌ | Perkiraan tanggal pengembalian |
| Catatan | ❌ | Catatan peminjaman |

4. Klik **"Checkout"**
5. Status aset berubah menjadi "Assigned"

### 6.3 Checkin (Kembalikan Aset)

Untuk mengembalikan aset dari karyawan:

1. Buka menu **"Transaksi"**
2. Klik tab **"Checkin"**
3. Isi form:

| Field | Wajib | Keterangan |
|-------|-------|------------|
| Pilih Aset | ✅ | Pilih aset yang dipinjam |
| Lokasi Kembali | ✅ | Lokasi penyimpanan aset |
| Kondisi | ❌ | Catatan kondisi aset |
| Catatan | ❌ | Catatan pengembalian |

4. Klik **"Checkin"**
5. Status aset berubah menjadi "Available"

### 6.4 Transfer (Pindah Lokasi)

Untuk memindahkan aset ke lokasi lain:

1. Buka menu **"Transaksi"**
2. Klik tab **"Transfer"**
3. Isi form:

| Field | Wajib | Keterangan |
|-------|-------|------------|
| Pilih Aset | ✅ | Pilih aset yang akan dipindah |
| Lokasi Tujuan | ✅ | Lokasi baru |
| Catatan | ❌ | Alasan pemindahan |

4. Klik **"Transfer"**

> ⚠️ **Catatan:** Aset yang sedang dipinjam harus dikembalikan dulu sebelum dipindahkan.

### 6.5 Repair (Kirim Perbaikan)

Untuk mencatat pengiriman aset ke perbaikan:

1. Buka menu **"Transaksi"**
2. Klik tab **"Repair"**
3. Isi form:

| Field | Wajib | Keterangan |
|-------|-------|------------|
| Pilih Aset | ✅ | Pilih aset yang rusak |
| Vendor Perbaikan | ❌ | Nama vendor/teknisi |
| Estimasi Biaya | ❌ | Perkiraan biaya perbaikan |
| Estimasi Selesai | ❌ | Perkiraan tanggal selesai |
| Catatan Kerusakan | ❌ | Deskripsi kerusakan |

4. Klik **"Kirim Perbaikan"**
5. Status aset berubah menjadi "Repair"

### 6.6 Complete Repair (Selesai Perbaikan)

Untuk mencatat aset yang sudah selesai diperbaiki:

1. Buka menu **"Transaksi"**
2. Klik tab **"Complete Repair"**
3. Isi form:

| Field | Wajib | Keterangan |
|-------|-------|------------|
| Pilih Aset | ✅ | Aset dengan status Repair |
| Lokasi Kembali | ✅ | Lokasi penyimpanan |
| Biaya Aktual | ❌ | Biaya perbaikan sebenarnya |
| Catatan | ❌ | Hasil perbaikan |

4. Klik **"Selesai Perbaikan"**
5. Status aset berubah menjadi "Available"

### 6.7 Dispose (Hapuskan Aset) - Admin Only

Untuk menghapuskan/membuang aset:

1. Buka menu **"Transaksi"**
2. Klik tab **"Dispose"**
3. Isi form:

| Field | Wajib | Keterangan |
|-------|-------|------------|
| Pilih Aset | ✅ | Aset yang akan dibuang |
| Alasan | ✅ | Alasan penghapusan |
| Nilai Disposal | ❌ | Nilai jual/sisa (jika ada) |
| Catatan | ❌ | Catatan tambahan |

4. Klik **"Dispose"**
5. Status aset berubah menjadi "Retired"

> ⚠️ **Peringatan:** Aset yang sudah di-dispose tidak bisa dikembalikan ke status lain.

### 6.8 Riwayat Transaksi

Untuk melihat semua riwayat transaksi:

1. Buka menu **"Transaksi"** → **"Riwayat"**
2. Gunakan filter untuk mempersempit pencarian:
   - Filter berdasarkan jenis transaksi
   - Filter berdasarkan rentang tanggal
   - Filter berdasarkan aset

---

## 7. Manajemen Kategori

Kategori digunakan untuk mengelompokkan aset berdasarkan jenisnya.

### 7.1 Melihat Daftar Kategori

1. Buka menu **"Master Data"** → **"Kategori"**
2. Daftar kategori akan muncul

### 7.2 Menambah Kategori (Admin Only)

1. Klik **"+ Tambah Kategori"**
2. Isi form:

| Field | Wajib | Keterangan |
|-------|-------|------------|
| Nama Kategori | ✅ | Nama kategori (unik) |
| Deskripsi | ❌ | Penjelasan kategori |
| Rate Depresiasi | ❌ | Persentase penyusutan per tahun (default 10%) |

3. Klik **"Simpan"**

### 7.3 Mengedit Kategori (Admin Only)

1. Klik **"✏️ Edit"** pada baris kategori
2. Ubah data yang diperlukan
3. Klik **"Update"**

### 7.4 Menghapus Kategori (Admin Only)

1. Klik **"🗑 Delete"** pada baris kategori
2. Konfirmasi penghapusan

> ⚠️ **Catatan:** Kategori yang memiliki aset tidak bisa dihapus.

### 7.5 Kategori Default

Sistem menyediakan kategori default:

| Kategori | Deskripsi | Depresiasi |
|----------|-----------|------------|
| Laptop | Komputer portabel | 10%/tahun |
| Desktop | Komputer meja | 10%/tahun |
| Monitor | Layar komputer | 15%/tahun |
| Printer | Perangkat cetak | 20%/tahun |
| Network Equipment | Router, Switch, dll | 15%/tahun |
| Peripherals | Mouse, Keyboard, dll | 25%/tahun |
| Server | Server komputer | 10%/tahun |
| Software | Lisensi software | 33%/tahun |

---

## 8. Manajemen Lokasi

Lokasi digunakan untuk mencatat tempat penyimpanan aset.

### 8.1 Melihat Daftar Lokasi

1. Buka menu **"Master Data"** → **"Lokasi"**
2. Daftar lokasi akan muncul

### 8.2 Menambah Lokasi (Admin Only)

1. Klik **"+ Tambah Lokasi"**
2. Isi form:

| Field | Wajib | Keterangan |
|-------|-------|------------|
| Nama Lokasi | ✅ | Nama lokasi (unik) |
| Gedung | ❌ | Nama gedung |
| Lantai | ❌ | Nomor lantai |
| Nomor Ruangan | ❌ | Nomor ruangan |
| Alamat | ❌ | Alamat lengkap |
| Aktif | ✅ | Status aktif/non-aktif |

3. Klik **"Simpan"**

### 8.3 Melihat Aset di Lokasi

1. Klik **"👁 View"** pada baris lokasi
2. Daftar aset yang ada di lokasi tersebut akan muncul

### 8.4 Mengedit Lokasi (Admin Only)

1. Klik **"✏️ Edit"** pada baris lokasi
2. Ubah data yang diperlukan
3. Klik **"Update"**

### 8.5 Menghapus Lokasi (Admin Only)

1. Klik **"🗑 Delete"** pada baris lokasi
2. Konfirmasi penghapusan

> ⚠️ **Catatan:** Lokasi yang memiliki aset tidak bisa dihapus.

---

## 9. Manajemen User

### 9.1 Melihat Daftar User

1. Buka menu **"User"**
2. Daftar semua user akan muncul

### 9.2 Menambah User Baru (Admin Only)

1. Klik **"+ Tambah User"**
2. Isi form:

| Field | Wajib | Keterangan |
|-------|-------|------------|
| Nama | ✅ | Nama lengkap |
| Email | ✅ | Email (untuk login) |
| Password | ✅ | Minimal 6 karakter |
| Konfirmasi Password | ✅ | Harus sama dengan password |
| Role | ✅ | Admin / Staff / Employee |
| Departemen | ❌ | Nama departemen |
| No. Telepon | ❌ | Nomor telepon |

3. Klik **"Simpan"**

### 9.3 Melihat Aset User

1. Klik **"👁 View"** pada baris user
2. Detail user dan daftar aset yang dipinjam akan muncul

### 9.4 Mengedit User (Admin Only)

1. Klik **"✏️ Edit"** pada baris user
2. Ubah data yang diperlukan
3. Klik **"Update"**

> ⚠️ **Catatan:** Kosongkan field password jika tidak ingin mengubah password.

### 9.5 Menonaktifkan User (Admin Only)

1. Klik **"✏️ Edit"** pada baris user
2. Ubah status **"Aktif"** menjadi **"Non-Aktif"**
3. Klik **"Update"**

User yang dinonaktifkan tidak bisa login, tetapi data tetap tersimpan.

### 9.6 Menghapus User (Admin Only)

1. Klik **"🗑 Delete"** pada baris user
2. Konfirmasi penghapusan

> ⚠️ **Catatan:** User yang memiliki aset dipinjam harus mengembalikan dulu sebelum dihapus.

---

## 10. Laporan & Export

### 10.1 Melihat Laporan

1. Buka menu **"Laporan"**
2. Pilih jenis laporan:
   - Laporan Aset
   - Laporan Transaksi
   - Laporan per Kategori
   - Laporan per Lokasi

### 10.2 Filter Laporan

Gunakan filter untuk menyaring data:
- **Periode:** Pilih rentang tanggal
- **Kategori:** Filter berdasarkan kategori
- **Lokasi:** Filter berdasarkan lokasi
- **Status:** Filter berdasarkan status aset

### 10.3 Export ke Excel

1. Siapkan filter sesuai kebutuhan
2. Klik tombol **"📥 Export Excel"**
3. File `.xlsx` akan otomatis diunduh

### 10.4 Export ke PDF

1. Siapkan filter sesuai kebutuhan
2. Klik tombol **"📥 Export PDF"**
3. File `.pdf` akan otomatis diunduh

### 10.5 Jenis Laporan

#### Laporan Aset
- Daftar semua aset beserta detailnya
- Termasuk informasi kategori, lokasi, status
- Nilai pembelian dan nilai buku saat ini

#### Laporan Transaksi
- Riwayat semua transaksi
- Filter berdasarkan jenis dan periode
- Termasuk user yang terlibat

#### Laporan Kategori
- Jumlah aset per kategori
- Total nilai per kategori
- Statistik status per kategori

#### Laporan Lokasi
- Jumlah aset per lokasi
- Distribusi status per lokasi

---

## 11. Pengaturan Profil

### 11.1 Melihat Profil

1. Klik nama Anda di pojok kanan atas
2. Pilih **"Profil"**
3. Informasi profil akan muncul

### 11.2 Mengubah Profil

1. Buka halaman profil
2. Klik **"Edit Profil"**
3. Ubah data:
   - Nama
   - Departemen
   - Nomor Telepon
4. Klik **"Simpan"**

### 11.3 Mengubah Password

1. Buka halaman profil
2. Klik **"Ubah Password"**
3. Isi form:
   - Password Lama
   - Password Baru
   - Konfirmasi Password Baru
4. Klik **"Simpan"**

---

## 12. FAQ & Troubleshooting

### 12.1 Pertanyaan Umum

#### Q: Bagaimana cara reset password?
**A:** Hubungi Administrator untuk reset password Anda.

#### Q: Mengapa tidak bisa menghapus aset?
**A:** Aset yang sedang dipinjam (status Assigned) tidak bisa dihapus. Kembalikan aset terlebih dahulu.

#### Q: Mengapa tidak bisa menghapus kategori?
**A:** Kategori yang memiliki aset tidak bisa dihapus. Pindahkan atau hapus aset terlebih dahulu.

#### Q: Bagaimana cara melihat riwayat aset?
**A:** Buka detail aset dengan klik View, lalu scroll ke bagian "Riwayat Transaksi".

#### Q: Apa itu nilai buku (book value)?
**A:** Nilai buku adalah nilai aset setelah dikurangi penyusutan (depresiasi) berdasarkan umur aset.

### 12.2 Troubleshooting

#### Masalah: Tidak bisa login
**Solusi:**
1. Pastikan email dan password benar
2. Pastikan CAPS LOCK tidak aktif
3. Clear cache browser
4. Coba browser lain
5. Hubungi Administrator jika masih gagal

#### Masalah: Session expired / Token error
**Solusi:**
1. Login ulang
2. Clear cookies browser
3. Pastikan waktu komputer akurat

#### Masalah: Data tidak muncul
**Solusi:**
1. Refresh halaman (F5)
2. Periksa filter yang aktif
3. Clear cache browser (Ctrl+Shift+Delete)

#### Masalah: Export gagal
**Solusi:**
1. Pastikan ada data untuk di-export
2. Periksa popup blocker browser
3. Coba kurangi jumlah data dengan filter
4. Gunakan browser Chrome/Firefox

#### Masalah: Halaman loading terus
**Solusi:**
1. Periksa koneksi internet
2. Refresh halaman
3. Clear cache browser
4. Hubungi Administrator jika server bermasalah

### 12.3 Kontak Support

Jika mengalami masalah yang tidak bisa diselesaikan:

- **Email:** it-support@company.com
- **Telepon:** (021) 123-4567
- **Jam Kerja:** Senin-Jumat, 08:00-17:00 WIB

---

## 📝 Changelog

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 1.0.0 | Des 2024 | Rilis awal |

---

## 📄 Lisensi

© 2024 IT Asset Management System. All rights reserved.

---

**Terima kasih telah menggunakan IT Asset Management System!**
