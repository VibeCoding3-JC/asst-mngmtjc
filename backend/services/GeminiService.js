import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use Gemini 2.0 Flash model
const MODEL_NAME = "gemini-2.0-flash-exp";

// Database schema context untuk Gemini
const DATABASE_SCHEMA = `
DATABASE SCHEMA - IT Asset Management System:

TABLE: assets
- id (INT, Primary Key, Auto Increment)
- uuid (VARCHAR) - Unique identifier untuk API
- asset_code (VARCHAR) - Kode aset unik, format: XXX-YYYY-NNNNN (contoh: LAP-2024-00001)
- name (VARCHAR) - Nama aset (contoh: "Laptop Dell XPS 15")
- category_id (INT, Foreign Key -> categories.id) - Relasi ke kategori
- location_id (INT, Foreign Key -> locations.id) - Relasi ke lokasi
- current_holder_id (INT, Foreign Key -> users.id, NULLABLE) - User yang memegang aset saat ini
- serial_number (VARCHAR, NULLABLE) - Nomor seri dari pabrik
- brand (VARCHAR, NULLABLE) - Merek aset
- model (VARCHAR, NULLABLE) - Model/tipe aset
- specifications (TEXT, NULLABLE) - Spesifikasi teknis
- status (ENUM: 'available', 'assigned', 'repair', 'retired') - Status aset:
  * 'available' = Tersedia untuk dipinjam
  * 'assigned' = Sedang dipinjam/digunakan user
  * 'repair' = Sedang dalam perbaikan
  * 'retired' = Sudah dihapuskan/dibuang
- purchase_date (DATE, NULLABLE) - Tanggal pembelian
- purchase_price (DECIMAL, NULLABLE) - Harga pembelian dalam Rupiah
- vendor (VARCHAR, NULLABLE) - Nama vendor/supplier
- warranty_end (DATE, NULLABLE) - Tanggal akhir garansi
- notes (TEXT, NULLABLE) - Catatan tambahan
- created_at (DATETIME) - Waktu dibuat
- updated_at (DATETIME) - Waktu terakhir diupdate

TABLE: categories
- id (INT, Primary Key)
- uuid (VARCHAR) - Unique identifier
- name (VARCHAR) - Nama kategori (contoh: "Laptop", "Monitor", "Printer", "Network Equipment")
- description (TEXT, NULLABLE) - Deskripsi kategori
- depreciation_rate (DECIMAL, DEFAULT 10) - Rate depresiasi per tahun dalam persen
- created_at, updated_at (DATETIME)

TABLE: locations
- id (INT, Primary Key)
- uuid (VARCHAR) - Unique identifier
- name (VARCHAR) - Nama lokasi (contoh: "Kantor Pusat", "Gudang IT")
- building (VARCHAR, NULLABLE) - Nama gedung
- floor (VARCHAR, NULLABLE) - Lantai
- room_number (VARCHAR, NULLABLE) - Nomor ruangan
- address (TEXT, NULLABLE) - Alamat lengkap
- is_active (BOOLEAN, DEFAULT true) - Status aktif lokasi
- created_at, updated_at (DATETIME)

TABLE: users
- id (INT, Primary Key)
- uuid (VARCHAR) - Unique identifier
- name (VARCHAR) - Nama lengkap user
- email (VARCHAR) - Email user (untuk login)
- role (ENUM: 'admin', 'staff', 'employee') - Role user:
  * 'admin' = Administrator dengan akses penuh
  * 'staff' = Staff IT yang mengelola aset
  * 'employee' = Karyawan biasa yang meminjam aset
- department (VARCHAR, NULLABLE) - Departemen/divisi user
- phone (VARCHAR, NULLABLE) - Nomor telepon
- is_active (BOOLEAN, DEFAULT true) - Status aktif user
- created_at, updated_at (DATETIME)
-- CATATAN: Kolom password dan refresh_token TIDAK BOLEH di-query

TABLE: transactions
- id (INT, Primary Key)
- uuid (VARCHAR) - Unique identifier
- asset_id (INT, Foreign Key -> assets.id) - Aset yang terlibat
- action_type (ENUM: 'checkout', 'checkin', 'transfer', 'repair', 'repair_complete', 'dispose') - Jenis transaksi:
  * 'checkout' = Peminjaman aset ke user
  * 'checkin' = Pengembalian aset dari user
  * 'transfer' = Pemindahan aset ke lokasi lain
  * 'repair' = Pengiriman aset untuk perbaikan
  * 'repair_complete' = Aset selesai diperbaiki
  * 'dispose' = Penghapusan/pembuangan aset
- user_id (INT, Foreign Key -> users.id, NULLABLE) - User yang terlibat dalam transaksi
- admin_id (INT, Foreign Key -> users.id) - Admin/staff yang memproses transaksi
- transaction_date (DATETIME) - Waktu transaksi
- notes (TEXT, NULLABLE) - Catatan transaksi
- created_at, updated_at (DATETIME)

RELASI ANTAR TABEL:
- assets.category_id -> categories.id (Many-to-One: Banyak aset dalam satu kategori)
- assets.location_id -> locations.id (Many-to-One: Banyak aset di satu lokasi)
- assets.current_holder_id -> users.id (Many-to-One: User bisa memegang banyak aset)
- transactions.asset_id -> assets.id (Many-to-One: Satu aset bisa punya banyak transaksi)
- transactions.user_id -> users.id (Many-to-One: User terlibat dalam transaksi)
- transactions.admin_id -> users.id (Many-to-One: Admin yang memproses)
`;

