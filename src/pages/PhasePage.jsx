import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams,useNavigate } from "react-router-dom"
import { Pencil } from "lucide-react";
import { addPhaseMaterialsToPhase, clearChosenMaterialsList, getPhaseById } from "../redux/phase/phaseSlice";
import { PhaseMaterial } from "../components/customer/PhaseMaterial";
import { getMaterialsByPhaseType } from "../axios/phaseApis";
import { Material } from "../components/customer/Material";
import {
  PlusCircle,
  XCircle,
  CheckCircle,
  PackagePlus,
} from "lucide-react";

export function PhasePage() {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
const safeArray = (value) => {
    return Array.isArray(value) ? value : [];
};
  const {
    currentPhase,
    phaseMaterialsList,
    loaded,
    chosenMaterialsList,
  } = useSelector((state) => state.phase);

  const {
    phaseType,
    phaseName,
    description,
    startDate,
    endDate,
    phaseStatus,
    totalPhaseCost,
  } = currentPhase || {};

  const [addMode, updateAddMode] = useState(false);
  const [newMaterialsList, updateNewMaterialsList] = useState([]);

  useEffect(() => {
    updateNewMaterialsList([]);
    dispatch(clearChosenMaterialsList());
    dispatch(getPhaseById(phaseId));
  }, [dispatch, phaseId]);

  useEffect(() => {
    const handleMaterials = async () => {
        if (!addMode || !phaseType) return;
        
  const currentMaterialIds = safeArray(phaseMaterialsList).map(
            (val) => val?.materialUserResponse?.exposedId
        ).filter(Boolean);
        
        try {
            const materials = await getMaterialsByPhaseType(phaseType);
            const newMaterials = safeArray(materials).filter(
                (val) => val?.exposedId && !currentMaterialIds.includes(val.exposedId)
            );
            updateNewMaterialsList(newMaterials);
        } catch (error) {
            console.error("Error fetching materials:", error);
            updateNewMaterialsList([]);
        }
    };
    handleMaterials();
}, [addMode, phaseMaterialsList, phaseType]);

  const addButtonOnClickHandler = () => updateAddMode(true);

  const cancelButtonOnClickHandler = () => {
    updateAddMode(false);
    dispatch(clearChosenMaterialsList());
  };

  const addPhaseMaterialsOnClickHandler = async () => {
    if (chosenMaterialsList.length > 0) {
      updateAddMode(false);
      updateNewMaterialsList([]);
      await dispatch(addPhaseMaterialsToPhase(phaseId));
      await dispatch(getPhaseById(phaseId));
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 pt-24">
      <div className="mx-auto max-w-7xl bg-white pt-12 pb-20 px-12 rounded-2xl shadow-lg text-center space-y-10">
        {/* Header */}
        <div className="relative mb-6 grid grid-cols-3 items-start">
          <div></div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-800">Phase Details</h1>
            <h2 className="text-3xl font-bold text-blue-900 mt-2">{phaseName}</h2>
            <p className="text-gray-700">{description}</p>
          </div>
          <div className="text-right">
            <button
              onClick={() => navigate(`/editphase/${phaseId}`)}
              className="inline-block text-blue-600 hover:text-blue-800"
              title="Edit Phase"
            >
              <Pencil size={24} />
            </button>
          </div>
        </div>

        {/* Phase Info */}
        <div className="grid grid-cols-2 text-blue-900 mb-10 py-5">
          <div className="space-y-2 text-left p-6 px-18">
            <p><span className="font-semibold">Phase Type:</span> {phaseType}</p>
            <p><span className="font-semibold">Start Date:</span> {startDate}</p>
            <p><span className="font-semibold">Total Cost:</span> ₹{totalPhaseCost || 0}</p>
          </div>
          <div className="space-y-2 text-right p-6 px-18">
            <p><span className="font-semibold">End Date:</span> {endDate}</p>
            <p><span className="font-semibold">Status:</span> {phaseStatus}</p>
          </div>
        </div>

        {/* Phase Materials */}
        <h2 className="text-2xl font-semibold text-blue-800">Materials in Phase</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loaded ? (
            phaseMaterialsList.length > 0 ? (
              phaseMaterialsList.map((val) => (
                <PhaseMaterial phaseMaterial={val} key={val.exposedId} />
              ))
            ) : (
              <div className="text-gray-500 col-span-full">No Phase Materials Added</div>
            )
          ) : (
            <div className="text-gray-500 col-span-full">Loading Materials...</div>
          )}
        </div>

        {/* Add Materials Section */}
        {!addMode ? (
          <button
            onClick={addButtonOnClickHandler}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Materials
          </button>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Available Materials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {newMaterialsList.length > 0 ? (
                newMaterialsList.map((val) => (
                  <Material material={val} key={val.exposedId} />
                ))
              ) : (
                <div className="text-gray-500 col-span-full">No Materials Left To Add</div>
              )}
            </div>

            <div className="space-x-4 flex flex-wrap justify-center">
              {chosenMaterialsList.length > 0 && (
                <button
                  onClick={addPhaseMaterialsOnClickHandler}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-flex items-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Add Chosen Materials to Phase
                </button>
              )}
              <button
                onClick={cancelButtonOnClickHandler}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 inline-flex items-center"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhasePage;