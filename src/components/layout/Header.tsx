/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Header Oficial alinhado à Nova Identidade Visual (Brand Guide 2026)
 * Paleta: Noite (#2B2566), Sol (#F0B55E), Lua (#F4EFE6), Névoa (#E6E3F1), Oliva (#8C987F)
 */

import React, { useState } from 'react';
import { Menu, X, User, Settings } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenBooking: (serviceId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ordem oficial exata em caixa alta conforme instrução:
  // SOBRE -> ATENDIMENTOS -> ENCONTROS -> BÚSSOLA (com tag NEW) -> PATOTA -> LEITURAS -> LOJINHA
  const navLinks = [
    { label: 'SOBRE', path: '/sobre' },
    { label: 'ATENDIMENTOS', path: '/atendimentos' },
    { label: 'ENCONTROS', path: '/encontros' },
    { label: 'BÚSSOLA', path: '/bussola', hasNewBadge: true },
    { label: 'PATOTA', path: '/patota' },
    { label: 'LEITURAS', path: '/leituras' },
    { label: 'LOJINHA', path: '/loja' }
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const isLinkActive = (path: string) => {
    if (path === '/inicio') return currentPath === '/inicio' || currentPath === '/';
    if (path === '/sobre') return currentPath === '/sobre';
    if (path === '/atendimentos') return currentPath === '/atendimentos' || currentPath.startsWith('/atendimentos/');
    if (path === '/encontros') return currentPath === '/encontros' || currentPath === '/palestras';
    if (path === '/bussola') return currentPath === '/bussola' || currentPath === '/bussula-guia';
    if (path === '/patota') return currentPath === '/patota' || currentPath === '/patota-astral';
    if (path === '/leituras') return currentPath === '/leituras' || currentPath === '/blog' || currentPath.startsWith('/leituras/') || currentPath.startsWith('/blog/');
    if (path === '/loja') return currentPath === '/loja' || currentPath === '/lojinha' || currentPath.startsWith('/loja/') || currentPath.startsWith('/lojinha/');
    if (path === '/membros') return currentPath === '/membros' || currentPath === '/painel-membro';
    if (path === '/painel') return currentPath.startsWith('/painel');
    return currentPath === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#2B2566]/98 backdrop-blur-md text-[#FFFFFF] border-b border-[#F0B55E]/20 shadow-lg">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logotipo Oficial Casa 6 (Horizontal Branco para Fundo Escuro) — Ao clicar vai para a página início */}
        <button
          onClick={() => handleLinkClick('/inicio')}
          className="flex items-center text-left focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 outline-none border-0 p-1 group cursor-pointer select-none"
          aria-label="Página Inicial Casa 6 (Início)"
          title="Casa 6 — Ir para Início"
        >
          <img
            src="https://static.wixstatic.com/media/02c8e0_916db28bdef7413a82fde89b9ce7f738~mv2.png"
            alt="Casa 6 — Bianca Tofoli"
            className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </button>

        {/* Navegação Central Desktop em Caixa Alta */}
        <nav className="hidden lg:flex items-center gap-6 text-[11px] tracking-[0.14em] uppercase font-medium" aria-label="Navegação Principal">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`relative py-1 transition-colors hover:text-[#F0B55E] cursor-pointer flex items-center gap-1.5 ${
                  active ? 'text-[#F0B55E] font-bold border-b-2 border-[#F0B55E]' : 'text-[#E6E3F1]/85'
                }`}
              >
                <span>{link.label}</span>
                {link.hasNewBadge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#F0B55E] text-[#2B2566] text-[8px] font-black uppercase tracking-tight shadow-xs">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Ações Direitas: Botão Membros com tonalidade suave do cabeçalho e Engrenagem isolada */}
        <div className="flex items-center">
          
          {/* Botão com ícone escrito "Membros" com a mesma tonalidade de fundo do cabeçalho e estilo de fonte do menu */}
          <button
            onClick={() => handleLinkClick('/membros')}
            title="Área de Membros (Login com E-mail e CPF)"
            aria-label="Área de Membros"
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-all cursor-pointer ${
              isLinkActive('/membros')
                ? 'border-[#F0B55E] text-[#F0B55E] bg-white/5 shadow-xs'
                : 'border-[#F0B55E]/30 text-white/90 hover:border-[#F0B55E] hover:text-[#F0B55E] bg-transparent'
            }`}
          >
            <User className="h-3.5 w-3.5 text-[#F0B55E]" />
            <span>MEMBROS</span>
          </button>

          {/* Botão com a engrenagem: FORA de qualquer box, afastado de membros para não confundir com o público */}
          <div className="ml-4 sm:ml-6 pl-3 sm:pl-5 border-l border-white/15 flex items-center">
            <button
              onClick={() => handleLinkClick('/painel')}
              title="Acesso Administrativo (Painel de Controles)"
              aria-label="Painel de Controles"
              className={`p-1.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
                isLinkActive('/painel')
                  ? 'text-[#F0B55E]'
                  : 'text-white/40 hover:text-[#F0B55E] hover:rotate-45'
              }`}
            >
              <Settings className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Hambúrguer Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 ml-3 lg:hidden text-white hover:text-[#F0B55E] focus:outline-none cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#2B2566] px-4 pt-3 pb-6 space-y-1.5 shadow-2xl">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`flex items-center justify-between w-full text-left py-2.5 px-3 rounded-lg text-xs uppercase tracking-wider font-medium cursor-pointer ${
                  active
                    ? 'bg-[#181343] text-[#F0B55E] font-bold'
                    : 'text-[#E6E3F1] hover:bg-[#181343] hover:text-[#F0B55E]'
                }`}
              >
                <span>{link.label}</span>
                {link.hasNewBadge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#F0B55E] text-[#2B2566] text-[8px] font-black">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-white/10 flex items-center gap-3">
            <button
              onClick={() => handleLinkClick('/membros')}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-transparent border border-[#F0B55E]/35 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white hover:text-[#F0B55E] cursor-pointer"
            >
              <User className="h-4 w-4 text-[#F0B55E]" />
              <span>ÁREA DE MEMBROS</span>
            </button>
            <button
              onClick={() => handleLinkClick('/painel')}
              className="p-2.5 text-white/40 hover:text-[#F0B55E] cursor-pointer"
              title="Painel de Controles"
              aria-label="Painel de Controles"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
