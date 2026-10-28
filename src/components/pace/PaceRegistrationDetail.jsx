import React from 'react';
import { FileText, ExternalLink, Inbox } from 'lucide-react';
import {
  SECTION_ORDER, SECTION_TITLES, SUBSECTION_TITLES, DOKUMEN_LABELS,
  isEmptyValue, fieldLabel, prettifyKey,
} from '../../lib/paceFormDetail';

/* ============================================================
 *  Render isi `data_pendaftaran` (formulir PACE) secara read-only
 *  untuk semua program (SLB/SNK/Kedinasan/Atlit).
 *  - sectionTop: objek satu bagian (mis. identitas)
 *  Menangani: string, array (checkbox multi), dan sub-objek
 *  (ayah/ibu/wali, prestasi_1..3).
 * ============================================================ */
const Row = ({ label, value }) => (
  <div className="md:col-span-1">
    <p className="text-xs font-bold text-slate-400">{label}</p>
    <p className="text-sm font-medium text-slate-900 whitespace-pre-wrap break-words">{value}</p>
  </div>
);

const renderScalar = (v) => (Array.isArray(v) ? v.join(', ') : String(v));

const SectionBlock = ({ title, obj }) => {
  // Pisahkan field biasa vs sub-objek (ayah/ibu/wali, prestasi_N)
  const flat = [];
  const nested = [];
  Object.entries(obj || {}).forEach(([key, val]) => {
    if (isEmptyValue(val)) return;
    if (val && typeof val === 'object' && !Array.isArray(val)) nested.push([key, val]);
    else flat.push([key, val]);
  });
  if (flat.length === 0 && nested.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-bold text-brand-gold uppercase tracking-wider mb-3">{title}</h4>
      {flat.length > 0 && (
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
          {flat.map(([key, val]) => (
            <Row key={key} label={fieldLabel(key)} value={renderScalar(val)} />
          ))}
        </div>
      )}
      {nested.map(([key, sub]) => (
        <div key={key} className="mt-4 pl-4 border-l-2 border-slate-100">
          <p className="text-xs font-bold text-slate-500 mb-2">{SUBSECTION_TITLES[key] || prettifyKey(key)}</p>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
            {Object.entries(sub).filter(([, v]) => !isEmptyValue(v)).map(([k2, v2]) => (
              <Row key={k2} label={fieldLabel(k2)} value={renderScalar(v2)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const PaceRegistrationDetail = ({ data }) => {
  if (!data || typeof data !== 'object') {
    return (
      <p className="text-sm text-slate-400 italic">
        Data formulir lengkap tidak tersedia untuk pendaftaran ini (kemungkinan catatan lama).
      </p>
    );
  }

  const dokumen = data.dokumen || {};
  const dokumenKeys = Object.keys(dokumen).filter(k => !isEmptyValue(dokumen[k]));

  // Tampilkan bagian sesuai urutanknown, lalu sisa kunci lain (selalu lewati dokumen & _legacy)
  const known = SECTION_ORDER.filter(sec => data[sec] && typeof data[sec] === 'object' && !isEmptyValue(data[sec]));
  const extras = Object.keys(data).filter(
    k => k !== 'dokumen' && k !== '_legacy' && !SECTION_ORDER.includes(k) && typeof data[k] === 'object' && !isEmptyValue(data[k])
  );
  const orderedSections = [...known, ...extras];

  const isValidUrl = (url) => typeof url === 'string' && (url.startsWith('http') || url.startsWith('/'));

  return (
    <div className="space-y-8">
      {orderedSections.map(sec => (
        <SectionBlock key={sec} title={SECTION_TITLES[sec] || prettifyKey(sec)} obj={data[sec]} />
      ))}

      {/* Dokumen terunggah */}
      <div>
        <h4 className="text-sm font-bold text-brand-gold uppercase tracking-wider mb-4">Berkas Terunggah</h4>
        {dokumenKeys.length === 0 ? (
          <p className="text-sm text-slate-400 italic flex items-center gap-2">
            <Inbox size={16} /> Belum ada berkas yang diunggah.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {dokumenKeys.map(key => (
              <div key={key} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-brand-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate">{DOKUMEN_LABELS[key] || prettifyKey(key)}</p>
                  {isValidUrl(dokumen[key]) ? (
                    <a href={dokumen[key]} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-brand-blue hover:underline flex items-center gap-1 mt-0.5">
                      <ExternalLink size={12} /> Lihat File
                    </a>
                  ) : (
                    <p className="text-xs text-red-400 italic">Tautan file tidak valid</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaceRegistrationDetail;
