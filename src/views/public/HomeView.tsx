/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: Home / Página Inicial Oficial
 * 
 * Estrutura Oficial em 7 Sessões:
 * Sessão 1 - Banner com chamada impactante com botão para a página /atendimentos
 * Sessão 2 - Destaque para Bianca Tofoli
 * Sessão 3 - Atendimentos (Cards com imagens em parallax em formato de carta de tarot)
 * Sessão 4 - Depoimentos testemunhais das pessoas em um carrossel lento
 * Sessão 5 - Banners com a Patota Astral com o fundo parallax
 * Sessão 6 - Vivência Curando os Ciclos (maior destaque) + cards menores de Palestras (estilo carta de tarot em parallax)
 * Sessão 7 - Leituras (Blog) em formatos de cartas de tarot em parallax com os textos
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Star, ChevronLeft, ChevronRight, Calendar, Users, Heart, BookOpen, Quote } from 'lucide-react';
import { OFFICIAL_SERVICES, OFFICIAL_LECTURES, OFFICIAL_EXPERIENCES, OFFICIAL_TESTIMONIALS } from '../../config/site';

interface HomeViewProps {
  onOpenBooking: (serviceId?: string) => void;
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenBooking, onNavigate }) => {
  // Estado para o Carrossel Lento de Depoimentos (Sessão 4)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);

  // Efeito Parallax no Scroll
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Timer automático para o carrossel lento de depoimentos (a cada 6.5s)
  useEffect(() => {
    if (isTestimonialPaused) return;
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % OFFICIAL_TESTIMONIALS.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isTestimonialPaused]);

  const handlePrevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + OFFICIAL_TESTIMONIALS.length) % OFFICIAL_TESTIMONIALS.length);
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % OFFICIAL_TESTIMONIALS.length);
  };

  // Artigos em Destaque para a Sessão 7 (Leituras)
  const blogPosts = [
    {
      id: 'eclipse-peixes',
      title: 'Eclipse Lunar em Peixes: O que essa energia desperta em você?',
      excerpt: 'Uma leitura sobre a dissolução de ilusões e o chamado para acolher a sensibilidade sem perder os pés na matéria.',
      date: '28 de Março, 2026',
      readTime: '5 min de leitura',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      slug: 'eclipse-lunar-em-peixes'
    },
    {
      id: 'mercurio-retrogrado',
      title: 'Mercúrio Retrógrado: Como navegar esse período com mais consciência',
      excerpt: 'Por que a retrogradação não é um castigo, mas uma pausa cósmica necessária para revisar acordos, conversas e rotas.',
      date: '22 de Março, 2026',
      readTime: '6 min de leitura',
      image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
      slug: 'mercurio-retrogrado-guia-consciente'
    },
    {
      id: 'ano-novo-astrologico',
      title: 'Ano Novo Astrológico: Renovação, propósito e novos ciclos',
      excerpt: 'O ingresso do Sol em Áries marca o verdadeiro início do zodíaco. Como preparar a mente e o corpo para plantar intenções reais.',
      date: '15 de Março, 2026',
      readTime: '4 min de leitura',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      slug: 'ano-novo-astrologico-renovacao'
    }
  ];

  return (
    <div className="bg-[#F3EEE5] text-[#211D35] overflow-hidden">
      
      {/* =========================================================================
          SESSÃO 1: BANNER COM CHAMADA IMPACTANTE COM BOTÃO PARA /ATENDIMENTOS
          ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#080C35] via-[#22205A] to-[#372B69] text-[#FFFFFF] py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#22205A]/70">
        {/* Fundo Estelar & Elementos Astrais de Céu Noturno */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Estrelas cintilantes */}
          <div className="absolute top-12 left-16 text-[#FFB63F] opacity-80 text-xs">✦</div>
          <div className="absolute top-36 left-1/3 text-[#DAD2C4] opacity-50 text-[10px]">★</div>
          <div className="absolute bottom-20 left-1/4 text-[#FFB63F] opacity-60 text-xs">✦</div>
          <div className="absolute top-1/4 left-10 text-[#DAD2C4] opacity-40 text-sm">✨</div>

          {/* Linhas de Órbita Douradas Sutis */}
          <svg className="absolute -top-24 right-0 w-[600px] lg:w-[850px] h-[600px] lg:h-[850px] opacity-35" viewBox="0 0 800 800" fill="none">
            <ellipse cx="650" cy="400" rx="360" ry="240" stroke="#FFB63F" strokeWidth="0.7" strokeDasharray="3 4" transform="rotate(-25 650 400)" />
            <ellipse cx="650" cy="400" rx="420" ry="280" stroke="#DAD2C4" strokeWidth="0.5" strokeOpacity="0.4" transform="rotate(-15 650 400)" />
            <circle cx="340" cy="310" r="3.5" fill="#FFB63F" />
            <circle cx="480" cy="220" r="2.5" fill="#FFB63F" />
            <circle cx="780" cy="270" r="3" fill="#DAD2C4" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Lado Esquerdo: Tipografia e Botão Direto para /atendimentos */}
          <div className="lg:col-span-7 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#DAD2C4] font-medium">
              <span>ASTROLOGIA</span>
              <span className="text-[#FFB63F]">•</span>
              <span>AUTOCONHECIMENTO</span>
              <span className="text-[#FFB63F]">•</span>
              <span>BEM-ESTAR</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-[1.12]">
              Autoconhecimento,<br />
              equilíbrio e transformação<br />
              <span className="italic font-normal text-[#FFB63F]">para a sua vida.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#DAD2C4] leading-relaxed max-w-xl font-normal">
              Descubra a Casa 6 e se conecte com a sua essência através da astrologia e de práticas que integram corpo, mente e espírito com um olhar contemporâneo e autoral.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => onNavigate('/atendimentos')}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#FFB63F] px-8 py-3.5 text-xs sm:text-sm font-bold text-[#080C35] shadow-lg hover:bg-[#EAA329] transition-all transform hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
              >
                <span>CONHEÇA NOSSOS ATENDIMENTOS</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-[#080C35]" />
              </button>

              <button
                onClick={() => onOpenBooking()}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#FFB63F]/50 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#22205A] transition-colors"
              >
                <Calendar className="h-4 w-4 text-[#FFB63F]" />
                <span>Agendar Consulta</span>
              </button>
            </div>
          </div>

          {/* Lado Direito: Grande Planeta Iluminado e Fases da Lua */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            <div className="relative w-72 sm:w-96 lg:w-[440px] aspect-square flex items-center justify-center">
              
              {/* Grande Planeta com Atmosfera */}
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

              {/* Arco com Fases da Lua */}
              <div className="absolute left-0 bottom-6 flex items-center gap-2 sm:gap-3 bg-[#080C35]/70 backdrop-blur-md p-2.5 sm:p-3 rounded-full border border-[#FFB63F]/30 shadow-xl z-20">
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

              <div className="absolute top-4 left-6 text-[#FFB63F] text-2xl animate-pulse font-heading">✦</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SESSÃO 2: DESTAQUE PARA BIANCA TOFOLI
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#DAD2C4]/80">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Foto de Bianca Tofoli em Moldura Orbital Astrológica */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 sm:w-72 aspect-square">
                {/* Anéis orbitais dourados ao redor da foto */}
                <div className="absolute inset-0 rounded-full border border-[#FFB63F] -rotate-12 scale-110 pointer-events-none"></div>
                <div className="absolute inset-0 rounded-full border border-[#DAD2C4] rotate-45 scale-105 pointer-events-none"></div>
                
                {/* Estrela no topo esquerdo da órbita */}
                <div className="absolute -top-3 -left-3 text-[#FFB63F] text-xl font-heading">✦</div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-[#FFB63F]"></div>

                {/* Imagem circular da Bianca Tofoli */}
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl border-2 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                    alt="Bianca Tofoli — Astróloga e Fundadora da Casa 6"
                    className="w-full h-full object-cover object-center protected-img"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            {/* Texto Biográfico Central */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6F4D84]">
                SOBRE A CASA 6
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#22205A] tracking-tight">
                Bianca Tofoli
              </h2>
              <p className="text-xs sm:text-sm text-[#534D6B] leading-relaxed font-normal">
                Acredito que a astrologia é uma poderosa ferramenta de autoconhecimento e transformação. Meu objetivo é integrar essa sabedoria ao dia a dia das pessoas, ajudando-as a encontrar mais equilíbrio, realização em suas escolhas e uma vida com mais sentido.
              </p>
            </div>

            {/* Citação Inspiradora e Botão "Conheça Minha História" */}
            <div className="lg:col-span-4 pl-0 lg:pl-6 lg:border-l border-[#DAD2C4] space-y-4">
              <div className="text-4xl text-[#FFB63F] font-heading leading-none">“</div>
              <blockquote className="font-heading italic text-base sm:text-lg text-[#22205A] leading-snug">
                Para mim, tudo tem rachaduras — mas é por elas que entra a luz.
              </blockquote>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/sobre')}
                  className="inline-flex items-center gap-2 rounded-full border border-[#DAD2C4] px-5 py-2 text-xs font-semibold text-[#534D6B] hover:text-[#22205A] hover:border-[#22205A] transition-colors cursor-pointer"
                >
                  <span>CONHEÇA MINHA HISTÓRIA</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SESSÃO 3: ATENDIMENTOS (CARDS COM IMAGENS EM PARALLAX EM FORMATO DE CARTA DE TAROT)
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#DAD2C4]/80">
        <div className="mx-auto max-w-7xl space-y-10">
          {/* Header da Seção */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6F4D84]">
                CONSULTAS & ORIENTAÇÃO
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#22205A] tracking-tight">
                Atendimentos Astrológicos
              </h2>
              <p className="text-xs sm:text-sm text-[#534D6B] max-w-xl">
                Escolha a jornada que melhor acolhe o seu momento: consultas contínuas, mapas de nascimento únicos ou combos completos de imersão.
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

          {/* Grid com Cartas de Tarot em Parallax */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARTA DE TAROT 1: Mapa Natal (Nascimento) */}
            <div className="rounded-2xl bg-[#FCFAF7] border border-[#DAD2C4] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div className="p-4 sm:p-5 flex gap-4 items-center">
                {/* Janela da Carta de Tarot com Parallax Interno */}
                <div className="relative w-28 sm:w-32 aspect-[3/4] rounded-xl overflow-hidden shadow-md shrink-0 border border-[#DAD2C4]">
                  <img
                    src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80"
                    alt="Mapa Natal (Nascimento)"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out protected-img"
                    style={{ transform: `translateY(${(scrollY % 50) * 0.15}px)` }}
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080C35]/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-2 left-2 text-[10px] text-[#FFB63F] font-heading">✦ I</span>
                  <span className="absolute bottom-2 left-2 text-[9px] uppercase tracking-widest text-white/90 font-semibold">ÚNICOS</span>
                </div>

                {/* Conteúdo textual da carta */}
                <div className="space-y-2 flex-1">
                  <h3 className="font-heading text-lg font-bold text-[#22205A] leading-snug">
                    Mapa Natal<br />
                    <span className="text-xs font-semibold text-[#534D6B]">(Nascimento)</span>
                  </h3>
                  <p className="text-[11px] text-[#534D6B] leading-relaxed">
                    A leitura primordial da sua essência cósmica. Compreensão profunda da sua vocação, padrões e potenciais.
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5">
                <button
                  onClick={() => onOpenBooking('mapa-natal-nascimento')}
                  className="w-full rounded-full bg-[#FFB63F] py-2 text-xs font-bold text-[#080C35] hover:bg-[#EAA329] transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>AGENDAR MAPA NATAL</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* CARTA DE TAROT 2: Mapa Revolução Solar (Anual) */}
            <div className="rounded-2xl bg-[#FCFAF7] border border-[#DAD2C4] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div className="p-4 sm:p-5 flex gap-4 items-center">
                {/* Janela da Carta de Tarot com Parallax Interno */}
                <div className="relative w-28 sm:w-32 aspect-[3/4] rounded-xl overflow-hidden shadow-md shrink-0 border border-[#DAD2C4]">
                  <img
                    src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=600&q=80"
                    alt="Mapa Revolução Solar (Anual)"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out protected-img"
                    style={{ transform: `translateY(${(scrollY % 50) * -0.15}px)` }}
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080C35]/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-2 left-2 text-[10px] text-[#FFB63F] font-heading">✦ II</span>
                  <span className="absolute bottom-2 left-2 text-[9px] uppercase tracking-widest text-white/90 font-semibold">ANUAL</span>
                </div>

                {/* Conteúdo textual da carta */}
                <div className="space-y-2 flex-1">
                  <h3 className="font-heading text-lg font-bold text-[#22205A] leading-snug">
                    Revolução Solar<br />
                    <span className="text-xs font-semibold text-[#534D6B]">(Anual)</span>
                  </h3>
                  <p className="text-[11px] text-[#534D6B] leading-relaxed">
                    A bússola do seu ano pessoal calculada no seu aniversário. Desvenda os temas predominantes e áreas de expansão.
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5">
                <button
                  onClick={() => onOpenBooking('mapa-revolucao-solar')}
                  className="w-full rounded-full bg-[#FFB63F] py-2 text-xs font-bold text-[#080C35] hover:bg-[#EAA329] transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>AGENDAR REVOLUÇÃO</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* CARTA DE TAROT 3: Combo Mapa Natal + Roda + Revolução */}
            <div className="rounded-2xl bg-[#FCFAF7] border border-[#DAD2C4] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div className="p-4 sm:p-5 flex gap-4 items-center">
                {/* Janela da Carta de Tarot com Parallax Interno */}
                <div className="relative w-28 sm:w-32 aspect-[3/4] rounded-xl overflow-hidden shadow-md shrink-0 border border-[#DAD2C4]">
                  <img
                    src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80"
                    alt="Combo Astrológico Completo"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out protected-img"
                    style={{ transform: `translateY(${(scrollY % 50) * 0.2}px)` }}
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080C35]/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-2 left-2 text-[10px] text-[#FFB63F] font-heading">✦ III</span>
                  <span className="absolute bottom-2 left-2 text-[9px] uppercase tracking-widest text-white/90 font-semibold">COMBO</span>
                </div>

                {/* Conteúdo textual da carta */}
                <div className="space-y-2 flex-1">
                  <h3 className="font-heading text-lg font-bold text-[#22205A] leading-snug">
                    Mapa + Roda +<br />
                    <span className="text-xs font-semibold text-[#534D6B]">Revolução Solar</span>
                  </h3>
                  <p className="text-[11px] text-[#534D6B] leading-relaxed">
                    A jornada mais completa: o retrato natal, a roda das casas e a estratégia completa para o seu ano solar.
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5">
                <button
                  onClick={() => onOpenBooking('combo-mapa-roda-revolucao')}
                  className="w-full rounded-full bg-[#FFB63F] py-2 text-xs font-bold text-[#080C35] hover:bg-[#EAA329] transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>AGENDAR COMBO</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SESSÃO 4: DEPOIMENTOS TESTEMUNHAIS DAS PESSOAS EM UM CARROSSEL LENTO
          ========================================================================= */}
      <section 
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#DAD2C4]/80 bg-[#FCFAF7]"
        onMouseEnter={() => setIsTestimonialPaused(true)}
        onMouseLeave={() => setIsTestimonialPaused(false)}
      >
        <div className="mx-auto max-w-5xl space-y-10 text-center">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6F4D84]">
              TESTEMUNHOS REAIS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#22205A] tracking-tight">
              O que dizem sobre a Casa 6
            </h2>
            <p className="text-xs sm:text-sm text-[#534D6B] max-w-lg mx-auto">
              Experiências de clientes que transformaram suas escolhas através da leitura com Bianca Tofoli.
            </p>
          </div>

          {/* Janela do Carrossel Lento */}
          <div className="relative min-h-[220px] flex items-center justify-center px-4 sm:px-12">
            {/* Card com Depoimento Atual */}
            <div className="transition-all duration-700 transform ease-in-out max-w-3xl space-y-5">
              <div className="text-5xl text-[#FFB63F] font-heading leading-none select-none">“</div>
              <p className="font-heading italic text-base sm:text-xl text-[#22205A] leading-relaxed">
                {OFFICIAL_TESTIMONIALS[currentTestimonialIndex].content}
              </p>
              <div className="space-y-1 pt-2">
                <h4 className="font-heading font-bold text-sm text-[#22205A]">
                  {OFFICIAL_TESTIMONIALS[currentTestimonialIndex].authorName}
                </h4>
                <span className="inline-block text-[11px] font-semibold text-[#6F4D84] uppercase tracking-wider">
                  {OFFICIAL_TESTIMONIALS[currentTestimonialIndex].serviceTitle}
                </span>
              </div>
            </div>

            {/* Botões Laterais do Carrossel */}
            <button
              onClick={handlePrevTestimonial}
              aria-label="Depoimento Anterior"
              className="absolute left-0 p-2 rounded-full border border-[#DAD2C4] text-[#534D6B] hover:text-[#22205A] hover:border-[#22205A] transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={handleNextTestimonial}
              aria-label="Próximo Depoimento"
              className="absolute right-0 p-2 rounded-full border border-[#DAD2C4] text-[#534D6B] hover:text-[#22205A] hover:border-[#22205A] transition-colors cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Bullets Indicadores de Posição */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {OFFICIAL_TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonialIndex(index)}
                aria-label={`Ir para depoimento ${index + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  currentTestimonialIndex === index
                    ? 'w-7 h-2 bg-[#FFB63F]'
                    : 'w-2 h-2 bg-[#DAD2C4] hover:bg-[#534D6B]'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SESSÃO 5: BANNERS COM A PATOTA ASTRAL COM O FUNDO PARALLAX
          ========================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#DAD2C4]/80">
        <div className="mx-auto max-w-7xl rounded-3xl relative overflow-hidden bg-gradient-to-r from-[#080C35] via-[#22205A] to-[#372B69] text-white p-8 sm:p-14 lg:p-16 border border-[#22205A] shadow-xl">
          {/* Fundo Parallax do Céu Noturno e Nebulosa */}
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none bg-cover bg-center transition-transform duration-300 ease-out"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80')`,
              transform: `translateY(${(scrollY * 0.08) % 60}px) scale(1.08)`
            }}
          />

          {/* Curva Planetária Sutil com Brilho Rosa/Violeta */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-1/3 opacity-25 pointer-events-none bg-cover bg-left"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=600&q=80')`
            }}
          />

          {/* Círculo Orbital Decorativo à Direita */}
          <svg className="absolute -right-16 -top-16 w-72 h-72 opacity-25 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" stroke="#FFB63F" strokeWidth="0.5" strokeDasharray="3 4" fill="none" />
            <circle cx="85" cy="50" r="3" fill="#FFB63F" />
          </svg>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#DAD2C4]">
                COMUNIDADE EXCLUSIVA POR ASSINATURA
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white">
                Patota Astral
              </h2>
              <p className="font-heading text-base sm:text-xl font-medium text-[#FFB63F]">
                Astrologia diária por assinatura com Bianca Tofoli
              </p>
              <p className="text-xs sm:text-sm text-[#DAD2C4] leading-relaxed max-w-xl font-normal">
                Conecte-se com a energia de cada ciclo, antecipe desafios e potencialize oportunidades. Encontros mensais de lua nova e cheia, canal acolhedor de trocas e cadernos astrológicos.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => onNavigate('/patota')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFB63F] px-8 py-3.5 text-xs sm:text-sm font-bold text-[#080C35] hover:bg-[#EAA329] transition-all transform hover:scale-105 active:scale-100 shadow-lg cursor-pointer"
              >
                <span>QUERO FAZER PARTE DA PATOTA</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SESSÃO 6: VIVÊNCIA "CURANDO OS CICLOS" (DESTAQUE) + CARDS DAS PALESTRAS
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#DAD2C4]/80">
        <div className="mx-auto max-w-7xl space-y-14">
          
          {/* PARTE A: DESTAQUE PRINCIPAL — VIVÊNCIA "CURANDO OS CICLOS" */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6F4D84]">
                IMERSÃO PRESENCIAL & VIVÊNCIAS
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#22205A] tracking-tight">
                Vivência: Curando os Ciclos
              </h2>
              <p className="text-xs sm:text-sm text-[#534D6B] max-w-2xl">
                O corpo e os arquétipos integrados em uma experiência profunda de transição e renovação de ciclos biográficos com Bianca Tofoli.
              </p>
            </div>

            {/* Card com Maior Destaque da Vivência com Efeito Parallax */}
            <div className="rounded-3xl bg-[#FCFAF7] border border-[#DAD2C4] overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 group">
              {/* Carta de Tarot Gigante com Parallax */}
              <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-[400px] overflow-hidden border-b lg:border-b-0 lg:border-r border-[#DAD2C4]">
                <img
                  src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80"
                  alt="Vivência Curando os Ciclos"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 protected-img"
                  style={{ transform: `translateY(${(scrollY * 0.05) % 40}px)` }}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080C35]/85 via-[#22205A]/40 to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-[#FFB63F] text-[#080C35] px-3.5 py-1 text-xs font-bold shadow">
                    Inscrições Abertas
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#FFB63F] font-semibold">
                    IMERSÃO AUTORAL
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    Curando os Ciclos
                  </h3>
                </div>
              </div>

              {/* Informações Editoriais da Vivência */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6F4D84]">
                    Espaço Casa 6 & Imersões
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#22205A]">
                    Fechamento de Padrões e Abertura Consciente
                  </h3>
                  <p className="text-xs sm:text-sm text-[#534D6B] leading-relaxed">
                    Uma experiência presencial e imersiva de fechamento e abertura de ciclos biográficos. Mapeamento dos padrões repetitivos através da astrologia, liberação somática e rituais conscientes de transição com Bianca Tofoli.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3.5 rounded-xl bg-[#F3EEE5] border border-[#E6DFD3] space-y-1">
                      <span className="text-[10px] font-bold text-[#6F4D84] uppercase">LOCALIZAÇÃO</span>
                      <p className="text-xs font-semibold text-[#22205A]">São Paulo & Turmas Online</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F3EEE5] border border-[#E6DFD3] space-y-1">
                      <span className="text-[10px] font-bold text-[#6F4D84] uppercase">VAGAS LIMITADAS</span>
                      <p className="text-xs font-semibold text-[#22205A]">Acolhimento em Grupo Reduzido</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#DAD2C4]/60 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => onNavigate('/vivencias')}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFB63F] px-8 py-3 text-xs sm:text-sm font-bold text-[#080C35] hover:bg-[#EAA329] transition-all cursor-pointer shadow-md"
                  >
                    <span>CONHECER A VIVÊNCIA COMPLETA</span>
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

          {/* PARTE B: CARDS MENORES COM AS PALESTRAS (ESTILO CARTA DE TAROT EM PARALLAX) */}
          <div className="space-y-6 pt-6">
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

            {/* Grid com as 4 Palestras em cartas de tarot estilizadas com parallax */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {OFFICIAL_LECTURES.map((lecture, idx) => (
                <div
                  key={lecture.id}
                  className="rounded-2xl bg-[#FCFAF7] border border-[#DAD2C4] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div className="p-4 space-y-3">
                    {/* Imagem estilo carta de tarot menor com parallax */}
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-[#DAD2C4]/80">
                      <img
                        src={
                          idx === 0
                            ? 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'
                            : idx === 1
                            ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
                            : idx === 2
                            ? 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80'
                            : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'
                        }
                        alt={lecture.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 protected-img"
                        style={{ transform: `translateY(${(scrollY * 0.03) % 20}px)` }}
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080C35]/70 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute top-2 left-2 text-[9px] text-[#FFB63F] font-heading">✦</span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#6F4D84] block">
                        {lecture.format}
                      </span>
                      <h4 className="font-heading text-sm font-bold text-[#22205A] leading-snug line-clamp-2">
                        {lecture.title}
                      </h4>
                      <p className="text-[11px] text-[#534D6B] line-clamp-3 leading-relaxed">
                        {lecture.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() => onNavigate('/palestras')}
                      className="w-full rounded-full border border-[#DAD2C4] py-2 text-[11px] font-bold text-[#22205A] hover:bg-[#22205A] hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>SAIBA MAIS</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SESSÃO 7: BLOG / LEITURAS EM FORMATOS DE CARTAS DE TAROT EM PARALLAX COM OS TEXTOS
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
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
                Artigos autorais, ensaios sobre os céus, trânsitos planetários e insights para a sua jornada com Bianca Tofoli.
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

          {/* Grid com 3 Cards em Formato de Cartas de Tarot em Parallax com Textos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div 
                key={post.id}
                onClick={() => onNavigate('/leituras')}
                className="rounded-2xl bg-[#FCFAF7] border border-[#DAD2C4] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Janela Carta de Tarot com Parallax Interno */}
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-[#DAD2C4]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out protected-img"
                      style={{ transform: `translateY(${(scrollY * 0.04) % 25}px)` }}
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080C35]/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-3 left-3 text-[10px] text-[#FFB63F] font-heading">✦</span>
                    <span className="absolute bottom-3 left-3 text-[10px] text-white/90 font-semibold tracking-wider">
                      {post.readTime}
                    </span>
                  </div>

                  {/* Conteúdo textual do post */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F4D84] block">
                      {post.date}
                    </span>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-[#22205A] group-hover:text-[#6F4D84] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#534D6B] leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-6 pt-2 flex items-center justify-between border-t border-[#DAD2C4]/40 text-xs font-bold text-[#22205A]">
                  <span className="group-hover:text-[#6F4D84] transition-colors">LER ARTIGO COMPLETO</span>
                  <ArrowRight className="h-4 w-4 text-[#FFB63F] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
