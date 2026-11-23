/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo: Calculadora Astral & Gerador de Mapa Natal Padrão Astro.com
 * Tema Claro (Light Theme) para Operação e Análise Astrológica Profissional
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator,
  Compass,
  Sparkles,
  Send,
  Mail,
  Printer,
  User,
  Search,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Layers,
  FileText,
  Share2,
  PieChart,
  Flame,
  Globe2,
  Wind,
  Droplet,
  ChevronRight,
  Eye,
  RefreshCw,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { CRMContactDetail, getCRMContactsList } from '../../../services/crmService';
import {
  calculateFullNatalChart,
  NatalChartData,
  PlanetPosition,
  SIGN_SYMBOLS,
  SIGN_ELEMENTS,
  ELEMENT_COLORS
} from '../../../utils/astroEngine';
import { AstroChartMandala } from '../../../components/AstroChartMandala';

type CalculatorMainTab = 'mapa_natal' | 'bussola';
type NatalSubTab = 'mandala' | 'planetas' | 'aspectos' | 'interpretacoes';

export const OperationsCalculator: React.FC = () => {
  const [contacts, setContacts] = useState<CRMContactDetail[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [mainTab, setMainTab] = useState<CalculatorMainTab>('mapa_natal');
  const [natalSubTab, setNatalSubTab] = useState<NatalSubTab>('mandala');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dados do formulário para cálculo
  const [clientName, setClientName] = useState<string>('Consulente');
  const [birthDate, setBirthDate] = useState<string>('15/05/1992');
  const [birthTime, setBirthTime] = useState<string>('14:30');
  const [city, setCity] = useState<string>('São Paulo');
  const [state, setState] = useState<string>('SP');

  // Mapa Astral Calculado
  const [chartData, setChartData] = useState<NatalChartData | null>(null);
  const [selectedPlanetDetail, setSelectedPlanetDetail] = useState<PlanetPosition | null>(null);

  // Parâmetros de Trânsitos (Bússola Pessoal)
  const [cyclePeriod, setCyclePeriod] = useState<string>('Quinzena de 15 a 30 de Novembro');
  const [dominantPlanet, setDominantPlanet] = useState<string>('Saturno retrógrado');
  const [signTransit, setSignTransit] = useState<string>('Peixes na Casa 10');
  const [transitAspect, setTransitAspect] = useState<string>('Trígono com Júpiter em Câncer');
  const [themeFocus, setThemeFocus] = useState<string>('Carreira, Estruturação e Limites Saudáveis');
  const [shadowWarning, setShadowWarning] = useState<string>('Cuidado com a sobrecarga mental e autocrítica paralisante.');
  const [affirmationGuidance, setAffirmationGuidance] = useState<string>('Reconheço o valor do meu tempo e construo minhas conquistas passo a passo.');

  // Notificações
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Carregar lista de clientes do CRM
  useEffect(() => {
    setIsLoading(true);
    getCRMContactsList()
      .then((list) => {
        setContacts(list);
        if (list.length > 0) {
          const first = list[0];
          setSelectedContactId(first.id);
          applyContactToCalculator(first);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const applyContactToCalculator = (contact: CRMContactDetail) => {
    setClientName(contact.fullName || contact.nome || 'Consulente');
    setBirthDate(contact.dataNascimento || '15/05/1992');
    setBirthTime(contact.horarioNascimento || '12:00');
    setCity(contact.cidade || 'São Paulo');
    setState(contact.uf || 'SP');

    const calculated = calculateFullNatalChart(
      contact.fullName || contact.nome || 'Consulente',
      contact.dataNascimento || '15/05/1992',
      contact.horarioNascimento || '12:00',
      contact.cidade || 'São Paulo',
      contact.uf || 'SP'
    );
    setChartData(calculated);
    setSelectedPlanetDetail(calculated.planets[0] || null);
  };

  const handleSelectContactChange = (id: string) => {
    setSelectedContactId(id);
    const found = contacts.find((c) => c.id === id);
    if (found) {
      applyContactToCalculator(found);
      setNotification({
        type: 'success',
        text: `Dados de "${found.fullName}" carregados e Mapa Astral calculado com sucesso!`
      });
    }
  };

  const handleRecalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const calculated = calculateFullNatalChart(clientName, birthDate, birthTime, city, state);
    setChartData(calculated);
    setSelectedPlanetDetail(calculated.planets[0] || null);
    setNotification({
      type: 'success',
      text: `Mapa Natal de "${clientName}" gerado com sucesso no padrão fidedigno Astro.com!`
    });
  };

  const currentContact = contacts.find((c) => c.id === selectedContactId);

  // Compartilhar Mapa via WhatsApp
  const handleShareWhatsApp = () => {
    if (!chartData) return;
    const phone = currentContact?.whatsapp ? currentContact.whatsapp.replace(/\D/g, '') : '';
    const phoneWithCountry = phone ? (phone.startsWith('55') ? phone : `55${phone}`) : '';

    const text = `✨ *MAPA ASTRAL OFICIAL — CASA 6* ✨
Olá, ${chartData.clientName}! Aqui é a Bianca Tófoli.
Calculei o seu Mapa Astral completo:

☀️ *Sol*: ${chartData.sunSign} na Casa ${chartData.planets[0]?.house}
🌙 *Lua*: ${chartData.moonSign} na Casa ${chartData.planets[1]?.house}
⬆️ *Ascendente*: ${chartData.ascendantSign}
👑 *Meio do Céu*: ${chartData.midheavenSign}

🔥 *Elemento Dominante*: ${chartData.elementsBalance.dominant}
⚡ *Ritmo Predominante*: ${chartData.modalitiesBalance.dominant}

🕊️ *Síntese Cósmica*:
"${chartData.interpretations.essence}"

Para ler o relatório completo ou agendar sua devolutiva com a Bianca, responda a esta mensagem.
*Casa 6 &bull; Bianca Tófoli* 🪐`;

    const encoded = encodeURIComponent(text);
    if (phoneWithCountry) {
      window.open(`https://wa.me/${phoneWithCountry}?text=${encoded}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encoded}`, '_blank');
    }
  };

  // Enviar por E-mail
  const handleShareEmail = () => {
    if (!chartData) return;
    const subject = encodeURIComponent(`Seu Mapa Astral Oficial — Casa 6 (${chartData.clientName})`);
    const body = encodeURIComponent(`Olá, ${chartData.clientName}!

Aqui está a síntese do seu Mapa Astral calculado pela plataforma Casa 6:

• Sol: ${chartData.sunSign}
• Lua: ${chartData.moonSign}
• Ascendente: ${chartData.ascendantSign}
• Meio do Céu: ${chartData.midheavenSign}
• Elemento Dominante: ${chartData.elementsBalance.dominant}

Síntese da Sua Essência:
${chartData.interpretations.essence}

Mundo Emocional:
${chartData.interpretations.emotions}

Com carinho,
Bianca Tófoli — Casa 6`);

    const targetEmail = currentContact?.email || '';
    window.open(`mailto:${targetEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#22205A]">
      {/* 2 ABAS PRINCIPAIS: MAPA NATAL E BÚSSOLA */}
      <div className="flex border-b border-[#E5E0D8] gap-2 pb-px">
        <button
          onClick={() => setMainTab('mapa_natal')}
          className={`py-3 px-6 text-xs sm:text-sm font-heading font-black uppercase tracking-wider rounded-t-2xl transition-all cursor-pointer flex items-center gap-2.5 border-t border-l border-r ${
            mainTab === 'mapa_natal'
              ? 'bg-white text-[#22205A] border-[#E5E0D8] border-b-white -mb-px shadow-xs'
              : 'text-[#68638C] hover:text-[#22205A] border-transparent hover:bg-white/50'
          }`}
        >
          <Sparkles className="h-4 w-4 text-[#D99426]" />
          <span>Mapa Natal</span>
        </button>

        <button
          onClick={() => setMainTab('bussola')}
          className={`py-3 px-6 text-xs sm:text-sm font-heading font-black uppercase tracking-wider rounded-t-2xl transition-all cursor-pointer flex items-center gap-2.5 border-t border-l border-r ${
            mainTab === 'bussola'
              ? 'bg-white text-[#22205A] border-[#E5E0D8] border-b-white -mb-px shadow-xs'
              : 'text-[#68638C] hover:text-[#22205A] border-transparent hover:bg-white/50'
          }`}
        >
          <Compass className="h-4 w-4 text-[#D99426]" />
          <span>Bússola</span>
        </button>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            )}
            <span>{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-[#68638C] hover:text-[#22205A]">
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          ABA 1: MAPA NATAL
          ========================================================================= */}
      {mainTab === 'mapa_natal' && (
        <div className="space-y-6">
          {/* Cabeçalho */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#E5E0D8] pb-4">
            <div>
              <div className="flex items-center gap-2 text-[#D99426] text-xs font-bold uppercase tracking-widest">
                <Sparkles className="h-4 w-4" />
                <span>Operações &bull; Calculadora Astral &bull; Mapa Natal</span>
              </div>
              <h2 className="text-2xl font-heading font-black text-[#22205A] mt-1">
                Motor de Geração de Mapa Natal
              </h2>
              <p className="text-xs sm:text-sm text-[#68638C]">
                Cálculo astronômico de alta precisão baseado no motor fidedigno do Astro.com (Swiss Ephemeris): mandala geocêntrica vetorial, sistema Placidus, posições exatas em graus e minutos, balanço de elementos e matriz de aspectos.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => window.print()}
                title="Imprimir / Salvar Relatório em PDF"
                className="py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#DCD6CC] text-[#22205A] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Printer className="h-4 w-4 text-[#D99426]" />
                <span>Imprimir PDF Oficial</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                title="Enviar Resumo Astrológico pelo WhatsApp"
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Enviar WhatsApp</span>
              </button>

              <button
                onClick={handleShareEmail}
                title="Enviar por E-mail"
                className="py-2.5 px-3.5 rounded-xl bg-[#22205A] hover:bg-[#1B1948] text-white font-bold text-xs uppercase flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>

      {/* BARRA DE SELEÇÃO RÁPIDA DE CLIENTES DO CRM & FORMULÁRIO DE CÁLCULO */}
      <div className="bg-white border border-[#E5E0D8] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F0EBE1] pb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#D99426]" />
            <h3 className="font-heading font-bold text-sm text-[#22205A]">
              1. Selecionar Cliente do CRM ou Inserir Dados Natais
            </h3>
          </div>

          {/* Seletor dropdown dos 1.100 clientes */}
          <div className="flex items-center gap-2 min-w-[280px] max-w-md w-full">
            <span className="text-xs text-[#68638C] font-semibold whitespace-nowrap">Puxar do CRM:</span>
            <select
              value={selectedContactId}
              onChange={(e) => handleSelectContactChange(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CC] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-[#22205A] text-xs focus:outline-none"
            >
              <option value="">Selecione um cliente cadastrado ({contacts.length})...</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName || c.nome} {c.dataNascimento ? `(${c.dataNascimento})` : ''} - {c.cidade || 's/ cidade'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Inputs de Nascimento */}
        <form onSubmit={handleRecalculate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#22205A]">Nome da Consulente</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs text-[#22205A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#22205A] flex items-center gap-1">
              <Calendar className="h-3 w-3 text-[#D99426]" /> Data Nasc. (DD/MM/AAAA)
            </label>
            <input
              type="text"
              required
              placeholder="DD/MM/AAAA"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs text-[#22205A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#22205A] flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#D99426]" /> Horário (HH:MM)
            </label>
            <input
              type="text"
              required
              placeholder="HH:MM"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs text-[#22205A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#22205A] flex items-center gap-1">
              <MapPin className="h-3 w-3 text-[#D99426]" /> Cidade / UF
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs text-[#22205A]"
              />
              <input
                type="text"
                maxLength={2}
                placeholder="UF"
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                className="w-14 bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-2 py-2 text-xs text-center uppercase text-[#22205A]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-4 rounded-xl bg-[#22205A] hover:bg-[#1B1948] text-[#F0B55E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Gerar Mapa Astral</span>
          </button>
        </form>
      </div>

          {/* NAVEGAÇÃO POR SUB-ABAS DO MAPA NATAL */}
          <div className="flex border-b border-[#E5E0D8] gap-1 overflow-x-auto pb-px">
            <button
              onClick={() => setNatalSubTab('mandala')}
              className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-t border-l border-r ${
                natalSubTab === 'mandala'
                  ? 'bg-white text-[#22205A] border-[#E5E0D8] border-b-white -mb-px shadow-xs'
                  : 'text-[#68638C] hover:text-[#22205A] border-transparent'
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-[#D99426]" />
              <span>1. Mandala & Síntese</span>
            </button>

            <button
              onClick={() => setNatalSubTab('planetas')}
              className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-t border-l border-r ${
                natalSubTab === 'planetas'
                  ? 'bg-white text-[#22205A] border-[#E5E0D8] border-b-white -mb-px shadow-xs'
                  : 'text-[#68638C] hover:text-[#22205A] border-transparent'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-[#D99426]" />
              <span>2. Planetas & Casas</span>
            </button>

            <button
              onClick={() => setNatalSubTab('aspectos')}
              className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-t border-l border-r ${
                natalSubTab === 'aspectos'
                  ? 'bg-white text-[#22205A] border-[#E5E0D8] border-b-white -mb-px shadow-xs'
                  : 'text-[#68638C] hover:text-[#22205A] border-transparent'
              }`}
            >
              <PieChart className="h-3.5 w-3.5 text-[#D99426]" />
              <span>3. Matriz de Aspectos</span>
            </button>

            <button
              onClick={() => setNatalSubTab('interpretacoes')}
              className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-t border-l border-r ${
                natalSubTab === 'interpretacoes'
                  ? 'bg-white text-[#22205A] border-[#E5E0D8] border-b-white -mb-px shadow-xs'
                  : 'text-[#68638C] hover:text-[#22205A] border-transparent'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-[#D99426]" />
              <span>4. Interpretações Cósmicas</span>
            </button>
          </div>

          {/* CONTEÚDO DAS SUB-ABAS DO MAPA NATAL */}
          {chartData && (
            <div className="space-y-6">
              {/* SUB-ABA 1: MANDALA ASTRAL & SÍNTESE */}
              {natalSubTab === 'mandala' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Coluna Esquerda: Mandala SVG Interativa (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs flex flex-col items-center">
                <div className="w-full flex items-center justify-between border-b border-[#F0EBE1] pb-3 mb-4">
                  <div>
                    <h3 className="font-heading font-black text-lg text-[#22205A]">
                      Roda Astrológica & Mandala Geocêntrica
                    </h3>
                    <p className="text-xs text-[#68638C]">
                      {chartData.clientName} &bull; {chartData.birthDateStr} às {chartData.birthTimeStr} ({chartData.city} - {chartData.state})
                    </p>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#DCD6CC] text-[#22205A]">
                    {chartData.age !== undefined ? `${chartData.age} anos` : 'Mapa Natal'}
                  </span>
                </div>

                <AstroChartMandala
                  chartData={chartData}
                  onSelectPlanet={(planet) => setSelectedPlanetDetail(planet)}
                />
              </div>

              {/* Coluna Direita: O "Big 3", Elementos e Modalidades (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Cartão "Big 3": Sol, Lua e Ascendente */}
                <div className="bg-white border border-[#E5E0D8] rounded-2xl p-5 shadow-xs space-y-3">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#D99426] flex items-center gap-1.5 border-b border-[#F0EBE1] pb-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    Tríade Principal (O Big 3 Cósmico)
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC] text-center">
                      <span className="text-[10px] text-[#68638C] font-bold uppercase">Sol ☉</span>
                      <div className="font-heading font-bold text-sm text-[#22205A] mt-0.5">
                        {chartData.sunSign}
                      </div>
                      <div className="text-[10px] text-[#D99426] font-medium">Identidade</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC] text-center">
                      <span className="text-[10px] text-[#68638C] font-bold uppercase">Lua ☽</span>
                      <div className="font-heading font-bold text-sm text-[#22205A] mt-0.5">
                        {chartData.moonSign}
                      </div>
                      <div className="text-[10px] text-[#D99426] font-medium">Emoções</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC] text-center">
                      <span className="text-[10px] text-[#68638C] font-bold uppercase">Ascendente</span>
                      <div className="font-heading font-bold text-sm text-[#22205A] mt-0.5">
                        {chartData.ascendantSign}
                      </div>
                      <div className="text-[10px] text-[#D99426] font-medium">Expressão</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs text-[#22205A] leading-relaxed">
                    <strong>Meio do Céu:</strong> {chartData.midheavenSign} &bull; {chartData.interpretations.vocation}
                  </div>
                </div>

                {/* Balanço dos 4 Elementos Estilo Astrolink */}
                <div className="bg-white border border-[#E5E0D8] rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#22205A] flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-rose-500" />
                      Distribuição dos 4 Elementos
                    </h4>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Dominante: {chartData.elementsBalance.dominant}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {/* Fogo */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span className="flex items-center gap-1 text-rose-600">
                          <Flame className="h-3.5 w-3.5" /> Fogo (Iniciativa & Vitalidade)
                        </span>
                        <span>{chartData.elementsBalance.fogo.percentage}%</span>
                      </div>
                      <div className="w-full bg-[#FAF8F5] rounded-full h-2 border border-[#EAE5DC] overflow-hidden">
                        <div
                          className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${chartData.elementsBalance.fogo.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Terra */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Globe2 className="h-3.5 w-3.5" /> Terra (Realização & Concretização)
                        </span>
                        <span>{chartData.elementsBalance.terra.percentage}%</span>
                      </div>
                      <div className="w-full bg-[#FAF8F5] rounded-full h-2 border border-[#EAE5DC] overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${chartData.elementsBalance.terra.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Ar */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span className="flex items-center gap-1 text-amber-700">
                          <Wind className="h-3.5 w-3.5" /> Ar (Mente, Ideias & Social)
                        </span>
                        <span>{chartData.elementsBalance.ar.percentage}%</span>
                      </div>
                      <div className="w-full bg-[#FAF8F5] rounded-full h-2 border border-[#EAE5DC] overflow-hidden">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${chartData.elementsBalance.ar.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Água */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span className="flex items-center gap-1 text-blue-700">
                          <Droplet className="h-3.5 w-3.5" /> Água (Sensibilidade & Intuição)
                        </span>
                        <span>{chartData.elementsBalance.agua.percentage}%</span>
                      </div>
                      <div className="w-full bg-[#FAF8F5] rounded-full h-2 border border-[#EAE5DC] overflow-hidden">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${chartData.elementsBalance.agua.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modalidades & Polaridades */}
                <div className="bg-white border border-[#E5E0D8] rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#22205A]">
                      Ritmos / Modalidades
                    </h4>
                    <span className="text-[11px] font-bold text-[#D99426]">
                      {chartData.modalitiesBalance.dominant}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC]">
                      <div className="text-[10px] text-[#68638C] font-bold">CARDINAL</div>
                      <div className="text-base font-bold text-[#22205A] mt-0.5">
                        {chartData.modalitiesBalance.cardinal.percentage}%
                      </div>
                      <div className="text-[9px] text-[#8C87A3]">Impulso de agir</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC]">
                      <div className="text-[10px] text-[#68638C] font-bold">FIXO</div>
                      <div className="text-base font-bold text-[#22205A] mt-0.5">
                        {chartData.modalitiesBalance.fixo.percentage}%
                      </div>
                      <div className="text-[9px] text-[#8C87A3]">Persistência</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC]">
                      <div className="text-[10px] text-[#68638C] font-bold">MUTÁVEL</div>
                      <div className="text-base font-bold text-[#22205A] mt-0.5">
                        {chartData.modalitiesBalance.mutavel.percentage}%
                      </div>
                      <div className="text-[9px] text-[#8C87A3]">Flexibilidade</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-ABA 2: PLANETAS & CASAS (TABELAS TÉCNICAS ASTRO.COM) */}
          {natalSubTab === 'planetas' && (
            <div className="space-y-4">
              {/* Painel Técnico Astrodienst Swiss Ephemeris */}
              <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-xs text-[#22205A] uppercase tracking-wider">
                    Dados Técnicos Astro.com:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[10px]">
                    Casas Placidus &bull; Swiss Ephemeris
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#554F70]">
                  <span><strong>UT:</strong> {chartData.universalTime}</span>
                  <span><strong>LST:</strong> {chartData.siderealTime}</span>
                  <span><strong>JD:</strong> {chartData.julianDay}</span>
                  <span><strong>Ascendente:</strong> {chartData.ascendantSign} (AC)</span>
                  <span><strong>Meio do Céu:</strong> {chartData.midheavenSign} (MC)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Tabela de Planetas (8 cols) */}
              <div className="lg:col-span-8 bg-white border border-[#E5E0D8] rounded-2xl overflow-hidden shadow-xs">
                <div className="p-4 bg-[#FAF8F5] border-b border-[#E5E0D8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#D99426]" />
                    <h3 className="font-heading font-bold text-sm text-[#22205A]">
                      Posições Planetárias & Corpos Celestes
                    </h3>
                  </div>
                  <span className="text-xs text-[#68638C]">Total: {chartData.planets.length} corpos analisados</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#554F70]">
                    <thead className="bg-[#FAF8F5] border-b border-[#EAE5DC] text-[#22205A] font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-3">Planeta</th>
                        <th className="py-3 px-3">Signo</th>
                        <th className="py-3 px-3">Grau Exato</th>
                        <th className="py-3 px-3 text-center">Casa</th>
                        <th className="py-3 px-3">Elemento</th>
                        <th className="py-3 px-3">Movimento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE5DC]">
                      {chartData.planets.map((planet) => (
                        <tr
                          key={planet.id}
                          onClick={() => setSelectedPlanetDetail(planet)}
                          className={`hover:bg-[#FAF8F5] cursor-pointer transition-colors ${
                            selectedPlanetDetail?.id === planet.id ? 'bg-[#F5F2EB]' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 font-bold text-[#22205A] flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-[#22205A] text-[#F0B55E] flex items-center justify-center text-xs font-bold">
                              {planet.symbol}
                            </span>
                            <span>{planet.name}</span>
                          </td>

                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-[#22205A] flex items-center gap-1">
                              <span>{SIGN_SYMBOLS[planet.sign]}</span>
                              <span>{planet.sign}</span>
                            </span>
                          </td>

                          <td className="py-2.5 px-3 font-mono font-medium text-[#22205A]">
                            {planet.signDegree}°{String(planet.signMinute).padStart(2, '0')}'
                          </td>

                          <td className="py-2.5 px-3 text-center font-bold text-[#D99426]">
                            Casa {planet.house}
                          </td>

                          <td className="py-2.5 px-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                ELEMENT_COLORS[planet.element].bg
                              }`}
                            >
                              {planet.element}
                            </span>
                          </td>

                          <td className="py-2.5 px-3">
                            {planet.isRetrograde ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                Retrógrado [R]
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-emerald-700">
                                Direto
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tabela das 12 Casas Astrológicas (4 cols) */}
              <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-2xl overflow-hidden shadow-xs">
                <div className="p-4 bg-[#FAF8F5] border-b border-[#E5E0D8]">
                  <h3 className="font-heading font-bold text-sm text-[#22205A]">
                    Cúspides das 12 Casas
                  </h3>
                  <p className="text-[11px] text-[#68638C]">Sistema Geocêntrico Tropical</p>
                </div>

                <div className="overflow-x-auto max-h-[550px] scrollbar-thin">
                  <table className="w-full text-left text-xs text-[#554F70]">
                    <thead className="bg-[#FAF8F5] border-b border-[#EAE5DC] text-[#22205A] font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Casa</th>
                        <th className="py-2.5 px-3">Signo</th>
                        <th className="py-2.5 px-3 text-right">Grau</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE5DC]">
                      {chartData.houses.map((house) => (
                        <tr key={house.houseNumber} className="hover:bg-[#FAF8F5]">
                          <td className="py-2 px-3 font-bold text-[#22205A] flex items-center gap-1.5">
                            <span className="text-[#D99426] font-serif w-6">{house.roman}</span>
                            <span className="text-[11px] text-[#68638C]">
                              {house.houseNumber === 1 ? '(ASC)' : house.houseNumber === 10 ? '(MC)' : ''}
                            </span>
                          </td>

                          <td className="py-2 px-3 font-semibold text-[#22205A]">
                            {SIGN_SYMBOLS[house.sign]} {house.sign}
                          </td>

                          <td className="py-2 px-3 text-right font-mono text-[11px] text-[#68638C]">
                            {house.degree}°{String(house.minute).padStart(2, '0')}'
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* SUB-ABA 3: MATRIZ DE ASPECTOS (ASPECTARIUM) */}
          {natalSubTab === 'aspectos' && (
            <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EBE1] pb-4">
                <div>
                  <h3 className="font-heading font-black text-lg text-[#22205A]">
                    Matriz & Aspectos Planetários (Aspectarium)
                  </h3>
                  <p className="text-xs text-[#68638C]">
                    Ângulos exatos e orbes calculados entre os corpos celestes do mapa natal.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Harmônicos (Trígonos / Sextis)
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-red-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Tensão (Quadraturas / Oposições)
                  </span>
                </div>
              </div>

              {/* Lista dos Aspectos Detalhados */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {chartData.aspects.map((aspect, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                      aspect.isHarmonious
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-red-50/40 border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-sm shadow-xs"
                        style={{ backgroundColor: aspect.color }}
                      >
                        {aspect.symbol}
                      </span>
                      <div>
                        <div className="font-bold text-[#22205A]">
                          {aspect.planet1} {aspect.type} {aspect.planet2}
                        </div>
                        <div className="text-[10px] text-[#68638C]">
                          Orbe: {aspect.orb}° ({aspect.angle}° exatos)
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        aspect.isHarmonious ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {aspect.isHarmonious ? 'Fluido' : 'Desafio'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-ABA 4: INTERPRETAÇÕES CÓSMICAS (TEXTOS PROFUNDOS) */}
          {natalSubTab === 'interpretacoes' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Menu Lateral de Tópicos (4 cols) */}
              <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-2xl p-4 shadow-xs space-y-2">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#D99426] border-b border-[#F0EBE1] pb-2">
                  Planetas & Posicionamentos
                </h4>

                <div className="space-y-1">
                  {chartData.planets.map((planet) => (
                    <button
                      key={planet.id}
                      onClick={() => setSelectedPlanetDetail(planet)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        selectedPlanetDetail?.id === planet.id
                          ? 'bg-[#22205A] text-[#F0B55E] font-bold shadow-xs'
                          : 'hover:bg-[#FAF8F5] text-[#554F70]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{planet.symbol}</span>
                        <span>{planet.name}</span>
                        <span className="text-[10px] opacity-75">em {planet.sign}</span>
                      </div>
                      <span className="text-[10px] opacity-75">Casa {planet.house}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bloco de Leitura Profunda do Planeta Selecionado (8 cols) */}
              <div className="lg:col-span-8 bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs space-y-5">
                {selectedPlanetDetail ? (
                  <>
                    <div className="border-b border-[#F0EBE1] pb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#22205A] text-[#F0B55E] flex items-center justify-center text-2xl font-bold">
                          {selectedPlanetDetail.symbol}
                        </div>
                        <div>
                          <span className="text-[10px] text-[#D99426] font-bold uppercase tracking-wider">
                            Leitura Astrológica Personalizada
                          </span>
                          <h3 className="font-heading font-black text-xl text-[#22205A]">
                            {selectedPlanetDetail.name} em {selectedPlanetDetail.sign} na Casa {selectedPlanetDetail.house}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          ELEMENT_COLORS[selectedPlanetDetail.element].bg
                        }`}
                      >
                        {selectedPlanetDetail.element} &bull; {selectedPlanetDetail.modality}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC] space-y-2">
                      <div className="font-bold text-xs text-[#22205A] uppercase tracking-wider">
                        Palavras-Chave de Ativação:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPlanetDetail.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#DCD6CC] text-[#22205A] font-medium"
                          >
                            ✦ {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm text-[#22205A] leading-relaxed">
                      <h4 className="font-heading font-bold text-sm text-[#22205A]">
                        Interpretação da Bianca Tófoli (Casa 6):
                      </h4>
                      <p className="whitespace-pre-wrap">{selectedPlanetDetail.interpretation}</p>
                    </div>

                    <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between text-xs text-[#68638C]">
                      <span>Posição exata: {selectedPlanetDetail.signDegree}°{String(selectedPlanetDetail.signMinute).padStart(2, '0')}' em {selectedPlanetDetail.sign}</span>
                      <button
                        onClick={handleShareWhatsApp}
                        className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Enviar este insight pelo WhatsApp
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center text-[#68638C]">
                    Selecione um planeta na lista ao lado para ler sua interpretação detalhada.
                  </div>
                )}
              </div>
            </div>
          )}

            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          ABA 2: BÚSSOLA PESSOAL & TRÂNSITOS
          ========================================================================= */}
      {mainTab === 'bussola' && (
        <div className="space-y-6">
          {/* Cabeçalho da Bússola */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#E5E0D8] pb-4">
            <div>
              <div className="flex items-center gap-2 text-[#D99426] text-xs font-bold uppercase tracking-widest">
                <Compass className="h-4 w-4" />
                <span>Operações &bull; Calculadora Astral &bull; Bússola Pessoal</span>
              </div>
              <h2 className="text-2xl font-heading font-black text-[#22205A] mt-1">
                Bússola Pessoal & Trânsitos Astrológicos
              </h2>
              <p className="text-xs sm:text-sm text-[#68638C]">
                Mapeamento quinzenal e mensal de ciclos, lunações, trânsitos dominantes e orientações práticas para a consulente.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => window.print()}
                title="Imprimir / Salvar Relatório em PDF"
                className="py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#DCD6CC] text-[#22205A] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Printer className="h-4 w-4 text-[#D99426]" />
                <span>Imprimir PDF Oficial</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                title="Enviar Bússola pelo WhatsApp"
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Enviar no WhatsApp</span>
              </button>

              <button
                onClick={handleShareEmail}
                title="Enviar por E-mail"
                className="py-2.5 px-3.5 rounded-xl bg-[#22205A] hover:bg-[#1B1948] text-white font-bold text-xs uppercase flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Banner de Aviso de Configuração da Ferramenta */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-[#F0B55E]/40 text-[#22205A] text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
            <Compass className="h-5 w-5 text-[#D99426] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-[#D99426]">Módulo Bússola Pessoal em Estruturação:</strong>
              <p className="mt-0.5 text-[#554F70]">
                Esta aba foi reservada e estruturada para a montagem completa da sua Bússola. Você pode selecionar qualquer cliente do CRM, definir o ciclo quinzenal ou mensal, apontar o trânsito e enviar o dossiê personalizado diretamente.
              </p>
            </div>
          </div>

          {/* Seleção de Cliente para a Bússola */}
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#D99426]" />
                <h3 className="font-heading font-bold text-sm text-[#22205A]">
                  Consulente Selecionada para a Bússola
                </h3>
              </div>

              <div className="flex items-center gap-2 min-w-[280px] max-w-md w-full">
                <span className="text-xs text-[#68638C] font-semibold whitespace-nowrap">Cliente do CRM:</span>
                <select
                  value={selectedContactId}
                  onChange={(e) => handleSelectContactChange(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-[#22205A] text-xs focus:outline-none"
                >
                  <option value="">Selecione a consulente ({contacts.length})...</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName || c.nome} {c.dataNascimento ? `(${c.dataNascimento})` : ''} - {c.cidade || 's/ cidade'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Formulário de Parâmetros e Prévia da Bússola */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Formulário de Trânsitos (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
                <h3 className="font-heading text-base font-bold text-[#22205A] flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[#D99426]" />
                  Parâmetros da Bússola Pessoal & Trânsitos
                </h3>
                <span className="text-[10px] bg-purple-100 text-[#22205A] px-2 py-0.5 rounded-full font-bold">
                  Quinzena Ativa
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Ciclo / Período da Bússola</label>
                  <input
                    type="text"
                    value={cyclePeriod}
                    onChange={(e) => setCyclePeriod(e.target.value)}
                    placeholder="Ex: Quinzena de 15 a 30 de Novembro"
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Planeta Regente do Momento</label>
                  <input
                    type="text"
                    value={dominantPlanet}
                    onChange={(e) => setDominantPlanet(e.target.value)}
                    placeholder="Ex: Saturno retrógrado"
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Signo & Casa Ativada</label>
                  <input
                    type="text"
                    value={signTransit}
                    onChange={(e) => setSignTransit(e.target.value)}
                    placeholder="Ex: Peixes na Casa 10"
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Aspecto Planetário Maior</label>
                  <input
                    type="text"
                    value={transitAspect}
                    onChange={(e) => setTransitAspect(e.target.value)}
                    placeholder="Ex: Trígono com Júpiter em Câncer"
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Foco de Potência & Direção Positiva</label>
                <input
                  type="text"
                  value={themeFocus}
                  onChange={(e) => setThemeFocus(e.target.value)}
                  placeholder="Ex: Carreira, Estruturação e Limites Saudáveis"
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Alerta de Sombra / Desafio Astrológico</label>
                <textarea
                  rows={2}
                  value={shadowWarning}
                  onChange={(e) => setShadowWarning(e.target.value)}
                  placeholder="Ex: Cuidado com a sobrecarga mental e autocrítica paralisante."
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Mantra ou Afirmação de Alinhamento</label>
                <input
                  type="text"
                  value={affirmationGuidance}
                  onChange={(e) => setAffirmationGuidance(e.target.value)}
                  placeholder="Ex: Reconheço o valor do meu tempo e construo minhas conquistas passo a passo."
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                />
              </div>
            </div>

            {/* Preview do Documento Oficial da Bússola (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
                <h3 className="font-heading text-base font-bold text-[#22205A] flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#D99426]" />
                  Dossiê da Bússola Personalizada
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Oficial Casa 6
                </span>
              </div>

              <div className="bg-[#FAF8F5] border-2 border-[#D99426]/30 rounded-xl p-5 text-xs space-y-3 font-mono leading-relaxed text-[#22205A] shadow-inner">
                <div className="font-bold text-[#D99426] font-heading text-sm border-b border-[#D99426]/20 pb-2 flex items-center justify-between">
                  <span>✨ BÚSSOLA PESSOAL — CASA 6 ✨</span>
                  <span className="text-[10px] text-[#68638C] font-normal">{currentContact?.cidade || 'São Paulo'}</span>
                </div>
                <div>
                  <strong className="text-[#22205A]">Consulente:</strong> {chartData?.clientName || clientName}
                </div>
                <p>
                  <strong>Ciclo:</strong> {cyclePeriod}
                  <br />
                  <strong>Trânsito Ativo:</strong> {dominantPlanet} em {signTransit}
                  <br />
                  <strong>Aspecto:</strong> {transitAspect}
                </p>
                <p>
                  <strong>🎯 Foco:</strong> {themeFocus}
                </p>
                <p>
                  <strong>⚠️ Atenção à Sombra:</strong>
                  <br />
                  {shadowWarning}
                </p>
                <p>
                  <strong>🕊️ Mantra de Alinhamento:</strong>
                  <br />
                  <em>"{affirmationGuidance}"</em>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Send className="h-4 w-4" />
                  <span>Enviar WhatsApp</span>
                </button>
                <button
                  onClick={handleShareEmail}
                  className="py-3 px-4 rounded-xl bg-[#22205A] hover:bg-[#1B1948] text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Mail className="h-4 w-4" />
                  <span>Enviar E-mail</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
