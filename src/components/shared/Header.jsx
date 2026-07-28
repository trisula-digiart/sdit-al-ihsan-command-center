'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, Radio, Clock, X, CheckCheck, Info, AlertTriangle, MessageSquare } from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Laporan Kerusakan Sarpras Baru',
    desc: 'AC Ruang Kelas 3A mengalami kebocoran air.',
    time: '5 menit lalu',
    unread: true,
    type: 'warning',
  },
  {
    id: 2,
    title: 'Surat Tugas Butuh Approval',
    desc: 'Dokumen Pelatihan Kurikulum Merdeka Ustadz Ahmad Fauzi.',
    time: '25 menit lalu',
    unread: true,
    type: 'info',
  },
  {
    id: 3,
    title: 'Pesan Baru di Chat Hub',
    desc: 'Ustadz Abdullah: "Presensi Kelas 4B sudah lengkap."',
    time: '1 jam lalu',
    unread: true,
    type: 'chat',
  },
];

export default function Header({ currentRole = 'Kepala Sekolah' }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateClock();
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
  };

  const handleClearNotification = (e, id) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <header className="print:hidden bg-white border-b-2 border-emerald-200 h-16 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Search Input - High Contrast Text */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-emerald-700 absolute left-3 top-3 font-bold" />
          <input
            type="text"
            placeholder="Cari siswa, guru, fasilitas, atau dokumen..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900 font-bold placeholder-slate-500"
          />
        </div>
      </div>

      {/* Status Indicators & Profile */}
      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-black text-emerald-950 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-300">
          <Clock className="w-3.5 h-3.5 text-emerald-700" />
          <span>{timeString || 'Rabu, 29 Juli 2026'}</span>
        </div>

        {/* Realtime Status Indicator */}
        <div className="flex items-center gap-1.5 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full text-[11px] font-black text-emerald-900">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Realtime Active</span>
        </div>

        {/* Dynamic Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100 rounded-xl transition-colors relative font-bold"
            title="Notifikasi Sistem"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] bg-rose-600 text-white font-black text-[9px] rounded-full ring-2 ring-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dynamic Notifications Drawer */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border-2 border-emerald-200 rounded-2xl shadow-2xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-emerald-950">Notifikasi Terkini</h4>
                  {unreadCount > 0 && (
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {unreadCount} Baru
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-slate-500 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-emerald-50 max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleMarkAsRead(item.id)}
                      className={`p-3.5 text-xs hover:bg-emerald-50 cursor-pointer transition-colors flex items-start gap-3 relative group ${
                        item.unread ? 'bg-emerald-50/60 font-bold' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.type === 'warning' && (
                          <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        )}
                        {item.type === 'info' && (
                          <div className="p-1.5 bg-teal-100 text-teal-800 rounded-lg">
                            <Info className="w-4 h-4" />
                          </div>
                        )}
                        {item.type === 'chat' && (
                          <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between">
                          <p className={`font-black ${item.unread ? 'text-emerald-950' : 'text-slate-800'}`}>
                            {item.title}
                          </p>
                          {item.unread && (
                            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-700 font-semibold mt-0.5 leading-snug line-clamp-2">
                          {item.desc}
                        </p>
                        <p className="text-[9px] font-extrabold text-emerald-800 mt-1">{item.time}</p>
                      </div>

                      <button
                        onClick={(e) => handleClearNotification(e, item.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-600 p-1 transition-opacity absolute right-2 top-2"
                        title="Hapus Notifikasi"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs font-bold text-slate-500">
                    Tidak ada notifikasi saat ini.
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-emerald-100 flex items-center justify-between bg-emerald-50">
                  <button
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0}
                    className="text-[11px] text-emerald-800 font-black hover:underline flex items-center gap-1.5 disabled:opacity-50 disabled:no-underline"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Tandai Semua Dibaca</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Badge */}
        <div className="flex items-center gap-2 pl-2 border-l-2 border-emerald-200">
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs shadow-md ring-2 ring-emerald-300">
            {currentRole === 'Kepala Sekolah' ? 'KS' : currentRole === 'Guru / Wali Kelas' ? 'GR' : 'ST'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-black text-emerald-950 leading-none">
              {currentRole === 'Kepala Sekolah' ? 'H. Ahmad Dahlan, M.Pd' : currentRole === 'Guru / Wali Kelas' ? 'Ustadz Abdullah' : 'Staf Sarpras'}
            </p>
            <p className="text-[10px] text-emerald-800 font-extrabold mt-0.5">{currentRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}