// Abstraksi Program Beasiswa PACE & MACE — sumber: dokumen abstraksi resmi.
// Dipakai di beranda (LandingPageProfile via komponen AbstraksiProgram).
// Bentuk: array section { judul, teks?, poin?, tabel?, sub? } untuk dirender accordion.

export const ABSTRAKSI_MACE = [
    {
        judul: 'Apa itu Beasiswa MACE?',
        teks: 'Beasiswa MACE (Mahasiswa Papua Cerdas) adalah program beasiswa diploma, sarjana, magister dan doktor yang diperuntukkan bagi putra-putri daerah (diprioritaskan Orang Asli Papua) Provinsi Papua.',
    },
    {
        judul: 'Siapakah sasaran Beasiswa MACE?',
        teks: 'Sasaran Beasiswa MACE adalah 1000 (seribu) putra-putri daerah (diprioritaskan Orang Asli Papua) Provinsi Papua, dengan ketentuan:',
        poin: [
            'Mahasiswa Program Diploma (D-I dan D-II Akademi Komunitas) dan Program Sarjana (S1)',
            'Mahasiswa yang terdaftar aktif pada perguruan tinggi negeri atau perguruan tinggi swasta yang memiliki izin operasional dari pemerintah',
            'Mahasiswa yang berasal dari Provinsi Papua',
            'Diprioritaskan bagi Orang Asli Papua (OAP) sesuai ketentuan peraturan perundang-undangan',
            'Mahasiswa yang memiliki keterbatasan kemampuan ekonomi',
            'Mahasiswa yang memiliki prestasi akademik dan/atau nonakademik',
        ],
    },
    {
        judul: 'Ruang Lingkup Beasiswa MACE',
        poin: [
            'Pemberian beasiswa reguler MACE',
            'Pemberian beasiswa reguler bagi mahasiswa program SlitSite magister Amerika',
            'Pemberian beasiswa Pendidikan Spesialis bagi dokter',
            'Pemberian beasiswa Pendidikan Doktoral bagi dosen',
            'Bantuan pembiayaan pendidikan bagi Program pendidikan profesi kepaniteraan klinik (KOAs)',
            'Bantuan pembiayaan pendidikan bagi Program pendidikan profesi',
            'Bantuan pembiayaan pendidikan bagi mahasiswa studi akhir',
        ],
    },
    {
        judul: 'Komponen Dana yang Diberikan',
        sub: [
            {
                nama: 'Dana Pendidikan',
                poin: [
                    'Dana Pendaftaran',
                    'Dana SPP / Tuition Fee / Uang Kuliah Tunggal',
                    'Dana Tunjangan Buku',
                    'Dana Penelitian Tesis/Disertasi',
                    'Dana Seminar',
                    'Dana Publikasi Jurnal',
                ],
            },
            {
                nama: 'Dana Pendukung',
                poin: [
                    'Dana Hidup Bulanan',
                    'Dana keadaan darurat (jika diperlukan)',
                ],
            },
        ],
    },
    {
        judul: 'Persyaratan Umum',
        poin: [
            'Warga Negara Indonesia',
            'Berdomisili di Provinsi Papua',
            'Diprioritaskan bagi Orang Asli Papua (OAP)',
            'Terdaftar sebagai mahasiswa aktif pada perguruan tinggi yang diakui pemerintah',
            'Tidak sedang menerima beasiswa sejenis yang bersumber dari APBN, APBD, atau lembaga lain yang memiliki komponen pembiayaan yang sama, kecuali ditentukan lain berdasarkan kebijakan Pemerintah Provinsi Papua',
            'Memiliki rekening bank atas nama pribadi',
            'Menandatangani surat pernyataan bersedia mematuhi seluruh ketentuan Program MACE',
        ],
    },
    {
        judul: 'Persyaratan Khusus',
        poin: [
            'Kartu Tanda Penduduk (KTP) dan Kartu Keluarga (KK)',
            'Ijazah pendidikan dasar dan/atau pendidikan menengah dari sekolah di Provinsi Papua, bagi pendaftar yang bertempat tinggal di Indonesia di luar Provinsi Papua',
            'Mengunggah surat pernyataan ditandatangani oleh kepala lembaga adat resmi Papua yang menyatakan pendaftar bermarga Asli Papua, Ibu kandung Orang Asli Papua, atau Bapak kandung Orang Asli Papua',
            'Batas usia per 31 Desember di tahun pendaftaran: diploma & sarjana paling tinggi 21 tahun; magister paling tinggi 47 tahun; doktor paling tinggi 50 tahun',
            'Mengunggah ijazah SMA/sederajat untuk pendaftar diploma dan sarjana; ijazah sarjana untuk pendaftar magister; ijazah magister untuk pendaftar doktor',
            'Tidak dipersyaratkan memiliki sertifikat kemampuan Bahasa Inggris',
            'Mengunggah/melampirkan surat rekomendasi dari pimpinan lembaga untuk pendaftar program doktor dan dokter spesialis',
            'Melampirkan abstraksi tesis/disertasi bagi pendaftar program doktor',
            'Melampirkan surat pernyataan bersedia mengabdi di Provinsi Papua untuk pendaftar program dokter spesialis',
        ],
    },
    {
        judul: 'Cara Mendaftar',
        poin: [
            'Mendaftar secara online pada situs Pendaftaran Beasiswa MACE',
            'Melengkapi dan mengunggah semua dokumen yang dipersyaratkan pada aplikasi pendaftaran',
        ],
    },
    {
        judul: 'Mekanisme & Tahapan Seleksi',
        teks: 'Proses seleksi dilaksanakan melalui tahapan pendaftaran, verifikasi administrasi, penilaian oleh Tim Seleksi, penetapan penerima, dan penyaluran bantuan berdasarkan Keputusan Gubernur Provinsi Papua.',
        tabel: {
            headers: ['Tahapan', 'Tanggal'],
            rows: [
                ['Pendaftaran secara mandiri', '1 – 31 Agustus'],
                ['Verifikasi administrasi', '1 – 21 September'],
                ['Penilaian oleh Tim Seleksi', '22 – 30 September'],
                ['Pengumuman hasil verifikasi dan seleksi', '1 Oktober'],
                ['Pengajuan sanggah*', '2 – 5 Oktober'],
                ['Pengumuman hasil sanggah', '8 Oktober'],
                ['Penetapan penerima', '9 Oktober – 19 November'],
                ['Penyaluran beasiswa', 'Desember'],
            ],
        },
        catatan: '*) Sanggah merupakan bentuk klarifikasi Pendaftar atas hasil Seleksi Administrasi dan tidak dapat menggantikan informasi pada dokumen persyaratan yang telah disampaikan saat pendaftaran.',
    },
    {
        judul: 'Pelanggaran dan Sanksi',
        poin: [
            'Pendaftar yang melakukan kecurangan selama tahapan pendaftaran dan/atau seleksi dikategorikan sebagai pelanggaran ketentuan dan persyaratan seleksi',
            'Pendaftar yang melanggar ketentuan akan digugurkan dan tidak dapat mengikuti tahapan seleksi berikutnya',
            'Penerima yang di kemudian hari terbukti melanggar ketentuan/isyarat atau tidak memenuhi surat pernyataan akan diberikan sanksi sesuai ketentuan yang berlaku',
            'Penerima yang memberikan informasi atau dokumen tidak benar/palsu dikenakan sanksi administratif berat: pemberhentian sebagai penerima beasiswa, pengembalian dana studi, dan pemblokiran mengikuti program MACE di masa mendatang',
        ],
    },
    {
        judul: 'Ketentuan Pengabdian',
        teks: 'Penerima Beasiswa program doktor dan dokter spesialis wajib kembali dan mengabdi di Provinsi Papua setelah selesai studi.',
    },
    {
        judul: 'Dokumen Pendaftaran',
        teks: 'Biodata diri dan profil diisi melalui Online Form; dokumen berikut diunggah pada aplikasi pendaftaran:',
        poin: [
            'Kartu Tanda Penduduk (KTP)',
            'Kartu Keluarga (KK)',
            'Scan Ijazah (asli atau legalisir) atau SKL (Surat Keterangan Lulus)',
            'Surat pernyataan pada aplikasi pendaftaran saat submit',
            'Komitmen kembali ke Indonesia, rencana pasca studi, dan rencana kontribusi (khusus doktor dan dokter spesialis, 1500–2000 kata)',
            'Proposal Penelitian (khusus Doktor, 1500–2000 kata)',
            'Abstraksi disertasi yang akan/sedang disusun (khusus Doktor)',
            'Prestasi kejuaraan/non kejuaraan dan pengalaman organisasi',
            'Scan Ijazah SD/SMP/SMA bagi pendaftar yang bertempat tinggal di luar Provinsi Papua',
            'Surat pernyataan kepala lembaga adat resmi Papua tentang keaslian Papua (diterbitkan paling lama 1 tahun di bulan yang sama dengan waktu pendaftaran)',
            'Surat rekomendasi pimpinan instansi/lembaga/perusahaan bagi pendaftar jenjang doktor',
        ],
    },
];

