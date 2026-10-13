import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

const PaceSiswaLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 premium-shadow relative z-10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center text-white font-bold text-2xl premium-shadow">
              P
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">Beasiswa PACE</h1>
              <p className="text-xs text-brand-gold font-bold">Akses Siswa</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default PaceSiswaLayout;
