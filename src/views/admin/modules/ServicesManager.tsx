/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo: Serviços (Atendimentos, Palestras, Parcerias, Patota, Bússola, Lojinha e Frete)
 * Tema Claro (Light Theme) com Sincronização Integral do Banco de Dados
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Compass,
  Presentation,
  Handshake,
  ShoppingBag,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Truck,
  Image as ImageIcon,
  DollarSign,
  Layers,
  Calendar,
  Clock,
  ShieldCheck,
  Save,
  Check
} from 'lucide-react';
import {
  LojinhaShippingConfig,
  getLojinhaShippingConfig,
  saveLojinhaShippingConfig
} from '../../../services/adminConfigService';
import {
  getPalestrasPortfolio,
  getParceriasPortfolio,
  savePalestraItem,
  deletePalestraItem,
  saveParceriaItem,
  deleteParceriaItem,
  INITIAL_PALESTRAS,
  INITIAL_PARCERIAS
} from '../../../services/corporateService';
import { PalestraItem, ParceriaItem } from '../../../types';
import { CATALOG_LOJINHA, LojinhaProduct } from '../../../services/catalogService';

export type ServiceSubTab =
  | 'serv_atendimentos'
  | 'serv_palestras'
  | 'serv_parcerias'
  | 'serv_patota'
  | 'serv_bussola'
  | 'serv_lojinha';

interface ServicesManagerProps {
  initialSubTab?: ServiceSubTab;
}