const SYSTEM_PROMPT = `
Kamu adalah asisten AI untuk IT Asset Management System.
Tugas kamu adalah mengkonversi pertanyaan natural language menjadi SQL query yang valid.

${DATABASE_SCHEMA}

ATURAN KETAT:
1. HANYA generate SELECT statement - TIDAK BOLEH ada INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, EXEC, atau statement lain
2. Selalu gunakan LIMIT maksimal 100 untuk mencegah query terlalu besar
3. JANGAN PERNAH query kolom: password, refresh_token
4. Gunakan JOIN yang appropriate untuk menampilkan data yang berhubungan
5. Gunakan alias tabel untuk query yang kompleks (a untuk assets, c untuk categories, l untuk locations, u untuk users, t untuk transactions)
6. Untuk pertanyaan tentang "siapa", "user", "karyawan" - gunakan tabel users
7. Untuk pertanyaan tentang "dimana", "lokasi" - gunakan tabel locations
8. Untuk pertanyaan tentang "jenis", "tipe", "kategori" - gunakan tabel categories
9. Untuk pertanyaan tentang "riwayat", "history", "transaksi" - gunakan tabel transactions
10. Format angka/harga dalam Rupiah jika diminta

FORMAT RESPONSE (WAJIB dalam JSON valid):
{
  "sql": "SELECT ... FROM ... LIMIT 100",
  "explanation": "Penjelasan singkat dalam bahasa Indonesia tentang apa yang dicari",
  "resultType": "table|number|list"
}

TIPE HASIL:
- "number": Untuk hasil COUNT, SUM, AVG, atau single value
- "list": Untuk daftar sederhana (1-2 kolom)
- "table": Untuk hasil dengan banyak kolom

CONTOH:

User: "Berapa total aset yang ada?"
Response:
{
  "sql": "SELECT COUNT(*) as total_aset FROM assets",
  "explanation": "Menghitung jumlah total semua aset yang terdaftar di sistem",
  "resultType": "number"
}

User: "Tampilkan laptop yang sedang dipinjam"
Response:
{
  "sql": "SELECT a.asset_code, a.name, a.brand, a.model, u.name as pemegang, u.department FROM assets a JOIN categories c ON a.category_id = c.id LEFT JOIN users u ON a.current_holder_id = u.id WHERE c.name LIKE '%Laptop%' AND a.status = 'assigned' LIMIT 100",
  "explanation": "Menampilkan daftar laptop yang sedang dipinjam beserta informasi pemegang",
  "resultType": "table"
}

User: "Siapa yang paling banyak meminjam aset?"
Response:
{
  "sql": "SELECT u.name, u.department, COUNT(a.id) as jumlah_aset FROM users u JOIN assets a ON u.id = a.current_holder_id WHERE a.status = 'assigned' GROUP BY u.id, u.name, u.department ORDER BY jumlah_aset DESC LIMIT 10",
  "explanation": "Menampilkan daftar user dengan jumlah aset yang dipinjam, diurutkan dari yang terbanyak",
  "resultType": "table"
}

User: "Berapa nilai total aset per kategori?"
Response:
{
  "sql": "SELECT c.name as kategori, COUNT(a.id) as jumlah_aset, SUM(a.purchase_price) as total_nilai FROM categories c LEFT JOIN assets a ON c.id = a.category_id GROUP BY c.id, c.name ORDER BY total_nilai DESC",
  "explanation": "Menampilkan total nilai aset yang dikelompokkan berdasarkan kategori",
  "resultType": "table"
}

Jika pertanyaan tidak berhubungan dengan data aset atau tidak bisa dikonversi ke SQL, response:
{
  "sql": null,
  "explanation": "Maaf, saya hanya bisa menjawab pertanyaan seputar data aset, kategori, lokasi, user, dan transaksi. Silakan ajukan pertanyaan yang lebih spesifik.",
  "resultType": "error"
}
`;

