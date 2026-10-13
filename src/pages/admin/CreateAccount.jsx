import React, { useState } from 'react';
import { UserPlus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const KABUPATEN_LIST = [
  { id: 'kota_jayapura', name: 'Kota Jayapura' },
  { id: 'kab_jayapura', name: 'Kabupaten Jayapura' },
  { id: 'kab_yapen', name: 'Kabupaten Kepulauan Yapen' },
  { id: 'kab_biak', name: 'Kabupaten Biak Numfor' },
  { id: 'kab_sarmi', name: 'Kabupaten Sarmi' },
  { id: 'kab_keerom', name: 'Kabupaten Keerom' },
  { id: 'kab_supiori', name: 'Kabupaten Supiori' },
  { id: 'kab_mamberamo', name: 'Kabupaten Mamberamo Raya' },
  { id: 'kab_waropen', name: 'Kabupaten Waropen' },
];

const ROLE_OPTIONS = [
  { id: 'mace_kabkota', label: 'MACE Kab/Kota', desc: 'Operator Kabupaten/Kota untuk program MACE', mace_type: 'kabkota', role: 'mace_kabkota' },
  { id: 'mace_provinsi', label: 'MACE Provinsi', desc: 'Operator Provinsi untuk program MACE', mace_type: 'provinsi', role: 'mace_provinsi' },
  { id: 'pace_slb', label: 'PACE SLB', desc: 'Sekolah Luar Biasa untuk program PACE', pace_type: 'SLB', role: 'pace_slb' },
  { id: 'pace_snk', label: 'PACE SNK', desc: 'Sekolah Kekhususan untuk program PACE', pace_type: 'SNK', role: 'pace_snk' },
  { id: 'pace_atlit', label: 'PACE Atlit Berprestasi', desc: 'Siswa Atlit Berprestasi untuk program PACE', pace_type: 'Siswa Atlit Berprestasi', role: 'pace_atlit' },
];

const CreateAccount = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', nama_display: '', nama_sekolah: '', wilayah: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      setMessage('Pilih jenis akun terlebih dahulu.');
      return;
    }
    if (!form.email || !form.password) {
      setMessage('Email dan password wajib diisi.');
      return;
    }

    const isPace = selectedRole.id.startsWith('pace_');
    const isMaceKabkota = selectedRole.id === 'mace_kabkota';
    if (isPace && !form.nama_sekolah) {
      setMessage('Nama sekolah wajib diisi untuk akun PACE.');
      return;
    }
    if (isMaceKabkota && !form.wilayah) {
      setMessage('Pilih Kabupaten/Kota untuk operator MACE Kab/Kota.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const payload = {
        email: form.email,
        password: form.password,
        role: selectedRole.role,
        nama_display: form.nama_display || null,
      };

      if (isPace) {
        payload.pace_type = selectedRole.pace_type;
        payload.nama_sekolah = form.nama_sekolah;
      } else {
        payload.mace_type = selectedRole.mace_type;
        if (isMaceKabkota) {
          payload.nama_display = form.wilayah;
        }
      }

      await api.post('/admin/users/create', payload);
      setSuccess(true);
      setMessage('Akun berhasil dibuat!');
      setForm({ email: '', password: '', nama_display: '', nama_sekolah: '', wilayah: '' });
      setSelectedRole(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal membuat akun.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <UserPlus className="text-brand-blue" />
          Buat Akun Operator
        </h2>
        <p className="text-slate-500 mt-1">Buat akun baru untuk operator MACE atau admin sekolah PACE.</p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl border font-medium flex items-center gap-2 ${
          success ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          {success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message}
        </div>
      )}

      {/* Role Selection */}
      <div className="bg-white rounded-3xl p-6 premium-shadow border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Pilih Jenis Akun</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLE_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => { setSelectedRole(opt); setSuccess(false); setMessage(''); }}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                selectedRole?.id === opt.id
                  ? 'border-brand-blue bg-brand-blue/5'
                  : 'border-slate-200 hover:border-brand-blue/30'
              }`}
            >
              <p className="font-bold text-slate-900">{opt.label}</p>
              <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Account Form */}
      {selectedRole && (
        <div className="bg-white rounded-3xl p-8 premium-shadow border border-slate-100 max-w-2xl">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Detail Akun - {selectedRole.label}</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email <span className="text-red-500">*</span></label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@contoh.com" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password <span className="text-red-500">*</span></label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Minimal 6 karakter" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nama Display</label>
              <input type="text" name="nama_display" value={form.nama_display} onChange={handleChange} placeholder="Nama operator (opsional)" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium" />
            </div>

            {selectedRole.id === 'mace_kabkota' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Wilayah Kabupaten/Kota <span className="text-red-500">*</span></label>
                <select name="wilayah" value={form.wilayah} onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium appearance-none">
                  <option value="">-- Pilih Kabupaten/Kota --</option>
                  {KABUPATEN_LIST.map(kab => (
                    <option key={kab.id} value={kab.name}>{kab.name}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedRole.id.startsWith('pace_') && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Sekolah <span className="text-red-500">*</span></label>
                <input type="text" name="nama_sekolah" value={form.nama_sekolah} onChange={handleChange} placeholder="Contoh: SLB Negeri 1 Jayapura" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium" />
              </div>
            )}

            <div className="border-t border-slate-100 pt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 gradient-blue text-white px-8 py-3 rounded-xl font-bold transition-all hover:opacity-90 premium-shadow disabled:opacity-50"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Membuat...</> : <><UserPlus size={18} /> Buat Akun</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAccount;
