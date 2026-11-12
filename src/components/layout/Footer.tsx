/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Footer Oficial Moderno e Elegante
 * Paleta Oficial: Noite (#2B2566), Sol (#F0B55E), Lua (#F4EFE6), Névoa (#E6E3F1)
 * 
 * Estrutura:
 * - Mesma cor de fundo do cabeçalho (#2B2566)
 * - Coluna Institucional com Logo, Biografia, Selo de Cuidado e Redes Sociais em Destaque
 *   (Ícones oficiais com cores autênticas de alto contraste: Instagram, Facebook, YouTube, Spotify, WhatsApp)
 * - Mapa das Páginas em 4 Colunas Claras:
 *   1. Atendimentos e Serviços (Pronto Socorro Astrológico, Mapa Natal, Mapa Revolução Solar, Combo de Mapas)
 *   2. Palestras e Encontros (WAAP, Respirar e Acalmar, Autoconhecimento, Vamos Montar)
 *   3. Assinaturas (Patota Astral, Bússola Guia)
 *   4. Navegação & Conteúdo (Leituras Astrais, Lojinha, Área de Membros)
 * - Sub-footer limpo com Direitos Autorais, Proteção Legal (Lei nº 9.610/1998)
 *   e Crédito @orabolasdigital com o símbolo de ESPIRAL.
 */

import React from 'react';
import { ShieldCheck, Cookie } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative w-full bg-[#2B2566] text-[#FFFFFF] border-t border-[#F0B55E]/20 font-sans overflow-hidden">
      {/* Elementos Decorativos Sutis Celestes de Fundo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-white/5" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border border-dashed border-[#F0B55E]/10" />
        <div className="absolute top-10 left-1/3 text-[#F0B55E]/20 text-xs">✦</div>
        <div className="absolute bottom-12 right-1/4 text-white/20 text-xs">★</div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* =========================================================================
              COLUNA PRINCIPAL: LOGO, BIOGRAFIA, SELO E REDES SOCIAIS EM DESTAQUE
              ========================================================================= */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center">
              <img
                src="https://static.wixstatic.com/media/02c8e0_916db28bdef7413a82fde89b9ce7f738~mv2.png"
                alt="Casa 6 — Bianca Tofoli"
                className="h-10 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
                onClick={() => onNavigate('/inicio')}
              />
            </div>

            <p className="text-xs text-[#E6E3F1]/80 leading-relaxed max-w-sm font-light">
              Plataforma oficial de Bianca Tofoli: enfermeira, gestora, palestrante e astróloga. Consultas individuais de Mapa Natal, Bússola Guia, comunidade Patota Astral e palestras corporativas.
            </p>

            {/* Redes Sociais Oficiais em Grande Destaque e Cores Vibrantes (Apenas Ícones) */}
            <div className="pt-1">
              <div className="flex items-center gap-2.5">
                {/* Instagram Oficial */}
                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram @tofoli.bianca"
                  aria-label="Instagram de Bianca Tofoli"
                  className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#FF543E] via-[#D62976] to-[#962FBF] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-transform hover:scale-110 cursor-pointer"
                >
                  <svg className="h-5 w-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* Facebook Oficial */}
                {SITE_CONFIG.facebookUrl && (
                  <a
                    href={SITE_CONFIG.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Facebook Bianca Tofoli"
                    aria-label="Facebook de Bianca Tofoli"
                    className="h-10 w-10 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}

                {/* YouTube Oficial */}
                <a
                  href={SITE_CONFIG.youtubeUrl || 'https://www.youtube.com/@biancatofoli'}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Canal da Bianca no YouTube"
                  aria-label="Canal da Bianca no YouTube"
                  className="h-10 w-10 rounded-xl bg-[#FF0000] hover:bg-[#E60000] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-transform hover:scale-110 cursor-pointer"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* Spotify Oficial */}
                {SITE_CONFIG.spotifyUrl && (
                  <a
                    href={SITE_CONFIG.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Podcast Mapa Aberto no Spotify"
                    aria-label="Podcast Mapa Aberto no Spotify"
                    className="h-10 w-10 rounded-xl bg-[#1DB954] hover:bg-[#1AA34A] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  >
                    <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                  </a>
                )}

                {/* WhatsApp Oficial */}
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsappNumberRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`WhatsApp Oficial ${SITE_CONFIG.whatsappNumberFormatted}`}
                  aria-label="WhatsApp Oficial da Casa 6"
                  className="h-10 w-10 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-transform hover:scale-110 cursor-pointer"
                >
                  <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* =========================================================================
              MAPA DAS PÁGINAS (4 COLUNAS ESTRUTURADAS)
              ========================================================================= */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            
            {/* Coluna 1: Atendimentos */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#F0B55E] border-b border-[#F0B55E]/20 pb-2">
                Atendimentos
              </h3>
              <ul className="space-y-2.5 text-xs text-[#E6E3F1]/85">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/atendimentos')}
                    className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F0B55E]/50 group-hover:text-[#F0B55E] text-[10px] transition-colors">✦</span>
                    <span>Pronto Socorro Astrológico</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/atendimentos')}
                    className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F0B55E]/50 group-hover:text-[#F0B55E] text-[10px] transition-colors">✦</span>
                    <span>Mapa Natal</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/atendimentos')}
                    className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F0B55E]/50 group-hover:text-[#F0B55E] text-[10px] transition-colors">✦</span>
                    <span>Mapa Revolução Solar</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/atendimentos')}
                    className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F0B55E]/50 group-hover:text-[#F0B55E] text-[10px] transition-colors">✦</span>
                    <span>Combo de Mapas</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Coluna 2: Encontros */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#F0B55E] border-b border-[#F0B55E]/20 pb-2">
                Encontros
              </h3>
              <ul className="space-y-2.5 text-xs text-[#E6E3F1]/85">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/encontros')}
                    className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F0B55E]/50 group-hover:text-[#F0B55E] text-[10px] transition-colors">✦</span>
                    <span>WAAP</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/encontros')}
                    className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F0B55E]/50 group-hover:text-[#F0B55E] text-[10px] transition-colors">✦</span>
                    <span>Respirar e (A)calmar</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/encontros')}
                    className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F0B55E]/50 group-hover:text-[#F0B55E] text-[10px] transition-colors">✦</span>
                    <span>Autoconhecimento</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/encontros')}
                    className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F0B55E]/50 group-hover:text-[#F0B55E] text-[10px] transition-colors">✦</span>
                    <span>Vamos Montar</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Assinaturas */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#F0B55E] border-b border-[#F0B55E]/20 pb-2">
                Assinaturas
              </h3>
              <ul className="space-y-2.5 text-xs text-[#E6E3F1]/85">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/patota')}
                    className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F0B55E]/50 group-hover:text-[#F0B55E] text-[10px] transition-colors">✦</span>
                    <span>Patota Astral</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/bussola')}
                    className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F0B55E]/50 group-hover:text-[#F0B55E] text-[10px] transition-colors">✦</span>
                    <span>Bússola Guia</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Coluna 4: Conteúdos */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#F0B55E] border-b border-[#F0B55E]/20 pb-2">
                Conteúdos
              </h3>
              <ul className="space-y-2.5 text-xs text-[#E6E3F1]/85">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/leituras')}
                    className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F0B55E]/50 group-hover:text-[#F0B55E] text-[10px] transition-colors">✦</span>
                    <span>Leituras</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/loja')}
                    className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F0B55E]/50 group-hover:text-[#F0B55E] text-[10px] transition-colors">✦</span>
                    <span>Lojinha</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/membros')}
                    className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F0B55E]/50 group-hover:text-[#F0B55E] text-[10px] transition-colors">✦</span>
                    <span>Área de Membro</span>
                  </button>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Linha Divisória Fina Dourada */}
        <div className="my-10 h-px bg-white/10" />

        {/* =========================================================================
            SUB-FOOTER: COPYRIGHT, PROTEÇÃO LEGAL & DESENVOLVEDOR COM ESPIRAL
            ========================================================================= */}
        <div className="space-y-4 text-xs text-[#E6E3F1]/70">
          
          {/* Linha 1: Copyright e Links de LGPD / Cookies / Privacidade */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-[11px]">
              © {new Date().getFullYear()} {SITE_CONFIG.commercialName}. Todos os direitos reservados.
            </p>

            {/* Links e Botão de LGPD / Consentimento de Cookies */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2 text-[11px]">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('open-casa6-cookies'))}
                className="inline-flex items-center gap-1.5 text-[#E6E3F1]/80 hover:text-[#F0B55E] transition-colors cursor-pointer"
              >
                <Cookie className="h-3.5 w-3.5 text-[#F0B55E]" />
                <span>Preferências de Cookies</span>
              </button>
              <span className="text-white/20 select-none">•</span>
              <button
                type="button"
                onClick={() => onNavigate('/politica-de-privacidade')}
                className="text-[#E6E3F1]/80 hover:text-[#F0B55E] transition-colors cursor-pointer"
              >
                Privacidade (LGPD)
              </button>
              <span className="text-white/20 select-none">•</span>
              <button
                type="button"
                onClick={() => onNavigate('/politica-de-cookies')}
                className="text-[#E6E3F1]/80 hover:text-[#F0B55E] transition-colors cursor-pointer"
              >
                Política de Cookies
              </button>
            </div>
          </div>

          {/* Linha 2: Desenvolvido por @orabolasdigital Alinhado com Site Protegido contra Cópia */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-3 border-t border-white/5 text-[11px] text-center md:text-left">
            {/* Crédito Desenvolvido por @orabolasdigital com Ícone Espiral */}
            <div className="flex items-center justify-center md:justify-start gap-2">
              {/* Ícone Espiral Cósmica Oficial */}
              <svg
                className="h-4 w-4 text-[#F0B55E] shrink-0 transition-transform duration-700 hover:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label="Espiral Oras Bolas"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 8-3.58 8-8-3.58-6-7-6-5 2.24-5 5 2.24 4 4 4 3-1.34 3-3-1.34-2-2-2" />
              </svg>

              <span>
                Desenvolvido por{' '}
                <a
                  href={SITE_CONFIG.developerCreditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#F0B55E] underline underline-offset-2 font-bold transition-colors"
                >
                  @orabolasdigital
                </a>{' '}
                com estratégia humana e IA. Propriedade intelectual protegida.
              </span>
            </div>

            {/* Proteção / Site Seguro nos termos da Lei Federal nº 9.610/1998 */}
            <div className="flex items-center justify-center md:justify-end gap-1.5 text-[11px] text-[#25D366] shrink-0">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#25D366]" />
              <span className="text-[#E6E3F1]/75">
                {SITE_CONFIG.legalNotice}
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
