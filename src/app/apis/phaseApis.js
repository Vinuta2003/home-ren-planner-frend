import axios from "axios";

export const updatePhaseMaterialQuantity = async(phaseMaterialId,newQuantity)=>{
    try{
        const res = await axios.patch(`http://localhost:8080/api/user/phase-materials/${phaseMaterialId}?quantity=${newQuantity}`)
        const data = res.data;
        return data;
    }
    catch(e){
        console.error("Failed to update phase material quantity:", e);
    }
    
}

export const deletePhaseMaterial = async(phaseMaterialId)=>{
    try{
        const res = await axios.delete(`http://localhost:8080/api/user/phase-materials/${phaseMaterialId}`)
        const data = res.data;
        return data;
    }
    catch(e){
        console.log("failed to delete phase material", e)
    }
    
}

export const getMaterialsByPhaseType = async(phaseType)=>{
    try{
        const res = await axios.get(`http://localhost:8080/api/user/materials?phaseType=${phaseType}`)
        const data = res.data;
        return data;
    }
    catch(e){
        console.log("failed to fetch materials", e)
    }
    
}