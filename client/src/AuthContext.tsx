import { createContext, useContext, useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  isLoggedIn: false,
  login: (email: string) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //const navigate = useNavigate();

  useEffect(() => {
    // Check if email exists in localStorage
    const email = localStorage.getItem("userEmail");
    if (email) {
      setIsLoggedIn(true); // User is logged in
    }
  }, []);

  const login = (email: string) => {
    localStorage.setItem("userEmail", email);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    //navigate("/")
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
