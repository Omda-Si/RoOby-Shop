import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api
      .me()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        async login(username, password) {
          const data = await api.login(username, password);
          setUser(data);
        },
        async logout() {
          await api.logout();
          setUser(null);
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
