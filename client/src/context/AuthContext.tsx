import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi } from "../api/auth";
import type { User } from "../types/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  bootstrapping: boolean;
  login(email: string, password: string): Promise<void>;
  register(payload: { name: string; email: string; password: string }): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("smart-leads-token"));
  const [bootstrapping, setBootstrapping] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setBootstrapping(false);
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("smart-leads-token");
        setToken(null);
      })
      .finally(() => setBootstrapping(false));
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      bootstrapping,
      login: async (email, password) => {
        const response = await authApi.login({ email, password });
        localStorage.setItem("smart-leads-token", response.token);
        setToken(response.token);
        setUser(response.user);
      },
      register: async (payload) => {
        const response = await authApi.register(payload);
        localStorage.setItem("smart-leads-token", response.token);
        setToken(response.token);
        setUser(response.user);
      },
      logout: () => {
        localStorage.removeItem("smart-leads-token");
        setToken(null);
        setUser(null);
      }
    }),
    [bootstrapping, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
