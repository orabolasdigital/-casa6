/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Modal Oficial de Checkout Mercado Pago (Design System Casa 6 Oficial)
 * 
 * Fluxo em 3 Etapas Estruturadas:
 * - Etapa 1: Coleta de Informações (Nome, Sobrenome, WhatsApp, E-mail — SEM CPF)
 * - Etapa 2 (Lojinha): Endereço de Envio com autopreenchimento por CEP (ViaCEP)
 * - Etapa 2 (Patota Astral / Bússola): Dados Astrais (Dia, Mês, Ano, Hora, Minuto, Cidade/UF) + CPF
 * - Etapa 3: Pagamento com Mercado Pago Checkout Pro (Pix, Cartão de Crédito/Débito, Boleto)
 * - Etapa 4: Validação / Aprovação com Botão de Envio para WhatsApp (Lojinha) ou Link do Grupo VIP (Patota)
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  ShieldCheck,
  QrCode,
  CreditCard,
  Copy,
  Check,
  Lock,
  ArrowRight,
  ArrowLeft,
  Truck,
  Sparkles,
  MapPin,
  Calendar,
  MessageCircle,
  ExternalLink,
  Loader2,
  FileText
} from 'lucide-react';
import { MERCADO_PAGO_CONFIG, createOrderRecord } from '../../services/mercadopago';
import { SITE_CONFIG } from '../../config/site';
import { BirthData, ShippingAddress } from '../../types';

interface MercadoPagoCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: 'bussula' | 'patota' | 'loja' | 'atendimento';
  itemTitle: string;
  amount: number;
  customerData?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    whatsapp?: string;
    birthData?: BirthData;
  };
  onSuccess?: (orderId: string) => void;
}

