import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPhasesByProject } from "../app/features/phaseListSlice";// adjust the path if needed
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
console.log("Phases from Redux:", phases);

  return (
    <div className="min-h-screen bg-blue-50 p-6 relative">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Phases</h1>

      {loading ? (
        <p className="text-gray-500 text-center mt-20">Loading...</p>
      ) : phases.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">No phases found. Create one now!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phases.map((phase) => (
            <div key={phase.id} className="bg-white p-4 shadow-md rounded-xl">
              <h3 className="font-semibold text-lg mb-1">{phase.phaseName}</h3>
              <p className="text-sm text-gray-500">{phase.description}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate(`/phase-form`)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg group hover:bg-blue-700 transition"
      >
        <div className="flex items-center space-x-2">
          <Plus className="w-6 h-6" />
          <span className="hidden group-hover:inline-block font-medium">Create Phase</span>
        </div>
      </button>
    </div>
  );
}

export default PhaseList;
