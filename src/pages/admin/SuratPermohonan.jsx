import React, { useState, useEffect } from 'react';
import { FileCheck, Check, X, Loader2, ExternalLink, Eye } from 'lucide-react';
import api from '../../api/axios';

const SuratPermohonanAdmin = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/superadmin/surat-permohonan');
        setLetters(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch surat permohonan', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    if (!confirm('Setujui surat permohonan ini?')) return;
    try {
      await api.put(`/superadmin/surat-permohonan/${id}`, { status: 'approved' });
      setLetters(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyetujui');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Tolak surat permohonan ini?')) return;
    try {
      await api.put(`/superadmin/surat-permohonan/${id}`, { status: 'rejected' });
      setLetters(prev => prev.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menolak');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Disetujui</span>;
    if (status === 'rejected') return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Ditolak</span>;
    return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">Menunggu</span>;
  };

  const getRoleBadge = (user) => {
    if (!user) return null;
    if (user.role === 'sekolah_pace') {
      return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">PACE {user.pace_type || ''}</span>;
    }
    if (user.role === 'mace_kabkota') {
      return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">MACE {user.nama_display || 'Kab/Kota'}</span>;
    }
    if (user.role === 'mace_provinsi') {
      return <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">MACE Provinsi</span>;
    }
    return <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">{user.role}</span>;
  };

  const filtered = letters.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const pendingCount = letters.filter(s => s.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <FileCheck className="text-brand-blue" />
          Surat Permohonan
          {pendingCount > 0 && (
            <span className="bg-amber-500 text-white text-sm px-3 py-0.5 rounded-full font-bold">{pendingCount} menunggu</span>
          )}
        </h2>
        <p className="text-slate-500 mt-1">Tinjau dan setujui surat permohonan dari operator MACE & PACE.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'Semua' },
          { value: 'pending', label: 'Menunggu' },
          { value: 'approved', label: 'Disetujui' },
          { value: 'rejected', label: 'Ditolak' },
        ].map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === opt.value
                ? 'bg-brand-blue text-white premium-shadow'
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Memuat data...</div>
      ) : (
        <div className="bg-white rounded-3xl premium-shadow border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <th className="px-6 py-4 font-bold">OPERATOR</th>
                  <th className="px-6 py-4 font-bold">ROLE</th>
                  <th className="px-6 py-4 font-bold">SEKOLAH / WILAYAH</th>
                  <th className="px-6 py-4 font-bold">FILE</th>
                  <th className="px-6 py-4 font-bold">TANGGAL</th>
                  <th className="px-6 py-4 font-bold">STATUS</th>
                  <th className="px-6 py-4 font-bold text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{s.user?.nama_display || s.user?.email || '-'}</p>
                      <p className="text-xs text-slate-400">{s.user?.email || ''}</p>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(s.user)}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {s.user?.pace_sekolah?.nama_sekolah || s.user?.nama_display || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {s.file_url && (s.file_url.startsWith('http') || s.file_url.startsWith('/')) ? (
                        <a href={s.file_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-brand-blue hover:text-brand-blue/80 font-medium text-xs">
                          <ExternalLink size={14} /> Lihat File
                        </a>
                      ) : (
                        <span className="text-red-400 text-xs italic">File tidak valid</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {s.created_at ? new Date(s.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(s.status)}</td>
                    <td className="px-6 py-4 text-right">
                      {s.status === 'pending' && (
                        <div className="flex justify-end items-center gap-2">
                          <button onClick={() => handleApprove(s.id)} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Setujui">
                            <Check size={16} />
                          </button>
                          <button onClick={() => handleReject(s.id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Tolak">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-400">Belum ada surat permohonan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuratPermohonanAdmin;
