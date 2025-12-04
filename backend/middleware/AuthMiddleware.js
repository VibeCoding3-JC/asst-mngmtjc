import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/ResponseFormatter.js";

/**
 * Verify Access Token Middleware
 * Memverifikasi JWT token dari Authorization header
 */
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json(
            errorResponse("Akses ditolak. Token tidak ditemukan.", "NO_TOKEN")
        );
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json(
                    errorResponse("Token sudah kadaluarsa", "TOKEN_EXPIRED")
                );
            }
            return res.status(403).json(
                errorResponse("Token tidak valid", "INVALID_TOKEN")
            );
        }

        // Attach user data ke request
        req.userId = decoded.userId;
        req.userUuid = decoded.uuid;
        req.userEmail = decoded.email;
        req.userRole = decoded.role;
        req.userName = decoded.name;

        next();
    });
};

/**
 * Check Role Middleware
 * Memvalidasi role user terhadap required roles
 * @param  {string[]|...string} allowedRoles - Roles yang diizinkan (array atau spread)
 */
export const checkRole = (...allowedRoles) => {
    // Handle jika dipanggil dengan array: checkRole(["admin", "staff"])
    const roles = Array.isArray(allowedRoles[0]) ? allowedRoles[0] : allowedRoles;
    
    return (req, res, next) => {
        if (!req.userRole) {
            return res.status(403).json(
                errorResponse("Akses ditolak. Role tidak ditemukan.", "NO_ROLE")
            );
        }

        if (!roles.includes(req.userRole)) {
            return res.status(403).json(
                errorResponse(
                    `Akses ditolak. Role '${req.userRole}' tidak memiliki izin untuk aksi ini.`,
                    "FORBIDDEN"
                )
            );
        }

        next();
    };
};

/**
 * Optional Auth Middleware
 * Menambahkan user data jika token ada, tapi tidak wajib
 */
export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return next();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (!err) {
            req.userId = decoded.userId;
            req.userUuid = decoded.uuid;
            req.userEmail = decoded.email;
            req.userRole = decoded.role;
            req.userName = decoded.name;
        }
        next();
    });
};
