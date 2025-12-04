import Joi from "joi";

/**
 * Validation Schemas untuk setiap entity
 */

// User Validation Schemas
export const userSchemas = {
    register: Joi.object({
        name: Joi.string().min(3).max(100).required()
            .messages({
                "string.min": "Nama minimal 3 karakter",
                "string.max": "Nama maksimal 100 karakter",
                "any.required": "Nama wajib diisi"
            }),
        email: Joi.string().email().required()
            .messages({
                "string.email": "Format email tidak valid",
                "any.required": "Email wajib diisi"
            }),
        password: Joi.string().min(6).required()
            .messages({
                "string.min": "Password minimal 6 karakter",
                "any.required": "Password wajib diisi"
            }),
        confirmPassword: Joi.string().valid(Joi.ref("password")).required()
            .messages({
                "any.only": "Konfirmasi password tidak cocok",
                "any.required": "Konfirmasi password wajib diisi"
            }),
        role: Joi.string().valid("admin", "staff", "employee").default("employee"),
        department: Joi.string().max(100).allow("", null),
        phone: Joi.string().max(20).allow("", null)
    }),

    login: Joi.object({
        email: Joi.string().email().required()
            .messages({
                "string.email": "Format email tidak valid",
                "any.required": "Email wajib diisi"
            }),
        password: Joi.string().required()
            .messages({
                "any.required": "Password wajib diisi"
            })
    }),

    update: Joi.object({
        name: Joi.string().min(3).max(100),
        email: Joi.string().email(),
        role: Joi.string().valid("admin", "staff", "employee"),
        department: Joi.string().max(100).allow("", null),
        phone: Joi.string().max(20).allow("", null),
        is_active: Joi.boolean(),
        password: Joi.string().min(6)
    }),

    createEmployee: Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        department: Joi.string().max(100).allow("", null),
        phone: Joi.string().max(20).allow("", null)
    })
};

// Export schemas directly for route validation
export const registerSchema = userSchemas.register;
export const loginSchema = userSchemas.login;
export const userSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).when("role", {
        is: Joi.string().valid("admin", "staff"),
        then: Joi.required(),
        otherwise: Joi.optional()
    }),
    role: Joi.string().valid("admin", "staff", "employee").default("employee"),
    department: Joi.string().max(100).allow("", null),
    phone: Joi.string().max(20).allow("", null)
});
export const updateUserSchema = userSchemas.update;

// Category Validation Schemas
export const categorySchemas = {
    create: Joi.object({
        name: Joi.string().min(2).max(100).required()
            .messages({
                "string.min": "Nama kategori minimal 2 karakter",
                "any.required": "Nama kategori wajib diisi"
            }),
        description: Joi.string().max(500).allow("", null),
        depreciation_rate: Joi.number().min(0).max(100).default(10)
    }),

    update: Joi.object({
        name: Joi.string().min(2).max(100),
        description: Joi.string().max(500).allow("", null),
        depreciation_rate: Joi.number().min(0).max(100)
    })
};

export const categorySchema = categorySchemas.create;
export const updateCategorySchema = categorySchemas.update;

// Location Validation Schemas
export const locationSchemas = {
    create: Joi.object({
        name: Joi.string().min(2).max(150).required()
            .messages({
                "string.min": "Nama lokasi minimal 2 karakter",
                "any.required": "Nama lokasi wajib diisi"
            }),
        address: Joi.string().max(500).allow("", null),
        building: Joi.string().max(100).allow("", null),
        floor: Joi.string().max(20).allow("", null),
        room_number: Joi.string().max(50).allow("", null),
        description: Joi.string().max(500).allow("", null)
    }),

    update: Joi.object({
        name: Joi.string().min(2).max(150),
        address: Joi.string().max(500).allow("", null),
        building: Joi.string().max(100).allow("", null),
        floor: Joi.string().max(20).allow("", null),
        room_number: Joi.string().max(50).allow("", null),
        description: Joi.string().max(500).allow("", null)
    })
};

export const locationSchema = locationSchemas.create;
export const updateLocationSchema = locationSchemas.update;

