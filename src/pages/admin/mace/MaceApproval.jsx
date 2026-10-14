import React, { useState, useEffect } from 'react';
import { Search, Check, X, GraduationCap, Loader2, Eye, ExternalLink, XCircle, Save, Trophy } from 'lucide-react';
import api from '../../../api/axios';
import { getPendaftarNama, getPendaftarNim, getPendaftarNik, getPendaftarPt, getPendaftarSemester } from '../../../lib/pendaftaran';
import { hitungPoinFinal } from '../../../../lib/points.js';
import { DOKUMEN_LIST, DOKUMEN_D_LIST, SURAT_LIST, ALL_FIELD_LABELS } from '../../../lib/pendaftaranConfig';

const DOKUMEN_LABELS = {
  // Label lama (masih dipakai data pendaftaran sebelumnya).
  surat_permohonan: 'Surat Permohonan',
  rab: 'Rencana Anggaran Biaya',
  khs_terakhir: 'KHS Terakhir',
  rekening: 'Buku Rekening',
  sktm: 'SKTM',
  surat_rekomendasi_rektor: 'Surat Rekomendasi Rektor',
  surat_rekomendasi_pimpinan: 'Surat Rekomendasi Pimpinan',
  rekomendasi: 'Surat Rekomendasi',
  pernyataan: 'Surat Pernyataan',
  prestasi_akademik: 'Sertifikat Prestasi Akademik',
  prestasi_non_akademik: 'Sertifikat Prestasi Non-Akademik',
  // Label baru: dibangun dari konfigurasi dokumen & surat pendaftaran.
  ...Object.fromEntries(DOKUMEN_LIST.map(d => [d.name, d.label])),
  ...Object.fromEntries(DOKUMEN_D_LIST.map(d => [d.name, d.label])),
  ...Object.fromEntries(SURAT_LIST.map(s => [s.name, s.title])),
};

