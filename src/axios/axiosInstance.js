import axios from "axios";

// Factory function for testability
export function createAxiosInstance(axiosLib = axios) {
  const axiosInstance = axiosLib.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  const setupInterceptors = (store) => {
    axiosInstance.interceptors.request.use(
      (config) => {
        const token = store.getState().auth.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await axiosLib.post(
              "http://localhost:8080/auth/refreshAccessToken",
              {},
              { withCredentials: true }
            );
            const newAccessToken = refreshResponse?.data?.accessToken;
            if (newAccessToken) {
              store.dispatch({
                type: "auth/login",
                payload: {
                  ...store.getState().auth,
                  accessToken: newAccessToken,
                },
              });
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return axiosInstance.request(originalRequest);
            }
          } catch (refreshError) {
            store.dispatch({ type: "auth/logout" });
            console.log("Inside catch of response interceptor");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  };

  return { axiosInstance, setupInterceptors };
}

// Default export for app code
const { axiosInstance, setupInterceptors } = createAxiosInstance();
export { setupInterceptors };
export default axiosInstance;

