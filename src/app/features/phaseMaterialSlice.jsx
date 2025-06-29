// import { createSlice } from "@reduxjs/toolkit";

// const phaseMaterialSlice = createSlice({
//     name : "phaseMaterialSlice",
//     initialState : {
//         phaseMaterialsList : []
//     },
//     reducers : {
//         addPhaseMaterials : function(state,action){
//             state.phaseMaterialsList.push(...action.payload);
//         },
//         updatePhaseMaterialQuantity : function(state,action){
//             const phaseMaterial = state.phaseMaterialsList.find((val)=>val.exposedId==action.payload.exposedId);
//             if(phaseMaterial){
//                 phaseMaterial.quantity = action.payload.quantity;
//                 phaseMaterial.totalPrice = phaseMaterial.pricePerQuantity * phaseMaterial.quantity;
//             }
//         },
//         deletePhaseMaterial : function(state,action){
//             state.phaseMaterialsList = state.phaseMaterialsList.filter((val)=>val.exposedId!=action.payload);
//         }
//     }
// })

// export const {addPhaseMaterials,updatePhaseMaterialQuantity,deletePhaseMaterial} = phaseMaterialSlice.actions;
// export const phaseMaterialReducer = phaseMaterialSlice.reducer;