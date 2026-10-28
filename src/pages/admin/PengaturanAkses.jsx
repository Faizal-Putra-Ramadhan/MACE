import React, { useState, useEffect } from 'react';
import { Shield, Save, CheckCircle, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const SCOPES = [
  { id: 'mace_kabkota', label: 'MACE Kab/Kota', color: 'blue' },
  { id: 'mace_provinsi', label: 'MACE Provinsi', color: 'blue' },
  { id: 'pace_slb', label: 'PACE SLB', color: 'gold' },
  { id: 'pace_snk', label: 'PACE SNK', color: 'gold' },
  { id: 'pace_atlit', label: 'PACE Atlit Berprestasi', color: 'gold' },
  { id: 'pace_kedinasan', label: 'PACE Kedinasan', color: 'gold' },
];

const TOGGLES = [
  { key: 'edit_surat_permohonan', label: 'Edit Surat Permohonan' },
  { key: 'edit_data_sekolah', label: 'Edit Data Sekolah' },
  { key: 'edit_siswa', label: 'Edit Siswa' },
];

const PengaturanAksesPage = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/superadmin/pengaturan-akses');
        const data = res.data || [];
        const map = {};
        data.forEach(item => {
          map[item.scope] = {
            edit_surat_permohonan: item.edit_surat_permohonan,
            edit_data_sekolah: item.edit_data_sekolah,
            edit_siswa: item.edit_siswa,
          };
        });
        // Fill defaults for missing scopes
        SCOPES.forEach(s => {
          if (!map[s.id]) {
            map[s.id] = { edit_surat_permohonan: true, edit_data_sekolah: true, edit_siswa: true };
          }
        });
        setSettings(map);
      } catch (err) {
        console.error('Failed to fetch pengaturan', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleToggle = (scope, key) => {
    setSettings(prev => ({
      ...prev,
      [scope]: { ...prev[scope], [key]: !prev[scope]?.[key] }
    }));
  };

  const handleSave = async (scope) => {
    setSaving(scope);
    setMessage('');
    try {
      await api.put('/superadmin/pengaturan-akses', {
        scope,
        ...settings[scope]
      });
      setMessage(`Pengaturan ${SCOPES.find(s => s.id === scope)?.label} berhasil disimpan!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Gagal menyimpan pengaturan.');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Memuat pengaturan...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Shield className="text-brand-blue" />
          Pengaturan Akses
        </h2>
        <p className="text-slate-500 mt-1">Kontrol akses edit untuk setiap kategori program. Buka/tutup akses surat permohonan, data sekolah, dan data siswa.</p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl border font-medium flex items-center gap-2 ${
          message.includes('berhasil') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          <CheckCircle size={18} /> {message}
        </div>
      )}

      <div className="space-y-4">
        {SCOPES.map(scope => {
          const scopeSettings = settings[scope.id] || { edit_surat_permohonan: true, edit_data_sekolah: true, edit_siswa: true };
          return (
            <div key={scope.id} className="bg-white rounded-3xl p-6 premium-shadow border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${scope.color === 'gold' ? 'bg-brand-gold' : 'bg-brand-blue'}`}></div>
                  <h3 className="text-lg font-bold text-slate-900">{scope.label}</h3>
                </div>
                <button
                  onClick={() => handleSave(scope.id)}
                  disabled={saving === scope.id}
                  className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-brand-blue/90 transition-colors disabled:opacity-50"
                >
                  {saving === scope.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Simpan
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {TOGGLES.map(toggle => (
                  <div key={toggle.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm font-medium text-slate-700">{toggle.label}</span>
                    <button
                      onClick={() => handleToggle(scope.id, toggle.key)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        scopeSettings[toggle.key] ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        scopeSettings[toggle.key] ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PengaturanAksesPage;
