import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextValue } from "../types";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
