"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RiwayatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/stok").then((r) => r.json()).then(setLogs);
    }
  }, [session]);

  if (status === "loading") return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="text-sm text-blue-600">← Dashboard</Link>
          <h1 className="font-bold text-lg">Riwayat Stok</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Barang</th>
                <th className="px-4 py-3">Tipe</th>
                <th className="px-4 py-3">Jumlah</th>
                <th className="px-4 py-3">Oleh</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{log.barang?.nama}</span>
                    <span className="text-xs text-gray-400 ml-1">({log.barang?.kode})</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      log.type === "MASUK" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {log.type === "MASUK" ? "+" : "-"}{log.jumlah} {log.barang?.satuan}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{log.user?.name}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Belum ada riwayat</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
