import { useContext, createContext, useReducer } from "react";
import { authReducer } from "./authReducer";

// Try to load persisted state from localStorage
const getInitialAuthState = () => {
  const stored = localStorage.getItem("authState");
  return stored
    ? JSON.parse(stored)
    : { email: null, role: null, accessToken: null };
};

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authState, authDispatch] = useReducer(
    authReducer,
    {},
    getInitialAuthState
  );

  return (
    <AuthContext.Provider value={{ authState, authDispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const RootState = () => useContext(AuthContext);
