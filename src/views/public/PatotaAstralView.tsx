/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /patota & /patota-astral
 * Comunidade Recorrente Patota Astral (R$ 53/mês ou R$ 1,50/dia)
 * com depoimentos estilo WhatsApp, FAQ accordion, formulário com dados de certidão e Checkout Mercado Pago
 */

import React, { useState } from 'react';
import { MessageCircle, Moon, ArrowRight, ShieldCheck, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { BirthData } from '../../types';
import { MercadoPagoCheckoutModal } from '../../components/common/MercadoPagoCheckoutModal';
import { trackAnalyticsEvent } from '../../services/analytics';

interface PatotaAstralViewProps {
  onOpenBooking: (serviceId?: string) => void;
}

export const PatotaAstralView: React.FC<PatotaAstralViewProps> = () => {
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

  const benefits = [
    'Áudios exclusivos de orientação nas Lunações (Lua Nova e Lua Cheia) aplicadas ao cotidiano',
    'Encontros mensais ao vivo com Bianca Tofoli para tirar dúvidas e analisar trânsitos',
    'Canal VIP fechado e acolhedor de trocas no WhatsApp entre os membros',
    'Cadernos astrológicos e planners digitais para download em cada ciclo',
    'Descontos especiais em consultas individuais e vivências presenciais da Casa 6'
  ];

  const faqs = [
    {
      q: 'Como funciona a assinatura da Patota Astral?',
      a: 'É uma assinatura mensal de R$ 53,00 (cerca de R$ 1,50 por dia) sem fidelidade nem carência. Você tem acesso imediato ao grupo VIP no WhatsApp e a todos os encontros e materiais.'
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
      a: 'Você pode cancelar sua assinatura a qualquer momento com apenas um clique pelo Mercado Pago ou enviando uma mensagem no nosso suporte.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName || !lastName || !email || !whatsapp || !birthDay || !birthMonth || !birthYear || !birthHour || !birthMinute || !city || !state) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios para o cadastro na comunidade.');
      return;
    }

    trackAnalyticsEvent('checkout_start', { service: 'patota-astral' });
    setCheckoutOpen(true);
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
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="flex justify-center pb-1">
          <img
            src="https://static.wixstatic.com/media/02c8e0_75b529b0748c4e54adf4e58bfa7c78dc~mv2.png"
            alt="Casa 6"
            className="h-10 w-auto object-contain"
          />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-1.5 text-xs font-black text-[#072B15] shadow-md">
          <MessageCircle className="h-4 w-4 text-[#072B15]" />
          <span>COMUNIDADE OFICIAL NO WHATSAPP</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#2B2566] tracking-tight">
          Patota Astral
        </h1>
        <p className="font-heading text-lg sm:text-2xl text-[#166437] max-w-2xl mx-auto font-medium">
          Acompanhe os movimentos astrológicos com Bianca Tofoli
        </p>
        <p className="text-sm sm:text-base text-[#423C7B] max-w-2xl mx-auto leading-relaxed">
          Um aprendizado contínuo da astrologia vivenciado em grupo. Um círculo vivo de estudos para acompanhar os trânsitos cósmicos sem misticismo vazio e com muita conexão com a sua rotina real.
        </p>
      </div>

      {/* Destaque de Preço: R$ 1,50 por dia (R$ 53/mês) */}
      <div className="max-w-md mx-auto bg-[#FFFFFF] rounded-3xl border-2 border-[#25D366] p-6 text-center shadow-lg space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#166437]">
          MENOS QUE UM CAFÉZINHO
        </span>
        <div className="text-4xl font-extrabold font-heading text-[#2B2566]">
          R$ 1,50 <span className="text-sm font-normal text-[#423C7B]">/ dia</span>
        </div>
        <p className="text-xs font-bold text-[#166437]">
          Apenas R$ 53,00 por mês no Mercado Pago (cancele quando quiser)
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setCheckoutOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-[#072B15] px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>ASSINAR AGORA NO MERCADO PAGO</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Depoimentos estilo WhatsApp conforme o print da Patota */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6a62b8]">
            CONVERSAS REAIS DA COMUNIDADE
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1b1463]">
            O que dizem os membros da Patota
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#e5ddd5]/40 p-5 rounded-2xl border border-[#c7c5b6] space-y-2">
            <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-xs text-xs text-[#1b1463] space-y-1">
              <p className="font-bold text-[#075E54] text-[11px]">Juliana S.</p>
              <p>“Os áudios da Bianca no dia de lua cheia são o meu porto seguro. Parece que ela tá lendo minha mente e meu dia a dia!”</p>
              <p className="text-[10px] text-right text-gray-400">14:28</p>
            </div>
          </div>

          <div className="bg-[#e5ddd5]/40 p-5 rounded-2xl border border-[#c7c5b6] space-y-2">
            <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-xs text-xs text-[#1b1463] space-y-1">
              <p className="font-bold text-[#075E54] text-[11px]">Marcos T.</p>
              <p>“Entrei achando que era só teoria e me deparei com uma rede de apoio e autoconhecimento prática demais. Não saio mais!”</p>
              <p className="text-[10px] text-right text-gray-400">09:15</p>
            </div>
          </div>

          <div className="bg-[#e5ddd5]/40 p-5 rounded-2xl border border-[#c7c5b6] space-y-2">
            <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-xs text-xs text-[#1b1463] space-y-1">
              <p className="font-bold text-[#075E54] text-[11px]">Fernanda V.</p>
              <p>“Estar na Patota Astral mudou minha rotina. É um refúgio de troca entre pessoas reais que buscam autoconhecimento lúcido.”</p>
              <p className="text-[10px] text-right text-gray-400">18:42</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Inscrição Completo com Dados de Nascimento */}
      <div className="max-w-4xl mx-auto bg-[#FCFAF7] rounded-3xl border-2 border-[#fab03b] shadow-2xl p-6 sm:p-10 space-y-8">
        <div className="border-b border-[#c7c5b6] pb-5">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6a62b8]">
            CADASTRO OFICIAL DO ASSINANTE
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1b1463]">
            Preencha seus dados para entrar na Patota Astral
          </h2>
          <p className="text-xs sm:text-sm text-[#372B69]">
            Seus dados astrais são utilizados por Bianca Tofoli para entender as energias dos membros da turma.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1463] flex items-center gap-1.5">
              <Star className="h-4 w-4 text-[#fab03b]" />
              <span>1. Seus Dados de Contato</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1b1463] mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  placeholder="Seu primeiro nome"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463] focus:border-[#fab03b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1463] mb-1">Sobrenome *</label>
                <input
                  type="text"
                  required
                  placeholder="Seu sobrenome"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463] focus:border-[#fab03b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1463] mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463] focus:border-[#fab03b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1463] mb-1">WhatsApp com DDD (para entrar no grupo) *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: 11 99999-9999"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463] focus:border-[#fab03b] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#c7c5b6]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1463] flex items-center gap-1.5">
              <Moon className="h-4 w-4 text-[#fab03b]" />
              <span>2. Dados de Nascimento (Certidão)</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1b1463] mb-1">Dia *</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  placeholder="Ex: 22"
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
                  placeholder="Ex: 07"
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
                  placeholder="Ex: 1991"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1b1463] mb-1">Horário Exato *</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    required
                    placeholder="Hora (10)"
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463]"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    required
                    placeholder="Minutos (45)"
                    value={birthMinute}
                    onChange={(e) => setBirthMinute(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1463] mb-1">Cidade e Estado onde Nasceu *</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Cidade"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="col-span-2 w-full text-xs rounded-xl border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="UF"
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    className="w-full text-xs rounded-xl border border-[#c7c5b6] bg-white px-3.5 py-2.5 text-[#1b1463] uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 rounded-full bg-[#fab03b] hover:bg-[#e59e2e] text-[#1b1463] py-4 px-8 text-sm font-extrabold uppercase tracking-wider shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldCheck className="h-5 w-5" />
              <span>ASSINAR A PATOTA ASTRAL (R$ 53,00 / MÊS)</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* FAQ Accordion da Patota */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h3 className="font-heading text-2xl font-bold text-center text-[#1b1463]">
          Perguntas Frequentes
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#FCFAF7] rounded-2xl border border-[#c7c5b6] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-[#1b1463] hover:text-[#6a62b8] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#372B69] leading-relaxed border-t border-[#c7c5b6]/40">
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
        itemTitle="Assinatura Patota Astral (Mensal)"
        amount={53.0}
        customerData={{
          firstName,
          lastName,
          email,
          whatsapp,
          birthData
        }}
        onSuccess={(orderId) => {
          trackAnalyticsEvent('checkout_complete', { orderId, service: 'patota-astral' });
        }}
      />
    </div>
  );
};
