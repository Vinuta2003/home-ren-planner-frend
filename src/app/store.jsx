import { configureStore } from "@reduxjs/toolkit";
import { phaseReducer } from "./features/phaseSlice";

export const store = configureStore({
    reducer : {
        phase : phaseReducer,
    }
})