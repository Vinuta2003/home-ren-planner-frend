import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import assignedVendorReducer from './assignedVendorSlice';

import authReducer from './auth/authSlice';
import { phaseReducer } from '../app/features/phaseSlice';
import { phaseListReducer } from '../app/features/phaseListSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  phase: phaseReducer,
  phaselist: phaseListReducer,
  assignedVendor: assignedVendorReducer
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
