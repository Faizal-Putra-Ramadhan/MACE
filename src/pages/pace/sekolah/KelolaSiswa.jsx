import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Printer, CreditCard, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axios';
import { uploadDokumen } from '../../../lib/upload';
import PaceCard from '../../../components/pace/PaceCard';

const KelolaSiswa = () => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCard, setShowCard] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [editMessage, setEditMessage] = useState('');
  
  const emptyForm = { nama: '', nisn: '', nik: '', tempat_lahir: '', tanggal_lahir: '', kelas: '', alamat: '', nama_orang_tua: '', no_hp_orang_tua: '', file_rapor: null, file_prestasi_non_akademik: null, biaya_lain_lain: '', spp_per_semester: '', komite_per_semester: '' };
  const [form, setForm] = useState({ ...emptyForm });
  const [editForm, setEditForm] = useState({ ...emptyForm });

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  const openEditModal = (student) => {
    setEditForm({
      nama: student.nama || '', nisn: student.nisn || '', nik: student.nik || '',
      tempat_lahir: student.tempat_lahir || '', tanggal_lahir: student.tanggal_lahir || '',
      kelas: student.kelas || '', alamat: student.alamat || '',
      nama_orang_tua: student.nama_orang_tua || '', no_hp_orang_tua: student.no_hp_orang_tua || '',
      file_rapor: null, file_sktm: null,
    });
    setEditStudent(student);
    setEditMessage('');
  };

  const handleEditSubmit = async () => {
    setSubmitting(true);
    setEditMessage('Menyimpan perubahan...');
    try {
      let payload = {
        nama: editForm.nama, nisn: editForm.nisn, nik: editForm.nik,
        tempat_lahir: editForm.tempat_lahir, tanggal_lahir: editForm.tanggal_lahir,
        kelas: editForm.kelas, alamat: editForm.alamat,
        nama_orang_tua: editForm.nama_orang_tua, no_hp_orang_tua: editForm.no_hp_orang_tua,
      };
      if (editForm.file_rapor instanceof File) {
        setEditMessage('Mengunggah Rapor baru...');
        payload.file_rapor = await uploadDokumen(editForm.file_rapor, 'dokumen-pendaftaran');
      }
      if (editForm.file_sktm instanceof File) {
        setEditMessage('Mengunggah SKTM baru...');
        payload.file_sktm = await uploadDokumen(editForm.file_sktm, 'dokumen-pendaftaran');
      }
      await api.put(`/pace/siswa/${editStudent.id}`, payload);
      setEditStudent(null);
      fetchStudents();
    } catch (err) {
      setEditMessage(err.response?.data?.message || 'Gagal menyimpan perubahan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/pace/siswa/${id}`);
      setDeleteConfirm(null);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus siswa.');
    }
  };

  const handleSubmit = async () => {
    if (!form.nama || !form.nisn || !form.nik || !form.tempat_lahir || !form.tanggal_lahir || !form.kelas || !form.alamat || !form.nama_orang_tua || !form.no_hp_orang_tua) {
      setMessage('Semua field data pribadi harus diisi.');
      return;
    }
    if (!form.file_rapor) {
      setMessage('Mohon unggah Rapor Semester Terakhir.');
      return;
    }

    setSubmitting(true);
    setMessage('Mengunggah berkas...');
    try {
      let urlRapor = null;
      let urlPrestasiNonAkademik = null;

      if (form.file_rapor) {
        urlRapor = await uploadDokumen(form.file_rapor, 'dokumen-pendaftaran');
      }
      if (form.file_prestasi_non_akademik) {
        urlPrestasiNonAkademik = await uploadDokumen(form.file_prestasi_non_akademik, 'dokumen-pendaftaran');
      }
      
      setMessage('Menyimpan data siswa...');

      const res = await api.post('/pace/siswa', {
        nama: form.nama,
        nisn: form.nisn,
        nik: form.nik,
        tempat_lahir: form.tempat_lahir,
        tanggal_lahir: form.tanggal_lahir,
        kelas: form.kelas,
        alamat: form.alamat,
        nama_orang_tua: form.nama_orang_tua,
        no_hp_orang_tua: form.no_hp_orang_tua,
        file_rapor: urlRapor,
        file_prestasi_akademik: urlRapor,
        file_prestasi_non_akademik: urlPrestasiNonAkademik,
        biaya_lain_lain: form.biaya_lain_lain ? Number(form.biaya_lain_lain) : null,
        spp_per_semester: form.spp_per_semester ? Number(form.spp_per_semester) : null,
        komite_per_semester: form.komite_per_semester ? Number(form.komite_per_semester) : null,
      });
      
      setMessage('');
      setForm({ ...emptyForm });
      setShowAddModal(false);
      fetchStudents(); // Refresh list
    } catch (err) {
      setMessage(err.response?.data?.message || 'Terjadi kesalahan jaringan.');
    } finally {
      setSubmitting(false);
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
            onClick={() => { setShowAddModal(true); setMessage(''); }}
            className="gradient-blue text-white hover:opacity-90 px-4 py-2 rounded-xl font-bold flex items-center gap-2 premium-shadow transition-all"
          >
            <Plus size={18} />
            Tambah Siswa
          </button>
        </div>
      </div>

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
                <th className="px-6 py-4 font-bold">BERKAS</th>
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
                  <td className="px-6 py-4">
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
                  </td>
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
                      <button onClick={() => openEditModal(student)} className="p-2 text-slate-400 hover:text-brand-blue hover:bg-slate-100 rounded-lg transition-colors" title="Edit Data">
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

      {/* Modal Tambah Siswa */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl premium-shadow w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Tambah Data Siswa</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {message && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100 mb-4">
                  {message}
                </div>
              )}

              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Data Pribadi Siswa</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input type="text" name="nama" value={form.nama} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">NISN <span className="text-red-500">*</span></label>
                  <input type="text" name="nisn" value={form.nisn} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">NIK <span className="text-red-500">*</span></label>
                  <input type="text" name="nik" value={form.nik} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tempat Lahir <span className="text-red-500">*</span></label>
                  <input type="text" name="tempat_lahir" value={form.tempat_lahir} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Lahir <span className="text-red-500">*</span></label>
                  <input type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kelas <span className="text-red-500">*</span></label>
                  <input type="text" name="kelas" value={form.kelas} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nama Orang Tua/Wali <span className="text-red-500">*</span></label>
                  <input type="text" name="nama_orang_tua" value={form.nama_orang_tua} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Lengkap <span className="text-red-500">*</span></label>
                  <textarea rows="2" name="alamat" value={form.alamat} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">No. HP Orang Tua/Wali <span className="text-red-500">*</span></label>
                  <input type="text" name="no_hp_orang_tua" value={form.no_hp_orang_tua} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" />
                </div>
              </div>

              {/* Upload Berkas */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Upload Berkas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Prestasi Akademik (Rapor Semester Terakhir) <span className="text-red-500">*</span></label>
                    <div onClick={() => document.getElementById('upload-rapor').click()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${form.file_rapor ? 'border-emerald-300 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-brand-blue hover:bg-brand-blue/5'}`}>
                      <input type="file" id="upload-rapor" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'file_rapor')} />
                      {form.file_rapor ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="text-emerald-500" size={20} />
                          <span className="text-sm font-medium text-emerald-700 truncate">{form.file_rapor.name}</span>
                        </div>
                      ) : (
                        <div><Upload className="text-slate-400 mx-auto mb-2" size={24} /><p className="text-sm text-slate-500 font-medium">Klik untuk unggah</p><p className="text-xs text-slate-400">PDF, JPG, PNG</p></div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Prestasi Non-Akademik (Sertifikat) <span className="text-xs text-slate-400">(Opsional)</span></label>
                    <div onClick={() => document.getElementById('upload-prestasi').click()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${form.file_prestasi_non_akademik ? 'border-emerald-300 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-brand-blue hover:bg-brand-blue/5'}`}>
                      <input type="file" id="upload-prestasi" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'file_prestasi_non_akademik')} />
                      {form.file_prestasi_non_akademik ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="text-emerald-500" size={20} />
                          <span className="text-sm font-medium text-emerald-700 truncate">{form.file_prestasi_non_akademik.name}</span>
                        </div>
                      ) : (
                        <div><Upload className="text-slate-400 mx-auto mb-2" size={24} /><p className="text-sm text-slate-500 font-medium">Klik untuk unggah</p><p className="text-xs text-slate-400">PDF, JPG, PNG</p></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Usulan Anggaran */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Usulan Anggaran</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Biaya Lain-lain <span className="text-xs text-slate-400">(Admin, Lab, Kesehatan)</span></label>
                    <input type="number" name="biaya_lain_lain" value={form.biaya_lain_lain} onChange={handleFormChange} placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">SPP Per Semester</label>
                    <input type="number" name="spp_per_semester" value={form.spp_per_semester} onChange={handleFormChange} placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Komite Per Semester</label>
                    <input type="number" name="komite_per_semester" value={form.komite_per_semester} onChange={handleFormChange} placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">Batal</button>
              <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2 rounded-xl font-bold bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors disabled:opacity-70">
                {submitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
              </button>
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
              <PaceCard student={showCard} school={user?.PaceSekolah} />
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Siswa */}
      {editStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl premium-shadow w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Edit Data Siswa</h3>
              <button onClick={() => setEditStudent(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="p-6 overflow-y-auto">
              {editMessage && <div className="bg-amber-50 text-amber-700 px-4 py-3 rounded-xl text-sm font-medium border border-amber-100 mb-4">{editMessage}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                  <input type="text" name="nama" value={editForm.nama} onChange={handleEditFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" />
                </div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">NISN</label><input type="text" name="nisn" value={editForm.nisn} onChange={handleEditFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">NIK</label><input type="text" name="nik" value={editForm.nik} onChange={handleEditFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Tempat Lahir</label><input type="text" name="tempat_lahir" value={editForm.tempat_lahir} onChange={handleEditFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Lahir</label><input type="date" name="tanggal_lahir" value={editForm.tanggal_lahir} onChange={handleEditFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Kelas</label><input type="text" name="kelas" value={editForm.kelas} onChange={handleEditFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Nama Orang Tua/Wali</label><input type="text" name="nama_orang_tua" value={editForm.nama_orang_tua} onChange={handleEditFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" /></div>
                <div className="md:col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Alamat</label><textarea rows="2" name="alamat" value={editForm.alamat} onChange={handleEditFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue resize-none"></textarea></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">No. HP Orang Tua</label><input type="text" name="no_hp_orang_tua" value={editForm.no_hp_orang_tua} onChange={handleEditFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue" /></div>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Ganti Berkas (Opsional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Rapor {editStudent.file_rapor && <span className="text-emerald-500 text-xs">(sudah ada)</span>}</label>
                    <div onClick={() => document.getElementById('edit-rapor').click()} className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${editForm.file_rapor ? 'border-emerald-300 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-brand-blue'}`}>
                      <input type="file" id="edit-rapor" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleEditFileChange(e, 'file_rapor')} />
                      {editForm.file_rapor ? <span className="text-sm text-emerald-700 font-medium">{editForm.file_rapor.name}</span> : <span className="text-sm text-slate-400">Klik untuk ganti</span>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">SKTM {editStudent.file_sktm && <span className="text-emerald-500 text-xs">(sudah ada)</span>}</label>
                    <div onClick={() => document.getElementById('edit-sktm').click()} className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${editForm.file_sktm ? 'border-emerald-300 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-brand-blue'}`}>
                      <input type="file" id="edit-sktm" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleEditFileChange(e, 'file_sktm')} />
                      {editForm.file_sktm ? <span className="text-sm text-emerald-700 font-medium">{editForm.file_sktm.name}</span> : <span className="text-sm text-slate-400">Klik untuk ganti</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setEditStudent(null)} className="px-6 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">Batal</button>
              <button onClick={handleEditSubmit} disabled={submitting} className="px-6 py-2 rounded-xl font-bold bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors disabled:opacity-70">{submitting ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
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
