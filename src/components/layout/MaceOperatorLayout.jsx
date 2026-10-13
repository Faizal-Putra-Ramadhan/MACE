import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, Users, LayoutDashboard, LogOut, Megaphone, Award, FileText, Lock } from 'lucide-react';
import api from '../../api/axios';

const MaceOperatorLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [suratStatus, setSuratStatus] = useState(null); // null = loading, 'none', 'pending', 'approved', 'rejected'
  const [aksesInfo, setAksesInfo] = useState({ edit_surat_permohonan: true, edit_data_sekolah: true, edit_siswa: true });

  useEffect(() => {
    const fetchSuratStatus = async () => {
      try {
        const res = await api.get('/surat-permohonan');
        if (res.data && res.data.status) {
          setSuratStatus(res.data.status);
        } else {
          setSuratStatus('none');
        }
      } catch {
        setSuratStatus('none');
      }
    };
    fetchSuratStatus();
  }, []);

  useEffect(() => {
    const fetchAkses = async () => {
      try {
        const scope = user?.role === 'mace_provinsi' ? 'mace_provinsi' : 'mace_kabkota';
        const res = await api.get(`/superadmin/pengaturan-akses?scope=${scope}`);
        if (res.data) {
          setAksesInfo({
            edit_surat_permohonan: res.data.edit_surat_permohonan ?? true,
            edit_data_sekolah: res.data.edit_data_sekolah ?? true,
            edit_siswa: res.data.edit_siswa ?? true,
          });
        }
      } catch {
        // Keep defaults
      }
    };
    if (user) fetchAkses();
  }, [user]);

  const isApproved = suratStatus === 'approved';

  const handleLogout = () => {
    localStorage.removeItem('mace_kabkota');
    localStorage.removeItem('mace_program');
    logout();
  };

  const navItems = [
    { path: '/mace/operator', icon: LayoutDashboard, label: 'Dashboard', always: true },
    { path: '/mace/operator/lembaga', icon: Building2, label: 'Lembaga Pengusul', locked: !isApproved },
    { path: '/mace/operator/mahasiswa', icon: Users, label: 'Input Mahasiswa', locked: !isApproved || !aksesInfo.edit_siswa },
    { path: '/mace/operator/pengumuman', icon: Megaphone, label: 'Pengumuman', locked: !isApproved },
    { path: '/mace/operator/daftar-lolos', icon: Award, label: 'Daftar Lolos', locked: !isApproved },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col premium-shadow relative z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white font-bold text-xl premium-shadow">
              M
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">MACE Portal</h1>
              <p className="text-xs text-brand-blue font-bold">Operator</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isLocked = item.locked && !item.always;
              return (
                <div key={item.path} className="relative">
                  {isLocked ? (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 cursor-not-allowed">
                      <item.icon size={20} />
                      <span className="font-medium">{item.label}</span>
                      <Lock size={14} className="ml-auto" />
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-brand-blue text-white font-bold premium-shadow'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-brand-blue font-medium'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <div className="mb-4">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Login Sebagai</p>
            <p className="font-bold text-slate-900 truncate flex items-center gap-2">
              <Building2 size={16} className="text-brand-blue" />
              {user?.email}
            </p>
            {localStorage.getItem('mace_kabkota') && (
              <p className="text-xs text-brand-blue mt-1 font-medium">{localStorage.getItem('mace_kabkota')}</p>
            )}
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
          <Outlet context={{ suratStatus, setSuratStatus, isApproved, aksesInfo }} />
        </div>
      </main>
    </div>
  );
};

export default MaceOperatorLayout;
