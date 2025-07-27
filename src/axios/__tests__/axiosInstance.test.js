jest.mock('axios'); // <-- Must be at the very top

const axios = require('axios');
const { createAxiosInstance } = require('../axiosInstance');

const mockStore = { getState: jest.fn(), dispatch: jest.fn() };
const mockAxiosInstance = {
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  },
  request: jest.fn()
};

describe('axiosInstance', () => {
  let axiosInstance, setupInterceptors;
  let requestInterceptor, responseInterceptor;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    axios.create.mockReturnValue(mockAxiosInstance);
    ({ axiosInstance, setupInterceptors } = createAxiosInstance(axios));
    mockAxiosInstance.interceptors.request.use.mockImplementation((success, error) => {
      requestInterceptor = { success, error };
    });
    mockAxiosInstance.interceptors.response.use.mockImplementation((success, error) => {
      responseInterceptor = { success, error };
    });
  });

  describe('axiosInstance creation', () => {
    test('should create axios instance with correct configuration', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:8080',
        withCredentials: true
      });
    });
  });

  describe('setupInterceptors', () => {
    test('should setup request and response interceptors', () => {
      setupInterceptors(mockStore);
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });

    describe('Request Interceptor', () => {
      beforeEach(() => {
        setupInterceptors(mockStore);
      });

      test('should add Authorization header when token exists', () => {
        const mockToken = 'test-token';
        mockStore.getState.mockReturnValue({
          auth: { accessToken: mockToken }
        });
        const config = { headers: {} };
        const result = requestInterceptor.success(config);
        expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
        expect(mockStore.getState).toHaveBeenCalled();
      });

      test('should not add Authorization header when token does not exist', () => {
        mockStore.getState.mockReturnValue({
          auth: { accessToken: null }
        });
        const config = { headers: {} };
        const result = requestInterceptor.success(config);
        expect(result.headers.Authorization).toBeUndefined();
      });

      test('should handle request interceptor error', async () => {
        const error = new Error('Request error');
        await expect(requestInterceptor.error(error)).rejects.toThrow('Request error');
      });
    });

    describe('Response Interceptor', () => {
      beforeEach(() => {
        setupInterceptors(mockStore);
      });

      test('should return response unchanged for successful requests', () => {
        const response = { data: 'success' };
        const result = responseInterceptor.success(response);
        expect(result).toBe(response);
      });

      test('should handle 401 error and refresh token successfully', async () => {
        const mockNewToken = 'new-token';
        const mockRefreshResponse = { data: { accessToken: mockNewToken } };
        axios.post.mockResolvedValueOnce(mockRefreshResponse);
        mockAxiosInstance.request.mockResolvedValueOnce('request result');
        mockStore.getState.mockReturnValue({
          auth: { email: 'test@example.com', role: 'USER' }
        });
        const error = {
          response: { status: 401 },
          config: { _retry: false, headers: {} }
        };
        const result = await responseInterceptor.error(error);
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:8080/auth/refreshAccessToken',
          {},
          { withCredentials: true }
        );
        expect(mockStore.dispatch).toHaveBeenCalledWith({
          type: 'auth/login',
          payload: {
            email: 'test@example.com',
            role: 'USER',
            accessToken: mockNewToken
          }
        });
        expect(error.config._retry).toBe(true);
        expect(error.config.headers.Authorization).toBe(`Bearer ${mockNewToken}`);
        expect(mockAxiosInstance.request).toHaveBeenCalledWith(error.config);
        expect(result).toBe('request result');
      });

      test('should handle 401 error with retry flag set', async () => {
        const error = {
          response: { status: 401 },
          config: { _retry: true }
        };
        await expect(responseInterceptor.error(error)).rejects.toBe(error);
      });

      test('should handle non-401 errors', async () => {
        const error = {
          response: { status: 500 },
          config: { _retry: false }
        };
        await expect(responseInterceptor.error(error)).rejects.toBe(error);
      });

      test('should handle errors without response', async () => {
        const error = new Error('Network error');
        await expect(responseInterceptor.error(error)).rejects.toBe(error);
      });
    });
  });
}); 