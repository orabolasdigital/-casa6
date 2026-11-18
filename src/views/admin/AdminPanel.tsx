/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Painel de Controles (/painel)
 * 
 * Arquitetura em 4 Seções Centrais (Baseada na especificação do projeto e referência visual):
 * 1. OPERAÇÕES: Calculadora Astral (Bússola Pessoal), Agenda Atendimentos (Google Calendar Sync) & Cadastros (CRM Master).
 * 2. SERVIÇOS: Atendimentos, Palestras, Parcerias, Patota, Bússola, Lojinha (com gestão de frete fixo/km/estado).
 * 3. FLUXOS: Mensagens WhatsApp com variáveis, Automações de e-mail/alertas, Blog Caderno Astral, Mercado Pago, Pixels & Acessos RBAC.
 * 4. PÁGINAS: CMS completo de 9 páginas com restauração instantânea aos padrões originais.
 * 
 * Estrutura de Acesso e Permissões (RBAC):
 * - Suporte (Master): Não pode ser removido, alterado ou ajustado. Mestre do sistema.
 * - Bianca (Administradora): Pode inserir, excluir, alterar nomes e senhas de outros membros (inclusive Caio).
 * - Caio (Operador Básico): Acesso a todas as funções operacionais, mas não pode inserir nem excluir usuários; pode alterar apenas seu próprio nome e senha.
 */

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
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
  ChevronRight,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { UserProfile, AdminUser } from '../../types';
import { getCurrentUser, loginWithAdminAccount, logoutAdminSession, subscribeAuth } from '../../services/auth';
import { getAdminUsersList } from '../../services/adminUsersService';
import { CRMContactDetail, getCRMContactsList } from '../../services/crmService';
import { AppointmentItem, getAppointmentsList } from '../../services/agendaService';

// Componentes dos Módulos do Hub
import { AdminHubGrid, SectionKey, ItemKey } from './components/AdminHubGrid';
import { OperationsCalculator } from './modules/OperationsCalculator';
import { OperationsAgenda } from './modules/OperationsAgenda';
import { OperationsCRM } from './modules/OperationsCRM';
import { ServicesManager, ServiceSubTab } from './modules/ServicesManager';
import { FlowsManager, FlowSubTab } from './modules/FlowsManager';
import { PagesManager, PageSlug } from './modules/PagesManager';

