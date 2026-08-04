'use client';

import React, { useState } from 'react';
import { Bot, User, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';

/**
 * ChatBubble Component - Displays chat messages with markdown styling and copy action
 */
export default function ChatBubble({ role = 'assistant', content = '', isStreaming = false }) {
  const [copied, setCopied] = useState(false);
  const isUser = role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin teks:', err);
    }
  };

  return (
    <div
      className={`flex items-start gap-3 my-3 w-full animate-fade-in ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {}
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 border ${
          isUser
            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
            : 'bg-[#005B3F]/40 border-amber-400/50 text-amber-300 shadow-md shadow-emerald-900/20'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4.5 h-4.5 text-amber-400" />}
      </div>

      {}
      <div
        className={`relative max-w-[85%] md:max-w-[78%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg backdrop-blur-sm transition-all ${
          isUser
            ? 'bg-emerald-700/30 border border-emerald-500/40 text-emerald-50 rounded-tr-none'
            : 'bg-[#0C1821]/90 border border-[#005B3F]/40 text-gray-100 rounded-tl-none'
        }`}
      >
        {/* Header Metadata */}
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-gray-700/40 text-[11px] font-medium tracking-wide">
          <span className={isUser ? 'text-emerald-300' : 'text-amber-400 flex items-center gap-1'}>
            {!isUser && <Sparkles className="w-3 h-3 inline" />}
            {isUser ? 'Anda (Pengajar/Staf)' : 'AI Kurikulum SDIT Al Ihsan'}
          </span>

          {!isUser && content && (
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-gray-400 hover:text-emerald-300 transition-colors px-1.5 py-0.5 rounded bg-gray-800/50 hover:bg-gray-700/60"
              title="Salin Pesan"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 text-[10px]">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span className="text-[10px]">Salin</span>
                </>
              )}
            </button>
          )}
        </div>

        {}
        <div className="whitespace-pre-wrap break-words font-sans space-y-1 text-gray-100">
          {content}
          {isStreaming && (
            <span className="inline-block ml-1 w-2 h-4 bg-amber-400 animate-pulse rounded-xs" />
          )}
        </div>
      </div>
    </div>
  );
}