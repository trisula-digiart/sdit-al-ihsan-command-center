'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  MessageSquare,
  FileText,
  Calendar,
  GraduationCap,
  LogOut,
  Sparkles,
  Compass,
  CalendarCheck2,
  Wallet,
  Settings,
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  {
    name: 'Executive Dashboard',
    href: '/executive',
    icon: LayoutDashboard,
    roles: ['kepsek', 'guru'],
  },
  {
    name: 'Data Seluruh Siswa',
    href: '/students',
    icon: GraduationCap,
    roles: ['kepsek'], // HANYA KEPSEK
  },
  {
    name: 'Data Absensi Siswa', // RE-LABEL SESUAI PERMINTAAN USER
    href: '/attendance',
    icon: CalendarCheck2,
    roles: ['kepsek', 'guru'],
  },
  {
    name: 'Keuangan & SPP',
    href: '/finance',
    icon: Wallet,
    roles: ['kepsek', 'guru'],
  },
  {
    name: 'Sarpras & Fasilitas',
    href: '/sarpras',
    icon: Building,
    roles: ['kepsek', 'guru'],
  },
  {
    name: 'Internal Chat Hub',
    href: '/chat',
    icon: MessageSquare,
    roles: ['kepsek', 'guru'],
  },
  {
    name: 'Document Generator',
    href: '/documents',
    icon: FileText,
    roles: ['kepsek', 'guru'],
  },
  {
    name: 'Event Calendar',
    href: '/calendar',
    icon: Calendar,
    roles: ['kepsek', 'guru'],
  },
  {
    name: 'Pengaturan Sekolah',
    href: '/settings',
    icon: Settings,
    roles: ['kepsek'], // HANYA KEPSEK
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState('kepsek');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.role) {
            setUserRole(parsed.role);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const filteredNavItems = NAVIGATION_ITEMS.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside className="print:hidden hidden lg:flex flex-col w-64 bg-white text-emerald-950 h-screen border-r-2 border-emerald-200 shrink-0 sticky top-0 shadow-md">
      {/* Header Branding */}
      <div className="p-5 border-b-2 border-emerald-100 flex items-center gap-3 bg-gradient-to-r from-emerald-100/70 via-emerald-50 to-white">
        <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center font-black text-white text-base shadow-md ring-2 ring-emerald-300">
          AI
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="font-black text-sm text-emerald-950 tracking-wide truncate">
            SDIT AL IHSAN
          </h1>
          <p className="text-[10px] text-emerald-800 font-extrabold tracking-tight truncate flex items-center gap-1">
            <Compass className="w-3 h-3 text-amber-600" />
            <span>Command Center</span>
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="px-3 pb-2 text-[11px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Navigasi Utama</span>
        </div>
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all duration-150 group ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-md ring-1 ring-emerald-800'
                  : 'text-slate-800 hover:text-emerald-950 hover:bg-emerald-100/60 border border-transparent hover:border-emerald-200'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                  isActive ? 'text-amber-300' : 'text-emerald-700 group-hover:text-emerald-900'
                }`}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info & Logout */}
      <div className="p-3 border-t-2 border-emerald-100 space-y-2.5 bg-emerald-50/50">
        <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-sm flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black text-emerald-950 truncate">Versi 1.0.0 (Production)</p>
            <p className="text-[10px] font-bold text-emerald-800 truncate">Sistem Islami Terpadu</p>
          </div>
        </div>

        <Link
          href="/login"
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('user_session');
            }
          }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black text-rose-700 hover:text-rose-900 hover:bg-rose-100/70 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0 text-rose-600" />
          <span>Keluar Sistem</span>
        </Link>
      </div>
    </aside>
  );
}