export const AdminPanel: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getCurrentUser());

  // Estados de Navegação do Hub (Nulo = Exibe o Hub Visual de Cartões)
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);
  const [activeItem, setActiveItem] = useState<ItemKey | null>(null);

  // Dados Operacionais Carregados para Contadores & Cruzes
  const [contacts, setContacts] = useState<CRMContactDetail[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);

  // Estados dos Usuários Administradores para Login
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [selectedLoginUsername, setSelectedLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Carregamento inicial de dados
  const refreshOperationalData = async () => {
    try {
      const [crms, apts] = await Promise.all([getCRMContactsList(), getAppointmentsList()]);
      setContacts(crms);
      setAppointments(apts);
    } catch (err) {
      console.warn('[AdminPanel] Erro ao carregar dados operacionais:', err);
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

  // Handler de Login
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

  // Handler de Seleção no Hub Visual
  const handleSelectHubItem = (section: SectionKey, item: ItemKey) => {
    setActiveSection(section);
    setActiveItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHub = () => {
    setActiveSection(null);
    setActiveItem(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =========================================================================
  // TELA DE LOGIN SIMPLIFICADA (ESTRITAMENTE CONFORME ESPECIFICADO)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="admin-scope min-h-screen bg-[#161438] flex flex-col items-center justify-center p-4">
        {/* Logo da Casa 6 no topo clicável para retornar à página inicial */}
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

        {/* Janela de Login Simplificada */}
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
            {/* Campo Login: Caixa Suspensa (Dropdown) */}
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

            {/* Campo Senha com Olhinho Lateral */}
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
  // PAINEL DE CONTROLE AUTENTICADO (COSMIC CASA 6 THEME COM 4 SEÇÕES)
  // =========================================================================
  const isMasterUser = currentUser.role === 'master';
  const isAdminUser = currentUser.role === 'admin' || isMasterUser;

  return (
    <div className="admin-scope min-h-screen bg-[#161438] text-white flex flex-col md:flex-row">
      
      {/* SIDEBAR ADMINISTRATIVA */}
      <aside className="w-full md:w-64 bg-[#1D1B48] border-r border-[#372B69] flex flex-col shrink-0">
        
        {/* Topo da Sidebar: Logo & Usuário Logado */}
        <div className="p-4 border-b border-[#372B69] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://static.wixstatic.com/media/02c8e0_916db28bdef7413a82fde89b9ce7f738~mv2.png"
              alt="Casa 6"
              className="h-7 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
              onClick={handleBackToHub}
              title="Ir para o Hub Geral"
            />
            <div>
              <div className="text-[10px] text-[#F0B55E] font-bold uppercase tracking-wider">
                Painel Master
              </div>
              <div className="text-xs font-bold text-white capitalize truncate max-w-[110px]">
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

        {/* Navegação Rápida entre Seções & Itens */}
        <nav className="p-3 space-y-4 flex-1 text-xs overflow-y-auto">
          
          {/* Botão de Retorno ao Hub Geral */}
          <button
            onClick={handleBackToHub}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeItem === null
                ? 'bg-[#F0B55E] text-[#1E1B4B] shadow-md'
                : 'text-white hover:bg-[#2B2566]'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Hub Principal (Visão Geral)</span>
          </button>

          {/* 1. SEÇÃO OPERAÇÕES */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#F0B55E] flex items-center justify-between">
              <span>Operações</span>
              <span className="text-[9px] text-[#DAD2C4]/70">Coração</span>
            </div>

            <button
              onClick={() => handleSelectHubItem('operacoes', 'calculadora')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeItem === 'calculadora' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calculator className="h-3.5 w-3.5" />
                <span>Calculadora Astral</span>
              </div>
            </button>

            <button
              onClick={() => handleSelectHubItem('operacoes', 'agenda')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeItem === 'agenda' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Agenda Atendimentos</span>
              </div>
              {appointments.length > 0 && (
                <span className="text-[10px] bg-[#372B69] px-1.5 py-0.2 rounded-full text-white font-mono">
                  {appointments.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleSelectHubItem('operacoes', 'cadastros')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeItem === 'cadastros' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5" />
                <span>Cadastros (CRM)</span>
              </div>
              {contacts.length > 0 && (
                <span className="text-[10px] bg-[#F0B55E] text-[#1E1B4B] px-1.5 py-0.2 rounded-full font-bold">
                  {contacts.length}
                </span>
              )}
            </button>
          </div>

          {/* 2. SEÇÃO SERVIÇOS */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#F0B55E]">
              Serviços & Catálogo
            </div>

            <button
              onClick={() => handleSelectHubItem('servicos', 'serv_atendimentos')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeItem === 'serv_atendimentos' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Atendimentos</span>
            </button>

            <button
              onClick={() => handleSelectHubItem('servicos', 'serv_palestras')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeItem === 'serv_palestras' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <Presentation className="h-3.5 w-3.5" />
              <span>Palestras (NR-1)</span>
            </button>

            <button
              onClick={() => handleSelectHubItem('servicos', 'serv_parcerias')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeItem === 'serv_parcerias' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <Handshake className="h-3.5 w-3.5" />
              <span>Parcerias</span>
            </button>

            <button
              onClick={() => handleSelectHubItem('servicos', 'serv_patota')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeItem === 'serv_patota' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Patota (R$ 47/mês)</span>
            </button>

            <button
              onClick={() => handleSelectHubItem('servicos', 'serv_bussola')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeItem === 'serv_bussola' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Bússolas (R$ 47)</span>
            </button>

            <button
              onClick={() => handleSelectHubItem('servicos', 'serv_lojinha')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeItem === 'serv_lojinha' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Lojinha & Frete</span>
            </button>
          </div>

          {/* 3. SEÇÃO FLUXOS */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#F0B55E]">
              Fluxos & Conexões
            </div>

            <button
              onClick={() => handleSelectHubItem('fluxos', 'fluxo_mensagens')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeItem === 'fluxo_mensagens' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>WhatsApp Templates</span>
            </button>

            <button
              onClick={() => handleSelectHubItem('fluxos', 'fluxo_automacoes')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeItem === 'fluxo_automacoes' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Automações & E-mail</span>
            </button>

            <button
              onClick={() => handleSelectHubItem('fluxos', 'fluxo_blog')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeItem === 'fluxo_blog' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Blog Caderno Astral</span>
            </button>

            <button
              onClick={() => handleSelectHubItem('fluxos', 'fluxo_pagamento')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeItem === 'fluxo_pagamento' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Mercado Pago</span>
            </button>

            <button
              onClick={() => handleSelectHubItem('fluxos', 'fluxo_vinculacoes')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeItem === 'fluxo_vinculacoes' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Pixels & Tracking</span>
            </button>

            <button
              onClick={() => handleSelectHubItem('fluxos', 'fluxo_acessos')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeItem === 'fluxo_acessos' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Acessos & Usuários</span>
            </button>
          </div>

          {/* 4. SEÇÃO PÁGINAS CMS */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#F0B55E]">
              Páginas CMS (9 Páginas)
            </div>

            <button
              onClick={() => handleSelectHubItem('paginas', 'pag_inicio')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeSection === 'paginas' ? 'bg-[#2B2566] text-[#F0B55E] font-bold' : 'text-[#DAD2C4] hover:bg-[#2B2566]/60'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Editor de Páginas</span>
            </button>
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

      {/* ÁREA DE CONTEÚDO PRINCIPAL DO PAINEL */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        
        {/* BARRA DE NAVEGAÇÃO SUPERIOR / BREADCRUMBS */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#372B69] pb-4">
          <div className="flex items-center gap-2 text-xs text-[#DAD2C4]">
            <button
              onClick={handleBackToHub}
              className="text-[#F0B55E] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Hub Principal</span>
            </button>

            {activeItem && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-[#DAD2C4]/50" />
                <span className="uppercase text-[11px] font-bold text-white tracking-wider">
                  {activeSection} &bull; {activeItem}
                </span>
              </>
            )}
          </div>

          {activeItem && (
            <button
              onClick={handleBackToHub}
              className="py-1.5 px-3 rounded-lg bg-[#2B2566] hover:bg-[#372B69] text-[#F0B55E] text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Voltar ao Hub</span>
            </button>
          )}
        </div>

        {/* =========================================================================
            ROTEAMENTO INTERNO DOS MÓDULOS
            ========================================================================= */}
        {activeItem === null ? (
          // VISÃO 1: HUB VISUAL COMPLETO COM AS 4 SEÇÕES E CARTÕES
          <AdminHubGrid
            onSelectItem={handleSelectHubItem}
            crmCount={contacts.length}
            agendaCount={appointments.length}
          />
        ) : activeItem === 'calculadora' ? (
          // OPERAÇÕES: CALCULADORA ASTRAL
          <OperationsCalculator />
        ) : activeItem === 'agenda' ? (
          // OPERAÇÕES: AGENDA ATENDIMENTOS
          <OperationsAgenda />
        ) : activeItem === 'cadastros' ? (
          // OPERAÇÕES: CADASTROS (CRM)
          <OperationsCRM />
        ) : activeItem.startsWith('serv_') ? (
          // SERVIÇOS: GERENCIADOR DE CATÁLOGO & FRETE
          <ServicesManager initialSubTab={activeItem as ServiceSubTab} />
        ) : activeItem.startsWith('fluxo_') ? (
          // FLUXOS: WHATSAPP, AUTOMAÇÕES, BLOG, MERCADO PAGO, PIXELS, ACESSOS
          <FlowsManager initialSubTab={activeItem as FlowSubTab} currentUser={currentUser} />
        ) : activeItem.startsWith('pag_') ? (
          // PÁGINAS: CMS DE 9 PÁGINAS COM RESTAURAÇÃO
          <PagesManager initialSlug={activeItem as PageSlug} />
        ) : (
          <AdminHubGrid
            onSelectItem={handleSelectHubItem}
            crmCount={contacts.length}
            agendaCount={appointments.length}
          />
        )}
      </main>
    </div>
  );
};
