'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 Menit dalam Milidetik

export default function AutoLogoutListener() {
  const router = useRouter();
  const timerRef = useRef(null);

  const handleLogout = useCallback(async () => {
    try {
      if (supabase && supabase.auth) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Error auto-logging out:', error);
    } finally {
      // Redirect paksa ke halaman login dengan query parameter session_expired
      router.push('/login?expired=1');
      router.refresh();
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
    // Event listener aktivitas user (Mouse, Keyboard, Scroll, Touch)
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    // Inisialisasi timer pertama kali
    resetTimer();

    // Attach event listeners
    const handleUserActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Cleanup listeners saat unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [resetTimer]);

  return null;
}