// Asset Validation Schemas
export const assetSchemas = {
    create: Joi.object({
        name: Joi.string().min(2).max(150).required()
            .messages({
                "any.required": "Nama aset wajib diisi"
            }),
        category_uuid: Joi.string().uuid().required()
            .messages({
                "any.required": "Kategori wajib dipilih"
            }),
        location_uuid: Joi.string().uuid().required()
            .messages({
                "any.required": "Lokasi wajib dipilih"
            }),
        serial_number: Joi.string().max(100).allow("", null),
        brand: Joi.string().max(100).allow("", null),
        model: Joi.string().max(100).allow("", null),
        specifications: Joi.string().allow("", null),
        purchase_date: Joi.date().allow(null),
        purchase_price: Joi.number().precision(2).min(0).allow(null),
        vendor: Joi.string().max(150).allow("", null),
        warranty_end: Joi.date().allow(null),
        notes: Joi.string().max(1000).allow("", null)
    }),

    update: Joi.object({
        name: Joi.string().min(2).max(150),
        category_uuid: Joi.string().uuid(),
        location_uuid: Joi.string().uuid(),
        serial_number: Joi.string().max(100).allow("", null),
        brand: Joi.string().max(100).allow("", null),
        model: Joi.string().max(100).allow("", null),
        specifications: Joi.string().allow("", null),
        purchase_date: Joi.date().allow(null),
        purchase_price: Joi.number().precision(2).min(0).allow(null),
        vendor: Joi.string().max(150).allow("", null),
        warranty_end: Joi.date().allow(null),
        notes: Joi.string().max(1000).allow("", null),
        status: Joi.string().valid("available", "in_use", "under_repair", "disposed")
    })
};

export const assetSchema = assetSchemas.create;
export const updateAssetSchema = assetSchemas.update;

// Transaction Validation Schemas
export const transactionSchemas = {
    checkout: Joi.object({
        asset_uuid: Joi.string().uuid().required()
            .messages({
                "any.required": "Asset wajib dipilih"
            }),
        user_uuid: Joi.string().uuid().required()
            .messages({
                "any.required": "User wajib dipilih"
            }),
        expected_return_date: Joi.date().allow(null),
        notes: Joi.string().max(500).allow("", null)
    }),

    checkin: Joi.object({
        asset_uuid: Joi.string().uuid().required()
            .messages({
                "any.required": "Asset wajib dipilih"
            }),
        location_uuid: Joi.string().uuid().required()
            .messages({
                "any.required": "Lokasi pengembalian wajib dipilih"
            }),
        condition_notes: Joi.string().max(500).allow("", null),
        notes: Joi.string().max(500).allow("", null)
    }),

    transfer: Joi.object({
        asset_uuid: Joi.string().uuid().required()
            .messages({
                "any.required": "Asset wajib dipilih"
            }),
        to_location_uuid: Joi.string().uuid().required()
            .messages({
                "any.required": "Lokasi tujuan wajib dipilih"
            }),
        notes: Joi.string().max(500).allow("", null)
    }),

    repair: Joi.object({
        asset_uuid: Joi.string().uuid().required()
            .messages({
                "any.required": "Asset wajib dipilih"
            }),
        repair_vendor: Joi.string().max(150).allow("", null),
        estimated_cost: Joi.number().min(0).allow(null),
        estimated_return_date: Joi.date().allow(null),
        notes: Joi.string().max(500).allow("", null)
    }),

    dispose: Joi.object({
        asset_uuid: Joi.string().uuid().required()
            .messages({
                "any.required": "Asset wajib dipilih"
            }),
        disposal_reason: Joi.string().max(500).required()
            .messages({
                "any.required": "Alasan disposal wajib diisi"
            }),
        disposal_value: Joi.number().min(0).allow(null),
        notes: Joi.string().max(500).allow("", null)
    })
};

export const checkoutSchema = transactionSchemas.checkout;
export const checkinSchema = transactionSchemas.checkin;
export const transferSchema = transactionSchemas.transfer;
export const repairSchema = transactionSchemas.repair;
export const disposeSchema = transactionSchemas.dispose;

/**
 * Validate data against schema
 * @param {Object} schema - Joi schema
 * @param {Object} data - Data to validate
 * @returns {Object} { error, value }
 */
export const validate = (schema, data) => {
    return schema.validate(data, { abortEarly: false });
};
