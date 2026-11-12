/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Botão Flutuante de WhatsApp com Layout de Entrada inspirado no Modelo de Referência
 * 
 * Funcionalidades:
 * - Botão fechado: Bolinha verde oficial (#25D366) apenas com o ícone do WhatsApp (sem foto e sem texto).
 * - Ao abrir: O botão fica oculto e a janela desliza de baixo para cima cobrindo a posição.
 * - Bordas menos arredondadas (rounded-xl) com acabamento refinado.
 * - Header oficial estilo WhatsApp (#075E54) com Avatar, Nome, Status Online, Botão de Reiniciar e Fechar.
 * - Área central com fundo pontilhado e Card Branco flutuante para a pergunta ativa:
 *   - Numeração em destaque verde (ex: 1., 2., 3., 4., 5.)
 *   - Pergunta em negrito
 *   - Campo de entrada com ícone embutido no lado esquerdo (User, Phone, Mail, Compass)
 *   - Texto auxiliar/validação explicativo abaixo do campo
 *   - Histórico compacto dos passos concluídos com opção de edição rápida
 * - Barra inferior com botão largo de ação (desabilitado em cinza / ativo em verde com ícone de mensagem).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  RotateCcw,
  User,
  UserCheck,
  Phone,
  Mail,
  Compass,
  MessageSquare,
  CheckCircle2,
  Check
} from 'lucide-react';
import { OFFICIAL_SERVICES, SITE_CONFIG } from '../../config/site';
import { submitLeadBooking } from '../../services/leads';
import { trackAnalyticsEvent } from '../../services/analytics';
import {
  sanitizeName,
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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

  // Foco automático no input ao mudar de passo
  useEffect(() => {
    if (isOpen && currentStep < 4) {
      setTimeout(() => {
        inputRef.current?.focus();
        if (contentAreaRef.current) {
          contentAreaRef.current.scrollTop = contentAreaRef.current.scrollHeight;
        }
      }, 100);
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
    setFirstName('');
    setLastName('');
    setWhatsapp('');
    setEmail('');
    setErrorMessage('');
    setIsSuccess(false);
    setIsSubmitting(false);
  };

  // Verifica se o passo atual possui entrada válida
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return firstName.trim().length >= 2;
      case 1:
        return lastName.trim().length >= 2;
      case 2:
        return whatsapp.replace(/\D/g, '').length >= 10;
      case 3:
        return email.includes('@') && email.includes('.');
      case 4:
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
        setErrorMessage('Por favor, informe o seu nome (mínimo de 2 letras).');
        return;
      }
      setCurrentStep(1);
      return;
    }

    if (currentStep === 1) {
      if (!isStepValid(1)) {
        setErrorMessage('Por favor, informe o seu sobrenome.');
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!isStepValid(2)) {
        setErrorMessage('Por favor, informe um WhatsApp válido com DDD (Ex: 11 99999-9999).');
        return;
      }
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!isStepValid(3)) {
        setErrorMessage('Por favor, digite um e-mail válido (Ex: seuemail@exemplo.com).');
        return;
      }
      setCurrentStep(4);
      lookupCRMContactByEmail(email.trim()).catch((err) => console.warn('[CRM Lookup]', err));
      return;
    }

    if (currentStep === 4) {
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
      if (!firstName || !lastName || !whatsapp || !email) {
        throw new Error('Preencha os passos anteriores para continuar.');
      }

      const res = await submitLeadBooking(
        {
          firstName,
          lastName,
          whatsapp,
          email,
          serviceId
        },
        'WhatsApp Chat Modelo Referência'
      );

      setIsSuccess(true);
      setCurrentStep(5);
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
    `Olá, Bianca! Meu nome é ${firstName} ${lastName}. Vim pelo site da Casa 6 e gostaria de atendimento sobre ${getServiceName(serviceId)}.`
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
          JANELA DE ATENDIMENTO ESTILO MODELO DE REFERÊNCIA (BORDAS: rounded-xl)
          Desliza de baixo para cima cobrindo o botão original
          ========================================================================= */}
      {isOpen && (
        <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 w-[94vw] max-w-[390px] rounded-xl bg-[#FCFAF7] border border-[#c7c5b6] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] h-[580px] animate-in fade-in slide-in-from-bottom duration-300">
          
          {/* Header do WhatsApp (#075E54) com Avatar, Nome, Status e Ações */}
          <div className="bg-[#075E54] text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full border-2 border-white/90 overflow-hidden shadow-sm shrink-0">
                <img
                  src="https://static.wixstatic.com/media/02c8e0_54a33eeb476d45c49b7f4953c34177fc~mv2.jpeg"
                  alt="Bianca Tofoli"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
              </div>

              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-sm sm:text-base text-white tracking-wide">
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
              {currentStep > 0 && currentStep < 5 && (
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reiniciar dados"
                  aria-label="Reiniciar formulário"
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

          {/* Área Central: Fundo Pontilhado com Card Branco de Entrada (Modelo de Referência) */}
          <div
            ref={contentAreaRef}
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#e5ddd5]/35"
            style={{
              backgroundImage: 'radial-gradient(#1b1463 0.65px, transparent 0.65px)',
              backgroundSize: '13px 13px'
            }}
          >
            {/* Mensagem Inicial de Acolhimento */}
            <div className="bg-white/90 backdrop-blur-xs rounded-lg p-2.5 px-3 border border-gray-200/60 shadow-2xs text-xs text-[#1b1463] flex items-center gap-2">
              <span className="text-base">✨</span>
              <p className="leading-snug">
                Olá! Seja muito bem-vindo(a) à <strong>Casa 6</strong>. Preencha os dados para iniciar seu atendimento:
              </p>
            </div>

            {/* Resumo dos Passos Concluídos (Chips Compactos com opção de Edição) */}
            {currentStep > 0 && currentStep < 5 && (
              <div className="space-y-1.5">
                {currentStep > 0 && (
                  <div
                    onClick={() => setCurrentStep(0)}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-700 hover:border-[#25D366] transition-colors cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#25D366]/20 text-[#075E54] text-[10px] font-bold">✓</span>
                      <span className="text-[11px] text-gray-500 font-medium">Nome:</span>
                      <span className="text-[11px] font-bold text-gray-800 truncate">{firstName}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 group-hover:text-[#075E54] font-medium shrink-0">Editar</span>
                  </div>
                )}

                {currentStep > 1 && (
                  <div
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-700 hover:border-[#25D366] transition-colors cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#25D366]/20 text-[#075E54] text-[10px] font-bold">✓</span>
                      <span className="text-[11px] text-gray-500 font-medium">Sobrenome:</span>
                      <span className="text-[11px] font-bold text-gray-800 truncate">{lastName}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 group-hover:text-[#075E54] font-medium shrink-0">Editar</span>
                  </div>
                )}

                {currentStep > 2 && (
                  <div
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-700 hover:border-[#25D366] transition-colors cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#25D366]/20 text-[#075E54] text-[10px] font-bold">✓</span>
                      <span className="text-[11px] text-gray-500 font-medium">WhatsApp:</span>
                      <span className="text-[11px] font-bold text-gray-800 truncate">{whatsapp}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 group-hover:text-[#075E54] font-medium shrink-0">Editar</span>
                  </div>
                )}

                {currentStep > 3 && (
                  <div
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-700 hover:border-[#25D366] transition-colors cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#25D366]/20 text-[#075E54] text-[10px] font-bold">✓</span>
                      <span className="text-[11px] text-gray-500 font-medium">E-mail:</span>
                      <span className="text-[11px] font-bold text-gray-800 truncate">{email}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 group-hover:text-[#075E54] font-medium shrink-0">Editar</span>
                  </div>
                )}
              </div>
            )}

            {/* CARD BRANCO PRINCIPAL DE ENTRADA (ESTILO DO MODELO DE REFERÊNCIA) */}
            {currentStep < 5 && (
              <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm p-4 sm:p-5 space-y-3.5 animate-in fade-in duration-200">
                
                {/* Título com Numeração Verde em Destaque */}
                <h3 className="text-xs sm:text-sm text-gray-900 leading-snug">
                  <span className="text-[#075E54] font-bold text-sm sm:text-base mr-1">
                    {currentStep + 1}.
                  </span>
                  {currentStep === 0 && <span className="font-semibold">Olá. Informe o seu primeiro nome:</span>}
                  {currentStep === 1 && <span className="font-semibold">Prazer, {firstName}! Informe o seu sobrenome:</span>}
                  {currentStep === 2 && <span className="font-semibold">Perfeito! Informe o seu WhatsApp com DDD:</span>}
                  {currentStep === 3 && <span className="font-semibold">Ótimo! Informe o seu e-mail de contato:</span>}
                  {currentStep === 4 && <span className="font-semibold">Selecione o assunto ou serviço desejado:</span>}
                </h3>

                {/* Formulário com Input e Ícone Embutido na Esquerda */}
                <form onSubmit={handleNextStep} className="space-y-2">
                  <div className="relative flex items-center">
                    {/* Ícone no lado esquerdo dentro do input */}
                    <div className="absolute left-3.5 pointer-events-none text-gray-400">
                      {currentStep === 0 && <User className="h-4.5 w-4.5" />}
                      {currentStep === 1 && <UserCheck className="h-4.5 w-4.5" />}
                      {currentStep === 2 && <Phone className="h-4.5 w-4.5" />}
                      {currentStep === 3 && <Mail className="h-4.5 w-4.5" />}
                      {currentStep === 4 && <Compass className="h-4.5 w-4.5" />}
                    </div>

                    {/* Campo de Entrada Dinâmico por Passo */}
                    {currentStep === 0 && (
                      <input
                        ref={inputRef}
                        type="text"
                        required
                        autoFocus
                        placeholder="Nome"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(sanitizeName(e.target.value).slice(0, 25));
                          setErrorMessage('');
                        }}
                        className="w-full pl-11 pr-3.5 py-3 rounded-lg border border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 bg-[#FCFAF7] text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all shadow-2xs"
                      />
                    )}

                    {currentStep === 1 && (
                      <input
                        ref={inputRef}
                        type="text"
                        required
                        autoFocus
                        placeholder="Sobrenome"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(sanitizeName(e.target.value).slice(0, 25));
                          setErrorMessage('');
                        }}
                        className="w-full pl-11 pr-3.5 py-3 rounded-lg border border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 bg-[#FCFAF7] text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all shadow-2xs"
                      />
                    )}

                    {currentStep === 2 && (
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
                        className="w-full pl-11 pr-3.5 py-3 rounded-lg border border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 bg-[#FCFAF7] text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all shadow-2xs"
                      />
                    )}

                    {currentStep === 3 && (
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
                        className="w-full pl-11 pr-3.5 py-3 rounded-lg border border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 bg-[#FCFAF7] text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all shadow-2xs"
                      />
                    )}

                    {currentStep === 4 && (
                      <select
                        value={serviceId}
                        onChange={(e) => {
                          setServiceId(e.target.value);
                          setErrorMessage('');
                        }}
                        className="w-full pl-11 pr-3.5 py-3 rounded-lg border border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 bg-[#FCFAF7] text-xs sm:text-sm text-gray-800 outline-none transition-all font-medium shadow-2xs"
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

                  {/* Texto Auxiliar / Validação abaixo do input (conforme o modelo) */}
                  <p className="text-[11px] text-gray-500 font-light pt-0.5">
                    {currentStep === 0 && 'Digite seu primeiro nome (mínimo de 2 letras).'}
                    {currentStep === 1 && 'Digite seu sobrenome para identificação.'}
                    {currentStep === 2 && 'Digite número com DDD (mínimo de 10 dígitos).'}
                    {currentStep === 3 && 'Usaremos apenas para contato oficial da Casa 6.'}
                    {currentStep === 4 && 'Selecione o assunto ou serviço que deseja falar.'}
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
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#075E54]">
                  Conectando com o WhatsApp...
                </h4>
                <p className="text-xs text-[#1b1463] leading-relaxed">
                  Sua mensagem personalizada foi gerada com sucesso! Se a conversa não abriu automaticamente, clique abaixo:
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

          {/* BARRA INFERIOR COM BOTÃO LARGO (CONFORME O MODELO DE REFERÊNCIA) */}
          {currentStep < 5 && (
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
                    : currentStep === 4
                    ? 'Iniciar Conversa'
                    : 'Continuar'}
                </span>
              </button>
            </div>
          )}

          {/* Rodapé Informativo Discreto */}
          <div className="bg-[#EAECEF] py-1.5 px-3 text-[10px] text-center text-gray-500 shrink-0 border-t border-gray-200/60">
            Direcionado diretamente ao WhatsApp oficial da Casa 6
          </div>
        </div>
      )}
    </>
  );
};
