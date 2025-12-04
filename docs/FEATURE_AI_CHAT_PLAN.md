# 🤖 Feature Plan: AI Chat Query dengan Gemini 2.0 Flash

**Branch:** `feature/ai-chat-query`  
**Tanggal:** Desember 2024  
**Status:** 📋 Planning

---

## 📋 Overview

### Deskripsi Fitur
Fitur chat AI yang memungkinkan user melakukan query database menggunakan natural language. User dapat bertanya tentang data aset dalam bahasa Indonesia/Inggris, dan sistem akan menggunakan Gemini 2.0 Flash untuk:
1. Memahami pertanyaan user
2. Mengkonversi ke SQL query yang aman
3. Mengeksekusi query dan menampilkan hasil dalam format yang mudah dipahami

### Contoh Use Case
| Pertanyaan User | Hasil |
|-----------------|-------|
| "Berapa total aset yang tersedia?" | "Terdapat 80 aset dengan status tersedia" |
| "Tampilkan laptop yang sedang dipinjam" | Tabel laptop dengan status assigned |
| "Siapa yang meminjam paling banyak aset?" | "John Doe (IT) meminjam 5 aset" |
| "Aset apa yang garansinya akan habis bulan ini?" | Daftar aset dengan warranty_end di bulan ini |
| "Berapa nilai total aset per kategori?" | Chart/tabel nilai per kategori |

---

## 🏗️ Arsitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Chat Component                        │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │  Chat Messages (history)                         │    │    │
│  │  │  - User message                                  │    │    │
│  │  │  - AI response (text/table/chart)                │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │  Input: "Berapa laptop yang tersedia?"          │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  POST /api/chat/query                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               ChatController.js                          │    │
│  │  1. Validate user message                                │    │
│  │  2. Get database schema context                          │    │
│  │  3. Build prompt for Gemini                              │    │
│  │  4. Call Gemini API                                      │    │
│  │  5. Parse & validate SQL from response                   │    │
│  │  6. Execute safe SQL query                               │    │
│  │  7. Format results                                       │    │
│  │  8. Return response                                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  Gemini 2.0 Flash API                    │    │
│  │  - Analyze natural language                              │    │
│  │  - Generate SQL query                                    │    │
│  │  - Format response                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    MySQL Database                        │    │
│  │  - Execute READ-ONLY queries                             │    │
│  │  - Return results                                        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Security Considerations

### SQL Injection Prevention
1. **Whitelist Query Types** - Hanya izinkan SELECT statement
2. **Blacklist Keywords** - Block: DROP, DELETE, UPDATE, INSERT, ALTER, TRUNCATE, EXEC
3. **Query Validation** - Parse SQL sebelum eksekusi
4. **Read-Only Connection** - Gunakan database user dengan READ-ONLY privilege
5. **Query Timeout** - Limit 5 detik per query
6. **Result Limit** - Maximum 100 rows per query

### Rate Limiting
- Maximum 20 queries per user per menit
- Maximum 100 queries per user per hari

### Data Privacy
- Jangan expose password, refresh_token di response
- Filter sensitive columns

---

## 📁 File Structure

```
backend/
├── controllers/
│   └── ChatController.js          # Handle chat requests
├── services/
│   └── GeminiService.js           # Gemini API integration
├── utils/
│   └── QueryValidator.js          # SQL validation & sanitization
├── routes/
│   └── ChatRoutes.js              # Chat API routes
└── prompts/
    └── sqlGeneratorPrompt.js      # Prompt template for Gemini

frontend/
├── src/
│   ├── pages/
│   │   └── chat/
│   │       └── ChatPage.jsx       # Main chat page
│   ├── components/
│   │   └── chat/
│   │       ├── ChatContainer.jsx  # Chat wrapper
│   │       ├── ChatMessage.jsx    # Single message component
│   │       ├── ChatInput.jsx      # Input component
│   │       ├── ResultTable.jsx    # Table display for results
│   │       └── ResultChart.jsx    # Chart display for results
│   └── services/
│       └── chatApi.js             # Chat API calls
```

