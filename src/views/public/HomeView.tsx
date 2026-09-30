/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: Home Oficial (/inicio)
 * 
 * Correção Visual e UX (Etapa Oficial de Refinamento):
 * 1. Hero Principal com fundo fotográfico celestial full-width e parallax real
 * 2. Seção Bianca Tofoli com alto respiro editorial e composição humana
 * 3. Atendimentos com cartas de tarô autênticas em proporção vertical 5:8 (mobile peek carousel)
 * 4. Depoimentos em carrossel contínuo (marquee infinito linear suave com pausa no hover)
 * 5. Banner Patota Astral em 100vw full-bleed com imagem de fundo e parallax
 * 6. Vivência "Curando os Ciclos" em carta de tarô maior + 4 cartas de palestras em proporção 5:8
 * 7. Leituras (Blog) em cartas de tarô editoriais verticais 5:8 com direcionamento para /leituras
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Star, Calendar, Quote, MessageCircle } from 'lucide-react';
import { OFFICIAL_SERVICES, OFFICIAL_LECTURES, OFFICIAL_EXPERIENCES, OFFICIAL_TESTIMONIALS } from '../../config/site';
import { TarotCard } from '../../components/common/TarotCard';

interface HomeViewProps {
  onOpenBooking: (serviceId?: string) => void;
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenBooking, onNavigate }) => {
  // Controle de Scroll Parallax com respeito a prefers-reduced-motion
  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    const handleScroll = () => {
      if (!mediaQuery.matches) {
        setScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 3 Atendimentos Centrais Selecionados para a Home
  const featuredServices = [
    OFFICIAL_SERVICES.find((s) => s.id === 'mapa-natal-nascimento') || OFFICIAL_SERVICES[2],
    OFFICIAL_SERVICES.find((s) => s.id === 'mapa-revolucao-solar') || OFFICIAL_SERVICES[4],
    OFFICIAL_SERVICES.find((s) => s.id === 'combo-mapa-roda-revolucao') || OFFICIAL_SERVICES[5]
  ];

  // Artigos Editoriais da Seção 7 (Leituras)
  const blogPosts = [
    {
      id: 'eclipse-lunar-em-peixes',
      title: 'Eclipse Lunar em Peixes: O que essa energia desperta?',
      excerpt: 'Dissolução de ilusões e o chamado para acolher a sensibilidade intuitiva nos ciclos reais.',
      category: 'ECLIPSE',
      roman: 'I',
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'mercurio-retrogrado-guia-consciente',
      title: 'Mercúrio Retrógrado: Navegando com consciência',
      excerpt: 'Por que a retrogradação é uma pausa biográfica necessária para revisar acordos e rotas.',
      category: 'TRÂNSITOS',
      roman: 'II',
      imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'ano-novo-astrologico-renovacao',
      title: 'Ano Novo Astrológico: Propósito e novos ciclos',
      excerpt: 'O ingresso do Sol em Áries e a preparação para semear intenções duradouras.',
      category: 'CICLOS',
      roman: 'III',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="bg-[#F3EEE5] text-[#211D35] overflow-x-hidden">

      {/* =========================================================================
          SEÇÃO 1: HERO PRINCIPAL COM FUNDO FOTOGRÁFICO FULL-WIDTH & PARALLAX REAL
          ========================================================================= */}
      <section className="relative overflow-hidden w-full bg-[#080C35] text-[#FFFFFF] py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8 border-b border-[#22205A]/80">
        {/* Imagem Real de Fundo Celestial Full-Width com Parallax */}
        <div
          className="absolute inset-0 pointer-events-none bg-cover bg-center transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2000&q=85')`,
            transform: prefersReducedMotion ? 'none' : `translateY(${scrollY * 0.2}px) scale(1.1)`,
            opacity: 0.38
          }}
        />

        {/* Camada de Gradiente Atmosférico Institucional */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080C35] via-[#080C35]/90 to-[#22205A]/75 pointer-events-none" />

        {/* Elementos Astrais de Céu Noturno & Órbitas Sutis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-12 left-12 text-[#FFB63F] opacity-75 text-xs font-heading">✦</div>
          <div className="absolute top-36 left-1/3 text-[#DAD2C4] opacity-40 text-[10px]">★</div>
          <div className="absolute bottom-16 left-1/4 text-[#FFB63F] opacity-60 text-xs font-heading">✦</div>
          <div className="absolute top-1/4 right-1/3 text-[#DAD2C4] opacity-30 text-sm">✨</div>

          {/* Órbita Elíptica Dourada Sutil */}
          <svg className="absolute -top-32 right-0 w-[620px] lg:w-[900px] h-[620px] lg:h-[900px] opacity-30" viewBox="0 0 800 800" fill="none">
            <ellipse cx="650" cy="400" rx="360" ry="240" stroke="#FFB63F" strokeWidth="0.8" strokeDasharray="3 4" transform="rotate(-25 650 400)" />
            <circle cx="340" cy="310" r="3" fill="#FFB63F" />
            <circle cx="480" cy="220" r="2.5" fill="#FFB63F" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
          {/* Lado Esquerdo: Tipografia e CTA para /atendimentos */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#DAD2C4] font-medium">
              <span>ASTROLOGIA</span>
              <span className="text-[#FFB63F]">•</span>
              <span>AUTOCONHECIMENTO</span>
              <span className="text-[#FFB63F]">•</span>
              <span>BEM-ESTAR</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
              Autoconhecimento,<br />
              equilíbrio e transformação<br />
              <span className="italic font-normal text-[#FFB63F]">para a sua vida.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#DAD2C4] leading-relaxed max-w-xl font-normal">
              Descubra a Casa 6 e se conecte com a sua essência através da astrologia e de práticas que integram corpo, mente e espírito em uma leitura lúcida e acolhedora.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => onNavigate('/atendimentos')}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#FFB63F] px-8 py-3.5 text-xs sm:text-sm font-bold text-[#080C35] shadow-xl hover:bg-[#EAA329] transition-all transform hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
              >
                <span>CONHEÇA NOSSOS ATENDIMENTOS</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-[#080C35]" />
              </button>

              <button
                onClick={() => onOpenBooking()}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#FFB63F]/50 bg-[#080C35]/60 backdrop-blur-xs px-6 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#22205A] transition-colors cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-[#FFB63F]" />
                <span>Agendar Consulta</span>
              </button>
            </div>
          </div>

          {/* Lado Direito: Grande Planeta Iluminado e Arco de Fases Lunares */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            <div className="relative w-72 sm:w-96 lg:w-[440px] aspect-square flex items-center justify-center">
              
              {/* Esfera Planetária com Atmosfera Luminosa */}
              <div className="absolute right-0 top-6 w-64 sm:w-80 lg:w-96 aspect-square rounded-full shadow-[0_0_80px_rgba(111,77,132,0.45)] overflow-hidden">
                <div 
                  className="w-full h-full rounded-full bg-cover bg-center transform scale-105"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80')`,
                    boxShadow: 'inset -25px -25px 60px rgba(8,12,53,0.9), inset 15px 15px 40px rgba(255,182,63,0.25)'
                  }}
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#080C35]/80 via-transparent to-[#835787]/30 pointer-events-none" />
              </div>

              {/* Arco com Fases da Lua (Nova, Quarto, Gibosa, Cheia) */}
              <div className="absolute left-0 bottom-6 flex items-center gap-2 sm:gap-3 bg-[#080C35]/75 backdrop-blur-md p-2.5 sm:p-3 rounded-full border border-[#FFB63F]/35 shadow-xl z-20">
                <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#22205A] border border-[#DAD2C4]/40 relative overflow-hidden flex items-center justify-end">
                  <div className="w-2.5 h-full bg-[#DAD2C4] rounded-r-full shadow-xs"></div>
                </div>
                <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#22205A] border border-[#DAD2C4]/50 relative overflow-hidden flex items-center justify-end">
                  <div className="w-3.5 h-full bg-[#DAD2C4] rounded-r-full"></div>
                </div>
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-[#22205A] border border-[#FFB63F]/60 relative overflow-hidden flex items-center justify-end">
                  <div className="w-5 h-full bg-[#FCFAF7] rounded-r-full shadow-xs"></div>
                </div>
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-[#FCFAF7] shadow-[0_0_12px_rgba(255,182,63,0.6)] border border-[#FFB63F]"></div>
              </div>

              <div className="absolute top-4 left-6 text-[#FFB63F] text-2xl font-heading animate-pulse">✦</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 2: BIANCA TOFOLI (RESPIRO EDITORIAL EXPANDIDO & CONEXÃO HUMANA)
          ========================================================================= */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-[#DAD2C4]/80">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Foto de Bianca Tofoli em Moldura Orbital Ampla */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 sm:w-84 lg:w-92 aspect-square">
                {/* Anéis orbitais dourados ao redor da foto */}
                <div className="absolute inset-0 rounded-full border border-[#FFB63F] -rotate-12 scale-110 pointer-events-none"></div>
                <div className="absolute inset-0 rounded-full border border-[#DAD2C4] rotate-45 scale-105 pointer-events-none"></div>
                
                {/* Estrelas na órbita */}
                <div className="absolute -top-3 -left-3 text-[#FFB63F] text-2xl font-heading">✦</div>
                <div className="absolute -bottom-2 -left-2 w-3.5 h-3.5 rounded-full bg-[#FFB63F]"></div>
                <div className="absolute top-1/2 -right-3 text-[#DAD2C4] text-xs">✧</div>

                {/* Imagem circular da Bianca Tofoli */}
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                    alt="Bianca Tofoli — Astróloga e Fundadora da Casa 6"
                    className="w-full h-full object-cover object-center protected-img"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            {/* Composição Editorial Aberta com Bastante Respiro */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6F4D84] block">
                  ASTRÓLOGA & FUNDADORA
                </span>
                <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[#22205A] tracking-tight">
                  Bianca Tofoli
                </h2>
                <p className="text-sm sm:text-base text-[#534D6B] leading-relaxed max-w-xl font-normal pt-2">
                  Acredito que a astrologia é uma poderosa ferramenta de autoconhecimento e transformação. Meu trabalho busca integrar essa sabedoria ao cotidiano real das pessoas, ajudando-as a encontrar clareza em seus ciclos, autonomia em suas escolhas e harmonia entre o invisível e a matéria.
                </p>
              </div>

              {/* Bloco de Citação Editorial */}
              <div className="pt-2 pl-6 border-l-2 border-[#FFB63F] space-y-2">
                <blockquote className="font-heading italic text-lg sm:text-2xl text-[#22205A] leading-snug">
                  “Para mim, tudo tem rachaduras — mas é por elas que entra a luz.”
                </blockquote>
                <span className="text-xs uppercase tracking-wider text-[#6F4D84] font-medium block">
                  Filosofia da Casa 6
                </span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/sobre')}
                  className="inline-flex items-center gap-2.5 rounded-full border border-[#22205A] px-7 py-3 text-xs sm:text-sm font-semibold text-[#22205A] hover:bg-[#22205A] hover:text-white transition-all cursor-pointer shadow-xs"
                >
                  <span>CONHEÇA MINHA HISTÓRIA</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 3: ATENDIMENTOS (VERDADEIRAS CARTAS DE TARÔ VERTICAIS 5:8)
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#DAD2C4]/80">
        <div className="mx-auto max-w-7xl space-y-12">
          {/* Header da Seção */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6F4D84]">
                CONSULTAS & ORIENTAÇÃO
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#22205A] tracking-tight">
                Atendimentos Astrológicos
              </h2>
              <p className="text-xs sm:text-sm text-[#534D6B] max-w-xl">
                Cartas de orientação cósmica desenhadas para acolher o seu momento. Escolha a sua jornada e inicie a conversa com Bianca pelo WhatsApp.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/atendimentos')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#22205A] hover:text-[#FFB63F] uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
            >
              <span>VER TODOS OS ATENDIMENTOS</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Grade no Desktop & Carrossel Horizontal com Peek no Mobile */}
          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
            {featuredServices.map((service, index) => (
              <div 
                key={service.id}
                className="min-w-[280px] sm:min-w-[300px] md:min-w-0 flex-1 snap-start shrink-0"
              >
                <TarotCard
                  romanNumeral={index === 0 ? 'I' : index === 1 ? 'II' : 'III'}
                  categoryBadge={service.categoryGroup?.toUpperCase()}
                  title={service.title}
                  subtitle={service.shortDescription}
                  imageUrl={service.tarotImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'}
                  actionLabel="AGENDAR CONSULTA"
                  onAction={() => onOpenBooking(service.id)}
                />
              </div>
            ))}
          </div>

          {/* Dica visual de rolagem em mobile */}
          <p className="text-[11px] text-center text-[#7A7394] md:hidden">
            ← Deslize para ver todas as cartas →
          </p>
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 4: DEPOIMENTOS (CARROSSEL CONTÍNUO / MARQUEE INFINITO SUAVE)
          ========================================================================= */}
      <section className="py-20 sm:py-28 border-b border-[#DAD2C4]/80 bg-[#FCFAF7] overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 text-center mb-10">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6F4D84]">
              TESTEMUNHOS REAIS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#22205A] tracking-tight">
              O que dizem sobre a Casa 6
            </h2>
            <p className="text-xs sm:text-sm text-[#534D6B] max-w-lg mx-auto">
              Depoimentos de pessoas que encontraram clareza e direção através do atendimento com Bianca Tofoli.
            </p>
          </div>
        </div>

        {/* Trilho Horizontal Infinito Contínuo (Marquee Linear Suave) */}
        <div className="relative w-full overflow-hidden py-3">
          {/* Fades Laterais para Suavidade Estética */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#FCFAF7] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#FCFAF7] to-transparent z-10 pointer-events-none" />

          {/* Trilho Duplicado para Loop Infinito Contínuo */}
          <div className="animate-marquee-continuous flex gap-6">
            {/* Lote 1 */}
            {OFFICIAL_TESTIMONIALS.map((item) => (
              <div
                key={`t1-${item.id}`}
                className="w-[320px] sm:w-[420px] rounded-2xl bg-white border border-[#DAD2C4] p-6 sm:p-7 shadow-xs shrink-0 flex flex-col justify-between space-y-4 hover:border-[#FFB63F] transition-colors"
              >
                <div className="space-y-3">
                  <div className="text-3xl text-[#FFB63F] font-heading leading-none">“</div>
                  <p className="font-heading italic text-xs sm:text-sm text-[#22205A] leading-relaxed">
                    {item.content}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#DAD2C4]/50 flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-[#22205A]">
                    {item.authorName}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#6F4D84] font-semibold">
                    {item.serviceTitle}
                  </span>
                </div>
              </div>
            ))}

            {/* Lote 2 (Duplicado para loop sem emenda) */}
            {OFFICIAL_TESTIMONIALS.map((item) => (
              <div
                key={`t2-${item.id}`}
                className="w-[320px] sm:w-[420px] rounded-2xl bg-white border border-[#DAD2C4] p-6 sm:p-7 shadow-xs shrink-0 flex flex-col justify-between space-y-4 hover:border-[#FFB63F] transition-colors"
              >
                <div className="space-y-3">
                  <div className="text-3xl text-[#FFB63F] font-heading leading-none">“</div>
                  <p className="font-heading italic text-xs sm:text-sm text-[#22205A] leading-relaxed">
                    {item.content}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#DAD2C4]/50 flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-[#22205A]">
                    {item.authorName}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#6F4D84] font-semibold">
                    {item.serviceTitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-center text-[#7A7394] pt-4">
          Passe o mouse ou toque no card para pausar a rolagem
        </p>
      </section>

      {/* =========================================================================
          SEÇÃO 5: BANNER PATOTA ASTRAL (100VW FULL BLEED COM PARALLAX REAL)
          ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#080C35] text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-[#22205A]">
        {/* Fundo Fotográfico Full Bleed com Parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2200&q=85')`,
            transform: prefersReducedMotion ? 'none' : `translateY(${scrollY * 0.12}px) scale(1.1)`,
            opacity: 0.32
          }}
        />

        {/* Gradiente Noturno Escuro para Garantir Alto Contraste */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080C35]/95 via-[#22205A]/85 to-[#080C35]/95 pointer-events-none" />

        {/* Círculo Orbital Decorativo */}
        <svg className="absolute -right-20 -top-20 w-80 h-80 opacity-20 pointer-events-none" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" stroke="#FFB63F" strokeWidth="0.5" strokeDasharray="3 4" fill="none" />
          <circle cx="88" cy="50" r="3" fill="#FFB63F" />
        </svg>

        <div className="relative mx-auto max-w-7xl z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#DAD2C4]">
              COMUNIDADE EXCLUSIVA POR ASSINATURA
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Patota Astral
            </h2>
            <p className="font-heading text-base sm:text-xl font-medium text-[#FFB63F]">
              Astrologia diária por assinatura com Bianca Tofoli
            </p>
            <p className="text-xs sm:text-sm text-[#DAD2C4] leading-relaxed max-w-xl font-normal">
              Conecte-se com a energia de cada ciclo, antecipe desafios e potencialize oportunidades. Encontros mensais de lua nova e cheia, canal fechado de estudos e cadernos astrológicos.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onNavigate('/patota')}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#FFB63F] px-9 py-4 text-xs sm:text-sm font-bold text-[#080C35] hover:bg-[#EAA329] transition-all transform hover:scale-105 active:scale-100 shadow-2xl cursor-pointer"
            >
              <span>QUERO FAZER PARTE DA PATOTA</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 6: VIVÊNCIA "CURANDO OS CICLOS" (DESTAQUE) + CARDS DE PALESTRAS
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#DAD2C4]/80">
        <div className="mx-auto max-w-7xl space-y-16">
          
          {/* PARTE A: DESTAQUE PRINCIPAL — VIVÊNCIA CURANDO OS CICLOS (CARTA MAIOR) */}
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6F4D84]">
                IMERSÃO PRESENCIAL & VIVÊNCIAS
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#22205A] tracking-tight">
                Vivência: Curando os Ciclos
              </h2>
              <p className="text-xs sm:text-sm text-[#534D6B] max-w-2xl">
                Uma experiência imersiva de fechamento de padrões repetitivos e abertura de novos caminhos biográficos com Bianca Tofoli.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Carta de Tarô Maior em Proporção Vertical 5:8 */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[320px] sm:max-w-[340px]">
                  <TarotCard
                    romanNumeral="XII"
                    categoryBadge="VIVÊNCIA"
                    title="Curando os Ciclos"
                    subtitle="Imersão autoral de transição e renovação"
                    imageUrl="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80"
                    actionLabel="CONHECER A VIVÊNCIA"
                    onAction={() => onNavigate('/vivencias')}
                    isLarge={true}
                  />
                </div>
              </div>

              {/* Informações Editoriais da Vivência */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6F4D84]">
                    Espaço Casa 6 & Imersões
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#22205A]">
                    Sentir os arquétipos no corpo e na respiração
                  </h3>
                  <p className="text-xs sm:text-sm text-[#534D6B] leading-relaxed">
                    {OFFICIAL_EXPERIENCES[0].summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#FCFAF7] border border-[#DAD2C4] space-y-1">
                    <span className="text-[10px] font-bold text-[#6F4D84] uppercase">LOCALIZAÇÃO</span>
                    <p className="text-xs font-semibold text-[#22205A]">{OFFICIAL_EXPERIENCES[0].location}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FCFAF7] border border-[#DAD2C4] space-y-1">
                    <span className="text-[10px] font-bold text-[#6F4D84] uppercase">STATUS DA TURMA</span>
                    <p className="text-xs font-semibold text-[#22205A]">{OFFICIAL_EXPERIENCES[0].dateInfo}</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => onNavigate('/vivencias')}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFB63F] px-8 py-3 text-xs sm:text-sm font-bold text-[#080C35] hover:bg-[#EAA329] transition-all cursor-pointer shadow-md"
                  >
                    <span>VER DETALHES DA VIVÊNCIA</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onOpenBooking('vivencia-curando-os-ciclos')}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#22205A] px-6 py-3 text-xs sm:text-sm font-bold text-[#22205A] hover:bg-[#22205A] hover:text-white transition-colors cursor-pointer"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Solicitar Inscrição</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PARTE B: CARDS DAS 4 PALESTRAS EM PROPORÇÃO VERTICAL DE TARÔ (5:8) */}
          <div className="space-y-6 pt-6 border-t border-[#DAD2C4]/80">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6F4D84]">
                  PALESTRAS & WORKSHOPS
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#22205A]">
                  Palestras para Empresas & Eventos
                </h3>
              </div>
              <button
                onClick={() => onNavigate('/palestras')}
                className="text-xs font-bold text-[#22205A] hover:text-[#FFB63F] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>VER TODAS AS PALESTRAS</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Grid 4 Colunas no Desktop / Carrossel com Peek no Mobile */}
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
              {OFFICIAL_LECTURES.map((lecture, idx) => (
                <div 
                  key={lecture.id}
                  className="min-w-[260px] sm:min-w-0 flex-1 snap-start shrink-0"
                >
                  <TarotCard
                    romanNumeral={idx === 0 ? 'IV' : idx === 1 ? 'V' : idx === 2 ? 'VI' : 'VII'}
                    categoryBadge={lecture.format.toUpperCase()}
                    title={lecture.title}
                    subtitle={lecture.summary}
                    imageUrl={
                      idx === 0
                        ? 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'
                        : idx === 1
                        ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
                        : idx === 2
                        ? 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80'
                        : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'
                    }
                    actionLabel="SOLICITAR"
                    onAction={() => onOpenBooking(lecture.id)}
                  />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-center text-[#7A7394] sm:hidden">
              ← Deslize para ver todas as palestras →
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 7: BLOG / LEITURAS (CARTAS DE TARÔ EDITORIAIS VERTICAIS 5:8)
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6F4D84]">
                CADERNO ASTRAL & EDITORIAL
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#22205A] tracking-tight">
                Leituras & Reflexões
              </h2>
              <p className="text-xs sm:text-sm text-[#534D6B] max-w-xl">
                Artigos autorais colecionáveis de Bianca Tofoli em formato de cartas de sabedoria astrológica.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/leituras')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#22205A] hover:text-[#FFB63F] uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
            >
              <span>VER TODAS AS LEITURAS</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Grid com 3 Cartas Editoriais Verticais de Tarô (5:8) */}
          <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
            {blogPosts.map((post) => (
              <div 
                key={post.id}
                className="min-w-[280px] sm:min-w-[300px] md:min-w-0 flex-1 snap-start shrink-0"
              >
                <TarotCard
                  romanNumeral={post.roman}
                  categoryBadge={post.category}
                  title={post.title}
                  subtitle={post.excerpt}
                  imageUrl={post.imageUrl}
                  actionLabel="LER ARTIGO"
                  onAction={() => onNavigate('/leituras')}
                />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-center text-[#7A7394] md:hidden">
            ← Deslize para ver todas as leituras →
          </p>
        </div>
      </section>

    </div>
  );
};
