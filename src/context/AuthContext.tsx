import React, { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (loggedIn: boolean) => {},
  username: "",
  setUsername: (username: string) => {},
});

export default function AuthContextProvider({ children }: any) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("userAccessToken") ? true : false
  );

  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, username, setUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
}
