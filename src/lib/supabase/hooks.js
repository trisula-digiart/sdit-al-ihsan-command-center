'use client';

import { useState, useEffect } from 'react';
import { supabase } from './client';

/**
 * Custom Hook untuk membaca dan memperbarui Role pengguna aktif
 */
export function useUserRole() {
  const [role, setRole] = useState('Kepala Sekolah');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('user_role');
      if (savedRole) {
        setRole(savedRole);
      }
      setLoading(false);
    }
  }, []);

  const changeRole = (newRole) => {
    setRole(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_role', newRole);
    }
  };

  return { role, changeRole, loading };
}

/**
 * Custom Hook untuk berlangganan Realtime Chat Pesan dari Supabase
 */
export function useSupabaseChat(channelName = 'general') {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Jalankan subskripsi channel realtime
    const channel = supabase
      .channel(`public:chat_messages:${channelName}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName]);

  const sendMessage = async (sender, role, text) => {
    const newMessage = {
      id: Date.now(),
      sender_name: sender,
      sender_role: role,
      channel: channelName,
      message_text: text,
      created_at: new Date().toISOString(),
    };

    // Optimistic UI Update
    setMessages((prev) => [...prev, newMessage]);

    // Kirim ke database Supabase
    try {
      await supabase.from('chat_messages').insert([newMessage]);
    } catch (err) {
      console.warn('Simulasi Realtime Chat (Supabase Offline Mode):', err);
    }
  };

  return { messages, sendMessage };
}