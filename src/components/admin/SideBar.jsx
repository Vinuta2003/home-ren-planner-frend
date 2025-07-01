import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { logout } from "../../redux/auth/authSlice";
import { Users, Building2, Package, LogOut } from "lucide-react";

export default function SideBar({ setActiveTab, activeTab }) {

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    <Navigate to="/login" replace/>
  }

  const tabs = [
    { name: "customer", label: "Customer", icon: <Users size={18} /> },
    { name: "vendor", label: "Vendor", icon: <Building2 size={18} /> },
    { name: "material", label: "Material", icon: <Package size={18} /> },
  ];

  return (
    <div className="h-screen w-64 bg-blue-100 text-blue-900 flex flex-col shadow-md fixed top-0 left-0 z-20">
      <div className="p-6 font-bold text-xl text-center border-b border-blue-200">
        Admin Panel
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