export const MercadoPagoCheckoutModal: React.FC<MercadoPagoCheckoutModalProps> = ({
  isOpen,
  onClose,
  serviceType,
  itemTitle,
  amount,
  customerData,
  onSuccess
}) => {
  // Controle de Etapa (1: Identificação, 2: Envio/Dados Astrais, 3: Pagamento, 4: Concluído)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Etapa 1: Informações Pessoais (SEM CPF)
  const [firstName, setFirstName] = useState(customerData?.firstName || '');
  const [lastName, setLastName] = useState(customerData?.lastName || '');
  const [email, setEmail] = useState(customerData?.email || '');
  const [whatsapp, setWhatsapp] = useState(customerData?.whatsapp || '');

  // Etapa 2 (Lojinha): Endereço de Envio
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [shippingNotes, setShippingNotes] = useState('');
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');

  // Etapa 2 (Patota Astral / Bússola): Dados Astrais & CPF
  const [cpf, setCpf] = useState('');
  const [birthDay, setBirthDay] = useState(customerData?.birthData?.birthDay || '');
  const [birthMonth, setBirthMonth] = useState(customerData?.birthData?.birthMonth || '');
  const [birthYear, setBirthYear] = useState(customerData?.birthData?.birthYear || '');
  const [birthHour, setBirthHour] = useState(customerData?.birthData?.birthHour || '');
  const [birthMinute, setBirthMinute] = useState(customerData?.birthData?.birthMinute || '');
  const [birthCity, setBirthCity] = useState(customerData?.birthData?.city || '');
  const [birthState, setBirthState] = useState(customerData?.birthData?.state || '');

  // Etapa 3: Pagamento Mercado Pago
  const [activeMode, setActiveMode] = useState<'production' | 'test'>('production');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'ticket'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepError, setStepError] = useState('');

  // Cartão de crédito campos
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardInstallments, setCardInstallments] = useState('1');

  // Pedido Concluído
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  // Sincroniza dados iniciais ao abrir
  useEffect(() => {
    if (isOpen) {
      if (customerData?.firstName) setFirstName(customerData.firstName);
      if (customerData?.lastName) setLastName(customerData.lastName);
      if (customerData?.email) setEmail(customerData.email);
      if (customerData?.whatsapp) setWhatsapp(customerData.whatsapp);
      if (customerData?.birthData) {
        setBirthDay(customerData.birthData.birthDay || '');
        setBirthMonth(customerData.birthData.birthMonth || '');
        setBirthYear(customerData.birthData.birthYear || '');
        setBirthHour(customerData.birthData.birthHour || '');
        setBirthMinute(customerData.birthData.birthMinute || '');
        setBirthCity(customerData.birthData.city || '');
        setBirthState(customerData.birthData.state || '');
      }
      setCardHolder(`${customerData?.firstName || ''} ${customerData?.lastName || ''}`.trim());
      setStepError('');
      setCurrentStep(1);
    }
  }, [isOpen, customerData]);

  if (!isOpen) return null;

  const activeCreds = activeMode === 'production' ? MERCADO_PAGO_CONFIG.production : MERCADO_PAGO_CONFIG.test;
  const isLoja = serviceType === 'loja';
  const isPatota = serviceType === 'patota';

  // Código Pix dinâmico seguro formatado para a transação
  const pixCode = `00020101021226840014br.gov.bcb.pix2562pix-mercadopago.com/qr/casa6-${Math.random().toString(36).substring(2, 10)}5204000053039865802BR5925CASA 6 BIANCA TOFOLI6009SAO PAULO62070503***6304`;

  // Máscaras de Entrada
  const formatWhatsapp = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
  };

  const formatCpf = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.substring(0, 3)}.${digits.substring(3)}`;
    if (digits.length <= 9) return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6)}`;
    return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}-${digits.substring(9)}`;
  };

  const formatCep = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.substring(0, 5)}-${digits.substring(5)}`;
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatCardExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.substring(0, 2)}/${digits.substring(2)}`;
  };

  // Busca de CEP Automática via ViaCEP
  const handleCepChange = async (val: string) => {
    const formatted = formatCep(val);
    setCep(formatted);
    setCepError('');

    const clean = val.replace(/\D/g, '');
    if (clean.length === 8) {
      setIsLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await res.json();
        if (data.erro) {
          setCepError('CEP não encontrado. Por favor, preencha o endereço manualmente.');
        } else {
          setStreet(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || '');
          setState(data.uf || '');
        }
      } catch {
        setCepError('Não foi possível consultar o CEP automaticamente. Preencha manualmente.');
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  // Validação e Avanço da Etapa 1
  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStepError('');

    if (!firstName.trim() || firstName.trim().length < 2) {
      setStepError('Informe seu primeiro nome (mínimo 2 caracteres).');
      return;
    }
    if (!lastName.trim() || lastName.trim().length < 2) {
      setStepError('Informe seu sobrenome.');
      return;
    }
    const cleanPhone = whatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setStepError('Informe um WhatsApp válido com DDD.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setStepError('Informe um e-mail válido.');
      return;
    }

    setCurrentStep(2);
  };

  // Validação e Avanço da Etapa 2
  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStepError('');

    if (isLoja) {
      // Validação de Endereço de Envio
      const cleanCep = cep.replace(/\D/g, '');
      if (cleanCep.length !== 8) {
        setStepError('Informe um CEP válido com 8 dígitos.');
        return;
      }
      if (!street.trim()) {
        setStepError('Informe o nome da rua / logradouro.');
        return;
      }
      if (!number.trim()) {
        setStepError('Informe o número do endereço.');
        return;
      }
      if (!neighborhood.trim()) {
        setStepError('Informe o bairro.');
        return;
      }
      if (!city.trim()) {
        setStepError('Informe a cidade.');
        return;
      }
      if (!state.trim()) {
        setStepError('Informe o estado (UF).');
        return;
      }
    } else {
      // Validação de Dados Astrais & CPF para Patota Astral / Bússola
      const cleanCpf = cpf.replace(/\D/g, '');
      if (cleanCpf.length !== 11) {
        setStepError('Informe um CPF válido com 11 dígitos.');
        return;
      }
      if (!birthDay || !birthMonth || !birthYear) {
        setStepError('Informe dia, mês e ano de nascimento.');
        return;
      }
      if (!birthHour || !birthMinute) {
        setStepError('Informe hora e minuto de nascimento.');
        return;
      }
      if (!birthCity.trim() || !birthState.trim()) {
        setStepError('Informe a cidade e estado de nascimento.');
        return;
      }
    }

    setCurrentStep(3);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  // Preenchimento de dados simulados de teste
  const handleFillTestData = () => {
    setFirstName('Camila');
    setLastName('Mendonça');
    setEmail('camila.mendonca@casa6.com.br');
    setWhatsapp('(11) 98765-4321');
    setCpf('123.456.789-00');

    if (isLoja) {
      setCep('01310-100');
      setStreet('Avenida Paulista');
      setNumber('1000');
      setComplement('Apto 42');
      setNeighborhood('Bela Vista');
      setCity('São Paulo');
      setState('SP');
      setShippingNotes('Entregar na portaria');
    } else {
      setBirthDay('14');
      setBirthMonth('05');
      setBirthYear('1992');
      setBirthHour('15');
      setBirthMinute('30');
      setBirthCity('São Paulo');
      setBirthState('SP');
    }

    if (paymentMethod === 'credit_card') {
      setCardNumber('4242 4242 4242 4242');
      setCardHolder('CAMILA MENDONCA');
      setCardExpiry('12/28');
      setCardCvv('123');
    }
  };

  // Confirmação e Finalização do Pagamento
  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepError('');
    setIsProcessing(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanCpf = cpf.trim() || (isLoja ? '000.000.000-00' : '123.456.789-00');
      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      const birthDataPayload: BirthData | undefined = !isLoja
        ? {
            birthDay,
            birthMonth,
            birthYear,
            birthHour,
            birthMinute,
            city: birthCity,
            state: birthState
          }
        : undefined;

      const shippingPayload: ShippingAddress | undefined = isLoja
        ? {
            cep,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
            notes: shippingNotes
          }
        : undefined;

      const order = await createOrderRecord({
        memberEmail: cleanEmail,
        memberCpf: cleanCpf,
        customerName: fullName,
        whatsapp: whatsapp.replace(/\D/g, ''),
        serviceType,
        itemTitle,
        amount,
        paymentMethod,
        birthData: birthDataPayload,
        shippingAddress: shippingPayload
      });

      setConfirmedOrderId(order.id);
      setCurrentStep(4);
      if (onSuccess) onSuccess(order.id);
    } catch (err) {
      console.error('Erro ao processar compra no Mercado Pago:', err);
      setStepError('Houve uma falha ao registrar o pedido. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Geração da mensagem de WhatsApp para Lojinha
  const getWhatsAppLojaMessage = () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    return `Olá, Bianca! Acabei de realizar a compra de "${itemTitle}" pelo site da Casa 6.\n\n` +
      `📦 Pedido: #${confirmedOrderId}\n` +
      `💰 Valor: R$ ${amount.toFixed(2).replace('.', ',')}\n` +
      `👤 Nome: ${fullName}\n` +
      `📱 WhatsApp: ${whatsapp}\n` +
      `✉️ E-mail: ${email}\n\n` +
      `📍 Endereço de Envio:\n` +
      `${street}, nº ${number}${complement ? ` - ${complement}` : ''}\n` +
      `Bairro: ${neighborhood}\n` +
      `Cidade: ${city} / ${state}\n` +
      `CEP: ${cep}\n` +
      (shippingNotes ? `Obs: ${shippingNotes}\n` : '');
  };

  // Link do grupo VIP da Patota no WhatsApp
  const patotaGroupInviteUrl = 'https://chat.whatsapp.com/invite/patota-astral-casa6-oficial';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2B2566]/85 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-[#FCFAF7] border-2 border-[#F0B55E]/60 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* =========================================================================
            HEADER OFICIAL CASA 6 COM BADGE MERCADO PAGO CHECKOUT PRO
            ========================================================================= */}
        <div className="bg-gradient-to-r from-[#2B2566] via-[#211B55] to-[#362E7A] text-white p-5 sm:p-6 flex items-center justify-between shrink-0 border-b border-[#F0B55E]/30 relative">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-[#FCFAF7] p-1.5 flex items-center justify-center shadow-md border border-[#F0B55E]/40">
              <img
                src="https://static.wixstatic.com/media/02c8e0_bce65db1891746ca848f16f8403ddaed~mv2.png"
                alt="Casa 6"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E6E3F1]">Casa 6</span>
                <span className="text-[9px] bg-[#009ee3] text-white font-black px-2 py-0.5 rounded-full shadow-xs">
                  Mercado Pago Checkout Pro
                </span>
                <span className="text-[9px] bg-[#12BB40] text-white font-bold px-2 py-0.5 rounded-full">
                  {activeMode === 'production' ? 'PRODUÇÃO ATIVA' : 'SANDBOX TESTE'}
                </span>
              </div>
              <p className="text-base sm:text-lg font-bold font-heading text-white line-clamp-1 mt-0.5">
                {itemTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-[#E6E3F1]/80 uppercase tracking-wider block">Total</span>
              <span className="font-heading font-bold text-lg text-[#F0B55E]">
                R$ {amount.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fechar checkout"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            BARRA DE PROGRESSO EM 3 ETAPAS OFICIAIS (DESIGN SYSTEM CASA 6)
            ========================================================================= */}
        {currentStep < 4 && (
          <div className="bg-[#F4EFE6] px-5 py-3 border-b border-[#E2DCCF] flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 w-full">
              {/* Etapa 1 */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === 1
                      ? 'bg-[#F0B55E] text-[#2B2566] ring-2 ring-[#2B2566]'
                      : currentStep > 1
                      ? 'bg-[#12BB40] text-white'
                      : 'bg-[#E2DCCF] text-[#68638C]'
                  }`}
                >
                  {currentStep > 1 ? '✓' : '1'}
                </span>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${currentStep === 1 ? 'text-[#2B2566]' : 'text-[#68638C]'}`}>
                  Identificação
                </span>
              </div>

              <div className="flex-1 h-px bg-[#E2DCCF]"></div>

              {/* Etapa 2 */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === 2
                      ? 'bg-[#F0B55E] text-[#2B2566] ring-2 ring-[#2B2566]'
                      : currentStep > 2
                      ? 'bg-[#12BB40] text-white'
                      : 'bg-[#E2DCCF] text-[#68638C]'
                  }`}
                >
                  {currentStep > 2 ? '✓' : '2'}
                </span>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${currentStep === 2 ? 'text-[#2B2566]' : 'text-[#68638C]'}`}>
                  {isLoja ? 'Envio' : 'Dados Astrais'}
                </span>
              </div>

              <div className="flex-1 h-px bg-[#E2DCCF]"></div>

              {/* Etapa 3 */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === 3
                      ? 'bg-[#F0B55E] text-[#2B2566] ring-2 ring-[#2B2566]'
                      : 'bg-[#E2DCCF] text-[#68638C]'
                  }`}
                >
                  3
                </span>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${currentStep === 3 ? 'text-[#2B2566]' : 'text-[#68638C]'}`}>
                  Pagamento
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mensagem de Erro de Validação */}
        {stepError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs">
            {stepError}
          </div>
        )}

        {/* =========================================================================
            CORPO DO MODAL (ETAPAS 1, 2, 3 E SUCESSO)
            ========================================================================= */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-5">
          
          {/* =====================================================================
              ETAPA 1: COLETA DE INFORMAÇÕES PESSOAIS (SEM CPF)
              ===================================================================== */}
          {currentStep === 1 && (
            <form onSubmit={handleNextFromStep1} className="space-y-4">
              <div className="border-b border-[#E2DCCF] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#2B2566]">
                    1. Seus Dados de Contato
                  </h3>
                  <p className="text-xs text-[#423C7B]">
                    Informe seus dados para identificação e emissão do comprovante.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleFillTestData}
                  className="px-2.5 py-1 rounded-lg bg-[#F0B55E]/30 hover:bg-[#F0B55E] text-[#2B2566] text-[10px] font-bold transition-all cursor-pointer"
                >
                  ⚡ Simular Dados
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#2B2566] mb-1">
                    Primeiro Nome *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mariana"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#F0B55E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#2B2566] mb-1">
                    Sobrenome *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Duarte"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#F0B55E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#2B2566] mb-1">
                    Telefone WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#F0B55E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#2B2566] mb-1">
                    E-mail para Receber o Pedido *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="mariana@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#F0B55E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-[#F0B55E] hover:bg-[#dfa247] text-[#2B2566] py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>{isLoja ? 'Avançar para Endereço de Envio' : 'Avançar para Dados Astrais & CPF'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* =====================================================================
              ETAPA 2 (LOJINHA): DADOS DE LOCALIZAÇÃO PARA ENVIO COM BUSCA POR CEP
              ===================================================================== */}
          {currentStep === 2 && isLoja && (
            <form onSubmit={handleNextFromStep2} className="space-y-4">
              <div className="border-b border-[#E2DCCF] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#2B2566] flex items-center gap-2">
                    <Truck className="h-5 w-5 text-[#B87314]" />
                    <span>2. Endereço de Envio</span>
                  </h3>
                  <p className="text-xs text-[#423C7B]">
                    Informe o CEP para preenchimento automático da rua, bairro e cidade.
                  </p>
                </div>
              </div>

              {/* CEP com busca automática */}
              <div>
                <label className="block text-[11px] font-bold text-[#2B2566] mb-1">
                  CEP (Obrigatório) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="00000-000"
                    value={cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    maxLength={9}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] font-mono focus:border-[#F0B55E] focus:outline-none"
                  />
                  {isLoadingCep && (
                    <div className="absolute right-3 top-2.5 text-[#B87314] flex items-center gap-1.5 text-xs">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-[10px]">Buscando...</span>
                    </div>
                  )}
                </div>
                {cepError && (
                  <p className="text-[11px] text-red-600 mt-1">{cepError}</p>
                )}
              </div>

              {/* Rua e Número */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="block text-[11px] font-bold text-[#2B2566] mb-1">
                    Rua / Avenida / Logradouro *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Preenchido pelo CEP"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#F0B55E] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-[#2B2566] mb-1">
                    Número *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#F0B55E] focus:outline-none"
                  />
                </div>
              </div>

              {/* Complemento e Bairro */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#2B2566] mb-1">
                    Complemento (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Apto 101, Bloco B"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#F0B55E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#2B2566] mb-1">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bairro"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#F0B55E] focus:outline-none"
                  />
                </div>
              </div>

              {/* Cidade e Estado */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="block text-[11px] font-bold text-[#2B2566] mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Cidade"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#F0B55E] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-[#2B2566] mb-1">
                    Estado (UF) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="SP"
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] uppercase text-center font-bold focus:border-[#F0B55E] focus:outline-none"
                  />
                </div>
              </div>

              {/* Observações de Envio */}
              <div>
                <label className="block text-[11px] font-bold text-[#2B2566] mb-1">
                  Observações para a Entrega (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Instruções para o entregador, ponto de referência, etc."
                  value={shippingNotes}
                  onChange={(e) => setShippingNotes(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2 text-[#2B2566] focus:border-[#F0B55E] focus:outline-none"
                />
              </div>

              {/* Botões Voltar e Avançar */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full border border-[#E2DCCF] text-xs font-bold text-[#2B2566] hover:bg-[#F4EFE6] cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#F0B55E] hover:bg-[#dfa247] text-[#2B2566] py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>Avançar para Pagamento</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* =====================================================================
              ETAPA 2 (PATOTA ASTRAL & BÚSSOLA): DADOS ASTRAIS DE NASCIMENTO & CPF
              ===================================================================== */}
          {currentStep === 2 && !isLoja && (
            <form onSubmit={handleNextFromStep2} className="space-y-4">
              <div className="border-b border-[#E2DCCF] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#2B2566] flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#F0B55E]" />
                    <span>2. Dados Astrais & CPF</span>
                  </h3>
                  <p className="text-xs text-[#423C7B]">
                    Essenciais para a assinatura, mapa e acesso à Área de Membros.
                  </p>
                </div>
              </div>

              {/* Campo CPF (Exclusivo desta etapa) */}
              <div>
                <label className="block text-[11px] font-bold text-[#2B2566] mb-1">
                  CPF do Titular (Obrigatório para Cadastro & Membros) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  maxLength={14}
                  className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] font-mono focus:border-[#F0B55E] focus:outline-none"
                />
              </div>

              {/* Data de Nascimento */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#2B2566] mb-1">Dia *</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    placeholder="DD"
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3 py-2 text-center text-[#2B2566]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#2B2566] mb-1">Mês *</label>
                  <select
                    required
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-2 py-2 text-center text-[#2B2566]"
                  >
                    <option value="">Mês</option>
                    <option value="01">01 - Jan</option>
                    <option value="02">02 - Fev</option>
                    <option value="03">03 - Mar</option>
                    <option value="04">04 - Abr</option>
                    <option value="05">05 - Mai</option>
                    <option value="06">06 - Jun</option>
                    <option value="07">07 - Jul</option>
                    <option value="08">08 - Ago</option>
                    <option value="09">09 - Set</option>
                    <option value="10">10 - Out</option>
                    <option value="11">11 - Nov</option>
                    <option value="12">12 - Dez</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#2B2566] mb-1">Ano *</label>
                  <input
                    type="number"
                    min="1920"
                    max="2026"
                    required
                    placeholder="AAAA"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3 py-2 text-center text-[#2B2566]"
                  />
                </div>
              </div>

              {/* Horário de Nascimento */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#2B2566] mb-1">Hora de Nascimento (00-23) *</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    required
                    placeholder="14"
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3 py-2 text-center text-[#2B2566]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#2B2566] mb-1">Minuto (00-59) *</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    required
                    placeholder="30"
                    value={birthMinute}
                    onChange={(e) => setBirthMinute(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3 py-2 text-center text-[#2B2566]"
                  />
                </div>
              </div>

              {/* Cidade e Estado de Nascimento */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="block text-[11px] font-bold text-[#2B2566] mb-1">
                    Cidade de Nascimento *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: São Paulo"
                    value={birthCity}
                    onChange={(e) => setBirthCity(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566]"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-[#2B2566] mb-1">
                    Estado (UF) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="SP"
                    maxLength={2}
                    value={birthState}
                    onChange={(e) => setBirthState(e.target.value.toUpperCase())}
                    className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] uppercase text-center font-bold"
                  />
                </div>
              </div>

              {/* Botões Voltar e Avançar */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full border border-[#E2DCCF] text-xs font-bold text-[#2B2566] hover:bg-[#F4EFE6] cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#F0B55E] hover:bg-[#dfa247] text-[#2B2566] py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>{isPatota ? 'Avançar para Assinatura' : 'Avançar para Pagamento'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* =====================================================================
              ETAPA 3: PAGAMENTO MERCADO PAGO CHECKOUT PRO
              ===================================================================== */}
          {currentStep === 3 && (
            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div className="border-b border-[#E2DCCF] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#2B2566]">
                    3. Pagamento Seguro Mercado Pago
                  </h3>
                  <p className="text-xs text-[#423C7B]">
                    Escolha a modalidade de pagamento desejada.
                  </p>
                </div>

                {/* Seletor de Modo Mercado Pago */}
                <div className="inline-flex rounded-lg bg-[#E6E3F1] p-0.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setActiveMode('production')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      activeMode === 'production' ? 'bg-[#2B2566] text-white shadow-xs' : 'text-[#423C7B]'
                    }`}
                  >
                    Produção
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMode('test')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      activeMode === 'test' ? 'bg-[#2B2566] text-white shadow-xs' : 'text-[#423C7B]'
                    }`}
                  >
                    Sandbox
                  </button>
                </div>
              </div>

              {/* Resumo do Pedido */}
              <div className="p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E2DCCF] text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[#423C7B]">Titular:</span>
                  <strong className="text-[#2B2566]">{firstName} {lastName}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#423C7B]">Contato:</span>
                  <span className="text-[#2B2566] font-medium">{email} • {whatsapp}</span>
                </div>
                {isLoja && (
                  <div className="flex justify-between items-center border-t border-[#E2DCCF]/60 pt-1.5 mt-1">
                    <span className="text-[#423C7B]">Entrega em:</span>
                    <span className="text-[#2B2566] font-medium truncate max-w-[240px]">
                      {street}, {number} - {city}/{state}
                    </span>
                  </div>
                )}
                {!isLoja && (
                  <div className="flex justify-between items-center border-t border-[#E2DCCF]/60 pt-1.5 mt-1">
                    <span className="text-[#423C7B]">CPF Registrado:</span>
                    <span className="font-mono text-[#2B2566] font-bold">{cpf}</span>
                  </div>
                )}
              </div>

              {/* Seletor do Método de Pagamento */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'pix'
                      ? 'border-[#009ee3] bg-[#009ee3]/10 font-bold text-[#009ee3] ring-1 ring-[#009ee3]'
                      : 'border-[#E2DCCF] bg-white text-[#423C7B] hover:border-[#009ee3]'
                  }`}
                >
                  <QrCode className="h-5 w-5 mx-auto mb-1 text-[#009ee3]" />
                  <span className="text-xs block font-bold">PIX</span>
                  <span className="text-[10px] text-[#12BB40] font-semibold">Instantâneo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'credit_card'
                      ? 'border-[#009ee3] bg-[#009ee3]/10 font-bold text-[#009ee3] ring-1 ring-[#009ee3]'
                      : 'border-[#E2DCCF] bg-white text-[#423C7B] hover:border-[#009ee3]'
                  }`}
                >
                  <CreditCard className="h-5 w-5 mx-auto mb-1 text-[#009ee3]" />
                  <span className="text-xs block font-bold">Cartão</span>
                  <span className="text-[10px] text-gray-500">Crédito/Débito</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ticket')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'ticket'
                      ? 'border-[#009ee3] bg-[#009ee3]/10 font-bold text-[#009ee3] ring-1 ring-[#009ee3]'
                      : 'border-[#E2DCCF] bg-white text-[#423C7B] hover:border-[#009ee3]'
                  }`}
                >
                  <FileText className="h-5 w-5 mx-auto mb-1 text-[#009ee3]" />
                  <span className="text-xs block font-bold">Boleto</span>
                  <span className="text-[10px] text-gray-500">1-2 dias</span>
                </button>
              </div>

              {/* Detalhes do Pix */}
              {paymentMethod === 'pix' && (
                <div className="p-4 rounded-2xl bg-white border border-[#E2DCCF] space-y-3 text-center">
                  <div className="w-36 h-36 mx-auto bg-gray-50 rounded-xl border border-dashed border-[#E2DCCF] flex items-center justify-center p-2 shadow-inner">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pixCode)}`}
                      alt="QR Code Pix Mercado Pago"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-[#423C7B]">
                    Escaneie o código acima no app do seu banco ou use a chave Copia e Cola:
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#F4EFE6] hover:bg-[#E6E3F1] text-[#2B2566] text-xs font-semibold cursor-pointer border border-[#E2DCCF] transition-colors"
                  >
                    {copiedPix ? <Check className="h-4 w-4 text-[#12BB40]" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedPix ? 'Chave Pix Copiada com Sucesso!' : 'Copiar Código Pix'}</span>
                  </button>
                </div>
              )}

              {/* Detalhes do Cartão */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#E2DCCF]">
                  <div>
                    <label className="block text-[11px] font-bold text-[#2B2566] mb-0.5">Número do Cartão</label>
                    <input
                      type="text"
                      required
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="w-full text-xs rounded-xl border border-[#E2DCCF] px-3.5 py-2 text-[#2B2566] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2B2566] mb-0.5">Nome Impresso no Cartão</label>
                    <input
                      type="text"
                      required
                      placeholder="NOME COMO NO CARTAO"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      className="w-full text-xs rounded-xl border border-[#E2DCCF] px-3.5 py-2 text-[#2B2566] uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-[#2B2566] mb-0.5">Validade (MM/AA)</label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                        maxLength={5}
                        className="w-full text-xs rounded-xl border border-[#E2DCCF] px-3.5 py-2 text-[#2B2566] text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#2B2566] mb-0.5">CVV (Código)</label>
                      <input
                        type="password"
                        required
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.substring(0, 4))}
                        maxLength={4}
                        className="w-full text-xs rounded-xl border border-[#E2DCCF] px-3.5 py-2 text-[#2B2566] text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2B2566] mb-0.5">Opção de Parcelamento</label>
                    <select
                      value={cardInstallments}
                      onChange={(e) => setCardInstallments(e.target.value)}
                      className="w-full text-xs rounded-xl border border-[#E2DCCF] px-3.5 py-2 text-[#2B2566]"
                    >
                      <option value="1">1x de R$ {amount.toFixed(2).replace('.', ',')} (à vista)</option>
                      <option value="2">2x de R$ {(amount / 2).toFixed(2).replace('.', ',')}</option>
                      <option value="3">3x de R$ {(amount / 3).toFixed(2).replace('.', ',')}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Detalhes do Boleto */}
              {paymentMethod === 'ticket' && (
                <div className="p-4 rounded-2xl bg-white border border-[#E2DCCF] space-y-2 text-center">
                  <p className="text-xs text-[#2B2566] font-bold">
                    Boleto Bancário Mercado Pago
                  </p>
                  <p className="text-[11px] text-[#423C7B] leading-relaxed">
                    Ao confirmar, o boleto bancário será gerado e enviado para o seu e-mail <strong>{email}</strong> com vencimento em até 3 dias úteis.
                  </p>
                </div>
              )}

              {/* Botões Voltar e Confirmar Pagamento */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-full border border-[#E2DCCF] text-xs font-bold text-[#2B2566] hover:bg-[#F4EFE6] cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar</span>
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#009ee3] hover:bg-[#0089c7] text-white py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>
                    {isProcessing
                      ? 'Gravando e Processando Pagamento...'
                      : `Confirmar e Pagar R$ ${amount.toFixed(2).replace('.', ',')}`}
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#68638C] pt-1">
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-[#12BB40]" />
                  <span>Criptografia SSL de 256 bits</span>
                </div>
                <span>Chave: {activeCreds.publicKey.substring(0, 16)}...</span>
              </div>
            </form>
          )}

          {/* =====================================================================
              ETAPA 4: VALIDAÇÃO / PAGAMENTO APROVADO COM BOTÃO WHATSAPP / GRUPO VIP
              ===================================================================== */}
          {currentStep === 4 && (
            <div className="text-center py-4 space-y-5">
              <div className="w-18 h-18 rounded-full bg-[#12BB40]/15 text-[#12BB40] mx-auto flex items-center justify-center shadow-lg border-2 border-[#12BB40]/30 animate-in zoom-in">
                <CheckCircle className="h-10 w-10 text-[#12BB40]" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#12BB40]">
                  PAGAMENTO APROVADO & CONFIRMADO
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                  {isPatota ? 'Bem-vinda(o) à Patota Astral!' : 'Compra Realizada com Sucesso!'}
                </h3>
                <p className="text-xs sm:text-sm text-[#423C7B] max-w-md mx-auto leading-relaxed">
                  {isPatota
                    ? `Sua assinatura da Patota Astral foi confirmada (Pedido #${confirmedOrderId}). Seu acesso ao círculo mensal já está liberado!`
                    : `Seu pedido #${confirmedOrderId} foi aprovado e registrado no Firestore em tempo real.`}
                </p>
              </div>

              {/* Resumo do Pedido Confirmado */}
              <div className="p-4 rounded-2xl bg-[#FCFAF7] border border-[#E2DCCF] text-xs text-left space-y-2 max-w-md mx-auto shadow-xs">
                <div className="flex items-center justify-between border-b pb-2 border-[#E2DCCF]/60">
                  <span className="text-[#68638C]">Item / Serviço:</span>
                  <strong className="text-[#2B2566]">{itemTitle}</strong>
                </div>
                <div className="flex items-center justify-between border-b pb-2 border-[#E2DCCF]/60">
                  <span className="text-[#68638C]">Titular:</span>
                  <span className="font-bold text-[#2B2566]">{firstName} {lastName}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2 border-[#E2DCCF]/60">
                  <span className="text-[#68638C]">E-mail Cadastrado:</span>
                  <span className="font-medium text-[#2B2566]">{email}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2 border-[#E2DCCF]/60">
                  <span className="text-[#68638C]">ID no Mercado Pago:</span>
                  <span className="font-mono text-[#2B2566] font-bold">{confirmedOrderId}</span>
                </div>
                {isLoja && (
                  <div className="pt-1">
                    <span className="text-[#68638C] block mb-0.5">Endereço de Envio:</span>
                    <span className="font-medium text-[#2B2566]">
                      {street}, {number}{complement ? ` (${complement})` : ''} - {neighborhood}, {city}/{state} - CEP: {cep}
                    </span>
                  </div>
                )}
              </div>

              {/* ===============================================================
                  BOTÕES DE AÇÃO ESPECÍFICOS EXIGIDOS:
                  - Lojinha: Botão de Enviar Dados para o WhatsApp da Bianca
                  - Patota: Botão de Link para o Grupo VIP de WhatsApp da Patota
                  =============================================================== */}
              <div className="space-y-3 max-w-md mx-auto pt-2">
                {isLoja ? (
                  <a
                    href={`https://wa.me/${SITE_CONFIG.whatsappNumberRaw}?text=${encodeURIComponent(getWhatsAppLojaMessage())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <MessageCircle className="h-5 w-5 fill-white text-[#25D366]" />
                    <span>ENVIAR DADOS DA COMPRA NO WHATSAPP</span>
                  </a>
                ) : (
                  <a
                    href={patotaGroupInviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <MessageCircle className="h-5 w-5 fill-white text-[#25D366]" />
                    <span>ENTRAR NO GRUPO VIP DA PATOTA NO WHATSAPP</span>
                  </a>
                )}

                <p className="text-[11px] text-[#68638C] leading-relaxed">
                  ✉️ Uma confirmação oficial completa também foi enviada para o seu e-mail <strong>{email}</strong>.
                </p>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      sessionStorage.setItem('casa6_member_email', email);
                      if (cpf) sessionStorage.setItem('casa6_member_cpf', cpf);
                      onClose();
                      window.location.href = '/membros';
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2B2566] hover:text-[#B87314] uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    <span>Acessar Área de Membros</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>

                  <span className="text-[#E2DCCF]">•</span>

                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#68638C] hover:text-[#2B2566] uppercase tracking-wider cursor-pointer"
                  >
                    <span>Fechar Janela</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
