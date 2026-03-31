import { Home, BarChart3, Store, Settings } from 'lucide-react'
import { Link, Routes, Route } from 'react-router-dom'
import Dashboard from './page/Dashboard'
import ComparativoVenda from './page/ComparativoVenda'

function Sidebar() {
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

      <button className="w-9 h-9 rounded-xl hover:bg-accent/20 text-textPrimary flex items-center justify-center transition">
        <Store size={18} />
      </button>

      <button className="w-9 h-9 rounded-xl hover:bg-accent/20 text-textPrimary flex items-center justify-center transition">
        <Settings size={18} />
      </button>

    </div>
  )
}

function App() {
  return (
    <div className="relative h-screen bg-primary text-textPrimary overflow-hidden">
      <Sidebar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ComparativoVenda" element={<ComparativoVenda />} />
      </Routes>
    </div>
  )
}

export default App