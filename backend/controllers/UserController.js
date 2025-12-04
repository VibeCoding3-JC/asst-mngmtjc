import { Op } from "sequelize";
import argon2 from "argon2";
import { Users, Assets } from "../models/index.js";
import { successResponse, errorResponse, paginationMeta } from "../utils/ResponseFormatter.js";

/**
 * Get all users with pagination and filters
 */
export const getUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            role = "",
            department = "",
            is_active = ""
        } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = {};

        // Search filter
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        // Role filter
        if (role) {
            whereClause.role = role;
        }

        // Department filter
        if (department) {
            whereClause.department = { [Op.like]: `%${department}%` };
        }

        // Active status filter
        if (is_active !== "") {
            whereClause.is_active = is_active === "true";
        }

        const { count, rows } = await Users.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ["password", "refresh_token"] },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["created_at", "DESC"]]
        });

        res.json(
            successResponse(
                rows,
                "Data user berhasil diambil",
                paginationMeta(page, limit, count)
            )
        );

    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Get user by ID
 */
export const getUserById = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: { uuid: req.params.id },
            attributes: { exclude: ["password", "refresh_token"] }
        });

        if (!user) {
            return res.status(404).json(
                errorResponse("User tidak ditemukan", "USER_NOT_FOUND")
            );
        }

        res.json(successResponse(user, "Data user berhasil diambil"));

    } catch (error) {
        console.error("Get user by id error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Create new user (employee without login access)
 */
export const createUser = async (req, res) => {
    try {
        const { name, email, department, phone, role, password } = req.body;

        // Check if email exists
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json(
                errorResponse("Email sudah terdaftar", "EMAIL_EXISTS")
            );
        }

        // Hash password if provided (for staff/admin)
        let hashedPassword = null;
        if (password && (role === "admin" || role === "staff")) {
            hashedPassword = await argon2.hash(password);
        }

        const user = await Users.create({
            name,
            email,
            password: hashedPassword,
            role: role || "employee",
            department,
            phone,
            is_active: true
        });

        res.status(201).json(
            successResponse({
                uuid: user.uuid,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }, "User berhasil ditambahkan")
        );

    } catch (error) {
        console.error("Create user error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Update user
 */
export const updateUser = async (req, res) => {
    try {
        const user = await Users.findOne({ where: { uuid: req.params.id } });

        if (!user) {
            return res.status(404).json(
                errorResponse("User tidak ditemukan", "USER_NOT_FOUND")
            );
        }

        const { name, email, role, department, phone, is_active, password } = req.body;

        // Check email uniqueness if changed
        if (email && email !== user.email) {
            const existingUser = await Users.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json(
                    errorResponse("Email sudah digunakan user lain", "EMAIL_EXISTS")
                );
            }
        }

        // Update data
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;
        if (department !== undefined) updateData.department = department;
        if (phone !== undefined) updateData.phone = phone;
        if (is_active !== undefined) updateData.is_active = is_active;
        
        // Update password if provided
        if (password) {
            updateData.password = await argon2.hash(password);
        }

        await Users.update(updateData, { where: { id: user.id } });

        const updatedUser = await Users.findOne({
            where: { id: user.id },
            attributes: { exclude: ["password", "refresh_token"] }
        });

        res.json(successResponse(updatedUser, "User berhasil diperbarui"));

    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Delete user (soft delete - set is_active to false)
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await Users.findOne({ where: { uuid: req.params.id } });

        if (!user) {
            return res.status(404).json(
                errorResponse("User tidak ditemukan", "USER_NOT_FOUND")
            );
        }

        // Check if user is holding any assets
        const heldAssets = await Assets.count({ where: { current_holder_id: user.id } });
        if (heldAssets > 0) {
            return res.status(400).json(
                errorResponse(
                    `User masih memegang ${heldAssets} aset. Kembalikan semua aset terlebih dahulu.`,
                    "USER_HAS_ASSETS"
                )
            );
        }

        // Soft delete
        await Users.update({ is_active: false }, { where: { id: user.id } });

        res.json(successResponse(null, "User berhasil dinonaktifkan"));

    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Get assets held by user
 */
export const getUserAssets = async (req, res) => {
    try {
        const user = await Users.findOne({ where: { uuid: req.params.id } });

        if (!user) {
            return res.status(404).json(
                errorResponse("User tidak ditemukan", "USER_NOT_FOUND")
            );
        }

        const assets = await Assets.findAll({
            where: { current_holder_id: user.id },
            include: [
                { association: "category", attributes: ["uuid", "name"] },
                { association: "location", attributes: ["uuid", "name"] }
            ]
        });

        res.json(successResponse(assets, `${assets.length} aset ditemukan`));

    } catch (error) {
        console.error("Get user assets error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};
