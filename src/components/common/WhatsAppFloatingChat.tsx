/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Botão Flutuante de WhatsApp com Janela Conversacional Interativa
 * 
 * Funcionalidades:
 * - Botão fechado: Bolinha verde oficial (#25D366) apenas com o ícone do WhatsApp (sem foto e sem texto).
 * - Ao abrir: O botão fica oculto e a janela desliza de baixo para cima cobrindo a posição.
 * - Bordas menos arredondadas (rounded-xl) com acabamento refinado.
 * - Fluxo 100% conversacional estilo bate-papo de WhatsApp:
 *   1. Nome
 *   2. Sobrenome
 *   3. WhatsApp
 *   4. E-mail
 *   5. Seleção de Assunto / Serviço e Botão de Envio
 *   6. Redirecionamento automático e cadastro de lead
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, CheckCircle2, RotateCcw } from 'lucide-react';
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
  const [inputDraft, setInputDraft] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Rola suavemente a conversa até o final sempre que um novo passo é alcançado
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
        if (currentStep < 4 && inputRef.current) {
          inputRef.current.focus();
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
    setFirstName('');
    setLastName('');
    setWhatsapp('');
    setEmail('');
    setInputDraft('');
    setErrorMessage('');
    setIsSuccess(false);
    setIsSubmitting(false);
  };

  const handleDraftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setErrorMessage('');
    if (currentStep === 0 || currentStep === 1) {
      setInputDraft(sanitizeName(val).slice(0, 25));
    } else if (currentStep === 2) {
      setInputDraft(formatWhatsAppNumber(val));
    } else {
      setInputDraft(val);
    }
  };

  const handleStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Passo 0: Nome
    if (currentStep === 0) {
      const cleanName = inputDraft.trim();
      if (!cleanName || cleanName.length < 2) {
        setErrorMessage('Por favor, informe o seu nome para continuarmos.');
        return;
      }
      setFirstName(cleanName);
      setInputDraft('');
      setCurrentStep(1);
      return;
    }

    // Passo 1: Sobrenome
    if (currentStep === 1) {
      const cleanLastName = inputDraft.trim();
      if (!cleanLastName || cleanLastName.length < 2) {
        setErrorMessage('Por favor, informe o seu sobrenome.');
        return;
      }
      setLastName(cleanLastName);
      setInputDraft('');
      setCurrentStep(2);
      return;
    }

    // Passo 2: WhatsApp
    if (currentStep === 2) {
      const digits = inputDraft.replace(/\D/g, '');
      if (digits.length < 10) {
        setErrorMessage('Por favor, informe um WhatsApp válido com DDD (Ex: 11 99999-9999).');
        return;
      }
      setWhatsapp(inputDraft.trim());
      setInputDraft('');
      setCurrentStep(3);
      return;
    }

    // Passo 3: E-mail
    if (currentStep === 3) {
      const cleanEmail = inputDraft.trim();
      if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        setErrorMessage('Por favor, digite um e-mail válido (Ex: seuemail@exemplo.com).');
        return;
      }
      setEmail(cleanEmail);
      setInputDraft('');
      setCurrentStep(4);

      // Consulta de contato existente no CRM
      lookupCRMContactByEmail(cleanEmail).catch((err) => console.warn('[CRM Lookup]', err));
      return;
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
        'WhatsApp Chat Conversacional'
      );

      setIsSuccess(true);
      setCurrentStep(5);
      trackAnalyticsEvent('whatsapp_click', { serviceId });

      // Abre o WhatsApp imediatamente em nova aba
      setTimeout(() => {
        window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao preparar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlaceholder = () => {
    switch (currentStep) {
      case 0:
        return 'Digite seu primeiro nome...';
      case 1:
        return 'Digite seu sobrenome...';
      case 2:
        return 'Ex: (11) 99999-9999';
      case 3:
        return 'seuemail@exemplo.com';
      default:
        return 'Digite sua resposta...';
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
          JANELA DE CONVERSA ESTILO WHATSAPP (BORDAS MENOS ARREDONDADAS: rounded-xl)
          Desliza de baixo para cima, cobrindo o botão original
          ========================================================================= */}
      {isOpen && (
        <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 w-[94vw] max-w-[390px] rounded-xl bg-[#FCFAF7] border border-[#c7c5b6] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] h-[580px] animate-in fade-in slide-in-from-bottom duration-300">
          
          {/* Header do WhatsApp (#075E54) com Foto e Status Oficial */}
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
                  Casa 6 • Online agora
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {currentStep > 0 && currentStep < 5 && (
                <button
                  type="button"
                  onClick={handleReset}
                  title="Recomeçar conversa"
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
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

          {/* Área Central: Histórico de Balões de Mensagens estilo WhatsApp */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#e5ddd5]/35"
            style={{
              backgroundImage: 'radial-gradient(#1b1463 0.6px, transparent 0.6px)',
              backgroundSize: '13px 13px'
            }}
          >
            {/* Balão 1 da Bianca: Boas-vindas */}
            <div className="flex items-start gap-2 max-w-[88%]">
              <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-xs border border-[#c7c5b6]/60 text-xs sm:text-[13px] text-[#1b1463] space-y-1">
                <p className="font-semibold text-[#075E54] text-[11px] uppercase tracking-wider">Bianca Tofoli</p>
                <p>Olá! Seja muito bem-vindo(a) à Casa 6. ✨</p>
                <p className="text-[10px] text-right text-gray-400">Agora</p>
              </div>
            </div>

            {/* Balão 2 da Bianca: Pergunta do Nome */}
            <div className="flex items-start gap-2 max-w-[88%]">
              <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-xs border border-[#c7c5b6]/60 text-xs sm:text-[13px] text-[#1b1463] space-y-1">
                <p>Para começarmos a sua mensagem personalizada, qual é o seu <strong>primeiro nome</strong>?</p>
                <p className="text-[10px] text-right text-gray-400">Agora</p>
              </div>
            </div>

            {/* Resposta do Usuário 1: Nome */}
            {currentStep >= 1 && (
              <div className="flex justify-end">
                <div className="bg-[#dcf8c6] rounded-xl rounded-tr-none p-2.5 px-3.5 shadow-xs border border-[#25D366]/30 text-xs sm:text-[13px] text-[#1b1463] max-w-[85%]">
                  <p className="font-semibold">{firstName}</p>
                  <p className="text-[9.5px] text-right text-emerald-700/60 mt-0.5">✓✓</p>
                </div>
              </div>
            )}

            {/* Balão 3 da Bianca: Pergunta do Sobrenome */}
            {currentStep >= 1 && (
              <div className="flex items-start gap-2 max-w-[88%]">
                <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-xs border border-[#c7c5b6]/60 text-xs sm:text-[13px] text-[#1b1463] space-y-1">
                  <p>Prazer, <strong>{firstName}</strong>! E qual é o seu <strong>sobrenome</strong>?</p>
                  <p className="text-[10px] text-right text-gray-400">Agora</p>
                </div>
              </div>
            )}

            {/* Resposta do Usuário 2: Sobrenome */}
            {currentStep >= 2 && (
              <div className="flex justify-end">
                <div className="bg-[#dcf8c6] rounded-xl rounded-tr-none p-2.5 px-3.5 shadow-xs border border-[#25D366]/30 text-xs sm:text-[13px] text-[#1b1463] max-w-[85%]">
                  <p className="font-semibold">{lastName}</p>
                  <p className="text-[9.5px] text-right text-emerald-700/60 mt-0.5">✓✓</p>
                </div>
              </div>
            )}

            {/* Balão 4 da Bianca: Pergunta do WhatsApp */}
            {currentStep >= 2 && (
              <div className="flex items-start gap-2 max-w-[88%]">
                <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-xs border border-[#c7c5b6]/60 text-xs sm:text-[13px] text-[#1b1463] space-y-1">
                  <p>Perfeito! Me passe o seu <strong>WhatsApp com DDD</strong> para podermos conversar:</p>
                  <p className="text-[10px] text-right text-gray-400">Agora</p>
                </div>
              </div>
            )}

            {/* Resposta do Usuário 3: WhatsApp */}
            {currentStep >= 3 && (
              <div className="flex justify-end">
                <div className="bg-[#dcf8c6] rounded-xl rounded-tr-none p-2.5 px-3.5 shadow-xs border border-[#25D366]/30 text-xs sm:text-[13px] text-[#1b1463] max-w-[85%]">
                  <p className="font-semibold">{whatsapp}</p>
                  <p className="text-[9.5px] text-right text-emerald-700/60 mt-0.5">✓✓</p>
                </div>
              </div>
            )}

            {/* Balão 5 da Bianca: Pergunta do E-mail */}
            {currentStep >= 3 && (
              <div className="flex items-start gap-2 max-w-[88%]">
                <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-xs border border-[#c7c5b6]/60 text-xs sm:text-[13px] text-[#1b1463] space-y-1">
                  <p>Ótimo! Qual é o seu melhor <strong>e-mail</strong>?</p>
                  <p className="text-[10px] text-right text-gray-400">Agora</p>
                </div>
              </div>
            )}

            {/* Resposta do Usuário 4: E-mail */}
            {currentStep >= 4 && (
              <div className="flex justify-end">
                <div className="bg-[#dcf8c6] rounded-xl rounded-tr-none p-2.5 px-3.5 shadow-xs border border-[#25D366]/30 text-xs sm:text-[13px] text-[#1b1463] max-w-[85%]">
                  <p className="font-semibold break-all">{email}</p>
                  <p className="text-[9.5px] text-right text-emerald-700/60 mt-0.5">✓✓</p>
                </div>
              </div>
            )}

            {/* Balão 6 da Bianca: Seleção de Assuntos & Botão Conversar no WhatsApp */}
            {currentStep >= 4 && currentStep < 5 && (
              <div className="flex items-start gap-2 max-w-[92%] animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white rounded-xl rounded-tl-none p-3.5 shadow-sm border border-[#c7c5b6] text-xs sm:text-[13px] text-[#1b1463] space-y-3 w-full">
                  <p>Maravilha! Agora selecione qual <strong>assunto ou serviço</strong> você deseja tratar:</p>

                  <div className="space-y-2.5 pt-0.5">
                    <select
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      className="w-full text-xs rounded-lg border border-[#c7c5b6] bg-[#FCFAF7] px-3 py-2.5 text-[#1b1463] focus:border-[#25D366] focus:outline-none font-medium"
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

                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-4 text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer transform active:scale-98 disabled:opacity-60"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isSubmitting ? 'Iniciando WhatsApp...' : 'Conversar no WhatsApp'}</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-right text-gray-400">Agora</p>
                </div>
              </div>
            )}

            {/* Balão 7: Sucesso e Redirecionamento */}
            {isSuccess && (
              <div className="bg-[#dcf8c6] rounded-xl p-4 shadow-sm border border-[#25D366]/40 text-center space-y-3 animate-in fade-in duration-300">
                <div className="mx-auto w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="font-heading font-bold text-sm text-[#075E54]">Conectando com o WhatsApp...</h4>
                <p className="text-xs text-[#1b1463]">
                  Se a conversa não abriu automaticamente, clique no botão abaixo para conversar:
                </p>
                <a
                  href={whatsappRedirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#25D366] text-white text-xs font-bold shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  Abrir WhatsApp Agora
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] text-[#075E54] hover:underline block mx-auto cursor-pointer"
                >
                  Iniciar nova conversa
                </button>
              </div>
            )}
          </div>

          {/* Barra de Entrada estilo WhatsApp: Apenas durante os passos 0 a 3 */}
          {currentStep < 4 && (
            <div className="p-2.5 bg-white border-t border-[#E2DCCF] shrink-0">
              {errorMessage && (
                <p className="text-[11px] text-red-600 bg-red-50 px-2.5 py-1 mb-2 rounded border border-red-200">
                  {errorMessage}
                </p>
              )}
              <form onSubmit={handleStepSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type={currentStep === 2 ? 'tel' : currentStep === 3 ? 'email' : 'text'}
                  required
                  autoFocus
                  placeholder={getPlaceholder()}
                  value={inputDraft}
                  onChange={handleDraftChange}
                  className="flex-1 text-xs rounded-lg border border-[#c7c5b6] bg-[#FCFAF7] px-3 py-2.5 text-[#1b1463] focus:border-[#25D366] focus:outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  aria-label="Enviar resposta"
                  className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {/* Rodapé informativo discreto */}
          <div className="bg-[#f0ece5] py-1.5 px-3 text-[10px] text-center text-gray-500 border-t border-[#E2DCCF] shrink-0">
            Direcionado diretamente ao WhatsApp oficial da Casa 6
          </div>
        </div>
      )}
    </>
  );
};
