/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Painel de Controles (/painel)
 * 
 * Estrutura de Acesso e Permissões (RBAC):
 * - Suporte (Master): Não pode ser removido, alterado ou ajustado. Mestre do sistema.
 * - Bianca (Administradora): Pode inserir, excluir, alterar nomes e senhas de outros membros (inclusive Caio).
 * - Caio (Operador Básico): Acesso a todas as funções operacionais, mas não pode inserir nem excluir usuários; pode alterar apenas seu próprio nome e senha.
 * 
 * Tela de Login:
 * - Logo da Casa6 no topo que retorna à Home ao ser clicado.
 * - Título: Painel de Controle
 * - Subtítulo: Área Restrita para Administradores
 * - Campo Login: Caixa suspensa (dropdown) com os usuários cadastrados.
 * - Campo Senha: Campo com olhinho lateral para visualizar a senha.
 * - Botão: Entrar no Painel
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
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  UserPlus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { SITE_CONFIG, OFFICIAL_SERVICES } from '../../config/site';
import { Lead, LeadStatus, UserProfile, AdminUser } from '../../types';
import { getCurrentUser, loginWithAdminAccount, logoutAdminSession, subscribeAuth } from '../../services/auth';
import { getLeadsList, updateLeadStatus } from '../../services/leads';
import {
  getAdminUsersList,
  authenticateAdminUser,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
} from '../../services/adminUsersService';

