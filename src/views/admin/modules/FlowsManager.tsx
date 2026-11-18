/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo: Fluxos & Integrações (Mensagens, Automações, Blog, Pagamento, Vinculações, Acessos)
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
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  Send,
  Sparkles,
  Lock,
  UserCheck,
  UserPlus,
  Edit2
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

  // Estados de Acessos RBAC
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingTargetUser, setEditingTargetUser] = useState<AdminUser | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'operador'>('operador');
  const [showNewUserPass, setShowNewUserPass] = useState(false);

  // Blog Caderno Astral
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 'post_1',
      title: 'Saturno em Peixes e a Dissolução das Ilusões',
      slug: 'saturno-em-peixes',
      date: '2026-11-10',
      category: 'Trânsitos Maiores',
      views: 342,
      published: true
    },
    {
      id: 'post_2',
      title: 'Como a Casa 6 Revela a sua Cura Diária',
      slug: 'casa-6-cura-diaria',
      date: '2026-11-02',
      category: 'Fundamentos',
      views: 512,
      published: true
    }
  ]);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    getPaymentCredentials().then(setPaymentConfig);
    getTrackingSettings().then(setTrackingConfig);
    getWhatsAppTemplates().then(setTemplates);
    getEmailAutomationSettings().then(setAutomationConfig);
    getAdminUsersList().then(setAdminUsers);
  }, []);

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentConfig) return;
    try {
      await savePaymentCredentials(paymentConfig);
      setNotification({ type: 'success', text: 'Credenciais do Mercado Pago atualizadas com sucesso!' });
    } catch {
      setNotification({ type: 'error', text: 'Erro ao salvar credenciais de pagamento.' });
    }
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingConfig) return;
    try {
      await saveTrackingSettings(trackingConfig);
      setNotification({ type: 'success', text: 'Pixels e códigos de vinculação atualizados!' });
    } catch {
      setNotification({ type: 'error', text: 'Erro ao salvar vinculações.' });
    }
  };

  const handleSaveTemplates = async () => {
    try {
      await saveWhatsAppTemplates(templates);
      setNotification({ type: 'success', text: 'Templates de WhatsApp atualizados com sucesso!' });
    } catch {
      setNotification({ type: 'error', text: 'Erro ao salvar templates.' });
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
    <div className="space-y-8 animate-fadeIn">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#372B69] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#F0B55E] text-xs font-bold uppercase tracking-widest">
            <Share2 className="h-4 w-4" />
            <span>Fluxos &bull; Automação & Conexões</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Automações, Mensageria & Integrações
          </h2>
          <p className="text-xs sm:text-sm text-[#DAD2C4]">
            Configure disparos do WhatsApp com variáveis dinâmicas, e-mails de alerta, Mercado Pago, Pixels de tracking e acessos ao painel.
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

      {/* Sub-Tabs de Fluxos */}
      <div className="flex flex-wrap gap-2 border-b border-[#372B69] pb-3">
        {[
          { id: 'fluxo_mensagens', label: 'Mensagens WhatsApp', icon: MessageSquare },
          { id: 'fluxo_automacoes', label: 'Automações & E-mail', icon: Mail },
          { id: 'fluxo_blog', label: 'Blog (Caderno Astral)', icon: BookOpen },
          { id: 'fluxo_pagamento', label: 'Mercado Pago', icon: CreditCard },
          { id: 'fluxo_vinculacoes', label: 'Vinculações & Pixels', icon: Share2 },
          { id: 'fluxo_acessos', label: 'Acessos & Usuários', icon: Shield }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FlowSubTab)}
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

      {/* SUB-ABA: MENSAGENS WHATSAPP */}
      {activeTab === 'fluxo_mensagens' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold text-white">Templates Oficiais de WhatsApp</h3>
              <p className="text-xs text-[#DAD2C4]">
                Utilize as variáveis dinâmicas: <code>{'{nome}'}</code>, <code>{'{servico}'}</code>, <code>{'{data}'}</code>, <code>{'{horario}'}</code>, <code>{'{link_meet}'}</code>.
              </p>
            </div>
            <button
              onClick={handleSaveTemplates}
              className="py-2 px-4 rounded-xl bg-[#F0B55E] text-[#1E1B4B] font-bold text-xs uppercase shadow-md flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" /> Salvar Templates
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((tpl, idx) => (
              <div key={tpl.id} className="bg-[#1D1B48] border border-[#372B69] rounded-2xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{tpl.title}</h4>
                  <span className="text-[10px] uppercase font-bold text-[#F0B55E] bg-[#2B2566] px-2 py-0.5 rounded">
                    {tpl.category}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 text-[10px] text-[#DAD2C4]/70">
                  <span>Variáveis:</span>
                  {tpl.variables.map((v) => (
                    <code key={v} className="bg-[#2B2566] text-[#F0B55E] px-1 rounded">{v}</code>
                  ))}
                </div>

                <textarea
                  rows={6}
                  value={tpl.content}
                  onChange={(e) => {
                    const next = [...templates];
                    next[idx].content = e.target.value;
                    setTemplates(next);
                  }}
                  className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl p-3 text-xs text-white leading-relaxed font-mono"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-ABA: AUTOMAÇÕES & E-MAIL */}
      {activeTab === 'fluxo_automacoes' && automationConfig && (
        <form onSubmit={handleSaveAutomation} className="bg-[#1D1B48] border border-[#372B69] rounded-2xl p-6 shadow-xl space-y-6 max-w-2xl">
          <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2 border-b border-[#372B69] pb-3">
            <Mail className="h-5 w-5 text-[#F0B55E]" />
            Disparos Automáticos de E-mail (Gmail & SMTP)
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#DAD2C4]">E-mail Remetente Autorizado (Gmail/Google Workspace)</label>
              <input
                type="email"
                value={automationConfig.senderGmail}
                onChange={(e) => setAutomationConfig({ ...automationConfig, senderGmail: e.target.value })}
                className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#DAD2C4]">E-mail da Bianca para Cópia Oculta de Alertas</label>
              <input
                type="email"
                value={automationConfig.biancaNotificationEmail}
                onChange={(e) => setAutomationConfig({ ...automationConfig, biancaNotificationEmail: e.target.value })}
                className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={automationConfig.copyToBianca}
                  onChange={(e) => setAutomationConfig({ ...automationConfig, copyToBianca: e.target.checked })}
                  className="rounded text-[#F0B55E] focus:ring-0"
                />
                <span>Enviar cópia de cada compra ou formulário para o e-mail da Bianca</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={automationConfig.welcomeTemplateActive}
                  onChange={(e) => setAutomationConfig({ ...automationConfig, welcomeTemplateActive: e.target.checked })}
                  className="rounded text-[#F0B55E] focus:ring-0"
                />
                <span>Disparar e-mail de Boas-Vindas cósmico para novos membros da Patota e Bússolas</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={automationConfig.leadAlertActive}
                  onChange={(e) => setAutomationConfig({ ...automationConfig, leadAlertActive: e.target.checked })}
                  className="rounded text-[#F0B55E] focus:ring-0"
                />
                <span>Alerta imediato quando uma empresa solicitar proposta em /palestras ou /parcerias</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-[#F0B55E] text-[#1E1B4B] font-bold text-xs uppercase tracking-wider shadow-md"
          >
            Salvar Automações
          </button>
        </form>
      )}

      {/* SUB-ABA: BLOG CADERNO ASTRAL */}
      {activeTab === 'fluxo_blog' && (
        <div className="bg-[#1D1B48] border border-[#372B69] rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#372B69] pb-3">
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#F0B55E]" />
                Editor de Leituras do Caderno Astral (/leituras)
              </h3>
              <p className="text-xs text-[#DAD2C4]">
                Publicação de artigos aprofundados, ensaios astrológicos, imagens de destaque e otimização para o Google (SEO).
              </p>
            </div>
            <button className="py-2 px-3 rounded-lg bg-[#F0B55E] text-[#1E1B4B] font-bold text-xs uppercase flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Novo Artigo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogPosts.map((post) => (
              <div key={post.id} className="p-4 bg-[#2B2566] rounded-xl border border-[#372B69] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#F0B55E] font-bold">
                  <span>{post.category}</span>
                  <span className="text-[#DAD2C4] font-normal">{post.views} leituras</span>
                </div>
                <h4 className="text-white font-bold text-sm">{post.title}</h4>
                <p className="text-xs text-[#DAD2C4]/70 font-mono">slug: /{post.slug}</p>
                <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs">
                  <span className="text-emerald-400 font-bold">● Publicado</span>
                  <div className="flex items-center gap-2">
                    <button className="text-[#F0B55E] hover:underline">Editar Texto</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-ABA: MERCADO PAGO */}
      {activeTab === 'fluxo_pagamento' && paymentConfig && (
        <form onSubmit={handleSavePayment} className="bg-[#1D1B48] border border-[#372B69] rounded-2xl p-6 shadow-xl space-y-6 max-w-2xl">
          <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2 border-b border-[#372B69] pb-3">
            <CreditCard className="h-5 w-5 text-[#F0B55E]" />
            Credenciais do Mercado Pago (Checkout Transparente)
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#DAD2C4]">Public Key (Chave Pública)</label>
              <input
                type="text"
                value={paymentConfig.publicKey}
                onChange={(e) => setPaymentConfig({ ...paymentConfig, publicKey: e.target.value })}
                className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#DAD2C4]">Access Token (Chave de Acesso Segura)</label>
                <button
                  type="button"
                  onClick={() => setShowAccessToken(!showAccessToken)}
                  className="text-[11px] text-[#F0B55E] hover:underline"
                >
                  {showAccessToken ? 'Ocultar' : 'Visualizar'}
                </button>
              </div>
              <input
                type={showAccessToken ? 'text' : 'password'}
                value={paymentConfig.accessToken}
                onChange={(e) => setPaymentConfig({ ...paymentConfig, accessToken: e.target.value })}
                className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#DAD2C4]">Webhook Secret (Assinatura do Webhook)</label>
                <button
                  type="button"
                  onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                  className="text-[11px] text-[#F0B55E] hover:underline"
                >
                  {showWebhookSecret ? 'Ocultar' : 'Visualizar'}
                </button>
              </div>
              <input
                type={showWebhookSecret ? 'text' : 'password'}
                value={paymentConfig.webhookSecret}
                onChange={(e) => setPaymentConfig({ ...paymentConfig, webhookSecret: e.target.value })}
                className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white font-mono text-xs"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentConfig.isSandbox}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, isSandbox: e.target.checked })}
                  className="rounded text-[#F0B55E] focus:ring-0"
                />
                <span>Modo Sandbox (Testes de Cartão sem cobrança real)</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-[#F0B55E] text-[#1E1B4B] font-bold text-xs uppercase tracking-wider shadow-md"
          >
            Salvar Chaves de Pagamento
          </button>
        </form>
      )}

      {/* SUB-ABA: VINCULAÇÕES & PIXELS */}
      {activeTab === 'fluxo_vinculacoes' && trackingConfig && (
        <form onSubmit={handleSaveTracking} className="bg-[#1D1B48] border border-[#372B69] rounded-2xl p-6 shadow-xl space-y-6 max-w-3xl">
          <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2 border-b border-[#372B69] pb-3">
            <Share2 className="h-5 w-5 text-[#F0B55E]" />
            Pixels de Conversão & Vinculações de Mídia
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#DAD2C4]">Google Tag Manager (ID)</label>
              <input
                type="text"
                placeholder="GTM-XXXXXX"
                value={trackingConfig.googleTagManagerId}
                onChange={(e) => setTrackingConfig({ ...trackingConfig, googleTagManagerId: e.target.value })}
                className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#DAD2C4]">Google Analytics 4 (Measurement ID)</label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={trackingConfig.googleAnalytics4Id}
                onChange={(e) => setTrackingConfig({ ...trackingConfig, googleAnalytics4Id: e.target.value })}
                className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#DAD2C4]">Meta Ads / Pixel (Facebook/Instagram)</label>
              <input
                type="text"
                placeholder="1234567890..."
                value={trackingConfig.metaPixelId}
                onChange={(e) => setTrackingConfig({ ...trackingConfig, metaPixelId: e.target.value })}
                className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#DAD2C4]">Google Ads Conversion Tag</label>
              <input
                type="text"
                placeholder="AW-XXXXXXXXX"
                value={trackingConfig.googleAdsId}
                onChange={(e) => setTrackingConfig({ ...trackingConfig, googleAdsId: e.target.value })}
                className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#DAD2C4]">Scripts Customizados no Head (HTML)</label>
              <textarea
                rows={3}
                placeholder="<!-- Scripts adicionais para o cabeçalho -->"
                value={trackingConfig.customHeadScript}
                onChange={(e) => setTrackingConfig({ ...trackingConfig, customHeadScript: e.target.value })}
                className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl p-3 text-white text-xs font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-[#F0B55E] text-[#1E1B4B] font-bold text-xs uppercase tracking-wider shadow-md"
          >
            Salvar Códigos de Rastreamento
          </button>
        </form>
      )}

      {/* SUB-ABA: ACESSOS & ADMINISTRADORES (RBAC) */}
      {activeTab === 'fluxo_acessos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#F0B55E]" />
                Controle de Acessos ao Painel
              </h3>
              <p className="text-xs text-[#DAD2C4]">
                <strong>Suporte</strong> (Mestre imutável), <strong>Bianca</strong> (Administradora com poderes de criar/excluir) e <strong>Caio</strong> (Operador básico).
              </p>
            </div>

            {isAdminUser && (
              <button
                onClick={() => setIsUserModalOpen(true)}
                className="py-2.5 px-4 rounded-xl bg-[#F0B55E] hover:bg-[#E5A344] text-[#1E1B4B] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <UserPlus className="h-4 w-4" />
                <span>Novo Usuário</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adminUsers.map((u) => {
              const isMaster = u.username.toLowerCase() === 'suporte';
              return (
                <div key={u.id} className="bg-[#1D1B48] border border-[#372B69] rounded-2xl p-6 shadow-xl space-y-4 relative">
                  {isMaster && (
                    <span className="absolute top-4 right-4 text-[9px] bg-[#2B2566] text-[#F0B55E] border border-[#F0B55E]/40 px-2 py-0.5 rounded-full font-bold uppercase">
                      Mestre Protegido
                    </span>
                  )}
                  <div>
                    <h4 className="font-heading text-lg font-bold text-white capitalize">{u.username}</h4>
                    <span className="text-xs text-[#F0B55E] uppercase font-bold">
                      {u.role === 'master' ? 'Super Mestre' : u.role === 'admin' ? 'Administradora' : 'Operador'}
                    </span>
                  </div>

                  <p className="text-xs text-[#DAD2C4] leading-relaxed">
                    {isMaster
                      ? 'Administrador mestre irremovível e imutável para suporte e manutenção da plataforma.'
                      : u.username.toLowerCase() === 'bianca'
                      ? 'Administradora completa: gerencia membros, senhas e configurações de todo o sistema.'
                      : 'Operador básico: opera ferramentas do dia a dia e pode alterar apenas sua própria senha.'}
                  </p>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[#DAD2C4]/70">Status: Ativo</span>
                    {!isMaster && isAdminUser && (
                      <button
                        onClick={() => handleDeleteUser(u)}
                        className="text-red-400 hover:text-red-300 font-bold"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal de Criação de Usuário */}
          {isUserModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
              <div className="bg-[#1D1B48] border border-[#F0B55E]/40 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#372B69] pb-3">
                  <h3 className="font-bold text-white text-base">Cadastrar Novo Usuário</h3>
                  <button onClick={() => setIsUserModalOpen(false)} className="text-[#DAD2C4]">✕</button>
                </div>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#DAD2C4]">Nome de Login</label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#DAD2C4]">Senha Provisória</label>
                    <input
                      type={showNewUserPass ? 'text' : 'password'}
                      required
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#DAD2C4]">Nível de Acesso</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as any)}
                      className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                    >
                      <option value="operador">Operador (Acesso às funções operacionais)</option>
                      <option value="admin">Administrador (Pode gerenciar usuários)</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-[#372B69]">
                    <button
                      type="button"
                      onClick={() => setIsUserModalOpen(false)}
                      className="px-4 py-2 text-xs text-[#DAD2C4]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#F0B55E] text-[#1E1B4B] font-bold text-xs uppercase rounded-xl"
                    >
                      Criar Acesso
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
