import { LogOut, User, ClipboardList } from "lucide-react";


export default function SideBar({setActiveTab, handleLogout}) {

  return (
    <aside className="w-64 sticky top-0 h-screen bg-gradient-to-b from-blue-50 to-white border-r border-blue-100 shadow-xl rounded-r-2xl flex flex-col justify-between px-4 py-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-blue-800 px-2 text-center mx-auto tracking-wide mb-2">VENDOR DASHBOARD</h2>
        <hr className="border-blue-200 mb-4" />
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
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition font-semibold cursor-pointer mt-8 shadow-sm"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}
