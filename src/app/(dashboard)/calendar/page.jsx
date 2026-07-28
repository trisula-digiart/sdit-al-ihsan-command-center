'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Tag,
  CheckCircle2,
  X,
  BookOpen,
  Users,
  Building,
} from 'lucide-react';

const INITIAL_EVENTS = [
  {
    id: 1,
    title: 'Rapat Koordinasi Dewan Guru & Staf',
    date: '2026-07-29',
    time: '08:00 - 10:00 WIB',
    location: 'Ruang Rapat Utama Lt. 2',
    category: 'Rapat',
    color: 'bg-emerald-500 text-white',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 2,
    title: 'Peringatan PHBI Tahun Baru Islam 1448 H',
    date: '2026-07-31',
    time: '07:30 - 11:30 WIB',
    location: 'Aula Masjid Al Ihsan',
    category: 'PHBI',
    color: 'bg-teal-600 text-white',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    id: 3,
    title: 'Ujian Asesmen Diagnostik Kelas 1-3',
    date: '2026-08-03',
    time: '08:00 - 11:00 WIB',
    location: 'Ruang Kelas Masing-masing',
    category: 'Akademik',
    color: 'bg-indigo-600 text-white',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    id: 4,
    title: 'Latihan Rutin Pramuka & Ekstrakurikuler',
    date: '2026-08-07',
    time: '14:00 - 16:00 WIB',
    location: 'Lapangan Utama SDIT Al Ihsan',
    category: 'Ekstrakurikuler',
    color: 'bg-amber-500 text-white',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
];

export default function EventCalendarPage() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    category: 'Akademik',
  });

  const categories = ['Semua', 'Akademik', 'Rapat', 'PHBI', 'Ekstrakurikuler'];

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    const categoryColors = {
      Akademik: 'bg-indigo-600 text-white',
      Rapat: 'bg-emerald-500 text-white',
      PHBI: 'bg-teal-600 text-white',
      Ekstrakurikuler: 'bg-amber-500 text-white',
    };

    const categoryBadges = {
      Akademik: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      Rapat: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      PHBI: 'bg-teal-50 text-teal-700 border-teal-200',
      Ekstrakurikuler: 'bg-amber-50 text-amber-700 border-amber-200',
    };

    const createdObj = {
      id: Date.now(),
      ...newEvent,
      color: categoryColors[newEvent.category] || 'bg-slate-600 text-white',
      badge: categoryBadges[newEvent.category] || 'bg-slate-50 text-slate-700 border-slate-200',
    };

    setEvents((prev) => [...prev, createdObj]);
    setIsModalOpen(false);
    setNewEvent({ title: '', date: '', time: '', location: '', category: 'Akademik' });
  };

  const filteredEvents = events.filter((ev) =>
    selectedCategory === 'Semua' ? true : ev.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-emerald-600" />
            <span>Event Calendar & Agenda Manager</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pusat penjadwalan kegiatan operasional, akademik, dan PHBI SDIT Al Ihsan.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agenda Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar View Box (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">Juli - Agustus 2026</h2>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                Hari Ini
              </button>
              <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 pb-2">
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span>Sab</span>
            <span>Min</span>
          </div>

          {/* Date Cells Sample */}
          <div className="grid grid-cols-7 gap-2">
            {[...Array(31)].map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const hasEvents = events.filter((e) => e.date === dateStr);

              return (
                <div
                  key={i}
                  className={`min-h-[75px] p-2 border rounded-xl flex flex-col justify-between transition-all ${
                    dayNum === 29
                      ? 'border-emerald-500 bg-emerald-50/30'
                      : 'border-slate-100 bg-slate-50/40 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      dayNum === 29
                        ? 'w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center'
                        : 'text-slate-700'
                    }`}
                  >
                    {dayNum}
                  </span>

                  <div className="space-y-1 mt-1">
                    {hasEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[9px] font-bold p-1 rounded truncate ${ev.color}`}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agenda Stream List (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Daftar Agenda Terjadwal</span>
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 hover:border-emerald-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ev.badge}`}>
                      {ev.category}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">{ev.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">{ev.title}</h4>
                  <div className="space-y-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ev.time || '08:00 WIB'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ev.location || 'SDIT Al Ihsan'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">
                Tidak ada agenda pada kategori ini.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal Form Tambah Agenda */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span>Tambah Agenda Sekolah Baru</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Nama Agenda / Kegiatan</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Contoh: Rapat Wali Kelas SDIT Al Ihsan"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Tanggal</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Kategori</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Rapat">Rapat</option>
                    <option value="PHBI">PHBI</option>
                    <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Waktu Waktu (WIB)</label>
                <input
                  type="text"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  placeholder="08:00 - 10:00 WIB"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Lokasi / Tempat</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Aula / Ruang Rapat"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}