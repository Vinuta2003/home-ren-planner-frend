import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const setupInterceptors = (store) => {
  // Request Interceptor
  //console.log("Inside setUp interceptor func");
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        //console.log("token inside setUp interceptor")
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        //console.log("access token expired");
        try {
          const refreshResponse = await axios.post(
            "http://localhost:8080/auth/refreshAccessToken",
            {},
            { withCredentials: true }
          );

          const newAccessToken = refreshResponse?.data?.accessToken;
          if (newAccessToken) {
            //console.log("new access token retrived");
            store.dispatch({
              type: "auth/login", 
              payload: {
                ...store.getState().auth,
                accessToken: newAccessToken,
              },
            });

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
           //console.log("request header set with new access token");
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          store.dispatch({ type: "auth/logout" });
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;

