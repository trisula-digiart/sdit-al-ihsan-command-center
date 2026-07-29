import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import Header from '@/components/shared/Header';
import AutoLogoutListener from '@/components/shared/AutoLogoutListener';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Listener Client Auto Logout 30 Menit */}
      <AutoLogoutListener />

      {/* Sidebar Navigasi Utama */}
      <Sidebar />

      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900/50">
          {children}
        </main>

        {/* Footer Minimalis */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-3 text-center text-[11px] text-slate-500 font-medium shrink-0">
          SDIT AL IHSAN Command Center Portal • Enterprise Monitoring System
        </footer>
      </div>
    </div>
  );
}