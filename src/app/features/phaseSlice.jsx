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

const phaseSlice = createSlice({
    name:"phaseSlice",
    initialState:{
        phaseMaterialsList : [],
        loaded : false
    },
    reducers:{
        addPhaseMaterials : function(state,action){
            state.phaseMaterialsList.push(...action.payload);
        },
        deletePhaseMaterial : function(state,action){
            state.phaseMaterialsList = state.phaseMaterialsList.filter((val)=>val.exposedId!=action.payload);
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getPhaseById.fulfilled,(state,action)=>{
            state.phaseMaterialsList = action.payload;
            state.loaded = true;
        }).addCase(getPhaseMaterialsByPhaseId.fulfilled,(state,action)=>{
            state.phaseMaterialsList = action.payload;
        })

    }


});

export const {addPhaseMaterials,deletePhaseMaterial} = phaseSlice.actions;
export const phaseReducer = phaseSlice.reducer;