---

## 📝 Development Tasks

### Phase 1: Backend Setup (Estimasi: 2-3 jam)

#### 1.1 Environment & Dependencies
- [ ] Add `@google/generative-ai` package
- [ ] Add `GEMINI_API_KEY` to .env
- [ ] Create GeminiService.js

#### 1.2 Database Schema Context
- [ ] Create function to get database schema
- [ ] Build schema description for Gemini prompt
- [ ] Include table relationships

#### 1.3 Prompt Engineering
- [ ] Create SQL generator prompt template
- [ ] Include database schema context
- [ ] Add safety instructions
- [ ] Add response format instructions

#### 1.4 Query Validator
- [ ] Create QueryValidator utility
- [ ] Implement SQL parsing
- [ ] Implement blacklist check
- [ ] Implement whitelist validation
- [ ] Add query sanitization

#### 1.5 Chat Controller
- [ ] Create processQuery endpoint
- [ ] Implement Gemini integration
- [ ] Implement query execution
- [ ] Implement result formatting
- [ ] Add error handling

#### 1.6 Routes & Middleware
- [ ] Create ChatRoutes.js
- [ ] Add rate limiting middleware
- [ ] Register routes in index.js

### Phase 2: Frontend Setup (Estimasi: 2-3 jam)

#### 2.1 Chat Page & Components
- [ ] Create ChatPage.jsx
- [ ] Create ChatContainer.jsx
- [ ] Create ChatMessage.jsx
- [ ] Create ChatInput.jsx
- [ ] Add loading states

#### 2.2 Result Display
- [ ] Create ResultTable.jsx for tabular data
- [ ] Create ResultChart.jsx for chart data
- [ ] Smart result type detection

#### 2.3 Chat History
- [ ] Implement local storage for chat history
- [ ] Add clear history button
- [ ] Add example queries

#### 2.4 UI/UX
- [ ] Responsive design
- [ ] Keyboard shortcuts (Enter to send)
- [ ] Auto-scroll to latest message
- [ ] Copy result button

### Phase 3: Integration & Testing (Estimasi: 1-2 jam)

#### 3.1 Integration
- [ ] Connect frontend to backend
- [ ] Test end-to-end flow
- [ ] Handle errors gracefully

#### 3.2 Testing
- [ ] Test various query types
- [ ] Test edge cases
- [ ] Test security (SQL injection attempts)
- [ ] Test rate limiting

#### 3.3 Documentation
- [ ] Add API documentation
- [ ] Add user guide for chat feature
- [ ] Update README

---

## 📊 Database Schema untuk Prompt

```sql
-- Tables available for query:

TABLE: assets
- id (INT, PK)
- uuid (VARCHAR)
- asset_code (VARCHAR) - Format: XXX-YYYY-NNNNN
- name (VARCHAR) - Nama aset
- category_id (INT, FK -> categories)
- location_id (INT, FK -> locations)
- current_holder_id (INT, FK -> users) - User yang memegang aset
- serial_number (VARCHAR)
- brand (VARCHAR)
- model (VARCHAR)
- specifications (TEXT)
- status (ENUM: available, assigned, repair, retired)
- purchase_date (DATE)
- purchase_price (DECIMAL)
- vendor (VARCHAR)
- warranty_end (DATE)
- notes (TEXT)
- created_at, updated_at

TABLE: categories
- id (INT, PK)
- uuid (VARCHAR)
- name (VARCHAR) - Nama kategori (Laptop, Monitor, dll)
- description (TEXT)
- depreciation_rate (DECIMAL) - Rate depresiasi per tahun

TABLE: locations
- id (INT, PK)
- uuid (VARCHAR)
- name (VARCHAR) - Nama lokasi
- building (VARCHAR)
- floor (VARCHAR)
- room_number (VARCHAR)
- address (TEXT)
- is_active (BOOLEAN)

TABLE: users
- id (INT, PK)
- uuid (VARCHAR)
- name (VARCHAR)
- email (VARCHAR)
- role (ENUM: admin, staff, employee)
- department (VARCHAR)
- phone (VARCHAR)
- is_active (BOOLEAN)

TABLE: transactions
- id (INT, PK)
- uuid (VARCHAR)
- asset_id (INT, FK -> assets)
- action_type (ENUM: checkout, checkin, transfer, repair, repair_complete, dispose)
- user_id (INT, FK -> users) - User terkait transaksi
- admin_id (INT, FK -> users) - Admin yang memproses
- transaction_date (DATETIME)
- notes (TEXT)

-- Relationships:
-- assets.category_id -> categories.id
-- assets.location_id -> locations.id
-- assets.current_holder_id -> users.id
-- transactions.asset_id -> assets.id
-- transactions.user_id -> users.id
-- transactions.admin_id -> users.id
```

