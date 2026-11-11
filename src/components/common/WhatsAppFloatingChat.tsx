/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Formulário Master Global Flutuante estilo Conversa do WhatsApp
 */

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { OFFICIAL_SERVICES, SITE_CONFIG } from '../../config/site';
import { submitLeadBooking } from '../../services/leads';
import { trackAnalyticsEvent } from '../../services/analytics';

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [serviceId, setServiceId] = useState(initialServiceId || OFFICIAL_SERVICES[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  // Listener para eventos globais de disparo do chat
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

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      if (onCloseExternal) onCloseExternal();
    } else {
      setIsOpen(true);
      trackAnalyticsEvent('open_booking', { source: 'floating_whatsapp_chat' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (!firstName.trim() || !lastName.trim() || !whatsapp.trim() || !email.trim()) {
        throw new Error('Por favor, preencha todos os campos para falar com Bianca.');
      }

      const res = await submitLeadBooking(
        {
          firstName,
          lastName,
          whatsapp,
          email,
          serviceId
        },
        'WhatsApp Chat Master'
      );

      setIsSuccess(true);
      trackAnalyticsEvent('whatsapp_click', { serviceId });

      // Abre o WhatsApp oficial imediatamente em nova aba
      setTimeout(() => {
        window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao preparar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFirstName('');
    setLastName('');
    setWhatsapp('');
    setEmail('');
    setIsOpen(false);
    if (onCloseExternal) onCloseExternal();
  };

  return (
    <>
      {/* Botão Flutuante no Canto Inferior Direito */}
      <aside aria-label="WhatsApp da Bianca Tofoli" className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 print:hidden">
        <button
          onClick={handleToggle}
          aria-label={isOpen ? 'Fechar conversa' : 'Abrir conversa de WhatsApp com Bianca Tofoli'}
          className="group relative flex items-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white font-bold py-2.5 px-3.5 sm:py-3 sm:px-4.5 shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer"
          style={{
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45), 0 2px 8px rgba(27, 20, 99, 0.25)'
          }}
        >
          {/* Foto oficial da Bianca no botão WhatsApp */}
          <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-white overflow-hidden shadow-xs shrink-0">
            <img
              src="https://static.wixstatic.com/media/02c8e0_defbbc681ee8458ba9a2f91f33f4e6da~mv2.jpg"
              alt="Bianca Tofoli"
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#25D366] border border-white" />
          </div>
          <span className="relative flex h-5 w-5 items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white fill-white" />
            {!isOpen && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-white animate-ping opacity-80" />}
          </span>
          <span className="text-xs sm:text-sm tracking-wide font-extrabold uppercase">
            {isOpen ? 'Fechar' : 'WhatsApp'}
          </span>
        </button>
      </aside>

      {/* Janela de Conversa Estilo WhatsApp */}
      {isOpen && (
        <div className="fixed bottom-20 right-3 sm:bottom-24 sm:right-6 z-50 w-[94vw] max-w-[390px] rounded-2xl bg-[#FCFAF7] border border-[#c7c5b6] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Header do WhatsApp (#075E54) */}
          <div className="bg-[#075E54] text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-full border-2 border-white/90 overflow-hidden shadow-sm shrink-0">
                <img
                  src="https://static.wixstatic.com/media/02c8e0_defbbc681ee8458ba9a2f91f33f4e6da~mv2.jpg"
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

            <button
              onClick={() => {
                setIsOpen(false);
                if (onCloseExternal) onCloseExternal();
              }}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
              aria-label="Fechar janela"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Área de Conversa e Balões estilo WhatsApp */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#e5ddd5]/30 bg-repeat" style={{ backgroundImage: `radial-gradient(#1b1463 0.5px, transparent 0.5px)`, backgroundSize: '12px 12px' }}>
            
            {/* Balão 1 da Bianca */}
            <div className="flex items-start gap-2 max-w-[88%]">
              <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-xs border border-[#c7c5b6]/60 text-xs sm:text-sm text-[#1b1463] space-y-1">
                <p className="font-semibold text-[#075E54] text-[11px] uppercase tracking-wider">Bianca Tofoli</p>
                <p>Olá! Seja muito bem-vindo(a) à Casa 6. ✨</p>
                <p className="text-[10px] text-right text-gray-400">Agora</p>
              </div>
            </div>

            {/* Balão 2 da Bianca */}
            <div className="flex items-start gap-2 max-w-[88%]">
              <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-xs border border-[#c7c5b6]/60 text-xs sm:text-sm text-[#1b1463] space-y-1">
                <p>Preencha os dados abaixo para continuar a conversa direto no meu WhatsApp com sua mensagem pronta:</p>
                <p className="text-[10px] text-right text-gray-400">Agora</p>
              </div>
            </div>

            {/* Balão com Formulário Embutido */}
            {isSuccess ? (
              <div className="bg-[#dcf8c6] rounded-2xl p-4 shadow-sm border border-[#25D366]/40 text-center space-y-3">
                <div className="mx-auto w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="font-heading font-bold text-sm text-[#075E54]">Conectando com o WhatsApp...</h4>
                <p className="text-xs text-[#1b1463]">
                  Se a conversa não abriu automaticamente, clique no botão abaixo:
                </p>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsappNumberRaw}?text=${encodeURIComponent(`Olá, Bianca! Meu nome é ${firstName} ${lastName}. Vim pelo site da Casa 6 e gostaria de atendimento sobre ${serviceId}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#25D366] text-white text-xs font-bold shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  Abrir WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] text-[#075E54] hover:underline block mx-auto cursor-pointer"
                >
                  Iniciar nova mensagem
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-4 shadow-md border border-[#c7c5b6] space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#075E54] uppercase tracking-wider border-b border-gray-100 pb-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#25D366]" />
                  <span>Formulário Master de Atendimento</span>
                </div>

                {errorMessage && (
                  <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                    {errorMessage}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#1b1463] mb-0.5">Nome *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nome"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full text-xs rounded-lg border border-[#c7c5b6] bg-[#FCFAF7] px-2.5 py-2 text-[#1b1463] focus:border-[#25D366] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#1b1463] mb-0.5">Sobrenome *</label>
                      <input
                        type="text"
                        required
                        placeholder="Sobrenome"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full text-xs rounded-lg border border-[#c7c5b6] bg-[#FCFAF7] px-2.5 py-2 text-[#1b1463] focus:border-[#25D366] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#1b1463] mb-0.5">WhatsApp (com DDD) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 11 99999-9999"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full text-xs rounded-lg border border-[#c7c5b6] bg-[#FCFAF7] px-2.5 py-2 text-[#1b1463] focus:border-[#25D366] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#1b1463] mb-0.5">E-mail *</label>
                    <input
                      type="email"
                      required
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs rounded-lg border border-[#c7c5b6] bg-[#FCFAF7] px-2.5 py-2 text-[#1b1463] focus:border-[#25D366] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#1b1463] mb-0.5">Assunto ou Serviço *</label>
                    <select
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      className="w-full text-xs rounded-lg border border-[#c7c5b6] bg-[#FCFAF7] px-2 py-2 text-[#1b1463] focus:border-[#25D366] focus:outline-none font-medium"
                    >
                      <optgroup label="Atendimentos Contínuos">
                        <option value="pronto-socorro-astrologico">Pronto Socorro Astrológico</option>
                        <option value="acompanhamento-astral-mensal">Acompanhamento Astral (Mensal)</option>
                      </optgroup>
                      <optgroup label="Atendimentos Únicos">
                        <option value="mapa-natal-nascimento">Mapa Natal (Nascimento)</option>
                        <option value="planejamento-astral-mensal">Planejamento astral (Mensal)</option>
                        <option value="mapa-revolucao-solar">Mapa Revolução Solar (Anual)</option>
                      </optgroup>
                      <optgroup label="Combos Exclusivos">
                        <option value="combo-mapa-roda-revolucao">Combo: Mapa Natal + Roda + Revolução Solar</option>
                        <option value="combo-mapa-roda-terapias">Combo: Mapa Natal + Roda + Barras/Reiki</option>
                      </optgroup>
                      <optgroup label="Palestras & Corporativo (NR-1)">
                        <option value="palestra-nr1-corporativa">Palestra Corporativa & Bem-Estar (NR-1)</option>
                        <option value="palestra-waap">WAAP: Workshop Astrológico Profissional</option>
                        <option value="palestra-respirar-calma">RESPIRAR (a) CALMA</option>
                        <option value="palestra-autoconhecimento-cuidado">Autoconhecimento: Cuidado para si e o outro</option>
                        <option value="palestra-temas-personalizados">Tema Personalizado para Evento</option>
                      </optgroup>
                      <optgroup label="Novos Serviços & Comunidade">
                        <option value="bussula-guia">Bússola Guia (Relatório Astral Mensal)</option>
                        <option value="patota-astral">Patota Astral (Assinatura Recorrente)</option>
                        <option value="vivencia-curando-os-ciclos">Vivência Curando os Ciclos</option>
                        <option value="duvidas-gerais">Outras Dúvidas com Bianca Tofoli</option>
                      </optgroup>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-4 text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer transform active:scale-98 disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? 'Enviando...' : 'Conversar no WhatsApp'}</span>
                  </button>
                </form>
              </div>
            )}

            <div className="text-[10px] text-center text-gray-500 pt-1">
              Direcionado diretamente ao WhatsApp oficial de Bianca Tofoli
            </div>
          </div>
        </div>
      )}
    </>
  );
};
