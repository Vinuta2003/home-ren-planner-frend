import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from './auth/authSlice';
import storage from 'redux-persist/lib/storage'; 
import { persistReducer, persistStore } from 'redux-persist';
import assignedVendorReducer from './assignedVendorSlice';

const persistConfig = {
  key: 'root',
  storage 
};

const rootReducer = combineReducers({
  auth: authReducer,
  assignedVendor: assignedVendorReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);
