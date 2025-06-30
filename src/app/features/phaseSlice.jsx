import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";
import { updatePhaseMaterialQuantity } from "../apis/phaseApis";

export const getPhaseById = createAsyncThunk('getPhaseById',async(phaseId)=>{
    const res = await axios.get(`http://localhost:8080/api/user/phase/${phaseId}/phase-materials`)
    const data = res.data;
    return data;
})

export const getPhaseMaterialsByPhaseId = createAsyncThunk('getPhaseMaterialsByPhaseId', async(phaseId)=>{
    const res = await axios.get(`http://localhost:8080/api/user/phase/${phaseId}/phase-materials`)
    const data = res.data;
    return data;
})

export const addPhaseMaterialsToPhase = createAsyncThunk('addPhaseMaterialsToPhase', async(phaseId,{getState})=>{
    const {chosenMaterialsList} = getState().phase;
    const res = await axios.post(`http://localhost:8080/api/user/phase/${phaseId}/phase-materials`,chosenMaterialsList);
    const data = res.data;
    return data;

})

const phaseSlice = createSlice({
    name:"phaseSlice",
    initialState:{
        phaseType : "ELECTRICAL",
        phaseMaterialsList : [],
        chosenMaterialsList : [],
        loaded : false
    },
    reducers:{
        addMaterial : function(state,action){
            state.chosenMaterialsList.push(action.payload);
        },
        updateMaterialQuantity : function(state,action){
            const material = state.chosenMaterialsList.find((val)=>val.materialExposedId==action.payload.materialExposedId)
            if(material){
                material.quantity = action.payload.quantity;
            }
        },
        deleteMaterial : function(state,action){
            state.chosenMaterialsList = state.chosenMaterialsList.filter((val)=>val.materialExposedId!=action.payload)
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getPhaseById.fulfilled,(state,action)=>{
            state.phaseMaterialsList = action.payload;
            state.loaded = true;
        }).addCase(getPhaseMaterialsByPhaseId.fulfilled,(state,action)=>{
            state.phaseMaterialsList = action.payload;
        }).addCase(addPhaseMaterialsToPhase.fulfilled,(state,action)=>{
            state.chosenMaterialsList = [];
        })

    }


});

export const {addMaterial,updateMaterialQuantity,deleteMaterial} = phaseSlice.actions;
export const phaseReducer = phaseSlice.reducer;