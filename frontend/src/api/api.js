import axios from 'axios';

// ======================================================
// CONFIGURACIÓN DE LA API
// ======================================================

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ======================================================
// INTERCEPTOR DE REQUEST
// Agrega automáticamente el JWT a cada petición.
// ======================================================

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ======================================================
// RUTAS
// ======================================================

export const getRutas = async () => {
    const response = await api.get('/rutas');
    return response.data;
};

export const getZonasCriticas = async () => {
    const response = await api.get('/rutas/zonas');
    return response.data;
};

export const getParadas = async () => {
    const response = await api.get('/rutas/paradas');
    return response.data;
};

export default api;