const AdminMaceApproval = () => {
  const [search, setSearch] = useState('');
  const [pendaftaranList, setPendaftaranList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nominalInputs, setNominalInputs] = useState({});
  // Form penetapan poin di modal detail: poin NIM/NIK manual + poin per berkas
  const [poinForm, setPoinForm] = useState({ nim: '', nik: '', docs: {} });
  const [savingPoinId, setSavingPoinId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  // Modal konfirmasi "poin tersimpan" — muncul lalu halaman reload sebagai timbal-balik.
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const openDetail = (p) => {
    setSelectedDetail(p);
    setPoinForm({
      nim: p.poin_nim_manual ?? '',
      nik: p.poin_nik_manual ?? '',
      docs: Object.fromEntries((p.dokumen_pendaftarans || []).map(d => [d.id, d.poin ?? '']))
    });
  };

  const fetchPendaftaran = async () => {
    try {
      const res = await api.get('/admin/pendaftaran');
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setPendaftaranList(data);
      return data;
    } catch (err) {
      console.error('Failed to fetch pendaftaran', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendaftaran();
  }, []);

  const handleApprove = async (id) => {
    const nominal = nominalInputs[id] ? Number(nominalInputs[id]) : 0;
    try {
      await api.put(`/admin/pendaftaran/${id}/status`, { status: 'lolos_berkas', nominal_dana: nominal });
      setPendaftaranList(prev => prev.map(p => p.id === parseInt(id) ? { ...p, status: 'lolos_berkas', nominal_dana: nominal } : p));
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyetujui');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/pendaftaran/${id}/status`, { status: 'ditolak', alasan_penolakan: 'Tidak memenuhi syarat' });
      setPendaftaranList(prev => prev.map(p => p.id === parseInt(id) ? { ...p, status: 'ditolak' } : p));
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menolak');
    }
  };

  // Simpan penetapan poin dari modal detail: per berkas + NIM/NIK manual.
  const handleSavePoin = async (id) => {
    const target = selectedDetail && selectedDetail.id === Number(id) ? selectedDetail : pendaftaranList.find(p => p.id === Number(id));
    const payload = {};
    const documents = Object.entries(poinForm.docs).map(([docId, poin]) => ({
      id: Number(docId),
      poin: poin === '' ? null : Number(poin) || 0
    }));
    if (documents.length) payload.documents = documents;
    if (target) {
      const poin = getPoin(target);
      const nimTerdaftar = target.data_diri?.nim_terdaftar === true && !!poin.auto.ipk_number;
      const nikTerdeteksiOap = poin.auto.poin_nik >= 20;
      // Kirim nilai manual hanya saat kolom manualnya tampil di form;
      // dikosongkan = null -> kembali ke poin otomatis.
      if (!nimTerdaftar || poinForm.nim !== '') payload.poin_nim_manual = poinForm.nim === '' ? null : Number(poinForm.nim) || 0;
      if (!nikTerdeteksiOap || poinForm.nik !== '') payload.poin_nik_manual = poinForm.nik === '' ? null : Number(poinForm.nik) || 0;
    }
    if (!payload.documents && payload.poin_nim_manual === undefined && payload.poin_nik_manual === undefined) {
      alert('Isi minimal satu penilaian poin (berkas / NIM / NIK).');
      return;
    }
    setSavingPoinId(id);
    try {
      await api.put(`/admin/pendaftaran/${id}/poin`, payload);
      // Tutup modal detail, tampilkan modal sukses, lalu reload halaman
      // supaya tabel & ranking tampil dari data terbaru di server.
      setSelectedDetail(null);
      setShowSaveSuccess(true);
      setTimeout(() => window.location.reload(), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan poin');
    } finally {
      setSavingPoinId(null);
    }
  };

  const getPoin = (p) => hitungPoinFinal(p.data_diri || {}, {
    poin_nim_manual: p.poin_nim_manual,
    poin_nik_manual: p.poin_nik_manual,
    poin_dokumen: p.poin_dokumen
  });

  const getStatusBadge = (status) => {
    if (status === 'lolos_berkas') return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Lolos</span>;
    if (status === 'ditolak') return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Ditolak</span>;
    if (status === 'selesai') return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Selesai</span>;
    return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">Menunggu</span>;
  };

  // Perangkingan: urutkan dari poin total tertinggi ke terendah
  const filtered = pendaftaranList
    .filter(p => {
      const nama = (p.data_diri?.nama || p.mahasiswa?.nama_lengkap || '').toLowerCase();
      const nim = p.data_diri?.nim || p.mahasiswa?.nim || '';
      return nama.includes(search.toLowerCase()) || nim.includes(search);
    })
    .sort((a, b) => (getPoin(b).poin_total - getPoin(a).poin_total) || (new Date(b.created_at) - new Date(a.created_at)));

    const isValidUrl = (url) => !!url && (url.startsWith('http') || url.startsWith('/'));

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <GraduationCap className="text-brand-blue" />
          MACE Approval Mahasiswa
        </h2>
        <p className="text-slate-500 mt-1">Tinjau pendaftaran mahasiswa MACE. Daftar diurutkan berdasarkan perangkingan poin tertinggi. Poin dokumen ditetapkan oleh admin.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input type="text" placeholder="Cari nama atau NIM..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 focus:border-brand-blue rounded-xl py-2.5 pl-10 pr-4 outline-none text-sm premium-shadow" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Memuat data...</div>
      ) : (
        <div className="bg-white rounded-3xl premium-shadow border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <th className="px-4 py-4 font-bold text-center">RANK</th>
                  <th className="px-6 py-4 font-bold">NIM</th>
                  <th className="px-6 py-4 font-bold">NAMA</th>
                  <th className="px-6 py-4 font-bold">KAMPUS</th>
                  <th className="px-6 py-4 font-bold">IPK</th>
                  <th className="px-6 py-4 font-bold">PROGRAM</th>
                  <th className="px-6 py-4 font-bold text-center">POIN</th>
                  <th className="px-6 py-4 font-bold">STATUS</th>
                  <th className="px-6 py-4 font-bold text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p, idx) => {
                  const poin = getPoin(p);
                  const ipkDisplay = p.data_diri?.ipk ?? '-';
                  return (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-extrabold ${
                        idx === 0 ? 'bg-brand-gold/20 text-brand-gold' :
                        idx === 1 ? 'bg-slate-200 text-slate-600' :
                        idx === 2 ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-50 text-slate-400'
                      }`}>{idx + 1}</span>
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-900">{getPendaftarNim(p)}</td>
                    <td className="px-6 py-3 font-bold text-slate-900">{getPendaftarNama(p)}</td>
                    <td className="px-6 py-3 text-slate-500">{getPendaftarPt(p)}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">{ipkDisplay}</td>
                    <td className="px-6 py-3"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">Program {p.program}</span></td>
                    <td className="px-6 py-3 text-center">
                      <span className="text-sm font-extrabold text-slate-900 inline-flex items-center gap-1" title={`NIM ${poin.poin_nim} + NIK ${poin.poin_nik} + Dokumen ${poin.poin_dokumen}. Klik Detail untuk menilai.`}>
                        <Trophy size={14} className="text-brand-gold" />{poin.poin_total}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(p.status)}
                        {p.status === 'lolos_berkas' && p.nominal_dana > 0 && (
                          <span className="text-xs font-bold text-brand-gold">Rp {Number(p.nominal_dana).toLocaleString('id-ID')}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button onClick={() => openDetail(p)} className="p-1.5 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 rounded-lg transition-colors" title="Detail">
                          <Eye size={16} />
                        </button>
                        {(p.status === 'submitted' || p.status === 'draft') && (
                          <>
                            <input type="number" placeholder="Nominal" value={nominalInputs[p.id] || ''}
                              onChange={(e) => setNominalInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                              className="w-28 bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs outline-none focus:border-brand-blue" />
                            <button onClick={() => handleApprove(p.id)} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg" title="Setujui">
                              <Check size={16} />
                            </button>
                            <button onClick={() => handleReject(p.id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg" title="Tolak">
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan="9" className="px-6 py-12 text-center text-slate-400">Belum ada data pendaftaran.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedDetail(null)}>
          <div className="bg-white rounded-3xl premium-shadow max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-100 px-8 py-5 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Detail Pendaftaran</h3>
                <p className="text-sm text-slate-500">Program {selectedDetail.program} - {getPendaftarNama(selectedDetail)}</p>
              </div>
              <button onClick={() => setSelectedDetail(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <XCircle size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Ranking Points */}
              {(() => {
                const poin = getPoin(selectedDetail);
                const nimTerdaftar = selectedDetail.data_diri?.nim_terdaftar === true && !!poin.auto.ipk_number;
                const nikTerdeteksiOap = poin.auto.poin_nik >= 20;
                const docPoinTotal = Object.values(poinForm.docs).reduce((s, v) => s + (Number(v) || 0), 0);
                return (
                  <div>
                    <h4 className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-4">Perangkingan Poin</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 mb-2">Poin NIM {nimTerdaftar ? '(terdaftar/terdeteksi)' : '(tidak terdaftar — poin otomatis tidak bekerja)'}</p>
                        <div className="text-sm font-medium text-slate-900 space-y-1">
                          <p>IPK: {selectedDetail.data_diri?.ipk || '-'} → {poin.auto.poin_ipk} poin</p>
                          <p>Semester: {getPendaftarSemester(selectedDetail)} → {poin.auto.poin_semester} poin (syarat ≥ 6)</p>
                        </div>
                        {nimTerdaftar && poinForm.nim === '' ? (
                          <p className="mt-3 text-sm font-bold text-emerald-600"></p>
                        ) : (
                          <div className="mt-3 flex items-center gap-2">
                            <label className="text-xs font-bold text-slate-500">Poin:</label>
                            <input type="number" min="0" placeholder={`${poin.auto.poin_nim_otomatis}`}
                              value={poinForm.nim}
                              onChange={(e) => setPoinForm(prev => ({ ...prev, nim: e.target.value }))}
                              className="w-28 bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-sm outline-none focus:border-brand-blue font-bold" />
                            <span className="text-xs text-slate-400">NIM tak terdeteksi — wajib diisi manual</span>
                          </div>
                        )}
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 mb-2">Poin NIK (dihitung terpisah dari NIM)</p>
                        <div className="text-sm font-medium text-slate-900 space-y-1">
                          <p>OAP / KTP Papua: {nikTerdeteksiOap ? 'Ya' : 'Tidak / belum terdeteksi'}</p>
                          <p>{poin.auto.poin_nik} poin (OAP = 20, bukan OAP = 5)</p>
                        </div>
                        {nikTerdeteksiOap && poinForm.nik === '' ? (
                          <p className="mt-3 text-sm font-bold text-emerald-600"></p>
                        ) : (
                          <div className="mt-3 flex items-center gap-2">
                            <label className="text-xs font-bold text-slate-500">Poin:</label>
                            <input type="number" min="0" placeholder={`${poin.auto.poin_nik}`}
                              value={poinForm.nik}
                              onChange={(e) => setPoinForm(prev => ({ ...prev, nik: e.target.value }))}
                              className="w-28 bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-sm outline-none focus:border-brand-blue font-bold" />
                            <span className="text-xs text-slate-400">isi manual jika seharusnya OAP tapi tak terdeteksi</span>
                          </div>
                        )}
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 mb-2">Poin Dokumen (nilai per berkas di bawah)</p>
                        <p className="text-sm font-bold text-slate-900">{docPoinTotal} poin <span className="text-xs font-medium text-slate-400">(tersimpan: {poin.poin_dokumen})</span></p>
                      </div>
                      <div className="bg-brand-gold/10 rounded-2xl p-5 border border-brand-gold/20">
                        <p className="text-xs font-bold text-brand-gold mb-1">TOTAL POIN PERINGKATAN</p>
                        <p className="text-2xl font-extrabold text-slate-900 flex items-center gap-2"><Trophy size={20} className="text-brand-gold" />{poin.poin_total}</p>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">NIM {poin.poin_nim} + NIK {poin.poin_nik} + Dokumen {poin.poin_dokumen}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Identity */}
              <div>
                <h4 className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-4">Identitas & Data Pendaftaran</h4>
                {(() => {
                  const dd = selectedDetail.data_diri || {};
                  // Label tambahan untuk field lama yang tidak ada di konfigurasi baru.
                  const legacyLabels = {
                    pt: 'Perguruan Tinggi', jurusan: 'Program Studi', alamat: 'Alamat',
                    no_hp: 'No. HP', ttl: 'Tempat, Tanggal Lahir', jalur: 'Jalur',
                    wilayah_name: 'Wilayah', wilayah: 'Kode Wilayah',
                  };
                  const labels = { ...legacyLabels, ...ALL_FIELD_LABELS };
                  const skip = new Set(['nim_terdaftar', 'nik_terdaftar', 'ktp_papua', 'is_oap']);
                  const entries = Object.entries(dd).filter(([k, v]) =>
                    !skip.has(k) && v !== '' && v !== null && v !== undefined
                  );
                  if (!entries.length) {
                    return (
                      <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                        {[['Nama Lengkap', getPendaftarNama(selectedDetail)], ['NIM', getPendaftarNim(selectedDetail)], ['NIK', getPendaftarNik(selectedDetail)]].map(([label, value]) => (
                          <div key={label}><p className="text-xs font-bold text-slate-400">{label}</p><p className="text-sm font-medium text-slate-900">{value || '-'}</p></div>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                      {entries.map(([key, value]) => (
                        <div key={key} className={(String(value).length > 60 ? 'md:col-span-2 ' : '')}>
                          <p className="text-xs font-bold text-slate-400">{labels[key] || key}</p>
                          <p className="text-sm font-medium text-slate-900 whitespace-pre-line">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Registration Info */}
              <div>
                <h4 className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-4">Info Pendaftaran</h4>
                <div className="grid md:grid-cols-3 gap-x-8 gap-y-3">
                  <div>
                    <p className="text-xs font-bold text-slate-400">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedDetail.status)}</div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">Nominal Dana</p>
                    <p className="text-sm font-bold text-brand-gold">
                      {selectedDetail.nominal_dana ? `Rp ${Number(selectedDetail.nominal_dana).toLocaleString('id-ID')}` : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">Tanggal Daftar</p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedDetail.created_at ? new Date(selectedDetail.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </p>
                  </div>
                  {selectedDetail.alasan_penolakan && (
                    <div className="md:col-span-3">
                      <p className="text-xs font-bold text-red-400">Alasan Penolakan</p>
                      <p className="text-sm font-medium text-red-600">{selectedDetail.alasan_penolakan}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-4">Berkas yang Diupload</h4>
                {selectedDetail.dokumen_pendaftarans && selectedDetail.dokumen_pendaftarans.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedDetail.dokumen_pendaftarans.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileIcon size={18} className="text-brand-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate">{DOKUMEN_LABELS[doc.jenis_dokumen] || doc.jenis_dokumen}</p>
                          {isValidUrl(doc.file_path) ? (
                            <a href={doc.file_path} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-brand-blue hover:underline flex items-center gap-1 mt-0.5">
                              <ExternalLink size={12} /> Lihat File
                            </a>
                          ) : (
                            <p className="text-xs text-red-400 italic">File tidak valid</p>
                          )}
                        </div>
                        <label className="flex items-center gap-1.5 flex-shrink-0" title="Poin manual untuk berkas ini">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Poin</span>
                          <input type="number" min="0" placeholder="-"
                            value={poinForm.docs[doc.id] ?? ''}
                            onChange={(e) => setPoinForm(prev => ({ ...prev, docs: { ...prev.docs, [doc.id]: e.target.value } }))}
                            className="w-16 bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-xs outline-none focus:border-brand-blue font-bold" />
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Belum ada berkas yang diupload.</p>
                )}

                {/* Simpan Penetapan Poin */}
                <div className="mt-5 flex items-center justify-end gap-3">
                  <p className="text-xs text-slate-400">Poin</p>
                  <button onClick={() => handleSavePoin(selectedDetail.id)} disabled={savingPoinId === selectedDetail.id}
                    className="bg-brand-blue text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-blue/90 transition-colors disabled:opacity-50 flex items-center gap-2">
                    {savingPoinId === selectedDetail.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Simpan Poin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal Konfirmasi Poin Tersimpan -> reload halaman */}
      {showSaveSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl premium-shadow max-w-sm w-full p-8 text-center" onClick={e => e.stopPropagation()}>
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <Check size={32} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Poin Berhasil Disimpan</h3>
            <p className="text-sm text-slate-500 mt-1">Data perangkingan tersimpan. Halaman akan dimuat ulang untuk memperbarui tabel dan ranking.</p>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
              <Loader2 size={14} className="animate-spin" /> Memuat ulang halaman...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FileIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default AdminMaceApproval;
