/**
 * Asset Status Constants
 */
export const ASSET_STATUS = {
    AVAILABLE: "available",
    ASSIGNED: "assigned",
    REPAIR: "repair",
    RETIRED: "retired",
    MISSING: "missing"
};

export const ASSET_STATUS_LABELS = {
    [ASSET_STATUS.AVAILABLE]: "Tersedia",
    [ASSET_STATUS.ASSIGNED]: "Dipinjam",
    [ASSET_STATUS.REPAIR]: "Perbaikan",
    [ASSET_STATUS.RETIRED]: "Dihapus",
    [ASSET_STATUS.MISSING]: "Hilang"
};

export const ASSET_STATUS_COLORS = {
    [ASSET_STATUS.AVAILABLE]: "success",
    [ASSET_STATUS.ASSIGNED]: "info",
    [ASSET_STATUS.REPAIR]: "warning",
    [ASSET_STATUS.RETIRED]: "gray",
    [ASSET_STATUS.MISSING]: "danger"
};

/**
 * Asset Condition Constants
 */
export const ASSET_CONDITION = {
    NEW: "new",
    GOOD: "good",
    FAIR: "fair",
    POOR: "poor"
};

export const ASSET_CONDITION_LABELS = {
    [ASSET_CONDITION.NEW]: "Baru",
    [ASSET_CONDITION.GOOD]: "Baik",
    [ASSET_CONDITION.FAIR]: "Cukup",
    [ASSET_CONDITION.POOR]: "Buruk"
};

/**
 * User Role Constants
 */
export const USER_ROLES = {
    ADMIN: "admin",
    STAFF: "staff",
    EMPLOYEE: "employee"
};

export const USER_ROLE_LABELS = {
    [USER_ROLES.ADMIN]: "Administrator",
    [USER_ROLES.STAFF]: "Staff",
    [USER_ROLES.EMPLOYEE]: "Karyawan"
};

/**
 * Transaction Type Constants
 */
export const TRANSACTION_TYPES = {
    CHECKOUT: "checkout",
    CHECKIN: "checkin",
    TRANSFER: "transfer",
    REPAIR: "repair",
    DISPOSE: "dispose"
};

export const TRANSACTION_TYPE_LABELS = {
    [TRANSACTION_TYPES.CHECKOUT]: "Peminjaman",
    [TRANSACTION_TYPES.CHECKIN]: "Pengembalian",
    [TRANSACTION_TYPES.TRANSFER]: "Transfer",
    [TRANSACTION_TYPES.REPAIR]: "Perbaikan",
    [TRANSACTION_TYPES.DISPOSE]: "Penghapusan"
};

/**
 * Pagination Defaults
 */
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    LIMIT_OPTIONS: [10, 25, 50, 100]
};

/**
 * Date Format
 */
export const DATE_FORMAT = {
    DISPLAY: "dd MMM yyyy",
    DISPLAY_WITH_TIME: "dd MMM yyyy HH:mm",
    INPUT: "yyyy-MM-dd",
    API: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
};
