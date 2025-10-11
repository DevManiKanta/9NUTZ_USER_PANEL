// "use client";

// import React, { useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { X, ArrowLeft } from "lucide-react";

// interface LoginModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
//   const { login, signup } = useAuth();

//   const [mode, setMode] = useState<"login" | "signup" | "reset">("login");

//   // form fields
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   // reset-specific
//   const [resetEmail, setResetEmail] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [resetMessage, setResetMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const clearAll = () => {
//     setName("");
//     setEmail("");
//     setPassword("");
//     setConfirmPassword("");
//     setResetEmail("");
//     setNewPassword("");
//     setResetMessage(null);
//     setError(null);
//   };

//   const handleClose = () => {
//     clearAll();
//     onClose();
//   };

//   const handleLoginSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     if (!email || !password) return setError("Please enter email and password.");
//     setLoading(true);
//     const ok = await login(email.trim().toLowerCase(), password);
//     setLoading(false);
//     if (ok) {
//       clearAll();
//       onClose();
//     } else {
//       setError("Invalid credentials. Please try again.");
//     }
//   };

//   const handleSignupSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     if (!name || !email || !password) return setError("All fields are required.");
//     if (password.length < 6) return setError("Password must be at least 6 characters.");
//     setLoading(true);
//     const ok = await signup(name.trim(), email.trim().toLowerCase(), password);
//     setLoading(false);
//     if (ok) {
//       clearAll();
//       onClose();
//     } else {
//       setError("Signup failed. Try a different email.");
//     }
//   };

//   const handleResetSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setResetMessage(null);

//     if (!resetEmail) return setError("Enter the email to reset.");
//     if (!newPassword || newPassword.length < 6) return setError("New password must be at least 6 characters.");

//     try {
//       setLoading(true);
//       const res = await fetch("/api/auth/reset", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: resetEmail.trim().toLowerCase(), newPassword })
//       });
//       setLoading(false);
//       if (!res.ok) {
//         const body = await res.json().catch(()=>null);
//         setError(body?.message || `Reset failed (${res.status})`);
//         return;
//       }
//       setResetMessage("Password updated. You can now log in with the new password.");
//       // optionally auto-switch to login mode and pre-fill fields
//       setMode("login");
//       setEmail(resetEmail.trim().toLowerCase());
//       setPassword(newPassword);
//       setResetEmail("");
//       setNewPassword("");
//     } catch (err) {
//       setLoading(false);
//       console.error(err);
//       setError("Network error while resetting password.");
//     }
//   };
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl w-full max-w-md relative">
//         {/* Header */}
//         <div className="flex items-center p-4 border-b border-gray-100">
//           {mode !== "login" && (
//             <button onClick={() => setMode("login")} className="p-2 rounded-lg hover:bg-gray-100 mr-2">
//               <ArrowLeft className="h-5 w-5 text-gray-600" />
//             </button>
//           )}
//           <div className="flex-1" />
//           <button onClick={handleClose} className="p-2 rounded-lg hover:bg-gray-100">
//             <X className="h-5 w-5 text-gray-600" />
//           </button>
//         </div>

//         <div className="p-6 text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-1">
//             {mode === "login" ? "Log in" : mode === "signup" ? "Create account" : "Reset password"}
//           </h2>

//           {mode === "login" && (
//             <p className="text-gray-600 mb-6">
  
//             </p>
//           )}
//           {mode === "signup" && (
//             <p className="text-gray-600 mb-6">Create a new account</p>
//           )}
//           {mode === "reset" && (
//             <p className="text-gray-600 mb-6">Enter your email and new password</p>
//           )}

//           {/* show errors */}
//           {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
//           {resetMessage && <div className="text-green-600 text-sm mb-3">{resetMessage}</div>}

//           {mode === "login" && (
//             <form onSubmit={handleLoginSubmit} className="space-y-4">
//               <input
//                 type="email"
//                 placeholder="Email address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg"
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg"
//                 required
//               />

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
//               >
//                 {loading ? "Signing in..." : "Sign in"}
//               </button>

//               <div className="flex items-center justify-between text-sm text-gray-600">
//                 <button type="button" className="underline" onClick={() => setMode("reset")}>
//                   Forgot password?
//                 </button>
//                 <button type="button" className="underline" onClick={() => setMode("signup")}>
//                   Create account
//                 </button>
//               </div>
//             </form>
//           )}

//           {mode === "signup" && (
//             <form onSubmit={handleSignupSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Full name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg"
//                 required
//               />
//               <input
//                 type="email"
//                 placeholder="Email address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg"
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Password (min 6 chars)"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg"
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Confirm password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg"
//                 required
//               />

//               <button
//                 type="submit"
//                 disabled={loading || password !== confirmPassword}
//                 className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-70"
//               >
//                 {loading ? "Creating..." : "Create account"}
//               </button>

