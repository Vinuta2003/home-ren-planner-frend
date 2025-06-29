import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { getPhaseById } from "../app/features/phaseSlice";
import { PhaseMaterial } from "../components/phaseMaterial";

export function PhasePage(props){

    const {phaseId} = useParams();
    const dispatch = useDispatch();
    const phaseMaterialsList = useSelector((state)=>state.phase.phaseMaterialsList);
    const loaded = useSelector((state)=>state.phase.loaded);

    useEffect(()=>{
        dispatch(getPhaseById(phaseId));
    },[phaseId])

    return(
        <>
            <h1>Materials: </h1>
            <div id="phase-materials-display">
                {loaded
                ?phaseMaterialsList.length>0?phaseMaterialsList.map((val)=><PhaseMaterial phaseMaterial={val} key={val.exposedId}/>):<div><span>No Phase Materials Added</span></div>
                :<div><span>Loading Materials...</span></div>}
            </div>
        </>
        
        
    )
}