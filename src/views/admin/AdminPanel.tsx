/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Painel de Controles (/painel)
 * 
 * Navegação por Menu Lateral Suspenso (Accordion) em 4 Seções:
 * 1. OPERAÇÕES: Calculadora, Agenda, Cadastros
 * 2. SERVIÇOS: Atendimentos, Palestras, Parcerias, Patota, Bússola, Lojinha e frete
 * 3. FLUXOS: Mensagens, Automações, Blog, Pagamentos, Vinculações, Usuários
 * 4. PÁGINAS: Início, Sobre, Atendimentos, Palestras, Parcerias, Bússola, Patota, Leituras, Lojinha
 * 
 * Design: Menu lateral em roxo escuro (#1D1B48/#22205A) e Área Central Toda Clara (#F8F6F2/Branco).
 */

import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Calendar,
  Users,
  Compass,
  Presentation,
  Handshake,
  Sparkles,
  ShoppingBag,
  MessageSquare,
  Mail,
  BookOpen,
  CreditCard,
  Share2,
  Shield,
  Layers,
  LogOut,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Settings2,
  Workflow
} from 'lucide-react';

import { UserProfile, AdminUser } from '../../types';
import { getCurrentUser, loginWithAdminAccount, logoutAdminSession, subscribeAuth } from '../../services/auth';
import { getAdminUsersList } from '../../services/adminUsersService';
import { CRMContactDetail, getCRMContactsList } from '../../services/crmService';
import { AppointmentItem, getAppointmentsList } from '../../services/agendaService';

// Módulos
import { OperationsCalculator } from './modules/OperationsCalculator';
import { OperationsAgenda } from './modules/OperationsAgenda';
import { OperationsCRM } from './modules/OperationsCRM';
import { ServicesManager, ServiceSubTab } from './modules/ServicesManager';
import { FlowsManager, FlowSubTab } from './modules/FlowsManager';
import { PagesManager } from './modules/PagesManager';

export type AdminSectionKey = 'operacoes' | 'servicos' | 'fluxos' | 'paginas';

export type AdminItemKey =
  // Operações
  | 'operacoes_calculadora'
  | 'operacoes_agenda'
  | 'operacoes_cadastros'
  // Serviços
  | 'servicos_atendimentos'
  | 'servicos_palestras'
  | 'servicos_parcerias'
  | 'servicos_patota'
  | 'servicos_bussola'
  | 'servicos_lojinha'
  // Fluxos
  | 'fluxos_mensagens'
  | 'fluxos_automacoes'
  | 'fluxos_blog'
  | 'fluxos_pagamentos'
  | 'fluxos_vinculacoes'
  | 'fluxos_usuarios'
  // Páginas
  | 'paginas_inicio'
  | 'paginas_sobre'
  | 'paginas_atendimentos'
  | 'paginas_palestras'
  | 'paginas_parcerias'
  | 'paginas_bussola'
  | 'paginas_patota'
  | 'paginas_leituras'
  | 'paginas_lojinha';

