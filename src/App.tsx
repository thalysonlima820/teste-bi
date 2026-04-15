import { Home, BarChart3, LogOut } from "lucide-react";
import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./page/Dashboard";
import Login from "./page/Login";
import ComparativoVenda from "./page/ComparativoVenda";
import { useAuth } from "./auth/useAuth";

function Sidebar() {
  const { logout } = useAuth();
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-[52px] bg-secondary/95 border border-white/10 shadow-lg flex flex-col items-center py-3 gap-3 rounded-r-2xl rounded-l-none">
      <Link
        to="/"
        className="w-9 h-9 rounded-xl hover:bg-accent/20 text-textPrimary flex items-center justify-center transition"
      >
        <Home size={18} />
      </Link>

      <Link
        to="/ComparativoVenda"
        className="w-9 h-9 rounded-xl hover:bg-accent/20 text-textPrimary flex items-center justify-center transition"
      >
        <BarChart3 size={18} />
      </Link>

      <button onClick={() => logout()} className="w-9 h-9 rounded-xl hover:bg-accent/20 text-red-800 flex items-center justify-center transition">
        <LogOut size={18} />
      </button>

    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user?.token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="relative h-screen bg-primary text-textPrimary overflow-hidden">
      {!isLoginPage && <Sidebar />}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/ComparativoVenda"
          element={
            <RequireAuth>
              <ComparativoVenda />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;