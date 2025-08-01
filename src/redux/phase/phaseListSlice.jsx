import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";

export const getPhaseById = createAsyncThunk("getPhaseById", async (id) => {
  const res = await axiosInstance.get(`/phase/${id}`);
  return res.data;
});

export const getPhasesByRoom = createAsyncThunk("getPhasesByRoom", async (roomId) => {
  const res = await axiosInstance.get(`/phase/room/${roomId}`);
   return Array.isArray(res.data) ? res.data : [];
});

export const createPhase = createAsyncThunk("createPhase", async (phaseRequestDTO) => {
  const res = await axiosInstance.post(`/phase`, phaseRequestDTO);
  return res.data;
});

export const updatePhase = createAsyncThunk("updatePhase", async ({ id, updatedPhaseRequestDTO }) => {
  const res = await axiosInstance.put(`/phase/${id}`, updatedPhaseRequestDTO);
  return res.data;
});


export const deletePhase = createAsyncThunk("deletePhase", async (id) => {
  const res = await axiosInstance.delete(`/phase/${id}`);
  return res.data;
});


export const getPhaseMaterialsByPhaseId = createAsyncThunk("getPhaseMaterialsByPhaseId", async (id) => {
  const res = await axiosInstance.get(`/phase/materials?id=${id}`);
  return res.data;
});


export const getPhasesByRenovationType = createAsyncThunk("getPhasesByRenovationType", async (type) => {
  const res = await axiosInstance.get(`/phase/phases/by-renovation-type/${type}`);
  return res.data;
});


export const getPhaseTotalCost = createAsyncThunk("getPhaseTotalCost", async (phaseId) => {
  const res = await axiosInstance.get(`/phase/${phaseId}/total-cost`);
  return res.data;
});

export const setVendorCost = createAsyncThunk("setVendorCost", async ({ vendorId, phaseId, cost }) => {
  const res = await axiosInstance.post(
    `/phase/vendor/${vendorId}/phase/${phaseId}/cost?cost=${cost}`
  );
  return res.data;
});

const phaseListSlice = createSlice({
  name: "phase",
  initialState: {
    phases: [],
    phaseDetails: null,
    phaseMaterials: [],
    roomPhases: [],
    totalCost: 0,
    phaseTypes: [],
    status: "idle",
    loading: false
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
      .addCase(getPhasesByRoom.pending, (state) => {
        state.loading = true;
        state.roomPhases = [];
      })
      .addCase(getPhasesByRoom.fulfilled, (state, action) => {
        state.roomPhases = action.payload;
        state.loading = false;
      })
      .addCase(getPhasesByRoom.rejected, (state) => {
        state.loading = false;
        state.roomPhases = [];
      })

      .addCase(createPhase.fulfilled, (state, action) => {
        state.roomPhases.push(action.payload);
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
