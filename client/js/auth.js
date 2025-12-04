// API Base URL
const API_URL = '/api';

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Get user from localStorage
const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
const isAuthenticated = () => {
    return !!getToken();
};

// Logout user
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
};

// Make authenticated API request
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, mergedOptions);

        // Handle unauthorized
        if (response.status === 401) {
            logout();
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

// Check authentication on page load
const checkAuth = () => {
    const currentPage = window.location.pathname;
    const isLoginPage = currentPage.includes('login.html');

    if (!isAuthenticated() && !isLoginPage) {
        window.location.href = '/login.html';
    } else if (isAuthenticated() && isLoginPage) {
        window.location.href = '/index.html';
    }
};

// Initialize auth check
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAuth);
} else {
    checkAuth();
}