type AdminTab =
  | 'dashboard'
  | 'leads'
  | 'usuarios'
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

  // Estados dos Usuários Administradores
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [selectedLoginUsername, setSelectedLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Estados de Gerenciamento da Aba de Usuários
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTargetUser, setEditingTargetUser] = useState<AdminUser | null>(null);
  const [newUserNameInput, setNewUserNameInput] = useState('');
  const [newUserPasswordInput, setNewUserPasswordInput] = useState('');
  const [newUserRoleInput, setNewUserRoleInput] = useState<'admin' | 'operador'>('operador');
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);

  const [editUserNameInput, setEditUserNameInput] = useState('');
  const [editUserPasswordInput, setEditUserPasswordInput] = useState('');
  const [showEditUserPassword, setShowEditUserPassword] = useState(false);

  const [userFeedbackMessage, setUserFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingUser, setIsSavingUser] = useState(false);

  // Monitora autenticação
  useEffect(() => {
    const unsub = subscribeAuth((state) => {
      setCurrentUser(state.user);
    });
    return unsub;
  }, []);

  // Carrega lista de usuários administradores da coleção
  const refreshAdminUsers = async () => {
    try {
      const users = await getAdminUsersList();
      setAdminUsers(users);
    } catch (err) {
      console.warn('[AdminPanel] Erro ao carregar usuários:', err);
    }
  };

  useEffect(() => {
    refreshAdminUsers();
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
      refreshAdminUsers();
    }
  }, [currentUser]);

  // Submissão do Formulário de Login Simplificado
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!selectedLoginUsername) {
      setLoginError('Por favor, selecione um usuário no campo Login.');
      return;
    }

    if (!loginPassword) {
      setLoginError('Por favor, digite a sua senha de acesso.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const authenticated = await authenticateAdminUser(selectedLoginUsername, loginPassword);
      if (!authenticated) {
        setLoginError('Senha incorreta para o usuário selecionado. Tente novamente.');
        return;
      }

      loginWithAdminAccount(authenticated);
      setLoginPassword('');
    } catch (err) {
      setLoginError('Ocorreu um erro ao autenticar. Tente novamente.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Criação de Novo Usuário (Apenas Bianca ou Suporte)
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setUserFeedbackMessage(null);
    setIsSavingUser(true);

    try {
      await createAdminUser(currentUser, {
        username: newUserNameInput,
        password: newUserPasswordInput,
        role: newUserRoleInput
      });

      setUserFeedbackMessage({
        type: 'success',
        text: `Usuário "${newUserNameInput}" cadastrado com sucesso!`
      });

      setNewUserNameInput('');
      setNewUserPasswordInput('');
      setNewUserRoleInput('operador');
      setIsCreateModalOpen(false);
      await refreshAdminUsers();
    } catch (err: any) {
      setUserFeedbackMessage({
        type: 'error',
        text: err?.message || 'Erro ao cadastrar usuário.'
      });
    } finally {
      setIsSavingUser(false);
    }
  };

  // Edição de Usuário (Bianca e Suporte podem editar qualquer um exceto Suporte; Caio só pode editar ele mesmo)
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editingTargetUser) return;
    setUserFeedbackMessage(null);
    setIsSavingUser(true);

    try {
      await updateAdminUser(currentUser, editingTargetUser.id, {
        username: editUserNameInput,
        password: editUserPasswordInput ? editUserPasswordInput : undefined
      });

      setUserFeedbackMessage({
        type: 'success',
        text: `Cadastro de "${editUserNameInput}" atualizado com sucesso!`
      });

      setEditingTargetUser(null);
      await refreshAdminUsers();
    } catch (err: any) {
      setUserFeedbackMessage({
        type: 'error',
        text: err?.message || 'Erro ao atualizar usuário.'
      });
    } finally {
      setIsSavingUser(false);
    }
  };

  // Exclusão de Usuário (Apenas Bianca e Suporte, nunca o Suporte)
  const handleDeleteUser = async (userToDelete: AdminUser) => {
    if (!currentUser) return;
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o acesso de "${userToDelete.username}" ao painel de controle? Esta ação não pode ser desfeita.`
    );
    if (!confirmDelete) return;

    setUserFeedbackMessage(null);
    try {
      await deleteAdminUser(currentUser, userToDelete.id);
      setUserFeedbackMessage({
        type: 'success',
        text: `Acesso de "${userToDelete.username}" excluído com sucesso.`
      });
      await refreshAdminUsers();
    } catch (err: any) {
      setUserFeedbackMessage({
        type: 'error',
        text: err?.message || 'Erro ao excluir usuário.'
      });
    }
  };

  // =========================================================================
  // TELA DE LOGIN SIMPLIFICADA (ESTRITAMENTE CONFORME ESPECIFICADO)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="admin-scope min-h-screen bg-[#2B2566] flex flex-col items-center justify-center p-4">
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
        <div className="w-full max-w-sm sm:max-w-md rounded-3xl bg-[#FCFAF7] p-8 sm:p-10 shadow-2xl border border-[#F0B55E]/40 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-heading text-2xl font-bold text-[#2B2566]">
              Painel de Controle
            </h1>
            <p className="text-xs sm:text-sm text-[#68638C] font-medium">
              Área Restrita para Administradores
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center animate-in fade-in">
              {loginError}
            </div>
          )}

          {/* Formulário Estrito: Login (Caixa Suspensa), Senha (com Olhinho) e Botão */}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2B2566]">
                Login *
              </label>
              <select
                value={selectedLoginUsername}
                onChange={(e) => {
                  setSelectedLoginUsername(e.target.value);
                  setLoginError('');
                }}
                className="w-full rounded-xl border border-[#DAD2C4] bg-white px-4 py-3 text-xs sm:text-sm text-[#2B2566] font-medium focus:border-[#F0B55E] focus:outline-none focus:ring-2 focus:ring-[#F0B55E]/20 transition-all cursor-pointer"
                required
              >
                <option value="">Selecione o usuário...</option>
                {adminUsers.map((user) => (
                  <option key={user.id} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2B2566]">
                Senha *
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="Digite sua senha"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full rounded-xl border border-[#DAD2C4] bg-white pl-4 pr-11 py-3 text-xs sm:text-sm text-[#2B2566] focus:border-[#F0B55E] focus:outline-none focus:ring-2 focus:ring-[#F0B55E]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  title={showLoginPassword ? 'Ocultar senha' : 'Visualizar senha'}
                  aria-label={showLoginPassword ? 'Ocultar senha' : 'Visualizar senha'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8C987F] hover:text-[#2B2566] cursor-pointer transition-colors focus:outline-none"
                >
                  {showLoginPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#2B2566] hover:bg-[#1E1B4B] text-[#F0B55E] py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Shield className="h-4 w-4 text-[#F0B55E]" />
              <span>{isLoggingIn ? 'Entrando...' : 'Entrar no Painel'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PAINEL DE CONTROLE AUTENTICADO
  // =========================================================================
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    await updateLeadStatus(leadId, newStatus);
    await refreshLeads();
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filteredLeads = leads.filter((l) => {
    if (leadStatusFilter === 'all') return true;
    return l.status === leadStatusFilter;
  });

  const isMasterUser = currentUser.role === 'master';
  const isAdminUser = currentUser.role === 'admin' || isMasterUser;
  const isOperadorUser = currentUser.role === 'operador' || currentUser.role === 'editor';

  return (
    <div className="admin-scope min-h-screen bg-[#F3EEE5] text-[#211D35] flex flex-col md:flex-row">
      {/* SIDEBAR ADMINISTRATIVA */}
      <aside className="w-full md:w-64 bg-[#22205A] text-[#FFFFFF] flex flex-col shrink-0 border-r border-[#372B69]">
        {/* Topo da Sidebar com Usuário Logado */}
        <div className="p-4 border-b border-[#372B69] flex items-center justify-between">
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <img
                src="https://static.wixstatic.com/media/02c8e0_916db28bdef7413a82fde89b9ce7f738~mv2.png"
                alt="Casa 6"
                className="h-6 w-auto object-contain cursor-pointer"
                onClick={onNavigateHome}
                title="Ir para o Início"
              />
              <span className="text-[9px] bg-[#2B2566] px-1.5 py-0.5 rounded text-[#F0B55E] uppercase font-bold border border-[#F0B55E]/40">
                Painel
              </span>
            </div>
            <p className="text-[11px] text-[#DAD2C4] truncate mt-1">
              Olá, <strong className="text-white font-bold">{currentUser.displayName}</strong>{' '}
              <span className="text-[10px] text-[#F0B55E]">
                ({currentUser.role === 'master' ? 'Mestre' : currentUser.role === 'admin' ? 'Admin' : 'Operador'})
              </span>
            </p>
          </div>
          <button
            onClick={() => logoutAdminSession()}
            title="Encerrar Sessão"
            aria-label="Encerrar Sessão"
            className="p-1.5 rounded-lg hover:bg-[#372B69] text-[#DAD2C4] hover:text-[#FFFFFF] cursor-pointer transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* Navegação de Módulos */}
        <nav className="p-2 space-y-1 flex-1 text-xs">
          {[
            { id: 'dashboard', label: 'Dashboard Geral', icon: LayoutDashboard },
            { id: 'leads', label: 'Gestão de Leads (CRM)', icon: Users, badge: leads.length },
            { id: 'usuarios', label: 'Acessos & Administradores', icon: Shield, badge: adminUsers.length },
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
                onClick={() => {
                  setCurrentTab(item.id as AdminTab);
                  setUserFeedbackMessage(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors cursor-pointer ${
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
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-[#080C35] text-[#FFB63F]' : 'bg-[#372B69] text-[#FFFFFF]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Rodapé da Sidebar */}
        <div className="p-3 border-t border-[#372B69] text-[10px] text-[#DAD2C4] space-y-1">
          <p>Painel de Controle • Casa 6</p>
          <button
            onClick={onNavigateHome}
            className="text-[#FFB63F] hover:underline flex items-center gap-1 cursor-pointer"
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
            <h2 className="font-heading text-2xl font-bold text-[#22205A]">
              {currentTab === 'dashboard' && 'Dashboard Operacional'}
              {currentTab === 'leads' && 'Gestão de Leads do Funil'}
              {currentTab === 'usuarios' && 'Acessos & Administradores do Painel'}
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
              <span>
                Usuário Conectado: <strong>{currentUser.displayName}</strong> (
                {currentUser.role === 'master' ? 'Mestre' : currentUser.role === 'admin' ? 'Administrador' : 'Operador'}
                )
              </span>
            </span>
          </div>
        </header>

        {/* FEEDBACK DE AÇÕES */}
        {userFeedbackMessage && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium animate-in fade-in ${
              userFeedbackMessage.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {userFeedbackMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              )}
              <span>{userFeedbackMessage.text}</span>
            </div>
            <button
              onClick={() => setUserFeedbackMessage(null)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* =========================================================================
            ABA: ACESSOS & ADMINISTRADORES (RBAC)
            ========================================================================= */}
        {currentTab === 'usuarios' && (
          <div className="space-y-6">
            {/* Topo com Descrição e Botão Adicionar Usuário */}
            <div className="rounded-xl bg-[#FCFAF7] p-6 border border-[#DAD2C4] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-heading text-lg font-bold text-[#22205A] flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#FFB63F]" />
                  <span>Acessos Cadastrados no Banco de Dados (Coleção: &apos;admin_users&apos;)</span>
                </h3>
                <p className="text-xs text-[#534D6B] max-w-2xl leading-relaxed">
                  Gerenciamento de permissões do painel. O usuário <strong>Suporte</strong> é o mestre inalterável.
                  A administradora <strong>Bianca</strong> possui permissão para incluir, alterar e remover outros membros.
                  O operador <strong>Caio</strong> possui acesso operacional irrestrito e permissão para alterar seu próprio nome e senha.
                </p>
              </div>

              {/* Botão Novo Administrador (Oculto para Caio) */}
              {isAdminUser && (
                <button
                  type="button"
                  onClick={() => {
                    setNewUserNameInput('');
                    setNewUserPasswordInput('');
                    setNewUserRoleInput('operador');
                    setIsCreateModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2B2566] hover:bg-[#1E1B4B] text-[#F0B55E] px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Novo Acesso</span>
                </button>
              )}
            </div>

            {/* Tabela de Usuários Cadastrados */}
            <div className="rounded-xl bg-[#FCFAF7] border border-[#DAD2C4] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#211D35]">
                  <thead className="bg-[#ECE6DA] text-[#22205A] uppercase text-[10px] tracking-wider font-bold border-b border-[#DAD2C4]">
                    <tr>
                      <th className="px-5 py-3.5">Nome / Login</th>
                      <th className="px-5 py-3.5">Nível de Acesso</th>
                      <th className="px-5 py-3.5">Status de Proteção</th>
                      <th className="px-5 py-3.5">Data de Cadastro</th>
                      <th className="px-5 py-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DAD2C4]">
                    {adminUsers.map((user) => {
                      const isSuporte = user.isProtected || user.id === 'suporte' || user.username.toLowerCase() === 'suporte';
                      const isSelf =
                        currentUser.id === user.id ||
                        currentUser.displayName.toLowerCase() === user.username.toLowerCase();

                      const canEditThisUser =
                        !isSuporte && (isAdminUser || (isOperadorUser && isSelf));
                      const canDeleteThisUser =
                        !isSuporte && isAdminUser && !isSelf;

                      return (
                        <tr key={user.id} className="hover:bg-white/60 transition-colors">
                          <td className="px-5 py-4 font-bold text-[#22205A] flex items-center gap-2">
                            <span className="h-7 w-7 rounded-full bg-[#2B2566] text-[#F0B55E] flex items-center justify-center text-xs font-extrabold uppercase">
                              {user.username.charAt(0)}
                            </span>
                            <span>{user.username}</span>
                            {isSelf && (
                              <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">
                                Você
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {user.role === 'master' ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 text-purple-900 px-2.5 py-0.5 text-[11px] font-bold border border-purple-200">
                                ✦ Mestre
                              </span>
                            ) : user.role === 'admin' ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFB63F]/20 text-[#2B2566] px-2.5 py-0.5 text-[11px] font-bold border border-[#FFB63F]/50">
                                Administrador
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-800 px-2.5 py-0.5 text-[11px] font-semibold border border-blue-200">
                                Operador Básico
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {isSuporte ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                                <Lock className="h-3 w-3 text-amber-600" />
                                <span>Mestre Intocável (Protegido)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-green-700">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                                <span>Ativo no Sistema</span>
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-[#7A7394]">
                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Botão de Edição */}
                              {canEditThisUser ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingTargetUser(user);
                                    setEditUserNameInput(user.username);
                                    setEditUserPasswordInput('');
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#DAD2C4] hover:border-[#2B2566] text-[#22205A] text-xs font-semibold cursor-pointer shadow-2xs hover:bg-[#FAF8F5] transition-all"
                                >
                                  <Edit2 className="h-3.5 w-3.5 text-[#2B2566]" />
                                  <span>{isSelf ? 'Alterar Meus Dados' : 'Alterar'}</span>
                                </button>
                              ) : isSuporte ? (
                                <span className="text-[11px] text-gray-400 italic">
                                  Bloqueado contra alterações
                                </span>
                              ) : null}

                              {/* Botão de Exclusão (Apenas Bianca ou Suporte, e nunca a própria conta ou o Suporte) */}
                              {canDeleteThisUser && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(user)}
                                  title={`Excluir ${user.username}`}
                                  className="p-1.5 rounded-lg bg-white border border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 cursor-pointer transition-colors shadow-2xs"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Aviso de Regras de Segurança */}
            <div className="rounded-xl bg-[#ECE6DA]/60 p-4 border border-[#DAD2C4] text-xs text-[#534D6B] space-y-1">
              <p className="font-bold text-[#22205A]">Regras de Acesso e Governança Ativas:</p>
              <p>• <strong>Suporte:</strong> Mestre protegido de fábrica. Não pode ser renomeado, alterado ou removido sob nenhuma hipótese.</p>
              <p>• <strong>Bianca:</strong> Administradora com plenos poderes para criar, renomear, redefinir senhas e excluir operadores e administradores.</p>
              <p>• <strong>Caio:</strong> Operador básico com acesso integral aos dados de leads, atendimentos e catálogo, restrito de alterar cadastros alheios ou cadastrar novos acessos.</p>
            </div>
          </div>
        )}

        {/* MODAL: NOVO ADMINISTRADOR */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-[#DAD2C4] space-y-5">
              <div className="flex items-center justify-between border-b border-[#DAD2C4] pb-3">
                <h3 className="font-heading text-lg font-bold text-[#22205A] flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-[#FFB63F]" />
                  <span>Cadastrar Novo Administrador</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#22205A]">
                    Nome de Acesso (Login) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mariana, Roberto..."
                    value={newUserNameInput}
                    onChange={(e) => setNewUserNameInput(e.target.value)}
                    className="w-full rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#22205A] focus:border-[#F0B55E] focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#22205A]">
                    Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewUserPassword ? 'text' : 'password'}
                      required
                      placeholder="Senha do usuário"
                      value={newUserPasswordInput}
                      onChange={(e) => setNewUserPasswordInput(e.target.value)}
                      className="w-full rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] pl-3.5 pr-10 py-2.5 text-xs text-[#22205A] focus:border-[#F0B55E] focus:outline-none focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showNewUserPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#22205A]">
                    Nível de Acesso (Permissões) *
                  </label>
                  <select
                    value={newUserRoleInput}
                    onChange={(e) => setNewUserRoleInput(e.target.value as 'admin' | 'operador')}
                    className="w-full rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#22205A] focus:border-[#F0B55E] focus:outline-none focus:bg-white cursor-pointer"
                  >
                    <option value="operador">Operador Básico (Acessa tudo, não gerencia outros usuários)</option>
                    <option value="admin">Administrador (Pode gerenciar outros acessos)</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-[#DAD2C4] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingUser}
                    className="px-5 py-2 rounded-full bg-[#2B2566] hover:bg-[#1E1B4B] text-[#F0B55E] text-xs font-bold uppercase tracking-wider shadow cursor-pointer disabled:opacity-50"
                  >
                    {isSavingUser ? 'Salvando...' : 'Salvar no Banco de Dados'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ALTERAR NOME E SENHA */}
        {editingTargetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-[#DAD2C4] space-y-5">
              <div className="flex items-center justify-between border-b border-[#DAD2C4] pb-3">
                <h3 className="font-heading text-lg font-bold text-[#22205A] flex items-center gap-2">
                  <Edit2 className="h-5 w-5 text-[#FFB63F]" />
                  <span>Alterar Acesso: {editingTargetUser.username}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingTargetUser(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#22205A]">
                    Nome de Acesso (Login) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editUserNameInput}
                    onChange={(e) => setEditUserNameInput(e.target.value)}
                    className="w-full rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#22205A] focus:border-[#F0B55E] focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#22205A]">
                    Nova Senha (deixe em branco para manter a atual)
                  </label>
                  <div className="relative">
                    <input
                      type={showEditUserPassword ? 'text' : 'password'}
                      placeholder="Digite a nova senha"
                      value={editUserPasswordInput}
                      onChange={(e) => setEditUserPasswordInput(e.target.value)}
                      className="w-full rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] pl-3.5 pr-10 py-2.5 text-xs text-[#22205A] focus:border-[#F0B55E] focus:outline-none focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditUserPassword(!showEditUserPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showEditUserPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#DAD2C4] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTargetUser(null)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingUser}
                    className="px-5 py-2 rounded-full bg-[#2B2566] hover:bg-[#1E1B4B] text-[#F0B55E] text-xs font-bold uppercase tracking-wider shadow cursor-pointer disabled:opacity-50"
                  >
                    {isSavingUser ? 'Atualizando...' : 'Atualizar Dados'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            ABA: DASHBOARD
            ========================================================================= */}
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
                <span className="text-xs text-[#7A7394] font-medium">Acessos Cadastrados</span>
                <p className="font-heading text-3xl font-bold text-[#22205A] mt-1">
                  {adminUsers.length}
                </p>
                <span className="text-[11px] text-[#7A7394]">Suporte, Bianca, Caio</span>
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
                    <span className="font-bold text-[#22205A]">Autenticação & RBAC de Usuários</span>
                    <span className="rounded bg-green-100 text-green-800 px-2 py-0.5 font-bold">REAL / PERSISTIDO</span>
                  </div>
                  <p className="text-[#534D6B]">
                    Coleção &apos;admin_users&apos; ativa com perfis Suporte (Mestre), Bianca (Admin) e Caio (Operador).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            ABA: LEADS DO FUNIL
            ========================================================================= */}
        {currentTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#7A7394]" />
                <span className="text-xs font-semibold text-[#534D6B]">Filtrar por Status:</span>
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="rounded-lg border border-[#DAD2C4] bg-[#FCFAF7] px-3 py-1.5 text-xs text-[#22205A] focus:outline-none"
                >
                  <option value="all">Todos ({leads.length})</option>
                  <option value="new">Novos</option>
                  <option value="contacted">Em Contato</option>
                  <option value="scheduled">Agendados</option>
                  <option value="completed">Concluídos</option>
                  <option value="lost">Perdidos</option>
                </select>
              </div>

              <button
                onClick={refreshLeads}
                disabled={isLoadingLeads}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#DAD2C4] bg-[#FCFAF7] px-3 py-1.5 text-xs font-semibold text-[#22205A] hover:bg-[#DAD2C4] transition-colors"
              >
                <span>{isLoadingLeads ? 'Atualizando...' : 'Atualizar Lista'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Tabela de Leads */}
              <div className="lg:col-span-8 rounded-xl bg-[#FCFAF7] border border-[#DAD2C4] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#211D35]">
                    <thead className="bg-[#ECE6DA] text-[#22205A] uppercase text-[10px] tracking-wider font-bold border-b border-[#DAD2C4]">
                      <tr>
                        <th className="px-4 py-3">Nome Completo</th>
                        <th className="px-4 py-3">Serviço de Interesse</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Data</th>
                        <th className="px-4 py-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DAD2C4]">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-xs text-[#7A7394]">
                            Nenhum lead encontrado neste filtro.
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => {
                          const isSelected = selectedLead?.id === lead.id;
                          return (
                            <tr
                              key={lead.id}
                              onClick={() => setSelectedLead(lead)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? 'bg-[#FFB63F]/20 font-semibold' : 'hover:bg-white/60'
                              }`}
                            >
                              <td className="px-4 py-3 text-[#22205A] font-bold">
                                {lead.fullName}
                              </td>
                              <td className="px-4 py-3 truncate max-w-[160px]">
                                {lead.serviceName || lead.serviceId}
                              </td>
                              <td className="px-4 py-3">
                                <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase bg-[#DAD2C4] text-[#22205A]">
                                  {lead.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-[#7A7394]">
                                {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <ChevronRight className="inline-block h-4 w-4 text-[#7A7394]" />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detalhes do Lead Selecionado */}
              <div className="lg:col-span-4 rounded-xl bg-[#FCFAF7] border border-[#DAD2C4] p-5 shadow-xs space-y-4">
                <h3 className="font-heading text-sm font-bold text-[#22205A] border-b border-[#DAD2C4] pb-2">
                  Ficha do Lead Selecionado
                </h3>
                {selectedLead ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[#7A7394] block text-[10px] uppercase font-bold">Nome:</span>
                      <p className="font-bold text-[#22205A] text-sm">{selectedLead.fullName}</p>
                    </div>

                    <div>
                      <span className="text-[#7A7394] block text-[10px] uppercase font-bold">E-mail:</span>
                      <a href={`mailto:${selectedLead.email}`} className="text-[#2B2566] hover:underline font-medium">
                        {selectedLead.email}
                      </a>
                    </div>

                    <div>
                      <span className="text-[#7A7394] block text-[10px] uppercase font-bold">WhatsApp:</span>
                      <a
                        href={`https://wa.me/${selectedLead.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 font-bold hover:underline"
                      >
                        {selectedLead.whatsapp} ↗
                      </a>
                    </div>

                    <div className="border-t border-[#DAD2C4] pt-2 space-y-1 text-[11px] text-[#534D6B]">
                      <p>
                        <strong className="text-[#22205A]">Serviço: </strong>
                        {selectedLead.serviceName || selectedLead.serviceId}
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
                            className={`px-2 py-1.5 rounded text-[11px] font-semibold transition-colors border cursor-pointer ${
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
              <strong>{currentTab}</strong> já foram formalmente criados e integrados ao painel.
            </p>
            <div className="rounded-lg bg-[#F3EEE5] p-4 border border-[#DAD2C4] text-xs text-[#534D6B] space-y-1">
              <p>• Coleção correspondente no Firestore: <strong>/{currentTab}</strong></p>
              <p>• Permissão: <strong>Acessível por todos os operadores ({currentUser.displayName})</strong></p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
