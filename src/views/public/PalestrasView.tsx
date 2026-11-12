/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /palestras (Encontros Corporativos & Portfólio Institucional)
 * 
 * Funcionalidades e Design:
 * - Fundo suave, luminoso e acolhedor (#FAF8F5).
 * - Sem logotipo no cabeçalho.
 * - Destaque de alto impacto para a NR-1 (Norma Regulamentadora 1 - Gestão de Riscos Psicossociais no Trabalho / Portaria MTE 1.419/2024 e Lei 14.831/2024).
 * - Seção de Marcas Parceiras / Clientes Atendidos com 7 logotipos oficiais transparentes.
 * - Seção de Métricas & Evidências Científicas (KPIs corporativos do PDF: Yale, Deloitte, APA, TalentSmart, Gallup, McKinsey).
 * - Banners horizontais empilhados com layout alternado para as palestras oficiais (WAAP, Respirar (A)calma, Autoconhecimento).
 * - Repertório de temas corporativos adicionais (Comunicação Assertiva, Coragem em Si, Propósito x Vocação, etc.).
 * - Segunda Seção Independente: "Vamos Montar Juntos?" para cocriação personalizada com o RH.
 * - Mosaico de Vídeos do YouTube (grid/linha com thumbnails e temas abordados por Bianca).
 * - Mosaico de Fotos Reais de Palestras e Vivências (galeria de impacto com fotos do palco, público e dinâmicas).
 * - Animação suave RevealOnScroll (efeito nuvem subindo ao scroll).
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

// Métricas & KPIs de Impacto Corporativo extraídos do PDF
const CORPORATE_METRICS = [
  {
    stat: '2x',
    title: 'Decisões Mais Eficazes sob Pressão',
    source: 'Yale Center for Emotional Intelligence',
    description: 'Líderes e colaboradores com inteligência emocional tomam decisões mais conscientes e assertivas diante de cenários complexos.'
  },
  {
    stat: '+56%',
    title: 'Aumento na Performance & Produtividade',
    source: 'Deloitte Insights',
    description: 'Empresas que investem em saúde mental e inteligência relacional reduzem em até 75% o afastamento por licenças médicas.'
  },
  {
    stat: '-30%',
    title: 'Redução de Ansiedade e Estresse',
    source: 'American Psychological Association (APA)',
    description: 'Práticas guiadas de autorregulação e respiração reduzem drasticamente sintomas de sobrecarga e esgotamento mental.'
  },
  {
    stat: '58%',
    title: 'Sucesso Profissional Guiado por IE',
    source: 'TalentSmart',
    description: 'A inteligência emocional é o preditor isolado mais relevante para desempenho de alto nível e liderança humanizada.'
  },
  {
    stat: '-Turnover',
    title: 'Retenção Estratégica de Talentos',
    source: 'Gallup',
    description: 'Ambientes psicologicamente seguros fortalecem o senso de pertencimento e reduzem significativamente a evasão voluntária de talentos.'
  },
  {
    stat: '4x',
    title: 'Maior Engajamento das Equipes',
    source: 'McKinsey & Company',
    description: 'Profissionais alinhados ao seu propósito individual e da organização entregam resultados 4 vezes mais consistentes.'
  }
];

// Momentos Estratégicos para Contratar (Quando Oferecer)
const TIMING_REASONS = [
  {
    icon: Flame,
    title: 'Sobrecarga & Turnover Alto',
    text: 'Quando a equipe apresenta sinais de esgotamento, conflitos frequentes de comunicação ou alta rotatividade.'
  },
  {
    icon: HeartPulse,
    title: 'Setembro Amarelo & Saúde Mental',
    text: 'Ações de conscientização com profundidade prática para prevenção ativa do burnout e promoção do bem-estar.'
  },
  {
    icon: Briefcase,
    title: 'Adequação à NR-1 e SIPAT',
    text: 'Cumprimento das exigências legais do Programa de Gerenciamento de Riscos (PGR) para mitigação de riscos psicossociais.'
  },
  {
    icon: Calendar,
    title: 'Convenções, Fechamento & Início de Ano',
    text: 'Palestras magnéticas para energizar equipes, celebrar conquistas e traçar rotas com clareza e sinergia.'
  },
  {
    icon: Users,
    title: 'Mês das Mulheres & Diversidade',
    text: 'Encontros especiais sobre liderança feminina, autonomia, superação da síndrome da impostora e autocuidado.'
  },
  {
    icon: Sparkles,
    title: 'Team Building & Liderança',
    text: 'Workshops imersivos de autoconhecimento para potencializar os talentos únicos de cada colaborador.'
  }
];

// Temas do Repertório Corporativo Adicional do PDF
const ADDITIONAL_THEMES = [
  {
    tag: 'COMUNICAÇÃO & RELACIONAMENTO',
    title: 'A Imagem que Comunica',
    subtitle: 'Presença, Postura e Comunicação Não-Verbal',
    desc: 'Como nossa postura e expressão transmitem credibilidade e segurança, alinhando a mensagem interna à percepção externa.'
  },
  {
    tag: 'LIDERANÇA & AUTONOMIA',
    title: 'Coragem em Si',
    subtitle: 'Superando a Síndrome da Impostora',
    desc: 'Estratégias práticas para lideranças e profissionais reconhecerem seu valor, superando inseguranças e assumindo novos desafios com solidez.'
  },
  {
    tag: 'CARREIRA & ENGAJAMENTO',
    title: 'Propósito x Vocação',
    subtitle: 'Alinhando Talentos aos Resultados Corporativos',
    desc: 'Um olhar lúcido sobre como conciliar vocações pessoais às metas da empresa, gerando entusiasmo real no cotidiano.'
  },
  {
    tag: 'EQUILÍBRIO & ALTA PRESSÃO',
    title: 'Autorregulação em Alta Pressão',
    subtitle: 'Biofeedback, Respiração Consciente e Foco',
    desc: 'Técnicas imediatas de ancoragem física e mental para manter a clareza analítica em momentos de crise e tomada de decisão.'
  },
  {
    tag: 'CLIMA ORGANIZACIONAL',
    title: 'Comunicação Assertiva sem Ruído',
    subtitle: 'Inteligência Relacional e Empatia Funcional',
    desc: 'Eliminando atritos e interpretações distorcidas entre setores, construindo pontes de colaboração produtiva e transparente.'
  }
];

// Mosaico de Vídeos do YouTube de Bianca Tofoli
const YOUTUBE_VIDEOS = [
  {
    id: 'KMuJ2eIAZ2Q',
    title: 'Como Manter a Rotina com Leveza?',
    duration: '07m43s',
    url: 'https://www.youtube.com/watch?v=KMuJ2eIAZ2Q'
  },
  {
    id: 'Zcn9Wcr7EaM',
    title: 'Como Lidar com a Ansiedade no Dia a Dia?',
    duration: '07m08s',
    url: 'https://youtu.be/Zcn9Wcr7EaM'
  },
  {
    id: 'Xan_7ewnYPM',
    title: 'O que Realmente nos Cansa Emocionalmente?',
    duration: '05m41s',
    url: 'https://www.youtube.com/watch?v=Xan_7ewnYPM'
  },
  {
    id: '1cOzmlIYkBA',
    title: 'Autocuidado e Limites na Prática Profissional',
    duration: '06m15s',
    url: 'https://www.youtube.com/watch?v=1cOzmlIYkBA'
  },
  {
    id: '1pjYM2OwjU0',
    title: 'Burnout, Sobrecarga e Reconexão Interior',
    duration: '08m12s',
    url: 'https://www.youtube.com/watch?v=1pjYM2OwjU0'
  },
  {
    id: 'skRzgdfUkM8',
    title: 'O que nos Impede de Mudar Nossos Padrões?',
    duration: '06m50s',
    url: 'https://www.youtube.com/watch?v=skRzgdfUkM8'
  },
  {
    id: 'FA4g-hi1IuU',
    title: 'Inteligência Emocional, Ciclos e Transformação',
    duration: '09m20s',
    url: 'https://www.youtube.com/watch?v=FA4g-hi1IuU'
  }
];

// 10 Fotos Reais de Palestras, Vivências e Encontros Conduzidos por Bianca Tofoli
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
    alt: 'Palestra com slides e material visual de apoio'
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
    alt: 'Momento de troca e escuta ativa'
  },
  {
    url: 'https://static.wixstatic.com/media/02c8e0_451d9f2ed93849988c296896d5c302de~mv2.jpeg',
    alt: 'Workshop prático com equipes de saúde e liderança'
  },
  {
    url: 'https://static.wixstatic.com/media/02c8e0_2d5939458116477fb9baac48e5f40050~mv2.jpeg',
    alt: 'Palestra sobre inteligência relacional e autoconhecimento'
  }
];

