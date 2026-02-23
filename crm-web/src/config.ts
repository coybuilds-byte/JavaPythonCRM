const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (window.location.hostname.includes('psmtechstaffing') || window.location.hostname.includes('onrender')) {
        return 'https://crm-backend-ctja.onrender.com';
    }
    return 'http://localhost:8080';
};

export const API_BASE_URL = getBaseUrl();
