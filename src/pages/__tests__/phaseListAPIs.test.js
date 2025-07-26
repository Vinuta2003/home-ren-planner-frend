import axios from 'axios';
import {
  createPhaseApi,
  updatePhaseApi,
  deletePhaseApi,
  getMaterialsByPhaseId,
  setVendorCostApi
} from '../../axios/phaseListAPIs';

jest.mock('axios');
const mockedAxios = axios;

describe('PhaseList APIs', () => {
  const BASE_URL = 'http://localhost:8080/phase';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPhaseApi', () => {
    const mockPhaseRequestDTO = {
      vendorId: 'vendor-123',
      roomId: 'room-456',
      phaseName: 'Civil Construction',
      description: 'Foundation and structural work',
      startDate: '2025-03-01',
      endDate: '2025-03-15',
      phaseType: 'CIVIL',
      phaseStatus: 'NOTSTARTED'
    };

    it('should create phase successfully', async () => {
      const mockResponse = {
        data: {
          id: 'phase-789',
          ...mockPhaseRequestDTO,
          createdAt: '2025-01-26T18:00:00Z'
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await createPhaseApi(mockPhaseRequestDTO);

      expect(mockedAxios.post).toHaveBeenCalledWith(BASE_URL, mockPhaseRequestDTO);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle creation errors and throw them', async () => {
      const errorMessage = 'Phase creation failed';
      const mockError = new Error(errorMessage);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(createPhaseApi(mockPhaseRequestDTO)).rejects.toThrow(errorMessage);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(BASE_URL, mockPhaseRequestDTO);
      expect(consoleSpy).toHaveBeenCalledWith('error:', mockError);
      
      consoleSpy.mockRestore();
    });

    it('should handle network errors', async () => {
      const networkError = {
        code: 'NETWORK_ERROR',
        message: 'Network Error'
      };
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      mockedAxios.post.mockRejectedValue(networkError);

      await expect(createPhaseApi(mockPhaseRequestDTO)).rejects.toEqual(networkError);
      expect(consoleSpy).toHaveBeenCalledWith('error:', networkError);
      
      consoleSpy.mockRestore();
    });

    it('should handle API validation errors', async () => {
      const validationError = {
        response: {
          status: 400,
          data: {
            message: 'Invalid phase data',
            errors: ['Phase name is required', 'Invalid date range']
          }
        }
      };
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      mockedAxios.post.mockRejectedValue(validationError);

      await expect(createPhaseApi(mockPhaseRequestDTO)).rejects.toEqual(validationError);
      expect(consoleSpy).toHaveBeenCalledWith('error:', validationError);
      
      consoleSpy.mockRestore();
    });
  });

  describe('updatePhaseApi', () => {
    const phaseId = 'phase-789';
    const mockUpdatedPhaseRequestDTO = {
      phaseName: 'Updated Civil Construction',
      description: 'Updated foundation and structural work',
      startDate: '2025-04-01',
      endDate: '2025-04-20',
      phaseStatus: 'INPROGRESS'
    };

    it('should update phase successfully', async () => {
      const mockResponse = {
        data: {
          id: phaseId,
          ...mockUpdatedPhaseRequestDTO,
          updatedAt: '2025-01-26T18:00:00Z'
        }
      };

      mockedAxios.put.mockResolvedValue(mockResponse);

      const result = await updatePhaseApi(phaseId, mockUpdatedPhaseRequestDTO);

      expect(mockedAxios.put).toHaveBeenCalledWith(`${BASE_URL}/${phaseId}`, mockUpdatedPhaseRequestDTO);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle update errors', async () => {
      const updateError = {
        response: {
          status: 404,
          data: { message: 'Phase not found' }
        }
      };

      mockedAxios.put.mockRejectedValue(updateError);

      await expect(updatePhaseApi(phaseId, mockUpdatedPhaseRequestDTO)).rejects.toEqual(updateError);
      expect(mockedAxios.put).toHaveBeenCalledWith(`${BASE_URL}/${phaseId}`, mockUpdatedPhaseRequestDTO);
    });

    it('should handle unauthorized update attempts', async () => {
      const unauthorizedError = {
        response: {
          status: 403,
          data: { message: 'Unauthorized to update this phase' }
        }
      };

      mockedAxios.put.mockRejectedValue(unauthorizedError);

      await expect(updatePhaseApi(phaseId, mockUpdatedPhaseRequestDTO)).rejects.toEqual(unauthorizedError);
    });
  });

  describe('deletePhaseApi', () => {
    const phaseId = 'phase-789';

    it('should delete phase successfully', async () => {
      const mockResponse = {
        data: {
          message: 'Phase deleted successfully',
          deletedId: phaseId
        }
      };

      mockedAxios.delete.mockResolvedValue(mockResponse);

      const result = await deletePhaseApi(phaseId);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`${BASE_URL}/${phaseId}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle delete errors for non-existent phase', async () => {
      const deleteError = {
        response: {
          status: 404,
          data: { message: 'Phase not found' }
        }
      };

      mockedAxios.delete.mockRejectedValue(deleteError);

      await expect(deletePhaseApi(phaseId)).rejects.toEqual(deleteError);
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${BASE_URL}/${phaseId}`);
    });

    it('should handle delete errors for phases with dependencies', async () => {
      const dependencyError = {
        response: {
          status: 409,
          data: { message: 'Cannot delete phase with existing materials' }
        }
      };

      mockedAxios.delete.mockRejectedValue(dependencyError);

      await expect(deletePhaseApi(phaseId)).rejects.toEqual(dependencyError);
    });
  });

  describe('getMaterialsByPhaseId', () => {
    const phaseId = 'phase-789';

    it('should get materials by phase ID successfully', async () => {
      const mockMaterials = [
        {
          id: 'material-1',
          name: 'Cement',
          quantity: 50,
          unit: 'bags',
          phaseId: phaseId
        },
        {
          id: 'material-2',
          name: 'Steel Rods',
          quantity: 100,
          unit: 'kg',
          phaseId: phaseId
        }
      ];

      const mockResponse = { data: mockMaterials };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getMaterialsByPhaseId(phaseId);

      expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/materials?id=${phaseId}`);
      expect(result).toEqual(mockMaterials);
    });

    it('should handle empty materials list', async () => {
      const mockResponse = { data: [] };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getMaterialsByPhaseId(phaseId);

      expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/materials?id=${phaseId}`);
      expect(result).toEqual([]);
    });

    it('should handle materials fetch errors', async () => {
      const fetchError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' }
        }
      };

      mockedAxios.get.mockRejectedValue(fetchError);

      await expect(getMaterialsByPhaseId(phaseId)).rejects.toEqual(fetchError);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/materials?id=${phaseId}`);
    });

    it('should handle invalid phase ID', async () => {
      const invalidPhaseError = {
        response: {
          status: 400,
          data: { message: 'Invalid phase ID format' }
        }
      };

      mockedAxios.get.mockRejectedValue(invalidPhaseError);

      await expect(getMaterialsByPhaseId('invalid-id')).rejects.toEqual(invalidPhaseError);
    });
  });

  describe('setVendorCostApi', () => {
    const vendorId = 'vendor-123';
    const phaseId = 'phase-789';
    const cost = 50000;

    it('should set vendor cost successfully', async () => {
      const mockResponse = {
        data: {
          vendorId,
          phaseId,
          cost,
          updatedAt: '2025-01-26T18:00:00Z'
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await setVendorCostApi(vendorId, phaseId, cost);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${BASE_URL}/vendor/${vendorId}/phase/${phaseId}/cost?cost=${cost}`
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle cost setting with decimal values', async () => {
      const decimalCost = 75000.50;
      const mockResponse = {
        data: {
          vendorId,
          phaseId,
          cost: decimalCost,
          updatedAt: '2025-01-26T18:00:00Z'
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await setVendorCostApi(vendorId, phaseId, decimalCost);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${BASE_URL}/vendor/${vendorId}/phase/${phaseId}/cost?cost=${decimalCost}`
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle vendor cost setting errors', async () => {
      const costError = {
        response: {
          status: 400,
          data: { message: 'Invalid cost value' }
        }
      };

      mockedAxios.post.mockRejectedValue(costError);

      await expect(setVendorCostApi(vendorId, phaseId, cost)).rejects.toEqual(costError);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${BASE_URL}/vendor/${vendorId}/phase/${phaseId}/cost?cost=${cost}`
      );
    });

    it('should handle unauthorized vendor cost updates', async () => {
      const unauthorizedError = {
        response: {
          status: 403,
          data: { message: 'Vendor not authorized for this phase' }
        }
      };

      mockedAxios.post.mockRejectedValue(unauthorizedError);

      await expect(setVendorCostApi(vendorId, phaseId, cost)).rejects.toEqual(unauthorizedError);
    });

    it('should handle negative cost values', async () => {
      const negativeCost = -1000;
      const validationError = {
        response: {
          status: 400,
          data: { message: 'Cost cannot be negative' }
        }
      };

      mockedAxios.post.mockRejectedValue(validationError);

      await expect(setVendorCostApi(vendorId, phaseId, negativeCost)).rejects.toEqual(validationError);
    });
  });

  describe('API Integration Edge Cases', () => {
    it('should handle network timeout errors', async () => {
      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded'
      };

      mockedAxios.post.mockRejectedValue(timeoutError);

      await expect(createPhaseApi({})).rejects.toEqual(timeoutError);
    });

    it('should handle server unavailable errors', async () => {
      const serverError = {
        response: {
          status: 503,
          data: { message: 'Service temporarily unavailable' }
        }
      };

      mockedAxios.get.mockRejectedValue(serverError);

      await expect(getMaterialsByPhaseId('phase-123')).rejects.toEqual(serverError);
    });

    it('should handle malformed response data', async () => {
      const malformedResponse = { data: null };

      mockedAxios.get.mockResolvedValue(malformedResponse);

      const result = await getMaterialsByPhaseId('phase-123');
      expect(result).toBeNull();
    });
  });
});