---

## 🎯 Gemini Prompt Template

```javascript
const systemPrompt = `
Kamu adalah asisten AI untuk IT Asset Management System. 
Tugas kamu adalah mengkonversi pertanyaan natural language menjadi SQL query.

DATABASE SCHEMA:
${databaseSchema}

RULES:
1. Hanya generate SELECT statement
2. Jangan pernah generate DROP, DELETE, UPDATE, INSERT, ALTER, TRUNCATE
3. Selalu limit hasil maksimal 100 rows
4. Jangan expose kolom: password, refresh_token
5. Gunakan JOIN yang appropriate untuk relasi antar tabel
6. Format response dalam JSON:
{
  "sql": "SELECT ...",
  "explanation": "Penjelasan query dalam bahasa Indonesia",
  "resultType": "table|number|list|chart"
}

CONTOH:
User: "Berapa total laptop yang tersedia?"
Response: {
  "sql": "SELECT COUNT(*) as total FROM assets a JOIN categories c ON a.category_id = c.id WHERE c.name = 'Laptop' AND a.status = 'available'",
  "explanation": "Menghitung jumlah laptop dengan status tersedia",
  "resultType": "number"
}
`;
```

---

## 🔄 API Endpoints

### POST /api/chat/query

**Request:**
```json
{
  "message": "Berapa total aset yang tersedia?"
}
```

**Response Success:**
```json
{
  "success": true,
  "data": {
    "query": "Berapa total aset yang tersedia?",
    "sql": "SELECT COUNT(*) as total FROM assets WHERE status = 'available'",
    "explanation": "Menghitung jumlah aset dengan status tersedia",
    "resultType": "number",
    "result": {
      "total": 80
    },
    "executionTime": "45ms"
  }
}
```

**Response Error:**
```json
{
  "success": false,
  "message": "Query tidak dapat diproses",
  "code": "INVALID_QUERY"
}
```

---

## ⏱️ Timeline Estimasi

| Phase | Task | Durasi |
|-------|------|--------|
| 1 | Backend Setup | 2-3 jam |
| 2 | Frontend Setup | 2-3 jam |
| 3 | Integration & Testing | 1-2 jam |
| **Total** | | **5-8 jam** |

---

## ✅ Acceptance Criteria

1. ✅ User dapat mengetik pertanyaan dalam bahasa Indonesia/Inggris
2. ✅ Sistem mengkonversi pertanyaan ke SQL query yang valid
3. ✅ SQL query hanya READ-ONLY (SELECT only)
4. ✅ Hasil ditampilkan dalam format yang sesuai (tabel/angka/chart)
5. ✅ Error handling yang informatif
6. ✅ Rate limiting untuk mencegah abuse
7. ✅ Tidak ada SQL injection vulnerability
8. ✅ Response time < 5 detik

---

## 🚀 Next Steps

Setelah plan disetujui:
1. Mulai dengan Phase 1: Backend Setup
2. Test Gemini API integration
3. Lanjut Phase 2: Frontend
4. Integration & Testing
5. Merge ke main branch

---

**Apakah plan ini sudah sesuai? Jika ya, saya akan mulai coding Phase 1.**
