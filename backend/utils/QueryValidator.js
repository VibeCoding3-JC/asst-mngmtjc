/**
 * SQL Query Validator and Sanitizer
 * Validates and sanitizes SQL queries to prevent SQL injection and unauthorized operations
 */

// Blacklisted SQL keywords that could modify data
const DANGEROUS_KEYWORDS = [
    'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'TRUNCATE', 
    'CREATE', 'REPLACE', 'RENAME', 'EXEC', 'EXECUTE', 'CALL',
    'GRANT', 'REVOKE', 'COMMIT', 'ROLLBACK', 'SAVEPOINT',
    'LOCK', 'UNLOCK', 'SET', 'SHOW GRANTS', 'LOAD', 'INTO OUTFILE',
    'INTO DUMPFILE', 'INFORMATION_SCHEMA.USER_PRIVILEGES'
];

// Columns that should never be exposed
const SENSITIVE_COLUMNS = [
    'password', 'refresh_token', 'access_token', 'secret',
    'api_key', 'private_key', 'salt', 'hash'
];

// Maximum rows to return
const MAX_ROWS = 100;

// Query timeout in milliseconds
const QUERY_TIMEOUT = 5000;

/**
 * Check if SQL contains dangerous keywords
 * @param {string} sql - SQL query to check
 * @returns {{isValid: boolean, reason?: string}}
 */
const checkDangerousKeywords = (sql) => {
    const upperSQL = sql.toUpperCase();
    
    for (const keyword of DANGEROUS_KEYWORDS) {
        // Use word boundary check to avoid false positives
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(upperSQL)) {
            return {
                isValid: false,
                reason: `Query mengandung operasi terlarang: ${keyword}`
            };
        }
    }
    
    return { isValid: true };
};

/**
 * Check if SQL tries to access sensitive columns
 * @param {string} sql - SQL query to check
 * @returns {{isValid: boolean, reason?: string}}
 */
const checkSensitiveColumns = (sql) => {
    const lowerSQL = sql.toLowerCase();
    
    for (const column of SENSITIVE_COLUMNS) {
        // Check if column is being selected
        const regex = new RegExp(`\\b${column}\\b`, 'i');
        if (regex.test(lowerSQL)) {
            return {
                isValid: false,
                reason: `Query mencoba mengakses kolom sensitif: ${column}`
            };
        }
    }
    
    return { isValid: true };
};

/**
 * Check if SQL is a SELECT statement
 * @param {string} sql - SQL query to check
 * @returns {{isValid: boolean, reason?: string}}
 */
const checkSelectOnly = (sql) => {
    const trimmedSQL = sql.trim().toUpperCase();
    
    if (!trimmedSQL.startsWith('SELECT')) {
        return {
            isValid: false,
            reason: 'Hanya query SELECT yang diizinkan'
        };
    }
    
    return { isValid: true };
};

/**
 * Check for SQL injection patterns
 * @param {string} sql - SQL query to check
 * @returns {{isValid: boolean, reason?: string}}
 */
const checkSQLInjection = (sql) => {
    // Common SQL injection patterns
    const injectionPatterns = [
        /;\s*--/i,                    // Comment after semicolon
        /'\s*OR\s+'1'\s*=\s*'1/i,     // OR '1'='1'
        /'\s*OR\s+1\s*=\s*1/i,        // OR 1=1
        /UNION\s+ALL\s+SELECT/i,      // UNION ALL SELECT
        /UNION\s+SELECT/i,            // UNION SELECT
        /\/\*[\s\S]*?\*\//,           // Block comments
        /SLEEP\s*\(/i,                // Time-based injection
        /BENCHMARK\s*\(/i,            // Benchmark injection
        /WAITFOR\s+DELAY/i,           // SQL Server delay
        /0x[0-9a-f]+/i,               // Hex encoding
        /CHAR\s*\(\d+\)/i,            // CHAR() function for obfuscation
    ];
    
    for (const pattern of injectionPatterns) {
        if (pattern.test(sql)) {
            return {
                isValid: false,
                reason: 'Query terdeteksi mengandung pola SQL injection'
            };
        }
    }
    
    return { isValid: true };
};

/**
 * Ensure query has a LIMIT clause
 * @param {string} sql - SQL query to check/modify
 * @returns {string} - SQL with LIMIT clause
 */
const ensureLimit = (sql) => {
    const upperSQL = sql.toUpperCase();
    
    // Check if LIMIT already exists
    if (upperSQL.includes('LIMIT')) {
        // Extract and validate existing limit
        const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
        if (limitMatch) {
            const existingLimit = parseInt(limitMatch[1]);
            if (existingLimit > MAX_ROWS) {
                // Replace with max limit
                return sql.replace(/LIMIT\s+\d+/i, `LIMIT ${MAX_ROWS}`);
            }
        }
        return sql;
    }
    
    // Add LIMIT if not present
    return `${sql.trim().replace(/;?\s*$/, '')} LIMIT ${MAX_ROWS}`;
};

/**
 * Validate and sanitize SQL query
 * @param {string} sql - SQL query to validate
 * @returns {{isValid: boolean, sanitizedSQL?: string, reason?: string}}
 */
export const validateQuery = (sql) => {
    if (!sql || typeof sql !== 'string') {
        return {
            isValid: false,
            reason: 'Query tidak valid atau kosong'
        };
    }

    const trimmedSQL = sql.trim();

    // Check if it's SELECT only
    const selectCheck = checkSelectOnly(trimmedSQL);
    if (!selectCheck.isValid) {
        return selectCheck;
    }

    // Check dangerous keywords
    const keywordCheck = checkDangerousKeywords(trimmedSQL);
    if (!keywordCheck.isValid) {
        return keywordCheck;
    }

    // Check sensitive columns
    const sensitiveCheck = checkSensitiveColumns(trimmedSQL);
    if (!sensitiveCheck.isValid) {
        return sensitiveCheck;
    }

    // Check SQL injection patterns
    const injectionCheck = checkSQLInjection(trimmedSQL);
    if (!injectionCheck.isValid) {
        return injectionCheck;
    }

    // Ensure LIMIT is present
    const sanitizedSQL = ensureLimit(trimmedSQL);

    return {
        isValid: true,
        sanitizedSQL
    };
};

/**
 * Get query timeout value
 * @returns {number} - Timeout in milliseconds
 */
export const getQueryTimeout = () => QUERY_TIMEOUT;

/**
 * Get maximum rows limit
 * @returns {number} - Maximum rows
 */
export const getMaxRows = () => MAX_ROWS;

export default {
    validateQuery,
    getQueryTimeout,
    getMaxRows
};
