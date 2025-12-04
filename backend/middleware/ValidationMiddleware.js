import { errorResponse } from "../utils/ResponseFormatter.js";

/**
 * Validation Middleware
 * Middleware untuk validasi request body menggunakan Joi schema
 */

/**
 * Create validation middleware dari Joi schema
 * @param {Object} schema - Joi schema untuk validasi
 * @returns {Function} Express middleware
 */
export const validateBody = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join("."),
                message: detail.message
            }));

            return res.status(400).json(
                errorResponse("Validasi gagal", "VALIDATION_ERROR", errors)
            );
        }

        // Replace req.body with validated value (includes defaults)
        req.body = value;
        next();
    };
};

/**
 * Validate query parameters
 * @param {Object} schema - Joi schema untuk validasi
 * @returns {Function} Express middleware
 */
export const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join("."),
                message: detail.message
            }));

            return res.status(400).json(
                errorResponse("Validasi query gagal", "VALIDATION_ERROR", errors)
            );
        }

        req.query = value;
        next();
    };
};

/**
 * Validate route parameters
 * @param {Object} schema - Joi schema untuk validasi
 * @returns {Function} Express middleware
 */
export const validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join("."),
                message: detail.message
            }));

            return res.status(400).json(
                errorResponse("Parameter tidak valid", "VALIDATION_ERROR", errors)
            );
        }

        req.params = value;
        next();
    };
};

// Alias for validateBody (backward compatibility)
export const validateRequest = validateBody;
