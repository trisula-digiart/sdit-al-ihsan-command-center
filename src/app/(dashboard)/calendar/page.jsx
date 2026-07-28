'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, User, Clock, CheckCircle2 } from 'lucide-react';

const INITIAL_EVENTS = [
  { id: 1, title: 'Kajian Subuh & Tarhib Ramadhan', date: '2026-08-05', time: '05:00 WIB', category: 'PHBI', pj: 'Ustadz Ahmad', status: 'Terjadwal' },
  { id: 2, title: 'Ujian Tengah Semester Gasal', date: '2026-08-12', time: '07:30 WIB', category: 'Akademik', pj: 'Bu Siti Rahma', status: 'Persiapan' },
  { id: 3, title: 'Rapat Koordinasi Evaluasi Sarpras', date: '2026-08-18', time: '13:00 WIB', category: 'Rapat Internal', pj: 'Pak Hendra Admin', status: 'Draft' },
];

export default function CalendarPage() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '08:00 WIB',
    category: 'Akademik',
    pj: ''
  });

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    setEvents([...events, { ...newEvent, id: Date.now(), status: 'Terjadwal' }]);
    setNewEvent({ title: '', date: '', time: '08:00 WIB', category: 'Akademik', pj: '' });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="text-emerald-600" size={20} />
            Kalender Agenda & Kegiatan Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Penanggalan kegiatan akademik, keagamaan (PHBI), dan rapat internal SDIT Al Ihsan.
          </p>
        </div>

        <div className="bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-emerald-600" />
          {events.length} Agenda Terjadwal
        </div>
      </div>

      {/* Form Tambah Agenda Baru */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
          <Plus size={16} className="text-emerald-600" />
          Jadwalkan Kegiatan Baru
        </h3>

        <form onSubmit={handleAddEvent} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Nama Kegiatan / Agenda..."
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            required
          />

          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
            required
          />

          <select
            value={newEvent.category}
            onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
            className="border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
          >
            <option value="Akademik">Akademik</option>
            <option value="PHBI">PHBI (Keagamaan)</option>
            <option value="Rapat Internal">Rapat Internal</option>
            <option value="Ekstrakurikuler">Ekstrakurikuler</option>
          </select>

          <input
            type="text"
            placeholder="Penanggung Jawab (PJ)..."
            value={newEvent.pj}
            onChange={(e) => setNewEvent({ ...newEvent, pj: e.target.value })}
            className="border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs py-2.5 px-4 transition flex items-center justify-center gap-1 shadow-sm"
          >
            <Plus size={16} /> Simpan Agenda
          </button>
        </form>
      </div>

      {/* Grid List Event Cards */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
          Daftar Agenda Mendatang (Tahun Ajaran 2026/2027)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 hover:border-emerald-400 hover:bg-white transition-all space-y-3 shadow-2xs"
            >
              <div className="flex justify-between items-start">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    evt.category === 'PHBI'
                      ? 'bg-purple-50 text-purple-800 border-purple-200'
                      : evt.category === 'Akademik'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {evt.category}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  <Clock size={12} /> {evt.time}
                </span>
              </div>

              <h4 className="font-bold text-xs text-slate-800 leading-snug">{evt.title}</h4>

              <div className="text-[11px] text-slate-600 space-y-1 border-t border-slate-200/80 pt-2.5">
                <p className="flex items-center gap-1">
                  🗓️ Tanggal: <span className="font-semibold text-slate-800">{evt.date}</span>
                </p>
                <p className="flex items-center gap-1">
                  <User size={12} className="text-slate-400" /> PJ: <span className="font-semibold text-slate-800">{evt.pj || 'Panitia Sekolah'}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}