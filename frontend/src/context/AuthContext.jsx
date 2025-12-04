import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check auth status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem("accessToken");
        
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await authAPI.getMe();
            setUser(response.data.data);
            setIsAuthenticated(true);
        } catch (error) {
            // Token invalid, try refresh
            try {
                const refreshResponse = await authAPI.refreshToken();
                localStorage.setItem("accessToken", refreshResponse.data.data.accessToken);
                
                // Retry getMe
                const meResponse = await authAPI.getMe();
                setUser(meResponse.data.data);
                setIsAuthenticated(true);
            } catch (refreshError) {
                // Refresh failed, clear auth
                localStorage.removeItem("accessToken");
                setUser(null);
                setIsAuthenticated(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await authAPI.login({ email, password });
        const { accessToken, user: userData } = response.data.data;
        
        localStorage.setItem("accessToken", accessToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        return response.data;
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("accessToken");
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;
