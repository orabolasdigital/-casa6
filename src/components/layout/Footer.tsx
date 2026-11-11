/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Footer Oficial alinhado com a paleta oficial (#1b1463, #fab03b, #d8d6c8, #6a62b8)
 */

import React from 'react';
import { Instagram, Youtube, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative w-full bg-[#2B2566] text-[#FFFFFF] border-t border-[#F0B55E]/20 overflow-hidden">
      {/* Órbitas decorativas de fundo conforme Brand Guide */}
      <div className="absolute right-[-100px] bottom-[-100px] w-[500px] h-[500px] rounded-full border border-[#F0B55E]/10 pointer-events-none"></div>
      <div className="absolute right-[-40px] bottom-[-40px] w-[380px] h-[380px] rounded-full border border-[#F0B55E]/15 pointer-events-none"></div>
      <div className="absolute left-[-150px] top-[-150px] w-[450px] h-[450px] rounded-full border border-white/5 pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Coluna 1: Logo & Slogan Oficial */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center">
              <img
                src="https://static.wixstatic.com/media/02c8e0_916db28bdef7413a82fde89b9ce7f738~mv2.png"
                alt="Casa 6 — Bianca Tofoli"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#F0B55E] font-medium">
              CLAREZA <span className="font-highlight italic text-[1.25em] font-semibold lowercase tracking-normal inline-block align-baseline ml-0.5">para a</span> VIDA REAL
            </p>
            <p className="text-xs text-[#E6E3F1]/75 leading-relaxed max-w-xs font-light">
              Plataforma oficial de Bianca Tofoli: enfermeira, gestora, palestrante e astróloga. Consultas de Mapa Natal, Bússola Guia, Patota Astral e palestras corporativas.
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 text-[11px] uppercase tracking-[0.16em] text-[#E6E3F1]">
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('/inicio')} className="hover:text-[#F0B55E] transition-colors cursor-pointer">
                  INÍCIO
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/sobre')} className="hover:text-[#F0B55E] transition-colors cursor-pointer">
                  SOBRE
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/atendimentos')} className="hover:text-[#F0B55E] transition-colors cursor-pointer">
                  ATENDIMENTOS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/encontros')} className="hover:text-[#F0B55E] transition-colors cursor-pointer">
                  ENCONTROS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/bussola')} className="hover:text-[#F0B55E] transition-colors cursor-pointer text-[#F0B55E] font-bold">
                  BÚSSOLA GUIA
                </button>
              </li>
            </ul>

            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('/patota')} className="hover:text-[#F0B55E] transition-colors cursor-pointer">
                  PATOTA ASTRAL
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/leituras')} className="hover:text-[#F0B55E] transition-colors cursor-pointer">
                  LEITURAS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/loja')} className="hover:text-[#F0B55E] transition-colors cursor-pointer">
                  LOJINHA
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/membros')} className="hover:text-[#F0B55E] transition-colors cursor-pointer font-bold text-[#F0B55E]">
                  ÁREA DE MEMBROS
                </button>
              </li>
            </ul>

            {/* Redes Sociais */}
            <div className="col-span-2 pt-2 flex items-center gap-3 text-[#E6E3F1]">
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram @tofoli.bianca"
                className="p-2 rounded-full border border-white/20 bg-white/5 hover:text-[#F0B55E] hover:border-[#F0B55E] transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={SITE_CONFIG.youtubeUrl || 'https://youtube.com'}
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="p-2 rounded-full border border-white/20 bg-white/5 hover:text-[#F0B55E] hover:border-[#F0B55E] transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsappNumberRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Oficial"
                className="p-2 rounded-full border border-[#8C987F]/40 bg-white/5 hover:text-[#F0B55E] hover:border-[#F0B55E] transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-[#8C987F]" />
              </a>
            </div>
          </div>

          {/* Coluna 3: Citação Poética do Brand Guide */}
          <div className="md:col-span-4 md:text-right space-y-3">
            <p className="font-heading italic text-xl sm:text-2xl text-[#E6E3F1] leading-snug">
              Na astrologia, a Casa 6 é a casa<br />
              do trabalho, da rotina e do cuidado.
            </p>
            <div className="flex items-center gap-2 justify-end">
              <span className="w-8 h-px bg-white/20"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]"></span>
              <span className="w-8 h-px bg-white/20"></span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C987F]">
              Bianca Tofoli • Fundadora da Casa 6
            </p>
          </div>

        </div>

        {/* Linha-Ponto Divisória Oficial do Brand Guide (———— • ————) */}
        <div className="my-8 flex items-center justify-center gap-4">
          <div className="flex-1 h-px bg-white/10"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]"></div>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Cláusula Legal Obrigatória & Créditos */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-[#E6E3F1]/70">
          <p>
            © {new Date().getFullYear()} Casa 6 — Bianca Tofoli. Todos os direitos reservados. CNPJ 41.077.732/0001-67.
          </p>
          <p>
            Desenvolvido por{' '}
            <a
              href="https://instagram.com/orabolasdigital"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F0B55E] hover:underline font-semibold"
            >
              @orabolasdigital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
