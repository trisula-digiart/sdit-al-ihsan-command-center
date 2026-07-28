import './globals.css';

export const metadata = {
  title: 'SDIT Al Ihsan - Integrated Command Center',
  description: 'Pusat Kendali Terpadu Operasional, Akademik, dan Fasilitas SDIT Al Ihsan',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}