export const PalestrasView: React.FC<PalestrasViewProps> = ({ onOpenBooking }) => {
  // As 3 primeiras palestras oficiais do catálogo (excluindo a 4ª que virou a seção 'Vamos Montar Juntos')
  const coreLectures = CATALOG_PALESTRAS.slice(0, 3);

  const handleWhatsAppAction = (palestraId: string = 'palestras-corporativas') => {
    onOpenBooking(palestraId);
  };

  return (
    <div className="bg-[#FAF8F5] text-[#2B2566] min-h-screen py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden relative">
      
      {/* Elementos Cósmicos Decorativos Efémeros ao Fundo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-20 right-[-80px] w-96 h-96 rounded-full border border-[#F0B55E]/15 opacity-40 animate-celestial-orbit-slow" />
        <div className="absolute top-1/3 left-[-120px] w-[500px] h-[500px] rounded-full border border-[#8C987F]/10 opacity-50 animate-celestial-orbit-reverse" />
        <div className="absolute top-36 left-12 text-[#F0B55E]/40 text-xs animate-pulse">✦</div>
        <div className="absolute bottom-48 right-1/4 text-[#8C987F]/30 text-[10px]">★</div>
        <div className="absolute bottom-1/4 left-1/3 text-[#F0B55E]/30 text-xs">✦</div>
      </div>

      <div className="mx-auto max-w-5xl space-y-12 sm:space-y-16 lg:space-y-20 relative z-10">
        
        {/* =========================================================================
            1. HEADER INSTITUCIONAL (SEM LOGO, MAIS LEVE E ELEGANTE)
            ========================================================================= */}
        <RevealOnScroll delayMs={50}>
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F] block">
              DESENVOLVIMENTO HUMANO & CORPORATIVO
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B2566] tracking-tight">
              Palestras, Vivências & Encontros
            </h1>
            
            {/* Linha-Ponto do Brand Guide */}
            <div className="flex items-center justify-center gap-3 py-1">
              <span className="w-10 h-px bg-[#2B2566]/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]" />
              <span className="w-16 h-px bg-[#2B2566]/20" />
            </div>

            <p className="text-xs sm:text-sm md:text-[15px] text-[#423C7B] leading-relaxed font-normal">
              Experiências magnéticas e transformadoras conduzidas por Bianca Tofoli para convenções, empresas e lideranças. Unindo mais de 10 anos de gestão de equipes na área da saúde, inteligência emocional e práticas humanizadas para alinhar pessoas, clareza e resultados.
            </p>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            2. DESTAQUE NR-1: GESTÃO DE RISCOS PSICOSSOCIAIS NO TRABALHO
            ========================================================================= */}
        <RevealOnScroll delayMs={100}>
          <div className="bg-gradient-to-br from-[#2B2566] to-[#1C1844] text-white rounded-[28px] sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(43,37,102,0.12)] border border-[#F0B55E]/20 relative overflow-hidden">
            {/* Brilho decorativo sutil */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#F0B55E]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-8 space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0B55E]/20 border border-[#F0B55E]/30 text-[#F0B55E] text-[11px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Adequação Legal & Saúde Corporativa</span>
                </div>
                
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                  Conformidade com a <span className="text-[#F0B55E]">NR-1</span> & Prevenção de Riscos Psicossociais
                </h2>

                <p className="text-xs sm:text-sm text-[#DAD2C4] leading-relaxed font-normal">
                  Com as atualizações da <strong>Norma Regulamentadora nº 1 (NR-1)</strong> pelo Ministério do Trabalho e Emprego (Portaria MTE nº 1.419/2024) e as diretrizes da <strong>Lei nº 14.831/2024 (Empresa Promotora da Saúde Mental)</strong>, a gestão e mitigação de <em>riscos psicossociais</em> (estresse crônico, sobrecarga, burnout e relações interpessoais) tornaram-se obrigações prioritárias no Programa de Gerenciamento de Riscos (PGR).
                </p>

                <p className="text-xs sm:text-sm text-[#DAD2C4]/90 leading-relaxed font-normal">
                  As palestras e vivências de Bianca Tofoli atuam diretamente como <strong>intervenção preventiva e educativa</strong>, apoiando os setores de RH, SESMT e Lideranças no cumprimento dessas normas com impacto genuíno na segurança psicológica e bem-estar dos colaboradores.
                </p>
              </div>

              <div className="lg:col-span-4 bg-white/5 backdrop-blur-xs rounded-2xl p-5 border border-white/10 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F0B55E] block">
                  COMO APOIAMOS SUA EMPRESA:
                </span>
                <ul className="space-y-2 text-xs text-white/90">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5" />
                    <span>Redução de riscos de autuações e passivos trabalhistas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5" />
                    <span>Diminuição comprovada de afastamentos por burnout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5" />
                    <span>Pontuação para o Certificado de Empresa Promotora da Saúde Mental</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5" />
                    <span>Capacitação de líderes para identificação precoce de esgotamento</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            3. MARCAS PARCEIRAS / EMPRESAS QUE JÁ CONFIARAM NO TRABALHO
            ========================================================================= */}
        <RevealOnScroll delayMs={150}>
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                CONFIANÇA & RELEVÂNCIA
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#2B2566]">
                Empresas & Instituições Atendidas
              </h3>
              <p className="text-xs sm:text-sm text-[#423C7B] max-w-xl mx-auto">
                Organizações de referência em saúde, medicina diagnóstica e serviços que transformaram a relação de suas equipes com as soluções de Bianca Tofoli.
              </p>
            </div>

            {/* Grid Elegante de Logos com Fundo Branco Transparente e Efeito Hover */}
            <div className="bg-white/80 backdrop-blur-xs rounded-[28px] sm:rounded-3xl border border-[#EADBCC]/60 p-6 sm:p-8 shadow-[0_10px_30px_rgba(43,37,102,0.03)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6 sm:gap-8 items-center justify-items-center">
                {CLIENT_LOGOS.map((client, idx) => (
                  <div
                    key={idx}
                    className="w-full h-16 sm:h-20 flex items-center justify-center p-2 rounded-xl transition-all duration-300 hover:scale-110"
                    title={client.name}
                  >
                    <img
                      src={client.url}
                      alt={client.name}
                      className="max-h-12 sm:max-h-14 max-w-full object-contain filter drop-shadow-xs transition-opacity duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            4. MÉTRICAS, KPIS & RESULTADOS COMPROVADOS (DADOS DO PDF)
            ========================================================================= */}
        <RevealOnScroll delayMs={200}>
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                IMPACTO MENSURÁVEL
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                Evidências & Retorno sobre o Desenvolvimento Humano
              </h2>
              <p className="text-xs sm:text-sm text-[#423C7B] max-w-2xl mx-auto">
                Pesquisas dos principais institutos globais revelam como a regulação emocional e o bem-estar impulsionam diretamente o resultado do negócio.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {CORPORATE_METRICS.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 backdrop-blur-xs rounded-2xl border border-[#EADBCC]/60 p-6 shadow-[0_12px_32px_rgba(43,37,102,0.03)] hover:shadow-[0_16px_40px_rgba(43,37,102,0.06)] transition-all duration-300 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="font-heading text-4xl sm:text-5xl font-extrabold text-[#F0B55E] tracking-tight block">
                      {item.stat}
                    </span>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-[#2B2566] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#534D6B] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#EADBCC]/40">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C987F]">
                      Fonte: {item.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            5. BANNERS HORIZONTAIS EMPILHADOS: PALESTRAS OFICIAIS
            1ª Palestra: Imagem à DIREITA
            2ª Palestra: Imagem à ESQUERDA
            3ª Palestra: Imagem à DIREITA
            ========================================================================= */}
        <div className="space-y-8 sm:space-y-12">
          <RevealOnScroll delayMs={220}>
            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                FORMATOS CONSAGRADOS
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#2B2566]">
                Palestras & Workshops Oficiais
              </h2>
              <p className="text-xs sm:text-sm text-[#423C7B] max-w-xl mx-auto">
                Estruturas modulares, personalizáveis para eventos presenciais em todo o Brasil ou transmissões online ao vivo.
              </p>
            </div>
          </RevealOnScroll>

          {coreLectures.map((item, index) => {
            const isImageOnRight = index % 2 === 0;

            return (
              <RevealOnScroll key={item.id} delayMs={100 + index * 60}>
                <div className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl lg:rounded-[32px] border border-[#EADBCC]/60 shadow-[0_16px_40px_rgba(43,37,102,0.04)] hover:shadow-[0_20px_50px_rgba(43,37,102,0.07)] transition-all duration-500 overflow-hidden p-6 sm:p-8 lg:p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
                    
                    {/* Imagem 3D Oficial */}
                    <div
                      className={`lg:col-span-5 flex items-center justify-center ${
                        isImageOnRight ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                      }`}
                    >
                      <div className="w-48 sm:w-60 md:w-68 lg:w-76 aspect-square flex items-center justify-center p-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_24px_rgba(43,37,102,0.1)] transition-transform duration-500 hover:scale-105"
                          draggable={false}
                        />
                      </div>
                    </div>

                    {/* Conteúdo Textual, Tópicos e Botão */}
                    <div
                      className={`lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left ${
                        isImageOnRight ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-bold">
                          <span className="inline-flex items-center gap-1.5 text-[#2B2566] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#EADBCC]">
                            <Clock className="h-3.5 w-3.5 text-[#F0B55E]" />
                            <span>DURAÇÃO: {item.duration}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[#8C987F] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#EADBCC]">
                            <span>INVESTIMENTO: {item.priceText}</span>
                          </span>
                        </div>

                        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566] leading-snug tracking-tight">
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed font-normal">
                          {item.description}
                        </p>
                      </div>

                      {/* Tópicos Abordados */}
                      {item.topics && item.topics.length > 0 && (
                        <div className="space-y-2 pt-1 border-t border-[#EADBCC]/50 text-left">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#2B2566]">
                            O QUE SERÁ ABORDADO:
                          </p>
                          <ul className="space-y-1.5 text-xs text-[#534D6B]">
                            {item.topics.map((topic, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-[#F0B55E] shrink-0 mt-0.5" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Botão de Solicitação via WhatsApp */}
                      <div className="pt-4 border-t border-[#EADBCC]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-[11px] text-[#8C987F] text-center sm:text-left">
                          Formatos adaptáveis: Presencial em todo o Brasil ou Online ao Vivo.
                        </span>

                        <button
                          type="button"
                          onClick={() => handleWhatsAppAction(item.id)}
                          className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#F0B55E] hover:bg-[#e0a64d] text-[#2B2566] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                        >
                          <MessageCircle className="h-4 w-4 fill-[#2B2566] text-[#2B2566]" />
                          <span>SOLICITAR PROPOSTA</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* =========================================================================
            6. QUANDO OFERECER (MOMENTOS ESTRATÉGICOS DO RH & LIDERANÇAS)
            ========================================================================= */}
        <RevealOnScroll delayMs={240}>
          <div className="bg-white/80 backdrop-blur-xs rounded-[28px] sm:rounded-3xl border border-[#EADBCC]/60 p-6 sm:p-8 lg:p-10 shadow-[0_12px_36px_rgba(43,37,102,0.03)] space-y-6">
            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                MOMENTOS ESTRATÉGICOS
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                Quando Contratar um Encontro da Bianca Tofoli?
              </h2>
              <p className="text-xs sm:text-sm text-[#423C7B] max-w-xl mx-auto">
                Soluções desenhadas para momentos decisivos do ciclo corporativo e da gestão de pessoas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TIMING_REASONS.map((timing, tIdx) => {
                const IconComponent = timing.icon;
                return (
                  <div
                    key={tIdx}
                    className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EADBCC]/50 space-y-2.5 transition-all duration-300 hover:border-[#F0B55E]/60 hover:bg-white"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F0B55E]/15 flex items-center justify-center text-[#2B2566]">
                      <IconComponent className="h-5 w-5 text-[#F0B55E]" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-[#2B2566]">
                      {timing.title}
                    </h3>
                    <p className="text-xs text-[#534D6B] leading-relaxed">
                      {timing.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            7. TEMAS ADICIONAIS DO REPERTÓRIO CORPORATIVO (DO PDF)
            ========================================================================= */}
        <RevealOnScroll delayMs={260}>
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                REPERTÓRIO CORPORATIVO
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                Temas Especializados para o seu Evento
              </h2>
              <p className="text-xs sm:text-sm text-[#423C7B] max-w-xl mx-auto">
                Conteúdos moduláveis que podem ser integrados a palestras de 1h a 2h ou workshops práticos de imersão.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {ADDITIONAL_THEMES.map((theme, thIdx) => (
                <div
                  key={thIdx}
                  className="bg-white/90 backdrop-blur-xs rounded-2xl border border-[#EADBCC]/60 p-5 shadow-[0_8px_24px_rgba(43,37,102,0.03)] hover:shadow-[0_12px_30px_rgba(43,37,102,0.06)] transition-all duration-300 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F] block">
                      {theme.tag}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-[#2B2566] leading-snug">
                      {theme.title}
                    </h3>
                    <h4 className="text-xs font-semibold text-[#F0B55E]">
                      {theme.subtitle}
                    </h4>
                    <p className="text-xs text-[#534D6B] leading-relaxed pt-1">
                      {theme.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#EADBCC]/40">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppAction(theme.title)}
                      className="text-xs font-bold text-[#2B2566] hover:text-[#F0B55E] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Incluir no briefing</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            8. SEGUNDA SEÇÃO INDEPENDENTE: "VAMOS MONTAR JUNTOS?"
            - Cocriação sob medida com o RH
            - Destaque NR-1 e Propósito
            - Grid/Linha com Mosaico de Vídeos do YouTube
            - Mosaico de Fotos de Palestras Reais da Bianca
            ========================================================================= */}
        <RevealOnScroll delayMs={280}>
          <div className="bg-gradient-to-br from-[#FCFAF7] via-white to-[#F7F2EC] rounded-[32px] sm:rounded-[36px] border border-[#EADBCC] p-6 sm:p-10 lg:p-12 shadow-[0_24px_60px_rgba(43,37,102,0.06)] space-y-10 sm:space-y-12">
            
            {/* Cabeçalho da Seção 2 */}
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#F0B55E] block">
                SOLUÇÃO PERSONALIZADA PARA SUA EMPRESA
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B2566] tracking-tight">
                Vamos Montar Juntos?
              </h2>
              
              <div className="flex items-center justify-center gap-3 py-1">
                <span className="w-10 h-px bg-[#2B2566]/20" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]" />
                <span className="w-16 h-px bg-[#2B2566]/20" />
              </div>

              <p className="text-xs sm:text-sm md:text-base text-[#423C7B] leading-relaxed font-normal">
                Cada empresa possui sua cultura, seus desafios de relacionamento e seu momento de negócio. Bianca Tofoli atua em cocriação direta com o RH e líderes para desenhar um roteiro exclusivo, alinhando os objetivos estratégicos da organização às diretrizes de saúde psicossocial da <strong>NR-1</strong>.
              </p>
            </div>

            {/* Como Funciona a Cocriação */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white border border-[#EADBCC]/60 space-y-2 text-center sm:text-left">
                <span className="text-xl font-heading font-extrabold text-[#F0B55E]">01. Diagnóstico</span>
                <h3 className="font-heading text-base font-bold text-[#2B2566]">Escuta Ativa do RH</h3>
                <p className="text-xs text-[#534D6B] leading-relaxed">
                  Alinhamos as dores reais da equipe, momentos de pressão, histórico recente e metas de engajamento do encontro.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#EADBCC]/60 space-y-2 text-center sm:text-left">
                <span className="text-xl font-heading font-extrabold text-[#F0B55E]">02. Roteiro Customizado</span>
                <h3 className="font-heading text-base font-bold text-[#2B2566]">Linguagem & Dinâmicas</h3>
                <p className="text-xs text-[#534D6B] leading-relaxed">
                  Integração de dinâmicas práticas, reflexões profundas e embasamento técnico adaptado ao perfil do público.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#EADBCC]/60 space-y-2 text-center sm:text-left">
                <span className="text-xl font-heading font-extrabold text-[#F0B55E]">03. Sustentação</span>
                <h3 className="font-heading text-base font-bold text-[#2B2566]">Impacto Contínuo & NR-1</h3>
                <p className="text-xs text-[#534D6B] leading-relaxed">
                  Entrega de ferramentas aplicáveis no dia a dia do trabalho para perenizar o bem-estar e a segurança psicológica.
                </p>
              </div>
            </div>

            {/* ---------------------------------------------------------------------
                MOSAICO DE VÍDEOS DO CANAL DE BIANCA TOFOLI (LINHA / GRID COM PLAY)
                --------------------------------------------------------------------- */}
            <div className="space-y-5 pt-4 border-t border-[#EADBCC]/60">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F] block">
                    CONHEÇA A DIDÁTICA & LINGUAGEM
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#2B2566]">
                    Mosaico de Conteúdos & Vídeos
                  </h3>
                </div>
                <span className="text-xs text-[#534D6B]">
                  Assista a alguns temas abordados por Bianca Tofoli no YouTube
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {YOUTUBE_VIDEOS.map((video, vIdx) => (
                  <a
                    key={vIdx}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-2xl overflow-hidden border border-[#EADBCC]/60 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-black/10">
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="h-4 w-4 fill-white translate-x-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/75 text-[10px] font-bold text-white">
                        {video.duration}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <h4 className="font-heading text-xs font-bold text-[#2B2566] line-clamp-2 leading-snug group-hover:text-[#F0B55E] transition-colors">
                        {video.title}
                      </h4>
                      <span className="text-[10px] text-[#8C987F] flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        <span>Ver no YouTube</span>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* ---------------------------------------------------------------------
                MOSAICO DE FOTOS REAIS DE PALESTRAS (GALERIA DE VIVÊNCIAS)
                --------------------------------------------------------------------- */}
            <div className="space-y-5 pt-4 border-t border-[#EADBCC]/60">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F] block">
                    GALERIA DE VIVÊNCIAS
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#2B2566]">
                    Bianca Tofoli no Palco & com as Equipes
                  </h3>
                </div>
                <span className="text-xs text-[#534D6B]">
                  Registros de palestras, dinâmicas e convenções presenciais
                </span>
              </div>

              {/* Mosaico Responsivo de Imagens com Estilo Galeria */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {GALLERY_PHOTOS.map((photo, pIdx) => {
                  // Destaca algumas fotos no mosaico (ex: 1ª e 6ª ocupam mais espaço)
                  const isLarge = pIdx === 0 || pIdx === 5;
                  return (
                    <div
                      key={pIdx}
                      className={`relative overflow-hidden rounded-2xl group border border-[#EADBCC]/50 bg-black/5 shadow-xs hover:shadow-md transition-all duration-300 ${
                        isLarge ? 'col-span-2 row-span-1 sm:row-span-2 aspect-4/3 sm:aspect-square' : 'aspect-square'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <span className="text-[11px] font-medium text-white/95">
                          {photo.alt}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Final de Cocriação via WhatsApp */}
            <div className="pt-6 border-t border-[#EADBCC] flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-2xl border">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-heading text-xl font-bold text-[#2B2566]">
                  Pronto para transformar a experiência da sua equipe?
                </h4>
                <p className="text-xs sm:text-sm text-[#423C7B]">
                  Converse diretamente com Bianca Tofoli e receba uma proposta corporativa alinhada à NR-1 e às necessidades do seu evento.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleWhatsAppAction('vamos-montar-juntos')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shrink-0"
              >
                <MessageCircle className="h-5 w-5 fill-white" />
                <span>MONTAR ENCONTRO VIA WHATSAPP</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </RevealOnScroll>

      </div>
    </div>
  );
};
