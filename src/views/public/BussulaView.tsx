/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /bussola & /bussola-guia
 * Relatório Astrológico Mensal Personalizado em PDF + Área de Membros + Checkout Mercado Pago
 * 
 * Atualizações de Design:
 * - Logo 3D em tamanho maior, destacado e em primeiro plano.
 * - Removida a tag "Relatório astral mensal personalizado" abaixo do logo.
 * - Texto abaixo do título em fonte secundária (font-sans) e tamanho menor e suave.
 * - Ícones dos pilares na cor roxa (#2B2566) com fundo suave para maior contraste com o fundo claro.
 * - Foto da Bianca Tofoli atualizada para a foto oficial da página inicial (Home).
 * - Removida a tag "Assinatura mensal recorrente" de cima do banner R$ 47 por mês.
 * - Títulos das Perguntas Frequentes em fonte secundária normal e negrito (font-sans font-bold).
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
  Check
} from 'lucide-react';
import { BirthData } from '../../types';
import { MercadoPagoCheckoutModal } from '../../components/common/MercadoPagoCheckoutModal';
import { trackAnalyticsEvent } from '../../services/analytics';
import { lookupCRMContactByEmail } from '../../services/formValidation';

interface BussulaViewProps {
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

export const BussulaView: React.FC<BussulaViewProps> = () => {
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

  // FAQ da Bússola Guia
  const faqs = [
    {
      q: 'COMO RECEBO A BÚSSOLA GUIA A CADA MÊS?',
      a: 'Seu relatório mensal é diagramado em PDF de alta qualidade e enviado diretamente no seu WhatsApp nos primeiros dias de cada ciclo astrológico, além de ficar salvo permanentemente na sua Área de Membros.'
    },
    {
      q: 'POR QUE O HORÁRIO EXATO DE NASCIMENTO É NECESSÁRIO?',
      a: 'Diferente de horóscopos genéricos, a Bússola Guia cruza as efemérides astronômicas reais do céu do momento com os graus exatos do seu ascendente e casas astrológicas, exigindo hora e minutos precisos.'
    },
    {
      q: 'A ASSINATURA TEM FIDELIDADE OU POSSO CANCELAR?',
      a: 'Não há fidelidade nem multas. A renovação é mensal automática via Mercado Pago e você pode pausar ou cancelar quando desejar diretamente pelo suporte no WhatsApp.'
    },
    {
      q: 'O QUE ESTÁ INCLUSO NO RELATÓRIO MENSAL?',
      a: 'Mapeamento das lunações no seu mapa natal, trânsitos dos planetas rápidos e lentos, alertas de momentos de pressão e foco, melhores períodos para decisões e rituais sugeridos.'
    },
    {
      q: 'COMO ACESSO A ÁREA DE MEMBROS?',
      a: 'Assim que o pagamento for aprovado, você recebe por e-mail e WhatsApp os dados de login. Na Área de Membros você consulta seus relatórios anteriores e materiais complementares.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName || !lastName || !email || !whatsapp || !birthDay || !birthMonth || !birthYear || !birthHour || !birthMinute || !city || !state) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios do mapa natal para o cálculo astronômico exato.');
      return;
    }

    trackAnalyticsEvent('checkout_start', { service: 'bussula-guia' });
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
    const el = document.getElementById('secao-assinatura-bussola');
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
            1. BANNER COM LOGO MAIOR & FRASE DE IMPACTO (BÚSSOLA GUIA)
            ========================================================================= */}
        <RevealOnScroll delayMs={50}>
          <div className="max-w-4xl mx-auto text-center space-y-5">
            {/* Logo 3D Oficial da Bússola Guia em Tamanho Maior e Destaque */}
            <div className="flex justify-center pb-2">
              <img
                src="https://static.wixstatic.com/media/02c8e0_688edec712d4401984a6e1cf8afeb93e~mv2.png"
                alt="Bússola Guia — Casa 6"
                className="h-36 sm:h-48 md:h-56 lg:h-64 w-auto object-contain transition-transform duration-500 hover:scale-105 filter drop-shadow-[0_16px_36px_rgba(43,37,102,0.15)]"
                draggable={false}
              />
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B2566] tracking-tight">
                Bússola Guia
              </h1>

              {/* Linha-Ponto do Brand Guide */}
              <div className="flex items-center justify-center gap-3 py-1">
                <span className="w-12 h-px bg-[#2B2566]/20" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]" />
                <span className="w-20 h-px bg-[#2B2566]/20" />
              </div>

              {/* Texto em fonte secundária (font-sans) e tamanho menor e suave */}
              <p className="font-sans text-xs sm:text-sm md:text-[15px] text-[#423C7B] max-w-2xl mx-auto font-normal leading-relaxed">
                "Seu mapa mensal de navegação astral na palma da mão para planejar decisões, rotina e relações com clareza estratégica."
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            2. O QUE É A BÚSSOLA GUIA? (CARD ARREDONDADO E LEVE)
            ========================================================================= */}
        <RevealOnScroll delayMs={100}>
          <div className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl border border-[#EADBCC]/70 p-6 sm:p-10 lg:p-12 shadow-[0_16px_40px_rgba(43,37,102,0.04)] space-y-5 text-center sm:text-left">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F0B55E] block">
                MAPA DE NAVEGAÇÃO INDIVIDUAL
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                O que é a Bússola Guia?
              </h2>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm md:text-[15px] text-[#423C7B] leading-relaxed font-normal">
              <p>
                A <strong>Bússola Guia</strong> é um serviço de acompanhamento mensal por assinatura. A cada ciclo lunar, você recebe no seu WhatsApp um relatório diagramado em <strong>PDF de alta definição</strong> com o cálculo exato dos trânsitos que ativam o seu mapa natal naquele mês.
              </p>
              <p>
                Você não precisa tentar adivinhar como o céu geral se aplica à sua vida: a Bússola traduz exatamente quais áreas da sua vida (trabalho, finanças, relacionamentos, saúde e rotina) estarão em evidência e como agir de forma mais consciente.
              </p>
              <p>
                Além do envio em PDF pelo WhatsApp, você conta com acesso perpétuo à <strong>Área de Membros exclusiva</strong> para consultar seu histórico e rever orientações passadas.
              </p>
            </div>

            <div className="pt-3 border-t border-[#EADBCC]/50 flex justify-center sm:justify-start">
              <button
                type="button"
                onClick={scrollToCheckout}
                className="px-6 py-3 rounded-full bg-[#F0B55E] hover:bg-[#e0a64d] text-[#2B2566] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>CONTRATAR BÚSSOLA GUIA (R$ 47,00/MÊS)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            3. OS 3 PILARES DA BÚSSOLA GUIA (ÍCONES ROXOS COM MAIOR CONTRASTE)
            ========================================================================= */}
        <RevealOnScroll delayMs={140}>
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                COMO FUNCIONA
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                Os 3 Pilares da Bússola Guia
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-[#EADBCC]/60 p-6 shadow-[0_8px_24px_rgba(43,37,102,0.03)] hover:shadow-[0_12px_32px_rgba(43,37,102,0.06)] transition-all duration-300 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#2B2566]/10 flex items-center justify-center text-[#2B2566]">
                  <Smartphone className="h-5 w-5 text-[#2B2566]" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#2B2566]">
                  No Seu WhatsApp
                </h3>
                <p className="text-xs text-[#534D6B] leading-relaxed">
                  Relatório completo diagramado em PDF entregue mensalmente no seu WhatsApp nos primeiros dias de cada ciclo astrológico.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-[#EADBCC]/60 p-6 shadow-[0_8px_24px_rgba(43,37,102,0.03)] hover:shadow-[0_12px_32px_rgba(43,37,102,0.06)] transition-all duration-300 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#2B2566]/10 flex items-center justify-center text-[#2B2566]">
                  <Lock className="h-5 w-5 text-[#2B2566]" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#2B2566]">
                  Área de Membros
                </h3>
                <p className="text-xs text-[#534D6B] leading-relaxed">
                  Acesso permanente a uma plataforma exclusiva com login seguro para consultar seus relatórios atuais e históricos a qualquer hora.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-[#EADBCC]/60 p-6 shadow-[0_8px_24px_rgba(43,37,102,0.03)] hover:shadow-[0_12px_32px_rgba(43,37,102,0.06)] transition-all duration-300 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#2B2566]/10 flex items-center justify-center text-[#2B2566]">
                  <Sparkles className="h-5 w-5 text-[#2B2566]" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#2B2566]">
                  100% Personalizado
                </h3>
                <p className="text-xs text-[#534D6B] leading-relaxed">
                  Não é horóscopo geral. É um cálculo astronômico rigoroso baseado na data, hora exata e cidade de nascimento.
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            4. BOX SOBRE BIANCA TOFOLI (COM A MESMA FOTO DA PÁGINA INICIAL)
            ========================================================================= */}
        <RevealOnScroll delayMs={160}>
          <div className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl border border-[#EADBCC]/70 p-6 sm:p-8 shadow-[0_12px_32px_rgba(43,37,102,0.03)]">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
              
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

              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F] block">
                  ANÁLISE RIGOROSA & CUIDADO HUMANO
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#2B2566]">
                  Bianca Tofoli
                </h3>
                <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed">
                  Enfermeira formada pela UNESP e astróloga com foco em autoconhecimento e vida real. Cada Bússola Guia é calculada com rigor matemático e sensibilidade clínica para orientar suas decisões com equilíbrio e tranquilidade.
                </p>
              </div>

            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            5. SEÇÃO DE INSCRIÇÃO E ASSINATURA DA BÚSSOLA GUIA
            ========================================================================= */}
        <RevealOnScroll delayMs={180}>
          <div id="secao-assinatura-bussola" className="space-y-6">
            
            {/* Banner R$ 47 por mês (Sem a tag em cima) */}
            <div className="bg-gradient-to-r from-[#2B2566] via-[#382D78] to-[#2B2566] text-white rounded-3xl p-6 sm:p-8 text-center space-y-2 shadow-xl border border-[#F0B55E]/30 relative overflow-hidden">
              <div className="absolute top-0 right-1/4 w-60 h-60 bg-[#F0B55E]/10 rounded-full blur-2xl pointer-events-none" />

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F0B55E] tracking-tight">
                R$ 47,00 por mês
              </h2>

              <p className="text-xs sm:text-sm text-[#DAD2C4] max-w-xl mx-auto font-normal">
                Renovação automática mensal. Cancele quando quiser com apenas um clique ou mensagem no WhatsApp.
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl border border-[#EADBCC]/70 p-6 sm:p-10 shadow-[0_16px_40px_rgba(43,37,102,0.04)] space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C987F] block">
                  FORMULÁRIO DE CADASTRO ASTROLÓGICO
                </span>
                <p className="text-xs text-[#534D6B]">
                  Preencha seus dados de nascimento completos para o cálculo exato do seu mapa mensal.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
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

                {/* Dados de Nascimento Obrigatórios para a Bússola */}
                <div className="pt-2 border-t border-[#EADBCC]/50 space-y-3">
                  <span className="text-[11px] font-bold text-[#2B2566] uppercase tracking-wider block">
                    DADOS DE NASCIMENTO (OBRIGATÓRIO PARA CÁLCULO DO ASCENDENTE E CASAS) *
                  </span>

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
                    <span>CONTRATAR BÚSSOLA GUIA (R$ 47,00/MÊS)</span>
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
            6. PERGUNTAS FREQUENTES (TÍTULOS EM FONTE SECUNDÁRIA NORMAL E NEGRITO)
            ========================================================================= */}
        <RevealOnScroll delayMs={200}>
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                TIRE SUAS DÚVIDAS
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                Perguntas Frequentes sobre a Bússola Guia
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
        serviceType="bussula"
        itemTitle="Bússola Guia — Relatório Astral Mensal Personalizado"
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
        onSuccess={() => {
          setCheckoutOpen(false);
          window.location.href = '/membros';
        }}
      />

    </div>
  );
};
