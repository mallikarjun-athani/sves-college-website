/**
 * SVES College Website - Frontend API Helper
 * 
 * This file contains the API base configuration and helper functions
 * for interacting with the Node.js backend.
 */

// API Base URL - Intelligent detection for local vs production
const getApiBaseUrl = () => {
    const { hostname, port, protocol } = window.location;

    // If we're on localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // If the current port is 3000, we can use relative path
        if (port === '3000') return '/api';
        // Otherwise, explicitly point to the backend on 3000
        return 'http://localhost:3000/api';
    }

    // For Vercel/Railway or other production environments
    if (hostname.includes('vercel.app') || hostname.includes('railway') || hostname.includes('github.io')) {
        return 'https://sves-college-backend.railway.app/api';
    }

    // Default to relative if same origin
    return '/api';
};

const API_BASE_URL = getApiBaseUrl();
// API Base URL - Intelligent detection for local vs production

/**
 * Authentication Helpers
 */

// Token Keys
const TOKEN_KEY = 'sves_admin_token';
const ADMIN_KEY = 'sves_admin_data';

/**
 * Get the stored JWT token
 */
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Set the JWT token and admin data
 */
function setToken(token, adminData = null) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (adminData) {
        localStorage.setItem(ADMIN_KEY, JSON.stringify(adminData));
    }
}

/**
 * Check if the user is logged in (client-side only)
 */
function isLoggedIn() {
    return !!getToken();
}

/**
 * Verify token with the backend
 */
async function verifyToken() {
    const token = getToken();
    if (!token) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Token verification failed:', error);
        return false;
    }
}

/**
 * Logout the user
 */
function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);

    // Use relative path for logout based on current location
    if (window.location.pathname.includes('/admin/')) {
        window.location.href = 'login.html';
    } else {
        window.location.href = 'admin/login.html';
    }
}

/**
 * API Request Helpers
 */

/**
 * Generic GET request
 */
async function apiGet(endpoint) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers
        });

        if (response.status === 401) {
            // Only logout if we're in the admin section
            if (window.location.pathname.includes('/admin/') && !window.location.pathname.includes('login.html')) {
                logout();
            }
            throw new Error('Unauthorized access');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error(`❌ API GET Error (${endpoint}):`, error);
        throw error;
    }
}

/**
 * Generic POST request
 */
async function apiPost(endpoint, body = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });

        if (response.status === 401 && endpoint !== '/auth/login') {
            if (window.location.pathname.includes('/admin/')) logout();
            throw new Error('Session expired');
        }

        const data = await response.json();

        if (!response.ok) {
            if (data.errors) {
                throw new Error(data.errors.map(err => err.msg).join(', '));
            }
            throw new Error(data.error || data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error(`❌ API POST Error (${endpoint}):`, error);
        throw error;
    }
}

/**
 * Generic PUT request
 */
async function apiPut(endpoint, body = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body)
        });

        if (response.status === 401) {
            if (window.location.pathname.includes('/admin/')) logout();
            throw new Error('Session expired');
        }

        const data = await response.json();

        if (!response.ok) {
            if (data.errors) {
                throw new Error(data.errors.map(err => err.msg).join(', '));
            }
            throw new Error(data.error || data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error(`❌ API PUT Error (${endpoint}):`, error);
        throw error;
    }
}

/**
 * Generic DELETE request
 */
async function apiDelete(endpoint) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers
        });

        if (response.status === 401) {
            if (window.location.pathname.includes('/admin/')) logout();
            throw new Error('Session expired');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error(`❌ API DELETE Error (${endpoint}):`, error);
        throw error;
    }
}

/**
 * Generic PATCH request
 */
async function apiPatch(endpoint, body = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(body)
        });

        if (response.status === 401) {
            if (window.location.pathname.includes('/admin/')) logout();
            throw new Error('Session expired');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error(`❌ API PATCH Error (${endpoint}):`, error);
        throw error;
    }
}

/**
 * Multipart/Form-Data Request (for file uploads) - POST
 */
async function apiPostFormData(endpoint, formData) {
    const token = getToken();
    const headers = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: formData
        });

        if (response.status === 401) {
            if (window.location.pathname.includes('/admin/')) logout();
            throw new Error('Session expired');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error(`❌ API Form POST Error (${endpoint}):`, error);
        throw error;
    }
}

/**
 * Multipart/Form-Data Request (for file updates) - PUT
 */
async function apiPutFormData(endpoint, formData) {
    const token = getToken();
    const headers = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: formData
        });

        if (response.status === 401) {
            if (window.location.pathname.includes('/admin/')) logout();
            throw new Error('Session expired');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error(`❌ API Form PUT Error (${endpoint}):`, error);
        throw error;
    }
}
