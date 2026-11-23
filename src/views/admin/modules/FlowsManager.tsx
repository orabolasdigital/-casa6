/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo: Fluxos (Mensagens, Automações, Blog, Pagamentos, Vinculações, Usuários)
 * Tema Claro (Light Theme) com Sincronização Integral
 */

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Mail,
  BookOpen,
  CreditCard,
  Share2,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit2,
  Check,
  Globe,
  Radio
} from 'lucide-react';
import {
  PaymentCredentials,
  TrackingSettings,
  WhatsAppTemplate,
  EmailAutomationSettings,
  getPaymentCredentials,
  savePaymentCredentials,
  getTrackingSettings,
  saveTrackingSettings,
  getWhatsAppTemplates,
  saveWhatsAppTemplates,
  getEmailAutomationSettings,
  saveEmailAutomationSettings
} from '../../../services/adminConfigService';
import {
  AdminUser,
  getAdminUsersList,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
} from '../../../services/adminUsersService';
import { CATALOG_BLOG_POSTS, BlogPostItem } from '../../../services/catalogService';
import { UserProfile } from '../../../types';

export type FlowSubTab =
  | 'fluxo_mensagens'
  | 'fluxo_automacoes'
  | 'fluxo_blog'
  | 'fluxo_pagamento'
  | 'fluxo_vinculacoes'
  | 'fluxo_acessos';

interface FlowsManagerProps {
  initialSubTab?: FlowSubTab;
  currentUser: UserProfile;
}

