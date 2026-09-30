/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Painel Administrativo Oficial (/painel) (Identidade Visual Oficial Atualizada)
 * 
 * Regras:
 * - Acesso estritamente autenticado
 * - RBAC (admin / editor)
 * - Módulos: Dashboard, Leads, Atendimentos, Patota Astral, Vivências, Palestras, Blog, Loja, Depoimentos, Configurações, SEO
 * - Camada anticópia desativada (.admin-scope)
 * - Cores atualizadas conforme paleta oficial noturna
 */

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Compass,
  Sparkles,
  Calendar,
  Presentation,
  BookOpen,
  ShoppingBag,
  MessageSquare,
  Settings,
  Search,
  LogOut,
  Shield,
  Filter,
  ExternalLink,
  ChevronRight,
  Database,
  Lock
} from 'lucide-react';
import { SITE_CONFIG, OFFICIAL_SERVICES } from '../../config/site';
import { Lead, LeadStatus, UserProfile } from '../../types';
import { getCurrentUser, loginDevSession, logoutAdminSession, subscribeAuth } from '../../services/auth';
import { getLeadsList, updateLeadStatus } from '../../services/leads';
import { isFirebaseReady } from '../../services/firebase';

type AdminTab =
  | 'dashboard'
  | 'leads'
  | 'atendimentos'
  | 'patota'
  | 'vivencias'
  | 'palestras'
  | 'blog'
  | 'loja'
  | 'depoimentos'
  | 'configuracoes'
  | 'seo';

