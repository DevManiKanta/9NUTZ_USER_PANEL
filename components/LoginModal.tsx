"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { X, ArrowLeft } from "lucide-react";

/**
 * LoginModal
 * - login via email + password
 * - signup (name + email + password)
 * - forgot password (enter email → set new password) -- simple dev-friendly flow
 *
 * Note: the "forgot password" flow below calls /api/auth/reset (server route
 * provided below). That route is intentionally simple for development.
 */

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, signup } = useAuth();

  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // reset-specific
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clearAll = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setResetEmail("");
    setNewPassword("");
    setResetMessage(null);
    setError(null);
  };

  const handleClose = () => {
    clearAll();
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError("Please enter email and password.");
    setLoading(true);
    const ok = await login(email.trim().toLowerCase(), password);
    setLoading(false);
    if (ok) {
      clearAll();
      onClose();
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) return setError("All fields are required.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    const ok = await signup(name.trim(), email.trim().toLowerCase(), password);
    setLoading(false);
    if (ok) {
      clearAll();
      onClose();
    } else {
      setError("Signup failed. Try a different email.");
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);

    if (!resetEmail) return setError("Enter the email to reset.");
    if (!newPassword || newPassword.length < 6) return setError("New password must be at least 6 characters.");

    try {
      setLoading(true);
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim().toLowerCase(), newPassword })
      });
      setLoading(false);
      if (!res.ok) {
        const body = await res.json().catch(()=>null);
        setError(body?.message || `Reset failed (${res.status})`);
        return;
      }
      setResetMessage("Password updated. You can now log in with the new password.");
      // optionally auto-switch to login mode and pre-fill fields
      setMode("login");
      setEmail(resetEmail.trim().toLowerCase());
      setPassword(newPassword);
      setResetEmail("");
      setNewPassword("");
    } catch (err) {
      setLoading(false);
      console.error(err);
      setError("Network error while resetting password.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-100">
          {mode !== "login" && (
            <button onClick={() => setMode("login")} className="p-2 rounded-lg hover:bg-gray-100 mr-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
          )}
          <div className="flex-1" />
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {mode === "login" ? "Log in" : mode === "signup" ? "Create account" : "Reset password"}
          </h2>

          {mode === "login" && (
            <p className="text-gray-600 mb-6">Log in with your email and password</p>
          )}
          {mode === "signup" && (
            <p className="text-gray-600 mb-6">Create a new account</p>
          )}
          {mode === "reset" && (
            <p className="text-gray-600 mb-6">Enter your email and new password</p>
          )}

          {/* show errors */}
          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
          {resetMessage && <div className="text-green-600 text-sm mb-3">{resetMessage}</div>}

          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <button type="button" className="underline" onClick={() => setMode("reset")}>
                  Forgot password?
                </button>
                <button type="button" className="underline" onClick={() => setMode("signup")}>
                  Create account
                </button>
              </div>
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              />

              <button
                type="submit"
                disabled={loading || password !== confirmPassword}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-70"
              >
                {loading ? "Creating..." : "Create account"}
              </button>

              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="underline">
                  Sign in
                </button>
              </div>
            </form>
          )}

          {mode === "reset" && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="New password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? "Updating..." : "Update password"}
              </button>

              <div className="text-sm text-gray-600">
                Remembered password?{" "}
                <button onClick={() => setMode("login")} className="underline">
                  Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
