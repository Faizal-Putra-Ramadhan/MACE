import React, { useState, useEffect } from 'react';
import { Search, CreditCard, Download, FileText, Eye, Check, X } from 'lucide-react';
import api from '../../../api/axios';
import PaceCard from '../../../components/pace/PaceCard';

const AdminPaceSiswa = () => {
  const [search, setSearch] = useState('');
  const [showDetail, setShowDetail] = useState(null);
  const [showCard, setShowCard] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/pace/siswa');
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setError('Gagal memuat data siswa');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/pace/siswa/${id}/status`, { status: 'approved' });
      setStudents(students.map(s => s.id === id ? { ...s, status_approval: 'approved' } : s));
    } catch (err) {
      console.error('Failed to approve:', err);
      alert('Gagal menyetujui pendaftaran siswa');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/pace/siswa/${id}/status`, { status: 'rejected' });
      setStudents(students.map(s => s.id === id ? { ...s, status_approval: 'rejected' } : s));
    } catch (err) {
      console.error('Failed to reject:', err);
      alert('Gagal menolak pendaftaran siswa');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Disetujui</span>;
    if (status === 'rejected') return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Ditolak</span>;
    return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">Menunggu</span>;
  };

  const detailStudent = showDetail ? students.find(s => s.id === showDetail) : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Data Semua Siswa</h2>
          <p className="text-slate-500 mt-1">Pantau, tinjau berkas, dan kelola data seluruh siswa PACE se-Provinsi Papua.</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl font-bold flex items-center gap-2 premium-shadow transition-colors">
          <Download size={18} />
          Ekspor Data
        </button>
      </div>

      <div className="bg-white rounded-3xl premium-shadow border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama, NISN, atau sekolah..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-brand-gold rounded-xl py-2 pl-10 pr-4 outline-none text-sm transition-colors"
            />
          </div>
          <div className="text-sm font-medium text-slate-500">
            Total: <span className="text-brand-gold font-bold">{students.length} Siswa</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="px-6 py-4 font-bold">NISN</th>
                <th className="px-6 py-4 font-bold">NAMA SISWA</th>
                <th className="px-6 py-4 font-bold">ASAL SEKOLAH</th>
                <th className="px-6 py-4 font-bold">BERKAS</th>
                <th className="px-6 py-4 font-bold">STATUS</th>
                <th className="px-6 py-4 font-bold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">Memuat data siswa...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-red-500">{error}</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">Belum ada data pendaftaran siswa.</td>
                </tr>
              ) : students.filter(s => 
                s.nama?.toLowerCase().includes(search.toLowerCase()) || 
                (s.pace_sekolah?.nama_sekolah || s.PaceSekolah?.nama_sekolah)?.toLowerCase().includes(search.toLowerCase()) ||
                s.nisn?.includes(search)
              ).map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{student.nisn}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{student.nama}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{student.pace_sekolah?.nama_sekolah || student.PaceSekolah?.nama_sekolah || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      {student.file_rapor ? (
                        <a href={student.file_rapor?.startsWith('http') ? student.file_rapor : '#'} onClick={(e) => { if (!student.file_rapor?.startsWith('http')) { e.preventDefault(); alert('File ini belum diunggah menggunakan format Supabase terbaru.'); } }} target={student.file_rapor?.startsWith('http') ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-1 text-brand-blue hover:underline text-xs font-bold">
                          <FileText size={14} /> Rapor
                        </a>
                      ) : (
                        <span className="text-red-400 text-xs flex items-center gap-1"><X size={12} /> Rapor</span>
                      )}
                      {student.file_sktm ? (
                        <a href={student.file_sktm?.startsWith('http') ? student.file_sktm : '#'} onClick={(e) => { if (!student.file_sktm?.startsWith('http')) { e.preventDefault(); alert('File ini belum diunggah menggunakan format Supabase terbaru.'); } }} target={student.file_sktm?.startsWith('http') ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-1 text-brand-blue hover:underline text-xs font-bold">
                          <FileText size={14} /> SKTM
                        </a>
                      ) : (
                        <span className="text-red-400 text-xs flex items-center gap-1"><X size={12} /> SKTM</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(student.status_approval)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setShowDetail(student.id)} 
                        className="p-2 text-slate-500 hover:text-brand-blue hover:bg-slate-100 rounded-lg transition-colors" 
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                      {student.status_approval === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(student.id)} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Setujui">
                            <Check size={18} />
                          </button>
                          <button onClick={() => handleReject(student.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Tolak">
                            <X size={18} />
                          </button>
                        </>
                      )}
                      <button onClick={() => setShowCard(student)} className="p-2 text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors" title="Lihat Kartu" disabled={student.status_approval !== 'approved'}>
                        <CreditCard size={18} className={student.status_approval !== 'approved' ? 'opacity-30' : ''} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detailStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl premium-shadow w-full max-w-xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Detail Siswa</h3>
              <button onClick={() => setShowDetail(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-slate-400 font-medium">Nama Lengkap</p><p className="font-bold text-slate-900">{detailStudent.nama}</p></div>
                <div><p className="text-slate-400 font-medium">NISN</p><p className="font-bold text-slate-900">{detailStudent.nisn}</p></div>
                <div><p className="text-slate-400 font-medium">NIK</p><p className="font-bold text-slate-900">{detailStudent.nik}</p></div>
                <div><p className="text-slate-400 font-medium">Kelas</p><p className="font-bold text-slate-900">{detailStudent.kelas}</p></div>
                <div><p className="text-slate-400 font-medium">Tempat/Tgl Lahir</p><p className="font-bold text-slate-900">{detailStudent.tempat_lahir}, {detailStudent.tanggal_lahir}</p></div>
                <div><p className="text-slate-400 font-medium">Asal Sekolah</p><p className="font-bold text-slate-900">{detailStudent.pace_sekolah?.nama_sekolah || detailStudent.PaceSekolah?.nama_sekolah || '-'}</p></div>
                <div className="col-span-2"><p className="text-slate-400 font-medium">Alamat</p><p className="font-bold text-slate-900">{detailStudent.alamat}</p></div>
                <div><p className="text-slate-400 font-medium">Orang Tua/Wali</p><p className="font-bold text-slate-900">{detailStudent.nama_orang_tua || detailStudent.nama_ortu}</p></div>
                <div><p className="text-slate-400 font-medium">No. HP Ortu/Wali</p><p className="font-bold text-slate-900">{detailStudent.no_hp_orang_tua || detailStudent.no_hp_ortu}</p></div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-700 mb-3">Berkas Pendaftaran</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-xl border ${detailStudent.file_rapor ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                    <p className="text-xs font-bold mb-1">{detailStudent.file_rapor ? '✅' : '❌'} Nilai Rapor Terakhir</p>
                    {detailStudent.file_rapor ? (
                      <a href={detailStudent.file_rapor?.startsWith('http') ? detailStudent.file_rapor : '#'} onClick={(e) => { if (!detailStudent.file_rapor?.startsWith('http')) { e.preventDefault(); alert('File ini belum diunggah menggunakan format Supabase terbaru.'); } }} target={detailStudent.file_rapor?.startsWith('http') ? "_blank" : undefined} rel="noreferrer" className="text-xs text-brand-blue font-bold hover:underline flex items-center gap-1"><Eye size={12} /> Lihat Berkas</a>
                    ) : (
                      <p className="text-xs text-red-500">Belum diunggah</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl border ${detailStudent.file_sktm ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                    <p className="text-xs font-bold mb-1">{detailStudent.file_sktm ? '✅' : '❌'} SKTM</p>
                    {detailStudent.file_sktm ? (
                      <a href={detailStudent.file_sktm?.startsWith('http') ? detailStudent.file_sktm : '#'} onClick={(e) => { if (!detailStudent.file_sktm?.startsWith('http')) { e.preventDefault(); alert('File ini belum diunggah menggunakan format Supabase terbaru.'); } }} target={detailStudent.file_sktm?.startsWith('http') ? "_blank" : undefined} rel="noreferrer" className="text-xs text-brand-blue font-bold hover:underline flex items-center gap-1"><Eye size={12} /> Lihat Berkas</a>
                    ) : (
                      <p className="text-xs text-red-500">Belum diunggah</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Status Saat Ini</p>
                  {getStatusBadge(detailStudent.status_approval)}
                </div>
                {detailStudent.status_approval === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => { handleApprove(detailStudent.id); setShowDetail(null); }} className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors flex items-center gap-1"><Check size={16} /> Setujui</button>
                    <button onClick={() => { handleReject(detailStudent.id); setShowDetail(null); }} className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors flex items-center gap-1"><X size={16} /> Tolak</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kartu Digital */}
      {showCard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative flex flex-col items-center">
            <button onClick={() => setShowCard(null)} className="absolute -top-12 right-0 text-white hover:text-slate-200 text-xl font-bold bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center transition-colors">✕</button>
            <div className="transform scale-75 sm:scale-100 origin-center transition-transform">
              <PaceCard student={showCard} school={showCard.PaceSekolah} />
            </div>
            <p className="text-white/70 mt-6 text-sm font-medium">Ini adalah wujud Kartu Digital yang akan dilihat oleh siswa.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaceSiswa;
