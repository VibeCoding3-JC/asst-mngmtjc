import db from "../config/Database.js";
import { generateSQLFromNaturalLanguage, formatResultsToNaturalLanguage } from "../services/GeminiService.js";
import { validateQuery, getQueryTimeout } from "../utils/QueryValidator.js";
import { successResponse, errorResponse } from "../utils/ResponseFormatter.js";

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 queries per minute

/**
 * Check rate limit for user
 * @param {string} userId - User ID
 * @returns {boolean} - True if within limit
 */
const checkRateLimit = (userId) => {
    const now = Date.now();
    const userKey = `chat_${userId}`;
    
    if (!rateLimitStore.has(userKey)) {
        rateLimitStore.set(userKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
        return true;
    }
    
    const userData = rateLimitStore.get(userKey);
    
    if (now > userData.resetAt) {
        // Reset window
        rateLimitStore.set(userKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
        return true;
    }
    
    if (userData.count >= RATE_LIMIT_MAX) {
        return false;
    }
    
    userData.count++;
    return true;
};

/**
 * Process natural language query
 * POST /api/chat/query
 */
export const processQuery = async (req, res) => {
    const startTime = Date.now();
    
    try {
        const { message } = req.body;
        const userId = req.userId;

        // Validate message
        if (!message || typeof message !== 'string') {
            return res.status(400).json(
                errorResponse("Pesan tidak boleh kosong", "EMPTY_MESSAGE")
            );
        }

        if (message.length > 500) {
            return res.status(400).json(
                errorResponse("Pesan terlalu panjang (maksimal 500 karakter)", "MESSAGE_TOO_LONG")
            );
        }

        // Check rate limit
        if (!checkRateLimit(userId)) {
            return res.status(429).json(
                errorResponse("Terlalu banyak permintaan. Silakan tunggu beberapa saat.", "RATE_LIMIT_EXCEEDED")
            );
        }

        // Generate SQL from natural language using Gemini
        const aiResponse = await generateSQLFromNaturalLanguage(message);

        // Check if AI couldn't generate SQL
        if (!aiResponse.sql || aiResponse.resultType === 'error') {
            return res.json(
                successResponse({
                    query: message,
                    sql: null,
                    explanation: aiResponse.explanation,
                    resultType: 'error',
                    result: null,
                    executionTime: `${Date.now() - startTime}ms`
                }, aiResponse.explanation)
            );
        }

        // Validate and sanitize SQL
        const validation = validateQuery(aiResponse.sql);
        
        if (!validation.isValid) {
            console.warn("Query validation failed:", aiResponse.sql, validation.reason);
            return res.status(400).json(
                errorResponse(`Query tidak aman: ${validation.reason}`, "UNSAFE_QUERY")
            );
        }

        // Execute query with timeout
        const queryTimeout = getQueryTimeout();
        let queryResult;
        
        try {
            // Set query timeout
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Query timeout')), queryTimeout);
            });

            const queryPromise = db.query(validation.sanitizedSQL, {
                type: db.QueryTypes.SELECT,
                raw: true
            });

            queryResult = await Promise.race([queryPromise, timeoutPromise]);

        } catch (queryError) {
            console.error("Query execution error:", queryError);
            
            if (queryError.message === 'Query timeout') {
                return res.status(408).json(
                    errorResponse("Query terlalu lama. Silakan coba dengan pertanyaan yang lebih spesifik.", "QUERY_TIMEOUT")
                );
            }
            
            return res.status(400).json(
                errorResponse("Gagal mengeksekusi query. Silakan coba dengan pertanyaan lain.", "QUERY_ERROR")
            );
        }

        // Format result summary
        let summary = null;
        if (queryResult && queryResult.length > 0) {
            summary = await formatResultsToNaturalLanguage(message, queryResult, aiResponse.resultType);
        }

        // Prepare response
        const executionTime = `${Date.now() - startTime}ms`;
        
        res.json(
            successResponse({
                query: message,
                sql: validation.sanitizedSQL,
                explanation: aiResponse.explanation,
                resultType: aiResponse.resultType,
                result: queryResult,
                rowCount: queryResult ? queryResult.length : 0,
                summary: summary,
                executionTime
            }, "Query berhasil dieksekusi")
        );

    } catch (error) {
        console.error("Process query error:", error);
        
        res.status(500).json(
            errorResponse(error.message || "Terjadi kesalahan saat memproses pertanyaan", "SERVER_ERROR")
        );
    }
};

/**
 * Get chat suggestions/examples
 * GET /api/chat/suggestions
 */
export const getSuggestions = async (req, res) => {
    try {
        const suggestions = [
            {
                category: "Statistik Umum",
                questions: [
                    "Berapa total aset yang ada?",
                    "Berapa aset yang tersedia untuk dipinjam?",
                    "Berapa nilai total semua aset?"
                ]
            },
            {
                category: "Status Aset",
                questions: [
                    "Tampilkan aset yang sedang dipinjam",
                    "Aset apa saja yang dalam perbaikan?",
                    "List aset yang sudah di-retire"
                ]
            },
            {
                category: "Kategori & Lokasi",
                questions: [
                    "Berapa jumlah laptop yang ada?",
                    "Tampilkan aset per kategori",
                    "Aset apa saja di Kantor Pusat?"
                ]
            },
            {
                category: "User & Peminjaman",
                questions: [
                    "Siapa yang paling banyak meminjam aset?",
                    "Tampilkan aset yang dipinjam oleh departemen IT",
                    "List user yang sedang meminjam laptop"
                ]
            },
            {
                category: "Garansi & Nilai",
                questions: [
                    "Aset apa yang garansinya akan habis bulan ini?",
                    "Berapa nilai aset per kategori?",
                    "Tampilkan 10 aset termahal"
                ]
            },
            {
                category: "Transaksi",
                questions: [
                    "Tampilkan transaksi hari ini",
                    "Berapa peminjaman bulan ini?",
                    "Riwayat transaksi minggu lalu"
                ]
            }
        ];

        res.json(successResponse(suggestions, "Daftar saran pertanyaan"));

    } catch (error) {
        console.error("Get suggestions error:", error);
        res.status(500).json(
            errorResponse("Gagal mengambil saran", "SERVER_ERROR")
        );
    }
};

/**
 * Health check for chat service
 * GET /api/chat/health
 */
export const healthCheck = async (req, res) => {
    try {
        const hasApiKey = process.env.GEMINI_API_KEY && 
                          process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE';
        
        res.json(successResponse({
            status: hasApiKey ? "ready" : "not_configured",
            geminiConfigured: hasApiKey,
            message: hasApiKey 
                ? "Chat AI siap digunakan" 
                : "GEMINI_API_KEY belum dikonfigurasi di file .env"
        }));

    } catch (error) {
        res.status(500).json(
            errorResponse("Chat service error", "SERVER_ERROR")
        );
    }
};

export default {
    processQuery,
    getSuggestions,
    healthCheck
};
