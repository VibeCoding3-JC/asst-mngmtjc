import { useState, useEffect, useRef } from 'react';
import { sendChatQuery, getChatSuggestions, checkChatHealth } from '../../services/chatApi';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [isConfigured, setIsConfigured] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load suggestions and check health on mount
    useEffect(() => {
        const initialize = async () => {
            try {
                // Check health
                const healthResponse = await checkChatHealth();
                if (healthResponse.data) {
                    setIsConfigured(healthResponse.data.geminiConfigured);
                }

                // Get suggestions
                const suggestionsResponse = await getChatSuggestions();
                if (suggestionsResponse.data) {
                    setSuggestions(suggestionsResponse.data);
                }
            } catch (err) {
                console.error('Failed to initialize chat:', err);
            }
        };

        initialize();
    }, []);

    // Handle send message
    const handleSendMessage = async (messageText = inputMessage) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: messageText.trim(),
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setShowSuggestions(false);
        setIsLoading(true);
        setError(null);

        try {
            const response = await sendChatQuery(messageText.trim());
            
            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: response.data,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error('Chat error:', err);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'error',
                content: err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    // Handle key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (question) => {
        handleSendMessage(question);
    };

    // Clear chat
    const handleClearChat = () => {
        setMessages([]);
        setShowSuggestions(true);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">
            {/* Header */}
            <div className="bg-white shadow-sm border-b px-6 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-3xl">🤖</span>
                            AI Asset Query
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Tanyakan informasi aset dengan bahasa natural
                        </p>
                    </div>
                    {messages.length > 0 && (
                        <button
                            onClick={handleClearChat}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            🗑️ Clear Chat
                        </button>
                    )}
                </div>

                {/* API Not Configured Warning */}
                {!isConfigured && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                        ⚠️ <strong>Perhatian:</strong> GEMINI_API_KEY belum dikonfigurasi di backend. 
                        Silakan tambahkan API key di file <code className="bg-yellow-100 px-1 rounded">.env</code>
                    </div>
                )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-4">
                {/* Welcome & Suggestions */}
                {showSuggestions && messages.length === 0 && (
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">💬</div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">
                                Selamat Datang di AI Asset Query
                            </h2>
                            <p className="text-gray-500">
                                Anda bisa bertanya tentang data aset menggunakan bahasa Indonesia atau Inggris.
                                Sistem akan mengkonversi pertanyaan Anda menjadi query database.
                            </p>
                        </div>

                        {/* Suggestion Categories */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {suggestions.map((category, idx) => (
                                <div key={idx} className="bg-white rounded-lg shadow-sm border p-4">
                                    <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                                        {category.category}
                                    </h3>
                                    <div className="space-y-2">
                                        {category.questions.map((question, qIdx) => (
                                            <button
                                                key={qIdx}
                                                onClick={() => handleSuggestionClick(question)}
                                                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                "{question}"
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                                🤖
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border px-4 py-3">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                    <span className="text-sm">Memproses pertanyaan...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t px-6 py-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ketik pertanyaan Anda... (contoh: Berapa total laptop yang tersedia?)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={isLoading || !inputMessage.trim()}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                isLoading || !inputMessage.trim()
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                </span>
                            ) : (
                                '🚀 Kirim'
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        Tekan Enter untuk mengirim • Hanya query read-only yang diizinkan
                    </p>
                </div>
            </div>
        </div>
    );
};

// Chat Message Component
const ChatMessage = ({ message }) => {
    const isUser = message.type === 'user';
    const isError = message.type === 'error';

    if (isUser) {
        return (
            <div className="flex items-start gap-3 justify-end">
                <div className="bg-blue-600 text-white rounded-lg px-4 py-3 max-w-2xl">
                    <p>{message.content}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                    👤
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-lg">
                    ⚠️
                </div>
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 max-w-2xl">
                    <p>{message.content}</p>
                </div>
            </div>
        );
    }

    // AI Response
    const data = message.content;
    
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg flex-shrink-0">
                🤖
            </div>
            <div className="flex-1 space-y-3 max-w-3xl">
                {/* Explanation */}
                <div className="bg-white rounded-lg shadow-sm border px-4 py-3">
                    <p className="text-gray-700">{data.explanation}</p>
                    {data.summary && (
                        <p className="text-gray-600 mt-2 font-medium">{data.summary}</p>
                    )}
                </div>

                {/* Results */}
                {data.result && data.result.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        {/* Result header */}
                        <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                📊 {data.rowCount} hasil ditemukan • {data.executionTime}
                            </span>
                            <button
                                onClick={() => {
                                    const text = JSON.stringify(data.result, null, 2);
                                    navigator.clipboard.writeText(text);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                📋 Copy
                            </button>
                        </div>

                        {/* Result table */}
                        {data.resultType === 'number' && data.result.length === 1 ? (
                            <div className="px-4 py-6 text-center">
                                <div className="text-4xl font-bold text-blue-600">
                                    {Object.values(data.result[0])[0]?.toLocaleString('id-ID') || '0'}
                                </div>
                                <div className="text-gray-500 text-sm mt-1">
                                    {Object.keys(data.result[0])[0]?.replace(/_/g, ' ')}
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto max-h-96">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            {Object.keys(data.result[0] || {}).map((key) => (
                                                <th key={key} className="px-4 py-2 text-left font-medium text-gray-600 border-b">
                                                    {key.replace(/_/g, ' ')}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.result.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 border-b last:border-0">
                                                {Object.values(row).map((value, vIdx) => (
                                                    <td key={vIdx} className="px-4 py-2 text-gray-700">
                                                        {formatCellValue(value)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* SQL Query (collapsible) */}
                {data.sql && (
                    <details className="bg-gray-800 rounded-lg overflow-hidden">
                        <summary className="px-4 py-2 text-gray-300 text-sm cursor-pointer hover:bg-gray-700">
                            🔍 Lihat SQL Query
                        </summary>
                        <pre className="px-4 py-3 text-green-400 text-xs overflow-x-auto">
                            {data.sql}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
};

// Helper function to format cell values
const formatCellValue = (value) => {
    if (value === null || value === undefined) {
        return <span className="text-gray-400">-</span>;
    }
    
    // Format numbers
    if (typeof value === 'number') {
        return value.toLocaleString('id-ID');
    }
    
    // Format dates
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        try {
            return new Date(value).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return value;
        }
    }
    
    // Format status badges
    if (['available', 'assigned', 'repair', 'retired'].includes(value)) {
        const colors = {
            available: 'bg-green-100 text-green-800',
            assigned: 'bg-blue-100 text-blue-800',
            repair: 'bg-yellow-100 text-yellow-800',
            retired: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value]}`}>
                {value}
            </span>
        );
    }
    
    return String(value);
};

export default ChatPage;
