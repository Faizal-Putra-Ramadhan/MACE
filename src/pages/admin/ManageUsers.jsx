import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { UserPlus, UserCircle, Shield, Loader2, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

const ROLE_LABELS = {
  admin: { label: 'Admin', color: 'bg-amber-50 border-amber-100 text-amber-600' },
  sekolah_pace: { label: 'Sekolah PACE', color: 'bg-blue-50 border-blue-100 text-blue-600' },
  siswa_pace: { label: 'Siswa PACE', color: 'bg-sky-50 border-sky-100 text-sky-600' },
  mace_kabkota: { label: 'MACE Kab/Kota', color: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
  mace_provinsi: { label: 'MACE Provinsi', color: 'bg-purple-50 border-purple-100 text-purple-600' },
  admin_pace: { label: 'Admin PACE', color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
  mahasiswa: { label: 'Mahasiswa', color: 'bg-slate-50 border-slate-100 text-slate-600' },
};

const FILTER_OPTIONS = [
  { value: '', label: 'Semua' },
  { value: 'sekolah_pace', label: 'Sekolah PACE' },
  { value: 'mace_kabkota', label: 'MACE Kab/Kota' },
  { value: 'mace_provinsi', label: 'MACE Provinsi' },
  { value: 'admin', label: 'Admin' },
  { value: 'mahasiswa', label: 'Mahasiswa' },
];

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = {};
        if (filterRole) params.role = filterRole;
        const res = await api.get('/admin/users', { params });
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [filterRole]);

  const getRoleInfo = (role) => ROLE_LABELS[role] || { label: role, color: 'bg-slate-50 border-slate-100 text-slate-600' };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h3>
        <Link
          to="/admin/create-account"
          className="gradient-blue text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:opacity-90 transition-opacity premium-shadow"
        >
          <UserPlus size={20} />
          <span>Buat Akun Baru</span>
        </Link>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 premium-shadow border border-slate-100 flex items-center gap-3 flex-wrap">
        <Filter size={18} className="text-slate-400" />
        <span className="text-sm font-bold text-slate-600">Filter:</span>
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilterRole(opt.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all',
              filterRole === opt.value
                ? 'bg-brand-blue text-white premium-shadow'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* User Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center"><Loader2 className="animate-spin inline" /></div>
        ) : users.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium">Tidak ada pengguna ditemukan.</div>
        ) : users.map(u => {
          const roleInfo = getRoleInfo(u.role);
          return (
            <div key={u.id} className="bg-white p-8 rounded-3xl premium-shadow border border-slate-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-brand-blue mb-4">
                <UserCircle size={40} />
              </div>
              <h4 className="font-bold text-slate-900 text-center">
                {u.nama_display || u.mahasiswa?.nama_lengkap || u.email?.split('@')[0] || 'User'}
              </h4>
              <p className="text-sm text-slate-500 mb-1">{u.email}</p>
              {u.pace_sekolah?.nama_sekolah && (
                <p className="text-xs text-brand-blue font-medium mb-3">{u.pace_sekolah.nama_sekolah}</p>
              )}
              
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <div className={cn('flex items-center space-x-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest', roleInfo.color)}>
                  <Shield size={12} />
                  <span>{roleInfo.label}</span>
                </div>
                {u.pace_type && (
                  <div className="flex items-center space-x-2 bg-gold-50 border border-gold-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-amber-600">
                    <span>{u.pace_type}</span>
                  </div>
                )}
                {u.mace_type && (
                  <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                    <span>{u.mace_type === 'kabkota' ? 'Kab/Kota' : 'Provinsi'}</span>
                  </div>
                )}
                {u.role === 'mahasiswa' && (
                  <div className={cn(
                    'flex items-center space-x-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest',
                    u.is_approved ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                  )}>
                    <span>{u.is_approved ? 'Disetujui' : 'Menunggu'}</span>
                  </div>
                )}
              </div>

              {u.role === 'mahasiswa' && !u.is_approved && (
                <button 
                  onClick={async () => {
                    if (confirm(`Setujui akun ${u.mahasiswa?.nama_lengkap || u.email}?`)) {
                      try {
                        await api.put('/admin/users/approve', { id: u.id });
                        setUsers(prev => prev.map(x => x.id === u.id ? { ...x, is_approved: true } : x));
                      } catch {
                        alert('Gagal menyetujui user');
                      }
                    }
                  }}
                  className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Setujui Akun
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageUsers;
