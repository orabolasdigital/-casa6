/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Botão Flutuante Global de Agendamento (WhatsApp)
 * 
 * Regra: Fixo no canto inferior direito em todas as páginas públicas.
 * Exceção autorizada de cor: Verde oficial do WhatsApp (#25D366).
 * Ao clicar: Abre o popup global de agendamento.
 */

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  onOpenBooking: () => void;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({ onOpenBooking }) => {
  return (
    <aside
      aria-label="Agendamento rápido via WhatsApp"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center print:hidden"
    >
      <button
        onClick={onOpenBooking}
        aria-label="Abrir formulário para agendar consulta pelo WhatsApp"
        className="group flex items-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white font-bold py-3 px-4 sm:px-5 shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer"
        style={{
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45), 0 2px 8px rgba(8, 12, 53, 0.2)'
        }}
      >
        <span className="relative flex h-6 w-6 items-center justify-center">
          <MessageCircle className="h-6 w-6 text-white fill-white" />
          {/* Pulso sutil para atenção visual refinada */}
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-white animate-ping opacity-75" />
        </span>
        <span className="text-xs sm:text-sm tracking-wide font-extrabold uppercase">
          Agendar Consulta
        </span>
      </button>
    </aside>
  );
};
