import authReducer, { login, logout, updateAccessToken } from '../authSlice';

describe('authSlice', () => {
  const initialState = {
    email: null,
    role: null,
    accessToken: null,
    url: null
  };

  describe('initial state', () => {
    test('should return the initial state', () => {
      expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    test('should have correct initial values', () => {
      const state = authReducer(undefined, { type: undefined });
      expect(state.email).toBeNull();
      expect(state.role).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.url).toBeNull();
    });
  });

  describe('login action', () => {
    test('should handle login with all fields', () => {
      const loginPayload = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: 'token123',
        url: 'https://example.com'
      };

      const newState = authReducer(initialState, login(loginPayload));

      expect(newState.email).toBe('test@example.com');
      expect(newState.role).toBe('ADMIN');
      expect(newState.accessToken).toBe('token123');
      expect(newState.url).toBe('https://example.com');
    });

    test('should handle login with partial payload', () => {
      const loginPayload = {
        email: 'test@example.com',
        role: 'CUSTOMER'
        // Missing accessToken and url
      };

      const newState = authReducer(initialState, login(loginPayload));

      expect(newState.email).toBe('test@example.com');
      expect(newState.role).toBe('CUSTOMER');
      expect(newState.accessToken).toBeUndefined();
      expect(newState.url).toBeUndefined();
    });

    test('should handle login with empty payload', () => {
      const loginPayload = {};

      const newState = authReducer(initialState, login(loginPayload));

      expect(newState.email).toBeUndefined();
      expect(newState.role).toBeUndefined();
      expect(newState.accessToken).toBeUndefined();
      expect(newState.url).toBeUndefined();
    });

    test('should handle login with null values', () => {
      const loginPayload = {
        email: null,
        role: null,
        accessToken: null,
        url: null
      };

      const newState = authReducer(initialState, login(loginPayload));

      expect(newState.email).toBeNull();
      expect(newState.role).toBeNull();
      expect(newState.accessToken).toBeNull();
      expect(newState.url).toBeNull();
    });

    test('should handle login with different role types', () => {
      const roles = ['ADMIN', 'VENDOR', 'CUSTOMER'];
      
      roles.forEach(role => {
        const loginPayload = {
          email: 'test@example.com',
          role: role,
          accessToken: 'token123',
          url: 'https://example.com'
        };

        const newState = authReducer(initialState, login(loginPayload));
        expect(newState.role).toBe(role);
      });
    });

    test('should handle login with special characters in email', () => {
      const loginPayload = {
        email: 'test+special@example.co.uk',
        role: 'ADMIN',
        accessToken: 'token123',
        url: 'https://example.com'
      };

      const newState = authReducer(initialState, login(loginPayload));
      expect(newState.email).toBe('test+special@example.co.uk');
    });

    test('should handle login with long token', () => {
      const longToken = 'a'.repeat(1000);
      const loginPayload = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: longToken,
        url: 'https://example.com'
      };

      const newState = authReducer(initialState, login(loginPayload));
      expect(newState.accessToken).toBe(longToken);
    });

    test('should handle login with complex URL', () => {
      const complexUrl = 'https://api.example.com/v1/auth/callback?redirect=/dashboard&token=abc123';
      const loginPayload = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: 'token123',
        url: complexUrl
      };

      const newState = authReducer(initialState, login(loginPayload));
      expect(newState.url).toBe(complexUrl);
    });

    test('should handle login with undefined values', () => {
      const loginPayload = {
        email: undefined,
        role: undefined,
        accessToken: undefined,
        url: undefined
      };

      const newState = authReducer(initialState, login(loginPayload));

      expect(newState.email).toBeUndefined();
      expect(newState.role).toBeUndefined();
      expect(newState.accessToken).toBeUndefined();
      expect(newState.url).toBeUndefined();
    });

    test('should handle login with empty string values', () => {
      const loginPayload = {
        email: '',
        role: '',
        accessToken: '',
        url: ''
      };

      const newState = authReducer(initialState, login(loginPayload));

      expect(newState.email).toBe('');
      expect(newState.role).toBe('');
      expect(newState.accessToken).toBe('');
      expect(newState.url).toBe('');
    });
  });

  describe('logout action', () => {
    test('should reset state to initial values', () => {
      const loggedInState = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: 'token123',
        url: 'https://example.com'
      };

      const newState = authReducer(loggedInState, logout());

      expect(newState.email).toBeNull();
      expect(newState.role).toBeNull();
      expect(newState.accessToken).toBeNull();
      expect(newState.url).toBeNull();
    });

    test('should reset state from partial state', () => {
      const partialState = {
        email: 'test@example.com',
        role: 'CUSTOMER',
        accessToken: null,
        url: null
      };

      const newState = authReducer(partialState, logout());

      expect(newState.email).toBeNull();
      expect(newState.role).toBeNull();
      expect(newState.accessToken).toBeNull();
      expect(newState.url).toBeNull();
    });

    test('should reset state from empty state', () => {
      const emptyState = {
        email: null,
        role: null,
        accessToken: null,
        url: null
      };

      const newState = authReducer(emptyState, logout());

      expect(newState.email).toBeNull();
      expect(newState.role).toBeNull();
      expect(newState.accessToken).toBeNull();
      expect(newState.url).toBeNull();
    });

    test('should reset state from undefined values', () => {
      const undefinedState = {
        email: undefined,
        role: undefined,
        accessToken: undefined,
        url: undefined
      };

      const newState = authReducer(undefinedState, logout());

      expect(newState.email).toBeNull();
      expect(newState.role).toBeNull();
      expect(newState.accessToken).toBeNull();
      expect(newState.url).toBeNull();
    });

    test('should reset state from empty string values', () => {
      const emptyStringState = {
        email: '',
        role: '',
        accessToken: '',
        url: ''
      };

      const newState = authReducer(emptyStringState, logout());

      expect(newState.email).toBeNull();
      expect(newState.role).toBeNull();
      expect(newState.accessToken).toBeNull();
      expect(newState.url).toBeNull();
    });
  });

  describe('updateAccessToken action', () => {
    test('should update access token', () => {
      const loggedInState = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: 'old-token',
        url: 'https://example.com'
      };

      const newState = authReducer(loggedInState, updateAccessToken({ newAccessToken: 'new-token' }));

      expect(newState.email).toBe('test@example.com');
      expect(newState.role).toBe('ADMIN');
      expect(newState.accessToken).toBe('new-token');
      expect(newState.url).toBe('https://example.com');
    });

    test('should update access token from null', () => {
      const stateWithNullToken = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: null,
        url: 'https://example.com'
      };

      const newState = authReducer(stateWithNullToken, updateAccessToken({ newAccessToken: 'new-token' }));

      expect(newState.accessToken).toBe('new-token');
    });

    test('should update access token to null', () => {
      const loggedInState = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: 'old-token',
        url: 'https://example.com'
      };

      const newState = authReducer(loggedInState, updateAccessToken({ newAccessToken: null }));

      expect(newState.accessToken).toBeNull();
    });

    test('should update access token to empty string', () => {
      const loggedInState = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: 'old-token',
        url: 'https://example.com'
      };

      const newState = authReducer(loggedInState, updateAccessToken({ newAccessToken: '' }));

      expect(newState.accessToken).toBe('');
    });

    test('should update access token with long token', () => {
      const loggedInState = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: 'old-token',
        url: 'https://example.com'
      };

      const longToken = 'a'.repeat(1000);
      const newState = authReducer(loggedInState, updateAccessToken({ newAccessToken: longToken }));

      expect(newState.accessToken).toBe(longToken);
    });

    test('should handle updateAccessToken with undefined payload', () => {
      const loggedInState = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: 'old-token',
        url: 'https://example.com'
      };

      const newState = authReducer(loggedInState, updateAccessToken(undefined));

      expect(newState.accessToken).toBeUndefined();
    });

    test('should handle updateAccessToken with empty payload', () => {
      const loggedInState = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: 'old-token',
        url: 'https://example.com'
      };

      const newState = authReducer(loggedInState, updateAccessToken({}));

      expect(newState.accessToken).toBeUndefined();
    });
  });

  describe('action creators', () => {
    test('login action creator should create correct action', () => {
      const payload = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: 'token123',
        url: 'https://example.com'
      };

      const action = login(payload);

      expect(action.type).toBe('auth/login');
      expect(action.payload).toEqual(payload);
    });

    test('logout action creator should create correct action', () => {
      const action = logout();

      expect(action.type).toBe('auth/logout');
      expect(action.payload).toBeUndefined();
    });

    test('updateAccessToken action creator should create correct action', () => {
      const payload = { newAccessToken: 'new-token' };
      const action = updateAccessToken(payload);

      expect(action.type).toBe('auth/updateAccessToken');
      expect(action.payload).toEqual(payload);
    });
  });

  describe('state immutability', () => {
    test('login should not mutate original state', () => {
      const originalState = {
        email: 'original@example.com',
        role: 'CUSTOMER',
        accessToken: 'original-token',
        url: 'https://original.com'
      };

      const loginPayload = {
        email: 'new@example.com',
        role: 'ADMIN',
        accessToken: 'new-token',
        url: 'https://new.com'
      };

      const newState = authReducer(originalState, login(loginPayload));

      expect(newState).not.toBe(originalState);
      expect(originalState.email).toBe('original@example.com');
      expect(originalState.role).toBe('CUSTOMER');
      expect(originalState.accessToken).toBe('original-token');
      expect(originalState.url).toBe('https://original.com');
    });

    test('logout should not mutate original state', () => {
      const originalState = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: 'token123',
        url: 'https://example.com'
      };

      const newState = authReducer(originalState, logout());

      expect(newState).not.toBe(originalState);
      expect(originalState.email).toBe('test@example.com');
      expect(originalState.role).toBe('ADMIN');
      expect(originalState.accessToken).toBe('token123');
      expect(originalState.url).toBe('https://example.com');
    });

    test('updateAccessToken should not mutate original state', () => {
      const originalState = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: 'old-token',
        url: 'https://example.com'
      };

      const newState = authReducer(originalState, updateAccessToken({ newAccessToken: 'new-token' }));

      expect(newState).not.toBe(originalState);
      expect(originalState.accessToken).toBe('old-token');
    });
  });

  describe('edge cases', () => {
    test('should handle unknown action type', () => {
      const loggedInState = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: 'token123',
        url: 'https://example.com'
      };

      const newState = authReducer(loggedInState, { type: 'unknown/action' });

      expect(newState).toEqual(loggedInState);
    });

    test('should handle action without payload', () => {
      const loggedInState = {
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: 'token123',
        url: 'https://example.com'
      };

      const newState = authReducer(loggedInState, { type: 'auth/login' });

      expect(newState).toEqual(loggedInState);
    });

    test('should handle multiple state transitions', () => {
      let state = authReducer(undefined, { type: undefined });
      expect(state).toEqual(initialState);

      state = authReducer(state, login({
        email: 'test@example.com',
        role: 'ADMIN',
        accessToken: 'token123',
        url: 'https://example.com'
      }));
      expect(state.email).toBe('test@example.com');

      state = authReducer(state, updateAccessToken({ newAccessToken: 'new-token' }));
      expect(state.accessToken).toBe('new-token');

      state = authReducer(state, logout());
      expect(state).toEqual(initialState);
    });
  });
}); 