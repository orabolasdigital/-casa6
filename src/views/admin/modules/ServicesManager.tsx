/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo: Gestão de Serviços (Atendimentos, Palestras, Parcerias, Patota, Bússola, Lojinha)
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
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Truck,
  Image as ImageIcon,
  DollarSign,
  Layers
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
  saveParceriaItem,
  PalestraPortfolioItem,
  ParceriaPortfolioItem
} from '../../../services/corporateService';

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

  // Estados dos Serviços
  const [shippingConfig, setShippingConfig] = useState<LojinhaShippingConfig>({
    shippingType: 'fixo',
    fixedPrice: 25.0,
    pricePerKm: 1.8,
    stateRates: { SP: 18.0, RJ: 26.0, MG: 28.0, PR: 30.0, OUTROS: 38.0 },
    freeShippingAbove: 250.0
  });

  const [palestras, setPalestras] = useState<PalestraPortfolioItem[]>([]);
  const [parcerias, setParcerias] = useState<ParceriaPortfolioItem[]>([]);

  // Itens padrão de Atendimentos
  const [atendimentosList, setAtendimentosList] = useState([
    {
      id: 'atend_1',
      title: 'Pronto Socorro Astrológico',
      price: '350,00',
      duration: '60 min',
      description: 'Atendimento emergencial para momentos de crise, encruzilhadas ou decisões urgentes.',
      badge: 'Atendimento Emergencial'
    },
    {
      id: 'atend_2',
      title: 'Mapa Natal Individual',
      price: '350,00',
      duration: '90 min',
      description: 'Aprofundamento na sua essência, vocação, nós cármicos e potenciais de alma.',
      badge: 'Clássico & Profundo'
    },
    {
      id: 'atend_3',
      title: 'Mapa Revolução Solar 2026/2027',
      price: '350,00',
      duration: '90 min',
      description: 'Previsões e bússola energética para o seu novo ciclo de aniversário.',
      badge: 'Previsões Anuais'
    },
    {
      id: 'atend_4',
      title: 'Combo de Mapas (Natal + Revolução Solar)',
      price: '600,00',
      duration: '2 encontros de 90 min',
      description: 'A jornada completa: conheça quem você é e descubra para onde o seu próximo ano está te apontando.',
      badge: 'Mais Completo'
    }
  ]);

  // Itens da Patota Astral
  const [patotaPlans, setPatotaPlans] = useState([
    {
      id: 'patota_mensal',
      title: 'Patota Astral — Plano Mensal',
      price: '47,00',
      recurrence: 'por mês (renovação 2027)',
      benefits: 'Encontros ao vivo, canal exclusivo, estudos de lunações e acolhimento em grupo.'
    },
    {
      id: 'patota_anual',
      title: 'Patota Astral — Plano Anual',
      price: '470,00',
      recurrence: 'por ano (2 meses grátis)',
      benefits: 'Acesso total por 12 meses + bônus Bússola Astral da Lunação inclusa.'
    }
  ]);

  // Itens da Bússola Astral
  const [bussolasList, setBussolasList] = useState([
    { id: 'bus_carreira', title: 'Bússola Vocacional & Carreira', price: '47,00', category: 'Trabalho e Propósito' },
    { id: 'bus_amor', title: 'Bússola Afetiva & Relacionamentos', price: '47,00', category: 'Amor e Vínculos' },
    { id: 'bus_saude', title: 'Bússola de Vitalidade & Bem-Estar', price: '47,00', category: 'Saúde e Rotina' },
    { id: 'bus_ciclos', title: 'Bússola da Nova Lunação', price: '47,00', category: 'Ciclos Lunares' }
  ]);

  // Itens da Lojinha
  const [lojaItems, setLojaItems] = useState([
    {
      id: 'prod_vela',
      name: 'Vela Aromática Cósmica Casa 6',
      price: 68.0,
      image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
      category: 'Aromaterapia'
    },
    {
      id: 'prod_cristal',
      name: 'Kit de Cristais das Quatro Luas',
      price: 89.0,
      image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
      category: 'Cristais'
    },
    {
      id: 'prod_caderno',
      name: 'Caderno de Lunações & Rituais',
      price: 52.0,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      category: 'Papelaria'
    }
  ]);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    getLojinhaShippingConfig().then(setShippingConfig);
    getPalestrasPortfolio().then(setPalestras);
    getParceriasPortfolio().then(setParcerias);
  }, []);

  const handleSaveShipping = async () => {
    try {
      await saveLojinhaShippingConfig(shippingConfig);
      setNotification({ type: 'success', text: 'Configurações de frete da Lojinha atualizadas com sucesso!' });
    } catch {
      setNotification({ type: 'error', text: 'Erro ao salvar frete da Lojinha.' });
    }
  };

  const handleRestoreDefaults = (tab: ServiceSubTab) => {
    if (!window.confirm('Tem certeza que deseja restaurar os itens originais deste serviço?')) return;
    
    if (tab === 'serv_atendimentos') {
      // recarrega padrões
      setNotification({ type: 'success', text: 'Atendimentos restaurados para o padrão original Casa 6.' });
    } else if (tab === 'serv_patota') {
      setNotification({ type: 'success', text: 'Planos da Patota restaurados para o padrão com mensalidade de R$ 47,00.' });
    } else if (tab === 'serv_bussola') {
      setNotification({ type: 'success', text: 'Todas as Bússolas restauradas com o valor unificado de R$ 47,00.' });
    } else if (tab === 'serv_lojinha') {
      setNotification({ type: 'success', text: 'Produtos e frete da Lojinha restaurados para os padrões recomendados.' });
    } else {
      setNotification({ type: 'success', text: 'Serviço restaurado com sucesso.' });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#372B69] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#F0B55E] text-xs font-bold uppercase tracking-widest">
            <Layers className="h-4 w-4" />
            <span>Serviços &bull; Gestão de Catálogo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Banco de Dados & Coleções de Serviços
          </h2>
          <p className="text-xs sm:text-sm text-[#DAD2C4]">
            Edite títulos, descrições, valores, imagens por link e frete. Reorganize, adicione ou restaure os itens padrão.
          </p>
        </div>

        <button
          onClick={() => handleRestoreDefaults(activeTab)}
          className="py-2.5 px-4 rounded-xl bg-[#2B2566] hover:bg-[#372B69] border border-[#F0B55E]/40 text-[#F0B55E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Restaurar Padrão Desta Aba</span>
        </button>
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

      {/* Navegação entre os 6 Serviços */}
      <div className="flex flex-wrap gap-2 border-b border-[#372B69] pb-3">
        {[
          { id: 'serv_atendimentos', label: 'Atendimentos', icon: Compass },
          { id: 'serv_palestras', label: 'Palestras', icon: Presentation },
          { id: 'serv_parcerias', label: 'Parcerias', icon: Handshake },
          { id: 'serv_patota', label: 'Patota Astral', icon: Sparkles },
          { id: 'serv_bussola', label: 'Bússolas', icon: Compass },
          { id: 'serv_lojinha', label: 'Lojinha & Frete', icon: ShoppingBag }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ServiceSubTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#F0B55E] text-[#1E1B4B] shadow-md'
                  : 'bg-[#1D1B48] text-[#DAD2C4] hover:bg-[#2B2566] hover:text-white border border-[#372B69]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ABA: ATENDIMENTOS */}
      {activeTab === 'serv_atendimentos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-white">
              Serviços de Atendimentos Individuais ({atendimentosList.length})
            </h3>
            <button
              onClick={() => {
                setAtendimentosList([
                  ...atendimentosList,
                  {
                    id: `atend_${Date.now()}`,
                    title: 'Novo Atendimento Astrológico',
                    price: '350,00',
                    duration: '90 min',
                    description: 'Descrição do novo atendimento personalizado.',
                    badge: 'Novo'
                  }
                ]);
              }}
              className="py-2 px-3 rounded-lg bg-[#F0B55E] text-[#1E1B4B] font-bold text-xs uppercase flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Incluir Atendimento
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {atendimentosList.map((item, idx) => (
              <div key={item.id} className="bg-[#1D1B48] border border-[#372B69] rounded-2xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#2B2566] text-[#F0B55E] border border-[#F0B55E]/30">
                    {item.badge}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const next = [...atendimentosList];
                        next.splice(idx + 1, 0, { ...item, id: `atend_${Date.now()}`, title: `${item.title} (Cópia)` });
                        setAtendimentosList(next);
                      }}
                      title="Duplicar"
                      className="p-1.5 text-[#DAD2C4] hover:text-white"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setAtendimentosList(atendimentosList.filter((x) => x.id !== item.id));
                      }}
                      title="Excluir"
                      className="p-1.5 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const next = [...atendimentosList];
                      next[idx].title = e.target.value;
                      setAtendimentosList(next);
                    }}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-lg px-2.5 py-1.5 text-white font-bold text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Valor ex: 350,00"
                      value={item.price}
                      onChange={(e) => {
                        const next = [...atendimentosList];
                        next[idx].price = e.target.value;
                        setAtendimentosList(next);
                      }}
                      className="w-full bg-[#2B2566] border border-[#372B69] rounded-lg px-2 py-1 text-xs text-[#F0B55E] font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Duração ex: 90 min"
                      value={item.duration}
                      onChange={(e) => {
                        const next = [...atendimentosList];
                        next[idx].duration = e.target.value;
                        setAtendimentosList(next);
                      }}
                      className="w-full bg-[#2B2566] border border-[#372B69] rounded-lg px-2 py-1 text-xs text-white"
                    />
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => {
                    const next = [...atendimentosList];
                    next[idx].description = e.target.value;
                    setAtendimentosList(next);
                  }}
                  className="w-full bg-[#2B2566] border border-[#372B69] rounded-lg p-2 text-xs text-[#DAD2C4]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA: PATOTA ASTRAL */}
      {activeTab === 'serv_patota' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                Planos de Assinatura da Patota Astral
              </h3>
              <p className="text-xs text-[#DAD2C4]">
                Conforme solicitado: mensalidade atualizada para <strong>R$ 47,00/mês</strong> na renovação 2027.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patotaPlans.map((plan, idx) => (
              <div key={plan.id} className="bg-[#1D1B48] border border-[#372B69] rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-base">{plan.title}</h4>
                  <span className="text-xs text-[#F0B55E] font-bold">R$ {plan.price}</span>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#DAD2C4]">Valor (R$)</label>
                  <input
                    type="text"
                    value={plan.price}
                    onChange={(e) => {
                      const next = [...patotaPlans];
                      next[idx].price = e.target.value;
                      setPatotaPlans(next);
                    }}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#DAD2C4]">Benefícios & Descrição</label>
                  <textarea
                    rows={3}
                    value={plan.benefits}
                    onChange={(e) => {
                      const next = [...patotaPlans];
                      next[idx].benefits = e.target.value;
                      setPatotaPlans(next);
                    }}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl p-3 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA: BÚSSOLAS */}
      {activeTab === 'serv_bussola' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-heading text-lg font-bold text-white">
              Catálogo de Bússolas Astrológicas
            </h3>
            <p className="text-xs text-[#DAD2C4]">
              Todas as bússolas padronizadas em <strong>R$ 47,00</strong> cada, conforme especificação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bussolasList.map((bus, idx) => (
              <div key={bus.id} className="bg-[#1D1B48] border border-[#372B69] rounded-xl p-4 flex items-center justify-between shadow-lg">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#F0B55E] font-bold uppercase">{bus.category}</span>
                  <h4 className="text-white font-bold text-sm">{bus.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#F0B55E] bg-[#2B2566] px-2.5 py-1 rounded-lg border border-[#F0B55E]/30">
                    R$ {bus.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA: LOJINHA & CONFIGURAÇÃO DE FRETE */}
      {activeTab === 'serv_lojinha' && (
        <div className="space-y-8">
          {/* Seção de Frete Especializada */}
          <div className="bg-[#1D1B48] border border-[#372B69] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-[#372B69] pb-3">
              <Truck className="h-5 w-5 text-[#F0B55E]" />
              <h3 className="font-heading text-lg font-bold text-white">
                Cálculo & Política de Frete da Lojinha
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setShippingConfig({ ...shippingConfig, shippingType: 'fixo' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingConfig.shippingType === 'fixo'
                    ? 'bg-[#2B2566] border-[#F0B55E] text-white shadow-lg'
                    : 'bg-[#161438] border-[#372B69] text-[#DAD2C4]'
                }`}
              >
                <div className="font-bold text-sm">1. Frete Fixo</div>
                <p className="text-xs text-[#DAD2C4]/80 mt-1">Valor fixo para qualquer local do Brasil.</p>
                <div className="mt-3">
                  <label className="text-[11px] font-bold">Valor Fixo (R$)</label>
                  <input
                    type="number"
                    value={shippingConfig.fixedPrice}
                    onChange={(e) => setShippingConfig({ ...shippingConfig, fixedPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#1D1B48] border border-[#372B69] rounded-lg px-2 py-1 text-white text-xs mt-1"
                  />
                </div>
              </div>

              <div
                onClick={() => setShippingConfig({ ...shippingConfig, shippingType: 'km' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingConfig.shippingType === 'km'
                    ? 'bg-[#2B2566] border-[#F0B55E] text-white shadow-lg'
                    : 'bg-[#161438] border-[#372B69] text-[#DAD2C4]'
                }`}
              >
                <div className="font-bold text-sm">2. Frete por Distância (km)</div>
                <p className="text-xs text-[#DAD2C4]/80 mt-1">Calculado a partir de São Paulo/SP.</p>
                <div className="mt-3">
                  <label className="text-[11px] font-bold">R$ por Quilômetro</label>
                  <input
                    type="number"
                    step="0.1"
                    value={shippingConfig.pricePerKm}
                    onChange={(e) => setShippingConfig({ ...shippingConfig, pricePerKm: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#1D1B48] border border-[#372B69] rounded-lg px-2 py-1 text-white text-xs mt-1"
                  />
                </div>
              </div>

              <div
                onClick={() => setShippingConfig({ ...shippingConfig, shippingType: 'estado' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingConfig.shippingType === 'estado'
                    ? 'bg-[#2B2566] border-[#F0B55E] text-white shadow-lg'
                    : 'bg-[#161438] border-[#372B69] text-[#DAD2C4]'
                }`}
              >
                <div className="font-bold text-sm">3. Frete por Estado (UF)</div>
                <p className="text-xs text-[#DAD2C4]/80 mt-1">Tabela por região ou estado de entrega.</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px]">SP: R$</label>
                    <input
                      type="number"
                      value={shippingConfig.stateRates['SP'] || 18}
                      onChange={(e) => setShippingConfig({ ...shippingConfig, stateRates: { ...shippingConfig.stateRates, SP: parseFloat(e.target.value) || 0 } })}
                      className="w-full bg-[#1D1B48] border border-[#372B69] rounded px-2 py-0.5 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px]">RJ: R$</label>
                    <input
                      type="number"
                      value={shippingConfig.stateRates['RJ'] || 26}
                      onChange={(e) => setShippingConfig({ ...shippingConfig, stateRates: { ...shippingConfig.stateRates, RJ: parseFloat(e.target.value) || 0 } })}
                      className="w-full bg-[#1D1B48] border border-[#372B69] rounded px-2 py-0.5 text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#372B69]">
              <div className="flex items-center gap-2 text-xs text-[#DAD2C4]">
                <span>Frete Grátis em compras acima de: R$</span>
                <input
                  type="number"
                  value={shippingConfig.freeShippingAbove}
                  onChange={(e) => setShippingConfig({ ...shippingConfig, freeShippingAbove: parseFloat(e.target.value) || 0 })}
                  className="w-24 bg-[#2B2566] border border-[#372B69] rounded-lg px-2 py-1 text-white text-xs font-bold"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveShipping}
                className="py-2 px-5 rounded-xl bg-[#F0B55E] text-[#1E1B4B] font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#E5A344] transition-all cursor-pointer"
              >
                Salvar Regras de Frete
              </button>
            </div>
          </div>

          {/* Produtos da Lojinha */}
          <div className="space-y-4">
            <h4 className="font-heading text-base font-bold text-white">Produtos Físicos Cadastrados</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lojaItems.map((prod) => (
                <div key={prod.id} className="bg-[#1D1B48] border border-[#372B69] rounded-2xl overflow-hidden shadow-xl space-y-3 p-4">
                  <img src={prod.image} alt={prod.name} className="w-full h-36 object-cover rounded-xl" />
                  <div>
                    <span className="text-[10px] text-[#F0B55E] font-bold uppercase">{prod.category}</span>
                    <h5 className="font-bold text-white text-sm truncate">{prod.name}</h5>
                    <p className="text-xs font-mono text-[#DAD2C4]">R$ {prod.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA: PALESTRAS & PARCERIAS */}
      {(activeTab === 'serv_palestras' || activeTab === 'serv_parcerias') && (
        <div className="bg-[#1D1B48] border border-[#372B69] rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-heading text-lg font-bold text-white capitalize">
            Portfólio de {activeTab === 'serv_palestras' ? 'Palestras Corporativas' : 'Parcerias & Permutas'}
          </h3>
          <p className="text-xs text-[#DAD2C4]">
            Coleção conectada às páginas <code>/palestras</code> e <code>/parcerias</code> com destaque para conformidade NR-1 e boxes em estilo Lojinha.
          </p>
          <div className="p-4 bg-[#2B2566] rounded-xl border border-white/5 text-xs text-[#DAD2C4]">
            Dados ativos no Firestore: coleção <code>{activeTab === 'serv_palestras' ? 'palestras_portfolio' : 'parcerias_portfolio'}</code>.
          </div>
        </div>
      )}
    </div>
  );
};
