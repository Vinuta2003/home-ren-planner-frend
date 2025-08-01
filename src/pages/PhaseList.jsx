import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPhasesByRoom } from "../redux/phase/phaseListSlice";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import axiosInstance from "../axios/axiosInstance";

function PhaseList() {
  const { exposedId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [phaseToDelete, setPhaseToDelete] = useState(null);
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const roomPhases = useSelector((state) => state.phaselist?.roomPhases);
  const phases = useMemo(() => roomPhases || [], [roomPhases]);
  const loading = useSelector((state) => state.phaselist?.loading || false);

  useEffect(() => {
    if (exposedId) dispatch(getPhasesByRoom(exposedId));
  }, [dispatch, exposedId]);

  const handleDeleteClick = (id) => {
    setPhaseToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    axiosInstance
      .delete(`http://localhost:8080/phase/delete/${phaseToDelete}`)
      .then(() => {
        dispatch(getPhasesByRoom(exposedId));
        setShowDeleteModal(false);
      })
      .catch((err) => {
        console.error("Failed to delete phase", err);
        alert("Error deleting phase");
        setShowDeleteModal(false);
      });
  };

  const cancelDelete = () => {
    setPhaseToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="flex  bg-blue-50 pt-20 py-70">
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
                  className="bg-blue-100 border border-blue-300 p-4 rounded-xl shadow-md flex justify-between items-start hover:shadow-lg transition"
                >
                  <Link to={`/phase/${phase.id}`} className="flex-1">
                    <h3 className="font-bold text-blue-900 text-lg mb-1">
                      {phase.phaseName}
                    </h3>
                    <div className="space-y-2 text-left p-4 px-2">
                      <p><span className="font-semibold text-blue-800">Start Date:</span> {formatDate(phase.startDate)}</p>
                      <p><span className="font-semibold text-blue-800 ">End Date:</span> {formatDate(phase.endDate)}</p>
                    </div></Link>

                  <div className="flex items-center gap-2 py-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full
                        ${phase.phaseStatus === "NOTSTARTED"
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

                    <button
                      onClick={() => handleDeleteClick(phase.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Phase"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

     {/* Delete Confirmation Popup */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this phase? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate(`/phase-form/${exposedId}`)}
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