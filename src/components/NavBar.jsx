import logo from "../assets/imgs/logo.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/auth/authSlice";
import { LogIn, LogOut, User, PlusCircle } from "lucide-react";

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, url, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
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
    <nav className="fixed top-0 left-0 w-full h-20 bg-white shadow-md z-50 border-b border-blue-100">
      <div className=" mx-auto px-6 h-20 flex items-center justify-between">

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

        <div className="flex items-center gap-2 md:gap-4">

          {role=="CUSTOMER" && <button
            className="bg-[#005eb8] text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-[#004a94] transition-all text-base font-semibold tracking-wide cursor-pointer border-2 border-[#005eb8] focus:outline-none focus:ring-2 focus:ring-blue-200 flex items-center gap-2"
            onClick={() => navigate("/create-project")}
          >
            <PlusCircle className="w-5 h-5" />
            Create Project
          </button>
}
          {!email ? (
            <button
              className="flex items-center gap-2 px-5 py-2.5 [&:hover]:bg-[#005eb8] hover:text-white rounded-lg border-2 border-[#005eb8] text-[#005eb8] bg-white hover:bg-blue-50 shadow-sm text-base font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200"
              onClick={() => navigate("/login")}
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          ) : (
            <>
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-red-500 text-red-500 bg-white hover:bg-red-100 shadow-sm text-base font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-200"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
              <div
                className="ml-2 flex items-center gap-2 cursor-pointer group"
                onClick={() => navigate("/update-profile")}
                title="Profile"
              >
                {renderAvatar()}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
