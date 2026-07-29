'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Waktu Inaktivitas: 30 Menit (30 * 60 * 1000 ms = 1.800.000 ms)
const INACTIVITY_LIMIT = 30 * 60 * 1000;

export function useAutoLogout() {
  const router = useRouter();
  const timerRef = useRef(null);

  const handleLogout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_session');

      // Hapus session cookie
      document.cookie =
        'user_session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

      alert(
        'Sesi Anda telah berakhir karena tidak ada aktivitas selama 30 menit. Silakan login kembali.'
      );

      router.push('/login');
    }
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_LIMIT);
  }, [handleLogout]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const events = [
      'mousemove',
      'keydown',
      'click',
      'scroll',
      'touchstart',
      'wheel',
    ];

    resetTimer();

    const handleUserActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [resetTimer]);
}