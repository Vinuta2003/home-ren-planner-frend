import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  role: null,
  accessToken: null,
  url: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken;
      state.url = action.payload.url;
    },
    logout: (state) => {
      state.email = null;
      state.role = null;
      state.accessToken = null;
      state.url = null;
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload.newAccessToken
    }
  },
});

export const { login, logout, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
