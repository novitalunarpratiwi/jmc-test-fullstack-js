# JMC Technical Test - Fullstack JS

Proyek ini adalah hasil pengerjaan technical test untuk posisi Fullstack Developer, dikembangkan menggunakan **Node.js (Backend)** dan **Nuxt 3 / Vue.js (Frontend)** dengan antarmuka **Tabler CSS**.

**Oleh:** Novita Lunar Pratiwi

## Status Pengerjaan & Fitur Terselesaikan
Mengingat batasan waktu pengerjaan tes, fokus utama diletakkan pada fondasi sistem, keamanan, dan arsitektur API. Berikut adalah progres fitur yang berhasil diselesaikan:

**Backend (REST API):**
- [x] Setup server Node.js & koneksi database.
- [x] API Authentication (Login) dengan token JWT/Cookie.
- [x] API Perhitungan otomatis Tunjangan Transport (Kehadiran x Nominal).

**Frontend (Nuxt 3):**
- [x] Integrasi template Tabler CSS & Layouting UI.
- [x] Halaman Authentication (Login) yang aman:
  - Validasi Captcha manual sesuai ketentuan.
  - Fitur Show/Hide Password.
  - Penanganan error handling (Alert Native Tabler) & UX loading state.
- [x] Halaman UI Setting Konfigurasi Tunjangan (Enterprise layout).
- [ ] *Catatan: Halaman CRUD Data Pegawai di frontend belum terintegrasi sepenuhnya dengan API karena keterbatasan waktu tes, namun endpoint backend sudah disiapkan.*

## Cara Menjalankan Proyek (*How to Run*)

### 1. Persiapan Database
- Buat database baru di MySQL/phpMyAdmin.
- Import file SQL yang telah disertakan di dalam repository ini (misal: `jmc_test.sql`).
- Sesuaikan konfigurasi koneksi database di file backend (`.env`).

### 2. Menjalankan Backend (Port 5000)
Buka terminal pada folder backend, lalu jalankan:
```bash
npm install
npm run dev