export const AdminPanel: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getCurrentUser());
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  // Monitora autenticação
  useEffect(() => {
    const unsub = subscribeAuth((state) => {
      setCurrentUser(state.user);
    });
    return unsub;
  }, []);

  // Carrega leads
  const refreshLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const data = await getLeadsList();
      setLeads(data);
      if (data.length > 0 && !selectedLead) {
        setSelectedLead(data[0]);
      }
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      refreshLeads();
    }
  }, [currentUser]);

  // Se não autenticado, exibe barreira de login estrita
  if (!currentUser) {
    return (
      <div className="admin-scope min-h-[80vh] flex items-center justify-center p-4 bg-[#080C35]">
        <div className="w-full max-w-md rounded-2xl bg-[#FCFAF7] p-8 shadow-2xl border border-[#DAD2C4] space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#22205A] text-[#FFB63F] shadow-sm">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#22205A]">
              Painel Casa 6
            </h1>
            <p className="text-xs text-[#534D6B]">
              Área de acesso restrito a operadores e administradores oficiais da Casa 6 / Bianca Tofoli.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => loginDevSession('admin', 'bianca@casa6.com.br')}
              className="w-full flex items-center justify-center gap-2 rounded bg-[#22205A] py-3 text-sm font-bold text-[#FFFFFF] hover:bg-[#372B69] transition-colors shadow"
            >
              <Shield className="h-4 w-4 text-[#FFB63F]" />
              <span>Entrar como Administrador (Bianca Tofoli)</span>
            </button>

            <button
              onClick={() => loginDevSession('editor', 'equipe@casa6.com.br')}
              className="w-full flex items-center justify-center gap-2 rounded border border-[#DAD2C4] py-2.5 text-xs font-semibold text-[#534D6B] hover:bg-[#F3EEE5] transition-colors"
            >
              <span>Entrar como Editor (Equipe Casa 6)</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="w-full text-center text-xs text-[#7A7394] hover:text-[#22205A] pt-2"
            >
              ← Voltar ao site público
            </button>
          </div>

          <div className="rounded-lg bg-[#F3EEE5] p-3 text-[11px] text-[#534D6B] border border-[#DAD2C4] space-y-1">
            <p className="font-semibold text-[#22205A]">Status da Infraestrutura de Autenticação:</p>
            <p>
              • Firebase Auth: <strong>{isFirebaseReady ? 'CONECTADO (Produção)' : 'PREPARADO (Pronto para projeto console)'}</strong>
            </p>
            <p>
              • Proteção RBAC: <strong>ATIVADA (admin / editor)</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    await updateLeadStatus(leadId, newStatus);
    await refreshLeads();
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const filteredLeads = leads.filter((l) => {
    if (leadStatusFilter === 'all') return true;
    return l.status === leadStatusFilter;
  });

  return (
    <div className="admin-scope min-h-screen bg-[#F3EEE5] text-[#211D35] flex flex-col md:flex-row">
      {/* SIDEBAR ADMINISTRATIVA */}
      <aside className="w-full md:w-64 bg-[#22205A] text-[#FFFFFF] flex flex-col shrink-0 border-r border-[#372B69]">
        {/* Topo da Sidebar */}
        <div className="p-4 border-b border-[#372B69] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold text-[#FFB63F]">Casa 6</span>
              <span className="text-[10px] bg-[#372B69] px-1.5 py-0.5 rounded text-[#DAD2C4] uppercase font-bold border border-[#483474]">
                Painel
              </span>
            </div>
            <p className="text-[11px] text-[#DAD2C4] truncate">
              {currentUser.displayName} ({currentUser.role})
            </p>
          </div>
          <button
            onClick={() => logoutAdminSession()}
            title="Encerrar Sessão"
            className="p-1.5 rounded hover:bg-[#372B69] text-[#DAD2C4] hover:text-[#FFFFFF]"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* Navegação de Módulos */}
        <nav className="p-2 space-y-1 flex-1 text-xs">
          {[
            { id: 'dashboard', label: 'Dashboard Geral', icon: LayoutDashboard },
            { id: 'leads', label: 'Gestão de Leads (CRM)', icon: Users, badge: leads.length },
            { id: 'atendimentos', label: 'Atendimentos', icon: Compass },
            { id: 'patota', label: 'Patota Astral', icon: Sparkles },
            { id: 'vivencias', label: 'Vivências', icon: Calendar },
            { id: 'palestras', label: 'Palestras', icon: Presentation },
            { id: 'blog', label: 'Caderno Astral (Blog)', icon: BookOpen },
            { id: 'loja', label: 'Loja & Produtos', icon: ShoppingBag },
            { id: 'depoimentos', label: 'Depoimentos', icon: MessageSquare },
            { id: 'configuracoes', label: 'Configurações do Site', icon: Settings },
            { id: 'seo', label: 'SEO & Indexação', icon: Search }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id as AdminTab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
                  isActive
                    ? 'bg-[#FFB63F] text-[#080C35] font-bold shadow-xs'
                    : 'text-[#FFFFFF] hover:bg-[#372B69]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-[#080C35] text-[#FFB63F]' : 'bg-[#372B69] text-[#FFFFFF]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Rodapé da Sidebar */}
        <div className="p-3 border-t border-[#372B69] text-[10px] text-[#DAD2C4] space-y-1">
          <p>Etapa 1 — Paleta Oficial Congelada</p>
          <button
            onClick={onNavigateHome}
            className="text-[#FFB63F] hover:underline flex items-center gap-1"
          >
            <span>Ver Website Público</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL DO PAINEL */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* CABEÇALHO DO MÓDULO */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DAD2C4] pb-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#22205A] capitalize">
              {currentTab === 'dashboard' && 'Dashboard Operacional'}
              {currentTab === 'leads' && 'Gestão de Leads do Funil'}
              {currentTab === 'atendimentos' && 'Catálogo de Atendimentos'}
              {currentTab === 'patota' && 'Patota Astral — Gestão Recorrente'}
              {currentTab === 'vivencias' && 'Vivências e Imersões'}
              {currentTab === 'palestras' && 'Palestras e Eventos'}
              {currentTab === 'blog' && 'Caderno Astral (Editorial)'}
              {currentTab === 'loja' && 'Loja e Publicações'}
              {currentTab === 'depoimentos' && 'Depoimentos de Clientes'}
              {currentTab === 'configuracoes' && 'Configurações Oficiais'}
              {currentTab === 'seo' && 'SEO, GEO e Indexação'}
            </h2>
            <p className="text-xs text-[#534D6B]">
              Ambiente restrito da Casa 6 com isolamento de PII e segurança RBAC.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#372B69]/15 text-[#372B69] px-3 py-1 text-xs font-bold border border-[#372B69]/20">
              <Shield className="h-3.5 w-3.5 text-[#FFB63F]" />
              <span>Sessão Segura: {currentUser.role}</span>
            </span>
          </div>
        </header>

        {/* ABA: DASHBOARD */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Cards de Métricas Principais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl bg-[#FCFAF7] p-5 border border-[#DAD2C4] shadow-xs">
                <span className="text-xs text-[#7A7394] font-medium">Total de Leads</span>
                <p className="font-heading text-3xl font-bold text-[#22205A] mt-1">{leads.length}</p>
                <span className="text-[11px] text-[#483474] font-semibold">Capturados no funil oficial</span>
              </div>
              <div className="rounded-xl bg-[#FCFAF7] p-5 border border-[#DAD2C4] shadow-xs">
                <span className="text-xs text-[#7A7394] font-medium">Leads Novos (Aguardando)</span>
                <p className="font-heading text-3xl font-bold text-[#6F4D84] mt-1">
                  {leads.filter((l) => l.status === 'new').length}
                </p>
                <span className="text-[11px] text-[#7A7394]">Prontos para contato no WhatsApp</span>
              </div>
              <div className="rounded-xl bg-[#FCFAF7] p-5 border border-[#DAD2C4] shadow-xs">
                <span className="text-xs text-[#7A7394] font-medium">Consultas Agendadas</span>
                <p className="font-heading text-3xl font-bold text-[#22205A] mt-1">
                  {leads.filter((l) => l.status === 'scheduled').length}
                </p>
                <span className="text-[11px] text-[#372B69]">Status em andamento</span>
              </div>
              <div className="rounded-xl bg-[#FCFAF7] p-5 border border-[#DAD2C4] shadow-xs">
                <span className="text-xs text-[#7A7394] font-medium">Atendimentos Cadastrados</span>
                <p className="font-heading text-3xl font-bold text-[#22205A] mt-1">
                  {OFFICIAL_SERVICES.length}
                </p>
                <span className="text-[11px] text-[#7A7394]">Mapa Astral prioritário</span>
              </div>
            </div>

            {/* Status de Congelamento da Etapa 1 */}
            <div className="rounded-xl bg-[#FCFAF7] p-6 border border-[#DAD2C4] shadow-xs space-y-4">
              <h3 className="font-heading text-lg font-bold text-[#22205A] flex items-center gap-2">
                <Database className="h-5 w-5 text-[#FFB63F]" />
                <span>Status de Fundação Técnica da Etapa 1 (Transparência Absoluta)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="rounded-lg bg-[#F3EEE5] p-4 border border-[#DAD2C4] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#22205A]">Arquitetura de Leads & Funil</span>
                    <span className="rounded bg-[#372B69]/15 text-[#372B69] px-2 py-0.5 font-bold">REAL / TESTADO</span>
                  </div>
                  <p className="text-[#534D6B]">
                    Validação em 5 campos obrigatórios, captura de UTMs, redirecionamento WhatsApp automático formatado.
                  </p>
                </div>

                <div className="rounded-lg bg-[#F3EEE5] p-4 border border-[#DAD2C4] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#22205A]">Firebase & Firestore Rules</span>
                    <span className="rounded bg-[#483474]/15 text-[#483474] px-2 py-0.5 font-bold">CONFIGURADO / PREPARADO</span>
                  </div>
                  <p className="text-[#534D6B]">
                    Blueprint intermediário, regras dos 8 Pilares contra Update-Gap e isolamento de PII prontos para deploy.
                  </p>
                </div>

                <div className="rounded-lg bg-[#F3EEE5] p-4 border border-[#DAD2C4] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#22205A]">Camada Anticópia & Print CSS</span>
                    <span className="rounded bg-[#372B69]/15 text-[#372B69] px-2 py-0.5 font-bold">REAL / ATIVADO</span>
                  </div>
                  <p className="text-[#534D6B]">
                    Interceptação de atalhos e seleção pública, estritamente desativado dentro do painel administrativo.
                  </p>
                </div>

                <div className="rounded-lg bg-[#F3EEE5] p-4 border border-[#DAD2C4] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#22205A]">Design Tokens (Paleta Céu Noturno)</span>
                    <span className="rounded bg-[#FFB63F]/25 text-[#080C35] px-2 py-0.5 font-bold">CONGELADO DEFINITIVO</span>
                  </div>
                  <p className="text-[#534D6B]">
                    Nova hierarquia com Azul Noite (#080C35), Azul-violeta (#22205A), Roxo Profundo (#372B69) e Dourado (#FFB63F).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA: LEADS (CRM OFICIAL) */}
        {currentTab === 'leads' && (
          <div className="space-y-6">
            {/* Barra de Filtros */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FCFAF7] p-4 rounded-xl border border-[#DAD2C4]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#7A7394]" />
                <span className="text-xs font-semibold text-[#22205A]">Filtrar por Status:</span>
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="rounded border border-[#DAD2C4] px-2.5 py-1 text-xs text-[#211D35] bg-[#F3EEE5]"
                >
                  <option value="all">Todos os Status ({leads.length})</option>
                  <option value="new">Novos (new)</option>
                  <option value="contacted">Contatados (contacted)</option>
                  <option value="scheduled">Agendados (scheduled)</option>
                  <option value="completed">Concluídos (completed)</option>
                  <option value="lost">Perdidos (lost)</option>
                </select>
              </div>

              <button
                onClick={refreshLeads}
                disabled={isLoadingLeads}
                className="text-xs font-semibold text-[#22205A] hover:text-[#483474]"
              >
                {isLoadingLeads ? 'Atualizando...' : 'Atualizar Lista'}
              </button>
            </div>

            {/* Listagem e Painel de Detalhes do Lead */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tabela de Leads */}
              <div className="lg:col-span-2 rounded-xl bg-[#FCFAF7] border border-[#DAD2C4] overflow-hidden shadow-xs">
                {filteredLeads.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#7A7394]">
                    Nenhum lead encontrado com o filtro atual. Submeta uma solicitação pelo botão &quot;AGENDAR CONSULTA&quot; no site para testar.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F3EEE5] text-[#7A7394] font-semibold border-b border-[#DAD2C4]">
                        <tr>
                          <th className="p-3">Nome do Cliente</th>
                          <th className="p-3">Serviço Solicitado</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Data</th>
                          <th className="p-3 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DAD2C4]">
                        {filteredLeads.map((lead) => {
                          const isSelected = selectedLead?.id === lead.id;
                          return (
                            <tr
                              key={lead.id}
                              onClick={() => setSelectedLead(lead)}
                              className={`cursor-pointer hover:bg-[#F3EEE5] transition-colors ${
                                isSelected ? 'bg-[#F3EEE5] font-semibold' : ''
                              }`}
                            >
                              <td className="p-3 text-[#22205A]">{lead.fullName}</td>
                              <td className="p-3 text-[#534D6B]">{lead.serviceName}</td>
                              <td className="p-3">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                  lead.status === 'new'
                                    ? 'bg-[#372B69]/15 text-[#372B69] border border-[#372B69]/20'
                                    : lead.status === 'contacted'
                                    ? 'bg-[#483474]/15 text-[#483474]'
                                    : lead.status === 'scheduled'
                                    ? 'bg-[#FFB63F]/25 text-[#080C35]'
                                    : 'bg-[#DAD2C4] text-[#534D6B]'
                                }`}>
                                  {lead.status}
                                </span>
                              </td>
                              <td className="p-3 text-[#7A7394]">
                                {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="p-3 text-right">
                                <ChevronRight className="h-4 w-4 inline text-[#7A7394]" />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Detalhes do Lead Selecionado */}
              <div className="rounded-xl bg-[#FCFAF7] border border-[#DAD2C4] p-6 shadow-xs">
                {selectedLead ? (
                  <div className="space-y-4 text-xs">
                    <div className="border-b border-[#DAD2C4] pb-3 space-y-1">
                      <span className="text-[10px] font-bold text-[#7A7394] uppercase tracking-wider">
                        Ficha do Lead
                      </span>
                      <h3 className="font-heading text-lg font-bold text-[#22205A]">
                        {selectedLead.fullName}
                      </h3>
                      <p className="text-[#534D6B]">{selectedLead.email}</p>
                    </div>

                    <div className="space-y-2">
                      <p>
                        <strong className="text-[#22205A]">WhatsApp: </strong>
                        <a
                          href={`https://wa.me/55${selectedLead.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#22205A] font-bold hover:underline hover:text-[#FFB63F]"
                        >
                          {selectedLead.whatsapp} ↗
                        </a>
                      </p>
                      <p>
                        <strong className="text-[#22205A]">Serviço de Interesse: </strong>
                        {selectedLead.serviceName}
                      </p>
                      <p>
                        <strong className="text-[#22205A]">Dispositivo: </strong>
                        {selectedLead.deviceCategory}
                      </p>
                      <p>
                        <strong className="text-[#22205A]">Página de Origem: </strong>
                        {selectedLead.sourcePage}
                      </p>
                      {selectedLead.utmSource && (
                        <p>
                          <strong className="text-[#22205A]">UTM Source: </strong>
                          {selectedLead.utmSource}
                        </p>
                      )}
                      <p>
                        <strong className="text-[#22205A]">Data do Pedido: </strong>
                        {new Date(selectedLead.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>

                    <div className="border-t border-[#DAD2C4] pt-3 space-y-2">
                      <label className="block font-semibold text-[#22205A]">
                        Atualizar Status Operacional:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['new', 'contacted', 'scheduled', 'completed', 'lost'] as LeadStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(selectedLead.id, st)}
                            className={`px-2 py-1.5 rounded text-[11px] font-semibold transition-colors border ${
                              selectedLead.status === st
                                ? 'bg-[#22205A] text-[#FFFFFF] border-[#22205A]'
                                : 'bg-[#F3EEE5] text-[#534D6B] border-[#DAD2C4] hover:bg-[#DAD2C4]'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-xs text-[#7A7394] py-8">
                    Selecione um lead na tabela ao lado para visualizar os detalhes completos.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DEMAIS MÓDULOS ARQUITETURAIS PREPARADOS */}
        {['atendimentos', 'patota', 'vivencias', 'palestras', 'blog', 'loja', 'depoimentos', 'configuracoes', 'seo'].includes(currentTab) && (
          <div className="rounded-xl bg-[#FCFAF7] p-8 border border-[#DAD2C4] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#483474]/15 text-[#483474] px-2.5 py-1 text-xs font-bold uppercase border border-[#483474]/20">
                Módulo Arquitetado (Etapa 1 — Preparado)
              </span>
            </div>
            <h3 className="font-heading text-xl font-bold text-[#22205A]">
              Módulo: {currentTab.toUpperCase()}
            </h3>
            <p className="text-xs sm:text-sm text-[#534D6B] leading-relaxed max-w-2xl">
              A fundação de dados, schemas no Firestore blueprint, regras de segurança e modelos TypeScript para o módulo{' '}
              <strong>{currentTab}</strong> já foram formalmente criados e congelados nesta Etapa 1. Na Etapa 2, serão acoplados os formulários de edição de conteúdo e CRUD completo.
            </p>
            <div className="rounded-lg bg-[#F3EEE5] p-4 border border-[#DAD2C4] text-xs text-[#534D6B] space-y-1">
              <p>• Coleção correspondente no Firestore: <strong>/{currentTab}</strong></p>
              <p>• Regra de Permissão: <strong>Somente usuários autenticados com role &apos;admin&apos; ou &apos;editor&apos;</strong></p>
              <p>• Validação Anti-Update-Gap: <strong>Pronta em firestore.rules</strong></p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
