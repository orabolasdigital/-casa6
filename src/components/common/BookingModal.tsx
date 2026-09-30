/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Formulário Global Reutilizável de Agendamento (Modal Oficial)
 * 
 * Regra Arquitetural Absoluta:
 * Contém EXCLUSIVAMENTE 5 campos: Nome, Sobrenome, WhatsApp, E-mail, Tipo de atendimento.
 * Sem campo de mensagem, observações ou texto livre.
 * Atualizado com a paleta oficial de céu noturno (Azul-violeta, Roxo profundo e Dourado).
 */

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { OFFICIAL_SERVICES } from '../../config/site';
import { LeadFormInput } from '../../types';
import { submitLeadBooking } from '../../services/leads';

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

  // Atualiza serviço selecionado quando a modal abre com contexto
  useEffect(() => {
    if (preselectedServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: preselectedServiceId }));
    }
  }, [preselectedServiceId, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
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

      // Redirecionamento suave para o WhatsApp oficial
      setTimeout(() => {
        window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 1200);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080C35]/80 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-booking-title"
    >
      <div className="relative w-full max-w-lg rounded-xl bg-[#FCFAF7] p-6 md:p-8 shadow-2xl border border-[#DAD2C4]">
        {/* Botão Fechar */}
        <button
          onClick={handleResetAndClose}
          className="absolute right-4 top-4 rounded-full p-2 text-[#534D6B] hover:bg-[#F3EEE5] hover:text-[#22205A] transition-colors"
          aria-label="Fechar formulário"
        >
          <X className="h-5 w-5" />
        </button>

        {submitSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#372B69]/15 text-[#372B69]">
              <CheckCircle className="h-8 w-8 text-[#FFB63F]" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#22205A]">
              Solicitação Registrada com Sucesso!
            </h3>
            <p className="text-sm text-[#534D6B] leading-relaxed">
              Você está sendo direcionado(a) para o WhatsApp oficial da Bianca Tofoli com a mensagem pré-formatada.
            </p>
            {whatsappRedirectUrl && (
              <a
                href={whatsappRedirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded bg-[#22205A] px-5 py-2.5 text-sm font-bold text-[#FFB63F] shadow hover:bg-[#372B69] transition-colors border border-[#FFB63F]/30"
              >
                <span>Abrir WhatsApp Agora</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="text-xs text-[#534D6B] hover:underline"
              >
                Fechar esta janela
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F4D84]">
                Atendimento Oficial
              </span>
              <h2 id="modal-booking-title" className="font-heading text-2xl font-bold text-[#22205A]">
                Agendar Consulta
              </h2>
              <p className="text-xs text-[#534D6B]">
                Preencha seus dados para conectar diretamente com a Bianca Tofoli.
              </p>
            </div>

            {errors.form && (
              <div className="mb-4 flex items-center gap-2 rounded bg-red-50 p-3 text-xs text-[#B71C1C] border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* FORMULÁRIO ESTREITO COM EXCLUSIVAMENTE OS 5 CAMPOS REGULAMENTADOS */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo 1: Nome */}
              <div>
                <label htmlFor="firstName" className="block text-xs font-semibold text-[#22205A] mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  placeholder="Seu primeiro nome"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded border border-[#DAD2C4] bg-white px-3 py-2 text-sm text-[#211D35] placeholder-[#7A7394] focus:border-[#FFB63F] focus:outline-none focus:ring-1 focus:ring-[#FFB63F]"
                />
                {errors.firstName && <p className="mt-1 text-[11px] text-[#B71C1C]">{errors.firstName}</p>}
              </div>

              {/* Campo 2: Sobrenome */}
              <div>
                <label htmlFor="lastName" className="block text-xs font-semibold text-[#22205A] mb-1">
                  Sobrenome *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  placeholder="Seu sobrenome"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded border border-[#DAD2C4] bg-white px-3 py-2 text-sm text-[#211D35] placeholder-[#7A7394] focus:border-[#FFB63F] focus:outline-none focus:ring-1 focus:ring-[#FFB63F]"
                />
                {errors.lastName && <p className="mt-1 text-[11px] text-[#B71C1C]">{errors.lastName}</p>}
              </div>

              {/* Campo 3: WhatsApp */}
              <div>
                <label htmlFor="whatsapp" className="block text-xs font-semibold text-[#22205A] mb-1">
                  WhatsApp (com DDD) *
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  required
                  placeholder="Ex: 11 99999-9999"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full rounded border border-[#DAD2C4] bg-white px-3 py-2 text-sm text-[#211D35] placeholder-[#7A7394] focus:border-[#FFB63F] focus:outline-none focus:ring-1 focus:ring-[#FFB63F]"
                />
                {errors.whatsapp && <p className="mt-1 text-[11px] text-[#B71C1C]">{errors.whatsapp}</p>}
              </div>

              {/* Campo 4: E-mail */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-[#22205A] mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded border border-[#DAD2C4] bg-white px-3 py-2 text-sm text-[#211D35] placeholder-[#7A7394] focus:border-[#FFB63F] focus:outline-none focus:ring-1 focus:ring-[#FFB63F]"
                />
                {errors.email && <p className="mt-1 text-[11px] text-[#B71C1C]">{errors.email}</p>}
              </div>

              {/* Campo 5: Tipo de Atendimento (Select) */}
              <div>
                <label htmlFor="serviceId" className="block text-xs font-semibold text-[#22205A] mb-1">
                  Tipo de Atendimento *
                </label>
                <select
                  id="serviceId"
                  name="serviceId"
                  required
                  value={formData.serviceId}
                  onChange={handleChange}
                  className="w-full rounded border border-[#DAD2C4] bg-white px-3 py-2 text-sm text-[#211D35] focus:border-[#FFB63F] focus:outline-none focus:ring-1 focus:ring-[#FFB63F]"
                >
                  {OFFICIAL_SERVICES.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.title} {srv.categoryGroup ? `(${srv.categoryGroup.toUpperCase()})` : ''}
                    </option>
                  ))}
                </select>
                {errors.serviceId && <p className="mt-1 text-[11px] text-[#B71C1C]">{errors.serviceId}</p>}
              </div>

              {/* Botão de Envio Oficial */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded bg-[#FFB63F] py-3 text-sm font-bold text-[#080C35] shadow hover:bg-[#EAA329] disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <span>Processando solicitação...</span>
                  ) : (
                    <>
                      <span>SOLICITAR AGENDAMENTO</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-center text-[#7A7394]">
                Seus dados serão tratados com sigilo conforme a LGPD e enviados diretamente para o contato de WhatsApp de Bianca Tofoli.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
