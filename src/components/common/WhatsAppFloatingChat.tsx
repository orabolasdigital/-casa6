/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Botão Flutuante de WhatsApp com Janela Conversacional Direta
 * 
 * Funcionalidades:
 * - Botão fechado: Bolinha verde oficial (#25D366) apenas com o ícone do WhatsApp (sem foto e sem texto).
 * - Ao abrir: O botão fica oculto e a janela desliza de baixo para cima cobrindo a posição.
 * - Bordas menos arredondadas (rounded-xl) com acabamento moderno.
 * - Header oficial estilo WhatsApp (#075E54) com Avatar (topo da cabeça visível), Nome, Status Online e Fechar.
 * - Fundo sólido suave estilo WhatsApp (#EFEAE2, sem pontinhos).
 * - Sem mensagem inicial: o primeiro campo começa logo no topo.
 * - Fluxo conversacional progressivo: conforme o usuário digita, o próximo campo aparece automaticamente sem botões intermediários.
 * - Sem numeração ("1.", "2.") e com frases diretas:
 *   - "Informe seu nome e sobrenome"
 *   - "Seu WhatsApp"
 *   - "Seu e-mail"
 *   - "Selecione o assunto"
 * - Tipografia limpa padrão (font-sans).
 * - Botão único inferior "INICIAR CONVERSA":
 *   - Fica desabilitado em cinza até que o último campo ("Selecione o assunto") seja selecionado.
 *   - Ativa em verde vibrante (#25D366) quando todos os 4 campos estão preenchidos.
 *   - Ao clicar, direciona imediatamente para o WhatsApp oficial com a mensagem pronta.
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
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [serviceId, setServiceId] = useState(initialServiceId || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const serviceSelectRef = useRef<HTMLSelectElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // Validações individuais dos campos
  const isFullNameValid = fullName.trim().length >= 3;
  const isWhatsAppValid = whatsapp.replace(/\D/g, '').length >= 10;
  const isEmailValid = email.trim().length >= 5 && email.includes('@') && email.includes('.');
  const isServiceValid = Boolean(serviceId && serviceId.trim().length > 0);

  // O botão inferior só ativa quando TODOS os campos (incluindo o último: serviço) estiverem preenchidos
  const isAllValid = isFullNameValid && isWhatsAppValid && isEmailValid && isServiceValid;

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

  // Foco inicial ao abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 120);
    }
  }, [isOpen]);

  // Rola suavemente ao liberar novos campos
  useEffect(() => {
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTo({
        top: contentAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [isFullNameValid, isWhatsAppValid, isEmailValid]);

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
    setFullName('');
    setWhatsapp('');
    setEmail('');
    setServiceId(initialServiceId || '');
    setErrorMessage('');
    setIsSuccess(false);
    setIsSubmitting(false);
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 50);
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
  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isAllValid || isSubmitting) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
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
      trackAnalyticsEvent('whatsapp_click', { serviceId });

      // Redireciona imediatamente para o WhatsApp oficial
      window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer');
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
              {(fullName || whatsapp || email) && !isSuccess && (
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

          {/* Área Central: Fundo Sólido Limpo (#EFEAE2, Sem Pontinhos) com Campos Progressivos */}
          <div
            ref={contentAreaRef}
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#EFEAE2]"
          >
            {!isSuccess ? (
              <form onSubmit={handleFinalSubmit} className="space-y-3">
                
                {/* CAMPO 1: Informe seu nome e sobrenome */}
                <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-3.5 sm:p-4 space-y-2 animate-in fade-in duration-200">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                    Informe seu nome e sobrenome
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none text-gray-400">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <input
                      ref={nameInputRef}
                      type="text"
                      required
                      placeholder="Nome e sobrenome"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value.slice(0, 45));
                        setErrorMessage('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && isFullNameValid) {
                          e.preventDefault();
                          phoneInputRef.current?.focus();
                        }
                      }}
                      className="w-full pl-11 pr-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 bg-[#FCFAF7] text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all shadow-2xs font-sans"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 font-light">
                    Digite nome e sobrenome (mínimo de 3 letras).
                  </p>
                </div>

                {/* CAMPO 2: Seu WhatsApp (aparece automaticamente após preencher o Campo 1) */}
                {isFullNameValid && (
                  <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-3.5 sm:p-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                      Seu WhatsApp
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 pointer-events-none text-gray-400">
                        <Phone className="h-4.5 w-4.5" />
                      </div>
                      <input
                        ref={phoneInputRef}
                        type="tel"
                        required
                        placeholder="Ex: (11) 99999-9999"
                        value={whatsapp}
                        onChange={(e) => {
                          setWhatsapp(formatWhatsAppNumber(e.target.value));
                          setErrorMessage('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && isWhatsAppValid) {
                            e.preventDefault();
                            emailInputRef.current?.focus();
                          }
                        }}
                        className="w-full pl-11 pr-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 bg-[#FCFAF7] text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all shadow-2xs font-sans"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 font-light">
                      Digite seu WhatsApp com DDD.
                    </p>
                  </div>
                )}

                {/* CAMPO 3: Seu e-mail (aparece automaticamente após preencher o Campo 2) */}
                {isFullNameValid && isWhatsAppValid && (
                  <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-3.5 sm:p-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                      Seu e-mail
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 pointer-events-none text-gray-400">
                        <Mail className="h-4.5 w-4.5" />
                      </div>
                      <input
                        ref={emailInputRef}
                        type="email"
                        required
                        placeholder="seuemail@exemplo.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrorMessage('');
                        }}
                        onBlur={() => {
                          if (email.trim().includes('@')) {
                            lookupCRMContactByEmail(email.trim()).catch((err) => console.warn('[CRM Lookup]', err));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && isEmailValid) {
                            e.preventDefault();
                            serviceSelectRef.current?.focus();
                          }
                        }}
                        className="w-full pl-11 pr-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 bg-[#FCFAF7] text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all shadow-2xs font-sans"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 font-light">
                      Digite seu e-mail para contato.
                    </p>
                  </div>
                )}

                {/* CAMPO 4: Selecione o assunto (aparece automaticamente após preencher o Campo 3) */}
                {isFullNameValid && isWhatsAppValid && isEmailValid && (
                  <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-3.5 sm:p-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                      Selecione o assunto
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 pointer-events-none text-gray-400">
                        <Compass className="h-4.5 w-4.5" />
                      </div>
                      <select
                        ref={serviceSelectRef}
                        value={serviceId}
                        onChange={(e) => {
                          setServiceId(e.target.value);
                          setErrorMessage('');
                        }}
                        className="w-full pl-11 pr-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 bg-[#FCFAF7] text-xs sm:text-sm text-gray-800 outline-none transition-all font-sans font-medium shadow-2xs"
                      >
                        <option value="" disabled>
                          Selecione um assunto...
                        </option>
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
                    </div>
                    <p className="text-[11px] text-gray-500 font-light">
                      Selecione o assunto ou atendimento desejado.
                    </p>
                  </div>
                )}

                {/* Exibição amigável de erro se houver */}
                {errorMessage && (
                  <div className="text-[11px] text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 animate-in fade-in">
                    {errorMessage}
                  </div>
                )}
              </form>
            ) : (
              /* CARD DE SUCESSO E REDIRECIONAMENTO */
              <div className="bg-[#dcf8c6] rounded-xl p-4 sm:p-5 shadow-sm border border-[#25D366]/40 text-center space-y-3 animate-in fade-in duration-300">
                <div className="mx-auto w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-[#075E54]">
                  Conectando com o WhatsApp...
                </h4>
                <p className="text-xs text-[#1b1463] leading-relaxed">
                  Sua mensagem foi gerada! Se o aplicativo do WhatsApp não abriu automaticamente, clique no botão abaixo:
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

          {/* BARRA INFERIOR COM O BOTÃO ÚNICO "INICIAR CONVERSA" */}
          {!isSuccess && (
            <div className="p-3.5 sm:p-4 bg-[#F4F6F8] border-t border-gray-200/80 shrink-0">
              <button
                type="button"
                onClick={() => handleFinalSubmit()}
                disabled={!isAllValid || isSubmitting}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs sm:text-[13px] font-bold uppercase tracking-wider transition-all shadow-xs ${
                  isAllValid && !isSubmitting
                    ? 'bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-md cursor-pointer active:scale-[0.98]'
                    : 'bg-[#E5E9EC] text-[#9AA5AF] cursor-not-allowed'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>
                  {isSubmitting ? 'INICIANDO CONVERSA...' : 'INICIAR CONVERSA'}
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