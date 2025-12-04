import { format, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format date untuk display
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string
 * @returns {string} Formatted date
 */
export const formatDate = (date, formatStr = "dd MMM yyyy") => {
    if (!date) return "-";
    
    try {
        const dateObj = typeof date === "string" ? parseISO(date) : date;
        if (!isValid(dateObj)) return "-";
        return format(dateObj, formatStr, { locale: id });
    } catch (error) {
        return "-";
    }
};

/**
 * Format date time untuk display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date time
 */
export const formatDateTime = (date) => {
    return formatDate(date, "dd MMM yyyy HH:mm");
};

/**
 * Format currency (Rupiah)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "Rp 0";
    
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

/**
 * Format number with thousand separator
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";
    return new Intl.NumberFormat("id-ID").format(num);
};

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50) => {
    if (!text) return "";
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
    if (!name) return "?";
    
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generate random color for avatar
 * @param {string} name - Name for seed
 * @returns {string} Tailwind color class
 */
export const getAvatarColor = (name) => {
    const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-amber-500",
        "bg-yellow-500",
        "bg-lime-500",
        "bg-green-500",
        "bg-emerald-500",
        "bg-teal-500",
        "bg-cyan-500",
        "bg-sky-500",
        "bg-blue-500",
        "bg-indigo-500",
        "bg-violet-500",
        "bg-purple-500",
        "bg-fuchsia-500",
        "bg-pink-500",
        "bg-rose-500"
    ];
    
    if (!name) return colors[0];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
};

/**
 * Parse query string to object
 * @param {string} queryString - Query string
 * @returns {Object} Parsed object
 */
export const parseQueryString = (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    
    for (const [key, value] of params) {
        result[key] = value;
    }
    
    return result;
};

/**
 * Build query string from object
 * @param {Object} params - Parameters object
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
            searchParams.append(key, value);
        }
    });
    
    return searchParams.toString();
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} Is empty
 */
export const isEmpty = (obj) => {
    if (!obj) return true;
    return Object.keys(obj).length === 0;
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
