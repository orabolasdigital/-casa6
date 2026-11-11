/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: Home Oficial (/inicio)
 * 
 * 8 Sessões Oficiais Obrigatórias:
 * Sessão 1 - Banner com chamada impactante e botão para /atendimentos
 * Sessão 2 - Destaque Bianca Tofoli (Autoconhecimento, Equilíbrio, Expansão)
 * Sessão 3 - Atendimentos (Cards com imagens astrológicas celestes em formato de carta virada azul/roxa #1b1463 que gira ao passar o mouse revelando resumo e botão)
 * Sessão 4 - Depoimentos testemunhais em carrossel lento estilizado como céu cósmico
 * Sessão 5 - Banner grande com a Patota Astral com informações e ilustrações celestes
 * Sessão 6 - Cards com destaque para o novo serviço Bússola Guia e cartas de tarô viradas com flip
 * Sessão 7 - Leituras em boxes retangulares (carta de tarô à esquerda, texto/título/botão à direita)
 * Sessão 8 - Destaque para o canal do YouTube com o vídeo mais recente e convite para se inscrever
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Star, Quote, MessageCircle, Compass, Play, Youtube, Sun, Moon } from 'lucide-react';
import { OFFICIAL_SERVICES, OFFICIAL_TESTIMONIALS, SITE_CONFIG } from '../../config/site';
import { FlipTarotCard } from '../../components/common/FlipTarotCard';
import { ServiceDetailModal } from '../../components/common/ServiceDetailModal';
import { ServiceItem } from '../../types';

