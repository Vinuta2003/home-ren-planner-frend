import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import {
  addPhaseMaterialsToPhase,
  clearChosenMaterialsList,
  getPhaseById,
} from "../app/features/phaseSlice";
import { getMaterialsByPhaseType } from "../app/apis/phaseApis";
import { PhaseMaterial } from "../components/PhaseMaterial";
import { Material } from "../components/Material";
import ReviewModal from "../components/ReviewModal";
import {getPhaseTotalCost} from "../app/features/phaseListSlice";

export function PhasePage() {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [calculatedCost, setCalculatedCost] = useState(null);

  const fetchPhaseTotalCost = async () => {
    try {
      const response = dispatch(getPhaseTotalCost(phaseId));
      setCalculatedCost(response.data);
    } catch (error) {
      console.error("Error fetching total cost:", error);
    }
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
    vendor, // This will now be your VendorDTO object from the backend
  } = currentPhase || {};

  const [addMode, updateAddMode] = useState(false);
  const [newMaterialsList, updateNewMaterialsList] = useState([]);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);

  useEffect(() => {
    dispatch(clearChosenMaterialsList());
    dispatch(getPhaseById(phaseId));
    fetchPhaseTotalCost();
  }, [dispatch, phaseId]);

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
  }, [addMode, phaseMaterialsList.length, phaseType]);

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
console.log("cost",totalPhaseCost);
  return (
    
    <div className="bg-blue-50 px-80 pt-26 pb-8 ">
      <div className="ml-10 max-w-5xl bg-white pt-12 pb-20 px-12 rounded-2xl shadow-lg text-center">
        {/* Header */}
       {/* Heading Section */}
<div className="relative mb-6 grid grid-cols-3 items-start">
  {/* Left placeholder */}
  <div></div>

  {/* Center Heading */}
  <div className="text-center">
    <h1 className="text-2xl font-bold text-blue-900 ">PHASE DETAILS</h1>
    <h2 className="text-3xl font-bold text-blue-800 mt-2">{phaseName}</h2>
    
    <p className="text-blue-900 py-2 mt-2">{description}</p>
  </div>

  {/* Edit button in right column */}
  <div className="text-right">
    <button
      onClick={() => navigate(`/editphase/${phaseId}`)}
      className="inline-block text-blue-900 hover:text-blue-800"
      title="Edit Phase"
    >
      <Pencil size={24} />
    </button>
  </div>
</div>

{/* Phase Info */}
<div className="grid grid-cols-2 text-blue-900 mb-8 py-2">
  <div className="space-y-2 text-left p-6 px-18">
    <p><span className="font-semibold">Phase Type:</span> {phaseType}</p>
    <p><span className="font-semibold">Start Date:</span> {startDate}</p>
    <p><span className="font-semibold">End Date:</span> {endDate}</p>
  </div>
  <div className="space-y-2 text-right p-6 px-18">
  <p><span className="font-semibold">Total Cost:</span> ₹{totalPhaseCost || 0}</p>
    <p><span className="font-semibold">Status:</span> {phaseStatus}</p>
  </div>
</div>

        

        {/* Materials in Phase */}
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Materials in Phase</h2>
        <div className="space-y-4 mb-6">
          {loaded ? (
            phaseMaterialsList.length > 0 ? (
              phaseMaterialsList.map((val) => (
                <PhaseMaterial phaseMaterial={val} key={val.exposedId} />
              ))
            ) : (
              <p className="text-gray-600">No Phase Materials Added</p>
            )
          ) : (
            <p className="text-gray-600">Loading Materials...</p>
          )}
        </div>

        {/* Add Materials Button */}
        {!addMode && (
          <button
            onClick={addButtonOnClickHandler}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Materials
          </button>
        )}

        {/* Add Materials Section */}
        {addMode && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Available Materials</h2>
            <div className="space-y-3 mb-4">
              {newMaterialsList.length > 0 ? (
                newMaterialsList.map((val) => (
                  <Material material={val} key={val.exposedId} />
                ))
              ) : (
                <p className="text-gray-600">No Materials Left To Add</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={addPhaseMaterialsOnClickHandler}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Chosen Materials to Phase
              </button>
              <button
                onClick={cancelButtonOnClickHandler}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Review Prompt */}
        {phaseStatus === "COMPLETED" && vendor && !hasSubmittedReview && (
          <ReviewModal
            vendor={vendor} // Pass the VendorDTO object
            onReviewSubmit={() => setHasSubmittedReview(true)}
          />
        )}
      </div>
    </div>
  );
}


export default PhasePage;