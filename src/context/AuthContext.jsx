import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is already logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const isValid = await authAPI.verifyToken();
                    if (isValid) {
                        setIsAuthenticated(true);
                        setUser(authAPI.getStoredUser());
                        setIsAdmin(authAPI.isAdmin());
                    } else {
                        // Token invalid, clear storage
                        authAPI.logout();
                    }
                } catch (err) {
                    console.error('Auth check failed:', err);
                    authAPI.logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Partner login
    const login = async (login, password) => {
        setError(null);
        try {
            const data = await authAPI.login(login, password);
            setIsAuthenticated(true);
            setUser(data.user);
            // Check if logged in user is admin
            setIsAdmin(data.user.role === 'admin');
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    // Admin login
    const adminLogin = async (login, password, adminKey) => {
        setError(null);
        try {
            const data = await authAPI.adminLogin(login, password, adminKey);
            setIsAuthenticated(true);
            setUser(data.user);
            setIsAdmin(true);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    // Logout
    const logout = () => {
        authAPI.logout();
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
        setError(null);
    };

    // Register request (for new partners)
    const registerRequest = async (companyName, contactPerson, phone, email) => {
        setError(null);
        try {
            const data = await authAPI.registerRequest(companyName, contactPerson, phone, email);
            return { success: true, message: data.message };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const value = {
        isAuthenticated,
        isAdmin,
        user,
        loading,
        error,
        login,
        adminLogin,
        logout,
        registerRequest
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
