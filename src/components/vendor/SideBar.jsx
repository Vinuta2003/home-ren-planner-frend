import { Link } from "react-router-dom";
import logo from '../../assets/imgs/logo.png';
import { LogOut, User, ClipboardList } from "lucide-react";

export default function SideBar({setActiveTab, handleLogout}) {
  return (
    <aside className="w-64 sticky top-0 h-screen bg-gradient-to-b from-blue-50 to-white border-r border-blue-100 shadow-xl rounded-r-2xl flex flex-col justify-between px-4 py-8">
      <div className="space-y-6">
        {/* Logo and Name Section */}
        <Link
          to="/"
          className="flex flex-col items-center justify-center py-6 gap-2 cursor-pointer select-none border-b border-blue-200"
        >
          <img
            src={logo}
            alt="Vendor Logo"
            className="h-14 w-14 object-cover rounded-full border-2 border-[#005eb8] bg-white shadow-sm"
          />
          <span className="text-2xl font-bold text-[#002169] tracking-tight leading-none">
            RenoBase
          </span>
        </Link>
        <div className="font-bold text-blue-900 text-xl text-center py-4 border-b border-blue-200">
          Vendor Dashboard
        </div>
        <div
          onClick={() => setActiveTab("assignedPhases")}
          className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-900 text-blue-800 font-semibold transition-all group"
        >
          <ClipboardList size={20} className="group-hover:scale-110 transition-transform" />
          Assigned Phases
        </div>
        <div
          onClick={() => setActiveTab("updateProfile")}
          className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-900 text-blue-800 font-semibold transition-all group"
        >
          <User size={20} className="group-hover:scale-110 transition-transform" />
          Update Profile
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 transition font-semibold cursor-pointer mt-8 shadow-sm"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}
