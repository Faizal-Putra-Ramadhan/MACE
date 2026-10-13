import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, CheckSquare, Settings, LogOut, Users } from 'lucide-react';

const PaceAdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { path: '/pace/admin', icon: LayoutDashboard, label: 'Dashboard Utama' },
    { path: '/pace/admin/approval', icon: CheckSquare, label: 'Approval Sekolah' },
    { path: '/pace/admin/siswa', icon: Users, label: 'Data Semua Siswa' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col premium-shadow relative z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center text-white font-bold text-xl premium-shadow">
              P
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">Admin PACE</h1>
              <p className="text-[10px] text-brand-gold font-bold uppercase tracking-wider">Provinsi Papua</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-brand-gold text-white font-bold premium-shadow'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-brand-gold font-medium'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <div className="mb-4">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Super Admin</p>
            <p className="font-bold text-slate-900 truncate text-sm">
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium px-4 py-2 w-full hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PaceAdminLayout;
