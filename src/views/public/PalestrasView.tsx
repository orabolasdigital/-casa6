/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /palestras (Encontros Corporativos & Portfólio Institucional)
 * 
 * Atualizações de Design e Layout:
 * - Leveza e fluidez total (#FAF8F5), sem blocos pesados ou escuros.
 * - 1ª Seção aberta e ampla (largura total): Header + Conformidade com a NR-1 & Saúde Psicossocial + Logos das Empresas Atendidas em um único bloco fluído.
 * - 2ª Seção: "Workshops Oficiais" com os 3 produtos lado a lado na mesma linha (grid 3 colunas), botão "Solicitar proposta" em linha única (whitespace-nowrap).
 * - 3ª Seção: "Impacto Mensurável" (6 KPIs do PDF) em uma única linha no desktop (grid 6 colunas) com textos concisos e visual direto.
 * - 4ª Seção: "Momentos Estratégicos: Quando Contratar?" aberto, sem box branco, com os 6 momentos em uma única linha (grid 6 colunas).
 * - 5ª Seção: "Repertório Corporativo & Conteúdos em Vídeo" integrado: temas corporativos e o mosaico dos 7 vídeos do YouTube em linha única expansiva.
 * - 6ª Seção: "Vamos Montar Juntos?" aberto e em destaque, com o mosaico de 10 fotos reais ocupando exatamente 2 linhas (5 por linha) na largura total da tela.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Play,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  HeartPulse,
  Activity,
  Briefcase,
  Calendar,
  Layers,
  Flame,
  Check
} from 'lucide-react';
import { CATALOG_PALESTRAS } from '../../services/catalogService';