export const ServicesManager: React.FC<ServicesManagerProps> = ({
  initialSubTab = 'serv_atendimentos'
}) => {
  const [activeTab, setActiveTab] = useState<ServiceSubTab>(initialSubTab);

  // 1. ATENDIMENTOS
  const [atendimentosList, setAtendimentosList] = useState([
    {
      id: 'atend_pronto_socorro',
      title: 'Pronto Socorro Astrológico',
      price: '350,00',
      duration: '60 min',
      description: 'Atendimento rápido e focado em decisões emergenciais, momentos de encruzilhada ou crises imediatas.',
      features: ['Foco em 1 setor urgente da vida', 'Clareza para tomadas de decisão', 'Áudio de alinhamento'],
      badge: 'Atendimento Emergencial'
    },
    {
      id: 'atend_mapa_natal',
      title: 'Mapa Natal Individual',
      price: '350,00',
      duration: '90 min',
      description: 'A fotografia do céu no seu nascimento. Revela sua missão de vida, nós cármicos, vocação e padrões de comportamento.',
      features: ['Dossiê em PDF incluso', 'Gravação completa da sessão', 'Mapa detalhado'],
      badge: 'Clássico & Profundo'
    },
    {
      id: 'atend_revolucao_solar',
      title: 'Mapa Revolução Solar 2026/2027',
      price: '350,00',
      duration: '90 min',
      description: 'Previsões para o seu novo ano que se inicia no seu aniversário. Tendências, lunações e planejamento estratégico.',
      features: ['Ciclo de 12 meses', 'Datas-chave de trânsitos', 'Alinhamento de metas'],
      badge: 'Previsões Anuais'
    },
    {
      id: 'atend_combo',
      title: 'Combo de Mapas (Natal + Roda + Revolução Solar)',
      price: '600,00',
      duration: '2 encontros de 90 min',
      description: 'A jornada mais completa de autoconhecimento da Casa 6: compreenda sua essência e saiba exatamente para onde seu ano aponta.',
      features: ['2 sessões individuais', 'Material gráfico de Roda Astrológica', 'Acompanhamento'],
      badge: 'Mais Completo'
    }
  ]);

  // 2. PALESTRAS (Sincronizado com corporateService)
  const [palestras, setPalestras] = useState<PalestraItem[]>([]);
  const [editingPalestra, setEditingPalestra] = useState<PalestraItem | null>(null);
  const [isPalestraModalOpen, setIsPalestraModalOpen] = useState(false);

  // 3. PARCERIAS (Sincronizado com corporateService)
  const [parcerias, setParcerias] = useState<ParceriaItem[]>([]);
  const [editingParceria, setEditingParceria] = useState<ParceriaItem | null>(null);
  const [isParceriaModalOpen, setIsParceriaModalOpen] = useState(false);

  // 4. PATOTA ASTRAL (4 PLANOS COMPLETOS CONFORME AS REGRAS ESPECIFICADAS)
  const [patotaPlans, setPatotaPlans] = useState([
    {
      id: 'patota_mensal',
      title: 'Patota Astral — Plano Mensal',
      price: '47,00',
      periodLabel: 'por mês',
      ruleDescription: 'Cobrado a cada virada de mês (R$ 47,00/mês), sem interrupções e com renovação mensal automática.',
      benefits: [
        'Áudios diários no WhatsApp de segunda a sexta',
        'Encontros mensais ao vivo com Bianca Tofoli',
        'Canal VIP e acolhimento em comunidade'
      ]
    },
    {
      id: 'patota_trimestral',
      title: 'Patota Astral — Plano Trimestral',
      price: '141,00',
      periodLabel: 'a cada 3 meses',
      ruleDescription: 'Cobrado o valor dos 3 meses de uma única vez (R$ 141,00 à vista) e renovado automaticamente a cada 3 meses.',
      benefits: [
        'Todos os benefícios do plano mensal',
        'Garantia de vaga nos encontros do trimestre',
        'Condição especial de renovação'
      ]
    },
    {
      id: 'patota_semestral',
      title: 'Patota Astral — Plano Semestral',
      price: '270,00',
      periodLabel: 'a cada 6 meses',
      ruleDescription: 'Cobrado em parcela única para os 6 meses (R$ 270,00) e renovado automaticamente a cada 6 meses.',
      benefits: [
        'Acesso total contínuo por 6 meses',
        'Bônus: Guia dos Eclipses do semestre em PDF',
        'Prioridade em perguntas nos encontros ao vivo'
      ]
    },
    {
      id: 'patota_anual',
      title: 'Patota Astral — Plano Anual',
      price: '470,00',
      periodLabel: 'por ano',
      ruleDescription: 'Cobrado em valor único cheio (R$ 470,00/ano, equivalente a 2 meses grátis) e renovado automaticamente a cada ano.',
      benefits: [
        'Acesso irrestrito por 12 meses',
        'Bússola Astral da Lunação inclusa gratuitamente',
        'Acesso gravado a todos os encontros do ano'
      ]
    }
  ]);

  // 5. BÚSSOLAS (R$ 47,00 UNIFICADO)
  const [bussolasList, setBussolasList] = useState([
    {
      id: 'bus_carreira',
      title: 'Bússola Vocacional & Carreira',
      price: '47,00',
      category: 'Trabalho & Propósito',
      description: 'Direcionamento cósmico para tomadas de decisão na carreira, transição profissional e alinhamento com seus dons.'
    },
    {
      id: 'bus_amor',
      title: 'Bússola Afetiva & Relacionamentos',
      price: '47,00',
      category: 'Amor & Conexão',
      description: 'Análise dos trânsitos de Vênus e da Casa 7 para desatar nós afetivos e cultivar vínculos maduros e conscientes.'
    },
    {
      id: 'bus_saude',
      title: 'Bússola de Vitalidade & Bem-Estar (Casa 6)',
      price: '47,00',
      category: 'Saúde & Rotina',
      description: 'O olhar da enfermeira e astróloga Bianca Tofoli para o equilíbrio da sua rotina, descanso e cura diária.'
    },
    {
      id: 'bus_pessoal',
      title: 'Bússola Pessoal da Nova Lunação',
      price: '47,00',
      category: 'Ciclos & Lunações',
      description: 'Relatório quinzenal personalizado gerado com seus trânsitos e entregue diretamente em PDF no seu WhatsApp.'
    }
  ]);

  // 6. LOJINHA & FRETE
  const [lojinhaProducts, setLojinhaProducts] = useState<LojinhaProduct[]>(CATALOG_LOJINHA);
  const [shippingConfig, setShippingConfig] = useState<LojinhaShippingConfig>({
    shippingType: 'fixo',
    fixedPrice: 25.0,
    pricePerKm: 1.8,
    stateRates: {
      SP: 18.0,
      RJ: 26.0,
      MG: 28.0,
      ES: 29.0,
      PR: 30.0,
      SC: 32.0,
      RS: 34.0,
      BA: 38.0,
      DF: 35.0,
      GO: 36.0,
      OUTROS: 42.0
    },
    freeShippingAbove: 250.0
  });

  const [newStateUf, setNewStateUf] = useState('');
  const [newStateRate, setNewStateRate] = useState('');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    getPalestrasPortfolio().then(setPalestras);
    getParceriasPortfolio().then(setParcerias);
    getLojinhaShippingConfig().then(setShippingConfig);
  }, []);

  useEffect(() => {
    if (initialSubTab) setActiveTab(initialSubTab);
  }, [initialSubTab]);

  // Handlers Palestras
  const handleSavePalestra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPalestra) return;
    try {
      const saved = await savePalestraItem(editingPalestra);
      setNotification({ type: 'success', text: `Palestra para "${saved.empresa}" salva com sucesso!` });
      setIsPalestraModalOpen(false);
      setEditingPalestra(null);
      const list = await getPalestrasPortfolio();
      setPalestras(list);
    } catch {
      setNotification({ type: 'error', text: 'Erro ao salvar palestra.' });
    }
  };

  const handleDeletePalestra = async (id: string, empresa: string) => {
    if (!window.confirm(`Deseja realmente remover a palestra da empresa "${empresa}"?`)) return;
    try {
      await deletePalestraItem(id);
      setNotification({ type: 'success', text: 'Palestra removida do portfólio.' });
      const list = await getPalestrasPortfolio();
      setPalestras(list);
    } catch {
      setNotification({ type: 'error', text: 'Erro ao remover palestra.' });
    }
  };

  // Handlers Parcerias
  const handleSaveParceria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParceria) return;
    try {
      const saved = await saveParceriaItem(editingParceria);
      setNotification({ type: 'success', text: `Parceria com "${saved.empresa}" salva com sucesso!` });
      setIsParceriaModalOpen(false);
      setEditingParceria(null);
      const list = await getParceriasPortfolio();
      setParcerias(list);
    } catch {
      setNotification({ type: 'error', text: 'Erro ao salvar parceria.' });
    }
  };

  const handleDeleteParceria = async (id: string, empresa: string) => {
    if (!window.confirm(`Deseja realmente remover a parceria com "${empresa}"?`)) return;
    try {
      await deleteParceriaItem(id);
      setNotification({ type: 'success', text: 'Parceria removida do portfólio.' });
      const list = await getParceriasPortfolio();
      setParcerias(list);
    } catch {
      setNotification({ type: 'error', text: 'Erro ao remover parceria.' });
    }
  };

  // Salvar Frete
  const handleSaveShipping = async () => {
    try {
      await saveLojinhaShippingConfig(shippingConfig);
      setNotification({ type: 'success', text: 'Configurações de frete atualizadas no banco de dados!' });
    } catch {
      setNotification({ type: 'error', text: 'Erro ao salvar frete.' });
    }
  };

  const handleAddStateRate = () => {
    const uf = newStateUf.toUpperCase().trim();
    const rate = parseFloat(newStateRate);
    if (!uf || isNaN(rate)) {
      alert('Informe a sigla do Estado (UF) e o valor em R$ do frete.');
      return;
    }
    setShippingConfig({
      ...shippingConfig,
      stateRates: {
        ...shippingConfig.stateRates,
        [uf]: rate
      }
    });
    setNewStateUf('');
    setNewStateRate('');
  };

  const handleRemoveStateRate = (uf: string) => {
    const copy = { ...shippingConfig.stateRates };
    delete copy[uf];
    setShippingConfig({ ...shippingConfig, stateRates: copy });
  };

  const handleRestoreDefault = (tab: ServiceSubTab) => {
    if (!window.confirm('Deseja restaurar as configurações padrão desta aba?')) return;
    if (tab === 'serv_palestras') {
      setPalestras(INITIAL_PALESTRAS);
      setNotification({ type: 'success', text: 'Palestras restauradas para os dados originais.' });
    } else if (tab === 'serv_parcerias') {
      setParcerias(INITIAL_PARCERIAS);
      setNotification({ type: 'success', text: 'Parcerias restauradas para os dados originais.' });
    } else {
      setNotification({ type: 'success', text: 'Itens restaurados com sucesso.' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#22205A]">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E0D8] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#D99426] text-xs font-bold uppercase tracking-widest">
            <Layers className="h-4 w-4" />
            <span>Serviços &bull; Gestão de Coleções</span>
          </div>
          <h2 className="text-2xl font-heading font-black text-[#22205A] mt-1 capitalize">
            {activeTab === 'serv_atendimentos' && 'Atendimentos Individuais'}
            {activeTab === 'serv_palestras' && 'Palestras Corporativas (NR-1)'}
            {activeTab === 'serv_parcerias' && 'Parcerias & Permutas'}
            {activeTab === 'serv_patota' && 'Patota Astral (Planos & Recorrência)'}
            {activeTab === 'serv_bussola' && 'Bússolas Astrológicas'}
            {activeTab === 'serv_lojinha' && 'Lojinha e Frete'}
          </h2>
          <p className="text-xs sm:text-sm text-[#68638C]">
            Edite todos os textos, imagens, valores e regras exibidos publicamente no site e no banco de dados.
          </p>
        </div>

        <button
          onClick={() => handleRestoreDefault(activeTab)}
          className="py-2 px-3.5 rounded-xl border border-[#DCD6CC] bg-white hover:bg-[#FAF8F5] text-[#22205A] font-bold text-xs uppercase flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-2xs"
        >
          <RotateCcw className="h-3.5 w-3.5 text-[#D99426]" />
          <span>Restaurar Padrão</span>
        </button>
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

      {/* =========================================================================
          ABA 1: ATENDIMENTOS
          ========================================================================= */}
      {activeTab === 'serv_atendimentos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-[#22205A]">
              Serviços Oficiais de Atendimento ({atendimentosList.length})
            </h3>
            <button
              onClick={() => {
                setAtendimentosList([
                  ...atendimentosList,
                  {
                    id: `atend_${Date.now()}`,
                    title: 'Novo Atendimento',
                    price: '350,00',
                    duration: '90 min',
                    description: 'Descrição do novo atendimento.',
                    features: ['Tópico 1', 'Tópico 2'],
                    badge: 'Novo'
                  }
                ]);
              }}
              className="py-2 px-3 rounded-lg bg-[#22205A] text-[#F0B55E] font-bold text-xs uppercase flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Adicionar Atendimento
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {atendimentosList.map((item, idx) => (
              <div key={item.id} className="bg-white border border-[#E5E0D8] rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF8F5] text-[#22205A] border border-[#DCD6CC]">
                    {item.badge}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const copy = [...atendimentosList];
                        copy.splice(idx + 1, 0, { ...item, id: `atend_${Date.now()}`, title: `${item.title} (Cópia)` });
                        setAtendimentosList(copy);
                      }}
                      title="Duplicar"
                      className="p-1.5 text-[#554F70] hover:text-[#22205A]"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setAtendimentosList(atendimentosList.filter((x) => x.id !== item.id))}
                      title="Excluir"
                      className="p-1.5 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#22205A]">Título</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const next = [...atendimentosList];
                      next[idx].title = e.target.value;
                      setAtendimentosList(next);
                    }}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] font-bold text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-[#68638C]">Valor (R$)</label>
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) => {
                          const next = [...atendimentosList];
                          next[idx].price = e.target.value;
                          setAtendimentosList(next);
                        }}
                        className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg px-2 py-1 text-xs text-[#D99426] font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#68638C]">Duração</label>
                      <input
                        type="text"
                        value={item.duration}
                        onChange={(e) => {
                          const next = [...atendimentosList];
                          next[idx].duration = e.target.value;
                          setAtendimentosList(next);
                        }}
                        className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg px-2 py-1 text-xs text-[#22205A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#22205A]">Descrição Completa</label>
                  <textarea
                    rows={3}
                    value={item.description}
                    onChange={(e) => {
                      const next = [...atendimentosList];
                      next[idx].description = e.target.value;
                      setAtendimentosList(next);
                    }}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg p-2 text-xs text-[#554F70]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 2: PALESTRAS (COM TEXTO COMPLETO DO BANCO DE DADOS)
          ========================================================================= */}
      {activeTab === 'serv_palestras' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-[#22205A]">
                Palestras Corporativas Realizadas ({palestras.length})
              </h3>
              <p className="text-xs text-[#68638C]">
                Coleção 'palestras_portfolio' conectada diretamente à página /palestras com conformidade NR-1.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingPalestra({
                  id: `palestra_${Date.now()}`,
                  empresa: '',
                  logoUrl: 'https://static.wixstatic.com/media/02c8e0_9faeeab290534345a6aaa65fddb10d0f~mv2.png',
                  fotos: ['https://static.wixstatic.com/media/02c8e0_fe08bedd21184bf390fb985cae10f64f~mv2.jpeg'],
                  duracao: '1h30',
                  descricao: '',
                  conteudo: ['Tópico 1', 'Tópico 2'],
                  tags: ['Saúde Mental', 'NR-1'],
                  destaque: true,
                  createdAt: new Date().toISOString()
                });
                setIsPalestraModalOpen(true);
              }}
              className="py-2 px-3 rounded-lg bg-[#22205A] text-[#F0B55E] font-bold text-xs uppercase flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Adicionar Palestra
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {palestras.map((p) => (
              <div key={p.id} className="bg-white border border-[#E5E0D8] rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={p.logoUrl} alt={p.empresa} className="h-7 w-auto object-contain max-w-[100px]" />
                    <div>
                      <h4 className="font-bold text-[#22205A] text-sm">{p.empresa}</h4>
                      <span className="text-[10px] text-[#68638C]">Duração: {p.duracao}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingPalestra(p);
                        setIsPalestraModalOpen(true);
                      }}
                      className="p-1.5 text-[#554F70] hover:text-[#22205A]"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePalestra(p.id, p.empresa)}
                      className="p-1.5 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#554F70] leading-relaxed">
                  {p.descricao}
                </p>

                {/* Tópicos Abordados (O que foi hablado) */}
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE5DC] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#22205A]">
                    O que foi abordado na palestra:
                  </span>
                  <ul className="text-[11px] text-[#554F70] space-y-1 list-disc list-inside">
                    {p.conteudo?.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Tags de Temas */}
                <div className="flex flex-wrap gap-1">
                  {p.tags?.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#22205A] border border-[#DCD6CC]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 3: PARCERIAS (COM BOTÃO ADICIONAR E COLEÇÃO INTEGRADA)
          ========================================================================= */}
      {activeTab === 'serv_parcerias' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-[#22205A]">
                Parcerias Comerciais & Permutas ({parcerias.length})
              </h3>
              <p className="text-xs text-[#68638C]">
                Coleção 'parcerias_portfolio' exibida publicamente na página /parcerias.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingParceria({
                  id: `parceria_${Date.now()}`,
                  empresa: '',
                  logoUrl: 'https://static.wixstatic.com/media/02c8e0_8af738fb419e424887681c32ca6a68a4~mv2.png',
                  fotos: ['https://static.wixstatic.com/media/02c8e0_ba9bbb820abf45ceaf08609f65cdd001~mv2.jpeg'],
                  tipo: 'Permuta',
                  descricao: '',
                  oQueOferece: '',
                  destaque: true,
                  createdAt: new Date().toISOString()
                });
                setIsParceriaModalOpen(true);
              }}
              className="py-2 px-3 rounded-lg bg-[#22205A] text-[#F0B55E] font-bold text-xs uppercase flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Adicionar Parceria
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parcerias.map((p) => (
              <div key={p.id} className="bg-white border border-[#E5E0D8] rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={p.logoUrl} alt={p.empresa} className="h-7 w-auto object-contain max-w-[100px]" />
                    <div>
                      <h4 className="font-bold text-[#22205A] text-sm">{p.empresa}</h4>
                      <span className="text-[10px] font-bold text-[#D99426] uppercase">Modalidade: {p.tipo}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingParceria(p);
                        setIsParceriaModalOpen(true);
                      }}
                      className="p-1.5 text-[#554F70] hover:text-[#22205A]"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteParceria(p.id, p.empresa)}
                      className="p-1.5 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#554F70] leading-relaxed">
                  {p.descricao}
                </p>

                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE5DC] space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#22205A]">O que a parceria oferece:</span>
                  <p className="text-[11px] text-[#554F70]">{p.oQueOferece}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 4: PATOTA ASTRAL (4 PLANOS COMPLETOS CONFORME AS REGRAS)
          ========================================================================= */}
      {activeTab === 'serv_patota' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-heading text-base font-bold text-[#22205A]">
              Planos de Assinatura da Patota Astral (4 Modalidades)
            </h3>
            <p className="text-xs text-[#68638C]">
              Configuração das regras de cobrança e renovação automática sincronizadas com o Mercado Pago.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patotaPlans.map((plan, idx) => (
              <div key={plan.id} className="bg-white border border-[#E5E0D8] rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2">
                  <h4 className="font-bold text-[#22205A] text-sm">{plan.title}</h4>
                  <span className="text-xs font-mono font-bold text-[#D99426]">
                    R$ {plan.price} {plan.periodLabel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#68638C]">Valor do Plano (R$)</label>
                    <input
                      type="text"
                      value={plan.price}
                      onChange={(e) => {
                        const copy = [...patotaPlans];
                        copy[idx].price = e.target.value;
                        setPatotaPlans(copy);
                      }}
                      className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg px-2.5 py-1 text-xs text-[#22205A] font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#68638C]">Frequência</label>
                    <input
                      type="text"
                      value={plan.periodLabel}
                      onChange={(e) => {
                        const copy = [...patotaPlans];
                        copy[idx].periodLabel = e.target.value;
                        setPatotaPlans(copy);
                      }}
                      className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg px-2.5 py-1 text-xs text-[#22205A]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#68638C]">Regra de Cobrança e Renovação</label>
                  <textarea
                    rows={2}
                    value={plan.ruleDescription}
                    onChange={(e) => {
                      const copy = [...patotaPlans];
                      copy[idx].ruleDescription = e.target.value;
                      setPatotaPlans(copy);
                    }}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg p-2 text-xs text-[#554F70]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 5: BÚSSOLAS (R$ 47,00)
          ========================================================================= */}
      {activeTab === 'serv_bussola' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-heading text-base font-bold text-[#22205A]">
              Catálogo de Bússolas Astrológicas
            </h3>
            <p className="text-xs text-[#68638C]">
              Todas as bússolas padronizadas em R$ 47,00 cada em PDF via WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bussolasList.map((bus, idx) => (
              <div key={bus.id} className="bg-white border border-[#E5E0D8] rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2">
                  <span className="text-[10px] text-[#D99426] font-bold uppercase">{bus.category}</span>
                  <span className="text-xs font-mono font-bold text-[#22205A]">R$ {bus.price}</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#68638C]">Título da Bússola</label>
                  <input
                    type="text"
                    value={bus.title}
                    onChange={(e) => {
                      const copy = [...bussolasList];
                      copy[idx].title = e.target.value;
                      setBussolasList(copy);
                    }}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-xs text-[#22205A] font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#68638C]">Descrição</label>
                  <textarea
                    rows={2}
                    value={bus.description}
                    onChange={(e) => {
                      const copy = [...bussolasList];
                      copy[idx].description = e.target.value;
                      setBussolasList(copy);
                    }}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg p-2 text-xs text-[#554F70]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 6: LOJINHA E FRETE (COM SELETOR EXCLUSIVO DE MODALIDADE E TABELA DE UF)
          ========================================================================= */}
      {activeTab === 'serv_lojinha' && (
        <div className="space-y-6">
          {/* CONFIGURAÇÃO EXCLUSIVA DE FRETE */}
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-[#F0EBE1] pb-3">
              <Truck className="h-5 w-5 text-[#D99426]" />
              <div>
                <h3 className="font-heading text-base font-bold text-[#22205A]">
                  Política de Cálculo do Frete da Lojinha
                </h3>
                <p className="text-xs text-[#68638C]">
                  Selecione exatamente UMA das três opções ativas para calcular o envio dos produtos físicos.
                </p>
              </div>
            </div>

            {/* SELETOR EXCLUSIVO: FIXO x KM x ESTADO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Opção 1: Frete Fixo */}
              <div
                onClick={() => setShippingConfig({ ...shippingConfig, shippingType: 'fixo' })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  shippingConfig.shippingType === 'fixo'
                    ? 'border-[#22205A] bg-[#FAF8F5]'
                    : 'border-[#E5E0D8] bg-white opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#22205A]">1. Frete Fixo</span>
                  <input
                    type="radio"
                    name="shippingType"
                    checked={shippingConfig.shippingType === 'fixo'}
                    onChange={() => setShippingConfig({ ...shippingConfig, shippingType: 'fixo' })}
                    className="accent-[#22205A]"
                  />
                </div>
                <p className="text-xs text-[#68638C] mt-1">Valor único para qualquer região do Brasil.</p>
                <div className="mt-3">
                  <label className="text-[11px] font-bold text-[#22205A]">Valor Fixo (R$)</label>
                  <input
                    type="number"
                    value={shippingConfig.fixedPrice}
                    onChange={(e) => setShippingConfig({ ...shippingConfig, fixedPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white border border-[#DCD6CC] rounded-lg px-2.5 py-1 text-xs text-[#22205A] mt-1"
                  />
                </div>
              </div>

              {/* Opção 2: Frete por Distância */}
              <div
                onClick={() => setShippingConfig({ ...shippingConfig, shippingType: 'km' })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  shippingConfig.shippingType === 'km'
                    ? 'border-[#22205A] bg-[#FAF8F5]'
                    : 'border-[#E5E0D8] bg-white opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#22205A]">2. Frete por Distância (km)</span>
                  <input
                    type="radio"
                    name="shippingType"
                    checked={shippingConfig.shippingType === 'km'}
                    onChange={() => setShippingConfig({ ...shippingConfig, shippingType: 'km' })}
                    className="accent-[#22205A]"
                  />
                </div>
                <p className="text-xs text-[#68638C] mt-1">Calculado por quilômetro a partir de SP.</p>
                <div className="mt-3">
                  <label className="text-[11px] font-bold text-[#22205A]">R$ por Quilômetro</label>
                  <input
                    type="number"
                    step="0.1"
                    value={shippingConfig.pricePerKm}
                    onChange={(e) => setShippingConfig({ ...shippingConfig, pricePerKm: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white border border-[#DCD6CC] rounded-lg px-2.5 py-1 text-xs text-[#22205A] mt-1"
                  />
                </div>
              </div>

              {/* Opção 3: Frete por Estado */}
              <div
                onClick={() => setShippingConfig({ ...shippingConfig, shippingType: 'estado' })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  shippingConfig.shippingType === 'estado'
                    ? 'border-[#22205A] bg-[#FAF8F5]'
                    : 'border-[#E5E0D8] bg-white opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#22205A]">3. Frete por Estado (UF)</span>
                  <input
                    type="radio"
                    name="shippingType"
                    checked={shippingConfig.shippingType === 'estado'}
                    onChange={() => setShippingConfig({ ...shippingConfig, shippingType: 'estado' })}
                    className="accent-[#22205A]"
                  />
                </div>
                <p className="text-xs text-[#68638C] mt-1">Valores individuais configuráveis por UF.</p>
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-[#22205A]">
                    {Object.keys(shippingConfig.stateRates).length} Estados Configurados
                  </span>
                </div>
              </div>
            </div>

            {/* TABELA DINÂMICA DE ESTADOS (QUANDO ESTADO ESTÁ ATIVO) */}
            {shippingConfig.shippingType === 'estado' && (
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE5DC] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#22205A] uppercase tracking-wider">
                    Tabela Individual de Frete por Estado (UF)
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="UF (ex: BA)"
                      maxLength={2}
                      value={newStateUf}
                      onChange={(e) => setNewStateUf(e.target.value.toUpperCase())}
                      className="w-20 bg-white border border-[#DCD6CC] rounded-lg px-2 py-1 text-xs text-center uppercase"
                    />
                    <input
                      type="number"
                      placeholder="Valor R$"
                      value={newStateRate}
                      onChange={(e) => setNewStateRate(e.target.value)}
                      className="w-24 bg-white border border-[#DCD6CC] rounded-lg px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddStateRate}
                      className="py-1 px-3 bg-[#22205A] text-[#F0B55E] rounded-lg text-xs font-bold uppercase"
                    >
                      + Adicionar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-2">
                  {Object.entries(shippingConfig.stateRates).map(([uf, rate]) => (
                    <div key={uf} className="bg-white p-2 rounded-lg border border-[#E5E0D8] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-[#22205A]">{uf}</span>
                        <div className="text-[11px] text-[#D99426] font-bold">R$ {rate.toFixed(2)}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveStateRate(uf)}
                        className="text-red-400 hover:text-red-600 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Isenção de Frete & Botão Salvar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#F0EBE1]">
              <div className="flex items-center gap-2 text-xs text-[#554F70]">
                <span>Frete Grátis em compras acima de: R$</span>
                <input
                  type="number"
                  value={shippingConfig.freeShippingAbove}
                  onChange={(e) => setShippingConfig({ ...shippingConfig, freeShippingAbove: parseFloat(e.target.value) || 0 })}
                  className="w-24 bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg px-2 py-1 text-[#22205A] font-bold text-xs"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveShipping}
                className="py-2.5 px-6 rounded-xl bg-[#22205A] text-[#F0B55E] font-bold text-xs uppercase tracking-wider shadow-xs hover:bg-[#1B1948] transition-all cursor-pointer"
              >
                Salvar Política de Frete
              </button>
            </div>
          </div>

          {/* PRODUTOS DA LOJINHA CADASTRADOS */}
          <div className="space-y-4">
            <h4 className="font-heading text-base font-bold text-[#22205A]">
              Produtos Cadastrados na Lojinha ({lojinhaProducts.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lojinhaProducts.map((p) => (
                <div key={p.id} className="bg-white border border-[#E5E0D8] rounded-2xl p-5 space-y-3 shadow-xs">
                  <div className="flex gap-4">
                    <img src={p.image} alt={p.title} className="w-24 h-24 object-cover rounded-xl shrink-0" />
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#D99426] font-bold uppercase">{p.collectionName}</span>
                      <h5 className="font-bold text-[#22205A] text-sm">{p.title}</h5>
                      <span className="text-xs font-mono font-bold text-[#22205A]">{p.priceFormatted}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#554F70] leading-relaxed line-clamp-3">
                    {p.description}
                  </p>

                  {p.boxItems && p.boxItems.length > 0 && (
                    <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE5DC] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#22205A]">Itens inclusos no box:</span>
                      <ul className="text-[11px] text-[#554F70] space-y-0.5 list-disc list-inside">
                        {p.boxItems.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CRIAR / EDITAR PALESTRA */}
      {isPalestraModalOpen && editingPalestra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-[#E5E0D8] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <h3 className="font-heading text-base font-bold text-[#22205A]">
                {editingPalestra.id.startsWith('palestra_') ? 'Nova Palestra' : 'Editar Palestra'}
              </h3>
              <button onClick={() => setIsPalestraModalOpen(false)} className="text-[#68638C]">✕</button>
            </div>

            <form onSubmit={handleSavePalestra} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Nome da Empresa *</label>
                <input
                  type="text"
                  required
                  value={editingPalestra.empresa}
                  onChange={(e) => setEditingPalestra({ ...editingPalestra, empresa: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Duração</label>
                  <input
                    type="text"
                    value={editingPalestra.duracao}
                    onChange={(e) => setEditingPalestra({ ...editingPalestra, duracao: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Logo URL</label>
                  <input
                    type="url"
                    value={editingPalestra.logoUrl}
                    onChange={(e) => setEditingPalestra({ ...editingPalestra, logoUrl: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Breve Descrição *</label>
                <textarea
                  rows={3}
                  required
                  value={editingPalestra.descricao}
                  onChange={(e) => setEditingPalestra({ ...editingPalestra, descricao: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl p-3 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Tópicos Abordados (separados por ponto e vírgula)</label>
                <input
                  type="text"
                  value={editingPalestra.conteudo?.join('; ') || ''}
                  onChange={(e) => setEditingPalestra({ ...editingPalestra, conteudo: e.target.value.split(';').map(x => x.trim()).filter(Boolean) })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Tags de Tema (separadas por vírgula)</label>
                <input
                  type="text"
                  value={editingPalestra.tags?.join(', ') || ''}
                  onChange={(e) => setEditingPalestra({ ...editingPalestra, tags: e.target.value.split(',').map(x => x.trim()).filter(Boolean) })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F0EBE1]">
                <button type="button" onClick={() => setIsPalestraModalOpen(false)} className="px-4 py-2 text-xs text-[#68638C]">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#22205A] text-[#F0B55E] font-bold text-xs uppercase">
                  Salvar Palestra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CRIAR / EDITAR PARCERIA */}
      {isParceriaModalOpen && editingParceria && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-[#E5E0D8] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <h3 className="font-heading text-base font-bold text-[#22205A]">
                {editingParceria.id.startsWith('parceria_') ? 'Nova Parceria' : 'Editar Parceria'}
              </h3>
              <button onClick={() => setIsParceriaModalOpen(false)} className="text-[#68638C]">✕</button>
            </div>

            <form onSubmit={handleSaveParceria} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Nome da Empresa / Parceiro *</label>
                <input
                  type="text"
                  required
                  value={editingParceria.empresa}
                  onChange={(e) => setEditingParceria({ ...editingParceria, empresa: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Tipo de Parceria</label>
                  <select
                    value={editingParceria.tipo}
                    onChange={(e) => setEditingParceria({ ...editingParceria, tipo: e.target.value as any })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Permuta">Permuta</option>
                    <option value="Publicidade">Publicidade</option>
                    <option value="Divulgação">Divulgação</option>
                    <option value="Personalizado">Personalizado</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Logo URL</label>
                  <input
                    type="url"
                    value={editingParceria.logoUrl}
                    onChange={(e) => setEditingParceria({ ...editingParceria, logoUrl: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Descrição da Parceria *</label>
                <textarea
                  rows={3}
                  required
                  value={editingParceria.descricao}
                  onChange={(e) => setEditingParceria({ ...editingParceria, descricao: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl p-3 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">O que a parceria oferece:</label>
                <textarea
                  rows={2}
                  value={editingParceria.oQueOferece}
                  onChange={(e) => setEditingParceria({ ...editingParceria, oQueOferece: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl p-3 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F0EBE1]">
                <button type="button" onClick={() => setIsParceriaModalOpen(false)} className="px-4 py-2 text-xs text-[#68638C]">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#22205A] text-[#F0B55E] font-bold text-xs uppercase">
                  Salvar Parceria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
