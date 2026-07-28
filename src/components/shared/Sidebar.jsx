'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  MessageSquare,
  FileText,
  Calendar,
  LogOut,
  ShieldAlert,
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  {
    name: 'Executive Dashboard',
    href: '/executive',
    icon: LayoutDashboard,
    roles: ['Kepala Sekolah', 'Administrator'],
  },
  {
    name: 'Sarpras & Fasilitas',
    href: '/sarpras',
    icon: Building,
    roles: ['Kepala Sekolah', 'Staf Sarpras', 'Administrator'],
  },
  {
    name: 'Internal Chat Hub',
    href: '/chat',
    icon: MessageSquare,
    roles: ['Semua Peran'],
  },
  {
    name: 'Document Generator',
    href: '/documents',
    icon: FileText,
    roles: ['Kepala Sekolah', 'Guru', 'Administrator'],
  },
  {
    name: 'Event Calendar',
    href: '/calendar',
    icon: Calendar,
    roles: ['Semua Peran'],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-200 h-screen border-r border-slate-800 shrink-0">
      {/* Header Branding */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-white text-base shadow-md shadow-emerald-900/30">
          AI
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="font-bold text-sm text-white tracking-wide truncate">
            SDIT AL IHSAN
          </h1>
          <p className="text-[10px] text-emerald-400 font-medium tracking-tight truncate">
            Integrated Command Center
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Menu Utama
        </div>
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                }`}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info & Logout */}
      <div className="p-3 border-t border-slate-800 space-y-3">
        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-white truncate">Versi 1.0.0 (Production)</p>
            <p className="text-[9px] text-slate-400 truncate">Sistem Aktif Terintegrasi</p>
          </div>
        </div>

        <Link
          href="/login"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Keluar Sistem</span>
        </Link>
      </div>
    </aside>
  );
}