# MACE & PACE — Beasiswa Provinsi Papua

Aplikasi web pendaftaran dan seleksi beasiswa **MACE (Mahasiswa Papua Cerdas)** dan **PACE (Pelajar Papua Cerdas)**: pendaftaran mandiri/oleh operator, perangkingan poin otomatis + manual, seleksi berkas, SK Gubernur, hingga laporan mahasiswa.

## Tech Stack

| Bagian | Teknologi |
|---|---|
| Frontend | React 19 + Vite, Tailwind CSS v4, React Router v7, Axios |
| Backend | Node.js — router manual di `api/index.js` (kompatibel Vercel Functions, dijalankan via `vercel dev` saat development atau `server.js`/Express saat produksi) |
| Database | MySQL (XAMPP lokal / MySQL Server di VPS) + Sequelize |
| Penyimpanan file | Disk lokal — `public/uploads/` (bukan cloud storage) |
| Auth | JWT (`jsonwebtoken`) + bcrypt, role-based middleware di `lib/auth.js` |

## Fitur Utama (per peran)

- **Publik / Landing** — profil program, abstraksi beasiswa PACE & MACE, pengumuman penerima + unduh SK Gubernur.
- **Mahasiswa / Pelajar** — pendaftaran mandiri (validasi NIK & NIM, upload berkas), cek status, form data diri, laporan bulanan.
- **Operator MACE** — input mahasiswa + lembaga pengusul, daftar lolos, pengumuman.
- **Admin** — approval pendaftaran, **perangkingan poin** (lihat di bawah), seleksi berkas, SK Gubernur, statistik, laporan mahasiswa, kelola user.
- **PACE Admin / Sekolah / Siswa** — alur pengusulan oleh sekolah, verifikasi, daftar siswa.
- **Superadmin** — pengaturan akses & surat permohonan.

### Sistem Perangkingan Poin (MACE)

Dihitung oleh mesin bersama `lib/points.js` (dipakai frontend & backend, jadi hasilnya selalu sama):

- **Poin NIM (otomatis)** — hanya jika NIM terdaftar/terdeteksi: IPK ≥3.75 = 15, 3.50–3.74 = 13, 3.25–3.49 = 11, 3.00–3.24 = 8, 2.75–2.99 = 5, <2.75 = 2; semester ≥ 6 = 25.
- **Poin NIK (otomatis, independen)** — OAP/KTP Papua = 20, selain itu = 5.
- **Poin manual** — admin boleh menimpa poin NIM/NIK (mis. NIM tak terdeteksi tapi verifikasi lapangan sah) lewat modal detail; dikosongkan = kembali ke otomatis.
- **Poin dokumen** — dinilai admin **per berkas** di modal detail; totalnya otomatis dijumlah.
- Daftar seleksi selalu terurut dari **total poin tertinggi**.

## Struktur Proyek

```
├── api/index.js        # Router pusat semua endpoint /api (DAFTARKAN ROUTE BARU DI SINI)
├── controllers/        # Handler per endpoint (dipakai api/index.js)
├── models/             # Model Sequelize
├── lib/                # auth.js (JWT+role), db.js (MySQL), points.js (mesin poin)
├── database/           # schema.sql, seed.sql, run-sql.js
├── scripts/            # Skrip maintenance sekali-jalan (alter tabel, seed, reset password)
├── src/                # Frontend React
├── public/uploads/     # File uploadan (tidak masuk git)
├── server.js           # Server produksi Express (API + frontend + uploads, satu port)
└── vercel.json         # Konfigurasi vercel dev (development)
```

## Menjalankan Secara Lokal (Windows + XAMPP)

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Siapkan MySQL** — nyalakan MySQL di XAMPP (atau: `Start-Process D:\xampp\mysql\bin\mysqld.exe -ArgumentList "--defaults-file=D:\xampp\mysql\bin\my.ini"`), lalu buat database `mace` lewat phpMyAdmin.
3. **Konfigurasi environment** — salin `.env.example` menjadi `.env` lalu sesuaikan.
4. **Migrasi & seed database**
   ```bash
   npm run db:migrate   # jalankan database/schema.sql
   npm run db:seed      # jalankan database/seed.sql
   ```
5. **Jalankan (2 terminal)**
   ```bash
   npm run backend      # API di http://localhost:3001 (vercel dev)
   npm run dev          # Frontend di http://localhost:3000 (proxy /api -> 3001)
   ```

> ⚠️ **Penting untuk developer:** proyek ini TIDAK memakai file-based routing. Setiap membuat controller baru, wajib mendaftarkan route-nya di `api/index.js`, lalu restart `npm run backend`.

## Environment Variables

`.env` (contoh lengkap ada di `.env.example`):

```env
# Database (MySQL)
DB_HOST=localhost        # di VPS: 127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rahasia
DB_NAME=mace

# Auth — pakai string panjang acak, berbeda tiap environment
JWT_SECRET=ganti_dengan_secret_acak

# Frontend (dibaca saat build). Untuk VPS/produksi gunakan path relatif:
VITE_API_URL=/api

# Port server produksi (server.js), default 3001
PORT=3001
```

