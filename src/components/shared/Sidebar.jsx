'use client';

/* STREAMING_CHUNK:Importing React hooks and Lucide icons... */
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
LayoutDashboard,
Building2,
MessageSquare,
FileText,
Calendar,
Database,
Settings
} from 'lucide-react';

/* STREAMING_CHUNK:Defining navigation links configuration... */
const NAV_ITEMS = [
{ name: 'Executive Dashboard', path: '/executive', icon: LayoutDashboard },
{ name: 'Sarpras Tracker', path: '/sarpras', icon: Building2 },
{ name: 'Chat Hub Internal', path: '/chat', icon: MessageSquare },
{ name: 'Document Generator', path: '/documents', icon: FileText },
{ name: 'Kalender Acara', path: '/calendar', icon: Calendar },
];

/* STREAMING_CHUNK:Rendering Sidebar component... */
export default function Sidebar({ currentRole, setCurrentRole }) {
const pathname = usePathname();

return (


{/* Header Branding */}


AI


SDIT AL IHSAN
Command Center v1.0



    {/* Role Switcher Bar (RBAC Simulator) */}
    <div className="p-3 bg-emerald-950/50 m-3 rounded-lg border border-emerald-800/40">
      <label className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 block mb-1">
        Simulasi Akses Role (RBAC)
      </label>
      <select
        value={currentRole}
        onChange={(e) => setCurrentRole && setCurrentRole(e.target.value)}
        className="w-full bg-emerald-900 text-emerald-100 text-xs rounded border border-emerald-700 p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
      >
        <option value="kepsek">👑 Kepala Sekolah</option>
        <option value="guru">👨‍🏫 Guru / Wali Kelas</option>
        <option value="sarpras">🛠️ Staf Admin / Sarpras</option>
      </select>
    </div>

    {/* Navigation Items */}
    <nav className="p-3 space-y-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path || (pathname === '/' && item.path === '/executive');
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              isActive
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  </div>

  {/* User Info Footer */}
  <div className="p-4 border-t border-emerald-800/60 bg-emerald-950/30 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white">
        {currentRole === 'kepsek' ? 'KS' : currentRole === 'guru' ? 'GR' : 'ADM'}
      </div>
      <div>
        <p className="text-xs font-semibold text-emerald-100">
          {currentRole === 'kepsek' ? 'H. Sulaiman, M.Pd.' : currentRole === 'guru' ? 'Siti Rahma, S.Pd.' : 'Hendra S.'}
        </p>
        <p className="text-[10px] text-emerald-400 capitalize">{currentRole || 'kepsek'}</p>
      </div>
    </div>
    <Settings size={16} className="text-emerald-400 hover:text-white cursor-pointer" />
  </div>
</aside>


);
}