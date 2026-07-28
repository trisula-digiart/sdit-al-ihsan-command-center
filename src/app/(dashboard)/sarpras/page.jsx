'use client';

/* STREAMING_CHUNK:Importing React hooks and Lucide icons for Sarpras page... */
import React, { useState } from 'react';
import {
Building2,
Plus,
Search,
Filter,
CheckCircle2,
AlertTriangle,
Clock,
Wrench,
ShieldAlert
} from 'lucide-react';

/* STREAMING_CHUNK:Defining Mock Data for Sarpras Assets... */
const INITIAL_SARPRAS = [
{ id: 'SAR-01', name: 'Gedung A - Kelas 1 Al-Fatih', category: 'Ruang Kelas', status: 'Baik', lastCheck: '2026-07-25', reportedBy: 'Pak Ustadz Ahmad' },
{ id: 'SAR-02', name: 'AC Ruang Guru Lantai 2', category: 'Elektronik', status: 'Perlu Perbaikan', lastCheck: '2026-07-27', reportedBy: 'Bu Siti Rahma' },
{ id: 'SAR-03', name: 'Proyektor Lab Komputer', category: 'Fasilitas Belajar', status: 'Dalam Perawatan', lastCheck: '2026-07-28', reportedBy: 'Pak Hendra Admin' },
{ id: 'SAR-04', name: 'Lapangan Olahraga Utama', category: 'Fasilitas Umum', status: 'Baik', lastCheck: '2026-07-20', reportedBy: 'Pak Ridwan PJ OK' },
{ id: 'SAR-05', name: 'Toilet Murid Lt. 1', category: 'Sanitasi', status: 'Perlu Perbaikan', lastCheck: '2026-07-28', reportedBy: 'Ibu Maryam' },
];