interface PalestrasViewProps {
  onOpenBooking: (serviceId?: string) => void;
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

// 7 Marcas Parceiras / Clientes Atendidos por Bianca Tofoli
const CLIENT_LOGOS = [
  {
    name: 'SulAmérica Saúde',
    url: 'https://static.wixstatic.com/media/02c8e0_9faeeab290534345a6aaa65fddb10d0f~mv2.png'
  },
  {
    name: 'Grupo Fleury',
    url: 'https://static.wixstatic.com/media/02c8e0_aaf906445da54658b1fa405f95a96e77~mv2.png'
  },
  {
    name: 'a+ Medicina Diagnóstica',
    url: 'https://static.wixstatic.com/media/02c8e0_368973d7ca9543d88d89379497662314~mv2.png'
  },
  {
    name: 'Florescer',
    url: 'https://static.wixstatic.com/media/02c8e0_8af738fb419e424887681c32ca6a68a4~mv2.png'
  },
  {
    name: 'Cravo',
    url: 'https://static.wixstatic.com/media/02c8e0_deeebd7d569e49648f10569a657b530c~mv2.png'
  },
  {
    name: 'Hermes Pardini',
    url: 'https://static.wixstatic.com/media/02c8e0_0b8081b7c7c14335b43abbc6a3653930~mv2.png'
  },
  {
    name: 'Clínica Nossa Senhora das Graças',
    url: 'https://static.wixstatic.com/media/02c8e0_79bd2eb0deaf49888df17c53599c26a6~mv2.png'
  }
];

// Métricas & KPIs de Impacto Corporativo em formato conciso para linha única
const CORPORATE_METRICS = [
  {
    stat: '2x',
    title: 'Decisões sob Pressão',
    desc: 'Maior eficácia e equilíbrio analítico em cenários de alta complexidade.',
    source: 'Yale Center'
  },
  {
    stat: '+56%',
    title: 'Performance & Foco',
    desc: 'Até -75% de afastamentos por licenças e desgaste emocional.',
    source: 'Deloitte Insights'
  },
  {
    stat: '-30%',
    title: 'Ansiedade & Estresse',
    desc: 'Alívio perceptível com técnicas práticas de respiração e regulação.',
    source: 'APA (Psicologia)'
  },
  {
    stat: '58%',
    title: 'Sucesso Guiado por IE',
    desc: 'Inteligência emocional como principal preditor de liderança de alto nível.',
    source: 'TalentSmart'
  },
  {
    stat: '-Turnover',
    title: 'Retenção de Talentos',
    desc: 'Ambientes com segurança psicológica reduzem desligamentos voluntários.',
    source: 'Gallup'
  },
  {
    stat: '4x',
    title: 'Mais Engajamento',
    desc: 'Profissionais alinhados ao propósito geram resultados consistentes.',
    source: 'McKinsey'
  }
];

// 6 Momentos Estratégicos para linha única no desktop
const TIMING_REASONS = [
  {
    icon: Flame,
    title: 'Sobrecarga & Turnover',
    desc: 'Para estancar desgastes, ruídos de equipe e rotatividade.'
  },
  {
    icon: HeartPulse,
    title: 'Setembro Amarelo',
    desc: 'Conscientização profunda para prevenção ativa ao burnout.'
  },
  {
    icon: Briefcase,
    title: 'NR-1 & SIPAT',
    desc: 'Gestão de riscos psicossociais obrigatórios pelo PGR.'
  },
  {
    icon: Calendar,
    title: 'Convenções & Kickoff',
    desc: 'Energizar equipes e alinhar metas de início ou fechamento de ano.'
  },
  {
    icon: Users,
    title: 'Mês das Mulheres',
    desc: 'Liderança feminina, síndrome da impostora e autocuidado.'
  },
  {
    icon: Sparkles,
    title: 'Team Building',
    desc: 'Autoconhecimento prático para potencializar talentos.'
  }
];

// Repertório de Temas Especializados do PDF
const ADDITIONAL_THEMES = [
  {
    tag: 'COMUNICAÇÃO',
    title: 'A Imagem que Comunica',
    subtitle: 'Presença & Postura Não-Verbal',
    desc: 'Como transmitir credibilidade e segurança, alinhando a mensagem interna à percepção externa.'
  },
  {
    tag: 'LIDERANÇA',
    title: 'Coragem em Si',
    subtitle: 'Vencendo a Síndrome da Impostora',
    desc: 'Autonomia para lideranças assumirem novos desafios com firmeza e validação interna.'
  },
  {
    tag: 'PROPÓSITO',
    title: 'Propósito x Vocação',
    subtitle: 'Talentos & Metas da Empresa',
    desc: 'Conciliando vocações individuais com as metas e o crescimento da organização.'
  },
  {
    tag: 'EQUILÍBRIO',
    title: 'Autorregulação em Pressão',
    subtitle: 'Respiração Consciente & Foco',
    desc: 'Ancoragem física e mental imediata para manter a lucidez em tomadas de decisão sob tensão.'
  },
  {
    tag: 'CLIMA',
    title: 'Comunicação sem Ruído',
    subtitle: 'Empatia & Inteligência Relacional',
    desc: 'Construção de pontes colaborativas e eliminação de conflitos desnecessários entre áreas.'
  }
];

// Mosaico com os 7 Vídeos do YouTube em Linha Única
const YOUTUBE_VIDEOS = [
  {
    id: 'KMuJ2eIAZ2Q',
    title: 'Como Manter a Rotina?',
    duration: '07m43s',
    url: 'https://www.youtube.com/watch?v=KMuJ2eIAZ2Q'
  },
  {
    id: 'Zcn9Wcr7EaM',
    title: 'Como Lidar com Ansiedade?',
    duration: '07m08s',
    url: 'https://youtu.be/Zcn9Wcr7EaM'
  },
  {
    id: 'Xan_7ewnYPM',
    title: 'O que Cansa Emocionalmente?',
    duration: '05m41s',
    url: 'https://www.youtube.com/watch?v=Xan_7ewnYPM'
  },
  {
    id: '1cOzmlIYkBA',
    title: 'Autocuidado & Limites',
    duration: '06m15s',
    url: 'https://www.youtube.com/watch?v=1cOzmlIYkBA'
  },
  {
    id: '1pjYM2OwjU0',
    title: 'Burnout & Reconexão',
    duration: '08m12s',
    url: 'https://www.youtube.com/watch?v=1pjYM2OwjU0'
  },
  {
    id: 'skRzgdfUkM8',
    title: 'O que Impede de Mudar?',
    duration: '06m50s',
    url: 'https://www.youtube.com/watch?v=skRzgdfUkM8'
  },
  {
    id: 'FA4g-hi1IuU',
    title: 'Inteligência Emocional & Ciclos',
    duration: '09m20s',
    url: 'https://www.youtube.com/watch?v=FA4g-hi1IuU'
  }
];

// 10 Fotos Reais de Palestras organizadas para 2 linhas (5 por linha na largura total)
const GALLERY_PHOTOS = [
  {
    url: 'https://static.wixstatic.com/media/02c8e0_fe08bedd21184bf390fb985cae10f64f~mv2.jpeg',
    alt: 'Bianca Tofoli palestrando no palco'
  },
  {
    url: 'https://static.wixstatic.com/media/02c8e0_a13640d454f24a28aa319aff4da6d884~mv2.jpeg',
    alt: 'Encontro corporativo e conexão com a plateia'
  },
  {
    url: 'https://static.wixstatic.com/media/02c8e0_e81f0acbec8f4d0f81705da0870786e9~mv2.jpeg',
    alt: 'Vivência de relaxamento e respiração consciente'
  },
  {
    url: 'https://static.wixstatic.com/media/02c8e0_e4f2fc5649194eb98a6447eb737b0c1f~mv2.png',
    alt: 'Palestra com suporte audiovisual de apoio'
  },
  {
    url: 'https://static.wixstatic.com/media/02c8e0_45226c3678894dd28686198467fba683~mv2.png',
    alt: 'Dinâmica interativa com os participantes'
  },
  {
    url: 'https://static.wixstatic.com/media/02c8e0_380e873fc70146d7bb82d2fd025c3753~mv2.jpeg',
    alt: 'Encontro em auditório empresarial'
  },
  {
    url: 'https://static.wixstatic.com/media/02c8e0_cf41c479031f420eb8651aebe7d44e9b~mv2.jpeg',
    alt: 'Momento de acolhimento e troca ativa'
  },
  {
    url: 'https://static.wixstatic.com/media/02c8e0_451d9f2ed93849988c296896d5c302de~mv2.jpeg',
    alt: 'Workshop prático com lideranças de saúde'
  },
  {
    url: 'https://static.wixstatic.com/media/02c8e0_2d5939458116477fb9baac48e5f40050~mv2.jpeg',
    alt: 'Palestra sobre autoconhecimento e relações'
  },
  {
    url: 'https://static.wixstatic.com/media/02c8e0_45226c3678894dd28686198467fba683~mv2.png',
    alt: 'Equipe reunida em convenção'
  }
];

export const PalestrasView: React.FC<PalestrasViewProps> = ({ onOpenBooking }) => {
  // Os 3 workshops oficiais
  const coreLectures = CATALOG_PALESTRAS.slice(0, 3);

  const handleWhatsAppAction = (palestraId: string = 'palestras-corporativas') => {
    onOpenBooking(palestraId);
  };

  return (
    <div className="bg-[#FAF8F5] text-[#2B2566] min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden relative">
      
      {/* Elementos Cósmicos Decorativos Efémeros ao Fundo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-20 right-[-80px] w-96 h-96 rounded-full border border-[#F0B55E]/15 opacity-40 animate-celestial-orbit-slow" />
        <div className="absolute top-1/3 left-[-120px] w-[500px] h-[500px] rounded-full border border-[#8C987F]/10 opacity-50 animate-celestial-orbit-reverse" />
        <div className="absolute top-36 left-12 text-[#F0B55E]/40 text-xs animate-pulse">✦</div>
        <div className="absolute bottom-48 right-1/4 text-[#8C987F]/30 text-[10px]">★</div>
      </div>

      <div className="mx-auto max-w-7xl space-y-16 sm:space-y-20 relative z-10">
        
        {/* =========================================================================
            1. SEÇÃO ABERTA & UNIFICADA: CABEÇALHO + CONFORMIDADE NR-1 + EMPRESAS ATENDIDAS
            - Sem box escuro, sem tag pesada
            - Texto fluido e amplo na proporção total da tela
            - Integração harmônica com as marcas atendidas
            ========================================================================= */}
        <RevealOnScroll delayMs={50}>
          <div className="space-y-8 text-center">
            
            {/* Título Principal */}
            <div className="max-w-4xl mx-auto space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F] block">
                DESENVOLVIMENTO HUMANO & CORPORATIVO
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B2566] tracking-tight">
                Workshops, Vivências & Encontros
              </h1>
              
              {/* Linha-Ponto do Brand Guide */}
              <div className="flex items-center justify-center gap-3 py-1">
                <span className="w-12 h-px bg-[#2B2566]/20" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]" />
                <span className="w-20 h-px bg-[#2B2566]/20" />
              </div>

