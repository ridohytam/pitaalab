# LabCare — Prototipe Web Sistem Informasi Laboratorium

## Menjalankan di VS Code
1. Ekstrak `lab-klinik-web.zip`.
2. Buka folder `lab-klinik-web` melalui VS Code.
3. Buka `index.html` di browser, atau gunakan ekstensi **Live Server** lalu klik kanan `index.html` → **Open with Live Server**.

## Modul
- Beranda dan statistik kunjungan
- Notifikasi dan order pemeriksaan
- Data pasien
- Pemeriksaan laboratorium
- Stok reagen, bahan habis pakai, dan alat
- Quality Control (QC)
- Halaman simulasi integrasi alat
- Tampilan dokter dan portal pasien (pilih peran di sisi kiri)

## Catatan penting
Ini adalah prototipe frontend untuk pembelajaran. Data bersifat contoh dan tersimpan hanya selama halaman berjalan (belum ada database/backend/login sungguhan). Jangan masukkan data pasien asli. Untuk penggunaan nyata diperlukan autentikasi dan hak akses berbasis peran, database terenkripsi, audit log, backup, persetujuan/privasi, validasi klinis, serta pengujian keamanan. Integrasi alat nyata membutuhkan model alat, driver, protokol/API dari vendor, dan middleware; tombol koneksi saat ini hanya simulasi.

## Menu berdasarkan peran
- Admin Laboratorium: Beranda, Notifikasi & Order, Data Pasien, Pemeriksaan, Stok, QC, Integrasi Alat.
- Dokter: Beranda Dokter, Daftar Pasien, Order Pemeriksaan, Hasil Pemeriksaan, Profil Dokter.
- Pasien: Beranda Pasien, Order Saya, Hasil Pemeriksaan, Profil Saya.

Pilihan peran berada di panel kiri. Setiap peran sekarang menampilkan menu yang berbeda.

## Tampilan mobile
Antarmuka responsif untuk ponsel: kartu statistik dua kolom, tabel yang dapat digeser horizontal, navigasi bawah sesuai peran pengguna, serta sidebar yang dapat dibuka dari tombol menu. Coba dengan mengecilkan lebar browser atau gunakan mode perangkat (Device Toolbar) di Developer Tools.

## Berpindah tampilan Web dan Mobile
Pada bagian kanan header tersedia tombol **Web** dan **Mobile**. Klik Mobile untuk melihat pratinjau layout ponsel meskipun dibuka dari komputer. Klik Web untuk kembali ke layout desktop. Pada layar HP, layout juga otomatis menyesuaikan ukuran layar.
