// src/features/vendor/assignedVendorSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedVendorId: null,
  preservedFormData: null, // to store form inputs when going to vendor list
};

const assignedVendorSlice = createSlice({
  name: "assignedVendor",
  initialState,
  reducers: {
    assignVendor(state, action) {
      state.selectedVendorId = action.payload;
    },
    preserveFormData(state, action) {
      state.preservedFormData = action.payload;
    },
    clearAssignment(state) {
      state.selectedVendorId = null;
      state.preservedFormData = null;
    },
  },
});

export const {
  assignVendor,
  preserveFormData,
  clearAssignment,
} = assignedVendorSlice.actions;

export default assignedVendorSlice.reducer;