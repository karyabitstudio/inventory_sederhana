# Inventory Sederhana

Aplikasi web untuk membantu UMKM dan gudang kecil mengelola data barang, memantau stok, serta mencatat transaksi stok masuk dan keluar.

## Masalah

Pencatatan stok secara manual membuat jumlah persediaan sulit dipantau, riwayat transaksi mudah terlewat, dan risiko selisih stok meningkat. Pengelola juga perlu cara yang mudah untuk mengetahui barang yang stoknya hampir habis.

## Solusi

Inventory Sederhana menyediakan dashboard dan pencatatan stok terpusat. Setiap transaksi masuk atau keluar memperbarui stok dan menyimpan riwayatnya. Aplikasi juga menolak transaksi keluar jika stok tidak mencukupi serta menampilkan jumlah barang dengan stok di bawah batas minimum.

## Fitur Utama

- Login dengan peran **Admin** dan **Staff**.
- Dashboard ringkasan total jenis barang, barang dengan stok menipis, dan jumlah stok.
- Pengelolaan data barang: tambah, lihat, cari, ubah, dan nonaktifkan barang.
- Pencatatan stok masuk dan stok keluar.
- Validasi agar jumlah transaksi positif dan stok tidak menjadi kurang dari kebutuhan transaksi keluar.
- Riwayat transaksi, termasuk barang dan pengguna yang mencatatnya.
- Antarmuka responsif dengan animasi ringan.

**Hak akses:**

| Fitur                              | Admin | Staff |
| ---------------------------------- | :---: | :---: |
| Melihat dashboard dan data barang  |  Ya   |  Ya   |
| Menambah atau mengubah data barang |  Ya   | Tidak |
| Mencatat stok masuk dan keluar     |  Ya   |  Ya   |
| Melihat riwayat transaksi          |  Ya   |  Ya   |

## Tech Stack

- **Next.js 14** (App Router) dan **React 18**
- **TypeScript**
- **Tailwind CSS**
- **NextAuth.js** untuk autentikasi
- **Prisma ORM**
- **MySQL**
- **bcryptjs** untuk hashing password

## Instalasi

### Prasyarat

- Node.js dan npm
- MySQL Server
- Git (opsional, untuk clone repository)

### 1. Ambil source code

Jika repository sudah tersedia:

```bash
git clone <URL-REPOSITORY>
cd inventory-sederhana
```

Atau buka folder project yang sudah ada di komputer.

### 2. Buat database

Buat database MySQL kosong:

```sql
CREATE DATABASE inventory_sederhana;
```

### 3. Pasang dependency dan konfigurasi environment

```bash
npm install
```

Salin file contoh konfigurasi:

```powershell
Copy-Item .env.example .env
```

Kemudian sesuaikan `.env` dengan konfigurasi MySQL lokal:

```env
DATABASE_URL="mysql://root:PASSWORD_KAMU@localhost:3306/inventory_sederhana"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ganti-dengan-secret-acak-minimal-32-karakter"
```

Ganti `root` dan `PASSWORD_KAMU` dengan kredensial MySQL Anda. Gunakan secret acak yang kuat untuk `NEXTAUTH_SECRET`; jangan gunakan contoh tersebut untuk deployment.

### 4. Siapkan skema dan data demo

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

Perintah seed membuat akun demo dan beberapa contoh barang. Seed dapat dijalankan ulang tanpa membuat akun atau barang duplikat.

### 5. Jalankan aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Untuk memeriksa build produksi:

```bash
npm run build
npm run start
```

Jangan jalankan `npm run build` bersamaan dengan server development pada folder project yang sama karena keduanya menggunakan output `.next`.

## Akun Demo

Akun berikut tersedia setelah menjalankan seed:

| Peran | Email                   | Password      |
| ----- | ----------------------- | ------------- |
| Admin | `admin@inventory.local` | `password123` |
| Staff | `staff@inventory.local` | `password123` |

Ganti kredensial demo sebelum aplikasi digunakan di lingkungan selain lokal.

## Alur Penggunaan

1. Login menggunakan akun Admin atau Staff.
2. Periksa ringkasan stok pada dashboard.
3. Admin dapat menambah atau mengelola barang melalui menu **Data Barang**.
4. Catat penambahan persediaan melalui **Stok Masuk**.
5. Catat pemakaian atau pengurangan persediaan melalui **Stok Keluar**.
6. Tinjau transaksi sebelumnya melalui **Riwayat**.

## Masalah Umum dan Solusi

### `Error: Cannot find module './276.js'`

Error ini dapat muncul ketika cache atau hasil kompilasi Next.js di `.next` tidak lengkap atau tidak sinkron—misalnya setelah server development dan build berjalan bersamaan.

1. Hentikan server Next.js yang sedang berjalan dengan `Ctrl+C`.
2. Hapus cache build dari root project:

   ```powershell
   Remove-Item .next -Recurse -Force
   ```

3. Jalankan kembali server development:

   ```bash
   npm run dev
   ```

Hapus `.next` hanya saat proses Next.js sudah dihentikan. Peringatan bahwa versi Next.js sudah usang merupakan informasi terpisah dari error missing module; tinjau dan uji pembaruan versi Next.js secara terpisah.

### Koneksi MySQL gagal

- Pastikan MySQL sedang berjalan dan database `inventory_sederhana` sudah dibuat.
- Periksa format `DATABASE_URL`, nama pengguna, password, host, dan port di `.env`.
- Setelah mengubah `.env`, mulai ulang server Next.js.
