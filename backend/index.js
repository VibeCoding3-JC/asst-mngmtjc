import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import db from "./config/Database.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (process.env.NODE_ENV === "development") {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
        next();
    });
}

// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "IT Asset Management API is running",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    });
});

// API Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "API is healthy",
        database: "connected",
        uptime: process.uptime()
    });
});

// TODO: Import and use routes here
import AuthRoutes from "./routes/AuthRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import CategoryRoutes from "./routes/CategoryRoutes.js";
import LocationRoutes from "./routes/LocationRoutes.js";
import AssetRoutes from "./routes/AssetRoutes.js";
import TransactionRoutes from "./routes/TransactionRoutes.js";
import DashboardRoutes from "./routes/DashboardRoutes.js";

app.use("/api/auth", AuthRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/locations", LocationRoutes);
app.use("/api/assets", AssetRoutes);
app.use("/api/transactions", TransactionRoutes);
app.use("/api/dashboard", DashboardRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.method} ${req.path} tidak ditemukan`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
});

// Database Connection and Server Start
const startServer = async () => {
    try {
        // Test database connection
        await db.authenticate();
        console.log("✅ Database connection established successfully.");

        // Sync database (development only)
        // In production, use migrations instead
        if (process.env.NODE_ENV === "development") {
            // await db.sync({ alter: true });
            // console.log("✅ Database synchronized.");
        }

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV}`);
            console.log(`🔗 API URL: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error.message);
        console.log("⚠️  Server will start without database connection...");
        
        // Start server anyway for development
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT} (without DB)`);
        });
    }
};

startServer();

export default app;
