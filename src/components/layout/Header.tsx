/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Header Oficial alinhado à Nova Identidade Visual (Brand Guide 2026)
 * Paleta: Noite (#2B2566), Sol (#F0B55E), Lua (#F4EFE6), Névoa (#E6E3F1), Oliva (#8C987F)
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, User, Settings } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenBooking: (serviceId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Trava scroll da tela quando menu sanduíche mobile estiver aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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

        {/* Ações Direitas: Botão Membros e Engrenagem (Apenas em telas Desktop) + Hambúrguer Mobile */}
        <div className="flex items-center">
          
          {/* Botão com ícone escrito "Membros" — oculto no mobile, acessível pelo menu sanduíche */}
          <button
            onClick={() => handleLinkClick('/membros')}
            title="Área de Membros (Login com E-mail e CPF)"
            aria-label="Área de Membros"
            className={`hidden lg:inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-all cursor-pointer ${
              isLinkActive('/membros')
                ? 'border-[#F0B55E] text-[#F0B55E] bg-white/5 shadow-xs'
                : 'border-[#F0B55E]/30 text-white/90 hover:border-[#F0B55E] hover:text-[#F0B55E] bg-transparent'
            }`}
          >
            <User className="h-3.5 w-3.5 text-[#F0B55E]" />
            <span>MEMBROS</span>
          </button>

          {/* Botão com a engrenagem: oculto no mobile, discreto no desktop */}
          <div className="hidden lg:flex ml-4 sm:ml-6 pl-3 sm:pl-5 border-l border-white/15 items-center">
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
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 ml-2 lg:hidden text-white hover:text-[#F0B55E] focus:outline-none cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-label="Abrir Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          MENU SANDUÍCHE MOBILE (DRAWER 80% DA LARGURA ALINHADO À DIREITA)
          Textos sempre alinhados à direita. Tag 'n' da bússola à esquerda do texto.
          Apenas botão Área de Membros no rodapé, sem engrenagem.
          ========================================================================= */}
      {/* Backdrop com desfoque */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Container do Drawer à Direita */}
      <div
        className={`fixed top-0 right-0 h-full w-[80vw] max-w-[340px] bg-[#2B2566] text-[#FFFFFF] z-50 shadow-2xl flex flex-col justify-between p-6 lg:hidden overflow-y-auto transform transition-transform duration-300 ease-in-out border-l border-[#F0B55E]/20 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de Navegação"
      >
        <div>
          {/* Topo do Menu Sanduíche: Botão Fechar à Direita */}
          <div className="flex items-center justify-end pb-4 border-b border-white/10">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-white/70 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5"
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Lista de Navegação: Todos os itens estritamente alinhados à direita */}
          <nav className="flex flex-col items-end gap-1.5 py-6 w-full" aria-label="Navegação Mobile">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`w-full py-3 px-2 text-right flex items-center justify-end gap-2 text-xs uppercase tracking-[0.14em] font-medium transition-colors cursor-pointer ${
                    active
                      ? 'text-[#F0B55E] font-bold'
                      : 'text-[#E6E3F1]/85 hover:text-[#F0B55E]'
                  }`}
                >
                  {/* Tag 'n' da bússola posicionada do lado esquerdo do texto */}
                  {link.hasNewBadge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#F0B55E] text-[#2B2566] text-[9px] font-black leading-none uppercase tracking-tight">
                      n
                    </span>
                  )}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé do Menu Sanduíche: Apenas botão 'Área de Membros' (sem engrenagem) */}
        <div className="pt-4 border-t border-white/10 mt-auto">
          <button
            onClick={() => handleLinkClick('/membros')}
            className="w-full flex items-center justify-center gap-2 rounded-full border border-[#F0B55E] bg-[#F0B55E] hover:bg-[#dfa247] text-[#2B2566] py-3 px-4 text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer active:scale-98"
          >
            <User className="h-4 w-4" />
            <span>Área de Membros</span>
          </button>
        </div>
      </div>
    </header>
  );
};
