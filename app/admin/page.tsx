// Frontend/app/admin/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const { login, resetPassword, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (user && user.role === "admin") {
      router.push("/admin/dashboard");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setError("");
    try {
      const success = await login(email.trim(), password);
      if (success) {
        // wait small tick for auth to update
        setTimeout(() => {
          const storedUser = localStorage.getItem("user");
          const parsed = storedUser ? JSON.parse(storedUser) : null;
          if (parsed && parsed.role === "admin") {
            router.push("/admin/dashboard");
          } else {
            setError("Not an admin user.");
          }
        }, 50);
      } else {
        setError("Invalid admin credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setResetMessage("");
    try {
      const success = await resetPassword(resetEmail);
      if (success) {
        setResetMessage("Password reset request handled (dev-mode).");
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetMessage("");
        }, 2000);
      } else {
        setResetMessage("Failed to reset password.");
      }
    } catch (err) {
      setResetMessage("Failed to send reset email. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  // (rendering code is identical to app/page.tsx for login/reset UI)
  if (showForgotPassword) {
    return (
      /* same reset UI as above — copy from app/page.tsx */
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">JB</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your email to receive reset instructions</p>
          </div>

          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div>
              <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="resetEmail"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="admin@jbasket.com"
                />
              </div>
            </div>

            {resetMessage && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  resetMessage.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {resetMessage}
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={localLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {localLoading ? <Loader className="h-5 w-5 animate-spin" /> : <>Send Reset Email <ArrowRight className="ml-2 h-5 w-5" /></>}
              </button>

              <button type="button" onClick={() => setShowForgotPassword(false)} className="w-full text-green-600 hover:text-green-700 py-3 font-medium transition-colors">
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">JB</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Access your JBasket admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="admin@jbasket.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

          <div className="space-y-4">
            <button type="submit" disabled={localLoading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
              {localLoading ? <Loader className="h-5 w-5 animate-spin" /> : <>Login <ArrowRight className="ml-2 h-5 w-5" /></>}
            </button>

            <button type="button" onClick={() => setShowForgotPassword(true)} className="w-full text-green-600 hover:text-green-700 py-2 font-medium transition-colors">
              Forgot Password?
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Demo Credentials</h3>
          <p className="text-sm text-blue-700">
            <strong>Email:</strong> admin@jbasket.com<br />
            <strong>Password:</strong> admin123
          </p>
        </div>
      </div>
    </div>
  );
}
