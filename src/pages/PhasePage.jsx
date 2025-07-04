import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  addPhaseMaterialsToPhase,
  clearChosenMaterialsList,
  getPhaseById,
} from "../app/features/phaseSlice";
import { PhaseMaterial } from "../components/PhaseMaterial";
import { getMaterialsByPhaseType } from "../app/apis/phaseApis";
import { Material } from "../components/Material";

export function PhasePage() {
  const { phaseId } = useParams();
  const dispatch = useDispatch();
const { currentPhase, phaseMaterialsList, loaded } = useSelector((state) => state.phase);

  const {
  phaseType,
  phaseName,
  description,
  startDate,
  endDate,
  id,
  phaseStatus,
  totalPhaseCost,
} = currentPhase || {};

  const [addMode, updateAddMode] = useState(false);
  const [newMaterialsList, updateNewMaterialsList] = useState([]);

  useEffect(() => {
    dispatch(clearChosenMaterialsList());
    dispatch(getPhaseById(phaseId));
  }, [phaseId]);

  useEffect(() => {
    const handleMaterials = async () => {
      if (!addMode) return;

      const currentMaterialIds = phaseMaterialsList.map(
        (val) => val.materialUserResponse.exposedId
      );
      const materials = await getMaterialsByPhaseType(phaseType);
      const newMaterials = materials.filter(
        (val) => !currentMaterialIds.includes(val.exposedId)
      );
      updateNewMaterialsList(newMaterials);
    };

    handleMaterials();
  }, [addMode, phaseMaterialsList.length, phaseId]);

  const addButtonOnClickHandler = () => {
    updateAddMode(true);
  };

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
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Phase Details</h1>

        <div className="grid grid-cols-2 gap-4 mb-6 text-blue-800">
          <div><strong>Name:</strong> {phaseName}</div>
          <div><strong>Description:</strong> {description}</div>
          <div><strong>Start Date:</strong> {startDate}</div>
          <div><strong>End Date:</strong> {endDate}</div>
          <div><strong>Phase Type:</strong> {phaseType}</div>
          <div><strong>Status:</strong> {phaseStatus}</div>
          <div><strong>Total Cost:</strong> ₹{totalPhaseCost || 0}</div>
        </div>

        <h2 className="text-xl font-semibold text-blue-800 mb-3">Materials in Phase</h2>
        <div id="phase-materials-display" className="space-y-4 mb-6">
          {loaded ? (
            phaseMaterialsList.length > 0 ? (
              phaseMaterialsList.map((val) => (
                <PhaseMaterial phaseMaterial={val} key={val.exposedId} />
              ))
            ) : (
              <div className="text-gray-600">No Phase Materials Added</div>
            )
          ) : (
            <div className="text-gray-600">Loading Materials...</div>
          )}
        </div>

        {!addMode && (
          <div className="mb-4">
            <button
              onClick={addButtonOnClickHandler}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Materials
            </button>
          </div>
        )}

        {addMode && (
          <>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Available Materials</h2>
            <div className="space-y-3 mb-4">
              {newMaterialsList.length > 0 ? (
                newMaterialsList.map((val) => (
                  <Material material={val} key={val.exposedId} />
                ))
              ) : (
                <div className="text-gray-600">No Materials Left To Add</div>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={addPhaseMaterialsOnClickHandler}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Chosen Materials to Phase
              </button>
              <button
                onClick={cancelButtonOnClickHandler}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PhasePage;
