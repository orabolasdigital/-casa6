/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo: Central da Linha Bússola (Pessoal, Amorosa e Profissional)
 * Integração: CRM acasa6, Trânsitos Astrológicos, Base de Textos Mensais, Download de PDF e Disparos
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Heart,
  Briefcase,
  Sparkles,
  Calendar,
  Send,
  Mail,
  Download,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Search,
  Filter,
  User,
  ExternalLink,
  Layers,
  FileText,
  Clock,
  ShieldCheck,
  Check,
  ChevronRight,
  X
} from 'lucide-react';
import {
  BussolaType,
  BussolaItem,
  AstrologicalTransitMonth,
  getBussolaTransitosList,
  saveBussolaTransit,
  getBussolaItemsList,
  saveBussolaItem,
  generateBussolaContentForClient,
  downloadBussolaPDF,
  sendBussolaViaWhatsApp,
  sendBussolaViaEmail,
  renderBussolaMobileHTML
} from '../../../services/bussolaService';
import { CRMContactDetail, getCRMContactsList } from '../../../services/crmService';

export const BussolaEngineManager: React.FC = () => {
  // 1. Tipo de Bússola ativo
  const [selectedBussolaType, setSelectedBussolaType] = useState<BussolaType>('pessoal');

  // 2. Sub-aba interna
  const [activeSubTab, setActiveSubTab] = useState<'gerador' | 'ceu_do_mes' | 'historico'>('gerador');

  // 3. Competência ativa (mês/ano)
  const [competencia, setCompetencia] = useState<string>('11/2026');

  // 4. Dados
  const [transitosList, setTransitosList] = useState<AstrologicalTransitMonth[]>([]);
  const [bussolaItems, setBussolaItems] = useState<BussolaItem[]>([]);
  const [contacts, setContacts] = useState<CRMContactDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // 5. Modais de Ação
  const [editingItem, setEditingItem] = useState<BussolaItem | null>(null);
  const [previewItem, setPreviewItem] = useState<BussolaItem | null>(null);

  // 6. Editor do Céu do Mês
  const [editingTransit, setEditingTransit] = useState<AstrologicalTransitMonth>({
    ano: 2026,
    mes: 11,
    competencia: '11/2026',
    primeiraQuinzena: '',
    segundaQuinzena: '',
    aspectosRaw: ''
  });

  // Notificações
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Carregar dados iniciais
  const reloadData = () => {
    const tList = getBussolaTransitosList();
    setTransitosList(tList);

    const bList = getBussolaItemsList(undefined, selectedBussolaType);
    setBussolaItems(bList);

    getCRMContactsList().then((list) => {
      setContacts(list);
    });

    const currentTransit = tList.find((t) => t.competencia === competencia) || tList[0];
    if (currentTransit) {
      setEditingTransit(currentTransit);
    }
  };

  useEffect(() => {
    reloadData();
  }, [selectedBussolaType, competencia]);

  // Contagem de Assinantes com Tag
  const assinantesContatos = useMemo(() => {
    return contacts.filter((c) => {
      const hasTag = c.tags && c.tags.includes('Assinante Bússola');
      const isPatotaAtivo = c.patotaStatus === 'Ativo';
      return hasTag || isPatotaAtivo;
    });
  }, [contacts]);

  // Itens da competência atual
  const currentMonthItems = useMemo(() => {
    return bussolaItems.filter((item) => {
      if (item.competencia !== competencia) return false;
      if (item.tipo !== selectedBussolaType) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const n = item.nomeCliente.toLowerCase();
        const a = item.apelidoCliente.toLowerCase();
        if (!n.includes(q) && !a.includes(q)) return false;
      }
      if (filterStatus !== 'all' && item.gerarStatus !== filterStatus) return false;
      return true;
    });
  }, [bussolaItems, competencia, selectedBussolaType, searchTerm, filterStatus]);

  // Gerar em Lote para todas as Assinantes do Mês
  const handleGenerateBatch = () => {
    const currentTransit = transitosList.find((t) => t.competencia === competencia) || editingTransit;
    if (!currentTransit) {
      setNotification({ type: 'error', text: 'Cadastre os trânsitos do mês antes de gerar as bússolas.' });
      return;
    }

    const targetContacts = assinantesContatos.length > 0 ? assinantesContatos : contacts.slice(0, 42);
    let generatedCount = 0;

    targetContacts.forEach((contact) => {
      const generated = generateBussolaContentForClient(contact, currentTransit, selectedBussolaType);
      saveBussolaItem(generated as BussolaItem);
      generatedCount++;
    });

    setBussolaItems(getBussolaItemsList(undefined, selectedBussolaType));
    setNotification({
      type: 'success',
      text: `${generatedCount} Bússolas (${selectedBussolaType.toUpperCase()}) geradas com sucesso para a competência ${competencia}!`
    });
  };

  // Salvar Trânsitos do Céu do Mês
  const handleSaveTransitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = `${String(editingTransit.mes).padStart(2, '0')}/${editingTransit.ano}`;
    const payload: AstrologicalTransitMonth = {
      ...editingTransit,
      competencia: comp,
      aspectosRaw: `PRIMEIRA QUINZENA:\n${editingTransit.primeiraQuinzena}\n\nSEGUNDA QUINZENA:\n${editingTransit.segundaQuinzena}`
    };

    saveBussolaTransit(payload);
    setCompetencia(comp);
    reloadData();
    setNotification({
      type: 'success',
      text: `Análise do Céu de ${comp} salva com sucesso pela Bianca!`
    });
  };

  // Salvar Edição do Item
  const handleSaveEditedItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    saveBussolaItem(editingItem);
    setBussolaItems(getBussolaItemsList(undefined, selectedBussolaType));
    setEditingItem(null);
    setNotification({
      type: 'success',
      text: `Textos da Bússola de ${editingItem.nomeCliente} atualizados com sucesso!`
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#22205A]">
      {/* SELETOR DE TOPO: AS 3 BÚSSOLAS */}
      <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#22205A] text-[#F0B55E]">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base text-[#22205A]">
                Central da Linha Bússola da Casa 6
              </h3>
              <p className="text-xs text-[#68638C]">
                Motor de geração autônomo com base nos Trânsitos da Bianca e Cadastros do CRM
              </p>
            </div>
          </div>

          {/* Abas das 3 Bússolas */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1.5 rounded-xl border border-[#DCD6CC]">
            <button
              onClick={() => setSelectedBussolaType('pessoal')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                selectedBussolaType === 'pessoal'
                  ? 'bg-[#22205A] text-[#F0B55E] shadow-xs'
                  : 'text-[#68638C] hover:text-[#22205A]'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Bússola Pessoal</span>
            </button>

            <button
              onClick={() => setSelectedBussolaType('amorosa')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                selectedBussolaType === 'amorosa'
                  ? 'bg-[#22205A] text-[#F0B55E] shadow-xs'
                  : 'text-[#68638C] hover:text-[#22205A]'
              }`}
            >
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              <span>Bússola Amorosa</span>
            </button>

            <button
              onClick={() => setSelectedBussolaType('profissional')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                selectedBussolaType === 'profissional'
                  ? 'bg-[#22205A] text-[#F0B55E] shadow-xs'
                  : 'text-[#68638C] hover:text-[#22205A]'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5 text-blue-500" />
              <span>Bússola Profissional</span>
            </button>
          </div>
        </div>
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

      {/* SUB-NAVEGAÇÃO INTERNA: GERADOR, CÉU DO MÊS E HISTÓRICO */}
      <div className="flex border-b border-[#E5E0D8] gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveSubTab('gerador')}
          className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-t border-l border-r ${
            activeSubTab === 'gerador'
              ? 'bg-white text-[#22205A] border-[#E5E0D8] border-b-white -mb-px shadow-xs'
              : 'text-[#68638C] hover:text-[#22205A] border-transparent'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-[#D99426]" />
          <span>1. Gerador & Fila de Envios ({currentMonthItems.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ceu_do_mes')}
          className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-t border-l border-r ${
            activeSubTab === 'ceu_do_mes'
              ? 'bg-white text-[#22205A] border-[#E5E0D8] border-b-white -mb-px shadow-xs'
              : 'text-[#68638C] hover:text-[#22205A] border-transparent'
          }`}
        >
          <Calendar className="h-3.5 w-3.5 text-[#D99426]" />
          <span>2. Céu do Mês (Trânsitos Astrológicos)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('historico')}
          className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-t border-l border-r ${
            activeSubTab === 'historico'
              ? 'bg-white text-[#22205A] border-[#E5E0D8] border-b-white -mb-px shadow-xs'
              : 'text-[#68638C] hover:text-[#22205A] border-transparent'
          }`}
        >
          <FileText className="h-3.5 w-3.5 text-[#D99426]" />
          <span>3. Base de Textos Mensais Salvos ({bussolaItems.length})</span>
        </button>
      </div>

      {/* =========================================================================
          SUB-ABA 1: GERADOR & FILA DE ENVIOS
          ========================================================================= */}
      {activeSubTab === 'gerador' && (
        <div className="space-y-6">
          {/* BARRA DE CONTROLE: COMPETÊNCIA, STATS E BOTÃO DE GERAÇÃO EM LOTE */}
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#68638C] uppercase">Mês de Competência:</label>
                  <select
                    value={competencia}
                    onChange={(e) => setCompetencia(e.target.value)}
                    className="bg-[#FAF8F5] border border-[#DCD6CC] focus:border-[#F0B55E] rounded-xl px-3 py-2 text-xs font-bold text-[#22205A]"
                  >
                    <option value="11/2026">11/2026 (Novembro 2026)</option>
                    <option value="12/2026">12/2026 (Dezembro 2026)</option>
                    <option value="01/2027">01/2027 (Janeiro 2027)</option>
                    <option value="02/2027">02/2027 (Fevereiro 2027)</option>
                    <option value="03/2027">03/2027 (Março 2027)</option>
                  </select>
                </div>

                {/* Métricas Rápidas */}
                <div className="flex items-center gap-2 pt-4 sm:pt-0">
                  <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs">
                    <span className="text-[10px] text-purple-700 font-bold uppercase block">Assinantes c/ Tag</span>
                    <strong className="text-purple-900 font-black text-sm">{assinantesContatos.length}</strong>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase block">Geradas no Mês</span>
                    <strong className="text-emerald-900 font-black text-sm">{currentMonthItems.length}</strong>
                  </div>
                </div>
              </div>

              {/* Botão de Geração Automática em Lote */}
              <button
                onClick={handleGenerateBatch}
                className="py-3 px-5 rounded-xl bg-gradient-to-r from-[#22205A] to-[#161438] hover:brightness-110 text-[#F0B55E] font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-md cursor-pointer transition-all self-start lg:self-auto"
              >
                <RefreshCw className="h-4 w-4 text-[#F0B55E]" />
                <span>Gerar {selectedBussolaType.toUpperCase()} para Todas as Assinantes</span>
              </button>
            </div>

            {/* Filtros e Busca */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#F0EBE1] pt-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="h-3.5 w-3.5 text-[#68638C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou apelido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl text-xs text-[#22205A] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#68638C] font-semibold">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-2.5 py-1.5 text-xs text-[#22205A]"
                >
                  <option value="all">Todos</option>
                  <option value="gerado">Gerados</option>
                  <option value="enviado">Enviados</option>
                  <option value="pendente">Pendentes</option>
                </select>
              </div>
            </div>
          </div>

          {/* TABELA DE ASSINANTES E BÚSSOLAS DO MÊS */}
          <div className="bg-white border border-[#E5E0D8] rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#F0EBE1] flex items-center justify-between bg-[#FAF8F5]">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#22205A]">
                Assinantes Prontas para Envio ({currentMonthItems.length})
              </h4>
              <span className="text-[11px] text-[#68638C]">
                Competência: <strong className="text-[#22205A]">{competencia}</strong>
              </span>
            </div>

            {currentMonthItems.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Compass className="h-10 w-10 text-[#D99426] mx-auto opacity-40 animate-pulse" />
                <p className="text-xs sm:text-sm font-semibold text-[#22205A]">
                  Nenhuma bússola gerada ainda para {competencia} no formato {selectedBussolaType}.
                </p>
                <p className="text-xs text-[#68638C] max-w-md mx-auto">
                  Clique no botão <strong>"Gerar para Todas as Assinantes"</strong> acima para criar automaticamente os textos de cada cliente cruzando os trânsitos do céu com o Ascendente.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#E5E0D8] bg-[#FAF8F5] text-[#68638C] uppercase text-[10px] font-bold">
                      <th className="py-3 px-3">Cliente</th>
                      <th className="py-3 px-3">Tríade Natal</th>
                      <th className="py-3 px-3">Casa do Mês</th>
                      <th className="py-3 px-3">Palavra de Ordem</th>
                      <th className="py-3 px-3">Tag / Assinatura</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Ações de Entrega</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE1]">
                    {currentMonthItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-[#22205A]">{item.nomeCliente}</div>
                          <div className="text-[11px] text-[#68638C]">Apelido: {item.apelidoCliente}</div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 font-medium text-[#22205A]">
                            <span className="text-[10px] bg-[#FAF8F5] border border-[#DCD6CC] px-1.5 py-0.5 rounded">
                              ☀️ {item.sol}
                            </span>
                            <span className="text-[10px] bg-[#FAF8F5] border border-[#DCD6CC] px-1.5 py-0.5 rounded">
                              🏹 {item.ascendente}
                            </span>
                            <span className="text-[10px] bg-[#FAF8F5] border border-[#DCD6CC] px-1.5 py-0.5 rounded">
                              🌙 {item.lua}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-bold text-[#22205A] bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-full text-[10px]">
                            Casa {item.casaAtivada || '—'}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-serif italic font-bold text-[#D99426]">
                            {item.palavraOrdem}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#F0B55E]/60 text-[#22205A]">
                            Assinante Bússola
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.dataEnvioWhatsapp || item.dataEnvioEmail
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.dataEnvioWhatsapp || item.dataEnvioEmail ? 'Entregue' : 'Pronto'}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Visualizar Mobile */}
                            <button
                              onClick={() => setPreviewItem(item)}
                              title="Visualizar Layout Mobile da Casa 6"
                              className="p-1.5 rounded-lg bg-white border border-[#DCD6CC] hover:bg-[#FAF8F5] text-[#22205A] cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>

                            {/* Editar Textos */}
                            <button
                              onClick={() => setEditingItem(item)}
                              title="Editar Textos da Bússola"
                              className="p-1.5 rounded-lg bg-white border border-[#DCD6CC] hover:bg-[#FAF8F5] text-[#22205A] cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-[#D99426]" />
                            </button>

                            {/* Baixar PDF */}
                            <button
                              onClick={() => downloadBussolaPDF(item)}
                              title="Baixar PDF Mobile Oficial"
                              className="p-1.5 rounded-lg bg-white border border-[#DCD6CC] hover:bg-[#FAF8F5] text-[#22205A] cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5 text-blue-600" />
                            </button>

                            {/* Enviar WhatsApp */}
                            <button
                              onClick={() => sendBussolaViaWhatsApp(item)}
                              title="Enviar pelo WhatsApp com todo o texto formatado"
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                            >
                              <Send className="h-3.5 w-3.5" />
                            </button>

                            {/* Disparar E-mail */}
                            <button
                              onClick={() => sendBussolaViaEmail(item)}
                              title="Disparar para o E-mail de cadastro"
                              className="p-1.5 rounded-lg bg-[#22205A] hover:bg-[#1B1948] text-white cursor-pointer"
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-ABA 2: CÉU DO MÊS (TRÂNSITOS ASTROLÓGICOS DA BIANCA)
          ========================================================================= */}
      {activeSubTab === 'ceu_do_mes' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F0EBE1] pb-4 gap-2">
              <div>
                <div className="flex items-center gap-2 text-[#D99426] text-xs font-bold uppercase tracking-widest">
                  <Calendar className="h-4 w-4" />
                  <span>Céu do Mês &bull; Inserção de Trânsitos</span>
                </div>
                <h3 className="font-heading font-black text-xl text-[#22205A] mt-1">
                  Análise Astrológica do Céu pela Bianca Tófoli
                </h3>
                <p className="text-xs text-[#68638C]">
                  Insira aqui os movimentos celestes, lunações e ingressos que alimentarão os textos das bússolas das clientes.
                </p>
              </div>

              {/* Seletor do Mês a Editar */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#68638C] font-semibold">Competência:</span>
                <select
                  value={editingTransit.competencia}
                  onChange={(e) => {
                    const found = transitosList.find((t) => t.competencia === e.target.value);
                    if (found) setEditingTransit(found);
                  }}
                  className="bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs font-bold text-[#22205A]"
                >
                  {transitosList.map((t) => (
                    <option key={t.competencia} value={t.competencia}>
                      {t.competencia}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={handleSaveTransitForm} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Ano</label>
                  <input
                    type="number"
                    value={editingTransit.ano}
                    onChange={(e) => setEditingTransit({ ...editingTransit, ano: parseInt(e.target.value, 10) || 2026 })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs text-[#22205A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Mês (1 a 12)</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={editingTransit.mes}
                    onChange={(e) => setEditingTransit({ ...editingTransit, mes: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs text-[#22205A]"
                  />
                </div>
              </div>

              {/* Primeira Quinzena */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#22205A] flex items-center justify-between">
                  <span>Aspectos da Primeira Quinzena (Dias 01 a 15)</span>
                  <span className="text-[11px] text-[#D99426]">Lua Nova, planetas diretos/retrógrados</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Ex: 09/11: Lua Nova em Escorpião (16°) — Início de ciclo focado em transformação profunda..."
                  value={editingTransit.primeiraQuinzena}
                  onChange={(e) => setEditingTransit({ ...editingTransit, primeiraQuinzena: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] focus:border-[#F0B55E] rounded-xl p-3 text-xs text-[#22205A] font-mono leading-relaxed resize-y"
                />
              </div>

              {/* Segunda Quinzena */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#22205A] flex items-center justify-between">
                  <span>Aspectos da Segunda Quinzena (Dias 16 ao fim do mês)</span>
                  <span className="text-[11px] text-[#D99426]">Ingresso Solar, Lua Cheia, aspectos marcantes</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Ex: 22/11: Sol entra em Sagitário (Ingresso Solar) — Virada de chave energética expandindo a busca por sentido..."
                  value={editingTransit.segundaQuinzena}
                  onChange={(e) => setEditingTransit({ ...editingTransit, segundaQuinzena: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] focus:border-[#F0B55E] rounded-xl p-3 text-xs text-[#22205A] font-mono leading-relaxed resize-y"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-[#F0EBE1]">
                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-[#22205A] hover:bg-[#1B1948] text-[#F0B55E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                >
                  <Check className="h-4 w-4" />
                  <span>Salvar Trânsitos do Céu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-ABA 3: BASE DE TEXTOS MENSAIS SALVOS (HISTÓRICO REAL)
          ========================================================================= */}
      {activeSubTab === 'historico' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EBE1] pb-3">
              <div>
                <h4 className="font-heading font-black text-lg text-[#22205A]">
                  Acervo Oficial de Textos da Casa 6 ({bussolaItems.length} registros)
                </h4>
                <p className="text-xs text-[#68638C]">
                  Textos reais escritos com a persona visceral da Bianca, servindo de base de aprendizado para novas gerações.
                </p>
              </div>
              <span className="text-xs font-bold text-[#D99426] bg-[#FAF8F5] border border-[#DCD6CC] px-3 py-1.5 rounded-xl">
                Base CSV Carregada
              </span>
            </div>

            <div className="space-y-3">
              {bussolaItems.slice(0, 15).map((t) => (
                <div key={t.id} className="p-4 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-heading text-[#22205A]">{t.nomeCliente}</strong>
                      <span className="text-[10px] text-[#68638C]">({t.competencia})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                        ☀️ {t.sol} | 🏹 {t.ascendente} | 🌙 {t.lua}
                      </span>
                      <span className="text-[10px] font-serif italic font-bold text-[#D99426]">
                        {t.palavraOrdem}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#554F70] line-clamp-2">{t.focoPrimeiraQuinzena}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: PREVIEW DO LAYOUT MOBILE (440px x 1800px) OFICIAL CASA 6
          ========================================================================= */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-[#161438]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#F0B55E]/40 overflow-hidden">
            {/* Topo do Modal */}
            <div className="p-4 bg-[#282566] text-white flex items-center justify-between border-b border-[#372B69]">
              <div>
                <div className="text-[10px] text-[#F0B55E] font-bold uppercase tracking-wider">
                  Pré-visualização Mobile da Casa 6
                </div>
                <h3 className="font-heading font-black text-sm text-white">
                  {previewItem.nomeCliente} &bull; {previewItem.competencia}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadBussolaPDF(previewItem)}
                  className="py-1.5 px-3 rounded-lg bg-[#F0B55E] text-[#1E1B4B] font-bold text-xs uppercase flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Baixar PDF</span>
                </button>

                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Iframe com o HTML Oficial rendered */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#E5E0D8] flex justify-center">
              <iframe
                srcDoc={renderBussolaMobileHTML(previewItem)}
                title="Bússola Mobile Preview"
                className="w-[440px] min-h-[900px] border-0 rounded-2xl shadow-xl bg-[#F4EFE6]"
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: EDIÇÃO COMPLETA DOS 8 CAMPOS DA BÚSSOLA
          ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-[#161438]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#DCD6CC] overflow-hidden">
            <div className="p-4 bg-[#FAF8F5] border-b border-[#E5E0D8] flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#D99426] font-bold uppercase tracking-wider">
                  Editar Textos da Bússola &bull; {editingItem.tipo.toUpperCase()}
                </div>
                <h3 className="font-heading font-black text-base text-[#22205A]">
                  {editingItem.nomeCliente} ({editingItem.apelidoCliente})
                </h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-[#68638C] hover:text-[#22205A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedItem} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Foco 1ª Quinzena */}
              <div className="space-y-1">
                <label className="font-bold text-[#22205A] flex justify-between">
                  <span>1. Foco da 1ª Quinzena</span>
                  <span className="text-[11px] font-mono text-[#D99426]">{editingItem.focoPrimeiraQuinzena.length}/400 chars</span>
                </label>
                <textarea
                  rows={3}
                  value={editingItem.focoPrimeiraQuinzena}
                  onChange={(e) => setEditingItem({ ...editingItem, focoPrimeiraQuinzena: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl p-3 text-[#22205A]"
                />
              </div>

              {/* Foco 2ª Quinzena */}
              <div className="space-y-1">
                <label className="font-bold text-[#22205A] flex justify-between">
                  <span>2. Foco da 2ª Quinzena</span>
                  <span className="text-[11px] font-mono text-[#D99426]">{editingItem.focoSegundaQuinzena.length}/400 chars</span>
                </label>
                <textarea
                  rows={3}
                  value={editingItem.focoSegundaQuinzena}
                  onChange={(e) => setEditingItem({ ...editingItem, focoSegundaQuinzena: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl p-3 text-[#22205A]"
                />
              </div>

              {/* Cuidados (3 linhas sem hífens) */}
              <div className="space-y-1">
                <label className="font-bold text-[#22205A] flex justify-between">
                  <span>3. Cuidados & Pontos de Atenção (3 Linhas sem hífens ou bullets)</span>
                  <span className="text-[11px] text-[#68638C]">Exatamente 3 frases</span>
                </label>
                <textarea
                  rows={3}
                  value={editingItem.cuidados}
                  onChange={(e) => setEditingItem({ ...editingItem, cuidados: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl p-3 text-[#22205A]"
                />
              </div>

              {/* Dias Astrais e Dias de Atenção */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#22205A]">4. Dias Astrais</label>
                  <input
                    type="text"
                    value={editingItem.diasAstrais}
                    onChange={(e) => setEditingItem({ ...editingItem, diasAstrais: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#22205A]">5. Dias de Atenção</label>
                  <input
                    type="text"
                    value={editingItem.diasAtencao}
                    onChange={(e) => setEditingItem({ ...editingItem, diasAtencao: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A]"
                  />
                </div>
              </div>

              {/* Direcionamento Prático */}
              <div className="space-y-1">
                <label className="font-bold text-[#22205A]">6. Direcionamento Prático (3 Ações sem bullets)</label>
                <textarea
                  rows={3}
                  value={editingItem.direcionamentoPratico}
                  onChange={(e) => setEditingItem({ ...editingItem, direcionamentoPratico: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl p-3 text-[#22205A]"
                />
              </div>

              {/* Pergunta para o Diário */}
              <div className="space-y-1">
                <label className="font-bold text-[#22205A]">7. Pergunta para o Diário</label>
                <input
                  type="text"
                  value={editingItem.perguntaDiario}
                  onChange={(e) => setEditingItem({ ...editingItem, perguntaDiario: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A]"
                />
              </div>

              {/* Palavra de Ordem */}
              <div className="space-y-1">
                <label className="font-bold text-[#22205A]">8. Palavra de Ordem (1 única palavra)</label>
                <input
                  type="text"
                  value={editingItem.palavraOrdem}
                  onChange={(e) => setEditingItem({ ...editingItem, palavraOrdem: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0EBE1]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="py-2.5 px-4 rounded-xl border border-[#DCD6CC] text-[#68638C] font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#22205A] hover:bg-[#1B1948] text-[#F0B55E] font-bold uppercase tracking-wider shadow-xs"
                >
                  Salvar Textos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
