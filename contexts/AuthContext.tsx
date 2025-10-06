// Frontend/src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import request, { loginAPI, registerAPI } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  token: string | null;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // helper to persist user + token
  function saveAuth(tokenValue: string | null, userValue: User | null) {
    if (typeof window === "undefined") return;
    if (tokenValue) {
      localStorage.setItem("token", tokenValue);
    } else {
      localStorage.removeItem("token");
    }

    if (userValue) {
      localStorage.setItem("user", JSON.stringify(userValue));
    } else {
      localStorage.removeItem("user");
    }

    setToken(tokenValue);
    setUser(userValue);
  }

  // On mount: try to auto-login using stored token
  useEffect(() => {
    (async () => {
      try {
        const storedToken =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (storedToken) {
          try {
            const me = await request("/auth/me", { token: storedToken });
            const normalized: User = {
              id: String(me.id),
              email: me.email,
              name: me.name,
              role: (String(me.role || "user").toLowerCase() as "user" | "admin"),
            };
            saveAuth(storedToken, normalized);
          } catch (err) {
            console.warn("Auto-login failed:", err);
            saveAuth(null, null);
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await loginAPI({ email, password });
      const t: string = res.token;
      const u = res.user;
      if (!t || !u) {
        return false;
      }
      const normalized: User = {
        id: String(u.id),
        email: u.email,
        name: u.name,
        role: (String(u.role || "user").toLowerCase() as "user" | "admin"),
      };
      saveAuth(t, normalized);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await registerAPI({ name, email, password });
      const ok = await login(email, password);
      return ok;
    } catch (err) {
      console.error("Signup error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    saveAuth(null, null);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log(`Password reset requested for ${email}`);
      return true;
    } catch (err) {
      console.error("Password reset error:", err);
      return false;
    }
  };

  const refreshMe = async (): Promise<void> => {
    if (!token) return;
    try {
      const me = await request("/auth/me", { token });
      const normalized: User = {
        id: String(me.id),
        email: me.email,
        name: me.name,
        role: (String(me.role || "user").toLowerCase() as "user" | "admin"),
      };
      setUser(normalized);
    } catch (err) {
      console.warn("refreshMe failed:", err);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    signup,
    resetPassword,
    token,
    refreshMe,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
