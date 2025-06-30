// import { createSlice } from "@reduxjs/toolkit";
// import { act } from "react";

// const phaseMaterialSlice = createSlice({
//     name : "phaseMaterialSlice",
//     initialState : {
//         chosenMaterialsList : []
//     },
//     reducers:{
//         addMaterial : function(state,action){
//             state.chosenMaterialsList.push(action.payload);
//         },
//         updateMaterialQuantity : function(state,action){
//             const material = state.chosenMaterialsList.find((val)=>val.exposedId==action.payload.exposedId)
//             if(material){
//                 material.quantity = action.payload.quantity;
//             }
//         },
//         deleteMaterial : function(state,action){
//             state.chosenMaterialsList = state.chosenMaterialsList.filter((val)=>val.exposedId!=action.payload)
//         },
//         initializeChosenMaterialsList : function(state,action){
//             state.chosenMaterialsList = [];
//         }
//     }
// })

// export const {addMaterial,updateMaterialQuantity,deleteMaterial} = phaseMaterialSlice.actions;
// export const phaseMaterialReducer = phaseMaterialSlice.reducer;