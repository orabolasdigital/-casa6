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
import { AstrologicalTestimonialCard } from '../../components/common/AstrologicalTestimonialCard';
import { ServiceDetailModal } from '../../components/common/ServiceDetailModal';
import { ServiceItem } from '../../types';
import { syncCatalogWithFirestore, CATALOG_BLOG_POSTS, getLatestBlogPosts, BlogPostItem } from '../../services/catalogService';

interface HomeViewProps {
  onOpenBooking: (serviceId?: string) => void;
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenBooking, onNavigate }) => {
  const [scrollY, setScrollY] = useState(0);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>(CATALOG_BLOG_POSTS.slice(0, 3));

  useEffect(() => {
    // Sincroniza coleções no Firestore e carrega dinamicamente os 3 últimos posts
    syncCatalogWithFirestore().catch(console.warn);
    getLatestBlogPosts(3).then((posts) => {
      if (posts && posts.length > 0) {
        setBlogPosts(posts);
      }
    }).catch(console.warn);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4 Atendimentos Oficiais para a Sessão 3 (Consultas Individuais)
  const individualConsultations = [
    {
      id: 'pronto-socorro-astrologico',
      roman: 'I',
      category: 'ÚNICOS',
      title: 'Pronto Socorro',
      fullTitle: 'Pronto Socorro Astrológico',
      subtitle: 'Atendimento rápido e objetivo para situações específicas do momento e tomadas de decisão.',
      iconUrl: 'https://static.wixstatic.com/media/02c8e0_4d4ebb187e354ca78c685b29702bf786~mv2.png',
      priceFormatted: 'R$ 97,00',
      isGolden: false,
      serviceRef: OFFICIAL_SERVICES.find((s) => s.id === 'pronto-socorro-astrologico') || OFFICIAL_SERVICES[0]
    },
    {
      id: 'mapa-natal',
      roman: 'II',
      category: 'ÚNICOS',
      title: 'Mapa Natal',
      fullTitle: 'Mapa Natal',
      subtitle: 'Fotografia do céu no seu nascimento para revelar sua personalidade, padrões e missão de vida.',
      iconUrl: 'https://static.wixstatic.com/media/02c8e0_6f75e1ba77e0487b87f65a9c03f759a8~mv2.png',
      priceFormatted: 'R$ 480,00',
      isGolden: false,
      serviceRef: OFFICIAL_SERVICES.find((s) => s.id === 'mapa-natal-nascimento') || OFFICIAL_SERVICES[2]
    },
    {
      id: 'mapa-revolucao-solar',
      roman: 'III',
      category: 'ÚNICOS',
      title: 'Revolução Solar',
      fullTitle: 'Mapa Revolução Solar',
      subtitle: 'Análise focada nas tendências, oportunidades e desafios dos seus próximos 12 meses.',
      iconUrl: 'https://static.wixstatic.com/media/02c8e0_5cfca337104c4deaacf9d1fdbbd3204e~mv2.png',
      priceFormatted: 'R$ 440,00',
      isGolden: false,
      serviceRef: OFFICIAL_SERVICES.find((s) => s.id === 'mapa-revolucao-solar') || OFFICIAL_SERVICES[4]
    },
    {
      id: 'combo-mapa-roda-revolucao',
      roman: 'IV',
      category: 'COMBOS',
      title: 'Combo Anual',
      fullTitle: 'Mapa Natal + Roda Astrológica + Revolução Solar',
      subtitle: 'Pacote completo: Mapa Natal, Roda Astrológica e previsões da Revolução Solar para seu ano.',
      iconUrl: 'https://static.wixstatic.com/media/02c8e0_591c1874c36d498bb9a584c02efe3fe7~mv2.png',
      priceFormatted: 'R$ 920,00',
      isGolden: true,
      serviceRef: OFFICIAL_SERVICES.find((s) => s.id === 'combo-mapa-roda-revolucao') || OFFICIAL_SERVICES[5]
    }
  ];

  // 4 Palestras e Vivências Oficiais para a Sessão 6 (Montar Juntos é Dourada)
  const lectureCards = [
    {
      id: 'palestra-waap',
      roman: 'I',
      category: 'WORKSHOP',
      title: 'WAAP',
      fullTitle: 'WAAP: Workshop Astrológico de Autoconhecimento Profissional',
      subtitle: 'Imersão no autoconhecimento aplicado à carreira, propósito e dinâmicas de equipe.',
      iconUrl: 'https://static.wixstatic.com/media/02c8e0_427896bbb9fc41d19b341c27b8911c11~mv2.png',
      priceFormatted: 'SOB CONSULTA',
      isGolden: false,
    },
    {
      id: 'palestra-respirar-calma',
      roman: 'II',
      category: 'VIVÊNCIA',
      title: 'RESPIRAR (A)CALMA',
      fullTitle: 'RESPIRAR (A)CALMA',
      subtitle: 'Palestra e vivência sobre pausa consciente, gestão da ansiedade e reconciliação interior.',
      iconUrl: 'https://static.wixstatic.com/media/02c8e0_1c8cc4414b974a1fa7953b603e066b2b~mv2.png',
      priceFormatted: 'SOB CONSULTA',
      isGolden: false,
    },
    {
      id: 'palestra-autoconhecimento-cuidado',
      roman: 'III',
      category: 'CORPORATIVO',
      title: 'Autoconhecimento',
      fullTitle: 'AUTOCONHECIMENTO: Uma ferramenta de cuidado para si e para o outro',
      subtitle: 'Desenvolvimento da empatia, inteligência relacional e limites saudáveis nas equipes.',
      iconUrl: 'https://static.wixstatic.com/media/02c8e0_7e64906fe5664ee29a2dad07d76d8c7a~mv2.png',
      priceFormatted: 'SOB CONSULTA',
      isGolden: false,
    },
    {
      id: 'palestra-vamos-montar-juntos',
      roman: 'IV',
      category: 'SOB MEDIDA',
      title: 'Montar Juntos',
      fullTitle: 'VAMOS MONTAR JUNTOS?',
      subtitle: 'Formato personalizado desenvolvido sob medida para as demandas da sua empresa ou evento.',
      iconUrl: 'https://static.wixstatic.com/media/02c8e0_b033d99920454a7e90dd46c0059ac290~mv2.png',
      priceFormatted: 'PERSONALIZADO',
      isGolden: true,
    }
  ];

  // 3 Grupos de 4 Depoimentos Oficiais para a Sessão 4 (Alternados a cada período)
  const testimonialGroups = [
    OFFICIAL_TESTIMONIALS.slice(0, 4),
    OFFICIAL_TESTIMONIALS.slice(4, 8),
    [
      OFFICIAL_TESTIMONIALS[8],
      OFFICIAL_TESTIMONIALS[9],
      OFFICIAL_TESTIMONIALS[10],
      OFFICIAL_TESTIMONIALS[12] || OFFICIAL_TESTIMONIALS[11]
    ]
  ];

  const [testimonialGroupIndex, setTestimonialGroupIndex] = useState(0);
  const [isTestimonialsHovered, setIsTestimonialsHovered] = useState(false);
  const [isTestimonialsFading, setIsTestimonialsFading] = useState(false);

  const changeTestimonialGroup = (nextIndex: number) => {
    if (nextIndex === testimonialGroupIndex || isTestimonialsFading) return;
    setIsTestimonialsFading(true);
    setTimeout(() => {
      setTestimonialGroupIndex(nextIndex);
      setTimeout(() => {
        setIsTestimonialsFading(false);
      }, 60);
    }, 450);
  };

  // Troca automática periódica suave a cada 7 segundos (pausa ao passar o mouse para permitir leitura confortável)
  useEffect(() => {
    if (isTestimonialsHovered) return;
    const timer = setInterval(() => {
      changeTestimonialGroup((testimonialGroupIndex + 1) % testimonialGroups.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isTestimonialsHovered, testimonialGroupIndex, testimonialGroups.length]);

  return (
    <div className="bg-[#F4EFE6] text-[#2B2566] overflow-x-hidden font-body">

      {/* =========================================================================
          SESSÃO 1: BANNER PRINCIPAL COM VÍDEO EM LOOPING, TÍTULO RESTAURADO E CTA
          ========================================================================= */}
      <section className="relative w-full bg-[#2B2566] text-[#FFFFFF] pt-24 sm:pt-36 lg:pt-44 pb-36 sm:pb-52 lg:pb-68 px-4 sm:px-6 lg:px-8">
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

        <div className="relative mx-auto max-w-5xl z-10 space-y-6 pb-12 sm:pb-20 lg:pb-28">
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

          {/* Título Oficial Restaurado conforme solicitado */}
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

          <div className="pt-4 flex items-center">
            <button
              onClick={() => onNavigate('/atendimentos')}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#F0B55E] px-8 py-4 text-xs sm:text-sm font-bold text-[#2B2566] shadow-xl hover:bg-[#dfa247] transition-all transform hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer uppercase tracking-wider"
            >
              <span>CONHEÇA NOSSOS ATENDIMENTOS</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-[#2B2566]" />
            </button>
          </div>
        </div>

        {/* Transição Reta com Degradê Suave: Roxo escuro se fundindo no tom claro (#F4EFE6) da seção abaixo */}
        <div className="absolute -bottom-px left-0 right-0 h-44 sm:h-64 lg:h-80 bg-gradient-to-b from-transparent via-[#2B2566]/30 via-35% via-[#F4EFE6]/75 via-75% to-[#F4EFE6] pointer-events-none z-15" />
      </section>

      {/* =========================================================================
          SESSÃO 2: DESTAQUE PARA BIANCA TOFOLI (FOTO EM CÍRCULO SOBREPOSTA E ELEMENTOS ANIMADOS)
          ========================================================================= */}
      <section className="relative pt-0 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-[#F4EFE6] z-20">
        <div className="mx-auto max-w-7xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Foto Circular da Bianca Sobreposta Invasiva (z-30, Invadindo a 1ª Seção) */}
            <div className="lg:col-span-5 flex justify-center -mt-28 sm:-mt-48 lg:-mt-64 xl:-mt-76 relative z-30">
              <div className="relative w-84 sm:w-[420px] md:w-[460px] lg:w-[490px] xl:w-[530px] aspect-square flex items-center justify-center">
                {/* 1. Disco Sol decorativo ao fundo com pulso cósmico delicado */}
                <div className="absolute -left-6 sm:-left-10 lg:-left-12 top-1/2 -translate-y-1/2 w-52 sm:w-64 lg:w-76 h-52 sm:h-64 lg:h-76 rounded-full bg-gradient-to-br from-[#F0B55E] to-[#E5A548] opacity-90 pointer-events-none animate-celestial-sun shadow-xl shadow-[#F0B55E]/25"></div>

                {/* 2. Anel de Cintilação / Brilho Suave */}
                <div className="absolute inset-[-16px] sm:inset-[-22px] lg:inset-[-28px] rounded-full border border-[#F0B55E]/40 pointer-events-none animate-celestial-shimmer"></div>

                {/* 3. Órbita Externa Pontilhada com Rotação Lenta Suave e Marcadores Astrais */}
                <div className="absolute inset-[-32px] sm:inset-[-42px] lg:inset-[-54px] rounded-full border border-dashed border-[#2B2566]/30 dark:border-[#F0B55E]/30 pointer-events-none animate-celestial-orbit-slow">
                  {/* Pérola Cósmica no topo da órbita */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#F0B55E] shadow-sm shadow-[#F0B55E]/80 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                  {/* Estrela de 4 pontas decorativa na órbita */}
                  <div className="absolute top-1/3 -right-1 text-[11px] text-[#F0B55E] font-heading select-none">✦</div>
                  {/* Marcador Oliva */}
                  <div className="absolute -bottom-1 left-1/3 w-2.5 h-2.5 rounded-full bg-[#8C987F] opacity-75"></div>
                </div>

                {/* 4. Órbita Interna com Rotação Reversa Suave */}
                <div className="absolute inset-[-12px] sm:inset-[-16px] lg:inset-[-20px] rounded-full border border-[#8C987F]/40 rotate-45 pointer-events-none animate-celestial-orbit-reverse">
                  <div className="absolute top-1 right-12 w-2.5 h-2.5 rounded-full bg-[#2B2566]/60"></div>
                </div>

                {/* 5. Moldura Circular Principal da Foto com Borda Branca e Anel Dourado Suave */}
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 sm:border-6 lg:border-8 border-white bg-white ring-1 ring-[#F0B55E]/40">
                  <img
                    src="https://static.wixstatic.com/media/02c8e0_54a33eeb476d45c49b7f4953c34177fc~mv2.jpeg"
                    alt="Bianca Tofoli — Fundadora da Casa 6"
                    className="w-full h-full object-cover object-center protected-img transition-transform duration-700 hover:scale-103"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            {/* Texto Editorial Compacto e Quadradinho */}
            <div className="lg:col-span-7 space-y-5 max-w-lg pt-6 sm:pt-10 lg:pt-0">
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
                  <span className="font-highlight italic text-xl sm:text-2xl text-[#B87314] font-semibold">trabalho</span>, da{' '}
                  <span className="font-highlight italic text-xl sm:text-2xl text-[#B87314] font-semibold">rotina</span> e do{' '}
                  <span className="font-highlight italic text-xl sm:text-2xl text-[#B87314] font-semibold">cuidado</span> com o corpo.
                </p>
                <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed font-light text-balance">
                  É o território da Bianca: enfermeira, gestora, palestrante. A astrologia entra como origem do nome e como vocabulário de direção — casa, mapa, caminho — nunca como promessa mística. A marca fala de decisões reais: demandas e recursos na rotina, a pausa consciente antes de responder e o corpo que sustenta a trajetória com o apoio que precisa existir ao redor.
                </p>
              </div>

              {/* Frase em destaque serifada com tom ocre queimado para alto contraste em fundo claro */}
              <div className="pt-1 pl-5 border-l-2 border-[#B87314]">
                <blockquote className="font-heading text-lg sm:text-xl text-[#2B2566] leading-snug">
                  QUANDO TUDO{' '}
                  <span className="font-highlight italic text-[1.25em] font-semibold text-[#B87314] inline-block align-baseline ml-1">
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
                Consultas Individuais
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

          {/* Grid com as Cartas Viradas 3D (FlipTarotCard) — 4 Atendimentos Oficiais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {individualConsultations.map((item, index) => (
              <div key={item.id} className="w-full">
                <FlipTarotCard
                  index={index}
                  romanNumeral={item.roman}
                  categoryBadge={item.category}
                  title={item.title}
                  subtitle={item.subtitle}
                  iconUrl={item.iconUrl}
                  priceFormatted={item.priceFormatted}
                  isGoldenCard={item.isGolden}
                  actionLabel="VER ATENDIMENTO"
                  onAction={() => onNavigate('/atendimentos')}
                  onDetailClick={() => setSelectedServiceForModal(item.serviceRef)}
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
          SESSÃO 4: DEPOIMENTOS DE CLIENTES (FUNDO CLARO PADRÃO & CARDS HORIZONTAIS)
          ========================================================================= */}
      <section className="py-20 sm:py-28 border-y border-[#E2DCCF] bg-[#F4EFE6] text-[#2B2566] relative overflow-hidden">
        {/* Órbitas Decorativas Sutis no Fundo Claro */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-[#2B2566]/4"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#F0B55E]/15"></div>
          <div className="absolute top-12 left-1/4 text-[#F0B55E] opacity-30 text-xs">✦</div>
          <div className="absolute bottom-12 right-1/4 text-[#8C987F] opacity-30 text-xs">★</div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4 text-center mb-10 z-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F]">
            EXPERIÊNCIAS REAIS • ACOLHIMENTO E CLAREZA
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#2B2566]">
            Depoimentos de clientes
          </h2>
          <div className="flex items-center justify-center gap-3 py-1">
            <span className="w-12 h-px bg-[#2B2566]/20"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]"></span>
            <span className="w-12 h-px bg-[#2B2566]/20"></span>
          </div>
          <p className="text-xs sm:text-sm text-[#423C7B] max-w-lg mx-auto font-light">
            Depoimentos de quem encontrou clareza prática, acolhimento e direção nas consultas e na Patota Astral com Bianca Tofoli.
          </p>
        </div>

        {/* Combo com 4 Depoimentos na Mesma Linha (1x4) Sem Segunda Linha */}
        <div
          className="relative mx-auto max-w-7xl xl:max-w-[1440px] px-4 sm:px-6 lg:px-8 z-10"
          onMouseEnter={() => setIsTestimonialsHovered(true)}
          onMouseLeave={() => setIsTestimonialsHovered(false)}
        >
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5 transition-opacity duration-500 ease-in-out ${
              isTestimonialsFading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {testimonialGroups[testimonialGroupIndex].map((item, idx) => (
              <AstrologicalTestimonialCard
                key={item.id}
                testimonial={item}
                cardIndex={idx}
                groupIndex={testimonialGroupIndex}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SESSÃO 5: BANNERS PROMOCIONAIS OFICIAIS (PATOTA ASTRAL & GUIA BÚSSOLA)
          Fiel ao design de referência: cores exatas, mesma proporção de box,
          mesma distância do logo 3D e elementos celestes sutis nos cantos
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F4EFE6] space-y-16 lg:space-y-24 relative overflow-hidden">
        {/* Elementos Soltos Celestiais nos Cantos em Branco (Órbitas, Linhas Circulares e Pontilhadas com Animação Suave) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Canto Superior Esquerdo */}
          <div className="absolute top-4 left-6 w-48 sm:w-64 h-48 sm:h-64 rounded-full border border-dashed border-[#8C987F]/25 animate-celestial-orbit-slow" />
          <div className="absolute top-12 left-14 w-32 sm:w-40 h-32 sm:h-40 rounded-full border border-dotted border-[#2B2566]/15 animate-celestial-orbit-reverse" />
          <div className="absolute top-10 left-32 text-[#F0B55E] opacity-35 text-xs">✦</div>

          {/* Canto Superior Direito */}
          <div className="absolute top-8 right-8 w-56 sm:w-72 h-56 sm:h-72 rounded-full border border-[#F0B55E]/20 animate-celestial-orbit-slow" />
          <div className="absolute top-16 right-16 w-36 sm:w-48 h-36 sm:h-48 rounded-full border border-dashed border-[#2B2566]/15 animate-celestial-orbit-reverse" />
          <div className="absolute top-24 right-36 text-[#8C987F] opacity-35 text-xs">★</div>

          {/* Margem Central Entre os Banners */}
          <div className="absolute top-1/2 left-4 w-36 h-36 rounded-full border border-dotted border-[#B87314]/20 animate-celestial-orbit-reverse" />
          <div className="absolute top-1/2 right-6 w-44 h-44 rounded-full border border-dashed border-[#8C987F]/25 animate-celestial-orbit-slow" />

          {/* Canto Inferior Esquerdo */}
          <div className="absolute bottom-6 left-8 w-48 sm:w-60 h-48 sm:h-60 rounded-full border border-[#2B2566]/15 animate-celestial-orbit-reverse" />
          <div className="absolute bottom-12 left-16 w-32 sm:w-40 h-32 sm:h-40 rounded-full border border-dashed border-[#F0B55E]/25 animate-celestial-orbit-slow" />

          {/* Canto Inferior Direito */}
          <div className="absolute bottom-8 right-6 w-44 sm:w-56 h-44 sm:h-56 rounded-full border border-dashed border-[#8C987F]/25 animate-celestial-orbit-slow" />
          <div className="absolute bottom-16 right-14 w-28 sm:w-36 h-28 sm:h-36 rounded-full border border-dotted border-[#2B2566]/20 animate-celestial-orbit-reverse" />
        </div>

        <div className="mx-auto max-w-7xl space-y-16 lg:space-y-24 relative z-10">

          {/* BANNER 1: PATOTA ASTRAL (VERDE MUSGO EXATO, LOGO NA ESQUERDA, BOTÃO DOURADO À DIREITA) */}
          <div className="relative pt-12 sm:pt-16 lg:pt-20">
            {/* Linhas circulares discretas no canto do box */}
            <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full border border-dashed border-[#8C987F]/30 pointer-events-none animate-celestial-orbit-slow hidden md:block" />

            <div className="relative rounded-3xl bg-[#516443] border border-[#647C53]/60 shadow-[0_20px_50px_rgba(43,37,102,0.12)] p-6 sm:p-8 lg:p-10 overflow-visible text-white">
              {/* Animação Astrológica de Fundo: Órbitas Girando e Ondulações Circulares */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                <div className="absolute -left-12 -top-12 w-80 h-80 rounded-full border border-white/10" />
                <div className="absolute -left-20 -top-20 w-[420px] h-[420px] rounded-full border border-dashed border-white/10 animate-celestial-orbit-slow" />
                <div className="absolute -right-20 -bottom-20 w-[360px] h-[360px] rounded-full border border-dashed border-[#F0B55E]/15 animate-celestial-orbit-reverse" />
                <div className="absolute top-8 right-1/4 text-white/40 text-xs animate-pulse">✦</div>
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Logo Oficial 3D Grande Pulando Para Fora do Box na Esquerda */}
                <div className="lg:col-span-4 flex justify-center lg:justify-start">
                  <div className="-mt-16 sm:-mt-24 lg:-mt-32 -mb-4 lg:-mb-6 sm:-ml-4 shrink-0">
                    <img
                      src="https://static.wixstatic.com/media/02c8e0_e5132493b4a14c0498c5df95ee68c593~mv2.png"
                      alt="Patota Astral"
                      className="w-56 sm:w-72 lg:w-80 h-auto object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-105"
                      draggable={false}
                    />
                  </div>
                </div>

                {/* Conteúdo: Título Exato, Texto Exato e Botão Dourado */}
                <div className="lg:col-span-8 flex flex-col justify-center space-y-4 text-white text-center lg:text-left">
                  <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.12]">
                    Astrologia diária <span className="block font-normal"><span className="font-highlight italic text-white/95 font-normal">por</span> Assinatura</span>
                  </h3>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                    <p className="text-xs sm:text-[13px] md:text-sm text-white/90 leading-relaxed font-light max-w-lg text-center lg:text-left">
                      Conecte-se com a energia do dia, antecipe-se aos desafios e potencialize suas oportunidades com a Patota Astral!
                    </p>

                    <button
                      onClick={() => onNavigate('/patota')}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E0A353] hover:bg-[#c99041] text-[#2B2566] px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shrink-0"
                    >
                      <span>FAZER PARTE DA PATOTA</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BANNER 2: GUIA BÚSSOLA (TOM PÊSSEGO/ÂMBAR EXATO, TEXTO NA ESQUERDA, LOGO NA DIREITA) */}
          <div className="relative pt-12 sm:pt-16 lg:pt-20">
            {/* Linhas circulares discretas no canto do box */}
            <div className="absolute -top-6 -left-6 w-40 h-40 rounded-full border border-dashed border-[#B87314]/25 pointer-events-none animate-celestial-orbit-slow hidden md:block" />

            <div className="relative rounded-3xl bg-gradient-to-r from-[#FEDEA8] via-[#FDCF8A] to-[#FCA84E] border border-white/70 shadow-[0_20px_50px_rgba(43,37,102,0.12)] p-6 sm:p-8 lg:p-10 overflow-visible text-[#2B2566]">
              {/* Animação Astrológica de Fundo: Órbitas Girando e Cintilações */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full border border-[#2B2566]/10 animate-celestial-orbit-slow" />
                <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full border border-dashed border-white/30 animate-celestial-orbit-reverse" />
                <div className="absolute top-10 left-1/3 text-[#2B2566] opacity-25 text-xs animate-pulse">✦</div>
                <div className="absolute bottom-10 right-1/4 text-white opacity-40 text-xs animate-pulse">★</div>
              </div>

              {/* Rabicho de balão sutil apontando para a esquerda atrás do logo */}
              <div className="absolute right-44 lg:right-60 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-[#FDCF8A] to-[#FCA84E] rotate-45 pointer-events-none hidden lg:block opacity-60" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Conteúdo na Esquerda: Título Solicitado, Texto e Botão Roxo */}
                <div className="lg:col-span-8 flex flex-col justify-center space-y-4 text-[#2B2566] text-center lg:text-left order-2 lg:order-1">
                  <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2B2566] leading-[1.1]">
                    Seu guia mensal na <span className="block font-bold">palma da sua Mão</span>
                  </h3>

                  <p className="text-xs sm:text-[13px] md:text-sm text-[#2B2566]/90 leading-relaxed font-normal max-w-xl">
                    Mapa individual completo. Entregue mensalmente para você planejar trabalho, relações e rotina com clareza estratégica.
                  </p>

                  <div className="pt-1">
                    <button
                      onClick={() => onNavigate('/bussola')}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2B2566] hover:bg-[#1E1B4B] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      <span>CONTRATAR BÚSSOLA GUIA</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#F0B55E]" />
                    </button>
                  </div>
                </div>

                {/* Logo Oficial Bússola Guia 3D na Direita */}
                <div className="lg:col-span-4 flex justify-center lg:justify-end order-1 lg:order-2">
                  <div className="-mt-16 sm:-mt-24 lg:-mt-32 -mb-4 lg:-mb-6 sm:-mr-4 shrink-0">
                    <img
                      src="https://static.wixstatic.com/media/02c8e0_688edec712d4401984a6e1cf8afeb93e~mv2.png"
                      alt="Guia Bússola"
                      className="w-56 sm:w-72 lg:w-80 h-auto object-contain filter drop-shadow-[0_16px_32px_rgba(43,37,102,0.3)] transition-transform duration-500 hover:scale-105"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SESSÃO 6: PALESTRAS E VIVÊNCIAS (4 CARTAS DE TARÔ 3D COM MONTAR JUNTOS DOURADA)
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[#E2DCCF] bg-[#F4EFE6]">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F]">
                EVENTOS & CORPORATIVO • VIVÊNCIAS COLETIVAS
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#2B2566] tracking-tight">
                Palestras e Vivências
              </h2>
              <p className="text-xs sm:text-sm text-[#423C7B] max-w-xl font-light">
                Metodologias práticas e encontros conduzidos por Bianca Tofoli para cultivar presença, autoconhecimento e clareza coletiva em empresas e grupos.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/palestras')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2B2566] hover:text-[#F0B55E] uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
            >
              <span>VER TODAS AS PALESTRAS</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Grid com 4 Cartas Viradas 3D (FlipTarotCard) - Montar Juntos é Dourada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {lectureCards.map((item, index) => (
              <div key={item.id} className="w-full">
                <FlipTarotCard
                  index={index}
                  romanNumeral={item.roman}
                  categoryBadge={item.category}
                  title={item.title}
                  subtitle={item.subtitle}
                  iconUrl={item.iconUrl}
                  priceFormatted={item.priceFormatted}
                  isGoldenCard={item.isGolden}
                  actionLabel="SABER MAIS"
                  onAction={() => onNavigate('/palestras')}
                  onDetailClick={() => onNavigate('/palestras')}
                />
              </div>
            ))}
          </div>

          <p className="text-[11px] text-center text-[#68638C]">
            Toque ou passe o cursor sobre as cartas para girar • Clique para solicitar proposta para seu evento
          </p>
        </div>
      </section>

      {/* =========================================================================
          SESSÃO 7: LEITURAS ASTRAIS (BOXES RETANGULARES NA HORIZONTAL COM TEXTO & BOTÃO)
          Sem efeito de carta de tarô • Fundo claro e cantoneiras astrais refinadas
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[#E2DCCF] bg-[#F4EFE6] relative overflow-hidden">
        {/* Órbitas Decorativas Sutis no Fundo Claro */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-[#2B2566]/4"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-[#F0B55E]/15"></div>
          <div className="absolute top-12 right-1/4 text-[#F0B55E] opacity-35 text-xs">✦</div>
        </div>

        <div className="mx-auto max-w-7xl space-y-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F]">
                CADERNO ASTRAL & BLOG
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#2B2566] tracking-tight">
                Leituras Astrais
              </h2>
              <p className="text-xs sm:text-sm text-[#423C7B] max-w-xl font-light">
                Ensaios e reflexões autorais de Bianca Tofoli apresentados em artigos editoriais sobre os movimentos do céu e da vida.
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

          {/* Grid com 3 Boxes Retangulares na Horizontal em Linha Única (1x3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6 max-w-7xl xl:max-w-[1440px] mx-auto">
            {blogPosts.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="relative rounded-2xl bg-white text-[#2B2566] border border-[#E2DCCF] p-4 sm:p-5 shadow-[0_4px_20px_rgba(43,37,102,0.05)] hover:border-[#F0B55E] hover:shadow-[0_12px_32px_rgba(240,181,94,0.18)] transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center overflow-hidden group select-text h-full"
              >
                {/* Cantoneiras Astrais Douradas nos Cantos */}
                <div className="absolute top-2.5 left-2.5 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                  <svg className="w-3.5 h-3.5 text-[#F0B55E]" viewBox="0 0 16 16" fill="none">
                    <path d="M1 9V1H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="1" cy="1" r="1" fill="currentColor" />
                  </svg>
                </div>
                <div className="absolute top-2.5 right-2.5 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                  <svg className="w-3.5 h-3.5 text-[#F0B55E]" viewBox="0 0 16 16" fill="none">
                    <path d="M15 9V1H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="15" cy="1" r="1" fill="currentColor" />
                  </svg>
                </div>

                {/* Imagem do Texto / Artigo (Thumbnail Retangular) */}
                <div className="w-full sm:w-36 md:w-40 lg:w-44 h-36 sm:h-44 rounded-xl overflow-hidden shrink-0 border border-[#E2DCCF] shadow-xs relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover protected-img transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2566]/65 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-[#F0B55E] text-[#2B2566] text-[8.5px] font-black uppercase tracking-wider shadow-xs">
                    {post.category}
                  </span>
                </div>

                {/* Conteúdo Textual Chamativo & Botão */}
                <div className="flex-1 flex flex-col justify-between space-y-2.5 w-full h-full">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10.5px] text-[#8C987F] font-semibold">
                      <span className="truncate max-w-[140px]">Por Bianca Tofoli • {post.publishedAt}</span>
                      <span className="text-[9.5px] text-[#B87314] uppercase tracking-wider font-bold shrink-0">{post.readTime}</span>
                    </div>

                    <h3 className="font-heading font-bold text-base sm:text-[17px] text-[#2B2566] leading-snug group-hover:text-[#B87314] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Linha Divisória Fina Dourada com Estrela */}
                    <div className="relative py-0.5">
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#F0B55E]/60 to-transparent" />
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[8px] text-[#F0B55E] select-none">
                        ✦
                      </div>
                    </div>

                    <p className="font-body text-xs text-[#423C7B] leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => onNavigate('/leituras')}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F0B55E] text-[#2B2566] px-4 py-2 text-[11px] font-bold uppercase tracking-wider border border-[#E2DCCF] transition-all cursor-pointer group-hover:bg-[#F0B55E] shadow-xs hover:shadow-md"
                    >
                      <span>LER MATÉRIA COMPLETA</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SESSÃO 8: DESTAQUES DE MÍDIA — BANNERS YOUTUBE & SPOTIFY
          No mesmo estilo dos banners Patota Astral e Guia Bússola • Um em cada linha
          Logos oficiais 3D grandes pulando para fora do box • Animações astrológicas e links diretos
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F4EFE6] border-t border-[#E2DCCF] space-y-16 lg:space-y-24">
        <div className="mx-auto max-w-7xl space-y-16 lg:space-y-24">

          {/* BANNER 1: YOUTUBE (FUNDO ROXO NOITE CÓSMICA COM LOGO PULANDO PARA FORA) */}
          <div className="relative pt-12 sm:pt-16 lg:pt-20">
            <div className="relative rounded-3xl bg-gradient-to-r from-[#2B2566] via-[#211B55] to-[#3D206B] border border-[#F0B55E]/40 shadow-2xl p-6 sm:p-10 lg:p-14 overflow-visible text-white">
              {/* Animação Astrológica de Fundo: Órbitas Girando e Cintilações */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                <div className="absolute -left-20 -bottom-20 w-[460px] h-[460px] rounded-full border border-[#FF0000]/15 animate-celestial-orbit-slow" />
                <div className="absolute -right-16 -top-20 w-[400px] h-[400px] rounded-full border border-dashed border-[#F0B55E]/20 animate-celestial-orbit-reverse" />
                <div className="absolute top-12 left-1/3 text-[#F0B55E] opacity-35 text-xs animate-pulse">✦</div>
                <div className="absolute bottom-10 right-1/4 text-[#FF4D4D] opacity-40 text-xs animate-pulse">★</div>
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Logo Oficial 3D Grande Pulando Para Fora do Box */}
                <div className="lg:col-span-5 flex justify-center lg:justify-start">
                  <div className="-mt-20 sm:-mt-28 lg:-mt-36 -mb-4 lg:-mb-8 sm:-ml-4 lg:-ml-8 shrink-0">
                    <img
                      src="https://static.wixstatic.com/media/02c8e0_d34c417ab4f148fcaf82c0354538ae59~mv2.png"
                      alt="Canal Casa 6 no YouTube — Bianca Tofoli"
                      className="w-64 sm:w-80 lg:w-[400px] h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105"
                      draggable={false}
                    />
                  </div>
                </div>

                {/* Conteúdo: Título Grande, Texto e Botão Logo Abaixo */}
                <div className="lg:col-span-7 space-y-4 text-white text-center lg:text-left">
                  <h3 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                    Acompanhe a Casa 6 <span className="font-highlight italic text-[#FF4D4D] font-normal block sm:inline">em Vídeo no</span> YouTube
                  </h3>
                  <p className="text-sm sm:text-base text-[#E6E3F1]/90 leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
                    Análises astrológicas semanais, leituras das lunações, reflexões sobre os trânsitos contemporâneos e conversas inspiradoras com Bianca Tofoli. Inscreva-se e ative as notificações para navegar com clareza.
                  </p>
                  <div className="pt-2">
                    <a
                      href={SITE_CONFIG.youtubeUrl || 'https://www.youtube.com/@biancatofoli'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#FF0000] hover:bg-[#D90000] text-white px-8 py-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      <span>ASSISTIR NO YOUTUBE</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BANNER 2: SPOTIFY (FUNDO VERDE PROFUNDO / ROXO COM LOGO PULANDO PARA FORA) */}
          <div className="relative pt-12 sm:pt-16 lg:pt-20">
            <div className="relative rounded-3xl bg-gradient-to-r from-[#0E281E] via-[#133A2A] to-[#1E1B4B] border border-[#1DB954]/40 shadow-2xl p-6 sm:p-10 lg:p-14 overflow-visible text-white">
              {/* Animação Astrológica de Fundo: Órbitas Girando e Cintilações */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                <div className="absolute -right-20 -bottom-20 w-[460px] h-[460px] rounded-full border border-[#1DB954]/20 animate-celestial-orbit-slow" />
                <div className="absolute -left-16 -top-20 w-[400px] h-[400px] rounded-full border border-dashed border-[#F0B55E]/15 animate-celestial-orbit-reverse" />
                <div className="absolute top-12 right-1/3 text-[#1DB954] opacity-40 text-xs animate-pulse">✦</div>
                <div className="absolute bottom-10 left-1/4 text-[#F0B55E] opacity-35 text-xs animate-pulse">★</div>
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Logo Oficial 3D Grande Pulando Para Fora do Box */}
                <div className="lg:col-span-5 flex justify-center lg:justify-start">
                  <div className="-mt-20 sm:-mt-28 lg:-mt-36 -mb-4 lg:-mb-8 sm:-ml-4 lg:-ml-8 shrink-0">
                    <img
                      src="https://static.wixstatic.com/media/02c8e0_ef5466f4282f4d28886ed7f8b0b0fff5~mv2.png"
                      alt="Podcast Casa 6 no Spotify — Bianca Tofoli"
                      className="w-64 sm:w-80 lg:w-[400px] h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105"
                      draggable={false}
                    />
                  </div>
                </div>

                {/* Conteúdo: Título Grande, Texto e Botão Logo Abaixo */}
                <div className="lg:col-span-7 space-y-4 text-white text-center lg:text-left">
                  <h3 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                    Astrologia e Rotina <span className="font-highlight italic text-[#1ED760] font-normal block sm:inline">para Ouvir no</span> Spotify
                  </h3>
                  <p className="text-sm sm:text-base text-[#D1FAE5]/90 leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
                    Episódios sobre os céus, rotina e autoconhecimento lúcido em formato de podcast para acompanhar onde você estiver — no trânsito, no trabalho ou em suas pausas diárias de autocuidado.
                  </p>
                  <div className="pt-2">
                    <a
                      href={SITE_CONFIG.spotifyUrl || 'https://open.spotify.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#1DB954] hover:bg-[#1AA34A] text-[#052010] px-8 py-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      <svg className="h-4 w-4 fill-current text-[#052010]" viewBox="0 0 24 24">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      <span>OUVIR NO SPOTIFY</span>
                      <ArrowRight className="h-4 w-4 text-[#052010]" />
                    </a>
                  </div>
                </div>
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
