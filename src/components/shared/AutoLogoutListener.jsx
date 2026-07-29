'use client';

import { useAutoLogout } from '@/hooks/useAutoLogout';

export default function AutoLogoutListener() {
  // Panggil Hook Inaktivitas 30 Menit di Sisi Client
  useAutoLogout();

  return null; // Komponen invisible khusus pemantau aktivitas
}