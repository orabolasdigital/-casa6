/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /patota & /patota-astral
 * Comunidade Recorrente Patota Astral no WhatsApp com Bianca Tofoli
 */

import React, { useState } from 'react';
import { MessageCircle, CheckCircle2, ShieldCheck, ChevronDown, ChevronUp, Star, Sparkles, ArrowRight } from 'lucide-react';
import { BirthData } from '../../types';
import { MercadoPagoCheckoutModal } from '../../components/common/MercadoPagoCheckoutModal';
import { trackAnalyticsEvent } from '../../services/analytics';
import {
  sanitizeName,
  formatWhatsAppNumber,
  lookupCRMContactByEmail
} from '../../services/formValidation';

interface PatotaAstralViewProps {
  onOpenBooking?: (serviceId?: string) => void;
}

export const PatotaAstralView: React.FC<PatotaAstralViewProps> = () => {
  const [selectedPlan, setSelectedPlan] = useState<'trimestral' | 'semestral' | 'anual'>('trimestral');
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

  const plans = [
    {
      id: 'trimestral',
      name: 'Plano Trimestral',
      price: 53.0,
      priceFormatted: 'R$ 53,00',
      periodText: 'por mês (renovação automática trimestral)',
      badge: 'Mais Flexível'
    },
    {
      id: 'semestral',
      name: 'Plano Semestral',
      price: 51.0,
      priceFormatted: 'R$ 51,00',
      periodText: 'por mês (renovação automática semestral)',
      badge: 'Popular'
    },
    {
      id: 'anual',
      name: 'Plano Anual',
      price: 43.0,
      priceFormatted: 'R$ 43,00',
      periodText: 'por mês (renovação automática anual)',
      badge: 'Melhor Valor — R$ 1,50/dia'
    }
  ] as const;

  const currentPlan = plans.find((p) => p.id === selectedPlan) || plans[0];

  const faqs = [
    {
      q: 'Como funciona a assinatura da Patota Astral?',
      a: 'É uma assinatura recorrente no WhatsApp com previsões diárias, encontros mensais e materiais exclusivos. Você pode escolher entre os planos trimestral, semestral ou anual com renovação automática.'
    },
    {
      q: 'Preciso entender de astrologia para participar?',
      a: 'Não! O propósito da Patota Astral com Bianca Tofoli é justamente descomplicar a astrologia, traduzindo o simbolismo dos céus em passos práticos para a sua vida pessoal e profissional.'
    },
    {
      q: 'Os encontros ao vivo ficam gravados?',
      a: 'Sim! Se você não puder assistir no horário marcado, todos os encontros ficam salvos na sua Área de Membros para assistir quando puder.'
    },
    {
      q: 'Como e quando posso cancelar?',
      a: 'A assinatura é recorrente. Para cancelar basta entrar em contato com nosso time pelo WhatsApp ou suporte.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName || !lastName || !email || !whatsapp) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios para o cadastro.');
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

  const birthData: BirthData = {
    birthDay,
    birthMonth,
    birthYear,
    birthHour,
    birthMinute,
    city,
    state
  };

  return (
    <div className="bg-[#F4EFE6] text-[#2B2566] min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Hero Patota Astral */}
      <div className="max-w-4xl mx-auto text-center space-y-5">
        <div className="flex justify-center pb-2">
          <img
            src="https://static.wixstatic.com/media/02c8e0_e5132493b4a14c0498c5df95ee68c593~mv2.png"
            alt="Patota Astral — Casa 6"
            className="h-28 sm:h-36 w-auto object-contain transition-transform hover:scale-105"
          />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-1.5 text-xs font-black text-[#072B15] shadow-md">
          <MessageCircle className="h-4 w-4 text-[#072B15]" />
          <span>COMUNIDADE OFICIAL VIP NO WHATSAPP</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#2B2566] tracking-tight">
          Patota Astral
        </h1>
        <p className="font-heading text-lg sm:text-2xl text-[#166437] max-w-2xl mx-auto font-medium">
          Acompanhe os movimentos astrológicos com Bianca Tofoli
        </p>
      </div>

      {/* Seção 1: O que é a Patota Astral? */}
      <div className="max-w-4xl mx-auto bg-[#FCFAF7] rounded-sm border border-[#DAD2C4] p-6 sm:p-10 shadow-md space-y-4 font-sans">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1b1463]">
          O que é a Patota Astral?
        </h2>
        <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed">
          A Patota Astral é um grupo VIP no WhatsApp, criado por mim, Bianca Tofoli, para oferecer previsões astrológicas diárias e aprofundamento em astrologia de uma forma prática e acessível. Esse grupo é perfeito para quem deseja estar sempre alinhada com as energias do dia e fazer escolhas mais conscientes para sua rotina, trabalho, relações e projetos pessoais.
        </p>
        <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed">
          Diariamente, compartilho insights astrológicos sobre os trânsitos planetários e suas influências, ajudando você a se planejar e utilizar esse conhecimento para tomar decisões mais assertivas.
        </p>
        <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed">
          Além disso, a cada mês, temos encontros exclusivos ao vivo, onde aprofundamos ensinamentos astrológicos, respondemos dúvidas e trocamos experiências. Também lanço enquetes, promoções e sorteios exclusivos para os participantes, tornando essa experiência ainda mais especial.
        </p>
      </div>

      {/* Seção 2: Conteúdo Exclusivo da Patota Astral */}
      <div className="max-w-4xl mx-auto space-y-6 font-sans">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F]">
            BENEFÍCIOS EXCLUSIVOS
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1b1463]">
            Conteúdo Exclusivo da Patota Astral
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div className="bg-[#FCFAF7] p-5 rounded-sm border border-[#DAD2C4] shadow-xs space-y-2">
            <Sparkles className="h-5 w-5 text-[#fab03b]" />
            <h3 className="font-bold text-sm text-[#1b1463]">Previsões Diárias</h3>
            <p className="text-xs text-[#534D6B] leading-relaxed">
              Entenda como as energias do dia impactam suas decisões.
            </p>
          </div>

          <div className="bg-[#FCFAF7] p-5 rounded-sm border border-[#DAD2C4] shadow-xs space-y-2">
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
            <h3 className="font-bold text-sm text-[#1b1463]">Encontros Online</h3>
            <p className="text-xs text-[#534D6B] leading-relaxed">
              Momento exclusivo para tirar dúvidas e aprender mais sobre astrologia.
            </p>
          </div>

          <div className="bg-[#FCFAF7] p-5 rounded-sm border border-[#DAD2C4] shadow-xs space-y-2">
            <Star className="h-5 w-5 text-[#fab03b]" />
            <h3 className="font-bold text-sm text-[#1b1463]">Materiais Exclusivos</h3>
            <p className="text-xs text-[#534D6B] leading-relaxed">
              Compartilho insights e pesquisas astrológicas para ampliar seu conhecimento.
            </p>
          </div>

          <div className="bg-[#FCFAF7] p-5 rounded-sm border border-[#DAD2C4] shadow-xs space-y-2">
            <ShieldCheck className="h-5 w-5 text-[#6a62b8]" />
            <h3 className="font-bold text-sm text-[#1b1463]">Interação Personalizada</h3>
            <p className="text-xs text-[#534D6B] leading-relaxed">
              Participe de enquetes e tenha influência na criação de novos produtos e serviços.
            </p>
          </div>

          <div className="bg-[#FCFAF7] p-5 rounded-sm border border-[#DAD2C4] shadow-xs space-y-2">
            <Sparkles className="h-5 w-5 text-[#fab03b]" />
            <h3 className="font-bold text-sm text-[#1b1463]">Sorteios e Promoções</h3>
            <p className="text-xs text-[#534D6B] leading-relaxed">
              Participe de sorteios de produtos e serviços exclusivos.
            </p>
          </div>

          <div className="bg-[#FCFAF7] p-5 rounded-sm border border-[#DAD2C4] shadow-xs space-y-2">
            <CheckCircle2 className="h-5 w-5 text-[#25D366]" />
            <h3 className="font-bold text-sm text-[#1b1463]">Comunidade VIP</h3>
            <p className="text-xs text-[#534D6B] leading-relaxed">
              Troque experiências com outras pessoas interessadas em astrologia e autoconhecimento.
            </p>
          </div>
        </div>
      </div>

      {/* Seção 3: Inscrição e Assinatura com Seletor dos 3 Planos */}
      <div className="max-w-4xl mx-auto bg-[#FCFAF7] rounded-sm border-2 border-[#25D366] shadow-xl p-6 sm:p-10 space-y-8 font-sans">
        
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#166437] block">
            R$ 1,50 por dia!
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1b1463]">
            Inscrição e Assinatura
          </h2>
          <p className="font-heading text-lg font-bold text-[#1b1463]">
            &gt;&gt;&gt; R$ 46,00 por mês / anual &lt;&lt;&lt;
          </p>
          <p className="text-xs text-[#534D6B]">
            A assinatura é recorrente, para cancelar basta entrar em contato com nosso time.
          </p>
        </div>

        {/* Escolha entre os Planos Trimestral, Semestral ou Anual */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#1b1463] text-center">
            Passo 1: Escolha o melhor plano para seu momento:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`p-5 rounded-sm border-2 transition-all cursor-pointer flex flex-col justify-between text-center relative ${
                    isSelected
                      ? 'border-[#25D366] bg-[#25D366]/10 shadow-md'
                      : 'border-[#DAD2C4] bg-white hover:border-[#25D366]/50'
                  }`}
                >
                  {p.badge && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#1b1463] text-[#F0B55E] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {p.badge}
                    </span>
                  )}
                  <div className="space-y-1 pt-2">
                    <h3 className="font-bold text-sm text-[#1b1463]">{p.name}</h3>
                    <div className="font-heading text-2xl font-extrabold text-[#1b1463]">
                      {p.priceFormatted}
                    </div>
                    <p className="text-[11px] text-[#534D6B]">{p.periodText}</p>
                  </div>
                  <div className="pt-3">
                    <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-sm ${isSelected ? 'bg-[#25D366] text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {isSelected ? '✓ Selecionado' : 'Selecionar'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formulário de Identificação */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-[#DAD2C4]">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1b1463]">
              Passo 2: Preencha todos os seus dados para liberação do acesso:
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1b1463] mb-1">Nome *</label>
              <input
                type="text"
                required
                maxLength={15}
                autoComplete="given-name"
                placeholder="Seu primeiro nome"
                value={firstName}
                onChange={(e) => setFirstName(sanitizeName(e.target.value).slice(0, 15))}
                className="w-full text-xs rounded-sm border border-[#DAD2C4] bg-white px-3.5 py-2.5 text-[#1b1463] focus:border-[#25D366] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1b1463] mb-1">Sobrenome *</label>
              <input
                type="text"
                required
                maxLength={15}
                autoComplete="family-name"
                placeholder="Seu sobrenome"
                value={lastName}
                onChange={(e) => setLastName(sanitizeName(e.target.value).slice(0, 15))}
                className="w-full text-xs rounded-sm border border-[#DAD2C4] bg-white px-3.5 py-2.5 text-[#1b1463] focus:border-[#25D366] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1b1463] mb-1">E-mail *</label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                className="w-full text-xs rounded-sm border border-[#DAD2C4] bg-white px-3.5 py-2.5 text-[#1b1463] focus:border-[#25D366] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1b1463] mb-1">WhatsApp *</label>
              <input
                type="tel"
                required
                autoComplete="tel"
                placeholder="Ex: 11 99999-9999"
                value={whatsapp}
                onChange={(e) => setWhatsapp(formatWhatsAppNumber(e.target.value))}
                className="w-full text-xs rounded-sm border border-[#DAD2C4] bg-white px-3.5 py-2.5 text-[#1b1463] focus:border-[#25D366] focus:outline-none"
              />
            </div>
          </div>

          {/* Dados Opcionais de Certidão para Trânsitos */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-bold text-[#8C987F] uppercase tracking-wider block">
              Dados Astrais (Opcional para cálculo dos seus trânsitos)
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              <input
                type="text"
                placeholder="Dia"
                maxLength={2}
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value.replace(/\D/g, ''))}
                className="w-full text-xs rounded-sm border border-[#DAD2C4] bg-white px-2.5 py-2 text-[#1b1463]"
              />
              <input
                type="text"
                placeholder="Mês"
                maxLength={2}
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value.replace(/\D/g, ''))}
                className="w-full text-xs rounded-sm border border-[#DAD2C4] bg-white px-2.5 py-2 text-[#1b1463]"
              />
              <input
                type="text"
                placeholder="Ano"
                maxLength={4}
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value.replace(/\D/g, ''))}
                className="w-full text-xs rounded-sm border border-[#DAD2C4] bg-white px-2.5 py-2 text-[#1b1463]"
              />
              <input
                type="text"
                placeholder="Hora"
                maxLength={2}
                value={birthHour}
                onChange={(e) => setBirthHour(e.target.value.replace(/\D/g, ''))}
                className="w-full text-xs rounded-sm border border-[#DAD2C4] bg-white px-2.5 py-2 text-[#1b1463]"
              />
              <input
                type="text"
                placeholder="Min"
                maxLength={2}
                value={birthMinute}
                onChange={(e) => setBirthMinute(e.target.value.replace(/\D/g, ''))}
                className="w-full text-xs rounded-sm border border-[#DAD2C4] bg-white px-2.5 py-2 text-[#1b1463]"
              />
            </div>
          </div>

          {/* Passos e Botão de Ação */}
          <div className="space-y-3 pt-3">
            <div className="bg-white p-3.5 rounded-sm border border-[#DAD2C4] text-xs text-[#534D6B] space-y-1">
              <p className="font-bold text-[#1b1463]">Como funciona a sua entrada:</p>
              <p>1. Escolha o plano e preencha seus dados.</p>
              <p>2. Efetue o pagamento seguro com renovação automática.</p>
              <p>3. Receba na hora o link para entrar no grupo VIP da Patota Astral.</p>
              <p className="text-[11px] text-[#8C987F] pt-1">
                *caso não receba o e-mail em 24h entre em contato pelo WhatsApp que confirmaremos sua compra e adicionaremos ao grupo Assinantes/VIP.
              </p>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 rounded-sm bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 px-8 text-sm font-extrabold uppercase tracking-wider shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldCheck className="h-5 w-5" />
              <span>ASSINAR PATOTA ASTRAL ({currentPlan.priceFormatted})</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* FAQ Accordion da Patota */}
      <div className="max-w-3xl mx-auto space-y-4 font-sans">
        <h3 className="font-heading text-2xl font-bold text-center text-[#1b1463]">
          Perguntas Frequentes
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#FCFAF7] rounded-sm border border-[#DAD2C4] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-[#1b1463] hover:text-[#6a62b8] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#372B69] leading-relaxed border-t border-[#DAD2C4]/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Checkout Mercado Pago */}
      <MercadoPagoCheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        serviceType="patota"
        itemTitle={`Assinatura Patota Astral — ${currentPlan.name} (Renovação Automática)`}
        amount={currentPlan.price}
        customerData={{
          firstName,
          lastName,
          email,
          whatsapp,
          birthData
        }}
        onSuccess={(orderId) => {
          trackAnalyticsEvent('checkout_complete', { orderId, service: 'patota-astral', plan: selectedPlan });
        }}
      />
    </div>
  );
};
