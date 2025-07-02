import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../axios/axiosInstance";
import { Navigate } from "react-router-dom";
import { logout, updateAccessToken } from "../redux/auth/authSlice";
import Unauthorized from "../pages/Unauthorized";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkToken = async () => {
      if (!user?.accessToken) {
        setIsLoading(false);
        setIsAuthenticated(false);
        setIsAuthorized(false);
        return(
          <Navigate to="/login" replace/>
        )
      }

      try {
        const decoded = jwtDecode(user?.accessToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          try {
            const response = await axiosInstance.post("/auth/refresh"); 
            const newAccessToken = response.data.accessToken;
            dispatch(updateAccessToken({newAccessToken}));
            setIsAuthenticated(true);
            checkRole()
          } catch (refreshError) {
            console.log("Refresh token failed:", refreshError);
            dispatch(logout());
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(true);
          checkRole()
        }
      } catch (decodeError) {
        console.log("Invalid token:", decodeError);
        dispatch(logout());
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    const checkRole = () => {
      if (allowedRoles && !allowedRoles.includes(user?.role)) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    };

    checkToken();
  }, [user?.accessToken, dispatch, allowedRoles]);

  if (isLoading) {
    return <div>Loading...</div>; // or your custom loader
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  else if(!isAuthorized) return <Unauthorized/>
  else if(isAuthenticated && isAuthorized) return children;
};

export default ProtectedRoute;
