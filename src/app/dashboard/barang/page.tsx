"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Barang = {
  id: string;
  kode: string;
  nama: string;
  kategori: string | null;
  satuan: string;
  stok: number;
  stokMinimum: number;
  hargaBeli: string | null;
  hargaJual: string | null;
};

export default function BarangPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [list, setList] = useState<Barang[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    kode: "", nama: "", kategori: "", satuan: "pcs", stok: "0", stokMinimum: "5", hargaBeli: "", hargaJual: "",
  });

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  async function fetchData() {
    const res = await fetch(`/api/barang?search=${search}`);
    setList(await res.json());
  }

  useEffect(() => {
    if (session) fetchData();
  }, [session, search]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/barang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create",
        ...form,
        stok: parseInt(form.stok),
        stokMinimum: parseInt(form.stokMinimum),
        hargaBeli: form.hargaBeli ? parseFloat(form.hargaBeli) : null,
        hargaJual: form.hargaJual ? parseFloat(form.hargaJual) : null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error);
      return;
    }
    setMessage("Barang berhasil ditambahkan!");
    setShowForm(false);
    setForm({ kode: "", nama: "", kategori: "", satuan: "pcs", stok: "0", stokMinimum: "5", hargaBeli: "", hargaJual: "" });
    fetchData();
  }

  if (status === "loading") return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <Link href="/dashboard" className="text-sm text-blue-600">← Dashboard</Link>
            <h1 className="font-bold text-lg">Data Barang</h1>
          </div>
          {isAdmin && (
            <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg">
              {showForm ? "Batal" : "+ Tambah"}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {message && (
          <div className={`p-3 rounded-lg text-sm ${message.includes("berhasil") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Cari nama / kode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />

        {showForm && isAdmin && (
          <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Kode *</label>
                <input required value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm">Nama *</label>
                <input required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm">Kategori</label>
                <input value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm">Satuan</label>
                <input value={form.satuan} onChange={(e) => setForm({ ...form, satuan: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm">Stok Awal</label>
                <input type="number" value={form.stok} onChange={(e) => setForm({ ...form, stok: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm">Stok Minimum</label>
                <input type="number" value={form.stokMinimum} onChange={(e) => setForm({ ...form, stokMinimum: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Simpan</button>
          </form>
        )}

        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3">Satuan</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{b.kode}</td>
                  <td className="px-4 py-3 font-medium">{b.nama}</td>
                  <td className="px-4 py-3">{b.stok}</td>
                  <td className="px-4 py-3">{b.satuan}</td>
                  <td className="px-4 py-3">
                    {b.stok <= b.stokMinimum ? (
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">Menipis</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Aman</span>
                    )}
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Belum ada barang</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
