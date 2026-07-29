'use client';

import { useAutoLogout } from '../hooks/useAutoLogout';

export default function AutoLogoutListener() {
  // Jalankan pemantau inaktivitas 30 menit secara client-side
  useAutoLogout();

  return null;
}