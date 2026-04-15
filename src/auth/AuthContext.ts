import { createContext } from "react";
import type { AuthUser } from "./auth.storage";

export type LoginPayload = {
  nome: string;
  senha: string;
};

export type LoginResult = {
  ok: boolean;
  error?: string;
};

export type AuthContextType = {
  user: AuthUser | null;
  login: (payload: LoginPayload) => Promise<LoginResult>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);