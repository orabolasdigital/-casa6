/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Popup Global de Agendamento (Inspiração Visual WhatsApp)
 * 
 * Requisitos Oficiais:
 * - Header verde (#075E54 / #128C7E) com identificação Casa 6 / Bianca Tofoli
 * - Sensação de chat acolhedor
 * - Título: "Agende sua consulta"
 * - Subtexto: "Preencha seus dados e continue a conversa com Bianca pelo WhatsApp."
 * - Exatamente 5 campos: Nome, Sobrenome, WhatsApp, E-mail, Tipo de atendimento.
 * - Botão de ação verde WhatsApp (#25D366).
 * - Sem campo de mensagem, observações ou texto livre.
 */

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, ArrowRight, MessageCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import { OFFICIAL_SERVICES, SITE_CONFIG } from '../../config/site';
import { LeadFormInput } from '../../types';
import { submitLeadBooking } from '../../services/leads';
import {
  sanitizeName,
  formatWhatsAppNumber,
  lookupCRMContactByEmail,
  saveCRMContactRecord
} from '../../services/formValidation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  sourcePageTitle?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedServiceId,
  sourcePageTitle = 'Website Casa 6'
}) => {
  const [formData, setFormData] = useState<LeadFormInput>({
    firstName: '',
    lastName: '',
    whatsapp: '',
    email: '',
    serviceId: preselectedServiceId || OFFICIAL_SERVICES[0].id
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [whatsappRedirectUrl, setWhatsappRedirectUrl] = useState('');
  const [crmMismatchAlert, setCrmMismatchAlert] = useState<{
    show: boolean;
    existingWhatsapp: string;
    newWhatsapp: string;
  }>({ show: false, existingWhatsapp: '', newWhatsapp: '' });

  // Atualiza serviço selecionado dinamicamente quando a modal abre
  useEffect(() => {
    if (preselectedServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: preselectedServiceId }));
    }
  }, [preselectedServiceId, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'firstName' || name === 'lastName') {
      formattedValue = sanitizeName(value).slice(0, 15);
    } else if (name === 'whatsapp') {
      formattedValue = formatWhatsAppNumber(value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleEmailBlur = async () => {
    if (!formData.email || !formData.email.includes('@')) return;
    try {
      const existing = await lookupCRMContactByEmail(formData.email);
      if (existing) {
        setFormData((prev) => ({
          ...prev,
          firstName: prev.firstName || existing.firstName || '',
          lastName: prev.lastName || existing.lastName || '',
          whatsapp: prev.whatsapp || existing.whatsapp || ''
        }));

        if (formData.whatsapp && existing.whatsapp && formData.whatsapp !== existing.whatsapp) {
          setCrmMismatchAlert({
            show: true,
            existingWhatsapp: existing.whatsapp,
            newWhatsapp: formData.whatsapp
          });
        }
      }
    } catch (e) {
      console.warn('[CRM Lookup]', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await submitLeadBooking(formData, sourcePageTitle);
      setWhatsappRedirectUrl(result.whatsappUrl);
      setSubmitSuccess(true);

      // Redireciona diretamente para o WhatsApp após gravar lead no CRM
      setTimeout(() => {
        window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ocorreu um erro ao processar seu agendamento.';
      setErrors({ form: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitSuccess(false);
    setWhatsappRedirectUrl('');
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#080C35]/80 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-booking-title"
    >
      <div className="relative w-full max-w-lg rounded-sm bg-[#FCFAF7] shadow-2xl border border-[#DAD2C4] overflow-hidden flex flex-col max-h-[92vh] font-sans">
        
        {/* HEADER INSPIRADO NO WHATSAPP (#075E54 / #128C7E) */}
        <div className="bg-[#075E54] text-white px-5 py-4 flex items-center justify-between border-b border-[#128C7E] shrink-0">
          <div className="flex items-center gap-3">
            {/* Avatar / Foto de Bianca Tofoli */}
            <div className="relative h-11 w-11 rounded-full border-2 border-white/80 overflow-hidden shadow-sm shrink-0">
              <img
                src="https://static.wixstatic.com/media/02c8e0_54a33eeb476d45c49b7f4953c34177fc~mv2.jpeg"
                alt="Bianca Tofoli"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
            </div>

            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-bold text-base text-white tracking-wide">
                  Casa 6 — Bianca Tofoli
                </span>
                <MessageCircle className="h-4 w-4 text-[#25D366] fill-[#25D366]" />
              </div>
              <span className="text-[11px] text-[#25D366] font-medium flex items-center gap-1 font-sans">
                <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] inline-block animate-pulse" />
                Online agora • Atendimento Oficial
              </span>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="rounded-sm p-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Fechar formulário"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CORPO DO FORMULÁRIO COM SENSAÇÃO DE CHAT */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-[#F3EEE5]/40 space-y-4 font-sans">
          
          {submitSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366]">
                <CheckCircle className="h-8 w-8 text-[#25D366]" />
              </div>
              <h3 className="font-sans text-xl font-bold text-[#22205A]">
                Solicitação Registrada com Sucesso!
              </h3>
              <p className="text-xs sm:text-sm text-[#534D6B] leading-relaxed max-w-sm mx-auto">
                Seus dados foram salvos com segurança. Você está sendo direcionado(a) para a conversa no WhatsApp oficial da Bianca.
              </p>
              {whatsappRedirectUrl && (
                <a
                  href={whatsappRedirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-[#25D366] hover:bg-[#20ba5a] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition-colors"
                >
                  <MessageCircle className="h-4 w-4 fill-white" />
                  <span>Continuar no WhatsApp</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}
              <div className="pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="text-xs text-[#534D6B] hover:underline cursor-pointer"
                >
                  Fechar janela
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Balão de Acolhimento estilo Chat */}
              <div className="relative mb-5 p-3.5 sm:p-4 rounded-sm bg-white border border-[#DAD2C4] shadow-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#075E54] uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#25D366]" />
                  <span>Agende sua consulta</span>
                </div>
                <p className="text-xs text-[#534D6B] leading-relaxed">
                  Preencha seus dados abaixo e continue a conversa diretamente com Bianca Tofoli pelo WhatsApp para alinhar datas e horários.
                </p>
              </div>

              {crmMismatchAlert.show && (
                <div className="mb-4 rounded-sm bg-[#FFF8E7] border border-[#F5A623] p-3 text-xs text-[#7A4B00] flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <RefreshCw className="h-4 w-4 text-[#F5A623] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">WhatsApp diferente encontrado no seu cadastro</p>
                      <p className="text-[11px] mt-0.5">
                        Identificamos seu e-mail cadastrado com o WhatsApp <strong>{crmMismatchAlert.existingWhatsapp}</strong>.
                        Deseja atualizar seu número para <strong>{crmMismatchAlert.newWhatsapp}</strong>?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <button
                      type="button"
                      onClick={() => setCrmMismatchAlert({ show: false, existingWhatsapp: '', newWhatsapp: '' })}
                      className="px-2.5 py-1 text-[11px] font-bold bg-[#1b1463] text-white rounded-sm hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Sim, atualizar número
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, whatsapp: crmMismatchAlert.existingWhatsapp }));
                        setCrmMismatchAlert({ show: false, existingWhatsapp: '', newWhatsapp: '' });
                      }}
                      className="px-2.5 py-1 text-[11px] text-[#7A4B00] underline cursor-pointer"
                    >
                      Manter número anterior
                    </button>
                  </div>
                </div>
              )}

              {errors.form && (
                <div className="mb-4 flex items-center gap-2 rounded-sm bg-red-50 p-3 text-xs text-[#B71C1C] border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* FORMULÁRIO COM EXCLUSIVAMENTE OS 5 CAMPOS REGULAMENTADOS */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Linha 1: Nome e Sobrenome */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-[11px] font-bold uppercase tracking-wider text-[#22205A] mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      maxLength={15}
                      autoComplete="given-name"
                      placeholder="Seu primeiro nome"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-[#DAD2C4] bg-white px-3.5 py-2.5 text-sm text-[#211D35] placeholder-[#7A7394] focus:border-[#25D366] focus:outline-none focus:ring-1 focus:ring-[#25D366]"
                    />
                    {errors.firstName && <p className="mt-1 text-[11px] text-[#B71C1C]">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-[11px] font-bold uppercase tracking-wider text-[#22205A] mb-1">
                      Sobrenome *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      maxLength={15}
                      autoComplete="family-name"
                      placeholder="Seu sobrenome"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-[#DAD2C4] bg-white px-3.5 py-2.5 text-sm text-[#211D35] placeholder-[#7A7394] focus:border-[#25D366] focus:outline-none focus:ring-1 focus:ring-[#25D366]"
                    />
                    {errors.lastName && <p className="mt-1 text-[11px] text-[#B71C1C]">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Campo 3: WhatsApp */}
                <div>
                  <label htmlFor="whatsapp" className="block text-[11px] font-bold uppercase tracking-wider text-[#22205A] mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    required
                    autoComplete="tel"
                    placeholder="Ex: 11 99999-9999"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full rounded-sm border border-[#DAD2C4] bg-white px-3.5 py-2.5 text-sm text-[#211D35] placeholder-[#7A7394] focus:border-[#25D366] focus:outline-none focus:ring-1 focus:ring-[#25D366]"
                  />
                  {errors.whatsapp && <p className="mt-1 text-[11px] text-[#B71C1C]">{errors.whatsapp}</p>}
                </div>

                {/* Campo 4: E-mail */}
                <div>
                  <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-[#22205A] mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="seuemail@exemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleEmailBlur}
                    className="w-full rounded-sm border border-[#DAD2C4] bg-white px-3.5 py-2.5 text-sm text-[#211D35] placeholder-[#7A7394] focus:border-[#25D366] focus:outline-none focus:ring-1 focus:ring-[#25D366]"
                  />
                  {errors.email && <p className="mt-1 text-[11px] text-[#B71C1C]">{errors.email}</p>}
                </div>

                {/* Campo 5: Tipo de Atendimento (Select Obrigatório) */}
                <div>
                  <label htmlFor="serviceId" className="block text-[11px] font-bold uppercase tracking-wider text-[#22205A] mb-1">
                    Tipo de Atendimento *
                  </label>
                  <select
                    id="serviceId"
                    name="serviceId"
                    required
                    value={formData.serviceId}
                    onChange={handleChange}
                    className="w-full rounded-sm border border-[#DAD2C4] bg-white px-3.5 py-2.5 text-sm text-[#211D35] focus:border-[#25D366] focus:outline-none focus:ring-1 focus:ring-[#25D366]"
                  >
                    {OFFICIAL_SERVICES.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.title} {srv.categoryGroup ? `[${srv.categoryGroup.toUpperCase()}]` : ''}
                      </option>
                    ))}
                  </select>
                  {errors.serviceId && <p className="mt-1 text-[11px] text-[#B71C1C]">{errors.serviceId}</p>}
                </div>

                {/* Botão de Envio Verde WhatsApp */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-sm bg-[#25D366] hover:bg-[#20ba5a] py-3.5 text-sm font-extrabold text-white shadow-md disabled:opacity-50 transition-all cursor-pointer transform active:scale-98"
                  >
                    <MessageCircle className="h-5 w-5 fill-white" />
                    {isSubmitting ? (
                      <span>Gravando e conectando...</span>
                    ) : (
                      <>
                        <span>CONTINUAR NO WHATSAPP</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-center text-[#7A7394] leading-relaxed pt-1">
                  Seus dados são protegidos conforme a LGPD. Ao clicar, a mensagem pré-formatada será aberta no WhatsApp da Bianca.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
