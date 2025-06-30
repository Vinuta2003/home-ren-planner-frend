import { configureStore } from "@reduxjs/toolkit";
import { phaseReducer } from "./features/phaseSlice";
import { phaseListReducer } from "./features/phaseListSlice";

export const store = configureStore({
    reducer : {
        phase : phaseReducer,
        phaselist:phaseListReducer
    }
})