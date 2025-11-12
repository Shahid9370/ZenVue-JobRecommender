import { createContext } from "react";

/**
 * AuthContext — only exports a context object (no components).
 * Keep this file free of components so fast refresh won't warn.
 */
export const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: () => {},
});