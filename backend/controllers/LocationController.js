import { Op } from "sequelize";
import { Locations, Assets } from "../models/index.js";
import { successResponse, errorResponse, paginationMeta } from "../utils/ResponseFormatter.js";

/**
 * Get all locations with pagination
 */
export const getLocations = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { building: { [Op.like]: `%${search}%` } },
                { floor: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Locations.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["name", "ASC"]]
        });

        // Get asset count per location
        const locationsWithCount = await Promise.all(
            rows.map(async (location) => {
                const assetCount = await Assets.count({
                    where: { location_id: location.id }
                });
                return {
                    ...location.toJSON(),
                    asset_count: assetCount
                };
            })
        );

        res.json(
            successResponse(
                locationsWithCount,
                "Data lokasi berhasil diambil",
                paginationMeta(page, limit, count)
            )
        );

    } catch (error) {
        console.error("Get locations error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Get all locations (without pagination for dropdowns)
 */
export const getAllLocations = async (req, res) => {
    try {
        const locations = await Locations.findAll({
            order: [["name", "ASC"]]
        });

        res.json(successResponse(locations, "Data lokasi berhasil diambil"));

    } catch (error) {
        console.error("Get all locations error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Get location by ID
 */
export const getLocationById = async (req, res) => {
    try {
        const location = await Locations.findOne({
            where: { uuid: req.params.id }
        });

        if (!location) {
            return res.status(404).json(
                errorResponse("Lokasi tidak ditemukan", "LOCATION_NOT_FOUND")
            );
        }

        // Get asset count
        const assetCount = await Assets.count({
            where: { location_id: location.id }
        });

        res.json(
            successResponse({
                ...location.toJSON(),
                asset_count: assetCount
            }, "Data lokasi berhasil diambil")
        );

    } catch (error) {
        console.error("Get location by id error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Create new location
 */
export const createLocation = async (req, res) => {
    try {
        const { name, building, floor, room_number, address, description } = req.body;

        // Check if location name exists
        const existingLocation = await Locations.findOne({
            where: { name }
        });
        if (existingLocation) {
            return res.status(400).json(
                errorResponse("Lokasi dengan nama yang sama sudah ada", "LOCATION_EXISTS")
            );
        }

        const location = await Locations.create({
            name,
            building,
            floor,
            room_number,
            address,
            description
        });

        res.status(201).json(
            successResponse(location, "Lokasi berhasil ditambahkan")
        );

    } catch (error) {
        console.error("Create location error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Update location
 */
export const updateLocation = async (req, res) => {
    try {
        const location = await Locations.findOne({
            where: { uuid: req.params.id }
        });

        if (!location) {
            return res.status(404).json(
                errorResponse("Lokasi tidak ditemukan", "LOCATION_NOT_FOUND")
            );
        }

        const { name, building, floor, room_number, address, description } = req.body;

        // Check uniqueness if name changed
        const newName = name || location.name;

        if (name && name !== location.name) {
            const existingLocation = await Locations.findOne({
                where: { 
                    name: newName, 
                    id: { [Op.ne]: location.id }
                }
            });
            if (existingLocation) {
                return res.status(400).json(
                    errorResponse("Lokasi dengan nama yang sama sudah ada", "LOCATION_EXISTS")
                );
            }
        }

        await Locations.update({
            name: newName,
            building: building !== undefined ? building : location.building,
            floor: floor !== undefined ? floor : location.floor,
            room_number: room_number !== undefined ? room_number : location.room_number,
            address: address !== undefined ? address : location.address,
            description: description !== undefined ? description : location.description
        }, { where: { id: location.id } });

        const updatedLocation = await Locations.findOne({
            where: { id: location.id }
        });

        res.json(successResponse(updatedLocation, "Lokasi berhasil diperbarui"));

    } catch (error) {
        console.error("Update location error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Delete location
 */
export const deleteLocation = async (req, res) => {
    try {
        const location = await Locations.findOne({
            where: { uuid: req.params.id }
        });

        if (!location) {
            return res.status(404).json(
                errorResponse("Lokasi tidak ditemukan", "LOCATION_NOT_FOUND")
            );
        }

        // Check if location has assets
        const assetCount = await Assets.count({
            where: { location_id: location.id }
        });

        if (assetCount > 0) {
            return res.status(400).json(
                errorResponse(
                    `Lokasi memiliki ${assetCount} aset. Pindahkan atau hapus aset terlebih dahulu.`,
                    "LOCATION_HAS_ASSETS"
                )
            );
        }

        await Locations.destroy({ where: { id: location.id } });

        res.json(successResponse(null, "Lokasi berhasil dihapus"));

    } catch (error) {
        console.error("Delete location error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Get assets in location
 */
export const getLocationAssets = async (req, res) => {
    try {
        const location = await Locations.findOne({
            where: { uuid: req.params.id }
        });

        if (!location) {
            return res.status(404).json(
                errorResponse("Lokasi tidak ditemukan", "LOCATION_NOT_FOUND")
            );
        }

        const assets = await Assets.findAll({
            where: { location_id: location.id },
            include: [
                { association: "category", attributes: ["uuid", "name"] },
                { association: "holder", attributes: ["uuid", "name", "department"] }
            ]
        });

        res.json(successResponse(assets, `${assets.length} aset ditemukan di lokasi ini`));

    } catch (error) {
        console.error("Get location assets error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};
