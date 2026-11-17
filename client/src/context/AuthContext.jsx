import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (!isAdmin) {
      setReady(true);
      return;
    }

    if (!user) setReady(false);
    let alive = true;
    api
      .me()
      .then((data) => {
        if (alive) setUser(data);
      })
      .catch(() => {
        if (alive) setUser(null);
      })
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, [isAdmin]);

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
        },
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
