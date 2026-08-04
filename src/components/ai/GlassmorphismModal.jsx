'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function GlassmorphismModal({
  isOpen,
  onClose,
  title = 'Modal Title',
  icon: Icon = null,
  children,
  maxWidth = 'max-w-3xl',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity animate-fade-in">
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col bg-[#0C1821]/95 text-gray-100 rounded-2xl border border-[#005B3F]/50 shadow-2xl shadow-[#005B3F]/20 overflow-hidden backdrop-saturate-150`}
        onClick={(e) => e.stopPropagation()}
      >
        {}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#005B3F]/30 bg-gradient-to-r from-[#005B3F]/20 via-transparent to-amber-500/10">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-[#005B3F]/40 text-emerald-400 border border-[#005B3F]/60">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <h3 className="text-lg font-semibold text-emerald-50 tracking-wide">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/40 border border-transparent transition-all"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}