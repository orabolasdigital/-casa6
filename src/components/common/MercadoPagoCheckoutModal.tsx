/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Modal Oficial de Checkout Transparente Mercado Pago (Checkout Bricks @mercadopago/sdk-react)
 * 
 * Design Atualizado:
 * - Cantos Retos e Sóbrios (rounded-sm)
 * - Tipografia Sóbria e Legível (font-sans)
 * - Cores Oficiais da Casa 6
 * - Apenas Pix e Cartão de Crédito (Boleto Ocultado)
 * - Golden Rule of React Hooks: Todos os hooks no topo antes de qualquer condicional
 * - Tokenização direta no navegador via Payment Brick (PCI-DSS Compliant)
 * - Anti-Fraude com recálculo obrigatório de valor no backend
 * - Geração de Voucher Único (C6<YY><MM><DD>-<3primeirosCPF>)
 * - Bônus de 1ª Compra registrado
 * - Tríplice Confirmação: Síncrona + Webhook HMAC-SHA256 + Polling Ativo a cada 3s
 * - Validação estrita de CPF com algoritmo dos 11 dígitos da Receita Federal
 * - Disparo de Mensagem Oficial no WhatsApp
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import {
  X,
  CheckCircle,
  ShieldCheck,
  Copy,
  Check,
  Lock,
  ArrowRight,
  ArrowLeft,
  Truck,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Loader2,
  Gift,
  AlertCircle
} from 'lucide-react';
import {
  MERCADO_PAGO_CONFIG,
  createOrderRecord,
  saveCustomerRecord,
  createPaymentWithBrick,
  checkPaymentStatus,
  validateCPF,
  generateVoucherCode,
  CustomerRecord
} from '../../services/mercadopago';
import {
  sanitizeName,
  validateName,
  formatWhatsAppNumber,
  validateWhatsAppNumber,
  validateEmailAddress,
  lookupCRMContactByEmail,
  saveCRMContactRecord
} from '../../services/formValidation';
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
  // =========================================================================
  // REGRA DE OURO DOS HOOKS DO REACT:
  // Todos os useState, useEffect, useMemo e useCallback OBRIGATORIAMENTE no topo!
  // NENHUM if (!isOpen) return null; antes dos hooks!
  // =========================================================================

  // 1. Controle de Etapa (1: Identificação, 2: Envio/Dados Astrais, 3: Pagamento, 4: Concluído)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // 2. Etapa 1: Informações Pessoais (SEM CPF)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // 3. Etapa 2 (Lojinha): Endereço de Envio
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

  // 4. Etapa 2 (Patota Astral / Bússola): Dados Astrais & CPF
  const [cpf, setCpf] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthHour, setBirthHour] = useState('');
  const [birthMinute, setBirthMinute] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [birthState, setBirthState] = useState('');

  // 5. Etapa 3: Payment Brick & Estados de Transação
  const [isBrickReady, setIsBrickReady] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [stepError, setStepError] = useState('');

  // 6. Pix Pendente & Polling Redundante
  const [pendingPaymentId, setPendingPaymentId] = useState<string | number | null>(null);
  const [pixQrCode, setPixQrCode] = useState<string>('');
  const [pixQrCodeBase64, setPixQrCodeBase64] = useState<string>('');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isPollingActive, setIsPollingActive] = useState(false);

  // 7. Resultado da Compra Aprovada
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [confirmedVoucher, setConfirmedVoucher] = useState('');
  const [confirmedBonus, setConfirmedBonus] = useState('');

  // 7.1 Alerta de Divergência de Contato no CRM
  const [crmMismatchAlert, setCrmMismatchAlert] = useState<{
    show: boolean;
    existingWhatsapp: string;
    newWhatsapp: string;
  }>({ show: false, existingWhatsapp: '', newWhatsapp: '' });

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 8. Inicialização do SDK do Mercado Pago
  useEffect(() => {
    try {
      initMercadoPago(MERCADO_PAGO_CONFIG.production.publicKey, { locale: 'pt-BR' });
    } catch (err) {
      console.warn('[Mercado Pago SDK React Init]', err);
    }
  }, []);

  // 9. Sincronização inicial de dados ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setFirstName(customerData?.firstName || '');
      setLastName(customerData?.lastName || '');
      setEmail(customerData?.email || '');
      setWhatsapp(customerData?.whatsapp || '');
      if (customerData?.birthData) {
        setBirthDay(customerData.birthData.birthDay || '');
        setBirthMonth(customerData.birthData.birthMonth || '');
        setBirthYear(customerData.birthData.birthYear || '');
        setBirthHour(customerData.birthData.birthHour || '');
        setBirthMinute(customerData.birthData.birthMinute || '');
        setBirthCity(customerData.birthData.city || '');
        setBirthState(customerData.birthData.state || '');
      }
      setStepError('');
      setCurrentStep(1);
      setPendingPaymentId(null);
      setPixQrCode('');
      setPixQrCodeBase64('');
      setIsBrickReady(false);
      setIsPollingActive(false);
    }
  }, [isOpen, customerData]);

  // 10. Polling Ativo a cada 3 segundos (Canal de Fallback Redundante do Blueprint)
  useEffect(() => {
    if (isPollingActive && pendingPaymentId && currentStep === 3) {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await checkPaymentStatus(pendingPaymentId);
          if (statusRes.status === 'approved') {
            setIsPollingActive(false);
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            setCurrentStep(4);
          }
        } catch (pollErr) {
          console.warn('[Polling Status Warning]', pollErr);
        }
      }, 3000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isPollingActive, pendingPaymentId, currentStep]);

  // 11. Configuração de Inicialização do Payment Brick
  const brickInitialization = useMemo(() => ({
    amount: Number(amount.toFixed(2)),
    payer: {
      email: (email || 'cliente@casa6.com.br').trim().toLowerCase(),
    }
  }), [amount, email]);

  // 12. Métodos e Customização do Payment Brick (Exclusivo: Pix e Cartão de Crédito)
  const brickCustomization = useMemo(() => ({
    paymentMethods: {
      creditCard: "all" as const,
      bankTransfer: "all" as const,
      types: {
        excluded: ["ticket", "atm", "debitCard"] as ("ticket" | "atm" | "debitCard")[]
      }
    },
    visual: {
      style: {
        theme: 'default' as const,
        customVariables: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }
      }
    }
  }), []);

  // 13. Submissão do Pagamento pelo Brick (com Tokenização Segura e Anti-Fraude)
  const handleBrickSubmit = useCallback(async (brickParam: any) => {
    const { formData } = brickParam;
    setIsProcessingPayment(true);
    setStepError('');

    try {
      const cleanEmail = email.trim().toLowerCase();
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const cleanCpf = cpf.trim() || (serviceType === 'loja' ? '000.000.000-00' : '123.456.789-00');

      const shippingPayload: ShippingAddress | undefined = serviceType === 'loja'
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

      const birthDataPayload: BirthData | undefined = serviceType !== 'loja'
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

      // Chama a rota de pagamento backend protegida contra manipulação de preço
      const result = await createPaymentWithBrick({
        formData,
        payerConfig: {
          itemTitle,
          amount,
          serviceType,
          customerName: fullName,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: cleanEmail,
          whatsapp,
          cpf: cleanCpf,
          shippingAddress: shippingPayload,
          birthData: birthDataPayload
        }
      });

      const orderVoucher = result.voucherCode || generateVoucherCode(cleanCpf);
      const bonusCode = result.bonusConsumacao || `BEMVINDA-${orderVoucher}`;

      // Salva no banco de dados (/customers e /orders)
      const customerRecord: CustomerRecord = {
        id: `cust_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
        fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: cleanEmail,
        whatsapp,
        cpf: cleanCpf,
        shippingAddress: shippingPayload,
        birthData: birthDataPayload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastOrderId: result.orderId
      };
      await saveCustomerRecord(customerRecord);

      await createOrderRecord({
        memberEmail: cleanEmail,
        memberCpf: cleanCpf,
        customerName: fullName,
        whatsapp: whatsapp.replace(/\D/g, ''),
        serviceType,
        itemTitle,
        amount,
        paymentMethod: formData.payment_method_id === 'pix' ? 'pix' : 'credit_card',
        voucherCode: orderVoucher,
        bonusConsumacao: bonusCode,
        birthData: birthDataPayload,
        shippingAddress: shippingPayload
      });

      setConfirmedOrderId(result.orderId);
      setConfirmedVoucher(orderVoucher);
      setConfirmedBonus(bonusCode);

      // (A) Canal Síncrono Aprovado Imediato
      if (result.status === 'approved') {
        setCurrentStep(4);
        if (onSuccess) onSuccess(result.orderId);
        return;
      }

      // (B) Canal Pix Pendente (Exibe QR Code + Copia e Cola + Ativa Polling de 3s)
      if (result.status === 'pending' || result.status === 'in_process') {
        setPendingPaymentId(result.id);
        const qr = result.point_of_interaction?.transaction_data?.qr_code || '';
        const qrBase64 = result.point_of_interaction?.transaction_data?.qr_code_base64 || '';

        setPixQrCode(qr);
        setPixQrCodeBase64(qrBase64);
        setIsPollingActive(true);
        return;
      }

      // (C) Rejeitado
      if (result.status === 'rejected') {
        setStepError('O pagamento não pôde ser aprovado pela operadora. Verifique os dados ou tente outro cartão.');
      }
    } catch (err: any) {
      console.error('[Mercado Pago Brick Submit Error]', err);
      setStepError(err.message || 'Falha ao processar o pagamento com o Mercado Pago.');
    } finally {
      setIsProcessingPayment(false);
    }
  }, [
    email,
    firstName,
    lastName,
    cpf,
    serviceType,
    cep,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    shippingNotes,
    birthDay,
    birthMonth,
    birthYear,
    birthHour,
    birthMinute,
    birthCity,
    birthState,
    itemTitle,
    amount,
    whatsapp,
    onSuccess
  ]);

  // =========================================================================
  // APÓS TODOS OS HOOKS: VERIFICAÇÃO SE O MODAL ESTÁ ABERTO
  // =========================================================================
  if (!isOpen) return null;

  const isLoja = serviceType === 'loja';
  const isPatota = serviceType === 'patota';

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
          setCepError('CEP não encontrado. Preencha o endereço manualmente.');
        } else {
          setStreet(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || '');
          setState(data.uf || '');
        }
      } catch {
        setCepError('Falha ao consultar CEP. Preencha manualmente.');
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  // Busca e Autopreenchimento de CRM ao sair do campo E-mail
  const handleEmailBlur = async () => {
    if (!email || !email.includes('@')) return;
    try {
      const contact = await lookupCRMContactByEmail(email);
      if (contact) {
        if (!firstName && contact.firstName) setFirstName(contact.firstName);
        if (!lastName && contact.lastName) setLastName(contact.lastName);

        const cleanExisting = contact.whatsapp.replace(/\D/g, '');
        const cleanCurrent = whatsapp.replace(/\D/g, '');
        if (cleanExisting && cleanCurrent && cleanExisting !== cleanCurrent) {
          setCrmMismatchAlert({
            show: true,
            existingWhatsapp: contact.whatsapp,
            newWhatsapp: whatsapp
          });
        }
      }
    } catch (err) {
      console.warn('[CRM Lookup Error]', err);
    }
  };

  // Validação e Avanço da Etapa 1 (Regras Padronizadas)
  const handleNextFromStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepError('');

    const nameVal = validateName(firstName, 'Nome');
    if (!nameVal.isValid && nameVal.error) {
      setStepError(nameVal.error);
      return;
    }

    const lastNameVal = validateName(lastName, 'Sobrenome');
    if (!lastNameVal.isValid && lastNameVal.error) {
      setStepError(lastNameVal.error);
      return;
    }

    const phoneVal = validateWhatsAppNumber(whatsapp);
    if (!phoneVal.isValid && phoneVal.error) {
      setStepError(phoneVal.error);
      return;
    }

    const emailVal = validateEmailAddress(email);
    if (!emailVal.isValid && emailVal.error) {
      setStepError(emailVal.error);
      return;
    }

    // Salvar/Sincronizar no CRM
    try {
      await saveCRMContactRecord({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim().toLowerCase(),
        whatsapp: whatsapp.trim(),
        lastSource: serviceType
      });
    } catch (crmErr) {
      console.warn('[CRM Sync Warning]', crmErr);
    }

    setCurrentStep(2);
  };

  // Validação e Avanço da Etapa 2 (com Validação Estrita de CPF de 11 dígitos)
  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStepError('');

    if (isLoja) {
      const cleanCep = cep.replace(/\D/g, '');
      if (cleanCep.length !== 8) {
        setStepError('Informe um CEP válido com 8 dígitos.');
        return;
      }
      if (!street.trim()) {
        setStepError('Informe a rua / logradouro.');
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
      // Validação Estrita com o Algoritmo Oficial de CPF da Receita Federal
      if (!validateCPF(cpf)) {
        setStepError('O CPF informado é inválido. Por favor, verifique os 11 dígitos.');
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
    if (pixQrCode) {
      navigator.clipboard.writeText(pixQrCode);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  // Mensagem WhatsApp formatada
  const getWhatsAppApprovedMessage = () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    if (isLoja) {
      return `Olá, Bianca! Acabei de realizar a compra de "${itemTitle}" pelo site da Casa 6.\n\n` +
        `• Pedido: #${confirmedOrderId}\n` +
        `• Voucher: ${confirmedVoucher}\n` +
        `• Valor: R$ ${amount.toFixed(2).replace('.', ',')}\n` +
        `• Nome: ${fullName}\n` +
        `• WhatsApp: ${whatsapp}\n` +
        `• E-mail: ${email}\n\n` +
        `📍 Endereço de Envio:\n` +
        `${street}, nº ${number}${complement ? ` - ${complement}` : ''}\n` +
        `Bairro: ${neighborhood} - ${city}/${state} (CEP: ${cep})\n` +
        (shippingNotes ? `Obs: ${shippingNotes}\n` : '');
    }

    return `Olá, Bianca! Fiz a adesão de "${itemTitle}" pelo site da Casa 6.\n\n` +
      `• Pedido: #${confirmedOrderId}\n` +
      `• Voucher: ${confirmedVoucher}\n` +
      `• Nome: ${fullName}\n` +
      `• WhatsApp: ${whatsapp}\n` +
      `• E-mail: ${email}\n` +
      `• CPF: ${cpf}\n\n` +
      `Pode confirmar meu acesso à Patota Astral?`;
  };

  const patotaGroupInviteUrl = 'https://chat.whatsapp.com/invite/patota-astral-casa6-oficial';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2B2566]/85 backdrop-blur-xs animate-in fade-in font-sans checkout-modal"
      role="dialog"
      aria-modal="true"
    >
      {/* Container Principal: Cantos Retos (rounded-sm) e Visual Sóbrio */}
      <div className="relative w-full max-w-xl rounded-sm bg-[#FCFAF7] border border-[#D5CEBF] shadow-2xl overflow-hidden flex flex-col max-h-[94vh] checkout-modal font-sans">
        
        {/* =========================================================================
            HEADER OFICIAL CASA 6 (FONTES SÓBRIAS E CANTOS RETOS)
            ========================================================================= */}
        <div className="bg-gradient-to-r from-[#2B2566] via-[#211B55] to-[#362E7A] text-white p-5 flex items-center justify-between shrink-0 border-b border-[#F0B55E]/30 relative font-sans">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-sm bg-[#FCFAF7] p-1.5 flex items-center justify-center shadow-xs border border-[#F0B55E]/40">
              <img
                src="https://static.wixstatic.com/media/02c8e0_bce65db1891746ca848f16f8403ddaed~mv2.png"
                alt="Casa 6"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F0B55E]">
                  Casa 6 • Bianca Tofoli
                </span>
                <span className="text-[10px] text-[#E6E3F1]/70">
                  • Checkout Seguro
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-white line-clamp-1 mt-0.5 tracking-tight">
                {itemTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-[#E6E3F1]/80 uppercase tracking-wider block">Total</span>
              <span className="font-bold text-base sm:text-lg text-[#F0B55E]">
                R$ {amount.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fechar checkout"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            BARRA DE PROGRESSO EM 3 ETAPAS OFICIAIS (CANTOS RETOS)
            ========================================================================= */}
        {currentStep < 4 && (
          <div className="bg-[#F4EFE6] px-5 py-2.5 border-b border-[#E2DCCF] flex items-center justify-between font-sans">
            <div className="flex items-center gap-2 sm:gap-4 w-full">
              {/* Etapa 1 */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold transition-all ${
                    currentStep === 1
                      ? 'bg-[#F0B55E] text-[#2B2566] ring-1 ring-[#2B2566]'
                      : currentStep > 1
                      ? 'bg-[#12BB40] text-white'
                      : 'bg-[#E2DCCF] text-[#68638C]'
                  }`}
                >
                  {currentStep > 1 ? '✓' : '1'}
                </span>
                <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${currentStep === 1 ? 'text-[#2B2566]' : 'text-[#68638C]'}`}>
                  Identificação
                </span>
              </div>

              <div className="flex-1 h-px bg-[#E2DCCF]"></div>

              {/* Etapa 2 */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold transition-all ${
                    currentStep === 2
                      ? 'bg-[#F0B55E] text-[#2B2566] ring-1 ring-[#2B2566]'
                      : currentStep > 2
                      ? 'bg-[#12BB40] text-white'
                      : 'bg-[#E2DCCF] text-[#68638C]'
                  }`}
                >
                  {currentStep > 2 ? '✓' : '2'}
                </span>
                <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${currentStep === 2 ? 'text-[#2B2566]' : 'text-[#68638C]'}`}>
                  {isLoja ? 'Envio' : 'Dados Astrais & CPF'}
                </span>
              </div>

              <div className="flex-1 h-px bg-[#E2DCCF]"></div>

              {/* Etapa 3 */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold transition-all ${
                    currentStep === 3
                      ? 'bg-[#F0B55E] text-[#2B2566] ring-1 ring-[#2B2566]'
                      : 'bg-[#E2DCCF] text-[#68638C]'
                  }`}
                >
                  3
                </span>
                <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${currentStep === 3 ? 'text-[#2B2566]' : 'text-[#68638C]'}`}>
                  Pagamento Seguro
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mensagem de Erro de Validação */}
        {stepError && (
          <div className="mx-5 mt-4 p-3 rounded-sm bg-red-50 border border-red-200 text-red-800 text-xs font-sans">
            {stepError}
          </div>
        )}

        {/* =========================================================================
            CORPO DO MODAL (FONTES SÓBRIAS E LEGÍVEIS)
            ========================================================================= */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 font-sans">
          
          {/* =====================================================================
              ETAPA 1: IDENTIFICAÇÃO (SEM CPF)
              ===================================================================== */}
          {currentStep === 1 && (
            <form onSubmit={handleNextFromStep1} className="space-y-4">
              <div className="border-b border-[#E2DCCF] pb-2.5">
                <h3 className="text-sm sm:text-base font-semibold text-[#2B2566] tracking-normal font-sans">
                  1. Seus Dados de Contato
                </h3>
                <p className="text-xs text-[#423C7B] mt-0.5">
                  Informe seus dados para emissão do voucher oficial e notificações.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#2B2566] mb-1">
                    Primeiro Nome *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    autoComplete="given-name"
                    placeholder="Ex: Mariana"
                    value={firstName}
                    onChange={(e) => setFirstName(sanitizeName(e.target.value))}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#2B2566] focus:outline-none transition-colors"
                  />
                  <span className="text-[10px] text-[#68638C]">3 a 15 letras (sem números ou símbolos)</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#2B2566] mb-1">
                    Sobrenome *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    autoComplete="family-name"
                    placeholder="Ex: Duarte"
                    value={lastName}
                    onChange={(e) => setLastName(sanitizeName(e.target.value))}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#2B2566] focus:outline-none transition-colors"
                  />
                  <span className="text-[10px] text-[#68638C]">3 a 15 letras (sem números ou símbolos)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#2B2566] mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="(11) 99999-9999"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(formatWhatsAppNumber(e.target.value))}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#2B2566] focus:outline-none transition-colors"
                  />
                  <span className="text-[10px] text-[#68638C]">DDD + Número válido ou internacional (+...)</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#2B2566] mb-1">
                    E-mail para Receber o Pedido *
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="mariana@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#2B2566] focus:outline-none transition-colors"
                  />
                  <span className="text-[10px] text-[#68638C]">Provedores válidos (Gmail, Hotmail, Outlook, etc.)</span>
                </div>
              </div>

              {/* Alerta de Divergência de Contato no CRM */}
              {crmMismatchAlert.show && (
                <div className="p-3 bg-[#F4EFE6] border border-[#F0B55E] text-[#2B2566] text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-[#B87314] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[11px] text-[#B87314]">
                        Cadastro Existente Localizado no CRM
                      </p>
                      <p className="text-[11px] text-[#423C7B] mt-0.5">
                        Identificamos que seu e-mail já possui o WhatsApp <strong>{crmMismatchAlert.existingWhatsapp}</strong> cadastrado. Deseja atualizar seu WhatsApp de contato para <strong>{crmMismatchAlert.newWhatsapp}</strong>?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1 pl-6">
                    <button
                      type="button"
                      onClick={() => setCrmMismatchAlert({ show: false, existingWhatsapp: '', newWhatsapp: '' })}
                      className="px-3 py-1 bg-[#2B2566] text-white text-[10px] font-bold uppercase rounded-sm hover:bg-[#362E7A] cursor-pointer"
                    >
                      Sim, Atualizar WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWhatsapp(crmMismatchAlert.existingWhatsapp);
                        setCrmMismatchAlert({ show: false, existingWhatsapp: '', newWhatsapp: '' });
                      }}
                      className="px-3 py-1 bg-white border border-[#D5CEBF] text-[#2B2566] text-[10px] font-bold uppercase rounded-sm hover:bg-[#F4EFE6] cursor-pointer"
                    >
                      Manter Número Anterior
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-sm bg-[#F0B55E] hover:bg-[#dfa247] text-[#2B2566] py-3 px-5 text-xs font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                >
                  <span>{isLoja ? 'Avançar para Endereço de Envio' : 'Avançar para Dados Astrais & CPF'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* =====================================================================
              ETAPA 2 (LOJINHA): ENDEREÇO DE ENVIO (VIACEP)
              ===================================================================== */}
          {currentStep === 2 && isLoja && (
            <form onSubmit={handleNextFromStep2} className="space-y-4">
              <div className="border-b border-[#E2DCCF] pb-2.5">
                <h3 className="text-sm sm:text-base font-semibold text-[#2B2566] flex items-center gap-2 tracking-normal font-sans">
                  <Truck className="h-4 w-4 text-[#B87314]" />
                  <span>2. Endereço de Envio</span>
                </h3>
                <p className="text-xs text-[#423C7B] mt-0.5">
                  Informe o CEP para preenchimento automático do endereço.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2B2566] mb-1">
                  CEP (Obrigatório) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoComplete="postal-code"
                    placeholder="00000-000"
                    value={cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    maxLength={9}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3.5 py-2.5 text-[#2B2566] font-mono focus:border-[#2B2566] focus:outline-none"
                  />
                  {isLoadingCep && (
                    <div className="absolute right-3 top-2.5 text-[#B87314] flex items-center gap-1.5 text-xs">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span className="text-[10px]">Buscando CEP...</span>
                    </div>
                  )}
                </div>
                {cepError && (
                  <p className="text-[11px] text-red-600 mt-1">{cepError}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="block text-[11px] font-semibold text-[#2B2566] mb-1">
                    Rua / Avenida / Logradouro *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="address-line1"
                    placeholder="Preenchido pelo CEP"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#2B2566] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-semibold text-[#2B2566] mb-1">
                    Número *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="address-line2"
                    placeholder="123"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#2B2566] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#2B2566] mb-1">
                    Complemento (Opcional)
                  </label>
                  <input
                    type="text"
                    autoComplete="address-line3"
                    placeholder="Apto 101, Bloco B"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#2B2566] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#2B2566] mb-1">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="address-level3"
                    placeholder="Bairro"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#2B2566] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="block text-[11px] font-semibold text-[#2B2566] mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="address-level2"
                    placeholder="Cidade"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#2B2566] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-semibold text-[#2B2566] mb-1">
                    Estado (UF) *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="address-level1"
                    placeholder="SP"
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3.5 py-2.5 text-[#2B2566] uppercase text-center font-bold focus:border-[#2B2566] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2B2566] mb-1">
                  Observações para a Entrega (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Instruções para o entregador, ponto de referência..."
                  value={shippingNotes}
                  onChange={(e) => setShippingNotes(e.target.value)}
                  className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3.5 py-2 text-[#2B2566] focus:border-[#2B2566] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm border border-[#D5CEBF] text-xs font-semibold text-[#2B2566] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 rounded-sm bg-[#F0B55E] hover:bg-[#dfa247] text-[#2B2566] py-3 px-5 text-xs font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                >
                  <span>Avançar para Pagamento Seguro</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* =====================================================================
              ETAPA 2 (PATOTA ASTRAL & BÚSSOLA): DADOS ASTRAIS & CPF OBRIGATÓRIO
              ===================================================================== */}
          {currentStep === 2 && !isLoja && (
            <form onSubmit={handleNextFromStep2} className="space-y-4">
              <div className="border-b border-[#E2DCCF] pb-2.5">
                <h3 className="text-sm sm:text-base font-semibold text-[#2B2566] flex items-center gap-2 tracking-normal font-sans">
                  <Sparkles className="h-4 w-4 text-[#F0B55E]" />
                  <span>2. Dados Astrais & CPF</span>
                </h3>
                <p className="text-xs text-[#423C7B] mt-0.5">
                  Necessários para o mapa astral e acesso individual à Área de Membros.
                </p>
              </div>

              {/* Campo CPF (com validação estrita de 11 dígitos) */}
              <div>
                <label className="block text-[11px] font-semibold text-[#2B2566] mb-1">
                  CPF do Titular (Validado Receita Federal) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  maxLength={14}
                  className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3.5 py-2.5 text-[#2B2566] font-mono focus:border-[#2B2566] focus:outline-none"
                />
              </div>

              {/* Data de Nascimento */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-semibold text-[#2B2566] mb-1">Dia *</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    placeholder="DD"
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3 py-2 text-center text-[#2B2566]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#2B2566] mb-1">Mês *</label>
                  <select
                    required
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-2 py-2 text-center text-[#2B2566]"
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
                  <label className="block text-[10px] font-semibold text-[#2B2566] mb-1">Ano *</label>
                  <input
                    type="number"
                    min="1920"
                    max="2026"
                    required
                    placeholder="AAAA"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3 py-2 text-center text-[#2B2566]"
                  />
                </div>
              </div>

              {/* Horário de Nascimento */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-semibold text-[#2B2566] mb-1">Hora de Nascimento (00-23) *</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    required
                    placeholder="14"
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3 py-2 text-center text-[#2B2566]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#2B2566] mb-1">Minuto (00-59) *</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    required
                    placeholder="30"
                    value={birthMinute}
                    onChange={(e) => setBirthMinute(e.target.value)}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3 py-2 text-center text-[#2B2566]"
                  />
                </div>
              </div>

              {/* Cidade e Estado de Nascimento */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="block text-[11px] font-semibold text-[#2B2566] mb-1">
                    Cidade de Nascimento *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: São Paulo"
                    value={birthCity}
                    onChange={(e) => setBirthCity(e.target.value)}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3.5 py-2.5 text-[#2B2566]"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-semibold text-[#2B2566] mb-1">
                    Estado (UF) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="SP"
                    maxLength={2}
                    value={birthState}
                    onChange={(e) => setBirthState(e.target.value.toUpperCase())}
                    className="w-full text-xs rounded-sm border border-[#D5CEBF] bg-white px-3.5 py-2.5 text-[#2B2566] uppercase text-center font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm border border-[#D5CEBF] text-xs font-semibold text-[#2B2566] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 rounded-sm bg-[#F0B55E] hover:bg-[#dfa247] text-[#2B2566] py-3 px-5 text-xs font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                >
                  <span>{isPatota ? 'Avançar para Assinatura' : 'Avançar para Pagamento Seguro'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* =====================================================================
              ETAPA 3: PAGAMENTO SEGURO VIA CHECKOUT BRICKS (@mercadopago/sdk-react)
              ===================================================================== */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-b border-[#E2DCCF] pb-2.5">
                <h3 className="text-sm sm:text-base font-semibold text-[#2B2566] flex items-center gap-2 tracking-normal font-sans">
                  <ShieldCheck className="h-4 w-4 text-[#12BB40]" />
                  <span>3. Pagamento Transparente Mercado Pago</span>
                </h3>
                <p className="text-xs text-[#423C7B] mt-0.5">
                  Preencha diretamente no modal seguro (Cartão de Crédito ou Pix Instantâneo).
                </p>
              </div>

              {/* Resumo do Pedido (Cantos Retos e Tipografia Sóbria) */}
              <div className="p-3.5 rounded-sm bg-[#F4EFE6] border border-[#E2DCCF] text-xs space-y-1.5 font-sans">
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

              {/* Se Pix estiver Pendente: Exibe QR Code + Copia e Cola + Polling Ativo */}
              {pendingPaymentId && (
                <div className="p-4 rounded-sm bg-white border border-[#12BB40] text-center space-y-3 shadow-xs">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#12BB40] uppercase tracking-wider">
                    <Loader2 className="h-4 w-4 animate-spin text-[#12BB40]" />
                    <span>Aguardando Pagamento Pix (Sincronização em Tempo Real)</span>
                  </div>

                  {pixQrCodeBase64 ? (
                    <div className="w-40 h-40 mx-auto bg-white p-2 rounded-sm border border-[#E2DCCF] flex items-center justify-center">
                      <img
                        src={`data:image/png;base64,${pixQrCodeBase64}`}
                        alt="QR Code Pix Oficial"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : pixQrCode ? (
                    <div className="w-40 h-40 mx-auto bg-white p-2 rounded-sm border border-[#E2DCCF] flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(pixQrCode)}`}
                        alt="QR Code Pix Oficial"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : null}

                  <p className="text-xs text-[#423C7B]">
                    Escaneie o QR Code no seu banco ou use a chave Copia e Cola:
                  </p>

                  {pixQrCode && (
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-sm bg-[#F4EFE6] hover:bg-[#E6E3F1] text-[#2B2566] text-xs font-bold border border-[#E2DCCF] transition-colors cursor-pointer"
                    >
                      {copiedPix ? <Check className="h-4 w-4 text-[#12BB40]" /> : <Copy className="h-4 w-4" />}
                      <span>{copiedPix ? 'Chave Pix Copiada com Sucesso!' : 'Copiar Código Pix (Copia e Cola)'}</span>
                    </button>
                  )}

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={async () => {
                        setIsProcessingPayment(true);
                        const statusRes = await checkPaymentStatus(pendingPaymentId);
                        setIsProcessingPayment(false);
                        if (statusRes.status === 'approved') {
                          setCurrentStep(4);
                        } else {
                          setStepError('O pagamento ainda consta como pendente no banco. Se já pagou, aguarde alguns segundos.');
                        }
                      }}
                      className="w-full py-2.5 px-4 rounded-sm bg-[#12BB40] hover:bg-[#0fa437] text-white text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer transition-colors"
                    >
                      {isProcessingPayment ? 'Verificando com o Banco...' : 'Já Realizei o Pagamento / Confirmar'}
                    </button>
                  </div>
                </div>
              )}

              {/* Renderização do Checkout Bricks Oficial (@mercadopago/sdk-react) */}
              {!pendingPaymentId && (
                <div className="relative min-h-[300px]">
                  {!isBrickReady && (
                    <div className="py-8 text-center space-y-2">
                      <Loader2 className="h-5 w-5 animate-spin text-[#F0B55E] mx-auto" />
                      <p className="text-xs text-[#68638C]">
                        Carregando ambiente seguro de pagamento Mercado Pago...
                      </p>
                    </div>
                  )}

                  <div className={isBrickReady ? 'block' : 'opacity-0'}>
                    <Payment
                      initialization={brickInitialization}
                      customization={brickCustomization}
                      onSubmit={handleBrickSubmit}
                      onReady={() => setIsBrickReady(true)}
                      onError={(err) => {
                        console.error('[Mercado Pago Brick Error]', err);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Botão de Retorno */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm border border-[#D5CEBF] text-xs font-semibold text-[#2B2566] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar</span>
                </button>

                <div className="flex items-center gap-1 text-[11px] text-[#68638C]">
                  <Lock className="h-3.5 w-3.5 text-[#12BB40]" />
                  <span>Criptografia SSL de 256 bits</span>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              ETAPA 4: VALIDAÇÃO & SUCESSO COM VOUCHER, BÔNUS E BOTÃO WHATSAPP
              ===================================================================== */}
          {currentStep === 4 && (
            <div className="text-center py-3 space-y-4 font-sans">
              <div className="w-12 h-12 rounded-sm bg-[#12BB40]/15 text-[#12BB40] mx-auto flex items-center justify-center border border-[#12BB40]/30">
                <CheckCircle className="h-7 w-7 text-[#12BB40]" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#12BB40]">
                  PAGAMENTO APROVADO & CONFIRMADO
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#2B2566] tracking-normal font-sans">
                  {isPatota ? 'Bem-vinda(o) à Patota Astral!' : 'Compra Confirmada com Sucesso!'}
                </h3>
                <p className="text-xs text-[#423C7B] max-w-md mx-auto leading-relaxed">
                  {isPatota
                    ? `Sua assinatura da Patota Astral foi confirmada (Pedido #${confirmedOrderId}). Seu acesso ao círculo mensal já está liberado!`
                    : `Seu pedido #${confirmedOrderId} foi aprovado e o voucher oficial já está gerado.`}
                </p>
              </div>

              {/* Cartão do Voucher e Bônus de 1ª Compra (Cantos Retos) */}
              <div className="p-4 rounded-sm bg-gradient-to-br from-[#2B2566] to-[#362E7A] text-white text-left space-y-2 max-w-md mx-auto shadow-xs border border-[#F0B55E]/40 font-sans">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs text-[#E6E3F1]">Código do Voucher:</span>
                  <span className="font-mono text-sm font-bold text-[#F0B55E] tracking-wider">
                    {confirmedVoucher || 'C6261111-CONFIRMADO'}
                  </span>
                </div>

                {confirmedBonus && (
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs text-[#E6E3F1] flex items-center gap-1.5">
                      <Gift className="h-3.5 w-3.5 text-[#F0B55E]" />
                      <span>Bônus de Boas-Vindas:</span>
                    </span>
                    <span className="font-mono text-xs font-bold text-[#12BB40]">
                      {confirmedBonus}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <span className="text-[#E6E3F1]">Titular:</span>
                  <span className="font-bold text-white">{firstName} {lastName}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#E6E3F1]">E-mail Registrado:</span>
                  <span className="text-white truncate max-w-[180px]">{email}</span>
                </div>

                {isLoja && street && (
                  <div className="border-t border-white/10 pt-2 text-[11px] text-[#E6E3F1]">
                    <span className="block font-bold text-white mb-0.5">Endereço de Envio:</span>
                    <span>{street}, nº {number} - {neighborhood}, {city}/{state} (CEP: {cep})</span>
                  </div>
                )}
              </div>

              {/* Botões de Ação no WhatsApp (Cantos Retos) */}
              <div className="space-y-2.5 max-w-md mx-auto pt-1 font-sans">
                {isLoja ? (
                  <a
                    href={`https://wa.me/${SITE_CONFIG.whatsappNumberRaw}?text=${encodeURIComponent(getWhatsAppApprovedMessage())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-5 text-xs uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4 fill-white text-[#25D366]" />
                    <span>ENVIAR COMPROVANTE VIA WHATSAPP</span>
                  </a>
                ) : (
                  <a
                    href={patotaGroupInviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-5 text-xs uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4 fill-white text-[#25D366]" />
                    <span>ENTRAR NO GRUPO VIP DA PATOTA NO WHATSAPP</span>
                  </a>
                )}

                <p className="text-[11px] text-[#68638C] leading-relaxed">
                  ✉️ Uma confirmação oficial completa foi enviada para o seu e-mail <strong>{email}</strong>.
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
                    <ExternalLink className="h-3 w-3" />
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
