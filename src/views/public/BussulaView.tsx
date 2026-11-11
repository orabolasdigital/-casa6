/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /bussula & /bussula-guia
 * Relatório Astrológico Mensal Personalizado em PDF + Área de Membros + Checkout Mercado Pago
 */

import React, { useState } from 'react';
import { Compass, Sparkles, Smartphone, Lock, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { BirthData } from '../../types';
import { MercadoPagoCheckoutModal } from '../../components/common/MercadoPagoCheckoutModal';
import { trackAnalyticsEvent } from '../../services/analytics';
import {
  sanitizeName,
  formatWhatsAppNumber,
  lookupCRMContactByEmail
} from '../../services/formValidation';

interface BussulaViewProps {
  onOpenBooking?: (serviceId?: string) => void;
}

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName || !lastName || !email || !whatsapp || !birthDay || !birthMonth || !birthYear || !birthHour || !birthMinute || !city || !state) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios do mapa natal para o cálculo exato.');
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
    <div className="bg-[#d8d6c8] text-[#1b1463] min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Hero da Bússola Guia */}
      <div className="max-w-4xl mx-auto text-center space-y-5">
        <div className="flex justify-center pb-1">
          <img
            src="https://static.wixstatic.com/media/02c8e0_75b529b0748c4e54adf4e58bfa7c78dc~mv2.png"
            alt="Casa 6"
            className="h-10 w-auto object-contain"
          />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2B2566] text-[#F0B55E] text-xs font-bold uppercase tracking-widest shadow-sm">
          <Compass className="h-4 w-4 text-[#F0B55E]" />
          <span>NOVO SERVIÇO EXCLUSIVO</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#2B2566] leading-tight">
          Bússola Guia
        </h1>

        <p className="font-heading text-lg sm:text-2xl text-[#8C987F] max-w-2xl mx-auto font-medium">
          Seu relatório astrológico mensal personalizado entregue em PDF pelo WhatsApp e na Área de Membros.
        </p>

        <p className="text-sm sm:text-base text-[#423C7B] max-w-2xl mx-auto leading-relaxed">
          Uma orientação lúcida calculada individualmente para o seu mapa de nascimento. Entenda os trânsitos que tocam suas casas astrológicas, as lunações do mês e as janelas de oportunidade para cada decisão.
        </p>
      </div>

      {/* Grid com os 3 Pilares da Bússola */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-7 rounded-2xl bg-[#FCFAF7] border border-[#c7c5b6] shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#1b1463] text-[#fab03b] flex items-center justify-center">
            <Smartphone className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-[#1b1463]">No Seu WhatsApp</h3>
          <p className="text-xs sm:text-sm text-[#372B69] leading-relaxed">
            Receba o relatório completo diagramado em PDF de alta qualidade diretamente no seu WhatsApp no início de cada mês ou logo após a contratação.
          </p>
        </div>

        <div className="p-7 rounded-2xl bg-[#FCFAF7] border border-[#c7c5b6] shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#1b1463] text-[#fab03b] flex items-center justify-center">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-[#1b1463]">Área de Membros</h3>
          <p className="text-xs sm:text-sm text-[#372B69] leading-relaxed">
            Acesso permanente a uma plataforma exclusiva com seu e-mail e CPF para consultar seu relatório em formato interativo HTML ou baixar o PDF a qualquer momento.
          </p>
        </div>

        <div className="p-7 rounded-2xl bg-[#FCFAF7] border border-[#c7c5b6] shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#1b1463] text-[#fab03b] flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-[#1b1463]">100% Personalizado</h3>
          <p className="text-xs sm:text-sm text-[#372B69] leading-relaxed">
            Não é horóscopo genérico. É um cálculo astronômico rigoroso baseado na data, horário exato com minutos e cidade onde você nasceu.
          </p>
        </div>
      </div>

      {/* Seção Principal: Formulário de Contratação + Preço */}
      <div className="max-w-4xl mx-auto bg-[#FCFAF7] rounded-3xl border-2 border-[#fab03b] shadow-2xl p-6 sm:p-10 space-y-8">
        
        <div className="border-b border-[#c7c5b6] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6a62b8]">
              CONTRATAÇÃO INDIVIDUAL
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1b1463]">
              Dados para Cálculo do Seu Relatório
            </h2>
            <p className="text-xs sm:text-sm text-[#372B69]">
              Preencha os dados de nascimento abaixo com precisão.
            </p>
          </div>

          <div className="text-left md:text-right bg-[#1b1463] text-white px-5 py-3 rounded-2xl">
            <span className="text-[10px] text-[#fab03b] font-bold uppercase tracking-wider block">VALOR DO RELATÓRIO</span>
            <div className="text-2xl font-bold font-heading">R$ 68,00</div>
            <span className="text-[10px] text-[#d8d6c8]">Mercado Pago • Pix ou Cartão</span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1463] flex items-center gap-1.5">
              <Star className="h-4 w-4 text-[#fab03b]" />
              <span>1. Informações de Contato</span>
            </h3>

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
                  className="w-full text-xs rounded-sm border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463] focus:border-[#fab03b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1463] mb-1">Sobrenome *</label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  autoComplete="family-name"
                  placeholder="Seu sobrenome completo"
                  value={lastName}
                  onChange={(e) => setLastName(sanitizeName(e.target.value).slice(0, 15))}
                  className="w-full text-xs rounded-sm border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463] focus:border-[#fab03b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1463] mb-1">E-mail (para login e envio) *</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  className="w-full text-xs rounded-sm border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463] focus:border-[#fab03b] focus:outline-none"
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
                  className="w-full text-xs rounded-sm border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463] focus:border-[#fab03b] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Dados de Nascimento */}
          <div className="space-y-4 pt-4 border-t border-[#c7c5b6]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1463] flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-[#fab03b]" />
              <span>2. Dados Astrais de Nascimento (Rigorosos)</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1b1463] mb-1">Dia *</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  placeholder="Ex: 18"
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1463] mb-1">Mês *</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  required
                  placeholder="Ex: 09"
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1463] mb-1">Ano *</label>
                <input
                  type="number"
                  min="1920"
                  max="2026"
                  required
                  placeholder="Ex: 1993"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1b1463] mb-1">
                  Horário Exato (Horas e Minutos da Certidão) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    required
                    placeholder="Hora (ex: 14)"
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566]"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    required
                    placeholder="Minutos (ex: 35)"
                    value={birthMinute}
                    onChange={(e) => setBirthMinute(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2566] mb-1">
                  Cidade e Estado de Nascimento *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Cidade (ex: São Paulo)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="col-span-2 w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="UF (SP)"
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 rounded-full bg-[#F0B55E] hover:bg-[#dfa247] text-[#2B2566] py-4 px-8 text-sm font-extrabold uppercase tracking-wider shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldCheck className="h-5 w-5" />
              <span>IR PARA CHECKOUT MERCADO PAGO (R$ 68,00)</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <p className="text-[11px] text-center text-[#68638C]">
            Pagamento seguro processado pelo Mercado Pago. Seus dados de certidão são estritamente confidenciais.
          </p>
        </form>
      </div>

      {/* Modal de Checkout Mercado Pago */}
      <MercadoPagoCheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        serviceType="bussula"
        itemTitle="Bússola Guia — Relatório Astral Mensal Personalizado"
        amount={68.0}
        customerData={{
          firstName,
          lastName,
          email,
          whatsapp,
          birthData
        }}
        onSuccess={(orderId) => {
          trackAnalyticsEvent('checkout_complete', { orderId, service: 'bussula-guia' });
        }}
      />
    </div>
  );
};
