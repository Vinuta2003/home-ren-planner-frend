import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPhasesByProject } from "../app/features/phaseListSlice"; // adjust if needed
import { Plus } from "lucide-react";

function PhaseList() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const phases = useSelector((state) => state.phaselist.projectPhases || []);
  const loading = useSelector((state) => state.phaselist.loading);

  useEffect(() => {
    if (projectId) dispatch(getPhasesByProject(projectId));
  }, [dispatch, projectId]);

  return (

    <div className="flex min-h-screen bg-blue-50">
      {/* Collapsible Sidebar */}
      <aside className="group w-16 hover:w-64 transition-all duration-300 bg-white shadow-lg p-4 overflow-hidden">
        <div className="flex flex-col items-start">
          {/* Hamburger Icon */}
          <div className="mb-6">
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-blue-600"></div>
              <div className="w-6 h-0.5 bg-blue-600"></div>
              <div className="w-6 h-0.5 bg-blue-600"></div>
            </div>
          </div>

          {/* Sidebar Links */}
          <ul className="space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <li className="text-blue-600 font-medium cursor-pointer hover:underline">Dashboard</li>
            <li className="text-blue-600 font-medium cursor-pointer hover:underline">Profile</li>
            <li className="text-blue-600 font-medium cursor-pointer hover:underline">Phases</li>
          </ul>
        </div>
      </aside>


      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold text-blue-800 mb-6">Phases</h1>

          {loading ? (
            <p className="text-gray-500 text-center mt-20">Loading...</p>
          ) : phases.length === 0 ? (
            <p className="text-gray-500 text-center mt-20">
              No phases found. Create one now!
            </p>
          ) : (
            <div className="flex flex-col space-y-4">
              {phases.map((phase) => (
                <div
  key={phase.id}
  className="bg-blue-100 border border-blue-300 p-4 rounded-xl shadow-md flex justify-between items-start"
>
  <div>
    <h3 className="font-bold text-blue-800 text-lg mb-1">{phase.phaseName}</h3>
    <p className="text-sm text-blue-800">{phase.description}</p>
  </div>

  <span
    className={`text-xs font-semibold px-3 py-1 rounded-full mt-1
      ${
        phase.phaseStatus === "NOTSTARTED"
          ? "bg-red-100 text-red-700"
          : phase.phaseStatus === "INSPECTION"
          ? "bg-yellow-100 text-yellow-700"
          : phase.phaseStatus === "INPROGRESS"
          ? "bg-green-100 text-green-700"
          : "bg-blue-200 text-blue-800"
      }`}
  >
    {phase.phaseStatus}
  </span>
</div>

              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => navigate(`/phase-form`)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg group hover:bg-blue-700 transition"
      >
        <div className="flex items-center space-x-2">
          <Plus className="w-6 h-6" />
          <span className="hidden group-hover:inline-block font-medium">
            Create Phase
          </span>
        </div>
      </button>
    </div>
  );
}

export default PhaseList;
