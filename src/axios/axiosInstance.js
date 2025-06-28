import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // To Send Cookies to the server
});


// ✅ Request Interceptor – Attach accessToken from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const authState = JSON.parse(localStorage.getItem("authState"));
    const token = authState?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor – Refresh token if accessToken expired
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and token not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token request
        const refreshResponse = await axios.post(
          "http://localhost:8080/auth/refreshAccessToken", 
          {}, 
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse?.data.accessToken;

        if (newAccessToken) {
          // ✅ Update localStorage with new access token
          const existingState = JSON.parse(localStorage.getItem("authState")) || {};
          const updatedState = {
            ...existingState,
            accessToken: newAccessToken
          };
          localStorage.setItem("authState", JSON.stringify(updatedState));

          // ✅ Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed → Clear auth and redirect to login
        localStorage.removeItem("authState");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
