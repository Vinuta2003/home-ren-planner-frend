import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Home from "./pages/Home";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";

import VendorListDisplay from "./pages/VendorListDisplay";
import UpdateProfile from "./pages/UpdateProfile";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import VendorDashboard from "./pages/VendorDashboard";

function App() {
  let location = useLocation();
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {!location.pathname.includes("dashboard") && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/update-profile"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER", "VENDOR"]}>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-project"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              {/* Add Create Project Component Here */}
            </ProtectedRoute>
          }
        />
        <Route path="/vendorlist" element={<VendorListDisplay />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["VENDOR"]}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {!location.pathname.includes("dashboard") && <Footer />}
    </>
  );
}

export default App;
