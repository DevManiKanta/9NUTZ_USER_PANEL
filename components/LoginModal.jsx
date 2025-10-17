
// "use client";

// import React, { useState } from "react";
// import { X, ArrowLeft } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext";
// import Login_API_BASE from "@/lib/api";


// function tryNotifyAuthContext(auth, action, payload) {
//   try {
//     if (!auth) return;
//     const fn = action === "login" ? auth.login : auth.signup;
//     if (typeof fn === "function") {
//       fn(payload?.email ?? payload?.username ?? "", payload?.password ?? "");
//     }
//   } catch {
//     // ignore any context errors
//   }
// }

// export default function LoginModal({ isOpen, onClose }) {
//   const authContext = useAuth();

//   const [mode, setMode] = useState("login");

//   // common fields
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // signup-specific contact
//   const [contact, setContact] = useState("");

//   // reset fields
//   const [resetEmail, setResetEmail] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [resetMessage, setResetMessage] = useState(null);

//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const clearAll = () => {
//     setName("");
//     setEmail("");
//     setPassword("");
//     setContact("");
//     setResetEmail("");
//     setNewPassword("");
//     setResetMessage(null);
//     setError(null);
//   };

//   const handleClose = () => {
//     clearAll();
//     onClose();
//   };

//   // Helper to parse JSON safely
//   async function safeJson(res) {
//     try {
//       return await res.json();
//     } catch {
//       return null;
//     }
//   }

//   /** LOGIN — delegate to AuthContext */
//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!email || !password) {
//       setError("Please enter email and password.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const ok = await authContext.login(email.trim().toLowerCase(), password);
//       setLoading(false);
//       if (!ok) {
//         setError("Invalid credentials. Please try again.");
//         return;
//       }
//       onClose();
//     } catch (err) {
//       setLoading(false);
//       setError("Login failed. Please try again.");
//     }
//   };

//   /** SIGNUP — send as FormData if contact present (common), otherwise JSON
//    *  After successful signup, attempt to log the user in automatically.
//    */
//   const handleSignupSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!name || !email || !password || !contact) {
//       setError("All fields (including contact) are required.");
//       return;
//     }
//     if (password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const ok = await authContext.signup(name.trim(), email.trim().toLowerCase(), password, contact.trim());
//       setLoading(false);
//       if (!ok) {
//         setError("Signup failed. Please try again.");
//         return;
//       }
//       onClose();
//     } catch (err) {
//       setLoading(false);
//       setError("Signup failed. Please try again.");
//     }
//   };

//   /** RESET — adjust endpoint as needed */
//   const handleResetSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setResetMessage(null);

//     if (!resetEmail) {
//       setError("Enter the email to reset.");
//       return;
//     }
//     if (!newPassword || newPassword.length < 6) {
//       setError("New password must be at least 6 characters.");
//       return;
//     }

//     try {
//       setLoading(true);
//       // change this if your backend has a different reset endpoint
//       const res = await fetch(`${Login_API_BASE}/api/auth/reset`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: resetEmail.trim().toLowerCase(), newPassword }),
//       });
//       setLoading(false);
//       if (!res.ok) {
//         const body = await safeJson(res);
//         setError(body?.message || `Reset failed (${res.status})`);
//         return;
//       }
//       setResetMessage("Password updated. You can now log in with the new password.");
//       setMode("login");
//       setEmail(resetEmail.trim().toLowerCase());
//       setPassword(newPassword);
//       setResetEmail("");
//       setNewPassword("");
//     } catch (err) {
//       setLoading(false);
//       console.error("reset error:", err);
//       setError("Network error while resetting password.");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl w-full max-w-md relative">
//         <div className="flex items-center p-4 border-b border-gray-100">
//           {mode !== "login" && (
//             <button
//               onClick={() => {
//                 setMode("login");
//                 setError(null);
//                 setResetMessage(null);
//               }}
//               className="p-2 rounded-lg hover:bg-gray-100 mr-2"
//             >
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

//           {mode === "login" && <p className="text-gray-600 mb-6">Sign in to continue.</p>}
//           {mode === "signup" && <p className="text-gray-600 mb-6">Create a new account</p>}
//           {mode === "reset" && <p className="text-gray-600 mb-6">Enter your email and new password</p>}

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
//                 <button
//                   type="button"
//                   className="underline"
//                   onClick={() => {
//                     setMode("reset");
//                     setError(null);
//                   }}
//                 >
//                   Forgot password?
//                 </button>
//                 <button
//                   type="button"
//                   className="underline"
//                   onClick={() => {
//                     setMode("signup");
//                     setError(null);
//                   }}
//                 >
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
//                 type="text"
//                 placeholder="Contact (phone)"
//                 value={contact}
//                 onChange={(e) => setContact(e.target.value)}
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

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
//               >
//                 {loading ? "Creating..." : "Create account"}
//               </button>

//               <div className="text-sm text-gray-600">
//                 Already have an account?{" "}
//                 <button
//                   onClick={() => {
//                     setMode("login");
//                     setError(null);
//                   }}
//                   className="underline"
//                 >
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
//                 <button
//                   onClick={() => {
//                     setMode("login");
//                     setError(null);
//                   }}
//                   className="underline"
//                 >
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
import Login_API_BASE from "@/lib/api";


function tryNotifyAuthContext(auth, action, payload) {
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

export default function LoginModal({ isOpen, onClose }) {
  const authContext = useAuth();

  const [mode, setMode] = useState("login");

  // common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signup-specific contact
  const [contact, setContact] = useState("");

  // reset fields
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState(null);

  const [error, setError] = useState(null);
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
  async function safeJson(res) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  /** LOGIN — delegate to AuthContext */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const ok = await authContext.login(email.trim().toLowerCase(), password);
      setLoading(false);
      if (!ok) {
        setError("Invalid credentials. Please try again.");
        return;
      }
      handleClose(); // <<< changed from onClose() to clear inputs on success
    } catch (err) {
      setLoading(false);
      setError("Login failed. Please try again.");
    }
  };

  /** SIGNUP — send as FormData if contact present (common), otherwise JSON
   *  After successful signup, attempt to log the user in automatically.
   */
  const handleSignupSubmit = async (e) => {
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
      const ok = await authContext.signup(name.trim(), email.trim().toLowerCase(), password, contact.trim());
      setLoading(false);
      if (!ok) {
        setError("Signup failed. Please try again.");
        return;
      }
      handleClose(); // <<< changed from onClose() to clear inputs on success
    } catch (err) {
      setLoading(false);
      setError("Signup failed. Please try again.");
    }
  };

  /** RESET — adjust endpoint as needed */
  const handleResetSubmit = async (e) => {
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
      const res = await fetch(`${Login_API_BASE}/api/auth/reset`, {
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