---

## Deployment ke VPS (Ubuntu/Debian) + Cloudflare Tunnel

Aplikasi dijalankan sebagai **satu server Node** (`server.js`) yang melayani frontend, API, dan file uploadan dalam satu port — jadi Cloudflare Tunnel cukup menunjuk ke satu port.

### 1. Siapkan VPS

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# MySQL Server
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

### 2. Buat Database & User

```bash
sudo mysql -e "CREATE DATABASE mace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'mace'@'localhost' IDENTIFIED BY 'PASSWORD_KUAT_DI_SINI';"
sudo mysql -e "GRANT ALL PRIVILEGES ON mace.* TO 'mace'@'localhost'; FLUSH PRIVILEGES;"
```

### 3. Ambil Kode & Konfigurasi

```bash
cd /opt
git clone https://github.com/USERNAME/MACE.git mace
cd mace
cp .env.example .env
nano .env          # isi DB_USER=mace, DB_PASSWORD=..., JWT_SECRET=acak panjang, VITE_API_URL=/api
npm ci
npm run db:migrate
npm run db:seed
npm run build      # hasil di dist/
```

### 4. Jalankan dengan PM2 (auto-restart)

```bash
sudo npm install -g pm2
pm2 start server.js --name mace
pm2 save
pm2 startup        # ikut menyala saat VPS reboot
```

Cek: `curl -I http://localhost:3001` → harus merespons. Log: `pm2 logs mace`.

### 5. Install Cloudflare Tunnel

```bash
# cloudflared (resmi dari Cloudflare)
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Login ke akun Cloudflare (zone domain harus ada di Cloudflare)
cloudflared tunnel login
```

#### Opsi A — Quick Tunnel (cepat, untuk testing; URL acak trycloudflare.com)

```bash
cloudflared tunnel --url http://localhost:3001
```

#### Opsi B — Named Tunnel dengan domain sendiri (produksi)

```bash
cloudflared tunnel create mace-tunnel
# cat ~/.cloudflared/<TUNNEL_ID>.json → tunnel ID

cloudflared tunnel route dns mace-tunnel beasiswa.domainanda.com
```

Buat `~/.cloudflared/config.yml`:

```yaml
tunnel: TUNNEL_ID_DISINI
credentials-file: /root/.cloudflared/TUNNEL_ID.json

ingress:
  - hostname: beasiswa.domainanda.com
    service: http://localhost:3001
  - service: http_status:404
```

Jalankan sebagai service:

```bash
sudo cloudflared service install
```

Selesai — aplikasi diakses via `https://beasiswa.domainanda.com`. HTTPS ditangani Cloudflare; VPS tidak perlu buka port 80/443 sama sekali.

> Catatan: `VITE_API_URL=/api` bersifat *same-origin* lewat tunnel, jadi tidak ada masalah CORS. Jika nanti pindah ke domain/API terpisah, ubah nilai ini lalu **build ulang** (`npm run build`) karena variabel `VITE_` dibekukan saat build.

### 6. Update Aplikasi

```bash
cd /opt/mace
git pull
npm ci
npm run build
pm2 restart mace
```

Jalankan migrasi tambahan bila ada: `node scripts/alter_poin_pendaftaran.js` (dll, lihat bawah).

## Skrip Maintenance (`scripts/`)

| Skrip | Fungsi |
|---|---|
| `npm run db:migrate` / `db:seed` / `db:fresh` | Schema & seed utama (di `database/`) |
| `scripts/alter_poin_pendaftaran.js` | Tambah kolom poin perangkingan + hitung ulang (idempoten) |
| `scripts/alter_db_*.js`, `alter_enum*.js`, `alter_sk_gubernur.js` | Migrasi tabel/kolom historis (idempoten) |
| `scripts/reset_admin_password.js` | Reset password akun admin |
| `scripts/seed_admin_pace.js`, `seed_mace_students.js` | Seed data admin/siswa/mahasiswa contoh |
| `database/seed_pace_schools.sql` | Seed sekolah PACE |

Akun default tersedia di `database/seed.sql` (cek file untuk email & password-nya).

## Troubleshooting

| Masalah | Solusi |
|---|---|
| `ECONNREFUSED 127.0.0.1:3306` | MySQL mati — nyalakan XAMPP/service MySQL |
| `API Endpoint Not Found` (404) | Controller belum didaftarkan di `api/index.js`, atau `vercel dev` belum di-restart setelah tambah route |
| Upload gagal / payload besar | Naikkan `limit` di `server.js` (JSON base64, default 30mb) |
| File uploadan hilang setelah deploy | File ada di `public/uploads/` (bukan git) — jangan hapus folder tsb. saat deploy; backup terpisah |
| Tampilan frontend tidak berubah | Variabel `VITE_*` dibekukan saat build — jalankan ulang `npm run build` |
