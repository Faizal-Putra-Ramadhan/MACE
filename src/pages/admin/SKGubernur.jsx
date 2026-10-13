import React, { useState, useEffect } from 'react';
import { Upload, Download, FileText, Loader2, Trash2, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import { uploadDokumen } from '../../lib/upload';

const KATEGORI_LIST = [
  { id: 'mace_kabkota', label: 'MACE Kab/Kota', color: 'blue' },
  { id: 'mace_provinsi', label: 'MACE Provinsi', color: 'blue' },
  { id: 'pace_slb', label: 'PACE SLB', color: 'gold' },
  { id: 'pace_snk', label: 'PACE SNK', color: 'gold' },
  { id: 'pace_atlit', label: 'PACE Atlit Berprestasi', color: 'gold' },
];

const AdminSKGubernur = () => {
  const [skList, setSkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/sk-gubernur');
      setSkList(res.data);
    } catch (err) {
      console.error('Failed to fetch SK list', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (kategori) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(kategori);
      try {
        const fileUrl = await uploadDokumen(file, 'dokumen-pendaftaran');
        await api.post('/admin/sk-gubernur', { kategori, file_url: fileUrl });
        alert('SK Gubernur berhasil diupload');
        fetchData();
      } catch (err) {
        console.error('Upload failed', err);
        alert('Gagal upload SK Gubernur: ' + (err.response?.data?.message || err.message));
      } finally {
        setUploading(null);
      }
    };
    input.click();
  };

  const handleDelete = async (kategori) => {
    if (!confirm(`Hapus SK Gubernur untuk ${kategori}?`)) return;
    try {
      await api.delete(`/admin/sk-gubernur?kategori=${kategori}`);
      fetchData();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const getSK = (kategori) => skList.find(s => s.kategori === kategori);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">SK Gubernur</h1>
          <p className="text-slate-500 mt-1">Upload SK Gubernur untuk setiap kategori penerima bantuan</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 flex items-center justify-center gap-2">
          <Loader2 className="animate-spin" /> Memuat...
        </div>
      ) : (
        <div className="grid gap-4">
          {KATEGORI_LIST.map(kat => {
            const sk = getSK(kat.id);
            const isUploading = uploading === kat.id;
            return (
              <div key={kat.id} className="bg-white rounded-2xl border border-slate-100 premium-shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    kat.color === 'blue' ? 'bg-brand-blue/10 text-brand-blue' : 'bg-brand-gold/10 text-brand-gold'
                  }`}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{kat.label}</h3>
                    {sk ? (
                      <a
                        href={sk.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-blue hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Download size={12} />
                        Lihat File
                      </a>
                    ) : (
                      <p className="text-xs text-slate-400 mt-0.5">Belum ada SK</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpload(kat.id)}
                    disabled={isUploading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${
                      sk
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : kat.color === 'blue'
                          ? 'bg-brand-blue text-white hover:opacity-90'
                          : 'bg-brand-gold text-white hover:opacity-90'
                    }`}
                  >
                    {isUploading ? (
                      <><Loader2 size={14} className="animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload size={14} /> {sk ? 'Ganti SK' : 'Upload SK'}</>
                    )}
                  </button>
                  {sk && (
                    <button
                      onClick={() => handleDelete(kat.id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminSKGubernur;
