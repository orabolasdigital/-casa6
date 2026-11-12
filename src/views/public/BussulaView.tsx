/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /bussola & /bussola-guia
 * Família de Bússolas Astrológicas Personalizadas em PDF
 * 
 * Posicionamento e Conteúdo Oficial:
 * - O céu aponta caminhos. O autoconhecimento ajuda você a escolher a direção.
 * - Família de Bússolas: Profissional, Amorosa, Pessoal (Mensal/Anual) e Materna (Em Construção).
 * - Todas as bússolas por valor único de R$ 47,00 cada.
 * - Estudos personalizados em PDF gerados a partir do mapa natal com orientações práticas para a vida real.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Sparkles,
  Smartphone,
  Lock,
  ShieldCheck,
  ArrowRight,
  Star,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Check,
  Briefcase,
  Heart,
  CalendarDays,
  Baby,
  FileText
} from 'lucide-react';
import { BirthData } from '../../types';
import { MercadoPagoCheckoutModal } from '../../components/common/MercadoPagoCheckoutModal';
import { trackAnalyticsEvent } from '../../services/analytics';
import { lookupCRMContactByEmail } from '../../services/formValidation';

interface BussulaViewProps {
  onOpenBooking?: (serviceId?: string) => void;
}

/**
 * Animação suave ao rolar a página
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

export const BussulaView: React.FC<BussulaViewProps> = () => {
  // Estado da Bússola Selecionada no Formulário (Todas R$ 47,00 cada)
  const [selectedBussola, setSelectedBussola] = useState<'profissional' | 'amorosa' | 'pessoal' | 'pessoal-anual'>('profissional');

  // Dados Cadastrais e Astrais
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthHour, setBirthHour] = useState('');
  const [birthMinute, setBirthMinute] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Catálogo Oficial das Bússolas da Linha
  const bussolasCatalog = [
    {
      id: 'profissional' as const,
      name: 'Bússola Profissional',
      tag: 'CARREIRA & VOCAÇÃO',
      price: 47.0,
      iconEmoji: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@latest/assets/Briefcase/3D/briefcase_3d.png',
      subtitle: 'Descubra seus talentos, sua vocação e a maneira como você se relaciona com o trabalho.',
      question: 'Você já se perguntou qual ambiente profissional combina com você? Quais são seus talentos naturais? Ou por que determinados comportamentos e emoções aparecem na sua vida profissional?',
      description: 'A Bússola Profissional é um estudo astrológico personalizado que investiga sua relação com o trabalho, suas habilidades, vocações e possibilidades de desenvolvimento de carreira através do seu mapa astral.',
      learnings: [
        'Seus principais talentos e potenciais profissionais.',
        'Suas aptidões, vocações e possibilidades de realização.',
        'Como você lida emocionalmente com o trabalho e os desafios.',
        'Seus padrões de comportamento no ambiente corporativo e profissional.',
        'Qual estilo de rotina, organização e produtividade favorece seu desenvolvimento.',
        'Quais caminhos profissionais estão mais alinhados à sua verdadeira natureza.'
      ],
      closing: 'Mais do que descobrir o que fazer profissionalmente, é entender como você funciona no trabalho e quais caminhos fazem sentido para você.'
    },
    {
      id: 'amorosa' as const,
      name: 'Bússola Amorosa',
      tag: 'AMOR & RELACIONAMENTOS',
      price: 47.0,
      iconEmoji: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@latest/assets/Red%20heart/3D/red_heart_3d.png',
      subtitle: 'Entenda sua linguagem do amor, suas necessidades emocionais e a forma como você constrói relacionamentos.',
      question: 'Cada pessoa tem uma maneira particular de amar, demonstrar afeto, criar vínculos e se sentir amada. Mas será que você conhece a sua?',
      description: 'Estudo astrológico personalizado que investiga sua maneira de viver o amor, seus padrões afetivos e o tipo de parceria que favorece suas relações, analisando Vênus, Lua, Casa 7 e aspectos do seu mapa.',
      learnings: [
        'Como você demonstra amor, carinho e afeto.',
        'O que faz você se sentir amada(o) e emocionalmente acolhida(o).',
        'Quais são suas principais necessidades emocionais nos relacionamentos.',
        'Como você se comporta diante da intimidade, entrega e vínculos afetivos.',
        'Seus padrões, desafios e potencialidades na vida amorosa.',
        'Quais características podem favorecer uma parceria saudável e compatível.'
      ],
      closing: 'Não se trata de descobrir quem é a pessoa ideal, mas de reconhecer quem você é quando ama, o que precisa em uma relação e como construir vínculos mais conscientes.'
    },
    {
      id: 'pessoal' as const,
      name: 'Bússola Pessoal',
      tag: 'ORIENTAÇÃO MENSAL',
      price: 47.0,
      iconEmoji: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@latest/assets/Spiral%20calendar/3D/spiral_calendar_3d.png',
      subtitle: 'Uma orientação astrológica para cada mês da sua vida.',
      question: 'O céu está em constante movimento. Cada mês traz novos temas, oportunidades, desafios e convites ao autoconhecimento. Como você se orienta?',
      description: 'Orientação astrológica mensal e personalizada, baseada nos trânsitos astronômicos do momento em relação ao seu mapa natal, com leitura direcionada à sua própria jornada.',
      learnings: [
        'Primeira quinzena: os principais temas, movimentos e assuntos em foco.',
        'Segunda quinzena: o que ganha destaque e comportamentos a observar.',
        'Orientações práticas para o mês: lidar com desafios e aproveitar oportunidades.',
        'Dias favoráveis: períodos que favorecem iniciativas, conversas e decisões.',
        'Dias de atenção: momentos que pedem mais consciência, calma e paciência.',
        'Palavra-guia do mês: uma chave para acompanhar suas escolhas no período.'
      ],
      closing: 'Não é sobre tentar controlar o futuro. É sobre ter mais consciência para viver o presente.'
    }
  ];

  // FAQ Oficial das Bússolas Astrológicas
  const faqs = [
    {
      q: 'O QUE SÃO AS BÚSSOLAS ASTROLÓGICAS E COMO SÃO ENTREGUES?',
      a: 'As Bússolas Astrológicas são materiais personalizados em PDF de alta resolução, desenvolvidos a partir do seu mapa de nascimento individual. Você recebe o documento diagramado diretamente no seu WhatsApp e ele fica salvo com acesso vitalício na sua Área de Membros.'
    },
    {
      q: 'QUAL É O VALOR DE CADA BÚSSOLA?',
      a: 'Todas as Bússolas da Casa 6 têm o valor fixo de R$ 47,00 cada. Você escolhe a área da vida que deseja explorar (Profissional, Amorosa ou Pessoal Mensal) de acordo com o seu momento atual.'
    },
    {
      q: 'POR QUE O HORÁRIO EXATO DE NASCIMENTO É OBRIGATÓRIO?',
      a: 'Ao contrário de horóscopos genéricos ou interpretações padronizadas, cada Bússola analisa os graus exatos do seu ascendente, casas astrológicas e planetas (como Vênus, Lua e Casa 10). Sem a hora e minuto precisos, o cálculo perde sua acurácia astronômica.'
    },
    {
      q: 'QUAL A DIFERENÇA ENTRE A BÚSSOLA PROFISSIONAL, AMOROSA E PESSOAL?',
      a: 'A Bússola Profissional foca em talentos, vocação e rotina de trabalho. A Bússola Amorosa investiga sua forma de amar, Vênus, Lua e parcerias saudáveis na Casa 7. A Bússola Pessoal traz a previsão e orientação prática dos seus ciclos mês a mês (quinzenas, dias favoráveis e dias de atenção).'
    },
    {
      q: 'POSSO CONTRATAR MAIS DE UMA BÚSSOLA?',
      a: 'Com certeza! Muitas pessoas contratam a Profissional e a Amorosa juntas para um mergulho profundo nessas duas áreas essenciais, ou combinam uma temática específica com o acompanhamento mensal da Bússola Pessoal.'
    },
    {
      q: 'COMO FUNCIONA A BÚSSOLA PESSOAL ANUAL?',
      a: 'No plano anual da Bússola Pessoal, você recebe 12 edições (uma para cada mês do ano) por R$ 47,00/mês, acompanhando todos os ciclos astrológicos da sua vida com tranquilidade e planejamento contínuo.'
    },
    {
      q: 'COMO E QUANDO ACESSO A ÁREA DE MEMBROS?',
      a: 'Imediatamente após a aprovação da transação pelo Mercado Pago, você recebe os dados de acesso por e-mail e WhatsApp. Na plataforma, você pode consultar todos os seus estudos e relatórios a qualquer momento.'
    }
  ];

  const handleSelectBussolaAndScroll = (id: 'profissional' | 'amorosa' | 'pessoal' | 'pessoal-anual') => {
    setSelectedBussola(id);
    const el = document.getElementById('secao-contratacao-bussola');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName || !lastName || !email || !whatsapp || !birthDay || !birthMonth || !birthYear || !birthHour || !birthMinute || !city || !state) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios do mapa natal para o cálculo astronômico personalizado.');
      return;
    }

    trackAnalyticsEvent('checkout_start', { service: 'bussulas-astrologicas', bussola: selectedBussola });
    setCheckoutOpen(true);
  };

  const handleEmailBlur = async () => {
    if (!email || !email.includes('@')) return;
    try {
      const existing = await lookupCRMContactByEmail(email);
      if (existing) {
        if (!firstName && existing.firstName) setFirstName(existing.firstName);
        if (!lastName && existing.lastName) setLastName(existing.lastName);
        if (!whatsapp && existing.whatsapp) setWhatsapp(existing.whatsapp);
      }
    } catch (e) {
      console.warn('[CRM Lookup]', e);
    }
  };

  // Resolução do Título da Bússola para o Checkout
  const getSelectedBussolaTitle = () => {
    if (selectedBussola === 'profissional') return 'Bússola Astrológica Profissional — Talentos e Vocação';
    if (selectedBussola === 'amorosa') return 'Bússola Astrológica Amorosa — Vínculos e Linguagem do Amor';
    if (selectedBussola === 'pessoal-anual') return 'Bússola Pessoal Anual — 12 Orientações Astrológicas Mensais';
    return 'Bússola Astrológica Pessoal — Orientação Mensal Personalizada';
  };

  return (
    <div className="bg-[#FAF8F5] text-[#2B2566] min-h-screen py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden relative">
      
      {/* Elementos Cósmicos Decorativos Efémeros ao Fundo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-20 right-[-80px] w-96 h-96 rounded-full border border-[#F0B55E]/15 opacity-40 animate-celestial-orbit-slow" />
        <div className="absolute top-1/2 left-[-100px] w-[500px] h-[500px] rounded-full border border-[#8C987F]/10 opacity-50 animate-celestial-orbit-reverse" />
        <div className="absolute top-36 left-12 text-[#F0B55E]/40 text-xs animate-pulse">✦</div>
        <div className="absolute bottom-48 right-1/4 text-[#8C987F]/30 text-[10px]">★</div>
      </div>

      <div className="mx-auto max-w-5xl space-y-12 sm:space-y-16 lg:space-y-20 relative z-10">
        
        {/* =========================================================================
            1. BANNER HERO: BÚSSOLAS ASTROLÓGICAS (LOGO 3D & FRASE DE IMPACTO)
            ========================================================================= */}
        <RevealOnScroll delayMs={50}>
          <div className="max-w-4xl mx-auto text-center space-y-5">
            {/* Logo 3D Oficial da Bússola em Destaque */}
            <div className="flex justify-center pb-2">
              <img
                src="https://static.wixstatic.com/media/02c8e0_688edec712d4401984a6e1cf8afeb93e~mv2.png"
                alt="Bússolas Astrológicas — Casa 6"
                className="h-36 sm:h-48 md:h-56 lg:h-64 w-auto object-contain transition-transform duration-500 hover:scale-105 filter drop-shadow-[0_16px_36px_rgba(43,37,102,0.15)]"
                draggable={false}
              />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0B55E]/15 border border-[#F0B55E]/40 shadow-xs">
                <Compass className="h-3.5 w-3.5 text-[#B87314]" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#2B2566]">
                  Família de Bússolas Astrológicas
                </span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B2566] tracking-tight">
                Bússolas Astrológicas
              </h1>

              {/* Linha-Ponto do Brand Guide */}
              <div className="flex items-center justify-center gap-3 py-1">
                <span className="w-12 h-px bg-[#2B2566]/20" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]" />
                <span className="w-20 h-px bg-[#2B2566]/20" />
              </div>

              {/* Frase Oficial de Impacto */}
              <p className="font-heading text-lg sm:text-xl md:text-2xl text-[#2B2566] font-semibold max-w-3xl mx-auto leading-snug">
                “O céu aponta caminhos. O autoconhecimento ajuda você a escolher a direção.”
              </p>

              {/* Conceito da Linha */}
              <p className="font-sans text-xs sm:text-sm md:text-[15px] text-[#423C7B] max-w-2xl mx-auto font-normal leading-relaxed pt-1">
                Materiais personalizados em PDF, desenvolvidos a partir do seu mapa natal para diferentes áreas da vida. Escolha a direção que deseja explorar para compreender comportamentos, reconhecer talentos e fazer escolhas conscientes.
              </p>

              <div className="pt-2">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#2B2566] text-[#F0B55E] text-xs font-bold uppercase tracking-wider shadow-sm">
                  Todas as Bússolas por R$ 47,00 cada
                </span>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            2. OS 3 PILARES DAS BÚSSOLAS ASTROLÓGICAS (ÍCONES 3D)
            ========================================================================= */}
        <RevealOnScroll delayMs={100}>
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                COMO FUNCIONA
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                Astrologia Prática para a Vida Real
              </h2>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-none md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-5">
              {/* Pilar 1: 100% Personalizado no Mapa Natal */}
              <div className="w-[82vw] md:w-auto shrink-0 snap-center md:shrink bg-white/90 backdrop-blur-xs rounded-2xl border border-[#EADBCC]/60 p-6 shadow-[0_8px_24px_rgba(43,37,102,0.03)] hover:shadow-[0_12px_32px_rgba(43,37,102,0.06)] transition-all duration-300 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 flex items-center justify-start bg-transparent">
                    <img
                      src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@latest/assets/Compass/3D/compass_3d.png"
                      alt="100% Personalizado"
                      className="w-11 h-11 object-contain filter drop-shadow-[0_4px_10px_rgba(43,37,102,0.12)] transition-transform duration-300 hover:scale-115 select-none"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#2B2566]">
                    100% Personalizado
                  </h3>
                  <p className="text-xs text-[#534D6B] leading-relaxed">
                    Não é horóscopo genérico. É um estudo detalhado gerado a partir da sua data, hora exata e cidade de nascimento.
                  </p>
                </div>
              </div>

              {/* Pilar 2: Material em PDF no WhatsApp */}
              <div className="w-[82vw] md:w-auto shrink-0 snap-center md:shrink bg-white/90 backdrop-blur-xs rounded-2xl border border-[#EADBCC]/60 p-6 shadow-[0_8px_24px_rgba(43,37,102,0.03)] hover:shadow-[0_12px_32px_rgba(43,37,102,0.06)] transition-all duration-300 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 flex items-center justify-start bg-transparent">
                    <img
                      src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@latest/assets/Mobile%20phone/3D/mobile_phone_3d.png"
                      alt="No Seu WhatsApp"
                      className="w-11 h-11 object-contain filter drop-shadow-[0_4px_10px_rgba(43,37,102,0.12)] transition-transform duration-300 hover:scale-115 select-none"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#2B2566]">
                    No Seu WhatsApp
                  </h3>
                  <p className="text-xs text-[#534D6B] leading-relaxed">
                    Você recebe seu guia diagramado em PDF de alta qualidade diretamente pelo WhatsApp para consultar quando quiser.
                  </p>
                </div>
              </div>

              {/* Pilar 3: Área de Membros Vitalícia */}
              <div className="w-[82vw] md:w-auto shrink-0 snap-center md:shrink bg-white/90 backdrop-blur-xs rounded-2xl border border-[#EADBCC]/60 p-6 shadow-[0_8px_24px_rgba(43,37,102,0.03)] hover:shadow-[0_12px_32px_rgba(43,37,102,0.06)] transition-all duration-300 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 flex items-center justify-start bg-transparent">
                    <img
                      src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@latest/assets/Locked/3D/locked_3d.png"
                      alt="Área de Membros"
                      className="w-11 h-11 object-contain filter drop-shadow-[0_4px_10px_rgba(43,37,102,0.12)] transition-transform duration-300 hover:scale-115 select-none"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#2B2566]">
                    Área de Membros
                  </h3>
                  <p className="text-xs text-[#534D6B] leading-relaxed">
                    Acesso exclusivo à plataforma segura da Casa 6 com login por e-mail e CPF para consultar seu histórico completo.
                  </p>
                </div>
              </div>
            </div>

            {/* Indicador no mobile */}
            <div className="flex md:hidden items-center justify-center gap-1.5 text-[11px] font-semibold text-[#8C987F] -mt-2">
              <span>Deslize para ver todos os pilares</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            3. A FAMÍLIA DE BÚSSOLAS ASTROLÓGICAS (APRESENTAÇÃO COMPLETA DOS PRODUTOS)
            ========================================================================= */}
        <RevealOnScroll delayMs={130}>
          <div className="space-y-8">
            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                ESCOLHA SUA DIREÇÃO
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B2566]">
                Conheça a Linha de Bússolas
              </h2>
              <p className="text-xs sm:text-sm text-[#423C7B] max-w-xl mx-auto">
                Cada Bússola aprofunda uma área essencial da sua vida com orientação prática, acolhedora e direta ao ponto.
              </p>
            </div>

            {/* Grade de Bússolas (Carrossel Horizontal no Mobile e Grade no Desktop) */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 -mx-4 px-4 scrollbar-none md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-6 items-stretch">
              {bussolasCatalog.map((bussola) => (
                <div
                  key={bussola.id}
                  className="w-[86vw] md:w-auto shrink-0 snap-center md:shrink bg-white/95 backdrop-blur-xs rounded-[28px] border border-[#EADBCC]/80 p-6 sm:p-7 shadow-[0_12px_32px_rgba(43,37,102,0.04)] hover:shadow-[0_18px_40px_rgba(43,37,102,0.08)] transition-all duration-300 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header do Card */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] p-2 flex items-center justify-center border border-[#EADBCC]">
                        <img
                          src={bussola.iconEmoji}
                          alt={bussola.name}
                          className="w-8 h-8 object-contain filter drop-shadow-sm select-none"
                        />
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C987F] block">
                          {bussola.tag}
                        </span>
                        <span className="font-bold text-base sm:text-lg text-[#2B2566]">
                          R$ {bussola.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    {/* Título & Subtítulo */}
                    <div className="space-y-1.5">
                      <h3 className="font-heading text-xl font-bold text-[#2B2566]">
                        {bussola.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#8C987F] leading-snug">
                        {bussola.subtitle}
                      </p>
                    </div>

                    {/* Pergunta Motivadora & Descrição */}
                    <p className="text-xs text-[#534D6B] italic leading-relaxed border-l-2 border-[#F0B55E] pl-3">
                      "{bussola.question}"
                    </p>

                    <p className="text-xs text-[#423C7B] leading-relaxed">
                      {bussola.description}
                    </p>

                    {/* O que você vai compreender */}
                    <div className="space-y-2 pt-2 border-t border-[#EADBCC]/40">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2B2566] block">
                        Você vai compreender:
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#534D6B]">
                        {bussola.learnings.slice(0, 4).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#12BB40] font-bold shrink-0 text-xs">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Rodapé do Card com Botão de Ação */}
                  <div className="pt-4 border-t border-[#EADBCC]/50 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSelectBussolaAndScroll(bussola.id)}
                      className="w-full py-3 px-4 rounded-full bg-[#2B2566] hover:bg-[#1E1B4B] text-[#F0B55E] font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <span>CONTRATAR ({`R$ 47,00`})</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[10px] text-center text-[#8C987F] block">
                      Entrega em PDF + WhatsApp + Área de Membros
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bússola Materna (Em Construção) */}
            <div className="bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] rounded-3xl border border-dashed border-[#EADBCC] p-6 sm:p-8 text-center space-y-3 shadow-xs">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6E3F1] text-[#2B2566] text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3 text-[#B87314]" />
                <span>Em Construção • Breve Lançamento</span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#2B2566]">
                Bússola Materna
              </h3>
              <p className="text-xs sm:text-sm text-[#534D6B] max-w-xl mx-auto leading-relaxed">
                Uma nova bússola está sendo desenvolvida com muito carinho para explorar os desafios, as emoções, os vínculos e as transformações da maternidade através da astrologia.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            4. BOX SOBRE BIANCA TOFOLI (FOTO OFICIAL & APRESENTAÇÃO ACOLHEDORA)
            ========================================================================= */}
        <RevealOnScroll delayMs={150}>
          <div className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl border border-[#EADBCC]/70 p-6 sm:p-8 shadow-[0_12px_32px_rgba(43,37,102,0.03)]">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
              
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#F0B55E] p-1 shadow-md bg-white ring-1 ring-[#F0B55E]/25">
                  <img
                    src="https://static.wixstatic.com/media/02c8e0_eebda8070c014b7e9e29291edb53c2c7~mv2.jpg"
                    alt="Bianca Tofoli — Fundadora da Casa 6"
                    className="w-full h-full object-cover rounded-full"
                    style={{ objectPosition: '50% 15%' }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              </div>

              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F] block">
                  ANÁLISE RIGOROSA & CUIDADO HUMANO
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#2B2566]">
                  Bianca Tofoli
                </h3>
                <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed">
                  Enfermeira formada pela UNESP e astróloga com foco em autoconhecimento e vida real. Cada Bússola Astrológica é calculada com rigor astronômico e sensibilidade humana para orientar suas decisões com clareza, propósito e equilíbrio.
                </p>
              </div>

            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            5. SEÇÃO DE CONTRATAÇÃO & FORMULÁRIO (TODAS R$ 47,00 CADA)
            ========================================================================= */}
        <RevealOnScroll delayMs={170}>
          <div id="secao-contratacao-bussola" className="space-y-6">
            
            {/* Banner de Preço Único R$ 47,00 */}
            <div className="bg-gradient-to-r from-[#2B2566] via-[#382D78] to-[#2B2566] text-white rounded-3xl p-6 sm:p-8 text-center space-y-2 shadow-xl border border-[#F0B55E]/30 relative overflow-hidden">
              <div className="absolute top-0 right-1/4 w-60 h-60 bg-[#F0B55E]/10 rounded-full blur-2xl pointer-events-none" />

              <span className="text-[11px] font-bold uppercase tracking-widest text-[#F0B55E] block">
                VALOR ÚNICO DE LANÇAMENTO
              </span>

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F0B55E] tracking-tight">
                R$ 47,00 cada Bússola
              </h2>

              <p className="text-xs sm:text-sm text-[#DAD2C4] max-w-xl mx-auto font-normal">
                Selecione abaixo a Bússola desejada, preencha seus dados de nascimento e receba seu estudo astrológico completo em PDF.
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl border border-[#EADBCC]/70 p-6 sm:p-10 shadow-[0_16px_40px_rgba(43,37,102,0.04)] space-y-6">
              
              {/* Seletor de Bússolas Interativo */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#2B2566] uppercase tracking-wider block">
                  1. Escolha a Bússola que deseja receber: *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedBussola('profissional')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      selectedBussola === 'profissional'
                        ? 'border-[#F0B55E] bg-[#F4EFE6]/70 shadow-sm ring-1 ring-[#F0B55E]'
                        : 'border-[#EADBCC]/80 bg-white hover:border-[#F0B55E]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F]">Carreira</span>
                      <span className="font-bold text-xs text-[#2B2566]">R$ 47,00</span>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-heading font-bold text-sm text-[#2B2566]">Bússola Profissional</h4>
                      <p className="text-[11px] text-[#534D6B]">Talentos, vocação e realização.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedBussola('amorosa')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      selectedBussola === 'amorosa'
                        ? 'border-[#F0B55E] bg-[#F4EFE6]/70 shadow-sm ring-1 ring-[#F0B55E]'
                        : 'border-[#EADBCC]/80 bg-white hover:border-[#F0B55E]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F]">Amor</span>
                      <span className="font-bold text-xs text-[#2B2566]">R$ 47,00</span>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-heading font-bold text-sm text-[#2B2566]">Bússola Amorosa</h4>
                      <p className="text-[11px] text-[#534D6B]">Linguagem do amor e vínculos.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedBussola('pessoal')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      selectedBussola === 'pessoal'
                        ? 'border-[#F0B55E] bg-[#F4EFE6]/70 shadow-sm ring-1 ring-[#F0B55E]'
                        : 'border-[#EADBCC]/80 bg-white hover:border-[#F0B55E]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F]">Mensal</span>
                      <span className="font-bold text-xs text-[#2B2566]">R$ 47,00</span>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-heading font-bold text-sm text-[#2B2566]">Bússola Pessoal</h4>
                      <p className="text-[11px] text-[#534D6B]">Orientações para o seu mês.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Mensagem de Erro de Validação */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Formulário de Identificação & Dados Astrais */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#2B2566] uppercase tracking-wider block">
                    2. Seus Dados de Contato para Entrega:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2B2566]">Nome *</label>
                      <input
                        type="text"
                        required
                        placeholder="Seu primeiro nome"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566] focus:outline-none focus:border-[#F0B55E] focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2B2566]">Sobrenome *</label>
                      <input
                        type="text"
                        required
                        placeholder="Seu sobrenome"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566] focus:outline-none focus:border-[#F0B55E] focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2B2566]">E-mail *</label>
                      <input
                        type="email"
                        required
                        placeholder="seuemail@exemplo.com"
                        value={email}
                        onBlur={handleEmailBlur}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566] focus:outline-none focus:border-[#F0B55E] focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2B2566]">WhatsApp (com DDD) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(11) 99999-9999"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566] focus:outline-none focus:border-[#F0B55E] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Dados de Nascimento Obrigatórios para o Mapa Astral */}
                <div className="pt-2 border-t border-[#EADBCC]/50 space-y-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-[#2B2566] uppercase tracking-wider block">
                      3. Dados de Nascimento (Obrigatórios para o Cálculo do Mapa Natal) *
                    </span>
                    <p className="text-[11px] text-[#534D6B]">
                      A análise precisa da hora e minuto exatos para calcular o Ascendente, as Casas e os Trânsitos individuais.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Dia (DD)"
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-center"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Mês (MM)"
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-center"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Ano (AAAA)"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-center"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Hora (HH)"
                      value={birthHour}
                      onChange={(e) => setBirthHour(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-center"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Minuto (MM)"
                      value={birthMinute}
                      onChange={(e) => setBirthMinute(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-center"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <input
                      type="text"
                      required
                      placeholder="Cidade de nascimento"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Estado (UF, ex: SP)"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566]"
                    />
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-full bg-[#2B2566] hover:bg-[#1E1B4B] text-[#F0B55E] font-extrabold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Sparkles className="h-5 w-5 text-[#F0B55E]" />
                    <span>
                      CONTRATAR {selectedBussola === 'profissional' ? 'BÚSSOLA PROFISSIONAL' : selectedBussola === 'amorosa' ? 'BÚSSOLA AMOROSA' : 'BÚSSOLA PESSOAL'} (R$ 47,00)
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#F0B55E]" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-[#8C987F]">
                    <ShieldCheck className="h-4 w-4 text-[#25D366]" />
                    <span>Pagamento Seguro via Mercado Pago Oficial. Cartão de Crédito ou Pix.</span>
                  </div>
                </div>

              </form>
            </div>

          </div>
        </RevealOnScroll>

        {/* =========================================================================
            6. PERGUNTAS FREQUENTES (FAQ DAS BÚSSOLAS ASTROLÓGICAS)
            ========================================================================= */}
        <RevealOnScroll delayMs={190}>
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                TIRE SUAS DÚVIDAS
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                Perguntas Frequentes sobre as Bússolas
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white/95 backdrop-blur-xs border border-[#EADBCC]/70 overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-sans font-bold text-xs sm:text-sm text-[#2B2566] hover:text-[#F0B55E] transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-[#F0B55E] shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#8C987F] shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#423C7B] leading-relaxed border-t border-[#EADBCC]/40 font-normal">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>

      </div>

      {/* Modal Oficial de Checkout Mercado Pago */}
      <MercadoPagoCheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        serviceType="bussula"
        itemTitle={getSelectedBussolaTitle()}
        amount={47.0}
        customerData={{
          firstName,
          lastName,
          email,
          whatsapp,
          birthData: {
            birthDay,
            birthMonth,
            birthYear,
            birthHour,
            birthMinute,
            city,
            state
          }
        }}
        onSuccess={(orderId) => {
          trackAnalyticsEvent('checkout_complete', { service: 'bussula', orderId });
        }}
      />

    </div>
  );
};
