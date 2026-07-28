'use client';

/* STREAMING_CHUNK:Importing React hooks and Lucide icons for Chat Hub page... */
import React, { useState } from 'react';
import { Send, MessageSquare, Shield, Users, Radio, CheckCheck } from 'lucide-react';

/* STREAMING_CHUNK:Defining Mock Messages Data... */
const INITIAL_MESSAGES = [
{ id: 1, sender: 'Pak Kepsek (H. Sulaiman)', role: 'Kepala Sekolah', text: 'Assalamu'alaikumsalam wr. wb. Bapak Ibu Guru, mohon persiapkan rekap kehadiran pekan ini.', time: '08:15', channel: 'general' },
{ id: 2, sender: 'Bu Siti Rahma', role: 'Wali Kelas 3B', text: 'Wa'alaikumsalam Pak. Untuk kelas 3B hadir 28/30 siswa hari ini.', time: '08:20', channel: 'general' },
{ id: 3, sender: 'Pak Hendra Admin', role: 'Staf Sarpras', text: 'Perbaikan AC Ruang Guru sedang dijadwalkan oleh teknisi pukul 11.00 WIB.', time: '08:45', channel: 'sarpras' },
{ id: 4, sender: 'Ustadz Ahmad', role: 'Guru Tahfizh', text: 'Perlengkapan Musabaqah Hifzhil Qur'an sudah disiapkan di Aula Lt.2.', time: '09:10', channel: 'guru_kelas' },
];

/* STREAMING_CHUNK:Rendering Chat Hub Component... */
export default function InternalChatPage() {
const [chatMessages, setChatMessages] = useState(INITIAL_MESSAGES);
const [activeChannel, setActiveChannel] = useState('general');
const [chatInput, setChatInput] = useState('');

/* STREAMING_CHUNK:Handling Send Message Submit... */
const handleSendMessage = (e) => {
e.preventDefault();
if (!chatInput.trim()) return;

const newMsg = {
  id: Date.now(),
  sender: 'Pak Kepsek (H. Sulaiman)',
  role: 'Kepala Sekolah',
  text: chatInput,
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  channel: activeChannel
};

setChatMessages([...chatMessages, newMsg]);
setChatInput('');


};

return (


  {/* Sidebar Channel List */}
  <div className="w-full md:w-72 border-r border-slate-200 bg-slate-50 p-4 flex flex-col justify-between shrink-0">
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
        <MessageSquare size={16} className="text-emerald-600" />
        Channel Komunikasi
      </div>

      <div className="space-y-1.5">
        {[
          { id: 'general', name: '# Chat Umum Sekolah', desc: 'Seluruh Guru & Pimpinan' },
          { id: 'sarpras', name: '# Logistik & Sarpras', desc: 'Tim Pemeliharaan Building' },
          { id: 'guru_kelas', name: '# Forum Wali Kelas', desc: 'Akademik & Murid' },
        ].map((ch) => (
          <button
            key={ch.id}
            onClick={() => setActiveChannel(ch.id)}
            className={`w-full text-left p-3 rounded-xl text-xs transition-all ${
              activeChannel === ch.id
                ? 'bg-emerald-600 text-white font-semibold shadow-md'
                : 'hover:bg-slate-200/70 text-slate-700'
            }`}
          >
            <p className="font-bold">{ch.name}</p>
            <p className={`text-[10px] mt-0.5 ${activeChannel === ch.id ? 'text-emerald-100' : 'text-slate-400'}`}>
              {ch.desc}
            </p>
          </button>
        ))}
      </div>
    </div>

    {/* Supabase Status Indicator Box */}
    <div className="p-3 bg-emerald-900/5 rounded-xl border border-emerald-200/80 space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
        <Radio size={14} className="text-emerald-600 animate-pulse" />
        Supabase Realtime Engine
      </div>
      <p className="text-[10px] text-slate-500 leading-relaxed">
        Terhubung via WebSocket Channel: <code className="bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded text-[10px] font-mono">room_{activeChannel}</code>
      </p>
    </div>
  </div>

  {/* Main Chat Viewport */}
  <div className="flex-1 flex flex-col bg-white">
    
    {/* Top Channel Title Bar */}
    <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center shrink-0">
      <div>
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          #{activeChannel.toUpperCase()}
        </h3>
        <p className="text-[10px] text-slate-500">Ruang obrolan internal terekam dalam arsip sekolah</p>
      </div>
      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        Realtime Active
      </span>
    </div>

    {/* Message Feed Area */}
    <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30">
      {chatMessages
        .filter((m) => m.channel === activeChannel)
        .map((msg) => (
          <div key={msg.id} className="bg-white p-3.5 rounded-2xl border border-slate-200/80 max-w-xl shadow-xs space-y-1">
            <div className="flex justify-between items-center gap-2">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                {msg.sender}
                <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-normal">
                  {msg.role}
                </span>
              </span>
              <span className="text-[10px] text-slate-400">{msg.time}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{msg.text}</p>
          </div>
        ))}

      {chatMessages.filter((m) => m.channel === activeChannel).length === 0 && (
        <div className="text-center py-16 space-y-2">
          <MessageSquare size={32} className="mx-auto text-slate-300" />
          <p className="text-xs text-slate-400 font-medium">Belum ada obrolan di channel ini.</p>
        </div>
      )}
    </div>

    {/* Message Input Form */}
    <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2 shrink-0">
      <input
        type="text"
        placeholder={`Tulis pesan resmi di #${activeChannel}...`}
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-5 text-xs flex items-center gap-1.5 transition shadow-sm"
      >
        <Send size={14} /> Kirim
      </button>
    </form>

  </div>

</div>


);
}