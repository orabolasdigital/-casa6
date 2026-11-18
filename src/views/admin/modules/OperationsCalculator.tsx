/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo: Calculadora Astral (Bússola Pessoal, Trânsitos, Geração de Texto & PDF)
 */

import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Compass,
  Sparkles,
  Send,
  Mail,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar,
  Share2,
  FileText,
  Clock,
  ArrowRight
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
  const [shadowWarning, setShadowWarning] = useState<string>('Cuidado com a sobrecarga e autocrítica paralisante.');
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
    }, 600);
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
    <div className="space-y-8 animate-fadeIn">
      {/* Cabeçalho do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#372B69] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#F0B55E] text-xs font-bold uppercase tracking-widest">
            <Calculator className="h-4 w-4" />
            <span>Operações &bull; Módulo Astral</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Calculadora Astral (Bússola Pessoal)
          </h2>
          <p className="text-xs sm:text-sm text-[#DAD2C4]">
            Insira os dados dos trânsitos cósmicos, cruze com o CRM de clientes e gere Bússolas em PDF e mensagens personalizadas.
          </p>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm font-semibold transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Grid: Formulário de Inserção de Trânsitos e Seleção de Cliente */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Parâmetros (7 cols) */}
        <div className="lg:col-span-7 bg-[#1D1B48] border border-[#372B69] rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2 border-b border-[#372B69] pb-3">
            <Sparkles className="h-5 w-5 text-[#F0B55E]" />
            1. Parâmetros de Trânsito & Destinatário
          </h3>

          {/* Seleção do Cliente via CRM */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#DAD2C4] uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#F0B55E]" />
              Cliente do CRM (Consulente)
            </label>
            <select
              value={selectedContactId}
              onChange={(e) => setSelectedContactId(e.target.value)}
              className="w-full bg-[#2B2566] border border-[#372B69] focus:border-[#F0B55E] rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none"
            >
              <option value="">Selecione um cliente...</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} — Tel: {c.whatsapp || 's/ whats'} ({c.email})
                </option>
              ))}
            </select>
            {selectedContact && (
              <div className="p-3 bg-[#22205A] rounded-xl border border-white/5 text-[11px] text-[#DAD2C4] flex flex-wrap gap-x-4 gap-y-1">
                <span><strong>Nascimento:</strong> {selectedContact.birthDay}/{selectedContact.birthMonth}/{selectedContact.birthYear || 'ND'}</span>
                <span><strong>Horário:</strong> {selectedContact.birthHour}:{selectedContact.birthMinute || 'ND'}</span>
                <span><strong>Cidade:</strong> {selectedContact.city || 'ND'} - {selectedContact.state || 'ND'}</span>
                <span><strong>Tags:</strong> {selectedContact.tags.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Dados de Trânsitos Cósmicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#DAD2C4]">Ciclo / Período da Bússola</label>
              <input
                type="text"
                value={cyclePeriod}
                onChange={(e) => setCyclePeriod(e.target.value)}
                className="w-full bg-[#2B2566] border border-[#372B69] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#DAD2C4]">Planeta Regente do Momento</label>
              <input
                type="text"
                value={dominantPlanet}
                onChange={(e) => setDominantPlanet(e.target.value)}
                className="w-full bg-[#2B2566] border border-[#372B69] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#DAD2C4]">Signo & Casa Ativada</label>
              <input
                type="text"
                value={signTransit}
                onChange={(e) => setSignTransit(e.target.value)}
                className="w-full bg-[#2B2566] border border-[#372B69] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#DAD2C4]">Aspecto Planetário Maior</label>
              <input
                type="text"
                value={transitAspect}
                onChange={(e) => setTransitAspect(e.target.value)}
                className="w-full bg-[#2B2566] border border-[#372B69] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#DAD2C4]">Foco de Potência & Direção Positiva</label>
            <input
              type="text"
              value={themeFocus}
              onChange={(e) => setThemeFocus(e.target.value)}
              className="w-full bg-[#2B2566] border border-[#372B69] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#DAD2C4]">Alerta de Sombra / Desafio Astrológico</label>
            <textarea
              rows={2}
              value={shadowWarning}
              onChange={(e) => setShadowWarning(e.target.value)}
              className="w-full bg-[#2B2566] border border-[#372B69] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-white text-xs resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#DAD2C4]">Mantra ou Afirmação de Alinhamento</label>
            <input
              type="text"
              value={affirmationGuidance}
              onChange={(e) => setAffirmationGuidance(e.target.value)}
              className="w-full bg-[#2B2566] border border-[#372B69] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-white text-xs"
            />
          </div>

          <button
            type="button"
            onClick={handleGeneratePersonalCompass}
            disabled={isGenerating || !selectedContact}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#F0B55E] to-[#E5A344] text-[#1E1B4B] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Compass className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Calculando & Formatando...' : 'Calcular & Gerar Bússola Pessoal'}</span>
          </button>
        </div>

        {/* Coluna Direita: Visualização Prévia do PDF & Disparo (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1D1B48] border border-[#372B69] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-heading text-lg font-bold text-white flex items-center justify-between border-b border-[#372B69] pb-3">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#F0B55E]" />
                2. Bússola em PDF & Texto
              </span>
              {generatedResult && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  Pronto para Envio
                </span>
              )}
            </h3>

            {generatedResult ? (
              <div className="space-y-4">
                {/* Cartão de Visualização Estilizada do PDF Casa 6 */}
                <div className="bg-[#2B2566] border border-[#F0B55E]/40 rounded-xl p-5 shadow-2xl relative overflow-hidden space-y-3">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#F0B55E]/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <img
                      src="https://static.wixstatic.com/media/02c8e0_916db28bdef7413a82fde89b9ce7f738~mv2.png"
                      alt="Casa 6"
                      className="h-6 w-auto"
                    />
                    <span className="text-[10px] text-[#F0B55E] font-bold uppercase tracking-wider">
                      Documento Oficial PDF
                    </span>
                  </div>

                  <div>
                    <h4 className="text-white font-bold text-sm">{generatedResult.title}</h4>
                    <p className="text-[10px] text-[#DAD2C4]">
                      Destinatário: <strong>{generatedResult.clientName}</strong> &bull; Gerado em: {generatedResult.pdfGeneratedAt}
                    </p>
                  </div>

                  <div className="bg-[#1D1B48] rounded-lg p-3 text-[11px] text-[#DAD2C4] font-mono leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto border border-white/5">
                    {generatedResult.body}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#DAD2C4]/70">
                    <span>Layout A4 Vertical com Selo Casa 6</span>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1 text-[#F0B55E] hover:underline font-bold"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Baixar PDF
                    </button>
                  </div>
                </div>

                {/* Botões de Ação Imediata (WhatsApp & E-mail) */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    className="py-3 px-4 rounded-xl bg-[#2B2566] hover:bg-[#372B69] border border-[#F0B55E]/40 text-[#F0B55E] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Enviar E-mail</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-[#DAD2C4] space-y-3">
                <Compass className="h-10 w-10 text-[#F0B55E]/40 mx-auto animate-pulse" />
                <p className="text-xs">
                  Selecione um cliente e clique em <strong>"Calcular & Gerar Bússola Pessoal"</strong> para visualizar o documento PDF e liberar os canais de envio.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