/* STREAMING_CHUNK:Rendering Sarpras Tracker Component... */
export default function SarprasTrackerPage() {
const [sarprasData, setSarprasData] = useState(INITIAL_SARPRAS);
const [searchTerm, setSearchTerm] = useState('');
const [selectedCategory, setSelectedCategory] = useState('Semua');

const [newIssue, setNewIssue] = useState({
name: '',
category: 'Ruang Kelas',
status: 'Perlu Perbaikan',
reportedBy: ''
});

/* STREAMING_CHUNK:Handling New Sarpras Asset Submission... */
const handleAddSarpras = (e) => {
e.preventDefault();
if (!newIssue.name) return;
const item = {
id: SAR-0${sarprasData.length + 1},
name: newIssue.name,
category: newIssue.category,
status: newIssue.status,
lastCheck: new Date().toISOString().split('T')[0],
reportedBy: newIssue.reportedBy || 'Staf Operasional'
};
setSarprasData([item, ...sarprasData]);
setNewIssue({ name: '', category: 'Ruang Kelas', status: 'Perlu Perbaikan', reportedBy: '' });
};

/* STREAMING_CHUNK:Handling Toggle Status Cycle... */
const toggleSarprasStatus = (id) => {
setSarprasData(
sarprasData.map((item) => {
if (item.id === id) {
const nextStatus =
item.status === 'Perlu Perbaikan'
? 'Dalam Perawatan'
: item.status === 'Dalam Perawatan'
? 'Baik'
: 'Perlu Perbaikan';
return { ...item, status: nextStatus };
}
return item;
})
);
};

const filteredData = sarprasData.filter((item) => {
const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
item.id.toLowerCase().includes(searchTerm.toLowerCase());
const matchesCat = selectedCategory === 'Semua' || item.category === selectedCategory;
return matchesSearch && matchesCat;
});

return (


  {/* Header Info Banner */}
  <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Building2 className="text-emerald-600" size={20} />
        Pemeliharaan Sarpras & Fasilitas Gedung
      </h2>
      <p className="text-xs text-slate-500 mt-1">
        Pencatatan inventaris, pelaporan kerusakan, dan alur perbaikan aset SDIT Al Ihsan.
      </p>
    </div>

    <div className="flex items-center gap-2 text-xs">
      <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1.5">
        <CheckCircle2 size={14} />
        {sarprasData.filter((s) => s.status === 'Baik').length} Baik
      </div>
      <div className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200 font-semibold flex items-center gap-1.5">
        <AlertTriangle size={14} />
        {sarprasData.filter((s) => s.status !== 'Baik').length} Perlu Penanganan
      </div>
    </div>
  </div>

  {/* Form Tambah Log Sarpras Baru */}
  <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
      <Plus size={16} className="text-emerald-600" />
      Tambah Laporan Kerusakan / Log Aset Baru
    </h3>

    <form onSubmit={handleAddSarpras} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
      <input
        type="text"
        placeholder="Nama Fasilitas / Aset..."
        value={newIssue.name}
        onChange={(e) => setNewIssue({ ...newIssue, name: e.target.value })}
        className="border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        required
      />

      <select
        value={newIssue.category}
        onChange={(e) => setNewIssue({ ...newIssue, category: e.target.value })}
        className="border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
      >
        <option value="Ruang Kelas">Ruang Kelas</option>
        <option value="Elektronik">Elektronik</option>
        <option value="Fasilitas Belajar">Fasilitas Belajar</option>
        <option value="Fasilitas Umum">Fasilitas Umum</option>
        <option value="Sanitasi">Sanitasi</option>
      </select>

      <select
        value={newIssue.status}
        onChange={(e) => setNewIssue({ ...newIssue, status: e.target.value })}
        className="border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
      >
        <option value="Perlu Perbaikan">Perlu Perbaikan</option>
        <option value="Dalam Perawatan">Dalam Perawatan</option>
        <option value="Baik">Baik</option>
      </select>

      <input
        type="text"
        placeholder="Pelapor (Guru / Staf)..."
        value={newIssue.reportedBy}
        onChange={(e) => setNewIssue({ ...newIssue, reportedBy: e.target.value })}
        className="border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
      />

      <button
        type="submit"
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs py-2.5 px-4 transition flex items-center justify-center gap-1 shadow-sm"
      >
        <Plus size={16} /> Simpan Log
      </button>
    </form>
  </div>

  {/* Filter & Search Bar */}
  <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
    <div className="relative w-full sm:w-72">
      <Search size={16} className="absolute left-3 top-3 text-slate-400" />
      <input
        type="text"
        placeholder="Cari nama fasilitas / ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
      />
    </div>

    <div className="flex items-center gap-2 w-full sm:w-auto">
      <Filter size={16} className="text-slate-400" />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="text-xs border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
      >
        <option value="Semua">Semua Kategori</option>
        <option value="Ruang Kelas">Ruang Kelas</option>
        <option value="Elektronik">Elektronik</option>
        <option value="Fasilitas Belajar">Fasilitas Belajar</option>
        <option value="Fasilitas Umum">Fasilitas Umum</option>
        <option value="Sanitasi">Sanitasi</option>
      </select>
    </div>
  </div>

  {/* Tabel Inventaris Sarpras */}
  <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
          <tr>
            <th className="p-3.5">Kode ID</th>
            <th className="p-3.5">Fasilitas / Lokasi</th>
            <th className="p-3.5">Kategori</th>
            <th className="p-3.5">Pelapor</th>
            <th className="p-3.5">Pemeriksaan Terakhir</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5 text-right">Aksi Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filteredData.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/80 transition">
              <td className="p-3.5 font-mono font-medium text-slate-500">{item.id}</td>
              <td className="p-3.5 font-bold text-slate-800">{item.name}</td>
              <td className="p-3.5 text-slate-600">{item.category}</td>
              <td className="p-3.5 text-slate-600">{item.reportedBy}</td>
              <td className="p-3.5 text-slate-500">{item.lastCheck}</td>
              <td className="p-3.5">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    item.status === 'Baik'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : item.status === 'Dalam Perawatan'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="p-3.5 text-right">
                <button
                  onClick={() => toggleSarprasStatus(item.id)}
                  className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 font-medium transition"
                >
                  Ubah Status
                </button>
              </td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center p-8 text-slate-400">
                Tidak ditemukan data sarpras yang sesuai.
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