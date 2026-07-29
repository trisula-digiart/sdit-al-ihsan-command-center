import React from 'react';
import '@/app/globals.css';

export const metadata = {
  title: 'SDIT AL IHSAN - Integrated Command Center System',
  description:
    'Sistem tata kelola komprehensif SDIT Al Ihsan untuk pemantauan akademik harian, presensi otomatis, transparansi SPP, dan pengelolaan dokumen resmi sekolah.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}