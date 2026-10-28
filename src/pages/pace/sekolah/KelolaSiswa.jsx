import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Printer, CreditCard, CheckCircle} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axios';
import PaceCard from '../../../components/pace/PaceCard';

const KelolaSiswa = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCard, setShowCard] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const [students, setStudents] = useState([]);

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      const res = await api.get('/pace/siswa');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  // Notifikasi sukses setelah kembali dari halaman daftar/edit
  useEffect(() => {
    if (location.state?.registered) {
      setNotice('Pendaftaran siswa berhasil dikirim dan menunggu verifikasi.');
    } else if (location.state?.updated) {
      setNotice('Perubahan data siswa berhasil disimpan.');
    } else {
      return;
    }
    const t = setTimeout(() => setNotice(''), 6000);
    return () => clearTimeout(t);
  }, [location.state]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/pace/siswa/${id}`);
      setDeleteConfirm(null);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus siswa.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Kelola Daftar Siswa</h2>
          <p className="text-slate-500 mt-1">Daftarkan siswa-siswi yang akan diusulkan dalam program PACE.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl font-bold flex items-center gap-2 premium-shadow transition-colors">
            <Printer size={18} />
            Cetak Rekap
          </button>
          <button 
            onClick={() => navigate('/pace/sekolah/siswa/daftar')}
            className="gradient-blue text-white hover:opacity-90 px-4 py-2 rounded-xl font-bold flex items-center gap-2 premium-shadow transition-all"
          >
            <Plus size={18} />
            Tambah Siswa
          </button>
        </div>
      </div>

      {notice && (
        <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium border border-emerald-100 flex items-center gap-2">
          <CheckCircle size={18} /> {notice}
        </div>
      )}

      <div className="bg-white rounded-3xl premium-shadow border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama atau NISN..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue rounded-xl py-2 pl-10 pr-4 outline-none text-sm transition-colors"
            />
          </div>
          <div className="text-sm font-medium text-slate-500">
            Total: <span className="text-brand-blue font-bold">{students.length} Siswa</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Memuat data siswa...</div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="px-6 py-4 font-bold">NISN</th>
                <th className="px-6 py-4 font-bold">NAMA LENGKAP</th>
                <th className="px-6 py-4 font-bold">KELAS</th>
                {/* <th className="px-6 py-4 font-bold">BERKAS</th> */}
                <th className="px-6 py-4 font-bold">STATUS</th>
                <th className="px-6 py-4 font-bold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.filter(s => s.nama.toLowerCase().includes(search.toLowerCase()) || s.nisn.includes(search)).map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900">{student.nisn}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{student.nama}</td>
                  <td className="px-6 py-4 text-slate-500">{student.kelas}</td>
                  {/* <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs">
                        {student.file_rapor ? (
                          <><CheckCircle size={14} className="text-emerald-500" /><span className="text-slate-600">Rapor</span></>
                        ) : (
                          <><AlertCircle size={14} className="text-red-400" /><span className="text-red-400">Rapor</span></>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        {student.file_sktm ? (
                          <><CheckCircle size={14} className="text-emerald-500" /><span className="text-slate-600">SKTM</span></>
                        ) : (
                          <><AlertCircle size={14} className="text-red-400" /><span className="text-red-400">SKTM</span></>
                        )}
                      </div>
                    </div>
                  </td> */}
                  <td className="px-6 py-4">
                    {student.status_approval === 'approved' ? (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Disetujui</span>
                    ) : student.status_approval === 'rejected' ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Ditolak</span>
                    ) : (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">Menunggu</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setShowCard(student)} disabled={student.status_approval !== 'approved'} className="p-2 text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors" title="Lihat Kartu">
                        <CreditCard size={18} className={student.status_approval !== 'approved' ? 'opacity-30' : ''} />
                      </button>
                      <button onClick={() => navigate(`/pace/sekolah/siswa/${student.id}/edit`)} className="p-2 text-slate-400 hover:text-brand-blue hover:bg-slate-100 rounded-lg transition-colors" title="Edit Data">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setDeleteConfirm(student)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Data">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    Belum ada data siswa yang ditambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Modal Kartu Digital */}
      {showCard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative flex flex-col items-center">
            <button onClick={() => setShowCard(null)} className="absolute -top-12 right-0 text-white hover:text-slate-200 text-xl font-bold bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center transition-colors">✕</button>
            <div className="transform scale-75 sm:scale-100 origin-center transition-transform">
              <PaceCard student={showCard} school={user?.PaceSekolah} />
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl premium-shadow w-full max-w-md p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="text-red-500" size={28} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Data Siswa?</h3>
            <p className="text-slate-500 mb-6">Anda yakin ingin menghapus data <span className="font-bold text-slate-900">{deleteConfirm.nama}</span>? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirm(null)} className="px-6 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="px-6 py-2 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaSiswa;
