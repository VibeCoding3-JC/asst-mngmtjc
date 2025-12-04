# IT Asset Management System (ITAM)

![CI Tests](https://github.com/VibeCoding3-JC/asst-mngmtjc/actions/workflows/ci-test.yml/badge.svg)

Sistem manajemen aset IT berbasis web untuk mengelola inventaris perangkat IT perusahaan.

## 🚀 Tech Stack

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js 5.x
- **Database:** MySQL 8.0 + Sequelize ORM
- **Authentication:** JWT (Access + Refresh Token)
- **Password Hashing:** Argon2
- **Validation:** Joi

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Icons:** Heroicons
- **Testing:** Vitest + React Testing Library

## 📋 Features

- ✅ User authentication & authorization (Admin, Staff, Employee)
- ✅ Asset management (CRUD, search, filter)
- ✅ Transaction management (Checkout, Checkin, Transfer, Repair)
- ✅ Category & Location management
- ✅ Dashboard with statistics & charts
- ✅ Reports with PDF & Excel export
- ✅ Audit trail for all transactions

## 🛠️ Installation

### Prerequisites
- Node.js 20+
- MySQL 8.0+
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Run database seeder
npm run seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with API URL

# Start development server
npm run dev
```

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Tests
```bash
cd frontend
npm run test:e2e
```

## 📁 Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & validation middleware
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── tests/           # Jest tests
│
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios configuration
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   ├── utils/       # Helper functions
│   │   └── test/        # Vitest tests
│   └── e2e/             # Playwright E2E tests
│
└── .github/
    └── workflows/       # GitHub Actions CI/CD
```

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |
| Staff | staff@company.com | staff123 |

## 📊 API Documentation

API endpoints are available at `http://localhost:5000/api/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/logout | User logout |
| GET | /api/auth/me | Get current user |
| GET | /api/assets | Get all assets |
| POST | /api/assets | Create new asset |
| GET | /api/assets/:id | Get asset by ID |
| PUT | /api/assets/:id | Update asset |
| DELETE | /api/assets/:id | Delete asset |
| POST | /api/transactions/checkout | Checkout asset |
| POST | /api/transactions/checkin | Checkin asset |
| GET | /api/dashboard | Get dashboard stats |

## 📝 License

MIT License

## 👥 Contributors

- Your Name (@yourusername)
