"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, menipis: 0, totalStok: 0 });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/barang")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setStats({
              total: data.length,
              menipis: data.filter((b: any) => b.stok <= b.stokMinimum).length,
              totalStok: data.reduce((sum: number, b: any) => sum + b.stok, 0),
            });
          }
        });
    }
  }, [session]);

  if (status === "loading") return <div className="p-8 text-slate-600">Loading...</div>;

  const menus = [
    { label: "Data Barang", href: "/dashboard/barang", desc: "Lihat & kelola barang" },
    { label: "Stok Masuk", href: "/dashboard/masuk", desc: "Tambah stok barang" },
    { label: "Stok Keluar", href: "/dashboard/keluar", desc: "Kurangi stok barang" },
    { label: "Riwayat", href: "/dashboard/riwayat", desc: "Lihat semua transaksi" },
  ];

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-5xl">
        <div className="glass-panel flex items-center justify-between rounded-2xl px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Dashboard</p>
            <h1 className="mt-1 text-xl font-bold text-slate-900">Inventory Sederhana</h1>
            <p className="text-sm text-slate-500">{session?.user?.name} ({(session?.user as any)?.role})</p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl py-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            { label: "Total Barang", value: stats.total, color: "text-blue-600", bg: "from-blue-500/10 to-blue-600/5" },
            { label: "Stok Menipis", value: stats.menipis, color: "text-amber-600", bg: "from-amber-500/10 to-amber-600/5" },
            { label: "Total Stok", value: stats.totalStok, color: "text-emerald-600", bg: "from-emerald-500/10 to-emerald-600/5" },
          ].map((card) => (
            <div
              key={card.label}
              className="dashboard-card animate-fade-up rounded-2xl p-5"
              style={{ animationDelay: `${Math.random() * 120}ms` }}
            >
              <div className={`mb-4 rounded-xl bg-gradient-to-br ${card.bg} p-3`}>
                <p className={`text-3xl font-black ${card.color}`}>{card.value}</p>
              </div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {menus.map((m, index) => (
            <Link
              key={m.href}
              href={m.href}
              className="dashboard-card animate-fade-up block rounded-2xl p-5"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="mb-3 inline-flex rounded-xl bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                Menu
              </div>
              <h3 className="text-lg font-bold text-slate-900">{m.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{m.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
