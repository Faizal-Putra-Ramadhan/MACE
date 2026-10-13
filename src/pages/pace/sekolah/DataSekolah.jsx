import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Building2, Save, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../../api/axios';

const DataSekolah = () => {
  const { isApproved } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    nama_sekolah: '',
    npsn: '',
    alamat: '',
    no_rekening: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/pace/sekolah');
        setForm({
          nama_sekolah: res.data.nama_sekolah || '',
          npsn: res.data.npsn || '',
          alamat: res.data.alamat || '',
          no_rekening: res.data.no_rekening || ''
        });
      } catch (err) {
        console.error('Failed to fetch school data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await api.put('/pace/sekolah', {
        npsn: form.npsn,
        alamat: form.alamat,
        no_rekening: form.no_rekening
      });
      setMessage('Data sekolah berhasil disimpan!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal menyimpan data sekolah.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Memuat data sekolah...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Building2 className="text-brand-gold" />
          Data Sekolah
        </h2>
        <p className="text-slate-500 mt-1">Lengkapi data sekolah untuk keperluan program PACE.</p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl border font-medium flex items-center gap-2 ${
          message.includes('berhasil') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          {message.includes('berhasil') ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message}
        </div>
      )}

      <div className="bg-white rounded-3xl p-8 premium-shadow border border-slate-100 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Sekolah</label>
            <input
              type="text"
              name="nama_sekolah"
              value={form.nama_sekolah}
              readOnly
              className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-xl py-3 px-4 outline-none font-medium text-emerald-700 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1">Nama sekolah ditentukan saat admin membuat akun.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">NPSN <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="npsn"
              value={form.npsn}
              onChange={handleChange}
              placeholder="Nomor Pokok Sekolah Nasional"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-gold rounded-xl py-3 px-4 outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Sekolah <span className="text-red-500">*</span></label>
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              rows="3"
              placeholder="Alamat lengkap sekolah"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-gold rounded-xl py-3 px-4 outline-none font-medium resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">No. Rekening Sekolah <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="no_rekening"
              value={form.no_rekening}
              onChange={handleChange}
              placeholder="Contoh: BRI - 0123456789 - Nama Sekolah"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-gold rounded-xl py-3 px-4 outline-none font-medium"
            />
          </div>

          <div className="border-t border-slate-100 pt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || !form.npsn || !form.alamat || !form.no_rekening}
              className="flex items-center gap-2 gradient-gold text-white px-8 py-3 rounded-xl font-bold transition-all hover:opacity-90 premium-shadow disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : (<><Save size={18} /> Simpan Data Sekolah</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSekolah;
