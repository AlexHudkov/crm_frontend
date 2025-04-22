import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

const apiService = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

apiService.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiService.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthEndpoint = error.config?.url?.includes("/api/auth");

        if (error.response?.status === 401 && !isAuthEndpoint) {
        }

        return Promise.reject(error);
    }
);
export {
    apiService
};