import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  phaseListReducer,
  getPhaseById,
  getPhasesByRoom,
  createPhase,
  updatePhase,
  deletePhase,
  getPhaseMaterialsByPhaseId,
  getPhasesByRenovationType,
  getPhaseTotalCost,
  setVendorCost,
  clearPhaseDetails
} from '../../redux/phase/phaseListSlice.jsx';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Helper function to create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      phase: phaseListReducer
    },
    preloadedState: {
      phase: {
        phases: [],
        phaseDetails: null,
        phaseMaterials: [],
        roomPhases: [],
        totalCost: 0,
        phaseTypes: [],
        status: "idle",
        loading: false,
        ...initialState
      }
    }
  });
};

describe('phaseListSlice', () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();
    store = createTestStore();
  });

  describe('Initial State', () => {
    test('should have correct initial state', () => {
      const state = store.getState().phase;
      expect(state).toEqual({
        phases: [],
        phaseDetails: null,
        phaseMaterials: [],
        roomPhases: [],
        totalCost: 0,
        phaseTypes: [],
        status: "idle",
        loading: false
      });
    });
  });

  describe('Synchronous Actions', () => {
    describe('clearPhaseDetails', () => {
      test('should clear phase details, materials, and total cost', () => {
        // Set up initial state with data
        store = createTestStore({
          phaseDetails: { id: '1', name: 'Test Phase' },
          phaseMaterials: [{ id: '1', name: 'Material 1' }],
          totalCost: 5000
        });

        store.dispatch(clearPhaseDetails());

        const state = store.getState().phase;
        expect(state.phaseDetails).toBeNull();
        expect(state.phaseMaterials).toEqual([]);
        expect(state.totalCost).toBe(0);
      });

      test('should not affect other state properties', () => {
        store = createTestStore({
          phases: [{ id: '1' }],
          roomPhases: [{ id: '2' }],
          phaseTypes: ['CIVIL'],
          status: 'fulfilled',
          loading: true,
          phaseDetails: { id: '1', name: 'Test Phase' },
          phaseMaterials: [{ id: '1' }],
          totalCost: 5000
        });

        store.dispatch(clearPhaseDetails());

        const state = store.getState().phase;
        expect(state.phases).toEqual([{ id: '1' }]);
        expect(state.roomPhases).toEqual([{ id: '2' }]);
        expect(state.phaseTypes).toEqual(['CIVIL']);
        expect(state.status).toBe('fulfilled');
        expect(state.loading).toBe(true);
      });
    });
  });

  describe('Async Thunks', () => {
    describe('getPhaseById', () => {
      test('should fetch phase by id successfully', async () => {
        const mockPhase = { id: 'phase-123', name: 'Foundation Work', status: 'INPROGRESS' };
        mockedAxios.get.mockResolvedValue({ data: mockPhase });

        const result = await store.dispatch(getPhaseById('phase-123'));

        expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/phase/phase-123');
        expect(result.type).toBe('getPhaseById/fulfilled');
        expect(result.payload).toEqual(mockPhase);

        const state = store.getState().phase;
        expect(state.phaseDetails).toEqual(mockPhase);
      });

      test('should handle getPhaseById rejection', async () => {
        const errorMessage = 'Phase not found';
        mockedAxios.get.mockRejectedValue(new Error(errorMessage));

        const result = await store.dispatch(getPhaseById('invalid-id'));

        expect(result.type).toBe('getPhaseById/rejected');
        expect(result.error.message).toBe(errorMessage);

        const state = store.getState().phase;
        expect(state.phaseDetails).toBeNull(); // Should remain unchanged
      });
    });

    describe('getPhasesByRoom', () => {
      test('should fetch phases by room successfully', async () => {
        const mockPhases = [
          { id: 'phase-1', name: 'Foundation', roomId: 'room-123' },
          { id: 'phase-2', name: 'Framing', roomId: 'room-123' }
        ];
        mockedAxios.get.mockResolvedValue({ data: mockPhases });

        const result = await store.dispatch(getPhasesByRoom('room-123'));

        expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/phase/room/room-123');
        expect(result.type).toBe('getPhasesByRoom/fulfilled');
        expect(result.payload).toEqual(mockPhases);

        const state = store.getState().phase;
        expect(state.roomPhases).toEqual(mockPhases);
        expect(state.loading).toBe(false);
      });

      test('should handle non-array response by returning empty array', async () => {
        mockedAxios.get.mockResolvedValue({ data: null });

        const result = await store.dispatch(getPhasesByRoom('room-123'));

        expect(result.type).toBe('getPhasesByRoom/fulfilled');
        expect(result.payload).toEqual([]);

        const state = store.getState().phase;
        expect(state.roomPhases).toEqual([]);
      });

      test('should set loading state during pending', async () => {
        mockedAxios.get.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

        const promise = store.dispatch(getPhasesByRoom('room-123'));

        // Check loading state is set
        let state = store.getState().phase;
        expect(state.loading).toBe(true);
        expect(state.roomPhases).toEqual([]);

        await promise;
      });

      test('should handle getPhasesByRoom rejection', async () => {
        const errorMessage = 'Room not found';
        mockedAxios.get.mockRejectedValue(new Error(errorMessage));

        const result = await store.dispatch(getPhasesByRoom('invalid-room'));

        expect(result.type).toBe('getPhasesByRoom/rejected');
        expect(result.error.message).toBe(errorMessage);

        const state = store.getState().phase;
        expect(state.loading).toBe(false);
        expect(state.roomPhases).toEqual([]);
      });
    });

    describe('createPhase', () => {
      test('should create phase successfully', async () => {
        const newPhase = { id: 'phase-new', name: 'New Phase', roomId: 'room-123' };
        const phaseRequestDTO = { name: 'New Phase', roomId: 'room-123', phaseType: 'CIVIL' };
        mockedAxios.post.mockResolvedValue({ data: newPhase });

        // Set up initial roomPhases
        store = createTestStore({
          roomPhases: [{ id: 'phase-1', name: 'Existing Phase' }]
        });

        const result = await store.dispatch(createPhase(phaseRequestDTO));

        expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8080/phase', phaseRequestDTO);
        expect(result.type).toBe('createPhase/fulfilled');
        expect(result.payload).toEqual(newPhase);

        const state = store.getState().phase;
        expect(state.roomPhases).toHaveLength(2);
        expect(state.roomPhases[1]).toEqual(newPhase);
      });

      test('should handle createPhase rejection', async () => {
        const errorMessage = 'Validation failed';
        const phaseRequestDTO = { name: '', roomId: 'room-123' };
        mockedAxios.post.mockRejectedValue(new Error(errorMessage));

        const result = await store.dispatch(createPhase(phaseRequestDTO));

        expect(result.type).toBe('createPhase/rejected');
        expect(result.error.message).toBe(errorMessage);

        const state = store.getState().phase;
        expect(state.roomPhases).toEqual([]); // Should remain unchanged
      });
    });

    describe('updatePhase', () => {
      test('should update phase successfully', async () => {
        const updatedPhase = { id: 'phase-123', name: 'Updated Phase', status: 'COMPLETED' };
        const updateData = { id: 'phase-123', updatedPhaseRequestDTO: { name: 'Updated Phase', status: 'COMPLETED' } };
        mockedAxios.put.mockResolvedValue({ data: updatedPhase });

        const result = await store.dispatch(updatePhase(updateData));

        expect(mockedAxios.put).toHaveBeenCalledWith(
          'http://localhost:8080/phase/phase-123',
          updateData.updatedPhaseRequestDTO
        );
        expect(result.type).toBe('updatePhase/fulfilled');
        expect(result.payload).toEqual(updatedPhase);
      });

      test('should handle updatePhase rejection', async () => {
        const errorMessage = 'Phase not found';
        const updateData = { id: 'invalid-id', updatedPhaseRequestDTO: { name: 'Updated' } };
        mockedAxios.put.mockRejectedValue(new Error(errorMessage));

        const result = await store.dispatch(updatePhase(updateData));

        expect(result.type).toBe('updatePhase/rejected');
        expect(result.error.message).toBe(errorMessage);
      });
    });

    describe('deletePhase', () => {
      test('should delete phase successfully', async () => {
        const deleteResponse = { message: 'Phase deleted successfully' };
        mockedAxios.delete.mockResolvedValue({ data: deleteResponse });

        const result = await store.dispatch(deletePhase('phase-123'));

        expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:8080/phase/phase-123');
        expect(result.type).toBe('deletePhase/fulfilled');
        expect(result.payload).toEqual(deleteResponse);
      });

      test('should handle deletePhase rejection', async () => {
        const errorMessage = 'Cannot delete phase with dependencies';
        mockedAxios.delete.mockRejectedValue(new Error(errorMessage));

        const result = await store.dispatch(deletePhase('phase-123'));

        expect(result.type).toBe('deletePhase/rejected');
        expect(result.error.message).toBe(errorMessage);
      });
    });

    describe('getPhaseMaterialsByPhaseId', () => {
      test('should fetch phase materials successfully', async () => {
        const mockMaterials = [
          { id: 'material-1', name: 'Cement', quantity: 100 },
          { id: 'material-2', name: 'Steel', quantity: 50 }
        ];
        mockedAxios.get.mockResolvedValue({ data: mockMaterials });

        const result = await store.dispatch(getPhaseMaterialsByPhaseId('phase-123'));

        expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/phase/materials?id=phase-123');
        expect(result.type).toBe('getPhaseMaterialsByPhaseId/fulfilled');
        expect(result.payload).toEqual(mockMaterials);
      });

      test('should handle getPhaseMaterialsByPhaseId rejection', async () => {
        const errorMessage = 'Materials not found';
        mockedAxios.get.mockRejectedValue(new Error(errorMessage));

        const result = await store.dispatch(getPhaseMaterialsByPhaseId('invalid-id'));

        expect(result.type).toBe('getPhaseMaterialsByPhaseId/rejected');
        expect(result.error.message).toBe(errorMessage);
      });
    });

    describe('getPhasesByRenovationType', () => {
      test('should fetch phases by renovation type successfully', async () => {
        const mockPhaseTypes = ['CIVIL', 'ELECTRICAL', 'PLUMBING'];
        mockedAxios.get.mockResolvedValue({ data: mockPhaseTypes });

        const result = await store.dispatch(getPhasesByRenovationType('KITCHEN_RENOVATION'));

        expect(mockedAxios.get).toHaveBeenCalledWith(
          'http://localhost:8080/phase/phases/by-renovation-type/KITCHEN_RENOVATION'
        );
        expect(result.type).toBe('getPhasesByRenovationType/fulfilled');
        expect(result.payload).toEqual(mockPhaseTypes);

        const state = store.getState().phase;
        expect(state.phaseTypes).toEqual(mockPhaseTypes);
      });

      test('should handle getPhasesByRenovationType rejection', async () => {
        const errorMessage = 'Invalid renovation type';
        mockedAxios.get.mockRejectedValue(new Error(errorMessage));

        const result = await store.dispatch(getPhasesByRenovationType('INVALID_TYPE'));

        expect(result.type).toBe('getPhasesByRenovationType/rejected');
        expect(result.error.message).toBe(errorMessage);

        const state = store.getState().phase;
        expect(state.phaseTypes).toEqual([]); // Should remain unchanged
      });
    });

    describe('getPhaseTotalCost', () => {
      test('should fetch phase total cost successfully', async () => {
        const mockCost = 75000;
        mockedAxios.get.mockResolvedValue({ data: mockCost });

        const result = await store.dispatch(getPhaseTotalCost('phase-123'));

        expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/phase/phase-123/total-cost');
        expect(result.type).toBe('getPhaseTotalCost/fulfilled');
        expect(result.payload).toBe(mockCost);

        const state = store.getState().phase;
        expect(state.totalCost).toBe(mockCost);
      });

      test('should handle getPhaseTotalCost rejection', async () => {
        const errorMessage = 'Cost calculation failed';
        mockedAxios.get.mockRejectedValue(new Error(errorMessage));

        const result = await store.dispatch(getPhaseTotalCost('phase-123'));

        expect(result.type).toBe('getPhaseTotalCost/rejected');
        expect(result.error.message).toBe(errorMessage);

        const state = store.getState().phase;
        expect(state.totalCost).toBe(0); // Should remain unchanged
      });
    });

    describe('setVendorCost', () => {
      test('should set vendor cost successfully', async () => {
        const mockResponse = { message: 'Vendor cost updated successfully' };
        const costData = { vendorId: 'vendor-123', phaseId: 'phase-123', cost: 25000 };
        mockedAxios.post.mockResolvedValue({ data: mockResponse });

        const result = await store.dispatch(setVendorCost(costData));

        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:8080/phase/vendor/vendor-123/phase/phase-123/cost?cost=25000'
        );
        expect(result.type).toBe('setVendorCost/fulfilled');
        expect(result.payload).toEqual(mockResponse);
      });

      test('should handle setVendorCost rejection', async () => {
        const errorMessage = 'Vendor not found';
        const costData = { vendorId: 'invalid-vendor', phaseId: 'phase-123', cost: 25000 };
        mockedAxios.post.mockRejectedValue(new Error(errorMessage));

        const result = await store.dispatch(setVendorCost(costData));

        expect(result.type).toBe('setVendorCost/rejected');
        expect(result.error.message).toBe(errorMessage);
      });

      test('should handle zero cost value', async () => {
        const mockResponse = { message: 'Vendor cost set to zero' };
        const costData = { vendorId: 'vendor-123', phaseId: 'phase-123', cost: 0 };
        mockedAxios.post.mockResolvedValue({ data: mockResponse });

        const result = await store.dispatch(setVendorCost(costData));

        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:8080/phase/vendor/vendor-123/phase/phase-123/cost?cost=0'
        );
        expect(result.payload).toEqual(mockResponse);
      });

      test('should handle decimal cost values', async () => {
        const mockResponse = { message: 'Vendor cost updated' };
        const costData = { vendorId: 'vendor-123', phaseId: 'phase-123', cost: 1234.56 };
        mockedAxios.post.mockResolvedValue({ data: mockResponse });

        const result = await store.dispatch(setVendorCost(costData));

        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:8080/phase/vendor/vendor-123/phase/phase-123/cost?cost=1234.56'
        );
        expect(result.payload).toEqual(mockResponse);
      });
    });
  });

  describe('State Management Integration', () => {
    test('should handle multiple actions in sequence', async () => {
      const mockPhases = [{ id: 'phase-1', name: 'Foundation' }];
      const mockPhaseDetails = { id: 'phase-1', name: 'Foundation', description: 'Foundation work' };
      const mockCost = 50000;

      mockedAxios.get
        .mockResolvedValueOnce({ data: mockPhases })
        .mockResolvedValueOnce({ data: mockPhaseDetails })
        .mockResolvedValueOnce({ data: mockCost });

      // Execute multiple actions
      await store.dispatch(getPhasesByRoom('room-123'));
      await store.dispatch(getPhaseById('phase-1'));
      await store.dispatch(getPhaseTotalCost('phase-1'));

      const state = store.getState().phase;
      expect(state.roomPhases).toEqual(mockPhases);
      expect(state.phaseDetails).toEqual(mockPhaseDetails);
      expect(state.totalCost).toBe(mockCost);
      expect(state.loading).toBe(false);
    });

    test('should handle clearPhaseDetails after loading data', async () => {
      const mockPhaseDetails = { id: 'phase-1', name: 'Foundation' };
      const mockMaterials = [{ id: 'material-1', name: 'Cement' }];
      const mockCost = 30000;

      mockedAxios.get
        .mockResolvedValueOnce({ data: mockPhaseDetails })
        .mockResolvedValueOnce({ data: mockMaterials })
        .mockResolvedValueOnce({ data: mockCost });

      // Load data
      await store.dispatch(getPhaseById('phase-1'));
      await store.dispatch(getPhaseMaterialsByPhaseId('phase-1'));
      await store.dispatch(getPhaseTotalCost('phase-1'));

      let state = store.getState().phase;
      expect(state.phaseDetails).toEqual(mockPhaseDetails);
      expect(state.totalCost).toBe(mockCost);

      // Clear data
      store.dispatch(clearPhaseDetails());

      state = store.getState().phase;
      expect(state.phaseDetails).toBeNull();
      expect(state.phaseMaterials).toEqual([]);
      expect(state.totalCost).toBe(0);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle network timeout errors', async () => {
      const timeoutError = new Error('Network timeout');
      timeoutError.code = 'ECONNABORTED';
      mockedAxios.get.mockRejectedValue(timeoutError);

      const result = await store.dispatch(getPhaseById('phase-123'));

      expect(result.type).toBe('getPhaseById/rejected');
      expect(result.error.message).toBe('Network timeout');
    });

    test('should handle server unavailable errors', async () => {
      const serverError = new Error('Server unavailable');
      serverError.response = { status: 503 };
      mockedAxios.get.mockRejectedValue(serverError);

      const result = await store.dispatch(getPhasesByRoom('room-123'));

      expect(result.type).toBe('getPhasesByRoom/rejected');
      expect(result.error.message).toBe('Server unavailable');

      const state = store.getState().phase;
      expect(state.loading).toBe(false);
      expect(state.roomPhases).toEqual([]);
    });

    test('should handle malformed API responses', async () => {
      mockedAxios.get.mockResolvedValue({ data: undefined });

      const result = await store.dispatch(getPhaseById('phase-123'));

      expect(result.type).toBe('getPhaseById/fulfilled');
      expect(result.payload).toBeUndefined();

      const state = store.getState().phase;
      expect(state.phaseDetails).toBeUndefined();
    });

    test('should handle empty string parameters', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });

      const result = await store.dispatch(getPhasesByRoom(''));

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/phase/room/');
      expect(result.type).toBe('getPhasesByRoom/fulfilled');
    });
  });
});
