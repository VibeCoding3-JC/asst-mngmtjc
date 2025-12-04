import { Op } from "sequelize";
import { Categories, Assets } from "../models/index.js";
import { successResponse, errorResponse, paginationMeta } from "../utils/ResponseFormatter.js";

/**
 * Get all categories with pagination
 */
export const getCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }

        const { count, rows } = await Categories.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["name", "ASC"]]
        });

        // Get asset count per category
        const categoriesWithCount = await Promise.all(
            rows.map(async (category) => {
                const assetCount = await Assets.count({
                    where: { category_id: category.id }
                });
                return {
                    ...category.toJSON(),
                    asset_count: assetCount
                };
            })
        );

        res.json(
            successResponse(
                categoriesWithCount,
                "Data kategori berhasil diambil",
                paginationMeta(page, limit, count)
            )
        );

    } catch (error) {
        console.error("Get categories error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Get all categories (without pagination for dropdowns)
 */
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Categories.findAll({
            order: [["name", "ASC"]]
        });

        res.json(successResponse(categories, "Data kategori berhasil diambil"));

    } catch (error) {
        console.error("Get all categories error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (req, res) => {
    try {
        const category = await Categories.findOne({
            where: { uuid: req.params.id }
        });

        if (!category) {
            return res.status(404).json(
                errorResponse("Kategori tidak ditemukan", "CATEGORY_NOT_FOUND")
            );
        }

        // Get asset count
        const assetCount = await Assets.count({
            where: { category_id: category.id }
        });

        res.json(
            successResponse({
                ...category.toJSON(),
                asset_count: assetCount
            }, "Data kategori berhasil diambil")
        );

    } catch (error) {
        console.error("Get category by id error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Create new category
 */
export const createCategory = async (req, res) => {
    try {
        const { name, description, depreciation_rate } = req.body;

        // Check if name exists
        const existingCategory = await Categories.findOne({ where: { name } });
        if (existingCategory) {
            return res.status(400).json(
                errorResponse("Nama kategori sudah ada", "CATEGORY_EXISTS")
            );
        }

        const category = await Categories.create({
            name,
            description,
            depreciation_rate: depreciation_rate || 10
        });

        res.status(201).json(
            successResponse(category, "Kategori berhasil ditambahkan")
        );

    } catch (error) {
        console.error("Create category error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Update category
 */
export const updateCategory = async (req, res) => {
    try {
        const category = await Categories.findOne({
            where: { uuid: req.params.id }
        });

        if (!category) {
            return res.status(404).json(
                errorResponse("Kategori tidak ditemukan", "CATEGORY_NOT_FOUND")
            );
        }

        const { name, description, depreciation_rate } = req.body;

        // Check name uniqueness if changed
        if (name && name !== category.name) {
            const existingCategory = await Categories.findOne({ where: { name } });
            if (existingCategory) {
                return res.status(400).json(
                    errorResponse("Nama kategori sudah digunakan", "CATEGORY_EXISTS")
                );
            }
        }

        await Categories.update({
            name: name || category.name,
            description: description !== undefined ? description : category.description,
            depreciation_rate: depreciation_rate || category.depreciation_rate
        }, { where: { id: category.id } });

        const updatedCategory = await Categories.findOne({
            where: { id: category.id }
        });

        res.json(successResponse(updatedCategory, "Kategori berhasil diperbarui"));

    } catch (error) {
        console.error("Update category error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Delete category
 */
export const deleteCategory = async (req, res) => {
    try {
        const category = await Categories.findOne({
            where: { uuid: req.params.id }
        });

        if (!category) {
            return res.status(404).json(
                errorResponse("Kategori tidak ditemukan", "CATEGORY_NOT_FOUND")
            );
        }

        // Check if category has assets
        const assetCount = await Assets.count({
            where: { category_id: category.id }
        });

        if (assetCount > 0) {
            return res.status(400).json(
                errorResponse(
                    `Kategori memiliki ${assetCount} aset. Pindahkan atau hapus aset terlebih dahulu.`,
                    "CATEGORY_HAS_ASSETS"
                )
            );
        }

        await Categories.destroy({ where: { id: category.id } });

        res.json(successResponse(null, "Kategori berhasil dihapus"));

    } catch (error) {
        console.error("Delete category error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};
