'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, Radio, Clock, X } from 'lucide-react';

export default function Header({ currentRole = 'Kepala Sekolah' }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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

  const dummyNotifications = [
    { id: 1, title: 'Laporan Kerusakan Sarpras Baru', time: '10 menit lalu', unread: true },
    { id: 2, title: 'Surat Tugas Guru Butuh Approval', time: '30 menit lalu', unread: true },
    { id: 3, title: 'Presensi Kehadiran Kelas 4B Lengkap', time: '1 jam lalu', unread: false },
  ];

  return (
    <header className="print:hidden bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Search Input & Date */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari siswa, guru, fasilitas, atau dokumen..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
          />
        </div>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{timeString || 'Rabu, 29 Juli 2026'}</span>
        </div>

        {/* Realtime Status Indicator */}
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-700">
          <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span>Realtime Active</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Drawer */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">Notifikasi Terbaru</h4>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {dummyNotifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                      item.unread ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <button className="text-[11px] text-emerald-600 font-semibold hover:underline">
                  Tandai Semua Sudah Dibaca
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {currentRole === 'Kepala Sekolah' ? 'KS' : currentRole === 'Guru / Wali Kelas' ? 'GR' : 'ST'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-none">
              {currentRole === 'Kepala Sekolah' ? 'H. Ahmad Dahlan, M.Pd' : currentRole === 'Guru / Wali Kelas' ? 'Ustadz Abdullah' : 'Staf Sarpras'}
            </p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">{currentRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}