interface HomeViewProps {
  onOpenBooking: (serviceId?: string) => void;
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenBooking, onNavigate }) => {
  const [scrollY, setScrollY] = useState(0);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3 Atendimentos Centrais para a Sessão 3
  const featuredServices = [
    OFFICIAL_SERVICES.find((s) => s.id === 'mapa-natal-nascimento') || OFFICIAL_SERVICES[2],
    OFFICIAL_SERVICES.find((s) => s.id === 'mapa-revolucao-solar') || OFFICIAL_SERVICES[4],
    OFFICIAL_SERVICES.find((s) => s.id === 'combo-mapa-roda-revolucao') || OFFICIAL_SERVICES[5]
  ];

  // Artigos Editoriais da Sessão 7 (Leituras Astrais)
  const blogPosts = [
    {
      id: 'eclipse-lunar-em-peixes',
      title: 'Eclipse Lunar em Peixes: O que essa energia desperta?',
      excerpt: 'Dissolução de ilusões e o chamado para acolher a sensibilidade intuitiva nos ciclos reais.',
      category: 'ECLIPSE',
      roman: 'I',
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      date: '18 Setembro 2024'
    },
    {
      id: 'mercurio-retrogrado-guia-consciente',
      title: 'Mercúrio Retrógrado: Navegando com consciência',
      excerpt: 'Por que a retrogradação é uma pausa biográfica necessária para revisar acordos e rotas.',
      category: 'TRÂNSITOS',
      roman: 'II',
      imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
      date: '02 Agosto 2024'
    },
    {
      id: 'ano-novo-astrologico-renovacao',
      title: 'Ano Novo Astrológico: Propósito e novos ciclos',
      excerpt: 'O ingresso do Sol em Áries e a preparação para semear intenções duradouras.',
      category: 'CICLOS',
      roman: 'III',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      date: '20 Março 2024'
    }
  ];

  return (
    <div className="bg-[#F4EFE6] text-[#2B2566] overflow-x-hidden font-body">

      {/* =========================================================================
          SESSÃO 1: BANNER PRINCIPAL COM VÍDEO EM LOOPING, TÍTULO RESTAURADO E CTA
          ========================================================================= */}
      <section className="relative w-full bg-[#2B2566] text-[#FFFFFF] pt-20 sm:pt-28 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
        {/* Vídeo de Fundo em Looping Oficial */}
        <video
          src="https://video.wixstatic.com/video/02c8e0_bbdf46bd6f6f4c45937fb5989df57687/720p/mp4/file.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40"
        />

        {/* Gradiente Escuro Noturno para Garantir Contraste e Legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B2566]/92 via-[#2B2566]/82 to-[#2B2566]/78 pointer-events-none" />

        {/* Órbitas e Linhas Circulares Hairline Conforme Identidade */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-[-100px] w-[500px] h-[500px] rounded-full border border-[#F0B55E]/15"></div>
          <div className="absolute -top-32 right-[-50px] w-[640px] lg:w-[820px] h-[640px] lg:h-[820px] rounded-full border border-[#F0B55E]/10"></div>
          <div className="absolute top-12 left-10 text-[#F0B55E] opacity-70 text-xs font-heading">✦</div>
          <div className="absolute top-36 right-1/4 text-[#E6E3F1] opacity-40 text-[10px]">★</div>
        </div>

        <div className="relative mx-auto max-w-5xl z-10 space-y-6">
          {/* Box / Selo Casa 6 Bianca Tofoli com Favicon, Borda Suave e Fundo Transparente */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/25 bg-transparent backdrop-blur-xs">
            <img
              src="https://static.wixstatic.com/media/02c8e0_bce65db1891746ca848f16f8403ddaed~mv2.png"
              alt="Casa 6"
              className="h-4 w-4 object-contain"
            />
            <span className="text-[11px] font-light uppercase tracking-[0.2em] text-white/90">
              Casa 6 • Bianca Tofoli
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#E6E3F1] font-semibold">
            <span>ASTROLOGIA</span>
            <span className="text-[#F0B55E]">•</span>
            <span>AUTOCONHECIMENTO</span>
            <span className="text-[#F0B55E]">•</span>
            <span>VIDA REAL</span>
          </div>

          {/* Título Anterior Restaurado com Destaque em Fonte Secundária Itálica */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15] max-w-4xl text-balance">
            Autoconhecimento, equilíbrio{' '}
            <span className="font-highlight italic text-[#F0B55E] text-[1.26em] font-semibold inline-block align-baseline ml-1 sm:ml-2 tracking-normal">
              e transformação
            </span>{' '}
            para sua vida.
          </h1>

          <p className="text-base sm:text-lg text-[#E6E3F1]/90 leading-relaxed max-w-2xl font-light">
            Descubra a Casa 6 e se conecte com a sua essência através da astrologia com um olhar lúcido e acolhedor.
          </p>

          <div className="pt-2 flex items-center">
            <button
              onClick={() => onNavigate('/atendimentos')}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#F0B55E] px-8 py-4 text-xs sm:text-sm font-bold text-[#2B2566] shadow-xl hover:bg-[#dfa247] transition-all transform hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer uppercase tracking-wider"
            >
              <span>CONHEÇA NOSSOS ATENDIMENTOS</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-[#2B2566]" />
            </button>
          </div>
        </div>

        {/* Transição Orgânica Curva do Fundo Escuro para o Fundo Claro Lua (#F4EFE6) */}
        <div className="absolute -bottom-px left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg
            viewBox="0 0 1440 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-12 sm:h-18 lg:h-22 block text-[#F4EFE6]"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C480,75 960,75 1440,0 L1440,90 L0,90 Z"
              fill="#F4EFE6"
            />
          </svg>
        </div>
      </section>

      {/* =========================================================================
          SESSÃO 2: DESTAQUE PARA BIANCA TOFOLI (FOTO INTEIRA POR CIMA, SEM CORTES, TEXTO QUADRADINHO)
          ========================================================================= */}
      <section className="relative pt-0 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 bg-[#F4EFE6] z-20">
        <div className="mx-auto max-w-7xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Foto Circular da Bianca Sobreposta Integralmente (z-30, Sem Cortar) */}
            <div className="lg:col-span-5 flex justify-center -mt-16 sm:-mt-24 lg:-mt-32 relative z-30">
              <div className="relative w-76 sm:w-88 lg:w-[410px] aspect-square">
                {/* Disco Sol decorativo ao fundo deslocado conforme Brand Guide */}
                <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-44 sm:w-52 h-44 sm:h-52 rounded-full bg-[#F0B55E] opacity-90 pointer-events-none"></div>
                {/* Órbitas concêntricas hairline */}
                <div className="absolute inset-0 rounded-full border border-[#2B2566]/20 scale-105 pointer-events-none"></div>
                <div className="absolute inset-0 rounded-full border border-[#8C987F]/30 rotate-45 scale-115 pointer-events-none"></div>

                <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://static.wixstatic.com/media/02c8e0_defbbc681ee8458ba9a2f91f33f4e6da~mv2.jpg"
                    alt="Bianca Tofoli — Fundadora da Casa 6"
                    className="w-full h-full object-cover object-center protected-img"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            {/* Texto Editorial Compacto e Quadradinho */}
            <div className="lg:col-span-7 space-y-5 max-w-lg pt-4 lg:pt-0">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F] block">
                  FUNDADORA DA CASA 6 • ASTRÓLOGA • PALESTRANTE
                </span>
                <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[#2B2566] tracking-tight">
                  Bianca Tofoli
                </h2>
                
                {/* Linha-Ponto do Brand Guide */}
                <div className="flex items-center gap-3 py-0.5">
                  <span className="w-12 h-px bg-[#2B2566]/20"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]"></span>
                  <span className="w-20 h-px bg-[#2B2566]/20"></span>
                </div>
              </div>

              {/* Narrativa Sucinta em Formato Quadradinho Equilibrado */}
              <div className="space-y-3">
                <p className="text-base sm:text-lg font-heading text-[#2B2566] leading-snug">
                  Na astrologia, a Casa 6 é a casa do{' '}
                  <span className="font-highlight italic text-xl sm:text-2xl text-[#F0B55E] font-normal">trabalho</span>, da{' '}
                  <span className="font-highlight italic text-xl sm:text-2xl text-[#F0B55E] font-normal">rotina</span> e do{' '}
                  <span className="font-highlight italic text-xl sm:text-2xl text-[#F0B55E] font-normal">cuidado</span> com o corpo.
                </p>
                <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed font-light text-balance">
                  É o território da Bianca: enfermeira, gestora, palestrante. A astrologia entra como origem do nome e como vocabulário de direção — casa, mapa, caminho — nunca como promessa mística. A marca fala de decisões reais: demandas e recursos na rotina, a pausa consciente antes de responder e o corpo que sustenta a trajetória com o apoio que precisa existir ao redor.
                </p>
              </div>

              {/* Frase em destaque serifada */}
              <div className="pt-1 pl-5 border-l-2 border-[#F0B55E]">
                <blockquote className="font-heading text-lg sm:text-xl text-[#2B2566] leading-snug">
                  QUANDO TUDO{' '}
                  <span className="font-highlight italic text-[1.25em] font-semibold text-[#F0B55E] inline-block align-baseline ml-1">
                    depende
                  </span>{' '}
                  DE VOCÊ.
                </blockquote>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => onNavigate('/sobre')}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#F0B55E] hover:bg-[#dfa247] px-8 py-3.5 text-xs sm:text-sm font-bold text-[#2B2566] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-md uppercase tracking-wider"
                >
                  <span>CONHEÇA MINHA TRAJETÓRIA</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SESSÃO 3: ATENDIMENTOS (TÍTULO INFORMATIVO E ESPAÇAMENTO EQUILIBRADO)
          ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 border-t border-[#E2DCCF]/60 bg-[#F4EFE6] overflow-hidden">
        {/* Órbitas de fundo sutis */}
        <div className="absolute right-[-120px] top-1/3 w-[500px] h-[500px] rounded-full border border-[#2B2566]/5 pointer-events-none"></div>

        <div className="mx-auto max-w-7xl space-y-10 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F]">
                LEITURA DE MAPA • SESSÕES PERSONALIZADAS
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#2B2566] tracking-tight">
                Consultas Astrológicas Individuais
              </h2>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="w-8 h-px bg-[#2B2566]/20"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]"></span>
                <span className="w-16 h-px bg-[#2B2566]/20"></span>
              </div>
              <p className="text-xs sm:text-sm text-[#423C7B] max-w-xl font-light">
                Atendimentos individuais conduzidos por Bianca Tofoli para decifrar seu mapa, acolher seus ciclos e trazer clareza prática para as suas decisões.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/atendimentos')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2B2566] hover:text-[#F0B55E] uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
            >
              <span>VER CATÁLOGO COMPLETO</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Grid com as Cartas Viradas 3D (FlipTarotCard) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <div key={service.id} className="w-full">
                <FlipTarotCard
                  index={index}
                  romanNumeral={index === 0 ? 'I' : index === 1 ? 'II' : 'III'}
                  categoryBadge={service.categoryGroup?.toUpperCase() || 'ATENDIMENTO'}
                  title={service.title}
                  subtitle={service.shortDescription}
                  imageUrl={service.tarotImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'}
                  actionLabel="VER ATENDIMENTO"
                  onAction={() => onNavigate('/atendimentos')}
                  onDetailClick={() => setSelectedServiceForModal(service)}
                />
              </div>
            ))}
          </div>

          <p className="text-[11px] text-center text-[#68638C]">
            Toque ou passe o cursor sobre as cartas para girar • Clique para abrir o detalhamento completo
          </p>
        </div>
      </section>

      {/* =========================================================================
          SESSÃO 4: DEPOIMENTOS (TÍTULO LIMPO: RELATOS DE CONSULENTES)
          ========================================================================= */}
      <section className="py-20 sm:py-28 border-y border-[#F0B55E]/20 bg-[#2B2566] text-white overflow-hidden relative">
        {/* Órbitas Decorativas Hairline ao fundo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/5"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#F0B55E]/10"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4 text-center mb-10 z-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#F0B55E]">
            TESTEMUNHOS REAIS • ACOLHIMENTO E CLAREZA
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Relatos de Consulentes
          </h2>
          <div className="flex items-center justify-center gap-3 py-1">
            <span className="w-12 h-px bg-white/20"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]"></span>
            <span className="w-12 h-px bg-white/20"></span>
          </div>
          <p className="text-xs sm:text-sm text-[#E6E3F1]/80 max-w-lg mx-auto font-light">
            Palavras reais de quem vivenciou as consultas e encontrou direção lúcida para sua rotina com Bianca Tofoli.
          </p>
        </div>

        {/* Marquee Contínuo Lento */}
        <div className="relative w-full overflow-hidden py-4 z-10">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#2B2566] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#2B2566] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-continuous flex gap-6">
            {OFFICIAL_TESTIMONIALS.concat(OFFICIAL_TESTIMONIALS).map((item, idx) => (
              <div
                key={`t-${item.id}-${idx}`}
                className="w-[320px] sm:w-[420px] rounded-2xl bg-[#FFFFFF] text-[#2B2566] border border-[#F0B55E]/40 p-6 sm:p-7 shadow-xl shrink-0 flex flex-col justify-between space-y-4 hover:border-[#F0B55E] transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Quote className="h-6 w-6 text-[#F0B55E]" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C987F]">
                      {item.serviceTitle}
                    </span>
                  </div>
                  <p className="font-heading italic text-xs sm:text-sm text-[#423C7B] leading-relaxed">
                    “{item.content}”
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E2DCCF] flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-[#2B2566]">
                    {item.authorName}
                  </span>
                  <div className="flex text-[#F0B55E] text-xs">★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SESSÕES 5, 6 & ENCONTROS: 3 GRANDES BANNERS DE DESTAQUE FOTOGRÁFICOS
          Patota Astral (Verde WhatsApp / Tech) • Bússola Guia (Amarelo Sol) • Encontros & Palestras (Terracota)
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F4EFE6] space-y-12">
        <div className="mx-auto max-w-7xl space-y-12">

          {/* BANNER 1: PATOTA ASTRAL (VERDE ALEGRE / WHATSAPP TECH) */}
          <div className="relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[420px] border-2 border-[#25D366]/50 shadow-[0_20px_50px_rgba(37,211,102,0.18)] flex items-center">
            {/* Foto de Fundo */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1800&q=80')`
              }}
            />
            {/* Scrim Verde Mais Claro, Alegre e Tecnológico (Estilo WhatsApp) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F4A29]/94 via-[#166437]/88 to-[#0D4123]/90" />
            
            <div className="relative z-10 p-8 sm:p-14 lg:p-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4 text-white">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366] text-[#072B15] text-[10px] font-black uppercase tracking-wider shadow-md">
                  <MessageCircle className="h-3.5 w-3.5 text-[#072B15]" />
                  <span>COMUNIDADE EXCLUSIVA NO WHATSAPP</span>
                </div>
                <h3 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                  Patota Astral
                </h3>
                <p className="font-heading text-lg sm:text-xl text-[#4ADE80] font-medium">
                  Acompanhamento astrológico contínuo e trocas com Bianca Tofoli
                </p>
                <p className="text-xs sm:text-sm text-[#F0FDF4]/90 leading-relaxed max-w-2xl font-light">
                  Conecte-se com a energia de cada lua nova e cheia, antecipe desafios e potencialize oportunidades. Apenas R$ 1,50 por dia para ter a sabedoria cósmica guiando suas semanas com acolhimento e trocas reais.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-4 text-white">
                <div className="text-left lg:text-right">
                  <span className="text-xs text-[#86EFAC] font-bold uppercase tracking-wider block">Assinatura Mensal</span>
                  <span className="text-3xl sm:text-4xl font-bold font-heading text-[#25D366]">R$ 53,00</span>
                  <span className="text-[11px] text-[#DCFCE7]/85 font-medium block mt-1">Sem carência • Cancele quando quiser</span>
                </div>

                <button
                  onClick={() => onNavigate('/patota')}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-[#072B15] px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>FAZER PARTE DA PATOTA</span>
                  <ArrowRight className="h-4 w-4 text-[#072B15]" />
                </button>
              </div>
            </div>
          </div>

          {/* BANNER 2: BÚSSOLA GUIA (AMARELO SOL DOURADO / FUNDO LUMINOSO) */}
          <div className="relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[420px] border-2 border-[#F0B55E]/80 shadow-[0_20px_50px_rgba(240,181,94,0.22)] flex items-center">
            {/* Foto de Fundo */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=80')`
              }}
            />
            {/* Scrim Dourado Solar Mais Claro e Luminoso */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#704007]/90 via-[#8F530B]/84 to-[#6B3C05]/88" />
            
            <div className="relative z-10 p-8 sm:p-14 lg:p-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4 text-white">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0B55E] text-[#2B2566] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  <Compass className="h-3.5 w-3.5 text-[#2B2566]" />
                  <span>NOVO SERVIÇO CASA 6</span>
                </div>
                <h3 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                  Bússola Guia
                </h3>
                <p className="font-heading text-lg sm:text-xl text-[#FDE047] font-medium">
                  Seu relatório astrológico mensal personalizado em PDF
                </p>
                <p className="text-xs sm:text-sm text-[#FEF3C7]/90 leading-relaxed max-w-2xl font-light">
                  Mapeamento individual completo gerado a partir da sua certidão de nascimento. Entregue mensalmente em PDF pelo WhatsApp e disponível com acesso permanente na sua Área de Membros.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-4 text-white">
                <div className="text-left lg:text-right">
                  <span className="text-xs text-[#FDE047] font-bold uppercase tracking-wider block">Investimento Mensal</span>
                  <span className="text-3xl sm:text-4xl font-bold font-heading text-white">R$ 68,00</span>
                  <span className="text-[11px] text-[#FEF3C7]/80 font-medium block mt-1">Relatório individual customizado</span>
                </div>

                <button
                  onClick={() => onNavigate('/bussola')}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#F0B55E] hover:bg-[#dfa247] text-[#2B2566] px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>CONTRATAR BÚSSOLA GUIA</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* BANNER 3: ENCONTROS & PALESTRAS (IDENTIDADE TERRACOTA / TOM TERROSO ACOLHEDOR) */}
          <div className="relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[420px] border-2 border-[#C2593F]/70 shadow-[0_20px_50px_rgba(194,89,63,0.22)] flex items-center">
            {/* Foto de Fundo */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1800&q=80')`
              }}
            />
            {/* Scrim Terracota Terroso Acolhedor */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#632717]/94 via-[#823520]/88 to-[#5C2314]/90" />
            
            <div className="relative z-10 p-8 sm:p-14 lg:p-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4 text-white">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C2593F] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                  <span>✦ EVENTOS, WORKSHOPS & PALESTRAS</span>
                </div>
                <h3 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                  Encontros & Palestras
                </h3>
                <p className="font-heading text-lg sm:text-xl text-[#F8BAA0] font-medium">
                  Diálogos vivos sobre rotina, trabalho e decisões conscientes
                </p>
                <p className="text-xs sm:text-sm text-[#FFEDE6]/90 leading-relaxed max-w-2xl font-light">
                  Palestras presenciais para empresas, encontros temáticos e workshops corporativos conduzidos por Bianca Tofoli para integrar autoconhecimento, organização diária e sustentabilidade humana.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-4 text-white">
                <div className="text-left lg:text-right">
                  <span className="text-xs text-[#F8BAA0] font-bold uppercase tracking-wider block">Para Empresas & Grupos</span>
                  <span className="text-2xl sm:text-3xl font-bold font-heading text-white">Formatos Sob Medida</span>
                  <span className="text-[11px] text-[#F8BAA0] font-medium block mt-1">Presencial e Online</span>
                </div>

                <button
                  onClick={() => onNavigate('/encontros')}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#C2593F] hover:bg-[#af4e36] text-white px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>CONHECER ENCONTROS E PALESTRAS</span>
                  <ArrowRight className="h-4 w-4 text-[#F8BAA0]" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SESSÃO 7: LEITURAS ASTRAIS (3 CARTAS NA MESMA LINHA COM CARTA SOBREPOSTA)
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[#E2DCCF] bg-[#F4EFE6]">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F]">
                CADERNO ASTRAL & BLOG
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#2B2566] tracking-tight">
                Leituras Astrais
              </h2>
              <p className="text-xs sm:text-sm text-[#423C7B] max-w-xl font-light">
                Ensaios e reflexões autorais de Bianca Tofoli apresentados em cartas astrológicas editoriais.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/leituras')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2B2566] hover:text-[#F0B55E] uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
            >
              <span>ACESSAR TODAS AS LEITURAS</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* 3 Cartas de Tarô na Mesma Linha com o Card Projetando para Fora do Box de Texto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-start">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onNavigate('/leituras')}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Carta com Foto em Proporção de Tarô que passa para fora do box */}
                <div className="relative w-full max-w-[290px] aspect-[5/7] rounded-2xl overflow-hidden shadow-xl border-2 border-[#F0B55E]/50 group-hover:border-[#F0B55E] group-hover:-translate-y-2 transition-all duration-300 z-10 bg-[#2B2566]">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2566]/90 via-transparent to-transparent opacity-90" />
                  <div className="absolute top-3 left-3 bg-[#F0B55E] text-[#2B2566] text-[10px] font-bold px-2 py-0.5 rounded font-heading shadow-xs">
                    {post.roman}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-heading font-semibold uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>

                {/* Box com texto menor e mais estreito que a carta */}
                <div className="w-[88%] -mt-6 pt-9 pb-5 px-5 bg-[#FFFFFF] rounded-2xl border border-[#E2DCCF] shadow-xs text-center space-y-2 group-hover:shadow-md transition-shadow">
                  <span className="text-[10px] font-bold text-[#8C987F] uppercase tracking-wider block">
                    {post.date}
                  </span>
                  <h4 className="font-heading text-base font-bold text-[#2B2566] leading-snug line-clamp-2 group-hover:text-[#F0B55E] transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-[#423C7B] leading-relaxed font-light line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#2B2566] group-hover:text-[#F0B55E] transition-colors">
                      Ler mais <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SESSÃO 8: DESTAQUE PARA O CANAL DO YOUTUBE (FUNDO CLARO ELEGANTE SEPARADO DO RODAPÉ)
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F4EFE6] border-t border-[#E2DCCF] relative overflow-hidden">
        {/* Órbitas Decorativas Hairline */}
        <div className="absolute right-[-100px] top-0 w-[500px] h-[500px] rounded-full border border-[#2B2566]/5 pointer-events-none"></div>

        <div className="mx-auto max-w-7xl relative z-10">
          {/* Card Editorial Separado em Estilo Caixa Nobre */}
          <div className="bg-[#FFFFFF] rounded-3xl border border-[#E2DCCF] p-8 sm:p-12 lg:p-16 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Texto e Convite para o Canal */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider">
                <Youtube className="h-4 w-4 text-red-600" />
                <span>CANAL OFICIAL NO YOUTUBE</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#2B2566] leading-tight">
                Acompanhe a Casa 6 em Vídeo
              </h2>

              <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed font-light">
                No nosso canal oficial, Bianca Tofoli compartilha análises astrológicas semanais, leituras das lunações, reflexões sobre os trânsitos contemporâneos e conversas inspiradoras sobre autoconhecimento.
              </p>

              <div className="pt-2">
                <a
                  href={SITE_CONFIG.youtubeUrl || 'https://www.youtube.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-8 text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>ASSISTIR E SE INSCREVER NO CANAL</span>
                </a>
              </div>
            </div>

            {/* Vídeo Incorporado em Player Responsivo com Borda Dourada */}
            <div className="lg:col-span-6">
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-[#F0B55E] shadow-2xl bg-black">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&rel=0"
                  title="Vídeo mais recente Casa 6 — Bianca Tofoli"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Modal de Detalhamento do Atendimento */}
      <ServiceDetailModal
        service={selectedServiceForModal}
        isOpen={Boolean(selectedServiceForModal)}
        onClose={() => setSelectedServiceForModal(null)}
        onBook={(serviceId) => {
          setSelectedServiceForModal(null);
          onOpenBooking(serviceId);
        }}
      />

    </div>
  );
};