/**
 * Generate SQL query from natural language using Gemini
 * @param {string} userMessage - User's question in natural language
 * @returns {Promise<{sql: string|null, explanation: string, resultType: string}>}
 */
export const generateSQLFromNaturalLanguage = async (userMessage) => {
    try {
        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            throw new Error("GEMINI_API_KEY belum dikonfigurasi. Silakan set API key di file .env");
        }

        // Get the model
        const model = genAI.getGenerativeModel({ 
            model: MODEL_NAME,
            generationConfig: {
                temperature: 0.1, // Low temperature for more consistent SQL generation
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 1024,
            }
        });

        // Build the prompt
        const prompt = `${SYSTEM_PROMPT}

User: "${userMessage}"

Response (dalam format JSON yang valid):`;

        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON response
        // Clean up the response - remove markdown code blocks if present
        let cleanedText = text.trim();
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.slice(7);
        } else if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.slice(3);
        }
        if (cleanedText.endsWith('```')) {
            cleanedText = cleanedText.slice(0, -3);
        }
        cleanedText = cleanedText.trim();

        const parsedResponse = JSON.parse(cleanedText);

        return {
            sql: parsedResponse.sql || null,
            explanation: parsedResponse.explanation || "Tidak ada penjelasan",
            resultType: parsedResponse.resultType || "table"
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        
        if (error.message.includes("API key")) {
            throw new Error("API Key Gemini tidak valid atau belum dikonfigurasi");
        }
        
        if (error instanceof SyntaxError) {
            throw new Error("Gagal memproses response dari AI. Silakan coba lagi.");
        }

        throw new Error(`Gagal memproses pertanyaan: ${error.message}`);
    }
};

/**
 * Format query results into natural language response
 * @param {string} question - Original question
 * @param {any} results - Query results
 * @param {string} resultType - Type of result (number, list, table)
 * @returns {Promise<string>}
 */
export const formatResultsToNaturalLanguage = async (question, results, resultType) => {
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            // Return simple formatting if no API key
            return null;
        }

        const model = genAI.getGenerativeModel({ 
            model: MODEL_NAME,
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 256,
            }
        });

        const prompt = `
Kamu adalah asisten IT Asset Management. 
Berikan ringkasan singkat (1-2 kalimat) dalam bahasa Indonesia yang natural untuk hasil query berikut.

Pertanyaan user: "${question}"
Hasil query (JSON): ${JSON.stringify(results).substring(0, 1000)}
Tipe hasil: ${resultType}

Ringkasan (langsung jawab tanpa "Berikut adalah..." atau "Berdasarkan data..."):`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();

    } catch (error) {
        console.error("Format results error:", error);
        return null;
    }
};

export default {
    generateSQLFromNaturalLanguage,
    formatResultsToNaturalLanguage
};
