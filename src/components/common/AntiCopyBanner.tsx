/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Notificador Visual da Camada Anticópia (Identidade Visual Oficial Atualizada)
 */

import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { registerAntiCopyNotifier } from '../../services/anticopy';

export const AntiCopyBanner: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const unregister = registerAntiCopyNotifier((msg) => {
      setMessage(msg);
      setTimeout(() => {
        setMessage(null);
      }, 3500);
    });

    return unregister;
  }, []);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg bg-[#22205A] text-[#FFFFFF] px-4 py-3 shadow-xl border border-[#FFB63F] text-xs max-w-sm animate-fade-in"
    >
      <ShieldAlert className="h-5 w-5 text-[#FFB63F] shrink-0" />
      <span className="leading-snug">{message}</span>
    </div>
  );
};
