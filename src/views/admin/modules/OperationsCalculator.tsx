/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo: Calculadora Astral (Bússola Pessoal, Trânsitos, Geração de Texto & PDF)
 * Tema Claro (Light Theme) para Edição e Operação Confortável
 */

import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Compass,
  Sparkles,
  Send,
  Mail,
  Download,
  CheckCircle2,
  AlertCircle,
  User,
  FileText,
  Printer
} from 'lucide-react';
import { CRMContactDetail, getCRMContactsList } from '../../../services/crmService';

export const OperationsCalculator: React.FC = () => {
  const [contacts, setContacts] = useState<CRMContactDetail[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string>('');

  // Parâmetros de Trânsitos Astrológicos (Inseridos pela Bianca)
  const [cyclePeriod, setCyclePeriod] = useState<string>('Quinzena de 15 a 30 de Novembro');
  const [dominantPlanet, setDominantPlanet] = useState<string>('Saturno retrógrado');
  const [signTransit, setSignTransit] = useState<string>('Peixes na Casa 10');
  const [transitAspect, setTransitAspect] = useState<string>('Trígono com Júpiter em Câncer');
  const [themeFocus, setThemeFocus] = useState<string>('Carreira, Estruturação e Limites Saudáveis');
  const [shadowWarning, setShadowWarning] = useState<string>('Cuidado com a sobrecarga mental e autocrítica paralisante.');
  const [affirmationGuidance, setAffirmationGuidance] = useState<string>('Reconheço o valor do meu tempo e construo minhas conquistas passo a passo.');

  // Estado da geração de relatório
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<{
    clientName: string;
    whatsapp: string;
    email: string;
    title: string;
    body: string;
    pdfGeneratedAt: string;
  } | null>(null);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    getCRMContactsList().then((list) => {
      setContacts(list);
      if (list.length > 0 && !selectedContactId) {
        setSelectedContactId(list[0].id);
      }
    });
  }, []);

  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  const handleGeneratePersonalCompass = () => {
    if (!selectedContact) {
      setNotification({ type: 'error', text: 'Selecione um cliente cadastrado no CRM para prosseguir.' });
      return;
    }

    setIsGenerating(true);
    setNotification(null);

    setTimeout(() => {
      const generatedText = `✨ *BÚSSOLA PESSOAL — CASA 6* ✨
Olá, ${selectedContact.firstName}! Aqui é a Bianca Tofoli.

Preparei a leitura dos seus trânsitos astrais personalizados para o ciclo: *${cyclePeriod}*.

🪐 *Trânsito Ativo*: ${dominantPlanet} ativando ${signTransit}.
🔮 *Aspecto Planetário*: ${transitAspect}.
🎯 *Foco de Potência*: ${themeFocus}.

⚠️ *Atenção à Sombra*:
${shadowWarning}

🕊️ *Mantra de Alinhamento*:
"${affirmationGuidance}"

Esta bússola é o seu guia prático para agir com lucidez e acolhimento nos próximos 15 dias.

Com carinho cósmico,
*Bianca Tofoli | Casa 6* 🪐`;

      setGeneratedResult({
        clientName: selectedContact.fullName,
        whatsapp: selectedContact.whatsapp,
        email: selectedContact.email,
        title: `Bússola Pessoal — ${selectedContact.firstName} (${cyclePeriod})`,
        body: generatedText,
        pdfGeneratedAt: new Date().toLocaleString('pt-BR')
      });

      setIsGenerating(false);
      setNotification({ type: 'success', text: 'Bússola Pessoal calculada e formatada com sucesso!' });
    }, 500);
  };

  const handleSendWhatsApp = () => {
    if (!generatedResult || !selectedContact) return;
    const cleanPhone = selectedContact.whatsapp.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const encoded = encodeURIComponent(generatedResult.body);
    window.open(`https://wa.me/${phoneWithCountry}?text=${encoded}`, '_blank');
  };

  const handleSendEmail = () => {
    if (!generatedResult || !selectedContact) return;
    const subject = encodeURIComponent(generatedResult.title);
    const body = encodeURIComponent(generatedResult.body);
    window.open(`mailto:${selectedContact.email}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#22205A]">
      {/* Cabeçalho */}
      <div className="border-b border-[#E5E0D8] pb-4">
        <div className="flex items-center gap-2 text-[#D99426] text-xs font-bold uppercase tracking-widest">
          <Calculator className="h-4 w-4" />
          <span>Operações &bull; Calculadora Astral</span>
        </div>
        <h2 className="text-2xl font-heading font-black text-[#22205A] mt-1">
          Calculadora Astral (Bússola Pessoal)
        </h2>
        <p className="text-xs sm:text-sm text-[#68638C]">
          Insira os parâmetros de trânsito cósmico, conecte ao cliente do CRM e gere a Bússola Pessoal com envio direto no WhatsApp e e-mail.
        </p>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm font-semibold transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Grid: Formulário e Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulário (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="font-heading text-base font-bold text-[#22205A] flex items-center gap-2 border-b border-[#F0EBE1] pb-3">
            <Sparkles className="h-4 w-4 text-[#D99426]" />
            1. Parâmetros de Trânsito & Consulente
          </h3>

          {/* Seleção do Cliente via CRM */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#22205A] uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#D99426]" />
              Cliente do CRM (Consulente)
            </label>
            <select
              value={selectedContactId}
              onChange={(e) => setSelectedContactId(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CC] focus:border-[#F0B55E] rounded-xl px-3.5 py-2.5 text-[#22205A] text-xs sm:text-sm focus:outline-none"
            >
              <option value="">Selecione um cliente...</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} — Tel: {c.whatsapp || 's/ whats'} ({c.email})
                </option>
              ))}
            </select>
            {selectedContact && (
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE5DC] text-[11px] text-[#554F70] flex flex-wrap gap-x-4 gap-y-1">
                <span><strong>Nascimento:</strong> {selectedContact.birthDay}/{selectedContact.birthMonth}/{selectedContact.birthYear || 'ND'}</span>
                <span><strong>Horário:</strong> {selectedContact.birthHour}:{selectedContact.birthMinute || 'ND'}</span>
                <span><strong>Cidade:</strong> {selectedContact.city || 'ND'} - {selectedContact.state || 'ND'}</span>
                <span><strong>Tags:</strong> {selectedContact.tags.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Dados de Trânsitos Cósmicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#22205A]">Ciclo / Período da Bússola</label>
              <input
                type="text"
                value={cyclePeriod}
                onChange={(e) => setCyclePeriod(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-[#22205A] text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#22205A]">Planeta Regente do Momento</label>
              <input
                type="text"
                value={dominantPlanet}
                onChange={(e) => setDominantPlanet(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-[#22205A] text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#22205A]">Signo & Casa Ativada</label>
              <input
                type="text"
                value={signTransit}
                onChange={(e) => setSignTransit(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-[#22205A] text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#22205A]">Aspecto Planetário Maior</label>
              <input
                type="text"
                value={transitAspect}
                onChange={(e) => setTransitAspect(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-[#22205A] text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#22205A]">Foco de Potência & Direção Positiva</label>
            <input
              type="text"
              value={themeFocus}
              onChange={(e) => setThemeFocus(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CC] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-[#22205A] text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#22205A]">Alerta de Sombra / Desafio Astrológico</label>
            <textarea
              rows={2}
              value={shadowWarning}
              onChange={(e) => setShadowWarning(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CC] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-[#22205A] text-xs resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#22205A]">Mantra ou Afirmação de Alinhamento</label>
            <input
              type="text"
              value={affirmationGuidance}
              onChange={(e) => setAffirmationGuidance(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CC] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-[#22205A] text-xs"
            />
          </div>

          <button
            type="button"
            onClick={handleGeneratePersonalCompass}
            disabled={isGenerating || !selectedContact}
            className="w-full py-3 px-6 rounded-xl bg-[#22205A] hover:bg-[#1B1948] text-[#F0B55E] font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Compass className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Calculando & Formatando...' : 'Calcular & Gerar Bússola Pessoal'}</span>
          </button>
        </div>

        {/* Visualização Prévia do PDF & Envio (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-heading text-base font-bold text-[#22205A] flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#D99426]" />
                2. Bússola Formatada & PDF
              </span>
              {generatedResult && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Pronto
                </span>
              )}
            </h3>

            {generatedResult ? (
              <div className="space-y-4">
                {/* Cartão Estilizado de Documento Casa 6 */}
                <div className="bg-[#FAF8F5] border-2 border-[#D99426]/30 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#EAE5DC] pb-2">
                    <img
                      src="https://static.wixstatic.com/media/02c8e0_916db28bdef7413a82fde89b9ce7f738~mv2.png"
                      alt="Casa 6"
                      className="h-5 w-auto"
                    />
                    <span className="text-[10px] text-[#D99426] font-bold uppercase tracking-wider">
                      Documento PDF Oficial
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[#22205A] font-bold text-sm">{generatedResult.title}</h4>
                    <p className="text-[10px] text-[#68638C]">
                      Destinatário: <strong>{generatedResult.clientName}</strong> &bull; {generatedResult.pdfGeneratedAt}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3 text-[11px] text-[#22205A] font-mono leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto border border-[#EAE5DC]">
                    {generatedResult.body}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#68638C]">
                    <span>Formato A4 Vertical &bull; Casa 6</span>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1 text-[#D99426] hover:underline font-bold"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Imprimir / PDF
                    </button>
                  </div>
                </div>

                {/* Botões de Ação Imediata (WhatsApp & E-mail) */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    className="py-3 px-4 rounded-xl bg-[#22205A] hover:bg-[#1B1948] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Mail className="h-4 w-4" />
                    <span>E-mail</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-[#68638C] space-y-3">
                <Compass className="h-10 w-10 text-[#D99426]/50 mx-auto" />
                <p className="text-xs max-w-xs mx-auto">
                  Selecione um cliente e clique em <strong>"Calcular & Gerar Bússola Pessoal"</strong> para gerar a leitura personalizada e habilitar os envios.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
