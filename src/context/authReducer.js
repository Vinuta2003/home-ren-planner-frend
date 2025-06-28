

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const loginState = {
        email: action.payload.email,
        role: action.payload.role,
        accessToken: action.payload.accessToken,
      };
      localStorage.setItem("authState", JSON.stringify(loginState));
      return loginState;

    case "LOGOUT":
      localStorage.removeItem("authState");
      return {
        email: null,
        role: null,
        accessToken: null,
      };

    default:
      return state;
  }
};
