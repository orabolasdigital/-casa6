/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /sobre
 * Sobre Bianca Tofoli & Casa 6 (Estrutura Leve e Fluida Inspirada na Identidade Original)
 * 
 * Funcionalidades e Design:
 * - Fundo suave, luminoso e acolhedor (#FAF8F5).
 * - Blocos flutuantes arredondados (rounded-3xl / rounded-[32px]) com sombras etéreas.
 * - Efeito de subida suave ao scroll (como nuvens flutuando) com IntersectionObserver.
 * - Organização baseada na página original:
 *   1. Bloco superior dividido: Texto de apresentação da Casa 6 à esquerda e Logo Oficial à direita.
 *   2. Bloco central unificado: Foto da Bianca com animações cósmicas e órbitas celestes (mesmos parâmetros da Home) à esquerda, Biografia & Propósito à direita.
 *   3. Bloco inferior dos Pilares: Introdução harmoniosa e os 3 pilares flutuantes com ícones 3D celestes (Autoconhecimento, Equilíbrio, Expansão).
 *   4. Bloco de CTA suave para atendimento e conversa no WhatsApp.
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BRAND_ASSETS, SITE_CONFIG } from '../../config/site';

interface SobreViewProps {
  onOpenBooking: () => void;
}

/**
 * Componente utilitário para animação suave de subida ao rolar a página (como nuvens)
 */
