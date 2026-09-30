/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Header Oficial alinhado com a referência visual exata
 */

import React, { useState } from 'react';
import { Menu, X, ShoppingBag, User, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenBooking: (serviceId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'início', path: '/inicio' },
    { label: 'atendimentos', path: '/atendimentos' },
    { label: 'palestras', path: '/palestras' },
    { label: 'vivências', path: '/vivencias' },
    { label: 'patota', path: '/patota' },
    { label: 'leituras', path: '/leituras' },
    { label: 'lojinha', path: '/lojinha' }
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const isLinkActive = (path: string) => {
    if (path === '/inicio') return currentPath === '/inicio' || currentPath === '/';
    if (path === '/patota') return currentPath === '/patota' || currentPath === '/patota-astral';
    if (path === '/leituras') return currentPath === '/leituras' || currentPath === '/blog' || currentPath.startsWith('/leituras/') || currentPath.startsWith('/blog/');
    if (path === '/lojinha') return currentPath === '/lojinha' || currentPath === '/loja' || currentPath.startsWith('/lojinha/') || currentPath.startsWith('/loja/');
    if (path === '/atendimentos') return currentPath === '/atendimentos' || currentPath.startsWith('/atendimentos/');
    if (path === '/vivencias') return currentPath === '/vivencias' || currentPath.startsWith('/vivencias/');
    if (path === '/palestras') return currentPath === '/palestras';
    return currentPath === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080C35]/95 backdrop-blur-md text-[#FFFFFF] border-b border-[#22205A]/60 shadow-lg">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logotipo Oficial Casa 6 com símbolo lunar/solar */}
        <button
          onClick={() => handleLinkClick('/')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-[#FFB63F] rounded-lg p-1 group"
          aria-label="Página Inicial Casa 6"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#FFB63F] bg-[#080C35] shadow-sm transition-transform group-hover:scale-105">
            <div className="h-4 w-4 rounded-full bg-[#FFB63F]"></div>
            <div className="absolute right-1.5 h-3.5 w-3.5 rounded-full bg-[#080C35]"></div>
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-white group-hover:text-[#FFB63F] transition-colors">
            casa6
          </span>
        </button>

        {/* Navegação Desktop */}
        <nav className="hidden lg:flex items-center gap-7 text-xs tracking-wider lowercase font-normal" aria-label="Navegação Principal">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`transition-colors py-1 hover:text-[#FFB63F] ${
                  active ? 'text-[#FFB63F] font-semibold border-b border-[#FFB63F]' : 'text-[#DAD2C4]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Ações Direitas: Sacola, Login/Painel, CTA Agendar */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleLinkClick('/lojinha')}
            title="Lojinha Casa 6"
            aria-label="Sacola de Compras"
            className="p-1.5 rounded-full text-[#DAD2C4] hover:text-[#FFB63F] transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleLinkClick('/painel')}
            title="Acesso Administrativo ao Painel"
            aria-label="Login no Painel Administrativo"
            className="flex items-center gap-1.5 text-xs text-[#DAD2C4] hover:text-[#FFB63F] transition-colors p-1"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#22205A] text-[#DAD2C4] border border-[#372B69]">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="hidden sm:inline font-medium">Login</span>
          </button>

          {/* Contato Direto via WhatsApp Oficial (Sem formulário) */}
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsappNumberRaw}?text=${encodeURIComponent('Olá, vim pelo site.')}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Contato direto via WhatsApp"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#080C35] px-3.5 py-1.5 text-xs font-semibold text-[#25D366] hover:bg-[#25D366]/10 transition-colors shadow-xs"
          >
            <MessageCircle className="h-4 w-4 text-[#25D366] fill-[#25D366]/20" />
            <span className="tracking-wide">{SITE_CONFIG.whatsappNumberFormatted}</span>
          </a>

          {/* Hambúrguer Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden text-white hover:text-[#FFB63F] focus:outline-none"
            aria-expanded={mobileMenuOpen}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#22205A] bg-[#080C35] px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`block w-full text-left py-2.5 px-3 rounded text-sm capitalize ${
                  active
                    ? 'bg-[#22205A] text-[#FFB63F] font-bold'
                    : 'text-[#DAD2C4] hover:bg-[#22205A] hover:text-[#FFB63F]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="pt-3 border-t border-[#22205A]/80">
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsappNumberRaw}?text=${encodeURIComponent('Olá, vim pelo site.')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-full border border-[#25D366]/50 bg-[#080C35] py-2.5 text-xs font-bold text-[#25D366]"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span>WhatsApp: {SITE_CONFIG.whatsappNumberFormatted}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
