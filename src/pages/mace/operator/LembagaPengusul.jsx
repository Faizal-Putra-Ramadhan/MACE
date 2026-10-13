import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Building2, Save } from 'lucide-react';
import api from '../../../api/axios';

const LembagaPengusul = () => {
  const { isApproved } = useOutletContext();
  const [formData, setFormData] = useState({
    nama_lembaga: '',
    alamat: '',
    nama_operator: '',
    hp_operator: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    // Simulate save
    setTimeout(() => {
      setMessage('Data lembaga pengusul berhasil disimpan.');
      setIsSaving(false);
    }, 1000);
  };

  if (!isApproved) {
    return (
      <div className="text-center py-20 text-slate-400">
        <Building2 className="mx-auto mb-4 text-slate-300" size={48} />
        <p className="font-medium">Menu ini belum dapat diakses.</p>
        <p className="text-sm">Silakan upload dan tunggu persetujuan Surat Permohonan terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Lembaga Pengusul</h2>
        <p className="text-slate-500 mt-1">Isi data lembaga yang mengusulkan bantuan biaya pendidikan.</p>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl border border-emerald-100 font-medium">
          {message}
        </div>
      )}

      <div className="bg-white rounded-3xl p-8 premium-shadow border border-slate-100 max-w-3xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lembaga</label>
            <input
              type="text"
              name="nama_lembaga"
              value={formData.nama_lembaga}
              onChange={handleInputChange}
              placeholder="Contoh: Universitas Cenderawasih"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Alamat</label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleInputChange}
              rows="3"
              placeholder="Alamat lengkap lembaga"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium resize-none"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nama Operator</label>
              <input
                type="text"
                name="nama_operator"
                value={formData.nama_operator}
                onChange={handleInputChange}
                placeholder="Nama lengkap operator"
                className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">HP Operator</label>
              <input
                type="text"
                name="hp_operator"
                value={formData.hp_operator}
                onChange={handleInputChange}
                placeholder="08xxxxxxxxxx"
                className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium"
              />
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 gradient-blue text-white px-8 py-3 rounded-xl font-bold transition-all hover:opacity-90 premium-shadow disabled:opacity-70"
            >
              {isSaving ? 'Menyimpan...' : (
                <>
                  <Save size={18} />
                  Simpan Data Lembaga
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LembagaPengusul;