              <p className="text-sm sm:text-base md:text-lg text-[#423C7B] leading-relaxed font-normal max-w-3xl mx-auto">
                Experiências transformadoras conduzidas por <strong>Bianca Tofoli</strong> para convenções, congressos e empresas. Unindo mais de 10 anos de liderança em saúde, inteligência emocional e práticas humanizadas para alinhar pessoas, clareza e resultados.
              </p>
            </div>

            {/* Texto Aberto e Espalhado sobre Conformidade com a NR-1 */}
            <div className="max-w-5xl mx-auto pt-2 pb-4 text-center space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2B2566]">
                <ShieldCheck className="h-4 w-4 text-[#F0B55E]" />
                <span>Alinhamento Estratégico com a NR-1 & Riscos Psicossociais</span>
              </div>

              <p className="text-xs sm:text-sm md:text-[15px] text-[#534D6B] leading-relaxed">
                Com as atualizações da <strong>Norma Regulamentadora nº 1 (NR-1 / Portaria MTE nº 1.419/2024)</strong> e a <strong>Lei nº 14.831/2024 (Empresa Promotora da Saúde Mental)</strong>, a prevenção ativa contra o estresse crônico, burnout e sobrecarga emocional tornou-se prioritária no Programa de Gerenciamento de Riscos (PGR). Os encontros da Bianca atuam diretamente como capacitação preventiva e acolhedora, auxiliando os setores de RH, SESMT e Lideranças na promoção de segurança psicológica e cumprimento das exigências legais.
              </p>
            </div>