//               <div className="text-sm text-gray-600">
//                 Already have an account?{" "}
//                 <button onClick={() => setMode("login")} className="underline">
//                   Sign in
//                 </button>
//               </div>
//             </form>
//           )}

//           {mode === "reset" && (
//             <form onSubmit={handleResetSubmit} className="space-y-4">
//               <input
//                 type="email"
//                 placeholder="Email address"
//                 value={resetEmail}
//                 onChange={(e) => setResetEmail(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg"
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="New password (min 6 chars)"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg"
//                 required
//               />

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
//               >
//                 {loading ? "Updating..." : "Update password"}
//               </button>

//               <div className="text-sm text-gray-600">
//                 Remembered password?{" "}
//                 <button onClick={() => setMode("login")} className="underline">
//                   Sign in
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE = "http://192.168.29.100:8000"; 

const API_AUTH_BEARER =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."; // optional, remove if not needed

function tryNotifyAuthContext(auth: any, action: "login" | "signup", payload: any) {
  try {
    if (!auth) return;
    const fn = action === "login" ? auth.login : auth.signup;
    if (typeof fn === "function") {
      fn(payload?.email ?? payload?.username ?? "", payload?.password ?? "");
    }
  } catch {
    // ignore any context errors
  }
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const authContext = useAuth();

  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");

  // common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signup-specific contact
  const [contact, setContact] = useState("");

  // reset fields
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clearAll = () => {
    setName("");
    setEmail("");
    setPassword("");
    setContact("");
    setResetEmail("");
    setNewPassword("");
    setResetMessage(null);
    setError(null);
  };

  const handleClose = () => {
    clearAll();
    onClose();
  };

  // Helper to parse JSON safely
  async function safeJson(res: Response) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  /** LOGIN — try JSON then fallback to form-data (depending on backend) */
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const url = `${API_BASE}/api/user-login`;

      // First try JSON (most backends)
      let res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: API_AUTH_BEARER ? `Bearer ${API_AUTH_BEARER}` : "",
        },
        body: JSON.stringify({ username: email.trim().toLowerCase(), password }),
      });

      // If backend expects multipart/form-data, try that as fallback
      if (!res.ok) {
        const fd = new FormData();
        fd.append("username", email.trim().toLowerCase());
        fd.append("password", password);

        res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: API_AUTH_BEARER ? `Bearer ${API_AUTH_BEARER}` : "",
            // IMPORTANT: DO NOT set Content-Type when sending FormData
          } as any,
          body: fd,
        });
      }

      const body = await safeJson(res);
      setLoading(false);

      if (!res.ok) {
        const msg = body?.message || body?.detail || `Login failed (${res.status})`;
        setError(msg);
        console.debug("login failed body:", body);
        return;
      }

      // Accept common token shapes
      const token = body?.token ?? body?.access_token ?? body?.accessToken ?? null;
      if (token) localStorage.setItem("auth_token", token);

      const user = body?.user ?? body?.data ?? null;
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.setItem("user", JSON.stringify({ email: email.trim().toLowerCase() }));

      tryNotifyAuthContext(authContext, "login", { email: email.trim().toLowerCase(), password });
      // leave closing / reload to calling code if desired
    } catch (err) {
      setLoading(false);
      console.error("Network/login error:", err);
      setError("Network error while logging in.");
    }
  };

  /** SIGNUP — send as FormData if contact present (common), otherwise JSON
   *  After successful signup, attempt to log the user in automatically.
   */
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !contact) {
      setError("All fields (including contact) are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const url = `${API_BASE}/api/register`;

      // Prefer FormData (your earlier curl used multipart/form-data)
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("email", email.trim().toLowerCase());
      fd.append("password", password);
      fd.append("contact", contact.trim());

      // IMPORTANT: When sending FormData, DO NOT set Content-Type header (browser will set the boundary)
      let res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: API_AUTH_BEARER ? `Bearer ${API_AUTH_BEARER}` : "",
        } as any,
        body: fd,
      });

      // If the backend fails for FormData, try JSON as a fallback
      if (!res.ok) {
        const jsonBody = await safeJson(res);
        // If error indicates wrong content type, try JSON
        if (res.status >= 400) {
          const res2 = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: API_AUTH_BEARER ? `Bearer ${API_AUTH_BEARER}` : "",
            },
            body: JSON.stringify({
              name: name.trim(),
              email: email.trim().toLowerCase(),
              password,
              contact: contact.trim(),
            }),
          });
          res = res2;
        }
      }

      const body = await safeJson(res);
      setLoading(false);

      if (!res.ok) {
        const msg = body?.message || body?.detail || `Signup failed (${res.status})`;
        setError(msg);
        console.debug("signup failed body:", body);
        return;
      }

      // store tokens/user if present
      const token = body?.token ?? body?.access_token ?? body?.accessToken ?? null;
      const user = body?.user ?? body?.data ?? null;

      if (token) {
        // If signup response already returns token & user, store and notify
        localStorage.setItem("auth_token", token);
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          localStorage.setItem(
            "user",
            JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), contact: contact.trim() })
          );
        }

        tryNotifyAuthContext(authContext, "signup", { name, email, password, contact });
        // Also notify login so any auth consumers update immediately
        tryNotifyAuthContext(authContext, "login", { email: email.trim().toLowerCase(), password });

        // done — keep existing behavior (you can uncomment to auto-close)
        // clearAll(); onClose();
        return;
      }

      // If no token returned on signup, attempt to login automatically now
      try {
        setLoading(true);
        const loginUrl = `${API_BASE}/api/user-login`;

        // First try JSON login
        let loginRes = await fetch(loginUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: API_AUTH_BEARER ? `Bearer ${API_AUTH_BEARER}` : "",
          },
          body: JSON.stringify({ username: email.trim().toLowerCase(), password }),
        });

        if (!loginRes.ok) {
          // fallback to form-data login
          const loginFd = new FormData();
          loginFd.append("username", email.trim().toLowerCase());
          loginFd.append("password", password);

          loginRes = await fetch(loginUrl, {
            method: "POST",
            headers: {
              Authorization: API_AUTH_BEARER ? `Bearer ${API_AUTH_BEARER}` : "",
            } as any,
            body: loginFd,
          });
        }

        const loginBody = await safeJson(loginRes);
        setLoading(false);

        if (!loginRes.ok) {
          // Login after signup failed — but signup itself succeeded; show a helpful message
          console.debug("auto-login after signup failed:", loginBody);
          setError(
            loginBody?.message ||
              loginBody?.detail ||
              "Account created but automatic login failed. Please sign in manually."
          );

          // Still notify signup (so external logic can refresh lists etc.)
          tryNotifyAuthContext(authContext, "signup", { name, email, password, contact });
          return;
        }

        // success: store token + user
        const loginToken = loginBody?.token ?? loginBody?.access_token ?? loginBody?.accessToken ?? null;
        const loginUser = loginBody?.user ?? loginBody?.data ?? null;

        if (loginToken) localStorage.setItem("auth_token", loginToken);
        if (loginUser) localStorage.setItem("user", JSON.stringify(loginUser));
        else
          localStorage.setItem(
            "user",
            JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), contact: contact.trim() })
          );

        // Notify auth context about both signup and login (keeps compatibility)
        tryNotifyAuthContext(authContext, "signup", { name, email, password, contact });
        tryNotifyAuthContext(authContext, "login", { email: email.trim().toLowerCase(), password });

        // done — keep existing behavior (you can uncomment to auto-close)
        // clearAll(); onClose();
      } catch (loginErr) {
        setLoading(false);
        console.error("auto-login error after signup:", loginErr);
        setError("Account created but automatic login failed. Please sign in manually.");
        tryNotifyAuthContext(authContext, "signup", { name, email, password, contact });
      }
    } catch (err) {
      setLoading(false);
      console.error("Network/signup error:", err);
      setError("Network error while creating account.");
    }
  };

  /** RESET — adjust endpoint as needed */
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);

    if (!resetEmail) {
      setError("Enter the email to reset.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      // change this if your backend has a different reset endpoint
      const res = await fetch(`${API_BASE}/api/auth/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim().toLowerCase(), newPassword }),
      });
      setLoading(false);
      if (!res.ok) {
        const body = await safeJson(res);
        setError(body?.message || `Reset failed (${res.status})`);
        return;
      }
      setResetMessage("Password updated. You can now log in with the new password.");
      setMode("login");
      setEmail(resetEmail.trim().toLowerCase());
      setPassword(newPassword);
      setResetEmail("");
      setNewPassword("");
    } catch (err) {
      setLoading(false);
      console.error("reset error:", err);
      setError("Network error while resetting password.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md relative">
        <div className="flex items-center p-4 border-b border-gray-100">
          {mode !== "login" && (
            <button
              onClick={() => {
                setMode("login");
                setError(null);
                setResetMessage(null);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 mr-2"
            >
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

          {mode === "login" && <p className="text-gray-600 mb-6">Sign in to continue.</p>}
          {mode === "signup" && <p className="text-gray-600 mb-6">Create a new account</p>}
          {mode === "reset" && <p className="text-gray-600 mb-6">Enter your email and new password</p>}

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
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    setMode("reset");
                    setError(null);
                  }}
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                >
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
                type="text"
                placeholder="Contact (phone)"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? "Creating..." : "Create account"}
              </button>

              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="underline"
                >
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
                <button
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="underline"
                >
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

