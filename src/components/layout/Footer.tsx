/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Footer Oficial alinhado com a referência visual exata
 */

import React from 'react';
import { Instagram, Youtube, MessageCircle, Facebook } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative w-full bg-[#080C35] text-[#FFFFFF] border-t border-[#22205A] overflow-hidden">
      {/* Detalhe sutil de horizonte planetário cósmico no fundo */}
      <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-gradient-to-t from-[#483474]/20 via-[#22205A]/10 to-transparent pointer-events-none blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
      
      {/* Traço de órbita decorativo */}
      <svg className="absolute right-12 bottom-8 w-48 h-48 pointer-events-none opacity-25" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#FFB63F" strokeWidth="0.5" strokeDasharray="2 3" />
        <circle cx="78" cy="22" r="3" fill="#FFB63F" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Coluna 1: Logo & Slogan Oficial */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#FFB63F] bg-[#080C35]">
                <div className="h-4 w-4 rounded-full bg-[#FFB63F]"></div>
                <div className="absolute right-1.5 h-3.5 w-3.5 rounded-full bg-[#080C35]"></div>
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-white">
                casa6
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#DAD2C4]/80 font-medium">
              ASTROLOGIA PARA UMA VIDA MAIS REAL
            </p>
          </div>

          {/* Coluna 2: Links em 2 sub-colunas */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 text-xs uppercase tracking-wider text-[#DAD2C4]">
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('/inicio')} className="hover:text-[#FFB63F] transition-colors">
                  INÍCIO
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/sobre')} className="hover:text-[#FFB63F] transition-colors">
                  SOBRE
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/atendimentos')} className="hover:text-[#FFB63F] transition-colors">
                  ATENDIMENTOS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/palestras')} className="hover:text-[#FFB63F] transition-colors">
                  PALESTRAS
                </button>
              </li>
            </ul>

            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('/vivencias')} className="hover:text-[#FFB63F] transition-colors">
                  VIVÊNCIAS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/patota')} className="hover:text-[#FFB63F] transition-colors">
                  PATOTA
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/leituras')} className="hover:text-[#FFB63F] transition-colors">
                  LEITURAS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/lojinha')} className="hover:text-[#FFB63F] transition-colors">
                  LOJINHA
                </button>
              </li>
              <li>
                <a href={`mailto:${SITE_CONFIG.emailContact}`} className="hover:text-[#FFB63F] transition-colors">
                  CONTATO
                </a>
              </li>
            </ul>

            {/* Ícones Sociais */}
            <div className="col-span-2 pt-2 flex items-center gap-3 text-[#DAD2C4]">
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="p-1.5 rounded-full border border-[#22205A] bg-[#080C35] hover:text-[#FFB63F] hover:border-[#FFB63F] transition-colors"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="p-1.5 rounded-full border border-[#22205A] bg-[#080C35] hover:text-[#FFB63F] hover:border-[#FFB63F] transition-colors"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="p-1.5 rounded-full border border-[#22205A] bg-[#080C35] hover:text-[#FFB63F] hover:border-[#FFB63F] transition-colors"
              >
                <Youtube className="h-3.5 w-3.5" />
              </a>
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsappNumberRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
                className="p-1.5 rounded-full border border-[#22205A] bg-[#080C35] hover:text-[#FFB63F] hover:border-[#FFB63F] transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Coluna 3: Citação Poética */}
          <div className="md:col-span-4 md:text-right space-y-3">
            <p className="font-heading italic text-lg sm:text-xl text-[#DAD2C4] leading-snug">
              Astrologia é um convite<br />
              para lembrar quem você é.
            </p>
            <div className="w-12 h-0.5 bg-[#FFB63F] md:ml-auto"></div>
          </div>

        </div>

        {/* Linha Divisória */}
        <div className="my-8 border-t border-[#22205A]"></div>

        {/* Cláusula Legal Obrigatória & Créditos */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-[#DAD2C4]/70">
          <p>
            © {new Date().getFullYear()} Casa 6. Todos os direitos reservados. {SITE_CONFIG.legalNotice}
          </p>
          <p>
            Desenvolvido por{' '}
            <a
              href={SITE_CONFIG.developerCreditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFB63F] hover:underline font-semibold"
            >
              @orabolasdigital
            </a>{' '}
            com estratégia humana e IA.
          </p>
        </div>
      </div>
    </footer>
  );
};
