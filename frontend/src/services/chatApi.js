import api from '../api/axios';

/**
 * Chat API Service
 */

/**
 * Send a natural language query to the chat API
 * @param {string} message - User's question in natural language
 * @returns {Promise<object>} - API response with SQL and results
 */
export const sendChatQuery = async (message) => {
    const response = await api.post('/chat/query', { message });
    return response.data;
};

/**
 * Get chat suggestions/example questions
 * @returns {Promise<object>} - List of suggested questions
 */
export const getChatSuggestions = async () => {
    const response = await api.get('/chat/suggestions');
    return response.data;
};

/**
 * Check if chat service is configured and healthy
 * @returns {Promise<object>} - Health status
 */
export const checkChatHealth = async () => {
    const response = await api.get('/chat/health');
    return response.data;
};

export default {
    sendChatQuery,
    getChatSuggestions,
    checkChatHealth
};
