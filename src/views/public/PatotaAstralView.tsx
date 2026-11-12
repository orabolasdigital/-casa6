/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /patota & /patota-astral
 * Comunidade Recorrente Patota Astral no WhatsApp com Bianca Tofoli
 * 
 * Atualizações de Design:
 * - Logo 3D em tamanho maior, destacado e em primeiro plano.
 * - Removida a tag "Comunidade VIP oficial do WhatsApp" abaixo do logo.
 * - Texto abaixo do título em fonte secundária (font-sans) e tamanho menor e suave.
 * - Ícones de benefícios exclusivos na cor roxa (#2B2566) com fundo suave para maior contraste.
 * - Foto da Bianca Tofoli atualizada para a foto oficial da página inicial (Home).
 * - Removida a tag "Assinatura VIP no WhatsApp" de cima do banner R$ 1,50 por dia.
 * - Campos de Hora e Minuto de nascimento separados.
 * - Cidade e Estado de nascimento adicionados ao formulário.
 * - Botão de assinar com as cores padrão elegantes do projeto (#2B2566 com dourado #F0B55E).
 * - Títulos das Perguntas Frequentes em fonte secundária normal e negrito (font-sans font-bold).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Star,
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  Lock,
  Heart,
  Globe,
  HelpCircle,
  Check
} from 'lucide-react';
import { BirthData } from '../../types';
import { MercadoPagoCheckoutModal } from '../../components/common/MercadoPagoCheckoutModal';
import { trackAnalyticsEvent } from '../../services/analytics';
import { lookupCRMContactByEmail } from '../../services/formValidation';

interface PatotaAstralViewProps {
  onOpenBooking?: (serviceId?: string) => void;
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

export const PatotaAstralView: React.FC<PatotaAstralViewProps> = () => {
  const [selectedPlan, setSelectedPlan] = useState<'anual' | 'semestral' | 'trimestral'>('anual');
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

  // Planos com o Anual em destaque (R$ 1,50 por dia)
  const plans = [
    {
      id: 'anual',
      name: 'Plano Anual',
      price: 43.0,
      priceFormatted: 'R$ 43,00',
      periodText: 'por mês (renovação anual)',
      badge: 'R$ 1,50 por dia • Melhor Valor',
      highlight: true
    },
    {
      id: 'semestral',
      name: 'Plano Semestral',
      price: 51.0,
      priceFormatted: 'R$ 51,00',
      periodText: 'por mês (renovação semestral)',
      badge: 'Mais Popular',
      highlight: false
    },
    {
      id: 'trimestral',
      name: 'Plano Trimestral',
      price: 53.0,
      priceFormatted: 'R$ 53,00',
      periodText: 'por mês (renovação trimestral)',
      badge: 'Mais Flexível',
      highlight: false
    }
  ] as const;

  const currentPlan = plans.find((p) => p.id === selectedPlan) || plans[0];

  // Benefícios exclusivos da Patota com ícones roxos em alto contraste
  const benefits = [
    {
      icon: MessageCircle,
      title: 'Previsões Diárias no WhatsApp',
      desc: 'Áudios matinais com os trânsitos da Lua, aspectos do céu e orientações práticas para seu dia.'
    },
    {
      icon: Calendar,
      title: 'Encontros Online Mensais',
      desc: 'Sessões ao vivo no Google Meet com a Bianca para discutir os ciclos do mês, com gravações salvas.'
    },
    {
      icon: Sparkles,
      title: 'Materiais Exclusivos em PDF',
      desc: 'Rituais de lunação, guias astrológicos e tabelas práticas disponíveis para download.'
    },
    {
      icon: HelpCircle,
      title: 'Espaço para Perguntas',
      desc: 'Tire suas dúvidas diretamente nos encontros e entenda como as energias celestes se manifestam.'
    },
    {
      icon: Star,
      title: 'Sorteios & Descontos',
      desc: 'Condições especiais em consultas individuais, na Lojinha e em futuros workshops da Casa 6.'
    },
    {
      icon: Heart,
      title: 'Comunidade Acolhedora VIP',
      desc: 'Um ambiente seguro, sem julgamentos, com pessoas que compartilham da mesma busca por evolução.'
    }
  ];

  // 8 Perguntas e Respostas do Site Antigo
  const faqs = [
    {
      q: 'PRECISO ENTENDER MUITO SOBRE ASTROLOGIA PARA PARTICIPAR?',
      a: 'Não! O objetivo da Patota Astral com Bianca Tofoli é justamente traduzir o simbolismo dos astros em orientações práticas, lúcidas e simples para o seu dia a dia. Você não precisa ter nenhum conhecimento prévio para aproveitar 100% do conteúdo.'
    },
    {
      q: 'A PATOTA ASTRAL É UM GRUPO NO WHATSAPP?',
      a: 'Sim! Todo o conteúdo diário, áudios com os trânsitos da Lua e links dos encontros são enviados diretamente em um grupo exclusivo no WhatsApp, garantindo facilidade e rapidez para ouvir na sua rotina.'
    },
    {
      q: 'QUANDO E COMO SERÃO OS ENCONTROS AO VIVO?',
      a: 'Os encontros acontecem mensalmente de forma online (via Google Meet ou Zoom), com datas e horários avisados com antecedência no grupo. É um momento de troca sincera, aprofundamento e espaço para perguntas.'
    },
    {
      q: 'E SE EU NÃO PUDER ASSISTIR AO VIVO?',
      a: 'Sem problemas! Todos os encontros são gravados na íntegra e disponibilizados na sua Área de Membros exclusiva no site da Casa 6. Você poderá assistir quando e quantas vezes quiser.'
    },
    {
      q: 'O QUE ACONTECE DEPOIS QUE EU FAÇO A MINHA ASSINATURA?',
      a: 'Assim que o pagamento for aprovado pelo Mercado Pago, você receberá um e-mail de boas-vindas com o link de acesso imediato ao grupo VIP do WhatsApp e instruções para criar sua senha da Área de Membros.'
    },
    {
      q: 'QUAL PLANO DE ASSINATURA É MAIS VANTAJOSO PARA MIM?',
      a: 'O Plano Anual é o mais vantajoso, pois oferece a maior economia — saindo por apenas cerca de R$ 1,50 por dia (menos que um cafézinho) — e garante sua presença contínua em todos os 12 encontros e lunações do ano.'
    },
    {
      q: 'TENHO UMA DÚVIDA OU PRECISO DE AJUDA COM MINHA ASSINATURA. O QUE FAÇO?',
      a: 'Nossa equipe e a própria Bianca estão à disposição no WhatsApp oficial da Casa 6 para responder dúvidas sobre planos, formas de pagamento ou acesso à comunidade.'
    },
    {
      q: 'ESTOU MORANDO FORA DO PAÍS. POSSO PARTICIPAR?',
      a: 'Sim, com certeza! A Patota Astral recebe membros do mundo todo. Como todo o ecossistema é digital (WhatsApp e Área de Membros), você só precisa de conexão com a internet para participar.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName || !lastName || !email || !whatsapp) {
      setErrorMessage('Por favor, preencha nome, sobrenome, e-mail e WhatsApp para a liberação da assinatura.');
      return;
    }

    trackAnalyticsEvent('checkout_start', { service: 'patota-astral', plan: selectedPlan });
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

  const scrollToCheckout = () => {
    const el = document.getElementById('secao-assinatura-patota');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
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
            1. BANNER COM LOGO MAIOR & FRASE DE IMPACTO
            ========================================================================= */}
        <RevealOnScroll delayMs={50}>
          <div className="max-w-4xl mx-auto text-center space-y-5">
            {/* Logo 3D Oficial da Patota Astral em Tamanho Maior e Destaque */}
            <div className="flex justify-center pb-2">
              <img
                src="https://static.wixstatic.com/media/02c8e0_e5132493b4a14c0498c5df95ee68c593~mv2.png"
                alt="Patota Astral — Casa 6"
                className="h-36 sm:h-48 md:h-56 lg:h-64 w-auto object-contain transition-transform duration-500 hover:scale-105 filter drop-shadow-[0_16px_36px_rgba(43,37,102,0.15)]"
                draggable={false}
              />
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B2566] tracking-tight">
                Astrologia Diária por Assinatura
              </h1>

              {/* Linha-Ponto do Brand Guide */}
              <div className="flex items-center justify-center gap-3 py-1">
                <span className="w-12 h-px bg-[#2B2566]/20" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]" />
                <span className="w-20 h-px bg-[#2B2566]/20" />
              </div>

              {/* Texto em fonte secundária (font-sans) e tamanho menor e suave */}
              <p className="font-sans text-xs sm:text-sm md:text-[15px] text-[#423C7B] max-w-2xl mx-auto font-normal leading-relaxed">
                "Conecte-se com as energias do céu e viva sua rotina com mais consciência, clareza e harmonia. Seja parte da nossa Patota Astral!"
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            2. O QUE É A PATOTA ASTRAL? (TEXTO ORIGINAL EM BOX LEVE E SOFISTICADO)
            ========================================================================= */}
        <RevealOnScroll delayMs={100}>
          <div className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl border border-[#EADBCC]/70 p-6 sm:p-10 lg:p-12 shadow-[0_16px_40px_rgba(43,37,102,0.04)] space-y-5 text-center sm:text-left">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F0B55E] block">
                CONHEÇA A COMUNIDADE
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                O que é a Patota Astral?
              </h2>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm md:text-[15px] text-[#423C7B] leading-relaxed font-normal">
              <p>
                A <strong>Patota Astral</strong> é um grupo VIP no WhatsApp, criado por mim, <strong>Bianca Tofoli</strong>, para pessoas que desejam navegar pela vida com mais leveza, integrando a astrologia à sua rotina diária. Esse grupo é perfeito para quem deseja entender melhor o clima do céu, como as energias do dia influenciam nosso humor, decisões, relacionamentos, trabalho e crescimento pessoal.
              </p>
              <p>
                Você receberá diariamente insights astrológicos sobre os trânsitos planetários e a lua do dia, além de orientações práticas sobre como usar essas energias a seu favor para decisões mais assertivas.
              </p>
              <p>
                Além disso, a cada mês, você poderá participar de um <strong>encontro ao vivo comigo</strong>, onde exploraremos temas específicos do momento e seus significados. Teremos espaço para perguntas, orientações e conversas sinceras sobre os aprendizados trazidos pelos astros no mês específico.
              </p>
            </div>

            <div className="pt-3 border-t border-[#EADBCC]/50 flex justify-center sm:justify-start">
              <button
                type="button"
                onClick={scrollToCheckout}
                className="px-6 py-3 rounded-full bg-[#F0B55E] hover:bg-[#e0a64d] text-[#2B2566] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>QUERO PARTICIPAR DA PATOTA</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            3. CONTEÚDO EXCLUSIVO DA PATOTA (ÍCONES ROXOS COM MAIOR CONTRASTE)
            ========================================================================= */}
        <RevealOnScroll delayMs={140}>
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                BENEFÍCIOS EXCLUSIVOS
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                Conteúdo Exclusivo da Patota Astral
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {benefits.map((item, bIdx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={bIdx}
                    className="bg-white/90 backdrop-blur-xs rounded-2xl border border-[#EADBCC]/60 p-5 shadow-[0_8px_24px_rgba(43,37,102,0.03)] hover:shadow-[0_12px_32px_rgba(43,37,102,0.06)] transition-all duration-300 space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-[#2B2566]/10 flex items-center justify-center text-[#2B2566]">
                        <IconComponent className="h-5 w-5 text-[#2B2566]" />
                      </div>
                      <h3 className="font-heading text-base font-bold text-[#2B2566]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#534D6B] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            4. BOX SOBRE BIANCA TOFOLI (COM A MESMA FOTO DA PÁGINA INICIAL)
            ========================================================================= */}
        <RevealOnScroll delayMs={160}>
          <div className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl border border-[#EADBCC]/70 p-6 sm:p-8 shadow-[0_12px_32px_rgba(43,37,102,0.03)]">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
              
              {/* Foto Circular da Bianca idêntica à Home */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#F0B55E] p-1 shadow-md bg-white ring-1 ring-[#F0B55E]/25">
                  <img
                    src="https://static.wixstatic.com/media/02c8e0_54a33eeb476d45c49b7f4953c34177fc~mv2.jpeg"
                    alt="Bianca Tofoli — Fundadora da Casa 6"
                    className="w-full h-full object-cover rounded-full"
                    style={{ objectPosition: '50% 8%' }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Texto de Apresentação */}
              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F] block">
                  SUA GUIA NOS CÉUS DIÁRIOS
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#2B2566]">
                  Bianca Tofoli
                </h3>
                <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed">
                  Enfermeira formada pela UNESP - Botucatu, com mais de 10 anos de experiência em gestão de saúde e liderança de equipes. Em 2021, fez sua transição de carreira para a astrologia, trazendo consigo o propósito de cuidar de pessoas com um olhar lúcido, sensível e acolhedor.
                </p>
              </div>

            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            5. SEÇÃO DE INSCRIÇÃO E ASSINATURA COM DESTAQUE "R$ 1,50 POR DIA"
            ========================================================================= */}
        <RevealOnScroll delayMs={180}>
          <div id="secao-assinatura-patota" className="space-y-6">
            
            {/* Banner em Destaque: Apenas R$ 1,50 por dia (Sem a tag em cima) */}
            <div className="bg-gradient-to-r from-[#2B2566] via-[#382D78] to-[#2B2566] text-white rounded-3xl p-6 sm:p-8 text-center space-y-2 shadow-xl border border-[#F0B55E]/30 relative overflow-hidden">
              <div className="absolute top-0 right-1/4 w-60 h-60 bg-[#F0B55E]/10 rounded-full blur-2xl pointer-events-none" />

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F0B55E] tracking-tight">
                Apenas R$ 1,50 por dia!
              </h2>

              <p className="text-xs sm:text-sm text-[#DAD2C4] max-w-xl mx-auto font-normal">
                Menos que um cafézinho para ter a orientação astrológica diária da Bianca Tofoli guiando sua rotina, suas decisões e suas relações.
              </p>
            </div>

            {/* Container do Formulário de Assinatura */}
            <div className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl border border-[#EADBCC]/70 p-6 sm:p-10 shadow-[0_16px_40px_rgba(43,37,102,0.04)] space-y-8">
              
              {/* Passo 1: Escolha do Plano */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C987F] block">
                  PASSO 1: ESCOLHA SEU PLANO DE ASSINATURA
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? 'border-[#F0B55E] bg-[#FAF8F5] shadow-md scale-[1.02]'
                            : 'border-[#EADBCC]/60 bg-white hover:border-[#2B2566]/30'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                            plan.highlight ? 'bg-[#F0B55E] text-[#2B2566]' : 'bg-[#FAF8F5] text-[#8C987F] border border-[#EADBCC]'
                          }`}>
                            {plan.badge}
                          </span>
                          <h3 className="font-heading text-lg font-bold text-[#2B2566]">
                            {plan.name}
                          </h3>
                        </div>

                        <div>
                          <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2B2566]">
                            {plan.priceFormatted}
                          </span>
                          <span className="text-[11px] text-[#534D6B] block">
                            {plan.periodText}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-[#EADBCC]/50">
                          <span className={`text-xs font-bold flex items-center gap-1.5 ${
                            isSelected ? 'text-[#25D366]' : 'text-[#8C987F]'
                          }`}>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{isSelected ? 'Plano Selecionado' : 'Selecionar'}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Passo 2: Formulário de Dados com Cidade e Estado */}
              <form onSubmit={handleSubmit} className="space-y-5 pt-4 border-t border-[#EADBCC]/60">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C987F] block">
                    PASSO 2: SEUS DADOS PARA ACESSO À COMUNIDADE
                  </span>
                  <p className="text-xs text-[#534D6B]">
                    Preencha com atenção. O WhatsApp cadastrado será adicionado ao grupo VIP.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#2B2566]">Nome *</label>
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
                    <label className="text-xs font-bold text-[#2B2566]">Sobrenome *</label>
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
                    <label className="text-xs font-bold text-[#2B2566]">E-mail *</label>
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
                    <label className="text-xs font-bold text-[#2B2566]">WhatsApp (com DDD) *</label>
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

                {/* Dados de Nascimento com Hora e Minuto Separados e Cidade/Estado */}
                <div className="pt-2 border-t border-[#EADBCC]/40 space-y-2">
                  <span className="text-[11px] font-bold text-[#8C987F] uppercase tracking-wider block">
                    DADOS DE NASCIMENTO (OPCIONAL — PARA PERSONALIZAÇÃO DOS TRÂNSITOS)
                  </span>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    <input
                      type="text"
                      placeholder="Dia (DD)"
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-center"
                    />
                    <input
                      type="text"
                      placeholder="Mês (MM)"
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-center"
                    />
                    <input
                      type="text"
                      placeholder="Ano (AAAA)"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-center"
                    />
                    <input
                      type="text"
                      placeholder="Hora (HH)"
                      value={birthHour}
                      onChange={(e) => setBirthHour(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-center"
                    />
                    <input
                      type="text"
                      placeholder="Minuto (MM)"
                      value={birthMinute}
                      onChange={(e) => setBirthMinute(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-center"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <input
                      type="text"
                      placeholder="Cidade de nascimento"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566]"
                    />
                    <input
                      type="text"
                      placeholder="Estado (UF, ex: SP)"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566]"
                    />
                  </div>
                </div>

                {/* Botão Oficial com Cores Padrões Elegantes do Projeto (#2B2566 com dourado) */}
                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-full bg-[#2B2566] hover:bg-[#1E1B4B] text-[#F0B55E] font-extrabold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Sparkles className="h-5 w-5 text-[#F0B55E]" />
                    <span>ASSINAR PATOTA ASTRAL ({currentPlan.priceFormatted})</span>
                    <ArrowRight className="h-4 w-4 text-[#F0B55E]" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-[#8C987F]">
                    <ShieldCheck className="h-4 w-4 text-[#25D366]" />
                    <span>Pagamento Seguro via Mercado Pago Oficial. Cancele quando quiser.</span>
                  </div>
                </div>

              </form>

            </div>

          </div>
        </RevealOnScroll>

        {/* =========================================================================
            6. PERGUNTAS E RESPOSTAS (TÍTULOS EM FONTE SECUNDÁRIA NORMAL E NEGRITO)
            ========================================================================= */}
        <RevealOnScroll delayMs={200}>
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                TIRE SUAS DÚVIDAS
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                Perguntas Frequentes sobre a Patota Astral
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

      {/* Modal de Checkout Mercado Pago */}
      <MercadoPagoCheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        serviceType="patota"
        itemTitle={`Patota Astral — ${currentPlan.name}`}
        amount={currentPlan.price}
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
        onSuccess={() => {
          setCheckoutOpen(false);
          window.location.href = '/membros';
        }}
      />

    </div>
  );
};
