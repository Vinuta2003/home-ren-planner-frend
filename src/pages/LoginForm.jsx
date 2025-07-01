import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../axios/axiosInstance";
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../redux/auth/authSlice';
import { useNavigate } from "react-router-dom"

export default function LoginForm() {

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});


  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log("AuthState of Login Page: ", authState);
  }, [authState]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      console.log("Login Submitted", formData);

      const response = await axiosInstance.post("/auth/login", formData);
      
      const responseData = response?.data;
      console.log("Response", responseData);

      if (responseData) {
        dispatch(
          login({
            email: responseData?.email,
            role: responseData?.role,
            accessToken: responseData?.accessToken,
          })
        );
      }

      if(responseData?.message === "SUCCESS"){
        e.target.reset();
        setFormData({ email: "", password: "" });
        setErrors({});
        toast.success("Login successful! Welcome back!", {
          onClose: () => {
            if(responseData?.role === "ADMIN") navigate("/admin-dashboard")
            else if(responseData?.role === "VENDOR") navigate("/vendor-dashboard")
            else navigate("/user-dashboard")
          },
          autoClose: 3000
        })
      }
      else toast.message("Login Unsuccessful!")

    } catch (e) {
      if (e.response && e.response.data) {
        console.log("Error Response", e.response.data);
        toast.error(e.response.data.message || "Login Unsuccessful!");
      } else {
        toast.error("Login Unsuccessful!");
      }
    }
    
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-3">{errors.email}</p>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-3">{errors.password}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition hover:cursor-pointer"
        >
          Login
        </button>
        <div className="mt-6 text-center text-blue-900 text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 font-semibold hover:underline">Register here</a>
        </div>
      </form>
    </div>
  );
}
