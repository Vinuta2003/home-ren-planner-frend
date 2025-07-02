import logo from "../assets/imgs/logo.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/auth/authSlice";

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo + Brand */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 object-cover rounded-full border border-blue-100"
          />
          <span className="text-2xl font-semibold text-[#002169] tracking-tight">
            RenoBase
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-3">
          <button
            className="bg-[#005eb8] text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-[#004a94] transition-all text-sm font-medium tracking-wide"
            onClick={() => navigate("/create-project")}
          >
            Create Project
          </button>

          {!email ? (
            <button
              className="px-5 py-2.5 rounded-lg border border-[#005eb8] text-[#005eb8] bg-white hover:bg-blue-50 shadow-sm text-sm font-medium transition-all"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          ) : (
            <>
              <button
                className="px-5 py-2.5 rounded-lg border border-[#005eb8] text-[#005eb8] bg-white hover:bg-blue-50 shadow-sm text-sm font-medium transition-all"
                onClick={() => navigate("/update-profile")}
              >
                Profile
              </button>
              <button
                className="px-5 py-2.5 rounded-lg border border-red-500 text-red-500 bg-white hover:bg-red-50 shadow-sm text-sm font-medium transition-all"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
