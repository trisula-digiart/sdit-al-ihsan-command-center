'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

const CHANNELS = [
  { id: 'general', name: 'Umum & Pengumuman', icon: MessageSquare, badge: 'Semua' },
  { id: 'guru_kelas', name: 'Forum Guru & Wali Kelas', icon: GraduationCap, badge: 'Akademik' },
  { id: 'sarpras', name: 'Koordinasi Sarpras', icon: Building, badge: 'Operasional' },
  { id: 'pimpinan', name: 'Internal Kepsek & Yayasan', icon: ShieldCheck, badge: 'Privat' },
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'Pak Kepsek (H. Sulaiman)',
    role: 'Kepala Sekolah',
    text: "Assalamu'alaikumsalam wr. wb. Bapak Ibu Guru, mohon persiapkan rekap kehadiran pekan ini.",
    time: '08:15',
    channel: 'general',
  },
  {
    id: 2,
    sender: 'Bu Siti Rahma',
    role: 'Wali Kelas 3B',
    text: "Wa'alaikumsalam Pak. Untuk kelas 3B hadir 28/30 siswa hari ini.",
    time: '08:20',
    channel: 'general',
  },
  {
    id: 3,
    sender: 'Pak Hendra Admin',
    role: 'Staf Sarpras',
    text: 'Perbaikan AC Ruang Guru sedang dijadwalkan oleh teknisi pukul 11.00 WIB.',
    time: '08:45',
    channel: 'sarpras',
  },
  {
    id: 4,
    sender: 'Ustadz Ahmad',
    role: 'Guru Tahfizh',
    text: "Perlengkapan Musabaqah Hifzhil Qur'an sudah disiapkan di Aula Lt.2.",
    time: '09:10',
    channel: 'guru_kelas',
  },
];

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'User Logged In',
      role: 'Staff Internal',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: activeChannel,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
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
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pesan atau pengirim..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            return (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{channel.name}</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-emerald-700 text-white'
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
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              {currentChannelInfo && <currentChannelInfo.icon className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">{currentChannelInfo?.name}</h3>
              <p className="text-[11px] text-slate-400">Saluran Diskusi Terkoordinasi SDIT Al Ihsan</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Users className="w-4 h-4" />
            <span className="font-semibold text-slate-600">Aktif</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div key={msg.id} className="flex flex-col space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-800">{msg.sender}</span>
                  <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-semibold">
                    {msg.role}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none p-3 max-w-2xl text-xs text-slate-700 shadow-sm leading-relaxed">
                  {msg.text}
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300" />
              <p className="text-xs">Belum ada pesan di saluran ini.</p>
            </div>
          )}
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
              placeholder={`Ketik pesan di #${currentChannelInfo?.name}...`}
              className="flex-1 bg-transparent text-xs text-slate-800 focus:outline-none px-2"
            />
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
            >
              <Smile className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}