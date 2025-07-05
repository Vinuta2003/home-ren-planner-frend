// PhasePage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  addPhaseMaterialsToPhase,
  clearChosenMaterialsList,
  getPhaseById,
} from "../redux/phase/phaseSlice";
import { getMaterialsByPhaseType } from "../axios/phaseApis";
import { Material } from "../components/Material";
import { PhaseMaterial } from "../components/phaseMaterial";

export function PhasePage() {
  const { phaseId } = useParams();
  const dispatch = useDispatch();
  const phaseMaterialsList = useSelector((state) => state.phase.phaseMaterialsList);
  const loaded = useSelector((state) => state.phase.loaded);
  const phaseType = useSelector((state) => state.phase.phaseType);
  const chosenMaterialsList = useSelector((state) => state.phase.chosenMaterialsList);
  const [addMode, updateAddMode] = useState(false);
  const [newMaterialsList, updateNewMaterialsList] = useState([]);

  useEffect(() => {
    updateNewMaterialsList([]);
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

  const addPhaseMaterialsOnClickHandler = async () => {
    if (chosenMaterialsList.length > 0) {
      updateAddMode(false);
      updateNewMaterialsList([]);
      await dispatch(addPhaseMaterialsToPhase(phaseId));
      await dispatch(getPhaseById(phaseId));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Phase Materials</h1>
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

      {!addMode ? (
        <button
          onClick={() => updateAddMode(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Materials
        </button>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">Available Materials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newMaterialsList.length > 0 ? (
              newMaterialsList.map((val) => (
                <Material material={val} key={val.exposedId} />
              ))
            ) : (
              <div className="text-gray-500 col-span-full">No Materials Left To Add</div>
            )}
          </div>
          <div className="space-x-4">
            {chosenMaterialsList.length > 0 && (
              <button
                onClick={addPhaseMaterialsOnClickHandler}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Chosen Materials to Phase
              </button>
            )}
            <button
              onClick={() => {
                updateAddMode(false);
                dispatch(clearChosenMaterialsList());
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
