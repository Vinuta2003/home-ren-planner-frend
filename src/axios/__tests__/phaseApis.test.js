import axiosInstance from "../axiosInstance";
import {
  updatePhaseMaterialQuantity,
  deletePhaseMaterial,
  getMaterialsByPhaseType,
} from "../phaseApis";

jest.mock("../axiosInstance", () => ({
  patch: jest.fn(),
  delete: jest.fn(),
  get: jest.fn(),
}));

const phase = {
  phaseType: "CIVIL",
};

const samplePhaseMaterial = {
  exposedId: "7534045f-45c5-4dd6-81cb-2cf06e19b2f8",
  phaseId: "e5d09e73-7f2d-4ab6-aff7-6d6f29f03c49",
  materialId: "4233e8e6-d2fd-486f-aafe-ec5e633398db",
  name: "Cement",
  unit: "KG",
  quantity: 10,
  pricePerQuantity: 50,
  totalPrice: 500,
};

const materialUserResponse = {
  name: "Cement",
  exposedId: "d5cd7930-a960-4078-b08a-5eaff632e749",
  pricePerQuantity: 50,
  unit: "KG",
  phaseType: "CIVIL",
};

describe("phaseApis", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("updatePhaseMaterialQuantity", () => {
    test("should successfully patch and return data", async () => {
      const mockData = { success: true };
      axiosInstance.patch.mockResolvedValueOnce({ data: mockData });

      const result = await updatePhaseMaterialQuantity(samplePhaseMaterial.exposedId, 5);

      expect(axiosInstance.patch).toHaveBeenCalledWith(
        `/api/user/phase-materials/${samplePhaseMaterial.exposedId}?quantity=5`
      );
      expect(result).toEqual(mockData);
    });

    test("should catch error and return undefined", async () => {
      const error = new Error("Patch failed");
      console.error = jest.fn();

      axiosInstance.patch.mockRejectedValueOnce(error);

      const result = await updatePhaseMaterialQuantity(samplePhaseMaterial.exposedId, 5);

      expect(console.error).toHaveBeenCalledWith(
        "Failed to update phase material quantity:",
        error
      );
      expect(result).toBeUndefined();
    });
  });

  describe("deletePhaseMaterial", () => {
    test("should successfully delete and return data", async () => {
      const mockData = { deleted: true };
      axiosInstance.delete.mockResolvedValueOnce({ data: mockData });

      const result = await deletePhaseMaterial(samplePhaseMaterial.exposedId);

      expect(axiosInstance.delete).toHaveBeenCalledWith(
        `/api/user/phase-materials/${samplePhaseMaterial.exposedId}`
      );
      expect(result).toEqual(mockData);
    });

    test("should catch error and return undefined", async () => {
      const error = new Error("Delete failed");
      console.log = jest.fn();

      axiosInstance.delete.mockRejectedValueOnce(error);

      const result = await deletePhaseMaterial(samplePhaseMaterial.exposedId);

      expect(console.log).toHaveBeenCalledWith(
        "failed to delete phase material",
        error
      );
      expect(result).toBeUndefined();
    });
  });

  describe("getMaterialsByPhaseType", () => {
    test("should successfully get and return data", async () => {
      const mockData = [materialUserResponse];
      axiosInstance.get.mockResolvedValueOnce({ data: mockData });

      const result = await getMaterialsByPhaseType(phase.phaseType);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `/api/user/materials?phaseType=${phase.phaseType}`
      );
      expect(result).toEqual(mockData);
    });

    test("should catch error and return undefined", async () => {
      const error = new Error("Get failed");
      console.log = jest.fn();

      axiosInstance.get.mockRejectedValueOnce(error);

      const result = await getMaterialsByPhaseType(phase.phaseType);

      expect(console.log).toHaveBeenCalledWith(
        "failed to fetch materials",
        error
      );
      expect(result).toBeUndefined();
    });
  });
});
