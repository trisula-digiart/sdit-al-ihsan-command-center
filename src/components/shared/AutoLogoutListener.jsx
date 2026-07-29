'use client';

import { useAutoLogout } from '../../hooks/useAutoLogout';

export default function AutoLogoutListener() {
  // Panggil listener inaktivitas 30 menit secara client-side
  useAutoLogout();

  return null;
}