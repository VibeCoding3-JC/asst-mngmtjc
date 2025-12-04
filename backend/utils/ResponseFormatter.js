/**
 * Response Formatter Utility
 * Standarisasi format response API
 */

/**
 * Format success response
 * @param {Object} data - Data yang akan dikembalikan
 * @param {string} message - Pesan sukses
 * @param {Object} meta - Metadata (pagination, dll)
 * @returns {Object} Formatted response
 */
export const successResponse = (data = null, message = "Success", meta = null) => {
    const response = {
        success: true,
        message,
        data
    };

    if (meta) {
        response.meta = meta;
    }

    return response;
};

/**
 * Format error response
 * @param {string} message - Pesan error
 * @param {string} errorCode - Kode error (opsional)
 * @param {Array} errors - Detail error (validasi, dll)
 * @returns {Object} Formatted error response
 */
export const errorResponse = (message = "Error", errorCode = null, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errorCode) {
        response.error_code = errorCode;
    }

    if (errors) {
        response.errors = errors;
    }

    return response;
};

/**
 * Format pagination meta
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} totalRecords - Total records
 * @returns {Object} Pagination metadata
 */
export const paginationMeta = (page, limit, totalRecords) => {
    return {
        page: parseInt(page),
        limit: parseInt(limit),
        total_records: totalRecords,
        total_pages: Math.ceil(totalRecords / limit)
    };
};
