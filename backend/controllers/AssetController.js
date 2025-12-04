import { Op } from "sequelize";
import { Assets, Categories, Locations, Users, Transactions } from "../models/index.js";
import { successResponse, errorResponse, paginationMeta } from "../utils/ResponseFormatter.js";

/**
 * Generate unique asset code
 */
const generateAssetCode = async (categoryCode = "AST") => {
    const prefix = categoryCode.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    
    // Get last asset code with same prefix and year
    const lastAsset = await Assets.findOne({
        where: {
            asset_code: {
                [Op.like]: `${prefix}-${year}-%`
            }
        },
        order: [["asset_code", "DESC"]]
    });

    let sequence = 1;
    if (lastAsset) {
        const lastSequence = parseInt(lastAsset.asset_code.split("-")[2]);
        sequence = lastSequence + 1;
    }

    return `${prefix}-${year}-${String(sequence).padStart(5, "0")}`;
};

/**
 * Get all assets with pagination and filters
 */
export const getAssets = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            category = "",
            location = "",
            status = "",
            holder = ""
        } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = {};

        // Search filter
        if (search) {
            whereClause[Op.or] = [
                { asset_code: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` } },
                { serial_number: { [Op.like]: `%${search}%` } }
            ];
        }

        // Status filter
        if (status) {
            whereClause.status = status;
        }

        // Include options
        const includeOptions = [
            { 
                association: "category", 
                attributes: ["uuid", "name"],
                ...(category && { where: { uuid: category } })
            },
            { 
                association: "location", 
                attributes: ["uuid", "name", "address"],
                ...(location && { where: { uuid: location } })
            },
            { 
                association: "holder", 
                attributes: ["uuid", "name", "department"],
                ...(holder && { where: { uuid: holder } })
            }
        ];

        const { count, rows } = await Assets.findAndCountAll({
            where: whereClause,
            include: includeOptions,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["created_at", "DESC"]],
            distinct: true
        });

        res.json(
            successResponse(
                rows,
                "Data aset berhasil diambil",
                paginationMeta(page, limit, count)
            )
        );

    } catch (error) {
        console.error("Get assets error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Get asset by ID
 */
export const getAssetById = async (req, res) => {
    try {
        const asset = await Assets.findOne({
            where: { uuid: req.params.id },
            include: [
                { association: "category", attributes: ["uuid", "name", "depreciation_rate"] },
                { association: "location", attributes: ["uuid", "name", "building", "floor", "room_number"] },
                { association: "holder", attributes: ["uuid", "name", "email", "department", "phone"] }
            ]
        });

        if (!asset) {
            return res.status(404).json(
                errorResponse("Aset tidak ditemukan", "ASSET_NOT_FOUND")
            );
        }

        // Calculate current book value (depreciation)
        const currentValue = calculateBookValue(asset);

        res.json(
            successResponse({
                ...asset.toJSON(),
                current_value: currentValue
            }, "Data aset berhasil diambil")
        );

    } catch (error) {
        console.error("Get asset by id error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Calculate book value based on depreciation
 */
const calculateBookValue = (asset) => {
    if (!asset.purchase_price || !asset.purchase_date) return null;
    
    const rate = asset.category?.depreciation_rate || 10;
    const purchaseDate = new Date(asset.purchase_date);
    const now = new Date();
    const yearsOwned = (now - purchaseDate) / (365.25 * 24 * 60 * 60 * 1000);
    
    const depreciation = asset.purchase_price * (rate / 100) * yearsOwned;
    const currentValue = Math.max(0, asset.purchase_price - depreciation);
    
    return Math.round(currentValue);
};

/**
 * Create new asset
 */
export const createAsset = async (req, res) => {
    try {
        const {
            name,
            category_uuid,
            location_uuid,
            serial_number,
            brand,
            model,
            specifications,
            purchase_date,
            purchase_price,
            vendor,
            warranty_end,
            notes
        } = req.body;

        // Get category
        const category = await Categories.findOne({ where: { uuid: category_uuid } });
        if (!category) {
            return res.status(404).json(
                errorResponse("Kategori tidak ditemukan", "CATEGORY_NOT_FOUND")
            );
        }

        // Get location
        const location = await Locations.findOne({ where: { uuid: location_uuid } });
        if (!location) {
            return res.status(404).json(
                errorResponse("Lokasi tidak ditemukan", "LOCATION_NOT_FOUND")
            );
        }

        // Check serial number uniqueness
        if (serial_number) {
            const existingAsset = await Assets.findOne({ where: { serial_number } });
            if (existingAsset) {
                return res.status(400).json(
                    errorResponse("Serial number sudah terdaftar", "SERIAL_EXISTS")
                );
            }
        }

        // Generate asset code
        const assetCode = await generateAssetCode(category.name);

        const asset = await Assets.create({
            asset_code: assetCode,
            name,
            category_id: category.id,
            location_id: location.id,
            serial_number,
            brand,
            model,
            specifications,
            purchase_date,
            purchase_price,
            vendor,
            warranty_end,
            notes,
            status: "available"
        });

        // Fetch with associations
        const newAsset = await Assets.findOne({
            where: { id: asset.id },
            include: [
                { association: "category", attributes: ["uuid", "name"] },
                { association: "location", attributes: ["uuid", "name", "building"] }
            ]
        });

        res.status(201).json(
            successResponse(newAsset, "Aset berhasil ditambahkan")
        );

    } catch (error) {
        console.error("Create asset error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Update asset
 */
export const updateAsset = async (req, res) => {
    try {
        const asset = await Assets.findOne({ where: { uuid: req.params.id } });

        if (!asset) {
            return res.status(404).json(
                errorResponse("Aset tidak ditemukan", "ASSET_NOT_FOUND")
            );
        }

        const {
            name,
            category_uuid,
            location_uuid,
            serial_number,
            brand,
            model,
            specifications,
            purchase_date,
            purchase_price,
            vendor,
            warranty_end,
            notes,
            status
        } = req.body;

        const updateData = {};

        // Update basic fields
        if (name) updateData.name = name;
        if (brand !== undefined) updateData.brand = brand;
        if (model !== undefined) updateData.model = model;
        if (specifications !== undefined) updateData.specifications = specifications;
        if (purchase_date !== undefined) updateData.purchase_date = purchase_date;
        if (purchase_price !== undefined) updateData.purchase_price = purchase_price;
        if (vendor !== undefined) updateData.vendor = vendor;
        if (warranty_end !== undefined) updateData.warranty_end = warranty_end;
        if (notes !== undefined) updateData.notes = notes;
        if (status) updateData.status = status;

        // Update category if provided
        if (category_uuid) {
            const category = await Categories.findOne({ where: { uuid: category_uuid } });
            if (!category) {
                return res.status(404).json(
                    errorResponse("Kategori tidak ditemukan", "CATEGORY_NOT_FOUND")
                );
            }
            updateData.category_id = category.id;
        }

        // Update location if provided
        if (location_uuid) {
            const location = await Locations.findOne({ where: { uuid: location_uuid } });
            if (!location) {
                return res.status(404).json(
                    errorResponse("Lokasi tidak ditemukan", "LOCATION_NOT_FOUND")
                );
            }
            updateData.location_id = location.id;
        }

        // Check serial number uniqueness if changed
        if (serial_number && serial_number !== asset.serial_number) {
            const existingAsset = await Assets.findOne({ where: { serial_number } });
            if (existingAsset) {
                return res.status(400).json(
                    errorResponse("Serial number sudah digunakan", "SERIAL_EXISTS")
                );
            }
            updateData.serial_number = serial_number;
        }

        await Assets.update(updateData, { where: { id: asset.id } });

        const updatedAsset = await Assets.findOne({
            where: { id: asset.id },
            include: [
                { association: "category", attributes: ["uuid", "name"] },
                { association: "location", attributes: ["uuid", "name", "building"] },
                { association: "holder", attributes: ["uuid", "name", "department"] }
            ]
        });

        res.json(successResponse(updatedAsset, "Aset berhasil diperbarui"));

    } catch (error) {
        console.error("Update asset error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Delete asset
 */
export const deleteAsset = async (req, res) => {
    try {
        const asset = await Assets.findOne({ where: { uuid: req.params.id } });

        if (!asset) {
            return res.status(404).json(
                errorResponse("Aset tidak ditemukan", "ASSET_NOT_FOUND")
            );
        }

        // Check if asset is in use
        if (asset.status === "in_use") {
            return res.status(400).json(
                errorResponse("Aset sedang digunakan. Kembalikan aset terlebih dahulu.", "ASSET_IN_USE")
            );
        }

        // Hard delete (or soft delete by changing status to 'disposed')
        await Assets.destroy({ where: { id: asset.id } });

        res.json(successResponse(null, "Aset berhasil dihapus"));

    } catch (error) {
        console.error("Delete asset error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Get asset transaction history
 */
export const getAssetHistory = async (req, res) => {
    try {
        const asset = await Assets.findOne({ where: { uuid: req.params.id } });

        if (!asset) {
            return res.status(404).json(
                errorResponse("Aset tidak ditemukan", "ASSET_NOT_FOUND")
            );
        }

        const transactions = await Transactions.findAll({
            where: { asset_id: asset.id },
            include: [
                { association: "employee", attributes: ["uuid", "name", "department"] },
                { association: "admin", attributes: ["uuid", "name"] }
            ],
            order: [["transaction_date", "DESC"]]
        });

        res.json(successResponse(transactions, `${transactions.length} riwayat transaksi ditemukan`));

    } catch (error) {
        console.error("Get asset history error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Get asset statistics
 */
export const getAssetStats = async (req, res) => {
    try {
        const totalAssets = await Assets.count();
        
        const statusCounts = await Assets.findAll({
            attributes: [
                "status",
                [Assets.sequelize.fn("COUNT", Assets.sequelize.col("status")), "count"]
            ],
            group: ["status"],
            raw: true
        });

        const categoryCounts = await Assets.findAll({
            attributes: [
                [Assets.sequelize.fn("COUNT", Assets.sequelize.col("Assets.id")), "count"]
            ],
            include: [{
                association: "category",
                attributes: ["name"]
            }],
            group: ["category.id"],
            raw: true
        });

        // Total value
        const totalValue = await Assets.sum("purchase_price") || 0;

        res.json(successResponse({
            total_assets: totalAssets,
            total_value: totalValue,
            by_status: statusCounts,
            by_category: categoryCounts
        }, "Statistik aset berhasil diambil"));

    } catch (error) {
        console.error("Get asset stats error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};
