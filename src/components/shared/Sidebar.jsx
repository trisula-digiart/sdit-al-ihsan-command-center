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
  Sparkles,
  Compass,
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  {
    name: 'Executive Dashboard',
    href: '/executive',
    icon: LayoutDashboard,
  },
  {
    name: 'Sarpras & Fasilitas',
    href: '/sarpras',
    icon: Building,
  },
  {
    name: 'Internal Chat Hub',
    href: '/chat',
    icon: MessageSquare,
  },
  {
    name: 'Document Generator',
    href: '/documents',
    icon: FileText,
  },
  {
    name: 'Event Calendar',
    href: '/calendar',
    icon: Calendar,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="print:hidden hidden lg:flex flex-col w-64 bg-white/95 backdrop-blur-md text-emerald-950 h-screen border-r border-emerald-100 shrink-0 sticky top-0 shadow-lg shadow-emerald-900/5">
      {/* Header Branding - Nuansa Islami Cerah */}
      <div className="p-5 border-b border-emerald-100 flex items-center gap-3 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 flex items-center justify-center font-black text-white text-base shadow-md shadow-emerald-600/20 ring-2 ring-emerald-200">
          AI
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="font-extrabold text-sm text-emerald-950 tracking-wide truncate flex items-center gap-1">
            <span>SDIT AL IHSAN</span>
          </h1>
          <p className="text-[10px] text-emerald-700 font-bold tracking-tight truncate flex items-center gap-1">
            <Compass className="w-3 h-3 text-amber-500" />
            <span>Command Center</span>
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Navigasi Utama</span>
        </div>
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 ring-1 ring-emerald-500'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-amber-300' : 'text-emerald-600 group-hover:text-emerald-700'
                }`}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Status & Logout */}
      <div className="p-3 border-t border-emerald-100 space-y-2.5 bg-gradient-to-b from-white to-emerald-50/40">
        <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold text-emerald-950 truncate">Versi 1.0.0 (Production)</p>
            <p className="text-[9px] font-semibold text-emerald-700 truncate">Sistem Islami Terpadu</p>
          </div>
        </div>

        <Link
          href="/login"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 shrink-0 text-rose-500" />
          <span>Keluar Sistem</span>
        </Link>
      </div>
    </aside>
  );
}