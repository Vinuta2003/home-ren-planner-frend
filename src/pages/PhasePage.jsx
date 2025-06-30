import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { addPhaseMaterialsToPhase, clearChosenMaterialsList, getPhaseById } from "../app/features/phaseSlice";
import { PhaseMaterial } from "../components/phaseMaterial";
import { getMaterialsByPhaseType } from "../app/apis/phaseApis";
import { Material } from "../components/Material";

export function PhasePage(props){

    const {phaseId} = useParams();
    const dispatch = useDispatch();
    const phaseMaterialsList = useSelector((state)=>state.phase.phaseMaterialsList);
    const loaded = useSelector((state)=>state.phase.loaded);
    const phaseType = useSelector((state)=>state.phase.phaseType);
    const chosenMaterialsList = useSelector((state)=>state.phase.chosenMaterialsList);
    const [addMode,updateAddMode] = useState(false)
    const [newMaterialsList, updateNewMaterialsList] = useState([]);
    

    useEffect(()=>{
        dispatch(clearChosenMaterialsList());
        dispatch(getPhaseById(phaseId));
    },[phaseId])

    useEffect(()=>{
        const handleMaterials = async()=>{
            if(!addMode){
                return;
            }
            const currentMaterialIds = phaseMaterialsList.map((val)=>val.materialUserResponse.exposedId);
            const materials = await getMaterialsByPhaseType(phaseType);
            console.log("material list",materials);
            console.log("phase materials ids",currentMaterialIds);
            const newMaterials = materials.filter((val)=> !currentMaterialIds.includes(val.exposedId))
            console.log("new materials ids",newMaterials);       
            updateNewMaterialsList(newMaterials);
        }
        handleMaterials();
    },[addMode,phaseMaterialsList.length,phaseId])

    const addButtonOnClickHandler = async()=>{
        updateAddMode(true)
    }

    const cancelButtonOnClickHandler = ()=>{
        updateAddMode(false);
        dispatch(clearChosenMaterialsList());
    }

    const addPhaseMaterialsOnClickHandler = async()=>{
        if(chosenMaterialsList.length>0){
            updateAddMode(false);
            updateNewMaterialsList([]);
            await dispatch(addPhaseMaterialsToPhase(phaseId));
            await dispatch(getPhaseById(phaseId));
        }
    }

    return(
        <>
            <h1>Phase Materials: </h1>
            <div id="phase-materials-display">
                {loaded
                ?phaseMaterialsList.length>0?phaseMaterialsList.map((val)=><PhaseMaterial phaseMaterial={val} key={val.exposedId}/>):<div><span>No Phase Materials Added</span></div>
                :<div><span>Loading Materials...</span></div>}
            </div>
            {
                !addMode &&
                <div>
                    <button onClick={()=>{addButtonOnClickHandler();}}>Add materials</button>
                </div>
            }
            {
                addMode &&
                <>
                <h1>Materials: </h1>
                <div>
                    {newMaterialsList.length>0?newMaterialsList.map((val)=><Material material={val} key={val.exposedId}/>):<div><span>No Materials Left To Add</span></div>}
                </div>
                <div>
                    <button onClick={()=>{addPhaseMaterialsOnClickHandler();}}>Add chosen materials to phase</button>
                    <button onClick={()=>{cancelButtonOnClickHandler();}}>Cancel</button>
                </div>
                </>

            }
        </>
        
        
    )
}

export default PhasePage;