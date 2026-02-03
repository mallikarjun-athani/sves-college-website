/**
 * SVES College Website - API Configuration
 * This file provides the base URL and helper functions for API calls
 */

// API Base URL - Uses Railway in production and localhost in development
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://sves-college-harugeri.up.railway.app/api';

// Auth token management
const AUTH_TOKEN_KEY = 'sves_admin_token';

function getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

function setToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function removeToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
}

function isLoggedIn() {
    return !!getToken();
}

function logout() {
    console.log("Logging out...");
    alert("Signing out. Redirecting to home page...");
    localStorage.clear();
    window.location.href = "../index.html";
}

window.logout = logout;

// API helper with authentication
async function apiCall(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        ...options.headers
    };

    // Add auth header if token exists and not explicitly set
    if (token && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Add JSON content type for non-FormData requests
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
        removeToken();
        if (window.location.pathname.includes('/admin/')) {
            window.location.href = 'login.html';
        }
        throw new Error('Unauthorized');
    }

    return response;
}

// Convenience methods
async function apiGet(endpoint) {
    const response = await apiCall(endpoint);
    return response.json();
}

async function apiPost(endpoint, data) {
    const isFormData = data instanceof FormData;
    const response = await apiCall(endpoint, {
        method: 'POST',
        body: isFormData ? data : JSON.stringify(data)
    });
    return response.json();
}

async function apiDelete(endpoint) {
    const response = await apiCall(endpoint, {
        method: 'DELETE'
    });
    return response.json();
}

async function apiPut(endpoint, data) {
    const isFormData = data instanceof FormData;
    const response = await apiCall(endpoint, {
        method: 'PUT',
        body: isFormData ? data : JSON.stringify(data)
    });
    return response.json();
}

// Date formatting helper
function formatDate(dateString) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Helper to resolve paths (handles absolute URLs from Supabase and relative paths)
function resolvePath(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    // Check if we are in admin folder
    const isAdmin = window.location.pathname.includes('/admin/');
    if (isAdmin) {
        return `../../${path}`;
    }
    // For root level pages (index, notes, etc.)
    return path;
}
