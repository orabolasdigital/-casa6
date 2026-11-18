/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo: Cadastros (CRM Master — Coração do Sistema)
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Send,
  Phone,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Tag,
  DollarSign,
  FileText,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Download
} from 'lucide-react';
import {
  CRMContactDetail,
  getCRMContactsList,
  saveCRMContactDetail,
  deleteCRMContactDetail
} from '../../../services/crmService';

type SortField = 'createdAt' | 'fullName' | 'totalInvested';
type SortOrder = 'asc' | 'desc';

export const OperationsCRM: React.FC = () => {
  const [contacts, setContacts] = useState<CRMContactDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // Aba Lateral (Gaveta de Histórico e Detalhes)
  const [selectedContact, setSelectedContact] = useState<CRMContactDetail | null>(null);

  // Modal de Criação / Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Partial<CRMContactDetail> | null>(null);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadContacts = async () => {
    const list = await getCRMContactsList();
    setContacts(list);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Extrair todas as tags únicas
  const allTags = Array.from(
    new Set(contacts.flatMap((c) => c.tags || []))
  );

  // Filtros e Ordenação
  const filteredAndSortedContacts = contacts
    .filter((contact) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        contact.fullName.toLowerCase().includes(q) ||
        contact.email.toLowerCase().includes(q) ||
        contact.whatsapp.includes(q) ||
        contact.city?.toLowerCase().includes(q);

      const matchesTag = selectedTag === 'all' || contact.tags?.includes(selectedTag);

      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'createdAt') {
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortField === 'fullName') {
        comparison = a.fullName.localeCompare(b.fullName);
      } else if (sortField === 'totalInvested') {
        comparison = (b.totalInvested || 0) - (a.totalInvested || 0);
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleOpenNewModal = () => {
    setEditingContact({
      id: '',
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      whatsapp: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      birthHour: '',
      birthMinute: '',
      city: '',
      state: 'SP',
      tags: ['Consulente'],
      notes: '',
      status: 'ativo'
    });
    setIsModalOpen(true);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;

    try {
      const saved = await saveCRMContactDetail(editingContact);
      setNotification({ type: 'success', text: `Contato "${saved.fullName}" salvo com sucesso no CRM!` });
      setIsModalOpen(false);
      setEditingContact(null);
      await loadContacts();
      if (selectedContact && selectedContact.id === saved.id) {
        setSelectedContact(saved);
      }
    } catch (err: any) {
      setNotification({ type: 'error', text: err?.message || 'Erro ao salvar contato.' });
    }
  };

  const handleDeleteContact = async (id: string, name: string) => {
    if (!window.confirm(`Deseja realmente excluir o cadastro de "${name}" do CRM?`)) return;
    try {
      await deleteCRMContactDetail(id);
      setNotification({ type: 'success', text: `Contato "${name}" removido do CRM.` });
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact(null);
      }
      await loadContacts();
    } catch {
      setNotification({ type: 'error', text: 'Erro ao remover contato.' });
    }
  };

  const handleOpenWhatsApp = (whatsapp: string, name: string) => {
    const cleanPhone = whatsapp.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const text = encodeURIComponent(`Olá, ${name.split(' ')[0]}! Aqui é a Bianca Tofoli da Casa 6. Tudo bem com você?`);
    window.open(`https://wa.me/${phoneWithCountry}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-fadeIn relative">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#372B69] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#F0B55E] text-xs font-bold uppercase tracking-widest">
            <Users className="h-4 w-4" />
            <span>Operações &bull; CRM de Cadastros</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Base Master de Clientes ({filteredAndSortedContacts.length})
          </h2>
          <p className="text-xs sm:text-sm text-[#DAD2C4]">
            Planilha inteligente do CRM ordenada pelo mais recente, com histórico de atendimentos, dados de nascimento e canal direto de WhatsApp.
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="py-2.5 px-4 rounded-xl bg-[#F0B55E] hover:bg-[#E5A344] text-[#1E1B4B] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Incluir Cadastro</span>
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

      {/* Barra de Filtro e Busca */}
      <div className="bg-[#1D1B48] border border-[#372B69] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DAD2C4]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, e-mail, whatsapp ou cidade..."
            className="w-full pl-9 pr-4 py-2 bg-[#2B2566] border border-[#372B69] focus:border-[#F0B55E] rounded-xl text-white text-xs placeholder:text-[#DAD2C4]/50 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-[#F0B55E]" />
            <span className="text-[#DAD2C4]">Tag:</span>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-[#2B2566] border border-[#372B69] rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none"
            >
              <option value="all">Todas ({contacts.length})</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Planilha de Cadastros */}
      <div className="bg-[#1D1B48] border border-[#372B69] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#DAD2C4]">
            <thead className="bg-[#2B2566] border-b border-[#372B69] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th
                  onClick={() => toggleSort('fullName')}
                  className="py-3 px-4 cursor-pointer hover:text-[#F0B55E] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Nome / Consulente</span>
                    {sortField === 'fullName' && (sortOrder === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
                  </div>
                </th>
                <th className="py-3 px-4">WhatsApp & Contato</th>
                <th className="py-3 px-4">Origem / Tags</th>
                <th
                  onClick={() => toggleSort('totalInvested')}
                  className="py-3 px-4 cursor-pointer hover:text-[#F0B55E] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Investimento</span>
                    {sortField === 'totalInvested' && (sortOrder === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('createdAt')}
                  className="py-3 px-4 cursor-pointer hover:text-[#F0B55E] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Cadastro</span>
                    {sortField === 'createdAt' && (sortOrder === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#372B69]">
              {filteredAndSortedContacts.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`hover:bg-[#25225a] transition-colors cursor-pointer ${
                    selectedContact?.id === contact.id ? 'bg-[#2B2566]' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-white text-sm">{contact.fullName}</div>
                    <div className="text-[11px] text-[#DAD2C4]/70">{contact.email}</div>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-white">{contact.whatsapp || '—'}</span>
                      {contact.whatsapp && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenWhatsApp(contact.whatsapp, contact.fullName);
                          }}
                          title="Enviar mensagem WhatsApp"
                          className="p-1 rounded bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                          <Send className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-[#2B2566] text-[#F0B55E] border border-[#F0B55E]/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-bold text-white">
                    R$ {(contact.totalInvested || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3 px-4 text-[11px] text-[#DAD2C4]/80">
                    {new Date(contact.createdAt).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setEditingContact(contact);
                          setIsModalOpen(true);
                        }}
                        title="Editar Cadastro"
                        className="p-1.5 text-[#DAD2C4] hover:text-white rounded"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id, contact.fullName)}
                        title="Excluir Cadastro"
                        className="p-1.5 text-red-400 hover:text-red-300 rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedContact(contact)}
                        title="Ver Histórico Completo"
                        className="p-1.5 text-[#F0B55E] hover:text-white rounded"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ABA LATERAL (GAVETA DE HISTÓRICO E DETALHES DO CADASTRO) */}
      {selectedContact && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#1D1B48] border-l border-[#F0B55E]/40 shadow-2xl p-6 overflow-y-auto space-y-6 animate-slideLeft">
          <div className="flex items-center justify-between border-b border-[#372B69] pb-4">
            <div>
              <span className="text-[10px] text-[#F0B55E] font-bold uppercase tracking-wider">
                Prontuário Cósmico / CRM
              </span>
              <h3 className="font-heading text-xl font-bold text-white">{selectedContact.fullName}</h3>
            </div>
            <button
              onClick={() => setSelectedContact(null)}
              className="p-2 text-[#DAD2C4] hover:text-white rounded-lg hover:bg-[#2B2566] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Dados Pessoais & Contato */}
          <div className="bg-[#2B2566] p-4 rounded-xl border border-white/5 space-y-3 text-xs">
            <h4 className="font-bold text-[#F0B55E] uppercase tracking-wider text-[11px]">
              Dados de Contato & Localização
            </h4>
            <div className="space-y-1 text-[#DAD2C4]">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#F0B55E]" />
                <span>{selectedContact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#F0B55E]" />
                <span>{selectedContact.whatsapp || 'Não informado'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#F0B55E]" />
                <span>{selectedContact.city ? `${selectedContact.city} - ${selectedContact.state}` : 'Não informado'}</span>
              </div>
            </div>

            <button
              onClick={() => handleOpenWhatsApp(selectedContact.whatsapp, selectedContact.fullName)}
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Chamar no WhatsApp</span>
            </button>
          </div>

          {/* Dados Astrológicos de Nascimento */}
          <div className="bg-[#2B2566] p-4 rounded-xl border border-white/5 space-y-2 text-xs">
            <h4 className="font-bold text-[#F0B55E] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Dados Natais (Mapa Astral)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[#DAD2C4]">
              <div><strong>Nascimento:</strong> {selectedContact.birthDay}/{selectedContact.birthMonth}/{selectedContact.birthYear || 'ND'}</div>
              <div><strong>Horário:</strong> {selectedContact.birthHour}:{selectedContact.birthMinute || 'ND'}</div>
            </div>
          </div>

          {/* Histórico de Serviços / Atendimentos */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs flex items-center justify-between">
              <span>Histórico de Atendimentos ({selectedContact.servicesHistory?.length || 0})</span>
              <span className="text-[#F0B55E] font-bold">
                Total: R$ {(selectedContact.totalInvested || 0).toFixed(2)}
              </span>
            </h4>

            {selectedContact.servicesHistory && selectedContact.servicesHistory.length > 0 ? (
              <div className="space-y-2">
                {selectedContact.servicesHistory.map((s) => (
                  <div key={s.id} className="p-3 bg-[#2B2566] rounded-xl border border-[#372B69] text-xs space-y-1">
                    <div className="flex items-center justify-between text-white font-bold">
                      <span>{s.serviceName}</span>
                      <span className="text-[#F0B55E]">R$ {s.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#DAD2C4]/70">
                      <span>Data: {s.date}</span>
                      <span className="capitalize">{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#DAD2C4]/60 italic">Nenhum atendimento arquivado ainda.</p>
            )}
          </div>

          {/* Observações Internas da Bianca */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#DAD2C4] uppercase tracking-wider text-xs">
              Anotações & Insights da Bianca
            </h4>
            <div className="p-3 bg-[#2B2566] rounded-xl border border-[#372B69] text-xs text-white leading-relaxed whitespace-pre-wrap">
              {selectedContact.notes || 'Sem anotações no momento.'}
            </div>
          </div>

          <div className="pt-4 border-t border-[#372B69] flex gap-3">
            <button
              onClick={() => {
                setEditingContact(selectedContact);
                setIsModalOpen(true);
              }}
              className="flex-1 py-2.5 rounded-xl bg-[#2B2566] hover:bg-[#372B69] border border-[#F0B55E]/40 text-[#F0B55E] font-bold text-xs uppercase"
            >
              Editar Dados
            </button>
            <button
              onClick={() => handleDeleteContact(selectedContact.id, selectedContact.fullName)}
              className="py-2.5 px-4 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-200 font-bold text-xs uppercase"
            >
              Excluir
            </button>
          </div>
        </div>
      )}

      {/* Modal de Cadastro / Edição */}
      {isModalOpen && editingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#1D1B48] border border-[#F0B55E]/40 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#372B69] pb-3">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-[#F0B55E]" />
                {editingContact.id ? 'Editar Cadastro no CRM' : 'Novo Cadastro no CRM'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#DAD2C4] hover:text-white text-sm">✕</button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#DAD2C4]">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={editingContact.fullName || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, fullName: e.target.value })}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#DAD2C4]">WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={editingContact.whatsapp || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, whatsapp: e.target.value })}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#DAD2C4]">E-mail</label>
                <input
                  type="email"
                  value={editingContact.email || ''}
                  onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                  className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#DAD2C4]">Dia Nasc.</label>
                  <input
                    type="text"
                    placeholder="DD"
                    value={editingContact.birthDay || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, birthDay: e.target.value })}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#DAD2C4]">Mês Nasc.</label>
                  <input
                    type="text"
                    placeholder="MM"
                    value={editingContact.birthMonth || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, birthMonth: e.target.value })}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#DAD2C4]">Ano Nasc.</label>
                  <input
                    type="text"
                    placeholder="AAAA"
                    value={editingContact.birthYear || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, birthYear: e.target.value })}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#DAD2C4]">Cidade</label>
                  <input
                    type="text"
                    value={editingContact.city || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, city: e.target.value })}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#DAD2C4]">Estado (UF)</label>
                  <input
                    type="text"
                    value={editingContact.state || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, state: e.target.value })}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#DAD2C4]">Observações Astrológicas</label>
                <textarea
                  rows={3}
                  value={editingContact.notes || ''}
                  onChange={(e) => setEditingContact({ ...editingContact, notes: e.target.value })}
                  className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#372B69]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-transparent hover:bg-white/5 text-xs text-[#DAD2C4]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#F0B55E] hover:bg-[#E5A344] text-[#1E1B4B] font-bold text-xs uppercase tracking-wider shadow-md"
                >
                  Salvar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
