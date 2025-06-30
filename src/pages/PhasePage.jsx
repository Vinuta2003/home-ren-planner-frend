import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams,useNavigate } from "react-router-dom"
import axiosInstance from "../axios/axiosInstance";
import { addPhaseMaterialsToPhase, getPhaseById, getPhaseMaterialsByPhaseId } from "../app/features/phaseSlice";
import { PhaseMaterial } from "../components/phaseMaterial";
import { getMaterialsByPhaseType } from "../app/apis/phaseApis";
import { Material } from "../components/Material";
import { Plus } from "lucide-react";


export function PhasePage(props){

    const {phaseId} = useParams();
    const dispatch = useDispatch();
    const phaseMaterialsList = useSelector((state)=>state.phase.phaseMaterialsList);
    const loaded = useSelector((state)=>state.phase.loaded);
    const phaseType = useSelector((state)=>state.phase.phaseType);
    const chosenMaterialsList = useSelector((state)=>state.phase.chosenMaterialsList);
    const [addMode,updateAddMode] = useState(false)
    const [existingMaterialIds, updateExistingMaterialIds] = useState([]);
    const [newMaterialsList, updateNewMaterialsList] = useState([]);
    const { projectId } = useParams();
  const navigate = useNavigate();
  const [phases, setPhases] = useState([]);
useEffect(() => {
    fetchPhases();
  }, []);

  const fetchPhases = () => {
    axiosInstance.get(`/phase/project/${projectId}`)
      .then(res => setPhases(res.data))
      .catch(err => console.error(err));
  };
    useEffect(()=>{
        dispatch(getPhaseById(phaseId));
    },[phaseId])

    useEffect(()=>{
        updateExistingMaterialIds(phaseMaterialsList.map((val)=>val.materialUserResponse.exposedId));
    },[phaseMaterialsList])

    const addButtonOnClickHandler = async()=>{
        const materials = await getMaterialsByPhaseType(phaseType);
        console.log("material list",materials);
        console.log("phase materials ids",existingMaterialIds);
        const newMaterials = materials.filter((val)=> !existingMaterialIds.includes(val.exposedId))
        console.log("new materials ids",newMaterials);       
        updateNewMaterialsList(newMaterials);
        updateAddMode(true)
    }

    const cancelButtonOnClickHandler = ()=>{
        updateAddMode(false);
    }

    const addPhaseMaterialsOnClickHandler = async()=>{
        if(chosenMaterialsList.length>0){
            updateAddMode(false);
            updateNewMaterialsList([]);
            await dispatch(addPhaseMaterialsToPhase(phaseId));
            await dispatch(getPhaseMaterialsByPhaseId(phaseId));
        }
    }

    return (
    <div className="min-h-screen bg-blue-50 p-6 relative">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Phases</h1>

      {phases.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">No phases found. Create one now!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {phases.map(phase => (
            <div key={phase.id} className="bg-white p-4 shadow-md rounded-xl">
              <h3 className="font-semibold text-lg mb-1">{phase.phaseName}</h3>
              <p className="text-sm text-gray-500">{phase.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-blue-500 mb-2">Phase Materials:</h2>
        <div id="phase-materials-display" className="bg-white p-4 rounded shadow-md">
          {loaded ? (
            phaseMaterialsList.length > 0 ? (
              phaseMaterialsList.map(val => (
                <PhaseMaterial phaseMaterial={val} key={val.exposedId} />
              ))
            ) : (
              <div className="text-gray-500">No Phase Materials Added</div>
            )
          ) : (
            <div className="text-gray-400">Loading Materials...</div>
          )}
        </div>

        {!addMode && (
          <button
            onClick={addButtonOnClickHandler}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Materials
          </button>
        )}

        {addMode && (
          <div className="mt-6">
            <h2 className="text-lg font-medium text-blue-600 mb-2">Available Materials:</h2>
            <div className="bg-white p-4 rounded shadow-sm mb-3">
              {newMaterialsList.length > 0 ? (
                newMaterialsList.map(val => (
                  <Material material={val} key={val.exposedId} />
                ))
              ) : (
                <div className="text-gray-500">No Materials Left To Add</div>
              )}
            </div>
            <div className="space-x-4">
              <button
                onClick={addPhaseMaterialsOnClickHandler}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Selected Materials
              </button>
              <button
                onClick={cancelButtonOnClickHandler}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/phase-form")}
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