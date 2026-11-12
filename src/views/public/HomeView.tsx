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
import { ArrowRight, Sparkles, Star, Quote, MessageCircle, Compass, Play, Youtube, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { OFFICIAL_SERVICES, OFFICIAL_TESTIMONIALS, SITE_CONFIG } from '../../config/site';
import { FlipTarotCard } from '../../components/common/FlipTarotCard';
import { AstrologicalTestimonialCard } from '../../components/common/AstrologicalTestimonialCard';
import { ServiceDetailModal } from '../../components/common/ServiceDetailModal';
import { ServiceItem } from '../../types';
import { syncCatalogWithFirestore, CATALOG_BLOG_POSTS, getLatestBlogPosts, sortBlogPostsDesc, BlogPostItem } from '../../services/catalogService';

interface HomeViewProps {
  onOpenBooking: (serviceId?: string) => void;
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenBooking, onNavigate }) => {
  const [scrollY, setScrollY] = useState(0);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>(() => sortBlogPostsDesc(CATALOG_BLOG_POSTS).slice(0, 3));

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
      }, 70);
    }, 400);
  };

  const handlePrevTestimonials = () => {
    const prev = (testimonialGroupIndex - 1 + testimonialGroups.length) % testimonialGroups.length;
    changeTestimonialGroup(prev);
  };

  const handleNextTestimonials = () => {
    const next = (testimonialGroupIndex + 1) % testimonialGroups.length;
    changeTestimonialGroup(next);
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
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[#F0B55E] bg-transparent hover:bg-[#F0B55E]/15 px-8 py-3.5 text-xs sm:text-sm font-medium text-[#F0B55E] hover:text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer uppercase tracking-wider backdrop-blur-xs"
            >
              <span>CONHEÇA NOSSOS ATENDIMENTOS</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-[#F0B55E] group-hover:text-white" />
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

                {/* 5. Moldura Circular Principal da Foto Sem Borda Branca e Estática */}
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

            {/* Texto Editorial Compacto e Elegante */}
            <div className="lg:col-span-7 space-y-5 max-w-xl pt-6 sm:pt-10 lg:pt-0">
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

              {/* Narrativa Oficial Exata da Mini Bio */}
              <div className="space-y-4">
                <p className="text-sm sm:text-[15px] text-[#423C7B] leading-relaxed font-normal">
                  Acredito que a astrologia é uma poderosa ferramenta de autoconhecimento e transformação. Meu objetivo é integrá-la ao dia a dia das pessoas, na rotina, ajudando-as a encontrar mais equilíbrio e realização em suas carreiras, relacionamentos, saúde e bem-estar. Quero que cada pessoa descubra sua própria essência e viva de forma mais consciente e alinhada com seus propósitos.
                </p>

                {/* Citação em Destaque com Tom Dourado/Ocre Queimado */}
                <div className="py-1 pl-5 border-l-2 border-[#B87314] my-2">
                  <blockquote className="font-heading text-base sm:text-lg text-[#2B2566] italic leading-snug">
                    “Para mim, tudo tem rachaduras — mas é por elas que entra a luz, se assim permitirmos!”
                  </blockquote>
                </div>

                <p className="text-sm sm:text-[15px] text-[#423C7B] leading-relaxed font-normal">
                  A Casa 6 é a materialização desse propósito: um espaço onde você pode se compreender, alinhar sua energia e viver com mais autenticidade.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/sobre')}
                  className="inline-flex items-center gap-2.5 rounded-full border border-[#F0B55E] bg-transparent hover:bg-[#F0B55E]/10 px-8 py-3.5 text-xs sm:text-sm font-medium text-[#2B2566] hover:text-[#B87314] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer uppercase tracking-wider"
                >
                  <span>CONHEÇA MINHA TRAJETÓRIA</span>
                  <ArrowRight className="h-4 w-4 text-[#F0B55E]" />
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

        {/* Carrossel Ultra-Wide com 4 Depoimentos na Mesma Linha e Flechas Laterais */}
        <div
          className="relative w-full max-w-[97vw] 2xl:max-w-[1820px] mx-auto px-2 sm:px-4 md:px-6 z-10"
          onMouseEnter={() => setIsTestimonialsHovered(true)}
          onMouseLeave={() => setIsTestimonialsHovered(false)}
        >
          {/* Flecha Lateral Esquerda */}
          <button
            onClick={handlePrevTestimonials}
            aria-label="Depoimentos anteriores"
            className="absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-[#2B2566] text-[#2B2566] hover:text-[#F0B55E] border border-[#E2DCCF] shadow-[0_6px_24px_rgba(43,37,102,0.18)] transition-all duration-300 flex items-center justify-center cursor-pointer group"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Flecha Lateral Direita */}
          <button
            onClick={handleNextTestimonials}
            aria-label="Próximos depoimentos"
            className="absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-[#2B2566] text-[#2B2566] hover:text-[#F0B55E] border border-[#E2DCCF] shadow-[0_6px_24px_rgba(43,37,102,0.18)] transition-all duration-300 flex items-center justify-center cursor-pointer group"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Container dos Cards com transição suave fade in / fade out */}
          <div className="px-6 sm:px-10 md:px-12">
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5 transition-all duration-700 ease-in-out transform ${
                isTestimonialsFading ? 'opacity-0 scale-[0.985]' : 'opacity-100 scale-100'
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
        </div>
      </section>

      {/* =========================================================================
          SESSÃO 5: PRODUTOS DIGITAIS E ASSINATURAS (PATOTA ASTRAL & GUIA BÚSSOLA)
          Design Sofisticado, Proporções Unificadas e Fundo Cósmico Animado
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-[#E2DCCF] bg-[#F4EFE6] relative">
        <div className="mx-auto max-w-7xl space-y-16 lg:space-y-20 relative z-10">

          {/* BANNER 1: PATOTA ASTRAL (VERDE FLORESTA CÓSMICO, LOGO NA ESQUERDA, BOTÃO DOURADO À DIREITA) */}
          <div className="relative pt-12 sm:pt-16 lg:pt-20">
            <div className="relative rounded-3xl bg-gradient-to-r from-[#203D2A] via-[#2F5238] to-[#1C3625] border border-white/20 shadow-[0_24px_60px_rgba(32,61,42,0.25)] p-6 sm:p-8 lg:p-10 min-h-[220px] sm:min-h-[230px] lg:min-h-[240px] flex flex-col justify-center overflow-visible text-white">
              
              {/* Fundo Cósmico Animado: Nebulosa Verde Esmeralda, Planeta Saturno com Anéis e Poeira Estelar */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl select-none">
                {/* Nebulosa fluida em deriva suave */}
                <div className="absolute -inset-10 bg-radial from-[#3E6543]/40 via-transparent to-transparent opacity-80 animate-pulse duration-[6000ms]" />
                
                {/* Planeta Cósmico com Anéis em Rotação Lenta Suave */}
                <div className="absolute -right-8 -top-12 w-64 h-64 opacity-25">
                  <div className="absolute inset-16 rounded-full bg-gradient-to-tr from-[#193221] via-[#4F7A54] to-[#78A77E] shadow-2xl" />
                  <div className="absolute inset-4 rounded-full border-2 border-[#F0B55E]/40 scale-y-[0.35] rotate-[28deg] animate-celestial-orbit-slow" />
                  <div className="absolute inset-8 rounded-full border border-dashed border-white/30 scale-y-[0.35] rotate-[28deg] animate-celestial-orbit-reverse" />
                </div>

                {/* Constelação e Partículas Astrais */}
                <svg className="absolute inset-0 w-full h-full text-white/15" viewBox="0 0 800 300" fill="none">
                  <circle cx="120" cy="80" r="1.5" fill="#F0B55E" className="animate-ping" style={{ animationDuration: '4s' }} />
                  <circle cx="280" cy="220" r="1.2" fill="white" />
                  <circle cx="450" cy="60" r="1.5" fill="#F0B55E" />
                  <circle cx="620" cy="180" r="2" fill="white" className="animate-pulse" />
                  <circle cx="720" cy="90" r="1.2" fill="#F0B55E" />
                  <line x1="120" y1="80" x2="280" y2="220" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 3" />
                  <line x1="450" y1="60" x2="620" y2="180" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 3" />
                </svg>

                <div className="absolute top-1/4 left-1/3 text-white/30 text-xs animate-pulse">✦</div>
                <div className="absolute bottom-1/3 right-1/3 text-[#F0B55E]/40 text-sm animate-pulse" style={{ animationDelay: '1.5s' }}>★</div>
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

                {/* Conteúdo: Título Unificado, Texto e Botão Dourado */}
                <div className="lg:col-span-8 flex flex-col justify-center space-y-4 text-white text-center lg:text-left">
                  <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-bold tracking-tight text-white leading-tight">
                    Astrologia diária por Assinatura
                  </h3>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-1">
                    <p className="text-xs sm:text-[13px] md:text-sm text-white/90 leading-relaxed font-light max-w-lg text-center lg:text-left">
                      Conecte-se com a energia do dia, antecipe-se aos desafios e potencialize suas oportunidades com a Patota Astral!
                    </p>

                    <button
                      onClick={() => onNavigate('/patota')}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F0B55E] hover:bg-[#E2A34A] text-[#2B2566] px-6 py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0"
                    >
                      <span>FAZER PARTE DA PATOTA</span>
                      <ArrowRight className="h-4 w-4 text-[#2B2566]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BANNER 2: GUIA BÚSSOLA (TOM ÂMBAR SOLAR, TEXTO NA ESQUERDA, LOGO NA DIREITA) */}
          <div className="relative pt-12 sm:pt-16 lg:pt-20">
            <div className="relative rounded-3xl bg-gradient-to-r from-[#F4B251] via-[#F8C46E] to-[#E59E37] border border-white/60 shadow-[0_24px_60px_rgba(240,181,94,0.25)] p-6 sm:p-8 lg:p-10 min-h-[220px] sm:min-h-[230px] lg:min-h-[240px] flex flex-col justify-center overflow-visible text-[#2B2566]">
              
              {/* Fundo Cósmico Animado: Sol Radiante, Astrolábio Cósmico e Poeira Dourada */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl select-none">
                <div className="absolute -left-16 -bottom-16 w-96 h-96 rounded-full bg-radial from-white/35 via-[#FCE3AA]/20 to-transparent animate-pulse duration-[5000ms]" />

                <div className="absolute -left-12 -top-12 w-80 h-80 opacity-30">
                  <div className="absolute inset-0 rounded-full border-2 border-[#2B2566]/20 animate-celestial-orbit-slow" />
                  <div className="absolute inset-8 rounded-full border border-dashed border-[#2B2566]/25 animate-celestial-orbit-reverse" />
                  <div className="absolute inset-16 rounded-full border border-dotted border-white/50 animate-celestial-shimmer" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#2B2566]">N</div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#2B2566]">S</div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#2B2566]">O</div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#2B2566]">L</div>
                </div>

                <svg className="absolute inset-0 w-full h-full text-[#2B2566]/15" viewBox="0 0 800 300" fill="none">
                  <circle cx="180" cy="140" r="2" fill="#2B2566" />
                  <circle cx="340" cy="70" r="1.5" fill="white" className="animate-ping" style={{ animationDuration: '5s' }} />
                  <circle cx="560" cy="210" r="2" fill="#2B2566" />
                  <circle cx="700" cy="80" r="1.5" fill="white" />
                  <line x1="180" y1="140" x2="340" y2="70" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
                  <line x1="340" y1="70" x2="560" y2="210" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
                </svg>

                <div className="absolute top-1/3 right-1/4 text-white/50 text-xs animate-pulse">✦</div>
                <div className="absolute bottom-6 left-1/2 text-[#2B2566]/35 text-xs animate-pulse" style={{ animationDelay: '2s' }}>✦</div>
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Conteúdo na Esquerda: Título, Texto e Botão */}
                <div className="lg:col-span-8 flex flex-col justify-center space-y-4 text-[#2B2566] text-center lg:text-left order-2 lg:order-1">
                  <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-bold tracking-tight text-[#2B2566] leading-tight">
                    Seu mapa mensal de navegação na palma da sua mão
                  </h3>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-1">
                    <p className="text-xs sm:text-[13px] md:text-sm text-[#2B2566]/85 leading-relaxed font-normal max-w-lg text-center lg:text-left">
                      Mapeamento individual completo. Entregue mensalmente em PDF pelo WhatsApp e na sua Área de Membros para você planejar trabalho, relações e rotina com clareza estratégica.
                    </p>

                    <button
                      onClick={() => onNavigate('/bussola')}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2B2566] hover:bg-[#1E1B4B] text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0"
                    >
                      <span>CONTRATAR BÚSSOLA GUIA</span>
                      <ArrowRight className="h-4 w-4 text-[#F0B55E]" />
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

        {/* Cabeçalho Centralizado idêntico ao estilo de Depoimentos de Clientes */}
        <div className="relative mx-auto max-w-3xl px-4 space-y-3 text-center mb-12 z-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F] block">
            CADERNO ASTRAL & BLOG
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#2B2566]">
            Leituras Astrais
          </h2>
          <div className="flex items-center justify-center gap-3 py-1">
            <span className="w-12 h-px bg-[#2B2566]/20"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]"></span>
            <span className="w-12 h-px bg-[#2B2566]/20"></span>
          </div>
          <p className="text-xs sm:text-sm text-[#423C7B] max-w-xl mx-auto font-light leading-relaxed">
            Ensaios e reflexões autorais de Bianca Tofoli apresentados em artigos editoriais sobre os movimentos do céu e da vida.
          </p>
        </div>

        {/* Container Ultra-Wide de Quase Largura Total */}
        <div className="relative w-full max-w-[97vw] 2xl:max-w-[1850px] mx-auto px-2 sm:px-4 md:px-6 z-10 space-y-10">
          {/* Grid com 3 Boxes Retangulares na Horizontal Mais Largos em Linha Única (1x3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 xl:gap-7 w-full">
            {blogPosts.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="relative rounded-2xl bg-white text-[#2B2566] border border-[#E2DCCF] p-5 sm:p-6 shadow-[0_4px_24px_rgba(43,37,102,0.06)] hover:border-[#F0B55E] hover:shadow-[0_12px_36px_rgba(240,181,94,0.2)] transition-all duration-300 flex flex-col sm:flex-row gap-5 items-center overflow-hidden group select-text h-full"
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

                {/* Imagem do Texto / Artigo (Thumbnail Limpa e Sem Tag) */}
                <div className="w-full sm:w-48 md:w-52 lg:w-44 xl:w-56 h-44 sm:h-48 xl:h-52 rounded-xl overflow-hidden shrink-0 border border-[#E2DCCF] shadow-xs relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover protected-img transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                  />
                </div>

                {/* Conteúdo Textual Chamativo & Botão Roxo */}
                <div className="flex-1 flex flex-col justify-between space-y-2.5 w-full h-full">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10.5px] text-[#8C987F] font-semibold">
                      <span className="truncate max-w-[150px]">Por Bianca Tofoli • {post.publishedAt}</span>
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

                  <div className="pt-2">
                    <button
                      onClick={() => onNavigate(`/leituras/${post.slug}`)}
                      className="whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-[#2B2566] hover:bg-[#3D206B] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-[0_4px_14px_rgba(43,37,102,0.25)] hover:shadow-[0_6px_20px_rgba(43,37,102,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shrink-0"
                    >
                      <span>Leia mais</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#F0B55E] shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botão Centralizado para Acessar todas as Leituras */}
          <div className="pt-6 flex justify-center">
            <button
              onClick={() => onNavigate('/leituras')}
              className="inline-flex items-center gap-2 rounded-full border border-[#2B2566]/25 hover:border-[#2B2566] bg-white hover:bg-[#2B2566] text-[#2B2566] hover:text-white px-8 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>Acessar todas as Leituras</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SESSÃO 8: DESTAQUES DE MÍDIA (BANNERS YOUTUBE & SPOTIFY)
          Design Sofisticado, Proporções Unificadas e Fundo Cósmico Animado
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F4EFE6] border-t border-[#E2DCCF] space-y-16 lg:space-y-20 relative">
        <div className="mx-auto max-w-7xl space-y-16 lg:space-y-20 relative z-10">

          {/* BANNER 1: YOUTUBE (FUNDO RUBI CÓSMICO, VÍDEO NA ESQUERDA, TEXTO E BOTÃO NA DIREITA) */}
          <div className="relative pt-12 sm:pt-16 lg:pt-20">
            <div className="relative rounded-3xl bg-gradient-to-r from-[#7D0B17] via-[#9E121E] to-[#5C0610] border border-white/20 shadow-[0_24px_60px_rgba(125,11,23,0.25)] p-6 sm:p-8 lg:p-10 xl:p-12 min-h-[220px] sm:min-h-[230px] lg:min-h-[240px] flex flex-col justify-center overflow-visible text-white">
              
              {/* Fundo Cósmico Animado: Galáxia Espiral Rubi, Nebulosa Escura e Feixes Estelares */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl select-none">
                <div className="absolute -inset-10 bg-radial from-[#C41C2B]/30 via-transparent to-transparent opacity-75 animate-pulse duration-[7000ms]" />

                <div className="absolute -right-16 -bottom-16 w-88 h-88 opacity-25">
                  <div className="absolute inset-0 rounded-full border border-white/20 animate-celestial-orbit-slow" />
                  <div className="absolute inset-10 rounded-full border border-dashed border-[#F0B55E]/30 animate-celestial-orbit-reverse" />
                  <div className="absolute inset-20 rounded-full border border-dotted border-white/30 animate-celestial-shimmer" />
                  <div className="absolute top-4 left-1/3 text-[10px] text-[#F0B55E]">✦</div>
                </div>

                <svg className="absolute inset-0 w-full h-full text-white/15" viewBox="0 0 800 300" fill="none">
                  <circle cx="150" cy="180" r="1.5" fill="#F0B55E" />
                  <circle cx="320" cy="90" r="2" fill="white" className="animate-pulse" />
                  <circle cx="500" cy="220" r="1.5" fill="#F0B55E" />
                  <circle cx="680" cy="120" r="2" fill="white" />
                  <line x1="150" y1="180" x2="320" y2="90" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />
                  <line x1="320" y1="90" x2="500" y2="220" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />
                </svg>

                <div className="absolute top-8 left-1/4 text-white/40 text-xs animate-pulse">✦</div>
                <div className="absolute bottom-10 right-1/3 text-[#F0B55E]/40 text-xs animate-pulse" style={{ animationDelay: '1.8s' }}>★</div>
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10 xl:gap-12">
                {/* Imagem do Vídeo / Podcast no YouTube Proporcional, com Cantos Arredondados e Espaçamento Perfeitamente Equilibrado */}
                <div className="shrink-0 flex justify-center lg:justify-start -mt-8 sm:-mt-12 lg:-mt-14 xl:-mt-16">
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
                    <img
                      src="https://static.wixstatic.com/media/02c8e0_d34c417ab4f148fcaf82c0354538ae59~mv2.png"
                      alt="Canal da Bianca no YouTube — Podcast"
                      className="w-64 sm:w-80 md:w-[370px] lg:w-[410px] xl:w-[450px] 2xl:w-[470px] h-auto object-cover block rounded-xl sm:rounded-2xl transition-transform duration-500 hover:scale-[1.02]"
                      draggable={false}
                    />
                  </div>
                </div>

                {/* Conteúdo: Título Unificado, Texto e Botão */}
                <div className="flex-1 flex flex-col justify-center space-y-3.5 text-white text-center lg:text-left">
                  <h3 className="font-heading text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
                    Acompanhe o canal da Bianca no YouTube!
                  </h3>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-1">
                    <p className="text-xs sm:text-[13px] md:text-sm text-white/90 leading-relaxed font-light max-w-lg text-center lg:text-left">
                      Vídeos quase todas as semanas sobre reflexões, vida, astrologia, bem estar, rotina, trabalho e muito mais!
                    </p>

                    <a
                      href={SITE_CONFIG.youtubeUrl || 'https://www.youtube.com/@biancatofoli'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E50914] hover:bg-[#c90812] text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0"
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

          {/* BANNER 2: SPOTIFY (FUNDO ESMERALDA CÓSMICO, TEXTO NA ESQUERDA, SELO NA DIREITA) */}
          <div className="relative pt-12 sm:pt-16 lg:pt-20">
            <div className="relative rounded-3xl bg-gradient-to-r from-[#0E2818] via-[#163E24] to-[#0A1D11] border border-white/20 shadow-[0_24px_60px_rgba(14,40,24,0.25)] p-6 sm:p-8 lg:p-10 min-h-[220px] sm:min-h-[230px] lg:min-h-[240px] flex flex-col justify-center overflow-visible text-white">
              
              {/* Fundo Cósmico Animado: Aurora Boreal Cósmica, Ondas Orbitais e Esferas Celestes */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl select-none">
                <div className="absolute -inset-10 bg-radial from-[#1DB954]/25 via-transparent to-transparent opacity-70 animate-pulse duration-[6000ms]" />

                <div className="absolute -left-12 -bottom-12 w-80 h-80 opacity-25">
                  <div className="absolute inset-0 rounded-full border border-[#1DB954]/30 animate-celestial-orbit-slow" />
                  <div className="absolute inset-10 rounded-full border border-dashed border-white/25 animate-celestial-orbit-reverse" />
                  <div className="absolute top-2 right-1/4 w-2.5 h-2.5 rounded-full bg-[#1DB954] shadow-sm shadow-[#1DB954]" />
                </div>

                <svg className="absolute inset-0 w-full h-full text-[#1DB954]/20" viewBox="0 0 800 300" fill="none">
                  <circle cx="160" cy="100" r="1.8" fill="#1DB954" />
                  <circle cx="360" cy="200" r="1.5" fill="white" />
                  <circle cx="540" cy="80" r="2" fill="#1DB954" className="animate-ping" style={{ animationDuration: '4.5s' }} />
                  <circle cx="720" cy="160" r="1.5" fill="white" />
                  <line x1="160" y1="100" x2="360" y2="200" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
                  <line x1="360" y1="200" x2="540" y2="80" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
                </svg>

                <div className="absolute top-10 right-1/4 text-white/40 text-xs animate-pulse">✦</div>
                <div className="absolute bottom-8 left-1/3 text-[#1DB954]/40 text-xs animate-pulse" style={{ animationDelay: '2.2s' }}>★</div>
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Conteúdo na Esquerda: Título Unificado, Texto e Botão */}
                <div className="lg:col-span-8 flex flex-col justify-center space-y-4 text-white text-center lg:text-left order-2 lg:order-1">
                  <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-bold tracking-tight text-white leading-tight">
                    Astrologia com Bianca Tofoli para ouvir no Spotify
                  </h3>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-1">
                    <p className="text-xs sm:text-[13px] md:text-sm text-white/90 leading-relaxed font-light max-w-lg text-center lg:text-left">
                      Um podcast de mapa aberto para você acompanhar de onde estiver; no trânsito, no trabalho ou em suas pausas diárias de autocuidado.
                    </p>

                    <a
                      href={SITE_CONFIG.spotifyUrl || 'https://open.spotify.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1DB954] hover:bg-[#1AA34A] text-[#032412] px-6 py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0"
                    >
                      <svg className="h-4 w-4 fill-current text-[#032412]" viewBox="0 0 24 24">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      <span>OUVIR NO SPOTIFY</span>
                      <ArrowRight className="h-4 w-4 text-[#032412]" />
                    </a>
                  </div>
                </div>

                {/* Selo Circular 3D Mapa Aberto no Spotify na Direita Pulando Para Fora */}
                <div className="lg:col-span-4 flex justify-center lg:justify-end order-1 lg:order-2">
                  <div className="-mt-16 sm:-mt-24 lg:-mt-32 -mb-4 lg:-mb-6 sm:-mr-4 shrink-0">
                    <img
                      src="https://static.wixstatic.com/media/02c8e0_ef5466f4282f4d28886ed7f8b0b0fff5~mv2.png"
                      alt="Podcast Mapa Aberto no Spotify — Bianca Tofoli"
                      className="w-56 sm:w-72 lg:w-80 h-auto object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:scale-105"
                      draggable={false}
                    />
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
