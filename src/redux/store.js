import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from './auth/authSlice';
import storage from 'redux-persist/lib/storage'; 
import { persistReducer, persistStore } from 'redux-persist';
import { phaseListReducer } from './phase/phaseListSlice';
import { phaseReducer } from './phase/phaseSlice';
import assignedVendorReducer from './assignedVendorSlice';


const authPersistConfig = {
  key: 'root',
  storage 
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  phase : phaseReducer,
  phaselist: phaseListReducer,
  assignedVendor: assignedVendorReducer
});

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
