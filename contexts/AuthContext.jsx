"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import {LOCAL_API_BASE,Login_API_BASE} from "@/lib/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const API_BASE = Login_API_BASE;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
const router = useRouter();
  function saveAuth(tokenValue, userValue) {
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
  useEffect(() => {
    (async () => {
      try {
        const storedToken =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (storedToken) {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          setToken(storedToken);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/user-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data) {
        console.error("Login failed:", data);
        toast.error(String(data?.message || "Login failed"));
        return false;
      }

      const tokenValue = data?.token || data?.access || data?.access_token || null;
      const userValue = data?.user || data?.data || {
        id: data.id || "1",
        email,
        name: data.name || "User",
        role: "user",
      };

      if (!tokenValue) return false;

      saveAuth(tokenValue, userValue);
      toast.success("Logged in successfully");
      return true;
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name, email, password, contact) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          ...(contact ? { contact } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok || (typeof data.status !== 'undefined' && !data.status)) {
        console.error("Signup failed:", data);
        toast.error(String(data?.message || "Signup failed"));
        return false;
      }

      const ok = await login(email, password);
      if (ok) toast.success("Account created & logged in");
      return ok;
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Signup error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    saveAuth(null, null);
    toast.success("Logged out");
    router.push("/"); 
  };

  const resetPassword = async (email) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return true;
    } catch (err) {
      console.error("Password reset error:", err);
      return false;
    }
  };

  const refreshMe = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/user-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const me = await res.json();

      const normalized = {
        id: String(me.id),
        email: me.email,
        name: me.name,
        role: String(me.role || "user").toLowerCase(),
      };
      setUser(normalized);
    } catch (err) {
      console.warn("refreshMe failed:", err);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    signup,
    resetPassword,
    token,
    refreshMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


