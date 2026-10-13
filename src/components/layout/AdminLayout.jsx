import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FileCheck, Users, ClipboardList, BarChart3, LogOut, Settings, Menu, X, Building2, Award, Shield, GraduationCap, School, FileText, ScrollText } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuSections = [
    {
      title: 'MACE',
      items: [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Surat Permohonan', path: '/admin/surat-permohonan', icon: FileText },
        { name: 'MACE Approval', path: '/admin/mace-approval', icon: GraduationCap },
        { name: 'MACE Daftar Lolos', path: '/admin/mace-daftar-lolos', icon: Award },
      ]
    },
    {
      title: 'PACE',
      items: [
        { name: 'PACE Approval', path: '/admin/pace-approval', icon: School },
        { name: 'PACE Daftar Lolos', path: '/admin/pace-daftar-lolos', icon: Award },
      ]
    },
    {
      title: 'Sistem',
      items: [
        { name: 'SK Gubernur', path: '/admin/sk-gubernur', icon: ScrollText },
        { name: 'Buat Akun', path: '/admin/create-account', icon: Users },
        { name: 'Manajemen User', path: '/admin/users', icon: Settings },
        { name: 'Pengaturan Akses', path: '/admin/pengaturan-akses', icon: Shield },
      ]
    }
  ];

  const allItems = menuSections.flatMap(s => s.items);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex bg-slate-50 admin-body">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-admin-sidebar text-white flex flex-col fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center font-bold text-admin-sidebar text-xl shadow-lg">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">ADMIN PANEL</h1>
              <p className="text-[10px] uppercase tracking-widest text-brand-gold/80 font-medium">MACE & PACE</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-xl text-white/60"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-6 overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3 px-4">{section.title}</p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                        isActive 
                          ? "bg-white/10 text-brand-gold border-l-4 border-brand-gold rounded-l-none -ml-6 pl-10" 
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <item.icon size={20} className={isActive ? "text-brand-gold" : "text-white/40 group-hover:text-white"} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Keluar Panel</span>
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-72 transition-all duration-300">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-600"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg lg:text-xl font-bold text-slate-800 line-clamp-1">
              {allItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="hidden sm:block text-right mr-2 lg:mr-4">
              <p className="text-sm font-bold text-slate-900">Administrator</p>
              <p className="text-xs text-slate-500 line-clamp-1">{user?.email}</p>
            </div>
            <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold shadow-md">
              ADM
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-10 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
