import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Untuk mengirim cookies
    headers: {
        "Content-Type": "application/json"
    }
});

// Request interceptor - menambahkan token ke header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Jika error 401 dan belum pernah retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Request token baru menggunakan refresh token dari cookie
                const response = await axios.get(`${API_URL}/auth/token`, {
                    withCredentials: true
                });

                const { accessToken } = response.data.data;
                
                // Simpan token baru
                localStorage.setItem("accessToken", accessToken);

                // Update header request asli
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Ulangi request
                return api(originalRequest);
            } catch (refreshError) {
                // Jika refresh token juga expired, logout
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

// Export API functions
export const authAPI = {
    login: (data) => api.post("/auth/login", data),
    logout: () => api.delete("/auth/logout"),
    refreshToken: () => api.get("/auth/token"),
    getMe: () => api.get("/auth/me"),
    register: (data) => api.post("/auth/register", data)
};

export const usersAPI = {
    getAll: (params) => api.get("/users", { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post("/users", data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
    getAssets: (id) => api.get(`/users/${id}/assets`)
};

export const categoriesAPI = {
    getAll: () => api.get("/categories"),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post("/categories", data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`)
};

export const locationsAPI = {
    getAll: () => api.get("/locations"),
    getById: (id) => api.get(`/locations/${id}`),
    create: (data) => api.post("/locations", data),
    update: (id, data) => api.put(`/locations/${id}`, data),
    delete: (id) => api.delete(`/locations/${id}`)
};

export const assetsAPI = {
    getAll: (params) => api.get("/assets", { params }),
    getById: (id) => api.get(`/assets/${id}`),
    create: (data) => api.post("/assets", data),
    update: (id, data) => api.put(`/assets/${id}`, data),
    delete: (id) => api.delete(`/assets/${id}`),
    getHistory: (id) => api.get(`/assets/${id}/history`)
};

export const transactionsAPI = {
    getAll: (params) => api.get("/transactions", { params }),
    getById: (id) => api.get(`/transactions/${id}`),
    checkout: (data) => api.post("/transactions/checkout", data),
    checkin: (data) => api.post("/transactions/checkin", data),
    transfer: (data) => api.post("/transactions/transfer", data),
    repair: (data) => api.post("/transactions/repair", data),
    repairComplete: (data) => api.post("/transactions/repair-complete", data),
    dispose: (data) => api.post("/transactions/dispose", data)
};

export const dashboardAPI = {
    getStats: () => api.get("/dashboard"),
    getReports: (params) => api.get("/reports/assets", { params })
};

// Aliases for backward compatibility
export const userAPI = usersAPI;
export const transactionAPI = transactionsAPI;
export const assetAPI = assetsAPI;
export const categoryAPI = categoriesAPI;
export const locationAPI = locationsAPI;
