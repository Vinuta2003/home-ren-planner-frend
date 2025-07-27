import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../redux/auth/authSlice";
import { Users, Building2, Package, LogOut, LayoutDashboard } from "lucide-react";

import logo from "../../assets/imgs/logo.png";

export default function SideBar({ setActiveTab, activeTab }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const tabs = [
    { name: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "customer", label: "Customer", icon: <Users size={18} /> },
    { name: "vendor", label: "Vendor", icon: <Building2 size={18} /> },
    { name: "material", label: "Material", icon: <Package size={18} /> },
  ];

  return (
    <div className="h-screen w-64 bg-blue-100 text-blue-900 flex flex-col shadow-md fixed top-0 left-0 z-20">
      <Link
        to="/"
        className="flex flex-col items-center justify-center py-6 gap-2 cursor-pointer select-none border-b border-blue-200"
      >
        <img
          src={logo}
          alt="Logo"
          className="h-14 w-14 object-cover rounded-full border-2 border-[#005eb8] bg-white shadow-sm"
        />
        <span className="text-2xl font-bold text-[#002169] tracking-tight leading-none">
          RenoBase
        </span>
      </Link>
      <div className="font-bold text-xl text-center py-4 border-b border-blue-200">
        Admin Dashboard
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition ${
              activeTab === tab.name
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-200"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-200">
        <button className="w-full flex items-center gap-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer" 
        onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}