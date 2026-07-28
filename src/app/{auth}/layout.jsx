import '../globals.css';

export const metadata = {
  title: 'Login - SDIT Al Ihsan Command Center',
  description: 'Halaman Masuk Otentikasi SDIT Al Ihsan',
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 antialiased">
      {children}
    </div>
  );
}