const RevealOnScroll: React.FC<{
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}> = ({ children, delayMs = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-10 scale-[0.99]'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const SobreView: React.FC<SobreViewProps> = ({ onOpenBooking }) => {
  return (
    <div className="bg-[#FAF8F5] text-[#2B2566] min-h-screen py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden relative">
      
      {/* Elementos Cósmicos Decorativos Efémeros ao Fundo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-20 left-[-80px] w-96 h-96 rounded-full border border-[#F0B55E]/15 opacity-40 animate-celestial-orbit-slow" />
        <div className="absolute top-1/2 right-[-100px] w-[500px] h-[500px] rounded-full border border-[#8C987F]/10 opacity-50 animate-celestial-orbit-reverse" />
        <div className="absolute bottom-40 left-10 text-[#F0B55E]/40 text-xs animate-pulse">✦</div>
        <div className="absolute top-48 right-1/4 text-[#8C987F]/30 text-[10px]">★</div>
      </div>

      <div className="mx-auto max-w-5xl space-y-10 sm:space-y-14 relative z-10">
        
        {/* =========================================================================
            BLOCO 1: A CASA 6 + LOGO OFICIAL (DISTRIBUIÇÃO EM 2 COLUNAS DA PÁGINA ANTERIOR)
            ========================================================================= */}
        <RevealOnScroll delayMs={50}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Texto Apresentação da Casa 6 em Box Suave e Arredondado */}
            <div className="lg:col-span-7 bg-white/90 backdrop-blur-xs rounded-[28px] sm:rounded-3xl p-7 sm:p-9 border border-[#EADBCC]/60 shadow-[0_12px_36px_rgba(43,37,102,0.04)] hover:shadow-[0_16px_44px_rgba(43,37,102,0.06)] transition-all duration-500 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F] block">
                PROPÓSITO & MISSÃO
              </span>
              <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed font-normal">
                A Casa 6 nasceu com o propósito de promover o autoconhecimento, a expansão da consciência e o equilíbrio entre vida pessoal e profissional. Criamos um espaço seguro onde cada pessoa pode se reconectar consigo mesma e encontrar ferramentas para viver com mais clareza, propósito e bem-estar.
              </p>
              <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed font-normal">
                Nosso trabalho é guiado pelo princípio de que o autoconhecimento é uma das chaves para uma vida mais harmoniosa. Unimos astrologia, terapias integrativas e consultorias personalizadas para oferecer suporte tanto no nível individual quanto no corporativo.
              </p>
            </div>

            {/* Logo Oficial Casa 6 Centrado e Fluido */}
            <div className="lg:col-span-5 flex items-center justify-center p-4 sm:p-6">
              <div className="transition-transform duration-700 hover:scale-105">
                <img
                  src={BRAND_ASSETS.logoHorizontalEscuro}
                  alt="Casa 6 — Bianca Tofoli"
                  className="w-56 sm:w-68 md:w-76 h-auto object-contain filter drop-shadow-[0_4px_12px_rgba(43,37,102,0.05)]"
                  draggable={false}
                />
              </div>
            </div>

          </div>
        </RevealOnScroll>

        {/* =========================================================================
            BLOCO 2: BIANCA TOFOLI (FOTO COM ANIMAÇÃO CÓSMICA DA HOME + NARRATIVA)
            Card único integrado, cantos arredondados e foto centralizada com órbitas
            ========================================================================= */}
        <RevealOnScroll delayMs={100}>
          <div className="bg-white/95 backdrop-blur-xs rounded-[32px] sm:rounded-[36px] p-7 sm:p-10 lg:p-12 border border-[#EADBCC]/60 shadow-[0_20px_50px_rgba(43,37,102,0.05)] hover:shadow-[0_24px_60px_rgba(43,37,102,0.07)] transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Foto Centralizada com Animações Cósmicas da Home */}
              <div className="lg:col-span-5 flex justify-center items-center py-4 sm:py-6">
                <div className="relative w-64 sm:w-76 md:w-84 aspect-square flex items-center justify-center">
                  
                  {/* 1. Disco Sol decorativo ao fundo com pulso cósmico */}
                  <div className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-44 sm:w-56 h-44 sm:h-56 rounded-full bg-gradient-to-br from-[#F0B55E] to-[#E5A548] opacity-90 pointer-events-none animate-celestial-sun shadow-xl shadow-[#F0B55E]/25" />

                  {/* 2. Anel de Cintilação / Brilho Suave */}
                  <div className="absolute inset-[-12px] sm:inset-[-16px] rounded-full border border-[#F0B55E]/40 pointer-events-none animate-celestial-shimmer" />

                  {/* 3. Órbita Externa Pontilhada com Rotação Lenta e Marcadores */}
                  <div className="absolute inset-[-24px] sm:inset-[-32px] rounded-full border border-dashed border-[#2B2566]/25 pointer-events-none animate-celestial-orbit-slow">
                    {/* Pérola Cósmica no topo */}
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#F0B55E] shadow-sm shadow-[#F0B55E]/80 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    {/* Estrela de 4 pontas decorativa */}
                    <div className="absolute top-1/3 -right-1 text-[11px] text-[#F0B55E] font-heading select-none">✦</div>
                    {/* Marcador Oliva */}
                    <div className="absolute -bottom-1 left-1/3 w-2.5 h-2.5 rounded-full bg-[#8C987F] opacity-75" />
                  </div>

                  {/* 4. Órbita Interna com Rotação Reversa */}
                  <div className="absolute inset-[-8px] sm:inset-[-12px] rounded-full border border-[#8C987F]/35 rotate-45 pointer-events-none animate-celestial-orbit-reverse">
                    <div className="absolute top-1 right-8 w-2 h-2 rounded-full bg-[#2B2566]/50" />
                  </div>

                  {/* 5. Moldura Circular Principal da Foto com Enquadramento Oficial */}
                  <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl ring-1 ring-[#F0B55E]/25">
                    <img
                      src="https://static.wixstatic.com/media/02c8e0_54a33eeb476d45c49b7f4953c34177fc~mv2.jpeg"
                      alt="Bianca Tofoli — Fundadora da Casa 6"
                      className="w-full h-full object-cover protected-img"
                      style={{ objectPosition: '50% 8%' }}
                      draggable={false}
                    />
                  </div>
                </div>
              </div>

              {/* Narrativa Editorial Completa de Bianca Tofoli */}
              <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F] block">
                    BIOGRAFIA & PROPÓSITO
                  </span>
                  <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B2566] tracking-tight">
                    Bianca Tofoli
                  </h1>
                  
                  {/* Linha-Ponto do Brand Guide */}
                  <div className="flex items-center justify-center lg:justify-start gap-3 py-1">
                    <span className="w-10 h-px bg-[#2B2566]/20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]" />
                    <span className="w-16 h-px bg-[#2B2566]/20" />
                  </div>
                </div>

                <div className="space-y-3.5 text-xs sm:text-[13.5px] text-[#423C7B] leading-relaxed font-normal">
                  <p>
                    Sou Bianca Tofoli, enfermeira formada pela UNESP - Botucatu, com mais de 10 anos de experiência em gestão de saúde e liderança de equipes, chegando a coordenar nove unidades de atendimento em SP. Em 2021, segui um novo chamado e fiz minha transição de carreira para a astrologia, trazendo comigo o propósito de continuar cuidando de pessoas — agora, de um jeito diferente.
                  </p>
                  <p>
                    Acredito que a astrologia é uma poderosa ferramenta de autoconhecimento e transformação. Meu objetivo é integrá-la ao dia a dia das pessoas, na rotina, ajudando-as a encontrar mais equilíbrio e realização em suas carreiras, relacionamentos, saúde e bem-estar. Quero que cada pessoa descubra sua própria essência e viva de forma mais consciente e alinhada com seus propósitos.
                  </p>

                  {/* Citação em Destaque com Tom Dourado/Ocre Queimado */}
                  <div className="py-1 pl-4 sm:pl-5 border-l-2 border-[#B87314] my-2 text-left">
                    <blockquote className="font-heading text-sm sm:text-base text-[#2B2566] italic leading-snug">
                      “Para mim, tudo tem rachaduras — mas é por elas que entra a luz, se assim permitirmos!”
                    </blockquote>
                  </div>

                  <p>
                    A Casa 6 é a materialização desse propósito: um espaço onde você pode se compreender, alinhar sua energia e viver com mais autenticidade.
                  </p>
                </div>

                <div className="pt-2 flex justify-center lg:justify-start">
                  <button
                    onClick={onOpenBooking}
                    className="inline-flex items-center gap-2 rounded-full border border-[#F0B55E] bg-transparent hover:bg-[#F0B55E]/10 px-6 py-3 text-xs font-medium text-[#2B2566] hover:text-[#B87314] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer uppercase tracking-wider"
                  >
                    <span>Falar com Bianca no WhatsApp</span>
                    <ArrowRight className="h-4 w-4 text-[#F0B55E]" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            BLOCO 3: PILARES FUNDAMENTAIS (CARD LEVE COM OS 3 ÍCONES 3D CÉLESTES)
            Mesma leveza da página anterior, sem boxes rígidos internos
            ========================================================================= */}
        <RevealOnScroll delayMs={150}>
          <div className="bg-white/95 backdrop-blur-xs rounded-[32px] sm:rounded-[36px] p-7 sm:p-10 lg:p-12 border border-[#EADBCC]/60 shadow-[0_20px_50px_rgba(43,37,102,0.05)] hover:shadow-[0_24px_60px_rgba(43,37,102,0.07)] transition-all duration-500 space-y-8 sm:space-y-10">
            
            {/* Texto de Introdução dos Pilares */}
            <div className="text-center max-w-2xl mx-auto space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F] block">
                NOSSOS PILARES
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566] tracking-tight">
                Pilares Fundamentais
              </h2>
              <p className="text-xs sm:text-[13px] text-[#423C7B] leading-relaxed font-normal">
                Acreditamos que compreender a si mesmo é o primeiro passo para transformar sua vida. Quando você entende seus ciclos, padrões e potencialidades, é capaz de fazer escolhas mais alinhadas com o seu propósito e desenvolver relações mais saudáveis consigo e com os outros.
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#B87314] pt-1">
                Nosso trabalho é pautado em três pilares fundamentais:
              </p>
            </div>

            {/* Os 3 Pilares Flutuantes (com Ícones 3D Celestiais Oficiais) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-2">
              
              {/* Pilar 1: Autoconhecimento */}
              <div className="text-center space-y-3 p-4 rounded-2xl hover:bg-[#FAF8F5]/80 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto flex items-center justify-center">
                  <img
                    src="/assets/aistudio/image_30c7e042.png"
                    alt="Pilar Autoconhecimento — Casa 6"
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(43,37,102,0.08)] transition-transform duration-500 hover:scale-110"
                    draggable={false}
                  />
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-[#2B2566]">
                  Autoconhecimento
                </h3>
                <p className="text-xs text-[#423C7B] leading-relaxed max-w-xs mx-auto font-light">
                  Ferramentas para que você se compreenda melhor e use esse conhecimento no seu dia a dia.
                </p>
              </div>

              {/* Pilar 2: Equilíbrio */}
              <div className="text-center space-y-3 p-4 rounded-2xl hover:bg-[#FAF8F5]/80 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto flex items-center justify-center">
                  <img
                    src="/assets/aistudio/image_77bb79cb.png"
                    alt="Pilar Equilíbrio — Casa 6"
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(43,37,102,0.08)] transition-transform duration-500 hover:scale-110"
                    draggable={false}
                  />
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-[#2B2566]">
                  Equilíbrio
                </h3>
                <p className="text-xs text-[#423C7B] leading-relaxed max-w-xs mx-auto font-light">
                  Estratégias para harmonizar sua energia, rotina e relações com leveza e clareza.
                </p>
              </div>

              {/* Pilar 3: Expansão */}
              <div className="text-center space-y-3 p-4 rounded-2xl hover:bg-[#FAF8F5]/80 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto flex items-center justify-center">
                  <img
                    src="/assets/aistudio/image_a6eb609e.png"
                    alt="Pilar Expansão — Casa 6"
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(43,37,102,0.08)] transition-transform duration-500 hover:scale-110"
                    draggable={false}
                  />
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-[#2B2566]">
                  Expansão
                </h3>
                <p className="text-xs text-[#423C7B] leading-relaxed max-w-xs mx-auto font-light">
                  Conhecimento aplicado para que você possa evoluir de forma contínua e consciente.
                </p>
              </div>

            </div>

          </div>
        </RevealOnScroll>

        {/* =========================================================================
            BLOCO 4: BANNER CTA ELEGANTE E DISCRETO (ATENDIMENTO ONLINE GLOBAL)
            ========================================================================= */}
        <RevealOnScroll delayMs={200}>
          <div className="rounded-[28px] sm:rounded-3xl bg-gradient-to-r from-[#2B2566] via-[#211B55] to-[#362E7A] text-white p-7 sm:p-9 border border-[#F0B55E]/30 shadow-[0_16px_40px_rgba(43,37,102,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F0B55E] flex items-center justify-center md:justify-start gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#F0B55E]" />
                ATENDIMENTO ONLINE GLOBAL
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                Agende sua Consulta com Bianca Tofoli
              </h3>
              <p className="text-xs text-[#E6E3F1]/80 max-w-lg font-light">
                Sessões individuais personalizadas via Google Meet ou presencial em São Paulo.
              </p>
            </div>

            <button
              onClick={onOpenBooking}
              className="shrink-0 inline-flex items-center gap-2 rounded-full border border-[#F0B55E] bg-[#F0B55E] hover:bg-[#dfa247] text-[#2B2566] font-bold py-3 px-7 text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>AGENDAR VIA WHATSAPP</span>
              <ArrowRight className="h-4 w-4 text-[#2B2566]" />
            </button>
          </div>
        </RevealOnScroll>

      </div>
    </div>
  );
};