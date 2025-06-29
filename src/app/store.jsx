import { configureStore } from "@reduxjs/toolkit";
import { phaseReducer } from "./features/phaseSlice";

export const store = configureStore({
    reducer : {
        //phaseMaterial : phaseMaterialReducer,
        phase : phaseReducer
    }
})