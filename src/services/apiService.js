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
    const token = localStorage.getItem("access");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiService.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh/");
        const isLoginRequest = originalRequest?.url?.endsWith("/auth/");

        const is401 = error.response?.status === 401 && !isRefreshRequest && !isLoginRequest;

        if (is401) {

            if (originalRequest._retry) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = "/login";
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            originalRequest.headers["Authorization"] = "Bearer " + token;
                            resolve(apiService(originalRequest));
                        },
                        reject,
                    });
                });
            }

            isRefreshing = true;

            const refreshToken = localStorage.getItem("refresh");

            if (!refreshToken) {
                window.location.href = "/login";
                return Promise.reject(error);
            }

            try {
                const {data} = await axios.post(`${baseURL}/api/auth/refresh/`, {
                    refresh: refreshToken,
                });

                const newAccess = data.access;
                const newRefresh = data.refresh;

                localStorage.setItem("access", newAccess);
                localStorage.setItem("refresh", newRefresh);

                apiService.defaults.headers.common["Authorization"] = "Bearer " + newAccess;

                processQueue(null, newAccess);

                originalRequest.headers["Authorization"] = "Bearer " + newAccess;
                return apiService(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export {apiService};
