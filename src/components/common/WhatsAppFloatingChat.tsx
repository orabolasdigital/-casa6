/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Botão Flutuante de WhatsApp com Janela Conversacional Direta
 * 
 * Funcionalidades:
 * - Botão fechado: Bolinha verde oficial (#25D366) apenas com o ícone do WhatsApp (sem foto e sem texto).
 * - Ao abrir: O botão fica oculto e a janela desliza de baixo para cima cobrindo a posição.
 * - Bordas menos arredondadas (rounded-xl) com acabamento moderno.
 * - Header oficial estilo WhatsApp (#075E54) com Avatar, Nome, Status Online, Botão de Reiniciar e Fechar.
 * - Fundo sólido suave estilo WhatsApp (sem pontinhos).
 * - Sem mensagem inicial de boas-vindas: o primeiro campo aparece logo no topo.
 * - Fluxo conversacional progressivo: conforme o usuário preenche, as mensagens anteriores sobem como num chat real.
 * - Sem numeração ("1.", "2.") e com frases diretas:
 *   1. "Informe seu nome e sobrenome"
 *   2. "Seu WhatsApp"
 *   3. "Seu e-mail"
 *   4. "Selecione o assunto"
 * - Tipografia limpa e padrão (font-sans) para fácil leitura.
 * - Barra inferior com botão largo de ação (desabilitado em cinza / ativo em verde com ícone de mensagem).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  RotateCcw,
  User,
  Phone,
  Mail,
  Compass,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { OFFICIAL_SERVICES, SITE_CONFIG } from '../../config/site';
import { submitLeadBooking } from '../../services/leads';
import { trackAnalyticsEvent } from '../../services/analytics';
import {
  formatWhatsAppNumber,
  lookupCRMContactByEmail
} from '../../services/formValidation';

interface WhatsAppFloatingChatProps {
  initialServiceId?: string;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

export const WhatsAppFloatingChat: React.FC<WhatsAppFloatingChatProps> = ({
  initialServiceId,
  isOpenExternal,
  onCloseExternal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [serviceId, setServiceId] = useState(initialServiceId || OFFICIAL_SERVICES[0].id);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // Sincroniza abertura externa
  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  useEffect(() => {
    if (initialServiceId) {
      setServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  // Listener para eventos globais de disparo do WhatsApp
  useEffect(() => {
    const handleGlobalTrigger = (event: CustomEvent<{ serviceId?: string }>) => {
      if (event.detail?.serviceId) {
        setServiceId(event.detail.serviceId);
      }
      setIsOpen(true);
    };

    window.addEventListener('open-casa6-whatsapp' as any, handleGlobalTrigger);
    return () => {
      window.removeEventListener('open-casa6-whatsapp' as any, handleGlobalTrigger);
    };
  }, []);

  // Rola suavemente a conversa até o final e foca o campo ativo
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (contentAreaRef.current) {
          contentAreaRef.current.scrollTop = contentAreaRef.current.scrollHeight;
        }
        if (currentStep < 3) {
          inputRef.current?.focus();
        }
      }, 80);
    }
  }, [isOpen, currentStep]);

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      if (onCloseExternal) onCloseExternal();
    } else {
      setIsOpen(true);
      trackAnalyticsEvent('open_booking', { source: 'floating_whatsapp_chat' });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onCloseExternal) onCloseExternal();
  };

  const handleReset = () => {
    setCurrentStep(0);
    setFullName('');
    setWhatsapp('');
    setEmail('');
    setErrorMessage('');
    setIsSuccess(false);
    setIsSubmitting(false);
  };

  // Validação dinâmica do passo ativo
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return fullName.trim().length >= 3;
      case 1:
        return whatsapp.replace(/\D/g, '').length >= 10;
      case 2:
        return email.includes('@') && email.includes('.');
      case 3:
        return Boolean(serviceId);
      default:
        return true;
    }
  };

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (currentStep === 0) {
      if (!isStepValid(0)) {
        setErrorMessage('Por favor, informe seu nome e sobrenome.');
        return;
      }
      setCurrentStep(1);
      return;
    }

    if (currentStep === 1) {
      if (!isStepValid(1)) {
        setErrorMessage('Por favor, informe um WhatsApp válido com DDD.');
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!isStepValid(2)) {
        setErrorMessage('Por favor, digite um e-mail válido.');
        return;
      }
      setCurrentStep(3);
      lookupCRMContactByEmail(email.trim()).catch((err) => console.warn('[CRM Lookup]', err));
      return;
    }

    if (currentStep === 3) {
      handleFinalSubmit();
    }
  };

  const getServiceName = (id: string): string => {
    const s = OFFICIAL_SERVICES.find((item) => item.id === id);
    if (s) return s.title;
    switch (id) {
      case 'bussula-guia':
      case 'bussola':
        return 'Bússola Guia (Relatório Mensal)';
      case 'patota-astral':
      case 'patota':
        return 'Patota Astral (Assinatura)';
      case 'lojinha-semeadura':
        return 'Lojinha / Caixa Semeadura';
      case 'duvidas-gerais':
        return 'Outras Dúvidas com Bianca Tofoli';
      default:
        return 'Atendimento Casa 6';
    }
  };

  // Envio final para o WhatsApp oficial
  const handleFinalSubmit = async () => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (!fullName.trim() || !whatsapp.trim() || !email.trim()) {
        throw new Error('Preencha os passos anteriores para continuar.');
      }

      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const res = await submitLeadBooking(
        {
          firstName,
          lastName,
          whatsapp,
          email,
          serviceId
        },
        'WhatsApp Chat Conversacional'
      );

      setIsSuccess(true);
      setCurrentStep(4);
      trackAnalyticsEvent('whatsapp_click', { serviceId });

      // Abre o WhatsApp imediatamente em nova aba
      setTimeout(() => {
        window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao conectar com o WhatsApp. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappRedirectUrl = `https://wa.me/${SITE_CONFIG.whatsappNumberRaw}?text=${encodeURIComponent(
    `Olá, Bianca! Meu nome é ${fullName.trim()}. Vim pelo site da Casa 6 e gostaria de atendimento sobre ${getServiceName(serviceId)}.`
  )}`;

  return (
    <>
      {/* =========================================================================
          BOTÃO FLUTUANTE FECHADO: APENAS BOLINHA VERDE COM ÍCONE DO WHATSAPP
          Sem foto, sem texto. Oculta-se completamente quando a janela abre.
          ========================================================================= */}
      {!isOpen && (
        <aside
          aria-label="Atendimento via WhatsApp"
          className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 print:hidden animate-in fade-in duration-200"
        >
          <button
            onClick={handleToggle}
            aria-label="Abrir conversa de WhatsApp com Bianca Tofoli"
            className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer"
            style={{
              boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45), 0 2px 8px rgba(43, 37, 102, 0.25)'
            }}
          >
            {/* Ícone Oficial do WhatsApp */}
            <svg className="h-7 w-7 sm:h-8 sm:w-8 fill-current text-white" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {/* Efeito de pulso para atração suave */}
            <span className="absolute top-1.5 right-1.5 h-3 w-3 rounded-full bg-white animate-ping opacity-75" />
          </button>
        </aside>
      )}

      {/* =========================================================================
          JANELA DE ATENDIMENTO CONVERSACIONAL (BORDAS: rounded-xl)
          Desliza de baixo para cima cobrindo o botão original
          ========================================================================= */}
      {isOpen && (
        <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 w-[94vw] max-w-[390px] rounded-xl bg-[#FCFAF7] border border-[#c7c5b6] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] h-[580px] font-sans animate-in fade-in slide-in-from-bottom duration-300">
          
          {/* Header do WhatsApp (#075E54) com Avatar, Nome, Status e Ações */}
          <div className="bg-[#075E54] text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full border-2 border-white/90 overflow-hidden shadow-sm shrink-0">
                <img
                  src="https://static.wixstatic.com/media/02c8e0_54a33eeb476d45c49b7f4953c34177fc~mv2.jpeg"
                  alt="Bianca Tofoli"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: '50% 8%' }}
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
              </div>

              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm sm:text-base text-white tracking-wide">
                    Bianca Tofoli
                  </span>
                  <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#25D366] text-[10px] text-white font-bold">✓</span>
                </div>
                <span className="text-[11px] text-[#25D366] font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] inline-block animate-pulse" />
                  Atendimento via WhatsApp
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {currentStep > 0 && currentStep < 4 && (
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reiniciar dados"
                  aria-label="Reiniciar conversa"
                  className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
                aria-label="Fechar janela"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Área Central: Fundo Sólido Limpo (Sem Pontinhos) com Fluxo que Sobe Conforme Preenche */}
          <div
            ref={contentAreaRef}
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#EFEAE2]"
          >
            {/* HISTÓRICO CONVERSACIONAL: PASSOS JÁ PREENCHIDOS QUE SOBEM */}
            {currentStep > 0 && (
              <div className="space-y-3">
                {/* Passo 0 Concluído: Nome e Sobrenome */}
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-2xs border border-gray-200 text-xs sm:text-sm text-gray-800 max-w-[85%]">
                    <p className="font-medium text-gray-800">Informe seu nome e sobrenome</p>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] rounded-xl rounded-tr-none p-2.5 px-3.5 shadow-2xs border border-[#25D366]/20 text-xs sm:text-sm text-gray-800 max-w-[85%]">
                      <p className="font-medium">{fullName}</p>
                      <span className="text-[9.5px] text-emerald-700/60 block text-right mt-0.5 select-none">✓✓</span>
                    </div>
                  </div>
                </div>

                {/* Passo 1 Concluído: WhatsApp */}
                {currentStep > 1 && (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-2xs border border-gray-200 text-xs sm:text-sm text-gray-800 max-w-[85%]">
                      <p className="font-medium text-gray-800">Seu WhatsApp</p>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[#DCF8C6] rounded-xl rounded-tr-none p-2.5 px-3.5 shadow-2xs border border-[#25D366]/20 text-xs sm:text-sm text-gray-800 max-w-[85%]">
                        <p className="font-medium">{whatsapp}</p>
                        <span className="text-[9.5px] text-emerald-700/60 block text-right mt-0.5 select-none">✓✓</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Passo 2 Concluído: E-mail */}
                {currentStep > 2 && (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-2xs border border-gray-200 text-xs sm:text-sm text-gray-800 max-w-[85%]">
                      <p className="font-medium text-gray-800">Seu e-mail</p>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[#DCF8C6] rounded-xl rounded-tr-none p-2.5 px-3.5 shadow-2xs border border-[#25D366]/20 text-xs sm:text-sm text-gray-800 max-w-[85%]">
                        <p className="font-medium break-all">{email}</p>
                        <span className="text-[9.5px] text-emerald-700/60 block text-right mt-0.5 select-none">✓✓</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CARD BRANCO ATIVO: ENTRADA ATUAL DIRETA E SEM NUMERAÇÃO */}
            {currentStep < 4 && (
              <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm p-4 sm:p-5 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                
                {/* Título Direto e Sem Numeração com Fonte Comum */}
                <h3 className="text-sm font-semibold text-gray-800 leading-snug">
                  {currentStep === 0 && 'Informe seu nome e sobrenome'}
                  {currentStep === 1 && 'Seu WhatsApp'}
                  {currentStep === 2 && 'Seu e-mail'}
                  {currentStep === 3 && 'Selecione o assunto'}
                </h3>

                {/* Formulário com Input e Ícone Embutido */}
                <form onSubmit={handleNextStep} className="space-y-2">
                  <div className="relative flex items-center">
                    {/* Ícone no lado esquerdo dentro do input */}
                    <div className="absolute left-3.5 pointer-events-none text-gray-400">
                      {currentStep === 0 && <User className="h-4.5 w-4.5" />}
                      {currentStep === 1 && <Phone className="h-4.5 w-4.5" />}
                      {currentStep === 2 && <Mail className="h-4.5 w-4.5" />}
                      {currentStep === 3 && <Compass className="h-4.5 w-4.5" />}
                    </div>

                    {/* Passo 0: Nome e Sobrenome Juntos */}
                    {currentStep === 0 && (
                      <input
                        ref={inputRef}
                        type="text"
                        required
                        autoFocus
                        placeholder="Nome e sobrenome"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value.slice(0, 40));
                          setErrorMessage('');
                        }}
                        className="w-full pl-11 pr-3.5 py-3 rounded-lg border border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 bg-[#FCFAF7] text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all shadow-2xs font-sans"
                      />
                    )}

                    {/* Passo 1: Seu WhatsApp */}
                    {currentStep === 1 && (
                      <input
                        ref={inputRef}
                        type="tel"
                        required
                        autoFocus
                        placeholder="Ex: (11) 99999-9999"
                        value={whatsapp}
                        onChange={(e) => {
                          setWhatsapp(formatWhatsAppNumber(e.target.value));
                          setErrorMessage('');
                        }}
                        className="w-full pl-11 pr-3.5 py-3 rounded-lg border border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 bg-[#FCFAF7] text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all shadow-2xs font-sans"
                      />
                    )}

                    {/* Passo 2: Seu E-mail */}
                    {currentStep === 2 && (
                      <input
                        ref={inputRef}
                        type="email"
                        required
                        autoFocus
                        placeholder="seuemail@exemplo.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrorMessage('');
                        }}
                        className="w-full pl-11 pr-3.5 py-3 rounded-lg border border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 bg-[#FCFAF7] text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all shadow-2xs font-sans"
                      />
                    )}

                    {/* Passo 3: Selecione o Assunto */}
                    {currentStep === 3 && (
                      <select
                        value={serviceId}
                        onChange={(e) => {
                          setServiceId(e.target.value);
                          setErrorMessage('');
                        }}
                        className="w-full pl-11 pr-3.5 py-3 rounded-lg border border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 bg-[#FCFAF7] text-sm text-gray-800 outline-none transition-all font-sans font-medium shadow-2xs"
                      >
                        <optgroup label="Atendimentos e Consultas">
                          <option value="pronto-socorro-astrologico">Pronto Socorro Astrológico</option>
                          <option value="mapa-natal-nascimento">Mapa Natal</option>
                          <option value="mapa-revolucao-solar">Mapa Revolução Solar</option>
                          <option value="combo-mapa-roda-revolucao">Combo de Mapas</option>
                        </optgroup>
                        <optgroup label="Palestras e Encontros">
                          <option value="palestra-waap">WAAP</option>
                          <option value="palestra-respirar-calma">Respirar e (A)calmar</option>
                          <option value="palestra-autoconhecimento-cuidado">Autoconhecimento</option>
                          <option value="palestra-vamos-montar-juntos">Vamos Montar</option>
                        </optgroup>
                        <optgroup label="Assinaturas e Comunidade">
                          <option value="patota-astral">Patota Astral</option>
                          <option value="bussula-guia">Bússola Guia</option>
                        </optgroup>
                        <optgroup label="Outros Assuntos">
                          <option value="lojinha-semeadura">Lojinha / Caixa Semeadura</option>
                          <option value="duvidas-gerais">Outras Dúvidas com Bianca Tofoli</option>
                        </optgroup>
                      </select>
                    )}
                  </div>

                  {/* Texto Auxiliar / Validação */}
                  <p className="text-[11px] text-gray-500 font-light pt-0.5">
                    {currentStep === 0 && 'Digite nome e sobrenome.'}
                    {currentStep === 1 && 'Digite seu WhatsApp com DDD.'}
                    {currentStep === 2 && 'Digite seu e-mail para contato.'}
                    {currentStep === 3 && 'Escolha o assunto ou atendimento desejado.'}
                  </p>

                  {/* Mensagem de Erro Caso Ocorra */}
                  {errorMessage && (
                    <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
                      {errorMessage}
                    </p>
                  )}
                </form>
              </div>
            )}

            {/* CARD DE SUCESSO E REDIRECIONAMENTO */}
            {isSuccess && (
              <div className="bg-[#dcf8c6] rounded-xl p-4 sm:p-5 shadow-sm border border-[#25D366]/40 text-center space-y-3 animate-in fade-in duration-300">
                <div className="mx-auto w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-[#075E54]">
                  Conectando com o WhatsApp...
                </h4>
                <p className="text-xs text-[#1b1463] leading-relaxed">
                  Sua mensagem foi gerada! Se a conversa não abriu automaticamente, clique abaixo:
                </p>
                <a
                  href={whatsappRedirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  Abrir WhatsApp Agora
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] text-[#075E54] hover:underline block mx-auto cursor-pointer font-medium pt-1"
                >
                  Iniciar nova mensagem
                </button>
              </div>
            )}
          </div>

          {/* BARRA INFERIOR COM BOTÃO LARGO */}
          {currentStep < 4 && (
            <div className="p-3.5 sm:p-4 bg-[#F4F6F8] border-t border-gray-200/80 shrink-0">
              <button
                type="button"
                onClick={() => handleNextStep()}
                disabled={!isStepValid(currentStep) || isSubmitting}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs sm:text-[13px] font-bold uppercase tracking-wider transition-all shadow-xs ${
                  isStepValid(currentStep) && !isSubmitting
                    ? 'bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-md cursor-pointer active:scale-[0.98]'
                    : 'bg-[#E5E9EC] text-[#9AA5AF] cursor-not-allowed'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>
                  {isSubmitting
                    ? 'Iniciando WhatsApp...'
                    : currentStep === 3
                    ? 'Iniciar Conversa'
                    : 'Continuar'}
                </span>
              </button>
            </div>
          )}

          {/* Rodapé Informativo Discreto */}
          <div className="bg-[#EAECEF] py-1.5 px-3 text-[10px] text-center text-gray-500 shrink-0 border-t border-gray-200/60 font-sans">
            Direcionado diretamente ao WhatsApp oficial da Casa 6
          </div>
        </div>
      )}
    </>
  );
};
