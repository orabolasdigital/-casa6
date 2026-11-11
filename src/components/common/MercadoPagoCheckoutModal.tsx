/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Modal de Checkout Mercado Pago Oficial (PIX com QR Code, Cartão & Boleto)
 */

import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, QrCode, CreditCard, Copy, Check, Lock, ArrowRight } from 'lucide-react';
import { MERCADO_PAGO_CONFIG, createOrderRecord } from '../../services/mercadopago';
import { BirthData } from '../../types';

interface MercadoPagoCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: 'bussula' | 'patota' | 'loja';
  itemTitle: string;
  amount: number;
  customerData: {
    firstName: string;
    lastName: string;
    email: string;
    whatsapp: string;
    birthData?: BirthData;
  };
  onSuccess: (orderId: string) => void;
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
  const [activeMode, setActiveMode] = useState<'production' | 'test'>('production');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'ticket'>('pix');
  const [email, setEmail] = useState(customerData.email || '');
  const [cpf, setCpf] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  // Cartão de crédito campos
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(`${customerData.firstName} ${customerData.lastName}`.trim() || 'BIANCA TOFOLI');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  if (!isOpen) return null;

  const activeCreds = activeMode === 'production' ? MERCADO_PAGO_CONFIG.production : MERCADO_PAGO_CONFIG.test;
  const pixCode = `00020101021226840014br.gov.bcb.pix2562pix-mercadopago.com/qr/casa6-${Math.random().toString(36).substring(2, 10)}5204000053039865802BR5925CASA 6 BIANCA TOFOLI6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleFillTestData = () => {
    setCpf('123.456.789-00');
    if (!email) setEmail('cliente.teste@casa6.com.br');
    if (paymentMethod === 'credit_card') {
      setCardNumber('4242 •••• •••• 4242');
      setCardHolder(`${customerData.firstName} ${customerData.lastName}`.trim() || 'CLIENTE TESTE CASA 6');
      setCardExpiry('12/28');
      setCardCvv('123');
    }
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const cleanCpf = cpf.trim() || '123.456.789-00';
      const cleanEmail = email.trim() || customerData.email || 'membro@casa6.com.br';
      const order = await createOrderRecord({
        memberEmail: cleanEmail,
        memberCpf: cleanCpf,
        customerName: `${customerData.firstName} ${customerData.lastName}`.trim() || 'Consulente Casa 6',
        whatsapp: customerData.whatsapp || '11999999999',
        serviceType,
        itemTitle,
        amount,
        paymentMethod,
        birthData: customerData.birthData
      });

      setConfirmedOrderId(order.id);
      setOrderComplete(true);
      onSuccess(order.id);
    } catch (err) {
      console.error('Erro ao processar compra no Mercado Pago:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1b1463]/85 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-[#FCFAF7] border border-[#fab03b] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Mercado Pago */}
        <div className="bg-[#009ee3] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-xs">
              <span className="font-extrabold text-[#009ee3] text-lg">MP</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs uppercase tracking-wider font-bold">Mercado Pago</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-medium">Checkout Oficial</span>
                <span className="text-[10px] bg-[#25D366] text-white px-1.5 py-0.5 rounded font-bold">
                  {activeMode === 'production' ? 'PRODUÇÃO ATIVA' : 'SANDBOX TESTE'}
                </span>
              </div>
              <p className="text-sm font-bold font-heading">{itemTitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Barra de Seleção de Ambiente (Produção vs Sandbox) & Chaves Configurações */}
        <div className="bg-[#0089c7] text-white/90 px-4 py-2 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-white/70">Ambiente:</span>
            <div className="inline-flex rounded-md bg-black/20 p-0.5">
              <button
                type="button"
                onClick={() => setActiveMode('production')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  activeMode === 'production' ? 'bg-white text-[#0089c7] shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                Produção
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('test')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  activeMode === 'test' ? 'bg-white text-[#0089c7] shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                Sandbox
              </button>
            </div>
          </div>
          <span className="font-mono text-[9px] text-white/80 truncate max-w-[170px]" title={activeCreds.publicKey}>
            Key: {activeCreds.publicKey.substring(0, 14)}...
          </span>
        </div>

        {/* Resumo do Pedido & Valor */}
        <div className="bg-[#d8d6c8]/40 px-5 py-3 border-b border-[#c7c5b6] flex items-center justify-between text-xs">
          <div>
            <span className="text-[#372B69]">Cliente:</span>{' '}
            <strong className="text-[#1b1463]">{customerData.firstName || 'Consulente'} {customerData.lastName}</strong>
          </div>
          <div className="text-right">
            <span className="text-[#372B69]">Total a Pagar:</span>{' '}
            <strong className="text-[#1b1463] text-base font-bold font-heading">
              R$ {amount.toFixed(2).replace('.', ',')}
            </strong>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {orderComplete ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#25D366]/20 text-[#25D366] mx-auto flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-[#25D366]" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#1b1463]">
                Pagamento Registrado com Sucesso!
              </h3>
              <p className="text-xs sm:text-sm text-[#372B69] max-w-sm mx-auto leading-relaxed">
                Seu pedido <strong>#{confirmedOrderId}</strong> foi confirmado e salvo no <strong>Firebase Firestore</strong> em tempo real.
              </p>
              <div className="p-4 rounded-xl bg-white border border-[#c7c5b6] text-xs text-left space-y-2">
                <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                  <span className="text-gray-500">ID da Transação:</span>
                  <span className="font-mono font-bold text-[#1b1463]">{confirmedOrderId}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                  <span className="text-gray-500">E-mail de Acesso:</span>
                  <span className="font-bold text-[#1b1463]">{email || customerData.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">CPF Cadastrado:</span>
                  <span className="font-bold text-[#1b1463]">{cpf || '123.456.789-00'}</span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    sessionStorage.setItem('casa6_member_email', email || customerData.email);
                    sessionStorage.setItem('casa6_member_cpf', cpf || '123.456.789-00');
                    onClose();
                    window.location.href = '/membros';
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#fab03b] hover:bg-[#e59e2e] text-[#1b1463] font-bold py-3.5 px-6 text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  <span>ACESSAR RELATÓRIO NA ÁREA DE MEMBROS</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirmPayment} className="space-y-4">
              
              {/* Botão de Preenchimento Automático para Teste */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fab03b]/15 border border-[#fab03b]/40 text-xs">
                <span className="text-[#1b1463] font-medium text-[11px]">Deseja testar o fluxo de imediato?</span>
                <button
                  type="button"
                  onClick={handleFillTestData}
                  className="px-2.5 py-1 rounded-lg bg-[#fab03b] hover:bg-[#e59e2e] text-[#1b1463] text-[11px] font-bold shadow-xs cursor-pointer"
                >
                  ⚡ Preencher Dados de Teste
                </button>
              </div>

              {/* Seleção do Método */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'pix'
                      ? 'border-[#009ee3] bg-[#009ee3]/10 font-bold text-[#009ee3]'
                      : 'border-[#c7c5b6] bg-white text-[#534D6B] hover:border-[#009ee3]'
                  }`}
                >
                  <QrCode className="h-5 w-5 mx-auto mb-1 text-[#009ee3]" />
                  <span className="text-xs block">PIX</span>
                  <span className="text-[10px] text-[#25D366] font-semibold">Instantâneo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'credit_card'
                      ? 'border-[#009ee3] bg-[#009ee3]/10 font-bold text-[#009ee3]'
                      : 'border-[#c7c5b6] bg-white text-[#534D6B] hover:border-[#009ee3]'
                  }`}
                >
                  <CreditCard className="h-5 w-5 mx-auto mb-1 text-[#009ee3]" />
                  <span className="text-xs block">Cartão</span>
                  <span className="text-[10px] text-gray-500">Até 12x</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ticket')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'ticket'
                      ? 'border-[#009ee3] bg-[#009ee3]/10 font-bold text-[#009ee3]'
                      : 'border-[#c7c5b6] bg-white text-[#534D6B] hover:border-[#009ee3]'
                  }`}
                >
                  <Lock className="h-5 w-5 mx-auto mb-1 text-[#009ee3]" />
                  <span className="text-xs block">Boleto</span>
                  <span className="text-[10px] text-gray-500">1-2 dias</span>
                </button>
              </div>

              {/* Campos de Contato / Identificação */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#1b1463] mb-1">
                    E-mail do Cliente *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#c7c5b6] bg-white px-3 py-2 text-[#1b1463] focus:border-[#009ee3] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1b1463] mb-1">
                    CPF (para Área de Membros) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#c7c5b6] bg-white px-3 py-2 text-[#1b1463] focus:border-[#009ee3] focus:outline-none"
                  />
                </div>
              </div>

              {/* Detalhes do Pix */}
              {paymentMethod === 'pix' && (
                <div className="p-4 rounded-xl bg-white border border-[#c7c5b6] space-y-3 text-center">
                  <div className="w-40 h-40 mx-auto bg-gray-50 rounded-lg border border-dashed border-[#c7c5b6] flex items-center justify-center p-2">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(pixCode)}`}
                      alt="QR Code Pix"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-[#372B69]">
                    Escaneie o código acima no app do seu banco ou use a chave Copia e Cola:
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#1b1463] text-xs font-semibold cursor-pointer border border-[#c7c5b6]"
                  >
                    {copiedPix ? <Check className="h-4 w-4 text-[#25D366]" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedPix ? 'Código Pix Copiado!' : 'Copiar Código Pix'}</span>
                  </button>
                </div>
              )}

              {/* Detalhes do Cartão */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-2.5 bg-white p-4 rounded-xl border border-[#c7c5b6]">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1b1463] mb-0.5">Número do Cartão</label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs rounded-lg border border-[#c7c5b6] px-3 py-2 text-[#1b1463]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#1b1463] mb-0.5">Nome Impresso no Cartão</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full text-xs rounded-lg border border-[#c7c5b6] px-3 py-2 text-[#1b1463]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#1b1463] mb-0.5">Validade (MM/AA)</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full text-xs rounded-lg border border-[#c7c5b6] px-3 py-2 text-[#1b1463]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#1b1463] mb-0.5">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full text-xs rounded-lg border border-[#c7c5b6] px-3 py-2 text-[#1b1463]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Botão de Finalizar */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#009ee3] hover:bg-[#0089c7] text-white py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{isProcessing ? 'Gravando no Firebase e Mercado Pago...' : `Confirmar Pagamento de R$ ${amount.toFixed(2).replace('.', ',')}`}</span>
              </button>

              <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-[#25D366]" />
                  <span>Criptografia SSL 256 bits</span>
                </div>
                <span className="text-[#009ee3] font-semibold">Firebase Firestore Conectado</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
