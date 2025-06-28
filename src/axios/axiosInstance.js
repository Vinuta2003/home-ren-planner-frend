import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,  // To Send Cookies to the server
});

// Request interceptor to add auth token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await axiosInstance.post('/auth/refreshAccessToken');

                if (response.data.accessToken) {
                    localStorage.setItem('accessToken', response.data.accessToken);
                }

                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

                return axiosInstance(originalRequest);

            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;