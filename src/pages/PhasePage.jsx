import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  addPhaseMaterialsToPhase,
  clearChosenMaterialsList,
  getPhaseById,
} from "../redux/phase/phaseSlice";
import { getMaterialsByPhaseType } from "../axios/phaseApis";
import { PhaseMaterial } from "../components/customer/PhaseMaterial";
import { Material } from "../components/customer/Material";
import ReviewModal from "../components/ReviewModal";
import {
  Pencil,
  PlusCircle,
  XCircle,
  CheckCircle,
} from "lucide-react";

export function PhasePage() {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const safeArray = (value) => Array.isArray(value) ? value : [];

  const {
    currentPhase,
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
    vendor,
    phaseMaterialList = [],
    totalPhaseMaterialCost,
    vendorCost
  } = currentPhase || {};

  const [addMode, updateAddMode] = useState(false);
  const [newMaterialsList, updateNewMaterialsList] = useState([]);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);

  useEffect(() => {
    updateNewMaterialsList([]);
    dispatch(clearChosenMaterialsList());
    dispatch(getPhaseById(phaseId));
  }, [dispatch, phaseId]);

  useEffect(() => {
    const handleMaterials = async () => {
      if (!addMode || !phaseType) return;

      const currentMaterialIds = safeArray(phaseMaterialList)
        .map((val) => val?.materialExposedId)
        .filter(Boolean);

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
  }, [addMode, phaseMaterialList, phaseType]);

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
  console.log("phaseStatus:", phaseStatus);
  console.log("vendor:", vendor?.name);
  console.log("hasSubmittedReview:", hasSubmittedReview);
  
  return (
    <div className="min-h-screen bg-blue-50 p-6 pt-24">
      <div className="mx-auto max-w-7xl bg-white pt-12 pb-20 px-12 rounded-2xl shadow-lg text-center space-y-10">
        {/* Header */}
        <div className="relative mb-6 grid grid-cols-3 items-start">
          <div></div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-800">Phase Details</h1>
            <h2 className="text-2xl font-bold text-blue-900 mt-2">{phaseName}</h2>
            <p className="text-black mt-2">{description}</p>
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
        <div className="grid grid-cols-2 text-blue-900 mb-8 py-2">
          <div className="space-y-2 text-left p-6 px-18">
            <p><span className="font-semibold">Phase Type:</span> {phaseType}</p>
            <p><span className="font-semibold">Start Date:</span> {startDate}</p>
            <p><span className="font-semibold">End Date:</span> {endDate}</p>
            {vendor && <p><span className="font-semibold">Vendor:</span> {vendor.name}</p>}
          </div>
          <div className="space-y-2 text-right p-6 px-18">
            <p><span className="font-semibold">Status:</span> {phaseStatus}</p>
            <p><span className="font-semibold">Total Materials Cost:</span> ₹{totalPhaseMaterialCost||0}</p>
            <p><span className="font-semibold">Total Vendor Cost:</span> ₹{vendorCost||0}</p>
            <p><span className="font-semibold">Total Cost:</span> ₹{totalPhaseCost || 0}</p>
          </div>
        </div>

        {/* Phase Materials */}
        {phaseStatus!="NOTSTARTED" && <h2 className="text-2xl font-semibold text-blue-800">Materials Added To Phase</h2>}
        {phaseStatus!="NOTSTARTED" && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loaded ? (
            phaseMaterialList.length > 0 ? (
              phaseMaterialList.map((val) => (
                <PhaseMaterial phaseMaterial={val} phaseStatus={phaseStatus} key={val.exposedId} />
              ))
            ) : (
              <div className="text-gray-500 col-span-full">No Materials Added</div>
            )
          ) : (
            <div className="text-gray-500 col-span-full">Loading Materials...</div>
          )}
        </div>}

        {phaseStatus!="NOTSTARTED" &&
        (!addMode ? (
          (phaseStatus!="COMPLETED" && <button
            onClick={addButtonOnClickHandler}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Materials
          </button>)
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-800">Available Materials To Add</h2>
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
        ))}


        {/* Review Modal if phase completed */}
        {phaseStatus === "COMPLETED" && vendor && !hasSubmittedReview && (
          <ReviewModal
            vendor={vendor}
            onReviewSubmit={() => setHasSubmittedReview(true)}
          />
        )}
      </div>
    </div>
  );
}

export default PhasePage;
