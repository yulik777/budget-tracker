"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { apiClient } from "../lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  settings?: {
    id: string;
    userId: string;
    currency: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ IMPORTANT: useCallback BEFORE useEffect fix
  const refreshUser = useCallback(async () => {
    try {
      const res = await apiClient.getCurrentUser();
      setUser(res.user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      setLoading(false);
    };

    init();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await apiClient.login(email, password);
    setUser(res.user);
  };

  const register = async (email: string, name: string, password: string) => {
    const res = await apiClient.register(email, name, password);
    setUser(res.user);
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
