import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Users } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/ResponseFormatter.js";

/**
 * Register new user (Admin only)
 */
export const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role, department, phone } = req.body;

        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json(
                errorResponse("Password dan konfirmasi password tidak cocok", "PASSWORD_MISMATCH")
            );
        }

        // Check if email already exists
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json(
                errorResponse("Email sudah terdaftar", "EMAIL_EXISTS")
            );
        }

        // Hash password
        const hashedPassword = await argon2.hash(password);

        // Create user
        const user = await Users.create({
            name,
            email,
            password: hashedPassword,
            role: role || "staff",
            department,
            phone,
            is_active: true
        });

        res.status(201).json(
            successResponse({
                uuid: user.uuid,
                name: user.name,
                email: user.email,
                role: user.role
            }, "User berhasil didaftarkan")
        );

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Login user
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await Users.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(401).json(
                errorResponse("Email atau password salah", "INVALID_CREDENTIALS")
            );
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(401).json(
                errorResponse("Akun Anda telah dinonaktifkan", "ACCOUNT_DISABLED")
            );
        }

        // Check if user has password (not just employee)
        if (!user.password) {
            return res.status(401).json(
                errorResponse("Akun ini tidak memiliki akses login", "NO_LOGIN_ACCESS")
            );
        }

        // Verify password
        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword) {
            return res.status(401).json(
                errorResponse("Email atau password salah", "INVALID_CREDENTIALS")
            );
        }

        // Generate tokens
        const accessToken = jwt.sign(
            {
                userId: user.id,
                uuid: user.uuid,
                email: user.email,
                name: user.name,
                role: user.role
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            {
                userId: user.id,
                uuid: user.uuid
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        // Save refresh token to database
        await Users.update(
            { refresh_token: refreshToken },
            { where: { id: user.id } }
        );

        // Set refresh token as HttpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.json(
            successResponse({
                accessToken,
                user: {
                    uuid: user.uuid,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    department: user.department
                }
            }, "Login berhasil")
        );

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Logout user
 */
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(204).send();
        }

        // Find user with this refresh token
        const user = await Users.findOne({
            where: { refresh_token: refreshToken }
        });

        if (!user) {
            // Clear cookie anyway
            res.clearCookie("refreshToken");
            return res.status(204).send();
        }

        // Clear refresh token from database
        await Users.update(
            { refresh_token: null },
            { where: { id: user.id } }
        );

        // Clear cookie
        res.clearCookie("refreshToken");

        res.json(successResponse(null, "Logout berhasil"));

    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json(
                errorResponse("Refresh token tidak ditemukan", "NO_REFRESH_TOKEN")
            );
        }

        // Find user with this refresh token
        const user = await Users.findOne({
            where: { refresh_token: refreshToken }
        });

        if (!user) {
            return res.status(403).json(
                errorResponse("Refresh token tidak valid", "INVALID_REFRESH_TOKEN")
            );
        }

        // Verify refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json(
                    errorResponse("Refresh token expired atau tidak valid", "INVALID_REFRESH_TOKEN")
                );
            }

            // Generate new access token
            const accessToken = jwt.sign(
                {
                    userId: user.id,
                    uuid: user.uuid,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            res.json(
                successResponse({ accessToken }, "Token berhasil diperbarui")
            );
        });

    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Get current logged in user
 */
export const getMe = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: { id: req.userId },
            attributes: ["uuid", "name", "email", "role", "department", "phone", "is_active", "created_at"]
        });

        if (!user) {
            return res.status(404).json(
                errorResponse("User tidak ditemukan", "USER_NOT_FOUND")
            );
        }

        res.json(successResponse(user, "Data user berhasil diambil"));

    } catch (error) {
        console.error("Get me error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};
