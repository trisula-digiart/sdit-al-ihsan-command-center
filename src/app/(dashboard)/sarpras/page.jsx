'use client';

import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  PlusCircle,
  Building,
  Hammer,
  Search,
  Filter,
} from 'lucide-react';

export default function SarprasPage() {
  const [sarprasData, setSarprasData] = useState([
    {
      id: 'SAR-01',
      name: 'AC Ruang Kelas 3A',
      category: 'Fasilitas Kelas',
      status: 'Butuh Perbaikan',
      location: 'Gedung A - Lt 2',
      reportedAt: '2 Jam lalu',
      priority: 'Tinggi',
    },
    {
      id: 'SAR-02',
      name: 'Proyektor Lab Komputer',
      category: 'Perangkat Elektronik',
      status: 'Sedang Diperbaiki',
      location: 'Gedung B - Lt 1',
      reportedAt: '1 Hari lalu',
      priority: 'Sedang',
    },
    {
      id: 'SAR-03',
      name: 'Kran Air Tempat Wudhu Utama',
      category: 'Sanitasi & Kebersihan',
      status: 'Selesai',
      location: 'Area Masjid',
      reportedAt: '3 Hari lalu',
      priority: 'Rendah',
    },
    {
      id: 'SAR-04',
      name: 'Pintu Lapangan Olahraga',
      category: 'Infrastruktur',
      status: 'Butuh Perbaikan',
      location: 'Area Luar',
      reportedAt: '4 Jam lalu',
      priority: 'Sedang',
    },
  ]);

  const [newIssue, setNewIssue] = useState({
    name: '',
    category: 'Fasilitas Kelas',
    location: '',
    priority: 'Sedang',
  });

  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddIssue = (e) => {
    e.preventDefault();
    if (!newIssue.name) return;

    const item = {
      id: `SAR-0${sarprasData.length + 1}`,
      name: newIssue.name,
      category: newIssue.category,
      status: 'Butuh Perbaikan',
      location: newIssue.location || 'Lingkungan Sekolah',
      reportedAt: 'Baru saja',
      priority: newIssue.priority,
    };

    setSarprasData([item, ...sarprasData]);
    setNewIssue({ name: '', category: 'Fasilitas Kelas', location: '', priority: 'Sedang' });
    setShowForm(false);
  };

  const handleToggleStatus = (id) => {
    setSarprasData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.status === 'Butuh Perbaikan'
              ? 'Sedang Diperbaiki'
              : item.status === 'Sedang Diperbaiki'
              ? 'Selesai'
              : 'Butuh Perbaikan';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const filteredData = sarprasData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Sarpras & Building Facilities Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pemantauan kondisi fisik gedung, fasilitas kelas, dan perbaikan aset SDIT Al Ihsan.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all text-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Laporkan Kerusakan Baru</span>
        </button>
      </div>

      {/* Form Tambah Kerusakan */}
      {showForm && (
        <form
          onSubmit={handleAddIssue}
          className="p-5 bg-white border border-emerald-200 rounded-2xl shadow-md space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            Form Laporan Kerusakan Sarpras
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Nama Fasilitas / Aset</label>
              <input
                type="text"
                value={newIssue.name}
                onChange={(e) => setNewIssue({ ...newIssue, name: e.target.value })}
                placeholder="Contoh: Lampu Ruang Guru Redup"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Kategori</label>
              <select
                value={newIssue.category}
                onChange={(e) => setNewIssue({ ...newIssue, category: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Fasilitas Kelas">Fasilitas Kelas</option>
                <option value="Perangkat Elektronik">Perangkat Elektronik</option>
                <option value="Sanitasi & Kebersihan">Sanitasi & Kebersihan</option>
                <option value="Infrastruktur">Infrastruktur</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Lokasi Detail</label>
              <input
                type="text"
                value={newIssue.location}
                onChange={(e) => setNewIssue({ ...newIssue, location: e.target.value })}
                placeholder="Contoh: Gedung C Lt 1"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              Kirim Laporan
            </button>
          </div>
        </form>
      )}

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-rose-50/70 border border-rose-100 rounded-2xl flex items-center gap-3">
          <div className="p-3 bg-rose-600 text-white rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-rose-800">Butuh Perbaikan</p>
            <p className="text-xl font-bold text-rose-900">
              {sarprasData.filter((i) => i.status === 'Butuh Perbaikan').length} Aset
            </p>
          </div>
        </div>

        <div className="p-4 bg-amber-50/70 border border-amber-100 rounded-2xl flex items-center gap-3">
          <div className="p-3 bg-amber-500 text-white rounded-xl">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-amber-800">Sedang Diperbaiki</p>
            <p className="text-xl font-bold text-amber-900">
              {sarprasData.filter((i) => i.status === 'Sedang Diperbaiki').length} Aset
            </p>
          </div>
        </div>

        <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center gap-3">
          <div className="p-3 bg-emerald-600 text-white rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-800">Selesai/Kondisi Baik</p>
            <p className="text-xl font-bold text-emerald-900">
              {sarprasData.filter((i) => i.status === 'Selesai').length} Aset
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari fasillitas atau lokasi..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Menampilkan <span className="font-bold text-slate-700">{filteredData.length}</span> dari {sarprasData.length} item
          </div>
        </div>

        {/* Tabel Sarpras */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="p-3.5 font-bold">Kode Aset</th>
                <th className="p-3.5 font-bold">Fasilitas / Lokasi</th>
                <th className="p-3.5 font-bold">Kategori</th>
                <th className="p-3.5 font-bold">Status Pemeliharaan</th>
                <th className="p-3.5 font-bold">Waktu Lapor</th>
                <th className="p-3.5 font-bold text-center">Aksi Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-600">{item.id}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3" />
                        {item.location}
                      </p>
                    </td>
                    <td className="p-3.5 text-slate-600 font-medium">{item.category}</td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          item.status === 'Butuh Perbaikan'
                            ? 'bg-rose-100 text-rose-700'
                            : item.status === 'Sedang Diperbaiki'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.reportedAt}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md text-[11px] transition-colors"
                      >
                        Ubah Status
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    Tidak ada data kerusakan fasilitas yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}