import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// GET: Get phase by ID
export const getPhaseById = createAsyncThunk("getPhaseById", async (id) => {
  const res = await axios.get(`http://localhost:8080/phase/${id}`);
  return res.data;
});

// GET: Get all phases for a project
export const getPhasesByProject = createAsyncThunk("getPhasesByProject", async (projectId) => {
  const res = await axios.get(`http://localhost:8080/phase/project/${projectId}`);
  return res.data;
});

// POST: Create a new phase
export const createPhase = createAsyncThunk("createPhase", async (phaseRequestDTO) => {
  const res = await axios.post(`http://localhost:8080/phase`, phaseRequestDTO);
  return res.data;
});

// PUT: Update an existing phase
export const updatePhase = createAsyncThunk("updatePhase", async ({ id, updatedPhaseRequestDTO }) => {
  const res = await axios.put(`http://localhost:8080/phase/${id}`, updatedPhaseRequestDTO);
  return res.data;
});

// DELETE: Delete a phase
export const deletePhase = createAsyncThunk("deletePhase", async (id) => {
  const res = await axios.delete(`http://localhost:8080/phase/${id}`);
  return res.data;
});

// GET: Get phase materials by phase ID
export const getPhaseMaterialsByPhaseId = createAsyncThunk("getPhaseMaterialsByPhaseId", async (id) => {
  const res = await axios.get(`http://localhost:8080/phase/materials?id=${id}`);
  return res.data;
});

// GET: Get phases by renovation type
export const getPhasesByRenovationType = createAsyncThunk("getPhasesByRenovationType", async (type) => {
  const res = await axios.get(`http://localhost:8080/phase/phases/by-renovation-type/${type}`);
  return res.data;
});

// GET: Get total cost for a phase
export const getPhaseTotalCost = createAsyncThunk("getPhaseTotalCost", async (id) => {
  const res = await axios.get(`http://localhost:8080/phase/${id}/total-cost`);
  return res.data;
});

// POST: Set vendor cost for a phase
export const setVendorCost = createAsyncThunk("setVendorCost", async ({ vendorId, phaseId, cost }) => {
  const res = await axios.post(
    `http://localhost:8080/phase/vendor/${vendorId}/phase/${phaseId}/cost?cost=${cost}`
  );
  return res.data;
});

const phaseListSlice = createSlice({
  name: "phase",
  initialState: {
    phases: [],
    phaseDetails: null,
    phaseMaterials: [],
    projectPhases: [], 
    totalCost: 0,
    phaseTypes: [],
    status: "idle",
    loading:false
  },
  reducers: {
    clearPhaseDetails: (state) => {
      state.phaseDetails = null;
      state.phaseMaterials = [];
      state.totalCost = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPhaseById.fulfilled, (state, action) => {
        state.phaseDetails = action.payload;
      })
      .addCase(getPhasesByProject.pending, (state) => {
  state.loading = true;
})
.addCase(getPhasesByProject.fulfilled, (state, action) => {
  state.projectPhases = action.payload;
  state.loading = false;
})
.addCase(getPhasesByProject.rejected, (state) => {
  state.loading = false;
})

   .addCase(createPhase.fulfilled, (state, action) => {
  state.projectPhases.push(action.payload);
})



      .addCase(getPhaseMaterialsByPhaseId.fulfilled, (state, action) => {
        state.phaseMaterials = action.payload;
      })
      .addCase(getPhaseTotalCost.fulfilled, (state, action) => {
        state.totalCost = action.payload;
      })
      .addCase(getPhasesByRenovationType.fulfilled, (state, action) => {
        state.phaseTypes = action.payload;
      });
  },
});

export const { clearPhaseDetails } = phaseListSlice.actions;
export const phaseListReducer = phaseListSlice.reducer;