            {/* Empresas Atendidas Integradas Fluidamente na Mesma Seção */}
            <div className="pt-2 border-t border-[#EADBCC]/50 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                EMPRESAS & INSTITUIÇÕES QUE JÁ CONFIARAM NO TRABALHO
              </span>

              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-14 pt-1">
                {CLIENT_LOGOS.map((client, idx) => (
                  <div
                    key={idx}
                    className="h-10 sm:h-12 flex items-center justify-center transition-all duration-300 hover:scale-105"
                    title={client.name}
                  >
                    <img
                      src={client.url}
                      alt={client.name}
                      className="max-h-8 sm:max-h-10 w-auto object-contain filter drop-shadow-xs"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </RevealOnScroll>

        {/* =========================================================================
            2. WORKSHOPS OFICIAIS (3 BLOCOS NA MESMA LINHA NO DESKTOP)
            - 3 cards lado a lado (grid-cols-1 md:grid-cols-3)
            - Botão "Solicitar proposta" em linha única (whitespace-nowrap)
            ========================================================================= */}
        <RevealOnScroll delayMs={100}>
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                FORMATOS PRONTOS PARA SUA EMPRESA
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#2B2566]">
                Workshops Oficiais
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {coreLectures.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/95 backdrop-blur-xs rounded-3xl border border-[#EADBCC]/70 shadow-[0_14px_35px_rgba(43,37,102,0.04)] hover:shadow-[0_20px_45px_rgba(43,37,102,0.07)] transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Imagem 3D Centralizada */}
                    <div className="w-full aspect-square max-h-48 flex items-center justify-center p-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_20px_rgba(43,37,102,0.08)] transition-transform duration-500 hover:scale-105"
                        draggable={false}
                      />
                    </div>

                    {/* Duração & Investimento */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#8C987F] border-b border-[#EADBCC]/50 pb-2.5">
                      <span className="flex items-center gap-1 text-[#2B2566]">
                        <Clock className="h-3.5 w-3.5 text-[#F0B55E]" />
                        <span>{item.duration}</span>
                      </span>
                      <span>{item.priceText}</span>
                    </div>

                    {/* Título & Descrição */}
                    <div className="space-y-2">
                      <h3 className="font-heading text-xl font-bold text-[#2B2566] leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#534D6B] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Tópicos */}
                    {item.topics && (
                      <div className="space-y-1.5 pt-2 border-t border-[#EADBCC]/40">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2B2566] block">
                          TÓPICOS ABORDADOS:
                        </span>
                        <ul className="space-y-1 text-xs text-[#534D6B]">
                          {item.topics.slice(0, 3).map((topic, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-1.5">
                              <span className="text-[#F0B55E] font-bold mt-0.5">•</span>
                              <span className="leading-snug">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Botão Solicitar Proposta (Linha única garantida com whitespace-nowrap) */}
                  <div className="pt-5 mt-4 border-t border-[#EADBCC]/60">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppAction(item.id)}
                      className="w-full py-3 px-4 rounded-full bg-[#F0B55E] hover:bg-[#e0a64d] text-[#2B2566] font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 whitespace-nowrap flex-nowrap"
                    >
                      <MessageCircle className="h-4 w-4 shrink-0 fill-[#2B2566] text-[#2B2566]" />
                      <span className="whitespace-nowrap">Solicitar proposta</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            3. IMPACTO MENSURÁVEL (6 KPIS EM UMA ÚNICA LINHA NO DESKTOP)
            - Posicionado logo após os workshops
            - Textos menores e diretos, 6 colunas na mesma linha
            ========================================================================= */}
        <RevealOnScroll delayMs={120}>
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                EVIDÊNCIAS & RESULTADOS
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                Impacto Mensurável
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 items-stretch">
              {CORPORATE_METRICS.map((kpi, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 backdrop-blur-xs rounded-2xl border border-[#EADBCC]/60 p-4 shadow-[0_8px_20px_rgba(43,37,102,0.03)] hover:shadow-[0_12px_28px_rgba(43,37,102,0.06)] transition-all duration-300 flex flex-col justify-between text-center space-y-2"
                >
                  <div className="space-y-1">
                    <span className="font-heading text-3xl sm:text-4xl font-extrabold text-[#F0B55E] tracking-tight block">
                      {kpi.stat}
                    </span>
                    <h3 className="font-heading text-xs font-bold text-[#2B2566] leading-tight">
                      {kpi.title}
                    </h3>
                    <p className="text-[11px] text-[#534D6B] leading-tight pt-1">
                      {kpi.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#EADBCC]/40">
                    <span className="text-[9px] uppercase font-bold text-[#8C987F] block">
                      {kpi.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            4. MOMENTOS ESTRATÉGICOS: QUANDO CONTRATAR? (6 EM UMA ÚNICA LINHA NO DESKTOP)
            - Sem box branco de fundo
            - 6 cards compactos em linha única
            ========================================================================= */}
        <RevealOnScroll delayMs={140}>
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                MOMENTOS ESTRATÉGICOS
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                Quando Contratar um Encontro da Bianca?
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 items-stretch">
              {TIMING_REASONS.map((timing, tIdx) => {
                const IconComponent = timing.icon;
                return (
                  <div
                    key={tIdx}
                    className="p-4 rounded-2xl bg-white/80 border border-[#EADBCC]/60 space-y-2 text-center transition-all duration-300 hover:border-[#F0B55E]/60 hover:bg-white flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="w-9 h-9 mx-auto rounded-xl bg-[#F0B55E]/15 flex items-center justify-center text-[#2B2566]">
                        <IconComponent className="h-4 w-4 text-[#F0B55E]" />
                      </div>
                      <h3 className="font-heading text-xs font-bold text-[#2B2566] leading-tight">
                        {timing.title}
                      </h3>
                      <p className="text-[11px] text-[#534D6B] leading-snug">
                        {timing.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            5. REPERTÓRIO CORPORATIVO & MOSAICO DE VÍDEOS EXPANDIDO EM LINHA ÚNICA
            - Temas corporativos e vídeos integrados em uma única narrativa
            - Todos os 7 vídeos alinhados em linha única no desktop
            ========================================================================= */}
        <RevealOnScroll delayMs={160}>
          <div className="space-y-8">
            
            {/* Cabeçalho Integrado */}
            <div className="text-center space-y-1.5 max-w-3xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                REPERTÓRIO CORPORATIVO & CONTEÚDOS
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                Temas Especializados & Abordagens em Vídeo
              </h2>
              <p className="text-xs sm:text-sm text-[#423C7B]">
                Assuntos abordados pela Bianca em palestras e aprofundados em seu canal, prontos para compor o encontro da sua equipe.
              </p>
            </div>

            {/* Cards dos 5 Temas em Grid Suave */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {ADDITIONAL_THEMES.map((theme, thIdx) => (
                <div
                  key={thIdx}
                  className="bg-white/90 backdrop-blur-xs rounded-2xl border border-[#EADBCC]/60 p-4 shadow-[0_6px_18px_rgba(43,37,102,0.02)] hover:shadow-[0_10px_24px_rgba(43,37,102,0.05)] transition-all duration-300 flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C987F] block">
                      {theme.tag}
                    </span>
                    <h3 className="font-heading text-sm font-bold text-[#2B2566] leading-snug">
                      {theme.title}
                    </h3>
                    <h4 className="text-[11px] font-semibold text-[#F0B55E] leading-tight">
                      {theme.subtitle}
                    </h4>
                    <p className="text-[11px] text-[#534D6B] leading-tight pt-1">
                      {theme.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#EADBCC]/40">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppAction(theme.title)}
                      className="text-[11px] font-bold text-[#2B2566] hover:text-[#F0B55E] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Incluir no tema</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mosaico de Vídeos Expandido em Linha Única (7 vídeos no desktop) */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F] block text-center sm:text-left">
                ASSISTA AOS CONTEÚDOS COM A BIANCA NO YOUTUBE:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {YOUTUBE_VIDEOS.map((video, vIdx) => (
                  <a
                    key={vIdx}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-xl overflow-hidden border border-[#EADBCC]/60 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-black/10">
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
                          <Play className="h-3.5 w-3.5 fill-white translate-x-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/75 text-[9px] font-bold text-white">
                        {video.duration}
                      </span>
                    </div>

                    <div className="p-2 space-y-0.5">
                      <h4 className="font-heading text-[11px] font-bold text-[#2B2566] line-clamp-2 leading-tight group-hover:text-[#F0B55E] transition-colors">
                        {video.title}
                      </h4>
                      <span className="text-[9px] text-[#8C987F] flex items-center gap-1">
                        <ExternalLink className="h-2.5 w-2.5" />
                        <span>Assistir</span>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </RevealOnScroll>

        {/* =========================================================================
            6. SEÇÃO EM DESTAQUE: "VAMOS MONTAR JUNTOS?" + MOSAICO DE IMAGENS EM 2 LINHAS
            - Sem box branco de fundo, aberta e sofisticada
            - Mosaico de fotos reais ocupando exatamente 2 linhas (5 por linha) na largura total
            ========================================================================= */}
        <RevealOnScroll delayMs={180}>
          <div className="space-y-8 pt-4">
            
            {/* Cabeçalho Aberto e Imersivo */}
            <div className="max-w-3xl mx-auto text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#F0B55E] block">
                SOLUÇÃO SOB MEDIDA
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B2566] tracking-tight">
                Vamos Montar Juntos?
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[#423C7B] leading-relaxed">
                Desenhamos um roteiro exclusivo em cocriação com o seu RH ou Liderança, conectando as reais necessidades da equipe às diretrizes de saúde psicossocial da <strong>NR-1</strong>.
              </p>
            </div>

            {/* Mosaico de Fotos Reais da Bianca em Exatamente 2 Linhas na Largura Total */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {GALLERY_PHOTOS.map((photo, pIdx) => (
                  <div
                    key={pIdx}
                    className="relative overflow-hidden rounded-2xl group border border-[#EADBCC]/60 bg-black/5 shadow-xs hover:shadow-md transition-all duration-300 aspect-4/3 sm:aspect-square"
                  >
                    <img
                      src={photo.url}
                      alt={photo.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                      <span className="text-[10px] font-medium text-white/95 leading-tight">
                        {photo.alt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Final em Linha sem Box Fechado */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#EADBCC]/60">
              <div className="text-center sm:text-left space-y-0.5">
                <h4 className="font-heading text-lg sm:text-xl font-bold text-[#2B2566]">
                  Pronto para estruturar a vivência da sua equipe?
                </h4>
                <p className="text-xs text-[#534D6B]">
                  Fale com a Bianca no WhatsApp e receba uma proposta corporativa personalizada.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleWhatsAppAction('vamos-montar-juntos')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 whitespace-nowrap flex-nowrap shrink-0"
              >
                <MessageCircle className="h-4 w-4 fill-white" />
                <span className="whitespace-nowrap">MONTAR ENCONTRO VIA WHATSAPP</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </RevealOnScroll>

      </div>
    </div>
  );
};