export const FlowsManager: React.FC<FlowsManagerProps> = ({
  initialSubTab = 'fluxo_mensagens',
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<FlowSubTab>(initialSubTab);

  // Estados dos Fluxos
  const [paymentConfig, setPaymentConfig] = useState<PaymentCredentials | null>(null);
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  const [trackingConfig, setTrackingConfig] = useState<TrackingSettings | null>(null);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [automationConfig, setAutomationConfig] = useState<EmailAutomationSettings | null>(null);

  // Estados de Blog Caderno Astral (Sincronizado com os artigos reais do site)
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>(CATALOG_BLOG_POSTS);
  const [selectedPost, setSelectedPost] = useState<BlogPostItem | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Estados de Usuários RBAC
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingTargetUser, setEditingTargetUser] = useState<AdminUser | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'operador'>('operador');
  const [showNewUserPass, setShowNewUserPass] = useState(false);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    getPaymentCredentials().then(setPaymentConfig);
    getTrackingSettings().then(setTrackingConfig);
    getWhatsAppTemplates().then(setTemplates);
    getEmailAutomationSettings().then(setAutomationConfig);
    getAdminUsersList().then(setAdminUsers);
  }, []);

  useEffect(() => {
    if (initialSubTab) setActiveTab(initialSubTab);
  }, [initialSubTab]);

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentConfig) return;
    try {
      await savePaymentCredentials(paymentConfig);
      setNotification({ type: 'success', text: 'Chaves e modo de pagamento do Mercado Pago salvos com sucesso!' });
    } catch {
      setNotification({ type: 'error', text: 'Erro ao salvar Mercado Pago.' });
    }
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingConfig) return;
    try {
      await saveTrackingSettings(trackingConfig);
      setNotification({ type: 'success', text: 'Códigos de vinculação e pixels salvos com sucesso!' });
    } catch {
      setNotification({ type: 'error', text: 'Erro ao salvar vinculações.' });
    }
  };

  const handleSaveTemplates = async () => {
    try {
      await saveWhatsAppTemplates(templates);
      setNotification({ type: 'success', text: 'Templates de mensagens de WhatsApp salvos com sucesso!' });
    } catch {
      setNotification({ type: 'error', text: 'Erro ao salvar mensagens.' });
    }
  };

  const handleSaveAutomation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!automationConfig) return;
    try {
      await saveEmailAutomationSettings(automationConfig);
      setNotification({ type: 'success', text: 'Automações de e-mail e alertas salvas com sucesso!' });
    } catch {
      setNotification({ type: 'error', text: 'Erro ao salvar automações.' });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdminUser(currentUser, {
        username: newUserName,
        password: newUserPassword,
        role: newUserRole
      });
      setNotification({ type: 'success', text: `Usuário "${newUserName}" cadastrado com sucesso!` });
      setNewUserName('');
      setNewUserPassword('');
      setIsUserModalOpen(false);
      const list = await getAdminUsersList();
      setAdminUsers(list);
    } catch (err: any) {
      setNotification({ type: 'error', text: err?.message || 'Erro ao criar usuário.' });
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTargetUser) return;
    try {
      await updateAdminUser(currentUser, editingTargetUser.id, {
        username: newUserName || editingTargetUser.username,
        password: newUserPassword || undefined
      });
      setNotification({ type: 'success', text: `Acesso atualizado com sucesso!` });
      setEditingTargetUser(null);
      setNewUserName('');
      setNewUserPassword('');
      const list = await getAdminUsersList();
      setAdminUsers(list);
    } catch (err: any) {
      setNotification({ type: 'error', text: err?.message || 'Erro ao atualizar usuário.' });
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!window.confirm(`Deseja realmente excluir o acesso de "${user.username}"?`)) return;
    try {
      await deleteAdminUser(currentUser, user.id);
      setNotification({ type: 'success', text: `Usuário "${user.username}" removido.` });
      const list = await getAdminUsersList();
      setAdminUsers(list);
    } catch (err: any) {
      setNotification({ type: 'error', text: err?.message || 'Erro ao excluir usuário.' });
    }
  };

  const isMasterUser = currentUser.role === 'master';
  const isAdminUser = currentUser.role === 'admin' || isMasterUser;

  return (
    <div className="space-y-6 animate-fadeIn text-[#22205A]">
      {/* Cabeçalho */}
      <div className="border-b border-[#E5E0D8] pb-4">
        <div className="flex items-center gap-2 text-[#D99426] text-xs font-bold uppercase tracking-widest">
          <Share2 className="h-4 w-4" />
          <span>Fluxos &bull; Integrações & Conexões</span>
        </div>
        <h2 className="text-2xl font-heading font-black text-[#22205A] mt-1 capitalize">
          {activeTab === 'fluxo_mensagens' && 'Mensagens WhatsApp'}
          {activeTab === 'fluxo_automacoes' && 'Automações & E-mail'}
          {activeTab === 'fluxo_blog' && 'Blog (Caderno Astral)'}
          {activeTab === 'fluxo_pagamento' && 'Pagamentos (Mercado Pago)'}
          {activeTab === 'fluxo_vinculacoes' && 'Vinculações & Pixels'}
          {activeTab === 'fluxo_acessos' && 'Usuários do Painel'}
        </h2>
        <p className="text-xs sm:text-sm text-[#68638C]">
          Configure mensagens dinâmicas, notificações por e-mail, matérias do blog, pagamentos, rastreamento e usuários.
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

      {/* =========================================================================
          1. MENSAGENS (WHATSAPP COM VARIÁVEIS DINÂMICAS)
          ========================================================================= */}
      {activeTab === 'fluxo_mensagens' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-[#22205A]">Templates de Mensagens do WhatsApp</h3>
              <p className="text-xs text-[#68638C]">
                Personalize os textos usando as tags dinâmicas: <code className="bg-[#FAF8F5] px-1 py-0.5 rounded text-[#D99426] font-bold">{'{nome}'}</code>, <code className="bg-[#FAF8F5] px-1 py-0.5 rounded text-[#D99426] font-bold">{'{servico}'}</code>, <code className="bg-[#FAF8F5] px-1 py-0.5 rounded text-[#D99426] font-bold">{'{data}'}</code>, <code className="bg-[#FAF8F5] px-1 py-0.5 rounded text-[#D99426] font-bold">{'{horario}'}</code> e <code className="bg-[#FAF8F5] px-1 py-0.5 rounded text-[#D99426] font-bold">{'{link_meet}'}</code>.
              </p>
            </div>
            <button
              onClick={handleSaveTemplates}
              className="py-2 px-4 rounded-xl bg-[#22205A] text-[#F0B55E] font-bold text-xs uppercase shadow-xs flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" /> Salvar Mensagens
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl, idx) => (
              <div key={tpl.id} className="bg-white border border-[#E5E0D8] rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2">
                  <h4 className="font-bold text-[#22205A] text-sm">{tpl.title}</h4>
                  <span className="text-[10px] uppercase font-bold text-[#D99426] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EAE5DC]">
                    {tpl.category}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 text-[10px] text-[#68638C]">
                  <span>Tags disponíveis:</span>
                  {tpl.variables.map((v) => (
                    <code key={v} className="bg-[#FAF8F5] text-[#22205A] px-1 rounded border border-[#EAE5DC]">{v}</code>
                  ))}
                </div>

                <textarea
                  rows={6}
                  value={tpl.content}
                  onChange={(e) => {
                    const copy = [...templates];
                    copy[idx].content = e.target.value;
                    setTemplates(copy);
                  }}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl p-3 text-xs text-[#22205A] leading-relaxed font-mono"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          2. AUTOMAÇÕES (GMAIL / SMTP & ALERTAS)
          ========================================================================= */}
      {activeTab === 'fluxo_automacoes' && automationConfig && (
        <form onSubmit={handleSaveAutomation} className="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs space-y-5 max-w-2xl">
          <div className="border-b border-[#F0EBE1] pb-3">
            <h3 className="font-heading text-base font-bold text-[#22205A] flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#D99426]" />
              Automações de Notificação & E-mails
            </h3>
            <p className="text-xs text-[#68638C]">
              Disparos automáticos para confirmação de formulários, compras e avisos para a Bianca e para o cliente.
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#22205A]">E-mail Remetente Oficial (Gmail / Google Workspace)</label>
              <input
                type="email"
                value={automationConfig.senderGmail}
                onChange={(e) => setAutomationConfig({ ...automationConfig, senderGmail: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#22205A]">E-mail da Bianca para Cópia dos Alertas</label>
              <input
                type="email"
                value={automationConfig.biancaNotificationEmail}
                onChange={(e) => setAutomationConfig({ ...automationConfig, biancaNotificationEmail: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
              />
            </div>

            <div className="space-y-2.5 pt-2">
              <label className="flex items-center gap-2 text-xs text-[#22205A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={automationConfig.copyToBianca}
                  onChange={(e) => setAutomationConfig({ ...automationConfig, copyToBianca: e.target.checked })}
                  className="rounded text-[#22205A]"
                />
                <span>Enviar cópia em tempo real de cada formulário ou agendamento para o e-mail da Bianca</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#22205A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={automationConfig.welcomeTemplateActive}
                  onChange={(e) => setAutomationConfig({ ...automationConfig, welcomeTemplateActive: e.target.checked })}
                  className="rounded text-[#22205A]"
                />
                <span>Disparar e-mail de Boas-Vindas cósmico para novos assinantes da Patota e Bússolas</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#22205A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={automationConfig.leadAlertActive}
                  onChange={(e) => setAutomationConfig({ ...automationConfig, leadAlertActive: e.target.checked })}
                  className="rounded text-[#22205A]"
                />
                <span>Alerta imediato quando uma empresa solicitar orçamento em /palestras ou /parcerias</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-[#22205A] text-[#F0B55E] font-bold text-xs uppercase tracking-wider shadow-xs"
          >
            Salvar Automações
          </button>
        </form>
      )}

      {/* =========================================================================
          3. BLOG (CADERNO ASTRAL COM TEXTOS ORIGINAIS DO BANCO)
          ========================================================================= */}
      {activeTab === 'fluxo_blog' && (
        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
            <div>
              <h3 className="font-heading text-base font-bold text-[#22205A] flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#D99426]" />
                Artigos do Blog (Caderno Astral — /leituras)
              </h3>
              <p className="text-xs text-[#68638C]">
                Todos os textos oficiais cadastrados no banco de dados e exibidos na página Leituras.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedPost({
                  id: `post_${Date.now()}`,
                  slug: 'novo-artigo',
                  title: '',
                  excerpt: '',
                  fullContent: '',
                  publishedAt: new Date().toLocaleDateString('pt-BR'),
                  authorName: 'Bianca Tofoli',
                  imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
                  category: 'ASTROLOGIA',
                  readTime: '5 min de leitura',
                  seoKeywords: ['astrologia', 'casa 6'],
                  geoCoverage: 'São Paulo, Brasil',
                  originalUrl: ''
                });
                setIsPostModalOpen(true);
              }}
              className="py-2 px-3 rounded-lg bg-[#22205A] text-[#F0B55E] font-bold text-xs uppercase flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Novo Artigo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogPosts.map((post) => (
              <div key={post.id} className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE5DC] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#D99426] uppercase">{post.category}</span>
                  <span className="text-[#68638C] font-normal">{post.publishedAt}</span>
                </div>
                <h4 className="text-[#22205A] font-bold text-sm">{post.title}</h4>
                <p className="text-xs text-[#554F70] line-clamp-2">{post.excerpt}</p>
                <div className="pt-2 flex items-center justify-between border-t border-[#EAE5DC] text-xs">
                  <span className="text-emerald-700 font-bold">● Publicado</span>
                  <button
                    onClick={() => {
                      setSelectedPost(post);
                      setIsPostModalOpen(true);
                    }}
                    className="text-[#22205A] hover:text-[#D99426] font-bold"
                  >
                    Editar Artigo Completo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          4. PAGAMENTOS (MERCADO PAGO)
          ========================================================================= */}
      {activeTab === 'fluxo_pagamento' && paymentConfig && (
        <form onSubmit={handleSavePayment} className="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs space-y-5 max-w-2xl">
          <div className="border-b border-[#F0EBE1] pb-3">
            <h3 className="font-heading text-base font-bold text-[#22205A] flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#D99426]" />
              Credenciais do Mercado Pago (Checkout Transparente)
            </h3>
            <p className="text-xs text-[#68638C]">
              Chaves oficiais para processar assinaturas da Patota, Bússolas e compras da Lojinha.
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#22205A]">Public Key (Chave Pública)</label>
              <input
                type="text"
                value={paymentConfig.publicKey}
                onChange={(e) => setPaymentConfig({ ...paymentConfig, publicKey: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#22205A]">Access Token (Chave de Acesso Segura)</label>
                <button
                  type="button"
                  onClick={() => setShowAccessToken(!showAccessToken)}
                  className="text-[11px] text-[#D99426] hover:underline"
                >
                  {showAccessToken ? 'Ocultar' : 'Visualizar'}
                </button>
              </div>
              <input
                type={showAccessToken ? 'text' : 'password'}
                value={paymentConfig.accessToken}
                onChange={(e) => setPaymentConfig({ ...paymentConfig, accessToken: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#22205A]">Webhook Secret (Assinatura do Webhook)</label>
                <button
                  type="button"
                  onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                  className="text-[11px] text-[#D99426] hover:underline"
                >
                  {showWebhookSecret ? 'Ocultar' : 'Visualizar'}
                </button>
              </div>
              <input
                type={showWebhookSecret ? 'text' : 'password'}
                value={paymentConfig.webhookSecret}
                onChange={(e) => setPaymentConfig({ ...paymentConfig, webhookSecret: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] font-mono text-xs"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs text-[#22205A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentConfig.isSandbox}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, isSandbox: e.target.checked })}
                  className="rounded text-[#22205A]"
                />
                <span>Modo Sandbox (Ambiente de testes para simular cartões de crédito)</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-[#22205A] text-[#F0B55E] font-bold text-xs uppercase tracking-wider shadow-xs"
          >
            Salvar Pagamentos
          </button>
        </form>
      )}

      {/* =========================================================================
          5. VINCULAÇÕES (TODOS OS CAMPOS DE PIXELS COM BADGE ATIVO / INATIVO)
          ========================================================================= */}
      {activeTab === 'fluxo_vinculacoes' && trackingConfig && (
        <form onSubmit={handleSaveTracking} className="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs space-y-6 max-w-3xl">
          <div className="border-b border-[#F0EBE1] pb-3">
            <h3 className="font-heading text-base font-bold text-[#22205A] flex items-center gap-2">
              <Share2 className="h-4 w-4 text-[#D99426]" />
              Vinculações, Pixels & Scripts de Rastreamento
            </h3>
            <p className="text-xs text-[#68638C]">
              Cada código possui seu campo específico e status indicando se está ativo no site.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Google Tag Manager */}
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE5DC] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#22205A]">Google Tag Manager (GTM)</label>
                {trackingConfig.googleTagManagerId ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    ● Ativo no Site
                  </span>
                ) : (
                  <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded-full">
                    ○ Inativo (Vazio)
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="GTM-XXXXXXX"
                value={trackingConfig.googleTagManagerId}
                onChange={(e) => setTrackingConfig({ ...trackingConfig, googleTagManagerId: e.target.value })}
                className="w-full bg-white border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs font-mono"
              />
            </div>

            {/* Google Analytics 4 */}
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE5DC] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#22205A]">Google Analytics 4 (GA4)</label>
                {trackingConfig.googleAnalytics4Id ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    ● Ativo no Site
                  </span>
                ) : (
                  <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded-full">
                    ○ Inativo (Vazio)
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={trackingConfig.googleAnalytics4Id}
                onChange={(e) => setTrackingConfig({ ...trackingConfig, googleAnalytics4Id: e.target.value })}
                className="w-full bg-white border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs font-mono"
              />
            </div>

            {/* Meta Pixel */}
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE5DC] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#22205A]">Meta Pixel (Facebook / Instagram)</label>
                {trackingConfig.metaPixelId ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    ● Ativo no Site
                  </span>
                ) : (
                  <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded-full">
                    ○ Inativo (Vazio)
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="123456789012345"
                value={trackingConfig.metaPixelId}
                onChange={(e) => setTrackingConfig({ ...trackingConfig, metaPixelId: e.target.value })}
                className="w-full bg-white border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs font-mono"
              />
            </div>

            {/* Google Ads */}
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE5DC] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#22205A]">Google Ads Conversion Tag</label>
                {trackingConfig.googleAdsId ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    ● Ativo no Site
                  </span>
                ) : (
                  <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded-full">
                    ○ Inativo (Vazio)
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="AW-XXXXXXXXX"
                value={trackingConfig.googleAdsId}
                onChange={(e) => setTrackingConfig({ ...trackingConfig, googleAdsId: e.target.value })}
                className="w-full bg-white border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs font-mono"
              />
            </div>

            {/* Google Meu Negócio */}
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE5DC] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#22205A]">Google Meu Negócio (Perfil)</label>
                {trackingConfig.googleBusinessUrl ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    ● Ativo no Site
                  </span>
                ) : (
                  <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded-full">
                    ○ Inativo (Vazio)
                  </span>
                )}
              </div>
              <input
                type="url"
                placeholder="https://g.page/..."
                value={trackingConfig.googleBusinessUrl}
                onChange={(e) => setTrackingConfig({ ...trackingConfig, googleBusinessUrl: e.target.value })}
                className="w-full bg-white border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs font-mono"
              />
            </div>

            {/* TikTok Ads Pixel */}
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE5DC] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#22205A]">TikTok Ads Pixel</label>
                {trackingConfig.tiktokPixelId ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    ● Ativo no Site
                  </span>
                ) : (
                  <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded-full">
                    ○ Inativo (Vazio)
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="CXXXXXXXXXXXXX"
                value={trackingConfig.tiktokPixelId}
                onChange={(e) => setTrackingConfig({ ...trackingConfig, tiktokPixelId: e.target.value })}
                className="w-full bg-white border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs font-mono"
              />
            </div>

            {/* Twitter / X Ads */}
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE5DC] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#22205A]">Twitter / X Ads Pixel</label>
                {trackingConfig.twitterPixelId ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    ● Ativo no Site
                  </span>
                ) : (
                  <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded-full">
                    ○ Inativo (Vazio)
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="tw-XXXXX-XXXXX"
                value={trackingConfig.twitterPixelId}
                onChange={(e) => setTrackingConfig({ ...trackingConfig, twitterPixelId: e.target.value })}
                className="w-full bg-white border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs font-mono"
              />
            </div>
          </div>

          {/* Scripts Customizados de Cabeçalho e Corpo */}
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#22205A]">Scripts Customizados no &lt;head&gt; (HTML / JS)</label>
                {trackingConfig.customHeadScript ? (
                  <span className="text-[10px] text-emerald-700 font-bold">● Injetado</span>
                ) : null}
              </div>
              <textarea
                rows={3}
                placeholder="<!-- Scripts adicionais injetados no <head> -->"
                value={trackingConfig.customHeadScript}
                onChange={(e) => setTrackingConfig({ ...trackingConfig, customHeadScript: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl p-3 text-xs font-mono text-[#22205A]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#22205A]">Scripts Customizados no &lt;body&gt; (HTML / JS)</label>
                {trackingConfig.customBodyScript ? (
                  <span className="text-[10px] text-emerald-700 font-bold">● Injetado</span>
                ) : null}
              </div>
              <textarea
                rows={3}
                placeholder="<!-- Scripts adicionais injetados no <body> -->"
                value={trackingConfig.customBodyScript}
                onChange={(e) => setTrackingConfig({ ...trackingConfig, customBodyScript: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl p-3 text-xs font-mono text-[#22205A]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-[#22205A] text-[#F0B55E] font-bold text-xs uppercase tracking-wider shadow-xs"
          >
            Salvar Vinculações
          </button>
        </form>
      )}

      {/* =========================================================================
          6. USUÁRIOS (RBAC COM EDIÇÃO E SEGURANÇA)
          ========================================================================= */}
      {activeTab === 'fluxo_acessos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-[#22205A] flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#D99426]" />
                Usuários do Painel de Controle
              </h3>
              <p className="text-xs text-[#68638C]">
                <strong>Suporte</strong> (Mestre protegido), <strong>Bianca</strong> (Administradora) e <strong>Caio</strong> (Operador).
              </p>
            </div>

            {isAdminUser && (
              <button
                onClick={() => {
                  setNewUserName('');
                  setNewUserPassword('');
                  setIsUserModalOpen(true);
                }}
                className="py-2 px-3 rounded-lg bg-[#22205A] text-[#F0B55E] font-bold text-xs uppercase flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Novo Usuário
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {adminUsers.map((u) => {
              const isSuporte = u.username.toLowerCase() === 'suporte';
              const isSelf = currentUser.displayName?.toLowerCase() === u.username.toLowerCase();
              return (
                <div key={u.id} className="bg-white border border-[#E5E0D8] rounded-2xl p-5 space-y-3 shadow-xs relative">
                  {isSuporte && (
                    <span className="absolute top-4 right-4 text-[9px] bg-[#FAF8F5] text-[#D99426] border border-[#DCD6CC] px-2 py-0.5 rounded-full font-bold uppercase">
                      Mestre Protegido
                    </span>
                  )}
                  <div>
                    <h4 className="font-heading text-base font-bold text-[#22205A] capitalize">{u.username}</h4>
                    <span className="text-xs font-bold text-[#D99426] uppercase">
                      {u.role === 'master' ? 'Super Mestre' : u.role === 'admin' ? 'Administradora' : 'Operador'}
                    </span>
                  </div>

                  <p className="text-xs text-[#554F70] leading-relaxed">
                    {isSuporte
                      ? 'Administrador mestre inalterável para suporte e manutenção da plataforma.'
                      : u.username.toLowerCase() === 'bianca'
                      ? 'Administradora: gerencia outros membros, senhas e configurações gerais.'
                      : 'Operador básico: opera ferramentas do dia a dia e pode alterar sua própria senha.'}
                  </p>

                  <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-xs">
                    <span className="text-[#68638C]">Status: Ativo</span>
                    <div className="flex items-center gap-2">
                      {(!isSuporte && (isAdminUser || isSelf)) && (
                        <button
                          onClick={() => {
                            setEditingTargetUser(u);
                            setNewUserName(u.username);
                            setNewUserPassword('');
                          }}
                          className="text-[#22205A] hover:text-[#D99426] font-bold"
                        >
                          Editar
                        </button>
                      )}
                      {(!isSuporte && isAdminUser && !isSelf) && (
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Novo Usuário */}
          {isUserModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
              <div className="bg-white border border-[#E5E0D8] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
                  <h3 className="font-bold text-[#22205A] text-base">Cadastrar Novo Usuário</h3>
                  <button onClick={() => setIsUserModalOpen(false)} className="text-[#68638C]">✕</button>
                </div>
                <form onSubmit={handleCreateUser} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#22205A]">Nome de Login</label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#22205A]">Senha Provisória</label>
                    <input
                      type="password"
                      required
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#22205A]">Nível de Acesso</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as any)}
                      className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="operador">Operador (Acesso às funções operacionais)</option>
                      <option value="admin">Administrador (Pode gerenciar outros usuários)</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-[#F0EBE1]">
                    <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-xs text-[#68638C]">
                      Cancelar
                    </button>
                    <button type="submit" className="px-4 py-2 bg-[#22205A] text-[#F0B55E] font-bold text-xs uppercase rounded-xl">
                      Criar Acesso
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Editar Usuário */}
          {editingTargetUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
              <div className="bg-white border border-[#E5E0D8] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
                  <h3 className="font-bold text-[#22205A] text-base">Editar Acesso: {editingTargetUser.username}</h3>
                  <button onClick={() => setEditingTargetUser(null)} className="text-[#68638C]">✕</button>
                </div>
                <form onSubmit={handleUpdateUser} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#22205A]">Nome de Login</label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#22205A]">Nova Senha (deixe em branco para manter a atual)</label>
                    <input
                      type="password"
                      placeholder="Nova senha opcional"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-[#F0EBE1]">
                    <button type="button" onClick={() => setEditingTargetUser(null)} className="px-4 py-2 text-xs text-[#68638C]">
                      Cancelar
                    </button>
                    <button type="submit" className="px-4 py-2 bg-[#22205A] text-[#F0B55E] font-bold text-xs uppercase rounded-xl">
                      Atualizar Acesso
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL EDITAR ARTIGO DO BLOG */}
      {isPostModalOpen && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-[#E5E0D8] rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <h3 className="font-heading text-base font-bold text-[#22205A]">
                {selectedPost.id.startsWith('post_') ? 'Novo Artigo' : 'Editar Artigo do Blog'}
              </h3>
              <button onClick={() => setIsPostModalOpen(false)} className="text-[#68638C]">✕</button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Título do Artigo</label>
                <input
                  type="text"
                  value={selectedPost.title}
                  onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Categoria</label>
                  <input
                    type="text"
                    value={selectedPost.category}
                    onChange={(e) => setSelectedPost({ ...selectedPost, category: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">URL da Imagem de Capa</label>
                  <input
                    type="url"
                    value={selectedPost.imageUrl}
                    onChange={(e) => setSelectedPost({ ...selectedPost, imageUrl: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Resumo / Excerpt</label>
                <textarea
                  rows={2}
                  value={selectedPost.excerpt}
                  onChange={(e) => setSelectedPost({ ...selectedPost, excerpt: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl p-3 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Conteúdo Completo (Texto)</label>
                <textarea
                  rows={8}
                  value={selectedPost.fullContent}
                  onChange={(e) => setSelectedPost({ ...selectedPost, fullContent: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl p-3 text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F0EBE1]">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#68638C]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const idx = blogPosts.findIndex(p => p.id === selectedPost.id);
                    if (idx >= 0) {
                      const copy = [...blogPosts];
                      copy[idx] = selectedPost;
                      setBlogPosts(copy);
                    } else {
                      setBlogPosts([selectedPost, ...blogPosts]);
                    }
                    setIsPostModalOpen(false);
                    setNotification({ type: 'success', text: 'Artigo atualizado no blog!' });
                  }}
                  className="px-5 py-2 rounded-xl bg-[#22205A] text-[#F0B55E] font-bold text-xs uppercase"
                >
                  Salvar Artigo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
