'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Send,
  MessageSquare,
  Users,
  Search,
  Building,
  GraduationCap,
  ShieldCheck,
  Smile,
  Paperclip,
  Radio,
  Sparkles,
  Bot,
  Loader2,
} from 'lucide-react';

const CHANNELS = [
  { id: 'general', name: 'Umum & Pengumuman', icon: MessageSquare, badge: 'Semua' },
  { id: 'guru_kelas', name: 'Forum Guru & Wali Kelas', icon: GraduationCap, badge: 'Akademik' },
  { id: 'sarpras', name: 'Koordinasi Sarpras', icon: Building, badge: 'Operasional' },
  { id: 'pimpinan', name: 'Internal Kepsek & Yayasan', icon: ShieldCheck, badge: 'Privat' },
  { id: 'ai_assistant', name: 'AI Asisten Kurikulum', icon: Bot, badge: 'Groq AI' },
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'Pak Kepsek (H. Sulaiman)',
    role: 'Kepala Sekolah',
    text: "Assalamu'alaikumsalam wr. wb. Bapak Ibu Guru, mohon persiapkan rekap kehadiran pekan ini.",
    time: '08:15',
    channel: 'general',
    isAi: false,
  },
  {
    id: 2,
    sender: 'Bu Siti Rahma',
    role: 'Wali Kelas 3B',
    text: "Wa'alaikumsalam Pak. Untuk kelas 3B hadir 28/30 siswa hari ini.",
    time: '08:20',
    channel: 'general',
    isAi: false,
  },
  {
    id: 3,
    sender: 'Pak Hendra Admin',
    role: 'Staf Sarpras',
    text: 'Perbaikan AC Ruang Guru sedang dijadwalkan oleh teknisi pukul 11.00 WIB.',
    time: '08:45',
    channel: 'sarpras',
    isAi: false,
  },
  {
    id: 4,
    sender: 'Ustadz Ahmad',
    role: 'Guru Tahfizh',
    text: "Perlengkapan Musabaqah Hifzhil Qur'an sudah disiapkan di Aula Lt.2.",
    time: '09:10',
    channel: 'guru_kelas',
    isAi: false,
  },
  {
    id: 5,
    sender: 'AI Asisten Kurikulum',
    role: 'Groq AI Engine',
    text: "Assalamu'alaikumsalam Warahmatullahi Wabarakatuh! Saya Asisten AI Kurikulum SDIT Al Ihsan. Ada yang bisa saya bantu terkait penyusunan Modul Ajar, RPP, atau Bank Soal Islami hari ini?",
    time: '09:15',
    channel: 'ai_assistant',
    isAi: true,
  },
];

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [aiStreaming, setAiStreaming] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, aiStreaming]);

  // Supabase Realtime Subscription Listener
  useEffect(() => {
    let channelSubscription;

    if (supabase) {
      setIsLive(true);
      channelSubscription = supabase
        .channel('public:messages')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages' },
          (payload) => {
            const newMsg = payload.new;
            setMessages((prev) => [
              ...prev,
              {
                id: newMsg.id || Date.now(),
                sender: newMsg.sender_name || 'User Internal',
                role: newMsg.sender_role || 'Staff',
                text: newMsg.content || newMsg.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                channel: newMsg.channel_id || 'general',
                isAi: newMsg.is_ai || false,
              },
            ]);
          }
        )
        .subscribe();
    }

    return () => {
      if (channelSubscription && supabase) {
        supabase.removeChannel(channelSubscription);
      }
    };
  }, []);

  // FUNGSI UTAMA UNTUK MENGIRIM PESAN & MEMANGGIL GROQ AI STREAMING
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || aiStreaming) return;

    const userQuery = inputText;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsgObj = {
      id: Date.now(),
      sender: 'H. Ahmad Dahlan, M.Pd',
      role: 'Kepala Sekolah',
      text: userQuery,
      time: currentTime,
      channel: activeChannel,
      isAi: false,
    };

    // Update lokal state
    setMessages((prev) => [...prev, userMsgObj]);
    setInputText('');

    // Push ke Supabase DB jika terhubung
    if (supabase) {
      try {
        await supabase.from('messages').insert([
          {
            content: userQuery,
            sender_name: 'H. Ahmad Dahlan, M.Pd',
            sender_role: 'Kepala Sekolah',
            channel_id: activeChannel,
            is_ai: false,
          },
        ]);
      } catch (err) {
        console.log('Supabase offline mode, fallback to local state');
      }
    }

    // JIKA DI CHANNEL AI ASSISTANT ATAU MENANYAKAN PADA AI
    if (activeChannel === 'ai_assistant' || userQuery.toLowerCase().includes('@ai')) {
      setAiStreaming(true);

      const aiMsgId = Date.now() + 1;
      const initialAiMsg = {
        id: aiMsgId,
        sender: 'AI Asisten Kurikulum',
        role: 'Groq AI Engine',
        text: '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: activeChannel,
        isAi: true,
      };

      setMessages((prev) => [...prev, initialAiMsg]);

      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: userQuery }],
          }),
        });

        if (!response.ok) {
          throw new Error('Gagal menghubungi Server Groq AI');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, text: accumulatedText } : msg
            )
          );
        }

        // Simpan hasil respon AI ke Supabase jika terhubung
        if (supabase) {
          try {
            await supabase.from('messages').insert([
              {
                content: accumulatedText,
                sender_name: 'AI Asisten Kurikulum',
                sender_role: 'Groq AI Engine',
                channel_id: activeChannel,
                is_ai: true,
              },
            ]);
          } catch (e) {
            console.log('Supabase save AI response bypassed');
          }
        }
      } catch (err) {
        console.error('Error streaming AI response:', err);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? {
                  ...msg,
                  text: "Afwan, terjadi kendala saat merespons permintaan Anda. Silakan coba beberapa saat lagi.",
                }
              : msg
          )
        );
      } finally {
        setAiStreaming(false);
      }
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.channel === activeChannel &&
      (msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.sender.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentChannelInfo = CHANNELS.find((c) => c.id === activeChannel);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col md:flex-row bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Sidebar Channels */}
      <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>Internal Chat Hub</span>
            </h2>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isLive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Radio className="w-3 h-3 animate-pulse" />
              {isLive ? 'Realtime' : 'Local'}
            </span>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pesan atau pengirim..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
            />
          </div>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Saluran Komunikasi
          </p>
          {CHANNELS.map((channel) => {
            const Icon = channel.icon;
            const isActive = activeChannel === channel.id;
            const isAiChannel = channel.id === 'ai_assistant';

            return (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all cursor-pointer ${
                  isActive
                    ? isAiChannel
                      ? 'bg-gradient-to-r from-emerald-800 to-teal-900 text-white font-black shadow-md'
                      : 'bg-emerald-600 text-white font-bold shadow-sm'
                    : isAiChannel
                    ? 'bg-amber-50/80 border border-amber-200 text-emerald-950 font-bold hover:bg-amber-100'
                    : 'text-slate-600 hover:bg-slate-200/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : isAiChannel ? 'text-amber-600' : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{channel.name}</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-emerald-900 text-amber-300'
                      : isAiChannel
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {channel.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white">
        {/* Header Chat */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${
                activeChannel === 'ai_assistant'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {currentChannelInfo && <currentChannelInfo.icon className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>{currentChannelInfo?.name}</span>
                {activeChannel === 'ai_assistant' && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black rounded-md border border-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Groq 70B Engine</span>
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                {activeChannel === 'ai_assistant'
                  ? 'Asisten Kurikulum & Pembuat Bank Soal Real-time AI'
                  : 'Saluran Diskusi Terkoordinasi SDIT Al Ihsan'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Users className="w-4 h-4" />
            <span className="font-semibold text-slate-600">
              {activeChannel === 'ai_assistant' ? 'AI Active' : 'Terhubung'}
            </span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div key={msg.id} className="flex flex-col space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`font-bold ${
                      msg.isAi ? 'text-emerald-800 flex items-center gap-1' : 'text-slate-800'
                    }`}
                  >
                    {msg.isAi && <Sparkles className="w-3 h-3 text-amber-500" />}
                    <span>{msg.sender}</span>
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      msg.isAi
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {msg.role}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                </div>
                <div
                  className={`border rounded-2xl rounded-tl-none p-3 max-w-2xl text-xs shadow-sm leading-relaxed whitespace-pre-wrap ${
                    msg.isAi
                      ? 'bg-emerald-950 text-slate-100 border-emerald-800 font-mono'
                      : 'bg-white border-slate-200/80 text-slate-700 font-medium'
                  }`}
                >
                  {msg.text || (aiStreaming && msg.isAi ? '...' : '')}
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300" />
              <p className="text-xs">Belum ada pesan di saluran ini.</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeChannel === 'ai_assistant'
                  ? 'Tanyakan apa saja ke AI Kurikulum (Modul Ajar, Soal, RPP)...'
                  : `Ketik pesan di #${currentChannelInfo?.name}...`
              }
              className="flex-1 bg-transparent text-xs text-slate-800 font-medium focus:outline-none px-2"
            />
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
            >
              <Smile className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={aiStreaming || !inputText.trim()}
              className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-all shadow-sm disabled:opacity-50 flex items-center justify-center"
            >
              {aiStreaming ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}