import React, { useMemo, useState } from "react";
import { clearUser, getUser, saveUser, type AuthUser } from "./auth.storage";
import { AuthContext, type AuthContextType } from "./AuthContext";
import { Api } from "./services/api";


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => getUser());

  const login: AuthContextType["login"] = async ({ nome, senha }) => {
    try {
      const nomeLimpo = nome.trim();
      const senhaLimpa = senha.trim();

      if (!nomeLimpo || !senhaLimpa) {
        return { ok: false, error: "Informe nome e senha." };
      }

      const response = await Api.post("/auth/login", {
        NOME: nomeLimpo,
        SENHA: senhaLimpa,
      });

      const data = response?.data ?? {};
      const accessToken = data?.accessToken ?? data?.token;
      const usuario = data?.usuario ?? {};

       if (
        data?.usuario.CODUSUARIO !== '9999' &&
        data?.usuario.CODUSUARIO !== '125'
      ) {
        return { ok: false, error: "Usuario Sem Permissao." };
      }

      if (!accessToken) {
        return { ok: false, error: "Token não retornado pela API." };
      }

      const u: AuthUser = {
        nome: String(usuario.NOME ?? nomeLimpo),
        token: String(accessToken),
        codUsuario: String(usuario.CODUSUARIO ?? ""),
      };

      saveUser(u);
      setUserState(u);

      return { ok: true };
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Nome ou senha inválidos.";

      return { ok: false, error: String(msg) };
    }
  };

  const logout = () => {
    clearUser();
    setUserState(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}