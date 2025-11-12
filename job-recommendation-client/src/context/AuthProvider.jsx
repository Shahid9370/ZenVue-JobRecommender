import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

/**
 * AuthProvider — component that manages auth state and provides the context.
 * This file only exports a component (default export).
 */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("ZenVue_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("ZenVue_user", JSON.stringify(user));
    else localStorage.removeItem("ZenVue_user");
  }, [user]);

  async function login(payload) {
    // Replace this with a real API call.
    setUser({ ...payload });
    return { ok: true };
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}