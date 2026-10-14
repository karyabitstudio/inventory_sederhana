"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StokMasukPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [barangList, setBarangList] = useState<any[]>([]);
  const [barangId, setBarangId] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/barang").then((r) => r.json()).then(setBarangList);
    }
  }, [session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/stok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "MASUK", barangId, jumlah, keterangan }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error);
      return;
    }
    setMessage("Stok berhasil ditambahkan!");
    setBarangId("");
    setJumlah("");
    setKeterangan("");
  }

  if (status === "loading") return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b px-4 py-4">
        <div className="max-w-md mx-auto">
          <Link href="/dashboard" className="text-sm text-blue-600">← Dashboard</Link>
          <h1 className="font-bold text-lg">Stok Masuk</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes("berhasil") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-sm mb-1">Pilih Barang *</label>
            <select required value={barangId} onChange={(e) => setBarangId(e.target.value)} className="w-full border rounded-lg px-3 py-2">
              <option value="">— Pilih Barang —</option>
              {barangList.map((b) => (
                <option key={b.id} value={b.id}>{b.kode} - {b.nama} (stok: {b.stok})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Jumlah Masuk *</label>
            <input type="number" required min="1" value={jumlah} onChange={(e) => setJumlah(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm mb-1">Keterangan</label>
            <input value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Contoh: Pembelian dari supplier" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
            {loading ? "Memproses..." : "Tambah Stok"}
          </button>
        </form>
      </main>
    </div>
  );
}
