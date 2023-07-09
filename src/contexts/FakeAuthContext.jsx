import { useReducer } from "react";
import { createContext, useContext } from "react";

const FAKE_USER = {
  name: "Justas",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "login/success":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case "login/fail":
      return { ...state, error: action.payload };

    case "logout":
      return initialState;

    default:
      throw new Error("Uknown action type");
  }
};

const AuthProvider = ({ children }) => {
  const [{ user, isAuthenticated, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const login = (email, password) => {
    if (FAKE_USER.email === email && FAKE_USER.password === password) {
      dispatch({ type: "login/success", payload: FAKE_USER });
    } else {
      dispatch({
        type: "login/fail",
        payload: "Authentication Failed. Check credentials ❌",
      });
    }
  };
  const logout = () => {
    dispatch({ type: "logout" });
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext is used outside the AuthProvider");
  return context;
};

export { AuthProvider, useAuth };
