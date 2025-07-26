import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../axios/axiosInstance";

export const getPhaseById = createAsyncThunk('getPhaseById', async (phaseId) => {
    const res = await axios.get(`http://localhost:8080/phase/${phaseId}`)
    const data = res.data;
    return data;
})
export const addPhaseMaterialsToPhase = createAsyncThunk('addPhaseMaterialsToPhase', async(phaseId,{getState})=>{
    const {chosenMaterialsList} = getState().phase;
    const res = await axiosInstance.post(`/api/user/phase/${phaseId}/phase-materials`,chosenMaterialsList);
    const data = res.data;
    return data;
})

const phaseSlice = createSlice({
    name:"phaseSlice",
    initialState:{
        currentPhase: {
            phaseType:null,
            phaseName:null,
            description:null,
            startDate:null,
            endDate:null,
            phaseStatus:null,
            totalPhaseCost:null,
            phaseMaterialList:[],
            vendor:{},
            totalPhaseMaterialCost:null,
            vendorCost:null
        },
        chosenMaterialsList: [],
        loaded: false
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
        },
        clearChosenMaterialsList : function(state,action){
            state.chosenMaterialsList = [];
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getPhaseById.fulfilled,(state,action)=>{
            // state.currentPhase = action.payload;
            state.currentPhase.phaseName = action.payload.phaseName;
            state.currentPhase.phaseType = action.payload.phaseType;
            state.currentPhase.description=action.payload.description;
            state.currentPhase.startDate=action.payload.startDate;
            state.currentPhase.endDate=action.payload.endDate;
            state.currentPhase.phaseStatus=action.payload.phaseStatus;
            state.currentPhase.phaseMaterialList=action.payload.phaseMaterialUserResponseList;
            state.currentPhase.totalPhaseCost=action.payload.totalPhaseCost;
            state.currentPhase.vendor=action.payload.vendor;
            state.currentPhase.vendorCost=action.payload.vendorCost;
            state.currentPhase.totalPhaseMaterialCost=action.payload.totalPhaseMaterialCost;
console.log("in slice",state.currentPhase.phaseMaterialList);
        //     state.phaseMaterialsList = Array.isArray(action.payload.phaseMaterials) 
        // ? action.payload.phaseMaterials 
        // : [];
            state.loaded = true;
        }).addCase(addPhaseMaterialsToPhase.fulfilled,(state,action)=>{
            state.chosenMaterialsList = [];
        })

    }


});

export const {addMaterial,updateMaterialQuantity,deleteMaterial,clearChosenMaterialsList} = phaseSlice.actions;
export const phaseReducer = phaseSlice.reducer;