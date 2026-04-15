import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

type LocationState = { from?: string };

const Login = () => {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [entered, setEntered] = useState(false);

  const { login, user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (user?.token) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nomeLimpo = nome.trim();
    const senhaLimpa = senha.trim();

    if (!nomeLimpo || !senhaLimpa) {
      setError("Informe nome e senha.");
      return;
    }

    setError(null);
    setLoading(true);

    const res = await login({ nome: nomeLimpo, senha: senhaLimpa });

    setLoading(false);

    if (!res.ok) {
      setError(res.error ?? "Erro ao logar.");
      return;
    }

    navigate(state?.from ?? "/", { replace: true });
  };

  return (
    <div
      className="min-h-dvh w-full flex items-center justify-center p-4 overflow-hidden"
      style={{
        background:
          "radial-gradient(900px circle at 20% 10%, rgba(233,69,96,0.18), transparent 55%), radial-gradient(900px circle at 80% 80%, rgba(39,174,96,0.10), transparent 60%), linear-gradient(180deg, var(--primary-bg), var(--secondary-bg))",
      }}
    >
      <form
        onSubmit={onSubmit}
        className={[
          "w-full max-w-md rounded-3xl p-7 shadow-2xl border border-white/10",
          "transition-all duration-500 ease-out",
          entered ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-90 blur-[2px]",
        ].join(" ")}
        style={{
          background: "rgba(22,33,62,0.65)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-textPrimary tracking-tight">
              Entrar
            </h1>
            <p className="mt-1 text-sm text-textPrimary/60">
              Bem-vindo ao <span style={{ color: "var(--accent-color)" }}>AdmGestão</span>
            </p>
          </div>

          <div
            className="h-10 w-10 rounded-2xl border border-white/10 flex items-center justify-center"
            style={{ background: "rgba(233,69,96,0.10)" }}
            aria-hidden
          >
            <div
              className="h-4 w-4 rounded-full"
              style={{ background: "var(--accent-color)" }}
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-textPrimary text-sm">Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 w-full rounded-2xl px-4 py-3 bg-hover text-textPrimary outline-none border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/10 disabled:opacity-60"
              placeholder="adm"
              autoFocus
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-textPrimary text-sm">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 w-full rounded-2xl px-4 py-3 bg-hover text-textPrimary outline-none border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/10 disabled:opacity-60"
              placeholder="adm"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-red-300 bg-red-500/10 border border-red-500/20 rounded-2xl p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !nome.trim() || !senha.trim()}
            className="btn w-full disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;