export const ABSTRAKSI_PACE = [
    {
        judul: 'Apa itu Beasiswa PACE?',
        teks: 'Beasiswa PACE (Pelajar Papua Cerdas) adalah program beasiswa pendidikan yang diperuntukkan bagi putra-putri daerah (diprioritaskan Orang Asli Papua) Provinsi Papua.',
    },
    {
        judul: 'Siapakah sasaran Beasiswa PACE?',
        teks: 'Sasaran Beasiswa PACE adalah putra-putri daerah (diprioritaskan Orang Asli Papua) Provinsi Papua, dengan ketentuan:',
        poin: [
            'Peserta didik disabilitas yang terdaftar di Sekolah Luar Biasa (SLB)',
            'Peserta didik pendidikan vokasi yang terdaftar di Sekolah Negeri Khusus (SNK)',
            'Peserta didik dari keluarga kurang mampu',
            'Peserta didik Orang Asli Papua (OAP)',
            'Peserta didik dari wilayah tertinggal, terdepan, dan terluar (3T)',
            'Peserta didik berprestasi akademik maupun non-akademik',
            'Peserta didik berprestasi olahraga',
            'Kelompok sasaran lain yang ditetapkan oleh Pemerintah Provinsi Papua',
        ],
    },
    {
        judul: 'Ruang Lingkup Beasiswa PACE',
        teks: 'Pemberian beasiswa reguler PACE bagi peserta didik jenjang pendidikan dasar dan menengah pada program pendidikan khusus, pendidikan layanan khusus, dan pendidikan vokasi, meliputi:',
        poin: [
            'Beasiswa bagi Peserta Didik Penyandang Disabilitas pada Sekolah Luar Biasa (SLB)',
            'Beasiswa bagi Peserta Didik pada Sekolah Negeri Khusus (SNK)',
            'Beasiswa bagi Peserta Didik Berprestasi Olahraga pada Program SPOPDA (Sentra Pembinaan Olahraga Prestasi Daerah) Dinas Olahraga dan Pemuda Provinsi Papua dan Yayasan Sekolah Sepak Bola Mutiara Timur',
            'Beasiswa bagi Peserta Didik pada Program Persiapan Memasuki Sekolah Kedinasan',
        ],
    },
    {
        judul: 'Komponen Dana yang Diberikan',
        poin: [
            'Biaya pendidikan',
            'Biaya non pendidikan',
        ],
    },
    {
        judul: 'Persyaratan Umum',
        poin: [
            'Warga Negara Indonesia',
            'Berdomisili di Provinsi Papua',
            'Terdaftar sebagai peserta didik aktif pada SLB dan SNK, dan sekolah lainnya (khusus program beasiswa atlit berprestasi)',
            'Menjadi atlet binaan Program SPOPDA Dinas Olahraga dan Pemuda Provinsi Papua dan Yayasan Sekolah Sepak Bola Mutiara Timur (khusus program beasiswa atlit berprestasi)',
            'Memiliki Nomor Induk Siswa Nasional (NISN)',
            'Terdaftar sebagai peserta program bimbel kedinasan (khusus program bimbel kedinasan)',
            'Memiliki rekening bank atas nama peserta didik atau orang tua/wali',
            'Melampirkan surat keterangan dari sekolah',
            'Tidak sedang menerima bantuan sejenis yang tidak diperbolehkan untuk digabungkan',
        ],
    },
    {
        judul: 'Persyaratan Khusus',
        poin: [
            'Kartu Tanda Penduduk (KTP) dan Kartu Keluarga (KK)',
            'Mengunggah surat pernyataan ditandatangani oleh kepala lembaga adat resmi Papua yang menyatakan pendaftar bermarga Asli Papua, Ibu kandung Orang Asli Papua, atau Bapak kandung Orang Asli Papua',
        ],
    },
    {
        judul: 'Cara Mendaftar',
        poin: [
            'Mendaftar secara online pada situs Beasiswa Pelajar Papua Cerdas',
            'Melengkapi dan mengunggah semua dokumen yang dipersyaratkan pada aplikasi pendaftaran',
        ],
    },
    {
        judul: 'Mekanisme & Tahapan Seleksi',
        teks: 'Dilaksanakan melalui tahapan pengusulan oleh sekolah, verifikasi administrasi, penilaian oleh Tim Seleksi, penetapan penerima, dan penyaluran bantuan berdasarkan Keputusan Gubernur Provinsi Papua.',
        tabel: {
            headers: ['Tahapan', 'Tanggal'],
            rows: [
                ['Pengusulan oleh sekolah', '1 – 31 Agustus'],
                ['Verifikasi administrasi', '1 – 21 September'],
                ['Penilaian oleh Tim Seleksi', '22 – 30 September'],
                ['Pengumuman hasil verifikasi dan seleksi', '1 Oktober'],
                ['Pengajuan sanggah*', '2 – 5 Oktober'],
                ['Pengumuman hasil sanggah', '8 Oktober'],
                ['Penetapan penerima', '9 Oktober – 19 November'],
                ['Penyaluran beasiswa', 'Desember'],
            ],
        },
        catatan: '*) Sanggah merupakan bentuk klarifikasi Pendaftar atas hasil Seleksi Administrasi dan tidak dapat menggantikan informasi pada dokumen persyaratan yang telah disampaikan saat pendaftaran.',
    },
    {
        judul: 'Dokumen Pendaftaran',
        teks: 'Biodata diri diisi melalui Online Form; dokumen berikut diunggah pada aplikasi pendaftaran:',
        poin: [
            'Kartu Tanda Penduduk (KTP)',
            'Kartu Keluarga (KK)',
            'Surat pernyataan yang ditandatangani kepala lembaga adat resmi Papua yang menyatakan pendaftar bermarga asli Papua, Ibu kandung Orang Asli Papua, atau Bapak kandung Orang Asli Papua (diterbitkan paling lama 1 tahun di bulan yang sama dengan waktu pendaftaran)',
        ],
    },
];