export const AdminPanel: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getCurrentUser());

  // Item ativo inicial direto na tela (Sem tela de Hub Geral)
  const [activeItem, setActiveItem] = useState<AdminItemKey>('operacoes_cadastros');

  // Estado dos Menus Suspensos / Accordions da Lateral
  const [openSections, setOpenSections] = useState<Record<AdminSectionKey, boolean>>({
    operacoes: true,
    servicos: true,
    fluxos: false,
    paginas: false
  });

  const toggleSection = (section: AdminSectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Dados Operacionais
  const [contacts, setContacts] = useState<CRMContactDetail[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);

  // Login
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [selectedLoginUsername, setSelectedLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const refreshOperationalData = async () => {
    try {
      const [crms, apts] = await Promise.all([getCRMContactsList(), getAppointmentsList()]);
      setContacts(crms);
      setAppointments(apts);
    } catch (err) {
      console.warn('[AdminPanel] Erro ao carregar dados:', err);
    }
  };

  const refreshAdminUsers = async () => {
    try {
      const list = await getAdminUsersList();
      setAdminUsers(list);
      if (list.length > 0 && !selectedLoginUsername) {
        setSelectedLoginUsername(list[0].username);
      }
    } catch (err) {
      console.error('[AdminPanel] Erro ao carregar usuários:', err);
    }
  };

  useEffect(() => {
    const unsub = subscribeAuth((user) => {
      setCurrentUser(user);
    });
    refreshAdminUsers();
    refreshOperationalData();
    return () => unsub();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      if (!selectedLoginUsername) {
        throw new Error('Selecione um usuário no campo Login.');
      }
      if (!loginPassword) {
        throw new Error('Digite a senha para prosseguir.');
      }

      const authenticated = await loginWithAdminAccount(selectedLoginUsername, loginPassword);
      setCurrentUser(authenticated);
      setLoginPassword('');
      await refreshOperationalData();
    } catch (err: any) {
      setLoginError(err?.message || 'Falha ao autenticar. Verifique o usuário e a senha.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // =========================================================================
  // TELA DE LOGIN SIMPLIFICADA (ESTRITAMENTE CONFORME ESPECIFICADO)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="admin-scope min-h-screen bg-[#161438] flex flex-col items-center justify-center p-4">
        <button
          type="button"
          onClick={onNavigateHome}
          title="Voltar para a Página Inicial"
          aria-label="Voltar para a Página Inicial"
          className="mx-auto block mb-6 transition-transform hover:scale-105 cursor-pointer focus:outline-none"
        >
          <img
            src="https://static.wixstatic.com/media/02c8e0_916db28bdef7413a82fde89b9ce7f738~mv2.png"
            alt="Casa 6 — Bianca Tofoli"
            className="h-10 sm:h-12 w-auto object-contain mx-auto"
          />
        </button>

        <div className="w-full max-w-sm sm:max-w-md rounded-3xl bg-[#1D1B48] p-8 sm:p-10 shadow-2xl border border-[#F0B55E]/40 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-heading text-2xl font-bold text-white">
              Painel de Controle
            </h1>
            <p className="text-xs sm:text-sm text-[#DAD2C4] font-medium">
              Área Restrita para Administradores
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <Lock className="h-4 w-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#DAD2C4] uppercase tracking-wider">
                Login
              </label>
              <select
                value={selectedLoginUsername}
                onChange={(e) => setSelectedLoginUsername(e.target.value)}
                className="w-full rounded-xl border border-[#372B69] bg-[#2B2566] px-4 py-3 text-xs sm:text-sm text-white font-medium focus:border-[#F0B55E] focus:outline-none transition-colors cursor-pointer"
              >
                {adminUsers.map((user) => (
                  <option key={user.id} value={user.username} className="bg-[#1D1B48] text-white">
                    {user.username} {user.username.toLowerCase() === 'suporte' ? '(Mestre)' : user.role === 'admin' ? '(Administradora)' : '(Operador)'}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#DAD2C4] uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="Digite sua senha"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#372B69] bg-[#2B2566] pl-4 pr-11 py-3 text-xs sm:text-sm text-white focus:border-[#F0B55E] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  title={showLoginPassword ? 'Ocultar senha' : 'Visualizar senha'}
                  aria-label={showLoginPassword ? 'Ocultar senha' : 'Visualizar senha'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#DAD2C4]/70 hover:text-[#F0B55E] cursor-pointer transition-colors focus:outline-none"
                >
                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F0B55E] to-[#E5A344] hover:brightness-110 text-[#1E1B4B] py-3.5 px-6 text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-lg hover:shadow-xl cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Shield className="h-4 w-4 text-[#1E1B4B]" />
              <span>{isLoggingIn ? 'Entrando...' : 'Entrar no Painel'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PAINEL DE CONTROLE AUTENTICADO
  // Lateral: Roxo Escuro (#1D1B48 / #22205A) com Menus Suspensos
  // Conteúdo Central: Claro (#F8F6F2 / Branco)
  // =========================================================================
  return (
    <div className="admin-scope min-h-screen bg-[#F8F6F2] text-[#22205A] flex flex-col md:flex-row">
      
      {/* MENU LATERAL ESQUERDO (ROXO ESCURO COM MENUS SUSPENSOS) */}
      <aside className="w-full md:w-72 bg-[#1D1B48] text-white border-r border-[#372B69] flex flex-col shrink-0">
        
        {/* Topo com Logo e Perfil */}
        <div className="p-4 border-b border-[#372B69] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://static.wixstatic.com/media/02c8e0_916db28bdef7413a82fde89b9ce7f738~mv2.png"
              alt="Casa 6"
              className="h-7 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
              onClick={onNavigateHome}
              title="Ir para o Website"
            />
            <div>
              <div className="text-[10px] text-[#F0B55E] font-bold uppercase tracking-wider">
                Painel de Controle
              </div>
              <div className="text-xs font-bold text-white capitalize truncate max-w-[120px]">
                {currentUser.displayName}
              </div>
            </div>
          </div>

          <button
            onClick={() => logoutAdminSession()}
            title="Encerrar Sessão"
            aria-label="Encerrar Sessão"
            className="p-1.5 rounded-lg hover:bg-[#2B2566] text-[#DAD2C4] hover:text-[#F0B55E] cursor-pointer transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* NAVEGAÇÃO POR SEÇÕES E MENUS SUSPENSOS */}
        <nav className="p-3 space-y-3 flex-1 text-xs overflow-y-auto">
          
          {/* ==========================================
              SEÇÃO 1: OPERAÇÕES (Ícone Grande & Accordion)
              ========================================== */}
          <div className="rounded-xl bg-[#22205A]/70 border border-[#372B69] overflow-hidden">
            <button
              onClick={() => toggleSection('operacoes')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-[#2B2566] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#2B2566] text-[#F0B55E] border border-[#F0B55E]/30">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-xs uppercase tracking-wider text-white">
                    OPERAÇÕES
                  </h3>
                  <span className="text-[10px] text-[#DAD2C4]/70">Calculadora, Agenda & CRM</span>
                </div>
              </div>
              {openSections.operacoes ? (
                <ChevronDown className="h-4 w-4 text-[#F0B55E]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[#DAD2C4]" />
              )}
            </button>

            {openSections.operacoes && (
              <div className="px-2 pb-2 space-y-1 border-t border-[#372B69] pt-2">
                <button
                  onClick={() => setActiveItem('operacoes_calculadora')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    activeItem === 'operacoes_calculadora'
                      ? 'bg-[#F0B55E] text-[#1E1B4B] font-bold shadow-2xs'
                      : 'text-[#DAD2C4] hover:bg-[#2B2566] hover:text-white'
                  }`}
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>Calculadora</span>
                </button>

                <button
                  onClick={() => setActiveItem('operacoes_agenda')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    activeItem === 'operacoes_agenda'
                      ? 'bg-[#F0B55E] text-[#1E1B4B] font-bold shadow-2xs'
                      : 'text-[#DAD2C4] hover:bg-[#2B2566] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Agenda</span>
                  </div>
                  {appointments.length > 0 && (
                    <span className="text-[9px] bg-[#372B69] text-white px-1.5 py-0.2 rounded-full font-mono">
                      {appointments.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveItem('operacoes_cadastros')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    activeItem === 'operacoes_cadastros'
                      ? 'bg-[#F0B55E] text-[#1E1B4B] font-bold shadow-2xs'
                      : 'text-[#DAD2C4] hover:bg-[#2B2566] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="h-3.5 w-3.5" />
                    <span>Cadastros</span>
                  </div>
                  {contacts.length > 0 && (
                    <span className="text-[9px] bg-[#F0B55E] text-[#1E1B4B] px-1.5 py-0.2 rounded-full font-bold">
                      {contacts.length}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ==========================================
              SEÇÃO 2: SERVIÇOS (Apenas "Serviços" com Ícone Grande)
              ========================================== */}
          <div className="rounded-xl bg-[#22205A]/70 border border-[#372B69] overflow-hidden">
            <button
              onClick={() => toggleSection('servicos')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-[#2B2566] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#2B2566] text-[#F0B55E] border border-[#F0B55E]/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-xs uppercase tracking-wider text-white">
                    SERVIÇOS
                  </h3>
                  <span className="text-[10px] text-[#DAD2C4]/70">Catálogo & Preços</span>
                </div>
              </div>
              {openSections.servicos ? (
                <ChevronDown className="h-4 w-4 text-[#F0B55E]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[#DAD2C4]" />
              )}
            </button>

            {openSections.servicos && (
              <div className="px-2 pb-2 space-y-1 border-t border-[#372B69] pt-2">
                {[
                  { id: 'servicos_atendimentos', label: 'Atendimentos', icon: Compass },
                  { id: 'servicos_palestras', label: 'Palestras', icon: Presentation },
                  { id: 'servicos_parcerias', label: 'Parcerias', icon: Handshake },
                  { id: 'servicos_patota', label: 'Patota', icon: Sparkles },
                  { id: 'servicos_bussola', label: 'Bússola', icon: Compass },
                  { id: 'servicos_lojinha', label: 'Lojinha e frete', icon: ShoppingBag }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveItem(item.id as AdminItemKey)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#F0B55E] text-[#1E1B4B] font-bold shadow-2xs'
                          : 'text-[#DAD2C4] hover:bg-[#2B2566] hover:text-white'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ==========================================
              SEÇÃO 3: FLUXOS (Apenas "Fluxos" com Ícone Grande)
              ========================================== */}
          <div className="rounded-xl bg-[#22205A]/70 border border-[#372B69] overflow-hidden">
            <button
              onClick={() => toggleSection('fluxos')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-[#2B2566] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#2B2566] text-[#F0B55E] border border-[#F0B55E]/30">
                  <Workflow className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-xs uppercase tracking-wider text-white">
                    FLUXOS
                  </h3>
                  <span className="text-[10px] text-[#DAD2C4]/70">Integrações & Conexões</span>
                </div>
              </div>
              {openSections.fluxos ? (
                <ChevronDown className="h-4 w-4 text-[#F0B55E]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[#DAD2C4]" />
              )}
            </button>

            {openSections.fluxos && (
              <div className="px-2 pb-2 space-y-1 border-t border-[#372B69] pt-2">
                {[
                  { id: 'fluxos_mensagens', label: 'Mensagens', icon: MessageSquare },
                  { id: 'fluxos_automacoes', label: 'Automações', icon: Mail },
                  { id: 'fluxos_blog', label: 'Blog', icon: BookOpen },
                  { id: 'fluxos_pagamentos', label: 'Pagamentos', icon: CreditCard },
                  { id: 'fluxos_vinculacoes', label: 'Vinculações', icon: Share2 },
                  { id: 'fluxos_usuarios', label: 'Usuários', icon: Shield }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveItem(item.id as AdminItemKey)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#F0B55E] text-[#1E1B4B] font-bold shadow-2xs'
                          : 'text-[#DAD2C4] hover:bg-[#2B2566] hover:text-white'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ==========================================
              SEÇÃO 4: PÁGINAS (Apenas "Páginas" com Ícone Grande)
              ========================================== */}
          <div className="rounded-xl bg-[#22205A]/70 border border-[#372B69] overflow-hidden">
            <button
              onClick={() => toggleSection('paginas')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-[#2B2566] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#2B2566] text-[#F0B55E] border border-[#F0B55E]/30">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-xs uppercase tracking-wider text-white">
                    PÁGINAS
                  </h3>
                  <span className="text-[10px] text-[#DAD2C4]/70">CMS das 9 Páginas</span>
                </div>
              </div>
              {openSections.paginas ? (
                <ChevronDown className="h-4 w-4 text-[#F0B55E]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[#DAD2C4]" />
              )}
            </button>

            {openSections.paginas && (
              <div className="px-2 pb-2 space-y-1 border-t border-[#372B69] pt-2">
                {[
                  { id: 'paginas_inicio', label: 'Início', slug: 'inicio' },
                  { id: 'paginas_sobre', label: 'Sobre', slug: 'sobre' },
                  { id: 'paginas_atendimentos', label: 'Atendimentos', slug: 'atendimentos' },
                  { id: 'paginas_palestras', label: 'Palestras', slug: 'palestras' },
                  { id: 'paginas_parcerias', label: 'Parcerias', slug: 'parcerias' },
                  { id: 'paginas_bussola', label: 'Bússola', slug: 'bussola' },
                  { id: 'paginas_patota', label: 'Patota', slug: 'patota' },
                  { id: 'paginas_leituras', label: 'Leituras', slug: 'leituras' },
                  { id: 'paginas_lojinha', label: 'Lojinha', slug: 'lojinha' }
                ].map((item) => {
                  const isActive = activeItem === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveItem(item.id as AdminItemKey)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#F0B55E] text-[#1E1B4B] font-bold shadow-2xs'
                          : 'text-[#DAD2C4] hover:bg-[#2B2566] hover:text-white'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F0B55E]" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Rodapé da Sidebar */}
        <div className="p-3 border-t border-[#372B69] text-[10px] text-[#DAD2C4] space-y-1">
          <p>Casa 6 &bull; Plataforma Oficial</p>
          <button
            onClick={onNavigateHome}
            className="text-[#F0B55E] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Website Público</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL (TODA CLARA COM FUNDO #F8F6F2) */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-[#F8F6F2]">
        
        {/* ROTEAMENTO DIRETO DOS ITENS (SEM TELA DE HUB GERAL) */}
        {activeItem === 'operacoes_calculadora' && <OperationsCalculator />}
        {activeItem === 'operacoes_agenda' && <OperationsAgenda />}
        {activeItem === 'operacoes_cadastros' && <OperationsCRM />}

        {/* Serviços */}
        {activeItem === 'servicos_atendimentos' && <ServicesManager initialSubTab="serv_atendimentos" />}
        {activeItem === 'servicos_palestras' && <ServicesManager initialSubTab="serv_palestras" />}
        {activeItem === 'servicos_parcerias' && <ServicesManager initialSubTab="serv_parcerias" />}
        {activeItem === 'servicos_patota' && <ServicesManager initialSubTab="serv_patota" />}
        {activeItem === 'servicos_bussola' && <ServicesManager initialSubTab="serv_bussola" />}
        {activeItem === 'servicos_lojinha' && <ServicesManager initialSubTab="serv_lojinha" />}

        {/* Fluxos */}
        {activeItem === 'fluxos_mensagens' && <FlowsManager initialSubTab="fluxo_mensagens" currentUser={currentUser} />}
        {activeItem === 'fluxos_automacoes' && <FlowsManager initialSubTab="fluxo_automacoes" currentUser={currentUser} />}
        {activeItem === 'fluxos_blog' && <FlowsManager initialSubTab="fluxo_blog" currentUser={currentUser} />}
        {activeItem === 'fluxos_pagamentos' && <FlowsManager initialSubTab="fluxo_pagamento" currentUser={currentUser} />}
        {activeItem === 'fluxos_vinculacoes' && <FlowsManager initialSubTab="fluxo_vinculacoes" currentUser={currentUser} />}
        {activeItem === 'fluxos_usuarios' && <FlowsManager initialSubTab="fluxo_acessos" currentUser={currentUser} />}

        {/* Páginas */}
        {activeItem.startsWith('paginas_') && (
          <PagesManager initialSlug={activeItem.replace('paginas_', '')} />
        )}
      </main>
    </div>
  );
};
