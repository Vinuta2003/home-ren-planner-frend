import {
  phaseReducer as reducer,
  addMaterial,
  updateMaterialQuantity,
  deleteMaterial,
  clearChosenMaterialsList,
  getPhaseById,
  addPhaseMaterialsToPhase,
} from "../phaseSlice";

import axios from "axios";
import { configureStore } from "@reduxjs/toolkit";


jest.mock("axios");

jest.mock("../../../axios/axiosInstance", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

import axiosInstance from "../../../axios/axiosInstance";

const phase = {
  id: "9d5d6a0f-3a4c-48e1-bb3a-4e56fa123456",
  phaseType: "CIVIL",
};

const material = {
  name: "Cement",
  exposedId: "d5cd7930-a960-4078-b08a-5eaff632e749",
  pricePerQuantity: 50,
  unit: "KG",
  phaseType: "CIVIL",
};

const initialState = {
  currentPhase: {
    phaseType: null,
    phaseName: null,
    description: null,
    startDate: null,
    endDate: null,
    phaseStatus: null,
    totalPhaseCost: null,
    phaseMaterialList: [],
    vendor: {},
    totalPhaseMaterialCost: null,
    vendorCost: null,
  },
  chosenMaterialsList: [],
  loaded: false,
};

const phaseResponse = {
  id: phase.id,
  phaseName: "Foundation Phase",
  description: "Initial phase involving site preparation and foundation work.",
  startDate: "2025-07-01",
  endDate: "2025-07-15",
  totalPhaseCost: 120000,
  phaseType: "CIVIL",
  phaseStatus: "IN_PROGRESS",
  vendorCost: 30000,
  totalPhaseMaterialCost: 90000,
  vendor: {
    id: "2f83e942-48b7-4533-aaa0-15e7b1ffcb11",
    name: "ABC Constructions",
    contact: "9876543210",
    email: "abc@constructions.com",
  },
  vendorId: "2f83e942-48b7-4533-aaa0-15e7b1ffcb11",
  phaseMaterialUserResponseList: [
    {
      exposedId: "a3f8e6a1-1e3b-4c1d-94e2-2d458f7a4b12",
      name: "Cement",
      unit: "KG",
      pricePerQuantity: 50,
      phaseType: "CONSTRUCTION",
      quantity: 1000,
      totalPrice: 50000,
      materialExposedId: "8f3c4e4a-b456-4e2f-8f67-3e589f8a9c33",
      phaseId: phase.id,
    },
    {
      exposedId: "b4a6e6c2-5f2b-4c3d-82a1-1f23fa7b9a99",
      name: "Steel",
      unit: "KG",
      pricePerQuantity: 70,
      phaseType: "CONSTRUCTION",
      quantity: 500,
      totalPrice: 35000,
      materialExposedId: "2f7a4d8b-dc12-43b4-9123-bf3d7c19a7ef",
      phaseId: phase.id,
    },
  ],
};

describe("phaseSlice reducers", () => {
  it("should handle addMaterial", () => {
    const action = {
      type: addMaterial.type,
      payload: {
        materialExposedId: material.exposedId,
        quantity: 2,
      },
    };
    const state = reducer(initialState, action);
    expect(state.chosenMaterialsList).toEqual([action.payload]);
  });

  it("should handle updateMaterialQuantity", () => {
    const stateWithMaterial = {
      ...initialState,
      chosenMaterialsList: [
        { materialExposedId: material.exposedId, quantity: 1 },
      ],
    };

    const action = {
      type: updateMaterialQuantity.type,
      payload: { materialExposedId: material.exposedId, quantity: 5 },
    };

    const state = reducer(stateWithMaterial, action);
    expect(state.chosenMaterialsList[0].quantity).toBe(5);
  });

  it("should handle deleteMaterial", () => {
    const stateWithMaterials = {
      ...initialState,
      chosenMaterialsList: [
        { materialExposedId: material.exposedId, quantity: 2 },
        { materialExposedId: "dummy-id", quantity: 3 },
      ],
    };

    const action = {
      type: deleteMaterial.type,
      payload: material.exposedId,
    };

    const state = reducer(stateWithMaterials, action);
    expect(state.chosenMaterialsList).toEqual([
      { materialExposedId: "dummy-id", quantity: 3 },
    ]);
  });

  it("should handle clearChosenMaterialsList", () => {
    const preloadedState = {
      ...initialState,
      chosenMaterialsList: [{ materialExposedId: material.exposedId, quantity: 1 }],
    };

    const action = { type: clearChosenMaterialsList.type };
    const state = reducer(preloadedState, action);
    expect(state.chosenMaterialsList).toEqual([]);
  });
});

describe("phaseSlice async thunks", () => {
  it("should handle fulfilled getPhaseById", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: phaseResponse });

    const store = configureStore({
      reducer: { phase: reducer },
      preloadedState: { phase: initialState },
    });

    const result = await store.dispatch(getPhaseById(phase.id));
    const state = store.getState().phase;

    expect(result.type).toBe("getPhaseById/fulfilled");
    expect(state.currentPhase.phaseName).toBe("Foundation Phase");
    expect(state.currentPhase.phaseMaterialList).toEqual(
      phaseResponse.phaseMaterialUserResponseList
    );
    expect(state.loaded).toBe(true);
  });

  it("should handle fulfilled addPhaseMaterialsToPhase", async () => {
    const mockResponse = { success: true };
    axiosInstance.post.mockResolvedValueOnce({ data: mockResponse });

    const store = configureStore({
      reducer: { phase: reducer },
      preloadedState: {
        phase: {
          ...initialState,
          chosenMaterialsList: [
            { materialExposedId: material.exposedId, quantity: 2 },
          ],
        },
      },
    });

    const result = await store.dispatch(addPhaseMaterialsToPhase(phase.id));
    const state = store.getState().phase;

    expect(result.type).toBe("addPhaseMaterialsToPhase/fulfilled");
    expect(state.chosenMaterialsList).toEqual([]);
  });
});
