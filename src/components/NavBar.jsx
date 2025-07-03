import logo from "../assets/imgs/logo.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/auth/authSlice";
import {
  LogIn,
  LogOut,
  User,
  PlusCircle,
  X,
  UserCircle2,
  Star,
} from "lucide-react";
import { useState } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, url } = useSelector((state) => state.auth);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setShowSidebar(false);
  };

  const renderAvatar = () => {
    if (url) {
      return (
        <img
          src={url}
          alt="Profile"
          className="h-10 w-10 object-cover rounded-full border-2 border-[#005eb8] shadow-sm bg-white"
        />
      );
    }

    return (
      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 border-2 border-[#005eb8]">
        <User className="text-[#005eb8]" size={22} />
      </div>
    );
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 border-b border-blue-100">
        <div className="mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="Logo"
              className="h-11 w-11 object-cover rounded-full border-2 border-[#005eb8] bg-white shadow-sm"
            />
            <span className="text-2xl font-bold text-[#002169] tracking-tight leading-none">
              RenoBase
            </span>
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              className="bg-[#005eb8] text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-[#004a94] transition-all text-base font-semibold tracking-wide cursor-pointer border-2 border-[#005eb8] focus:outline-none focus:ring-2 focus:ring-blue-200 flex items-center gap-2"
              onClick={() => navigate("/create-project")}
            >
              <PlusCircle className="w-5 h-5" />
              Create Project
            </button>

            {!email ? (
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#005eb8] text-[#005eb8] bg-white hover:bg-blue-50 shadow-sm text-base font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200"
                onClick={() => navigate("/login")}
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
            ) : (
              <>
                <button
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-red-500 text-red-500 bg-white hover:bg-red-50 shadow-sm text-base font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-200"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
                <div
                  className="ml-2 flex items-center gap-2 cursor-pointer group"
                  onClick={() => setShowSidebar(true)}
                  title="Profile"
                >
                  {renderAvatar()}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      {showSidebar && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setShowSidebar(false)}
          />
          {/* Sidebar */}
          <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-xl z-50 border-l border-gray-200 p-5 transition-transform duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 border-b pb-3">
              <h2 className="text-xl font-semibold text-[#002169]">
                My Account
              </h2>
              <X
                className="cursor-pointer text-gray-600 hover:text-black"
                onClick={() => setShowSidebar(false)}
              />
            </div>

            {/* Avatar + Email */}
            <div className="flex items-center gap-3 mb-6">
              {renderAvatar()}
              <div>
                <p className="text-[#002169] font-medium">{email || "Guest"}</p>
                <p className="text-sm text-gray-500">
                  {email ? "Logged in" : "Please Sign In"}
                </p>
              </div>
            </div>

            {/* Links */}
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleNavigate("/update-profile")}
                  className="w-full flex items-center gap-3 p-3 rounded-md border border-[#005eb8] text-[#005eb8] hover:bg-blue-50 transition-all"
                >
                  <UserCircle2 className="w-5 h-5" />
                  Update Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("/my-reviews")}
                  className="w-full flex items-center gap-3 p-3 rounded-md border border-[#005eb8] text-[#005eb8] hover:bg-blue-50 transition-all"
                >
                  <Star className="w-5 h-5" />
                  My Reviews
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}
