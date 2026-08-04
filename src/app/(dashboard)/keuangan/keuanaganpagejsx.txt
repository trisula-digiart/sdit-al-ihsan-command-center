'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, RefreshCw, BookOpen, FileCheck, MessageSquare, CornerDownLeft } from 'lucide-react';
import ChatBubble from '../../../components/ai/ChatBubble';

export default function InternalChatHubPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Assalamu’alaikum Warahmatullahi Wabarakatuh Ustaz/Ustazah.\n\nSaya Asisten AI Kurikulum SDIT Al Ihsan. Ada yang bisa saya bantu hari ini? Anda dapat meminta saya untuk:\n1. Menyusun Modul Ajar / RPP Kurikulum Merdeka\n2. Membuat Bank Soal Pilihan Ganda/Essay berbasis HOTS & Islami\n3. Merancang Pengumuman Edukatif & Kegiatan Sekolah',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleQuickPrompt = (promptText) => {
    setInputMessage(promptText);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isStreaming) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const updatedMessages = [...messages, { role: 'user', content: userText }];
    setMessages(updatedMessages);

    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Gagal terhubung ke engine Groq Chat Stream.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let assistantReply = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantReply += chunk;

        setMessages((prev) => {
          const newArr = [...prev];
          newArr[newArr.length - 1] = {
            role: 'assistant',
            content: assistantReply,
          };
          return newArr;
        });
      }
    } catch (err) {
      console.error('[STREAMING_CLIENT_ERROR]:', err);
      setMessages((prev) => {
        const newArr = [...prev];
        newArr[newArr.length - 1] = {
          role: 'assistant',
          content: 'Mohon maaf Ustaz/Ustazah, terjadi gangguan koneksi server AI. Silakan coba beberapa saat lagi.',
        };
        return newArr;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-4 text-gray-100 flex flex-col h-[calc(100vh-80px)]">
      {/* Header Banner */}
      <div className="flex items-center justify-between p-4 bg-[#0C1821] border border-[#005B3F]/50 rounded-2xl shadow-xl shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#005B3F]/30 border border-[#005B3F]/60 rounded-xl text-amber-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white tracking-wide flex items-center gap-2">
              Internal AI Chat Hub Kurikulum
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Ultra-Fast Groq Engine
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Asisten Interaktif Guru untuk Penyusunan Modul Ajar, Bank Soal, & Materi Akademik Islami.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-[11px] font-medium text-gray-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Rekomendasi:
        </span>
        <button
          onClick={() =>
            handleQuickPrompt('Buatkan Modul Ajar IPAS Kelas 4 Kurikulum Merdeka Bab Ekosistem Sekolah Islami.')
          }
          className="px-3 py-1 bg-gray-800/60 hover:bg-[#005B3F]/40 border border-gray-700/60 hover:border-[#005B3F] text-gray-300 hover:text-white rounded-full text-xs whitespace-nowrap transition-all"
        >
          📘 Modul Ajar IPAS K4
        </button>
        <button
          onClick={() =>
            handleQuickPrompt('Buat 5 Soal Pilihan Ganda PAI Kelas 5 HOTS tentang Akhlakul Karimah beserta Kunci Jawabannya.')
          }
          className="px-3 py-1 bg-gray-800/60 hover:bg-[#005B3F]/40 border border-gray-700/60 hover:border-[#005B3F] text-gray-300 hover:text-white rounded-full text-xs whitespace-nowrap transition-all"
        >
          📝 5 Soal HOTS PAI K5
        </button>
        <button
          onClick={() =>
            handleQuickPrompt('Susunkan draf pengumuman kegiatan Sanlat (Pesantren Kilat) Ramadhan untuk Orang Tua Siswa.')
          }
          className="px-3 py-1 bg-gray-800/60 hover:bg-[#005B3F]/40 border border-gray-700/60 hover:border-[#005B3F] text-gray-300 hover:text-white rounded-full text-xs whitespace-nowrap transition-all"
        >
          📢 Pengumuman Sanlat
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#0C1821]/80 border border-[#005B3F]/40 rounded-2xl shadow-inner space-y-4">
        {messages.map((msg, idx) => (
          <ChatBubble
            key={idx}
            role={msg.role}
            content={msg.content}
            isStreaming={isStreaming && idx === messages.length - 1 && msg.role === 'assistant'}
          />
        ))}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="relative shrink-0">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Tanyakan atau instruksikan sesuatu kepada AI Kurikulum..."
          disabled={isStreaming}
          className="w-full py-3.5 pl-4 pr-12 bg-gray-900/90 border border-[#005B3F]/60 rounded-xl text-sm text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-500 disabled:opacity-50 shadow-xl"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isStreaming}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#005B3F] hover:bg-emerald-600 disabled:bg-gray-800 text-white rounded-lg transition-all"
          title="Kirim Instruksi"
        >
          {isStreaming ? (
            <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}