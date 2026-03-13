"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AppUser } from "@/types";

interface AuthContextType {
  user: AppUser | null;
  token: string | null;
  login: (token: string, user: AppUser) => void;
  logout: () => void;
  isStudent: boolean;
  isProfessor: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isStudent: false,
  isProfessor: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("atryn_token");
    const savedUser = localStorage.getItem("atryn_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("atryn_token");
        localStorage.removeItem("atryn_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string, newUser: AppUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("atryn_token", newToken);
    localStorage.setItem("atryn_user", JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("atryn_token");
    localStorage.removeItem("atryn_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isStudent: user?.role === "student",
        isProfessor: user?.role === "professor",
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
