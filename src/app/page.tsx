import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float-slow absolute -left-10 top-12 h-40 w-40 rounded-full bg-blue-200/60 blur-3xl" />
        <div className="animate-float-delay absolute bottom-16 right-8 h-48 w-48 rounded-full bg-violet-200/70 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl items-center justify-center">
        <div className="glass-panel animate-fade-up w-full max-w-xl rounded-3xl p-8 sm:p-10 shadow-[0_25px_80px_rgba(59,130,246,0.1)]">
          <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
            Smart Inventory
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Inventory <span className="text-blue-600">Sederhana</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Sistem stok barang yang lebih rapi, cepat, dan mudah dipantau untuk kebutuhan UMKM Anda.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="soft-glow inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-200 hover:scale-[1.02] hover:shadow-xl"
            >
              Masuk ke Sistem
            </Link>
            <div className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-500">
              Cek stok, catat masuk/keluar, dan pantau riwayat transaksi.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
