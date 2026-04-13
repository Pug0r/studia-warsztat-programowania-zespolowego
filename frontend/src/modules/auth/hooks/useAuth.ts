import { useContext } from "react";
import type { AuthContextValue } from "../types";
import { AuthContext } from "./AuthContext";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
