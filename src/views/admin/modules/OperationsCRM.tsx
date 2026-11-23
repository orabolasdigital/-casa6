/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo: Cadastros (CRM Master — Coração do Sistema)
 * Visualização Estilo Planilha Excel com Sub-Abas:
 * 1. Geral (Planilha Geral de Todos os Clientes)
 * 2. Patota (Assinantes, Entrada, Status e Alertas de Tempo: 1m, 3m, 6m, 12m)
 * 3. Bússola (Dados Astrológicos e Mapas Natais Astro.com)
 * Tema Claro (Light Theme)
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Send,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  X,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Download,
  Cake,
  Eye,
  CloudUpload,
  RefreshCw,
  Compass,
  Award
} from 'lucide-react';
import {
  CRMContactDetail,
  getCRMContactsList,
  saveCRMContactDetail,
  deleteCRMContactDetail,
  syncAllContactsToFirestore,
  calculatePatotaTenure,
  PatotaMilestone
} from '../../../services/crmService';
import {
  calculateAstroProfile,
  ASTRO_SIGNS,
  MONTH_NAMES,
  SIGN_SYMBOLS,
  inferGender,
  cleanPhone
} from '../../../utils/astroEngine';

export type CRMSubTab = 'geral' | 'patota' | 'bussola';

type SortColumn =
  | 'cadastro'
  | 'nome'
  | 'sobrenome'
  | 'apelido'
  | 'genero'
  | 'idade'
  | 'whatsapp'
  | 'email'
  | 'dataNascimento'
  | 'mesNumero'
  | 'horarioNascimento'
  | 'cidade'
  | 'uf'
  | 'sol'
  | 'lua'
  | 'ascendente'
  | 'venus'
  | 'marte'
  | 'quiron'
  | 'jupiter'
  | 'saturno'
  | 'meioDoCeu'
  | 'patotaStatus'
  | 'patotaAssinatura'
  | 'clienteDesde'
  | 'ultimaEntrega';

type SortOrder = 'asc' | 'desc';

export const OperationsCRM: React.FC = () => {
  const [contacts, setContacts] = useState<CRMContactDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number } | null>(null);

  // Sub-Aba Ativa: 'geral' | 'patota' | 'bussola'
  const [activeSubTab, setActiveSubTab] = useState<CRMSubTab>('geral');

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Feminino' | 'Masculino'>('all');
  const [patotaFilter, setPatotaFilter] = useState<string>('all');
  const [patotaMilestoneFilter, setPatotaMilestoneFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [sunSignFilter, setSunSignFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');

  // Ordenação
  const [sortColumn, setSortColumn] = useState<SortColumn>('cadastro');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Paginação Excel
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Gaveta Lateral (Prontuário Cósmico)
  const [selectedContact, setSelectedContact] = useState<CRMContactDetail | null>(null);

  // Modal Novo / Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Partial<CRMContactDetail> | null>(null);

  // Notificação
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const list = await getCRMContactsList();
      setContacts(list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Sincronização em lote para a coleção Firestore
  const handleSyncFirestore = async () => {
    setIsSyncing(true);
    setNotification(null);
    try {
      const res = await syncAllContactsToFirestore((current, total) => {
        setSyncProgress({ current, total });
      });

      if (res.success) {
        setNotification({
          type: 'success',
          text: `Sucesso! Todos os ${res.totalSynced} cadastros foram sincronizados na coleção 'crm_contatos' do Firestore!`
        });
      } else {
        setNotification({
          type: 'success',
          text: `Base de ${contacts.length} cadastros ativa no repositório local e pronta para uso.`
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        text: err?.message || 'Erro ao sincronizar com Firestore.'
      });
    } finally {
      setIsSyncing(false);
      setSyncProgress(null);
    }
  };

  // Extrair estados únicos para filtro
  const uniqueStates = useMemo(() => {
    const states = contacts
      .map((c) => c.uf?.trim())
      .filter((uf): uf is string => Boolean(uf && uf.length === 2));
    return Array.from(new Set(states)).sort();
  }, [contacts]);

  const currentMonthNumber = useMemo(() => new Date().getMonth() + 1, []);

  // Métricas rápidas globais
  const metrics = useMemo(() => {
    const total = contacts.length;
    const patotaTotal = contacts.filter((c) => c.patotaStatus === 'Ativo' || c.patotaStatus === 'Inativo').length;
    const patotaAtivos = contacts.filter((c) => c.patotaStatus === 'Ativo').length;
    const patotaInativos = contacts.filter((c) => c.patotaStatus === 'Inativo').length;
    const patotaAlertas = contacts.filter((c) => {
      if (c.patotaStatus !== 'Ativo') return false;
      const tenure = calculatePatotaTenure(c.clienteDesde, c.apelido || c.nome);
      return Boolean(tenure.milestone);
    }).length;
    const comMapaCalculado = contacts.filter((c) => Boolean(c.sol && c.ascendente)).length;
    const aniversariantesMes = contacts.filter(
      (c) => c.mesNumero === currentMonthNumber || c.mesNascimento?.toLowerCase().includes(MONTH_NAMES[currentMonthNumber - 1]?.toLowerCase())
    ).length;

    return { total, patotaTotal, patotaAtivos, patotaInativos, patotaAlertas, comMapaCalculado, aniversariantesMes };
  }, [contacts, currentMonthNumber]);

  // Filtragem e Ordenação contextual por Sub-Aba
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // 1. Filtro da Sub-Aba Patota
      if (activeSubTab === 'patota') {
        const isPatota = contact.patotaStatus === 'Ativo' || contact.patotaStatus === 'Inativo';
        if (!isPatota) return false;

        if (patotaFilter !== 'all' && contact.patotaStatus !== patotaFilter) {
          return false;
        }

        if (patotaMilestoneFilter !== 'all') {
          const tenure = calculatePatotaTenure(contact.clienteDesde, contact.apelido || contact.nome);
          if (patotaMilestoneFilter === 'com_marcos') {
            if (!tenure.milestone) return false;
          } else if (tenure.milestone?.type !== patotaMilestoneFilter) {
            return false;
          }
        }
      }

      // 2. Filtro da Sub-Aba Bússola
      if (activeSubTab === 'bussola') {
        // Na aba Bússola, permite visualizar todos ou os que têm mapa
      }

      // Busca textual genérica
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchText =
          contact.nome.toLowerCase().includes(q) ||
          contact.sobrenome.toLowerCase().includes(q) ||
          contact.fullName.toLowerCase().includes(q) ||
          contact.apelido.toLowerCase().includes(q) ||
          contact.email.toLowerCase().includes(q) ||
          contact.whatsapp.includes(q) ||
          contact.cidade.toLowerCase().includes(q) ||
          contact.uf.toLowerCase().includes(q) ||
          contact.sol.toLowerCase().includes(q) ||
          contact.lua.toLowerCase().includes(q) ||
          contact.ascendente.toLowerCase().includes(q) ||
          contact.patotaStatus.toLowerCase().includes(q);

        if (!matchText) return false;
      }

      if (genderFilter !== 'all' && contact.genero !== genderFilter) return false;

      // Filtro de Mês de Nascimento (disponível para filtrar, sem a coluna na tabela)
      if (monthFilter !== 'all') {
        const targetMonthNum = parseInt(monthFilter, 10);
        if (contact.mesNumero !== targetMonthNum && contact.mesNascimento !== MONTH_NAMES[targetMonthNum - 1]) {
          return false;
        }
      }

      // Filtro de Patota na aba Geral
      if (activeSubTab === 'geral' && patotaFilter !== 'all' && contact.patotaStatus !== patotaFilter) {
        return false;
      }

      if (sunSignFilter !== 'all' && contact.sol !== sunSignFilter) return false;
      if (stateFilter !== 'all' && contact.uf !== stateFilter) return false;

      return true;
    });
  }, [contacts, activeSubTab, searchQuery, genderFilter, patotaFilter, patotaMilestoneFilter, monthFilter, sunSignFilter, stateFilter]);

  const sortedContacts = useMemo(() => {
    return [...filteredContacts].sort((a, b) => {
      let comparison = 0;
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (valA === undefined || valA === null || valA === '') return 1;
      if (valB === undefined || valB === null || valB === '') return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      } else {
        comparison = String(valA).localeCompare(String(valB), 'pt-BR', { numeric: true });
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredContacts, sortColumn, sortOrder]);

  const totalPages = Math.ceil(sortedContacts.length / pageSize) || 1;
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedContacts.slice(start, start + pageSize);
  }, [sortedContacts, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubTab, searchQuery, genderFilter, patotaFilter, patotaMilestoneFilter, monthFilter, sunSignFilter, stateFilter, pageSize]);

  const toggleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  // Exportação dinâmica de CSV conforme a aba ativa
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (activeSubTab === 'patota') {
      headers = [
        'Cadastro',
        'Nome',
        'Sobrenome',
        'Apelido',
        'Gênero',
        'WhatsApp',
        'E-mail',
        'Data de Nascimento',
        'Status',
        'Entrada',
        'Tempo no Grupo',
        'Alerta de Marco'
      ];
      rows = sortedContacts.map((c) => {
        const tenure = calculatePatotaTenure(c.clienteDesde, c.apelido || c.nome);
        return [
          c.cadastro,
          c.nome,
          c.sobrenome,
          c.apelido,
          c.genero,
          c.whatsapp,
          c.email,
          c.dataNascimento,
          c.patotaStatus,
          c.clienteDesde,
          tenure.formattedText,
          tenure.milestone?.label || '—'
        ];
      });
    } else if (activeSubTab === 'bussola') {
      headers = [
        'Cadastro',
        'Nome',
        'Sobrenome',
        'Apelido',
        'Gênero',
        'Data de Nascimento',
        'Horário de Nascimento',
        'Cidade',
        'UF',
        'Sol',
        'Lua',
        'Ascendente',
        'Vênus',
        'Marte',
        'Quíron',
        'Júpiter',
        'Saturno',
        'Meio do Céu'
      ];
      rows = sortedContacts.map((c) => [
        c.cadastro,
        c.nome,
        c.sobrenome,
        c.apelido,
        c.genero,
        c.dataNascimento,
        c.horarioNascimento,
        c.cidade,
        c.uf,
        c.sol,
        c.lua,
        c.ascendente,
        c.venus,
        c.marte,
        c.quiron,
        c.jupiter,
        c.saturno,
        c.meioDoCeu
      ]);
    } else {
      // Geral
      headers = [
        'Cadastro',
        'Nome',
        'Sobrenome',
        'Apelido',
        'Gênero',
        'Idade',
        'WhatsApp',
        'E-mail',
        'Data Nascimento',
        'Horário Nascimento',
        'Cidade',
        'UF',
        'Sol',
        'Lua',
        'Ascendente',
        'Vênus',
        'Marte',
        'Quíron',
        'Júpiter',
        'Saturno',
        'Meio do Céu'
      ];
      rows = sortedContacts.map((c) => [
        c.cadastro,
        c.nome,
        c.sobrenome,
        c.apelido,
        c.genero,
        c.idade ?? '',
        c.whatsapp,
        c.email,
        c.dataNascimento,
        c.horarioNascimento,
        c.cidade,
        c.uf,
        c.sol,
        c.lua,
        c.ascendente,
        c.venus,
        c.marte,
        c.quiron,
        c.jupiter,
        c.saturno,
        c.meioDoCeu
      ]);
    }

    const csvContent = [
      headers.map((h) => `"${h}"`).join(';'),
      ...rows.map((row) => row.map((val) => `"${String(val || '').replace(/"/g, '""')}"`).join(';'))
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `casa6_crm_${activeSubTab}_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setNotification({
      type: 'success',
      text: `Exportação da aba "${activeSubTab.toUpperCase()}" concluída! ${sortedContacts.length} contatos exportados para Excel.`
    });
  };

  const handleOpenWhatsApp = (whatsapp: string, apelidoOrNome: string, customGreeting?: string) => {
    const cleanDigits = whatsapp.replace(/\D/g, '');
    if (!cleanDigits) {
      alert('Número de WhatsApp não informado para este cadastro.');
      return;
    }
    const phoneWithCountry = cleanDigits.startsWith('55') ? cleanDigits : `55${cleanDigits}`;
    const greeting =
      customGreeting ||
      `Olá, ${apelidoOrNome || 'querida(o)'}! Aqui é a Bianca Tófoli da Casa 6. Tudo bem com você?`;
    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(greeting)}`, '_blank');
  };

  const handleOpenNewModal = () => {
    setEditingContact({
      id: '',
      cadastro: new Date().toLocaleDateString('pt-BR'),
      nome: '',
      sobrenome: '',
      fullName: '',
      apelido: '',
      genero: 'Feminino',
      ddd: '',
      telefone: '',
      whatsapp: '',
      email: '',
      dataNascimento: '',
      horarioNascimento: '',
      cidade: '',
      uf: 'SP',
      sol: '',
      lua: '',
      ascendente: '',
      venus: '',
      marte: '',
      quiron: '',
      jupiter: '',
      saturno: '',
      meioDoCeu: '',
      patotaStatus: activeSubTab === 'patota' ? 'Ativo' : 'Não Assinante',
      patotaAssinatura: '—',
      clienteDesde: new Date().toLocaleDateString('pt-BR'),
      ultimaEntrega: new Date().toLocaleDateString('pt-BR'),
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleEditContact = (contact: CRMContactDetail) => {
    setEditingContact({ ...contact });
    setIsModalOpen(true);
  };

  const handleModalBirthChange = (dataNasc: string, horaNasc: string) => {
    if (!editingContact) return;
    const astro = calculateAstroProfile(dataNasc, horaNasc);
    setEditingContact({
      ...editingContact,
      dataNascimento: dataNasc,
      horarioNascimento: horaNasc,
      idade: astro.idade,
      mesNascimento: astro.mesNascimento,
      mesNumero: astro.mesNumero,
      sol: astro.sol || editingContact.sol || '',
      ascendente: astro.ascendente || editingContact.ascendente || '',
      lua: astro.lua || editingContact.lua || '',
      venus: astro.venus || editingContact.venus || '',
      marte: astro.marte || editingContact.marte || '',
      quiron: astro.quiron || editingContact.quiron || '',
      jupiter: astro.jupiter || editingContact.jupiter || '',
      saturno: astro.saturno || editingContact.saturno || '',
      meioDoCeu: astro.meioDoCeu || editingContact.meioDoCeu || ''
    });
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;

    try {
      const saved = await saveCRMContactDetail(editingContact);
      setNotification({
        type: 'success',
        text: `Cadastro de "${saved.fullName}" gravado com sucesso no CRM da Casa 6!`
      });
      setIsModalOpen(false);
      setEditingContact(null);
      await loadContacts();
      if (selectedContact && selectedContact.id === saved.id) {
        setSelectedContact(saved);
      }
    } catch (err: any) {
      setNotification({ type: 'error', text: err?.message || 'Erro ao gravar contato no banco.' });
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

  return (
    <div className="space-y-6 animate-fadeIn text-[#22205A] relative">
      {/* Cabeçalho do Módulo */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#E5E0D8] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#D99426] text-xs font-bold uppercase tracking-widest">
            <Users className="h-4 w-4" />
            <span>Operações &bull; Cadastros (CRM Master)</span>
          </div>
          <h2 className="text-2xl font-heading font-black text-[#22205A] mt-1">
            {activeSubTab === 'geral' && `Planilha Geral (${filteredContacts.length} de ${contacts.length})`}
            {activeSubTab === 'patota' && `Assinantes da Patota (${filteredContacts.length} membros)`}
            {activeSubTab === 'bussola' && `Bússola & Mapas Natais (${filteredContacts.length} cadastros)`}
          </h2>
          <p className="text-xs sm:text-sm text-[#68638C]">
            {activeSubTab === 'geral' && (
              <>Visualização completa dos cadastros com coluna inicial <strong>Cadastro</strong> (último acesso/serviço) e dados natais calculados.</>
            )}
            {activeSubTab === 'patota' && (
              <>Gestão de membros do grupo WhatsApp, data de <strong>Entrada</strong>, tempo de permanência e alertas de <strong>1, 3, 6 e 12 meses</strong>.</>
            )}
            {activeSubTab === 'bussola' && (
              <>Visão astrológica de alta precisão com motor <strong>Astro.com</strong> (Sol, Lua, Ascendente, Vênus, Marte, Quíron, Júpiter, Saturno e MC).</>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Botão de Sincronização em Massa com Firestore */}
          <button
            onClick={handleSyncFirestore}
            disabled={isSyncing}
            title="Sincronizar todos os contatos com a coleção 'crm_contatos' no Firestore"
            className="py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#22205A] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <CloudUpload className={`h-4 w-4 text-[#7C3AED] ${isSyncing ? 'animate-bounce' : ''}`} />
            <span>
              {isSyncing
                ? syncProgress
                  ? `Sincronizando ${syncProgress.current}/${syncProgress.total}...`
                  : 'Sincronizando...'
                : `Sincronizar Firestore (${contacts.length})`}
            </span>
          </button>

          <button
            onClick={handleExportCSV}
            title={`Exportar dados da aba ${activeSubTab.toUpperCase()} para Excel (.csv com UTF-8)`}
            className="py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#DCD6CC] text-[#22205A] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            <span>Exportar Excel ({activeSubTab.toUpperCase()})</span>
          </button>

          <button
            onClick={handleOpenNewModal}
            className="py-2.5 px-4 rounded-xl bg-[#22205A] hover:bg-[#1B1948] text-[#F0B55E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Cadastro</span>
          </button>
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

      {/* NAVEGAÇÃO DE SUB-ABAS: GERAL | PATOTA | BÚSSOLA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#FAF8F5] p-2 rounded-2xl border border-[#E5E0D8]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-Aba 1: Geral */}
          <button
            onClick={() => setActiveSubTab('geral')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === 'geral'
                ? 'bg-[#22205A] text-[#FAF8F5] shadow-sm'
                : 'bg-white text-[#554F70] hover:bg-[#F3EFEA] border border-[#E5E0D8]'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Geral</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeSubTab === 'geral' ? 'bg-[#F0B55E] text-[#22205A]' : 'bg-[#EFECE6] text-[#68638C]'
              }`}
            >
              {contacts.length}
            </span>
          </button>

          {/* Sub-Aba 2: Patota */}
          <button
            onClick={() => setActiveSubTab('patota')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === 'patota'
                ? 'bg-[#D99426] text-white shadow-sm'
                : 'bg-white text-[#554F70] hover:bg-[#F3EFEA] border border-[#E5E0D8]'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Patota</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeSubTab === 'patota' ? 'bg-[#22205A] text-[#FAF8F5]' : 'bg-[#EFECE6] text-[#68638C]'
              }`}
            >
              {metrics.patotaTotal}
            </span>
            {metrics.patotaAlertas > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] bg-rose-500 text-white font-black px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                🎉 {metrics.patotaAlertas} marco{metrics.patotaAlertas > 1 ? 's' : ''}!
              </span>
            )}
          </button>

          {/* Sub-Aba 3: Bússola */}
          <button
            onClick={() => setActiveSubTab('bussola')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === 'bussola'
                ? 'bg-[#4B3B82] text-[#FAF8F5] shadow-sm'
                : 'bg-white text-[#554F70] hover:bg-[#F3EFEA] border border-[#E5E0D8]'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Bússola</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeSubTab === 'bussola' ? 'bg-[#D99426] text-white' : 'bg-[#EFECE6] text-[#68638C]'
              }`}
            >
              {metrics.comMapaCalculado}
            </span>
          </button>
        </div>

        {/* Informação contextual */}
        <div className="text-[11px] text-[#68638C] px-2">
          {activeSubTab === 'geral' && (
            <span>Planilha unificada de todos os clientes cadastrados.</span>
          )}
          {activeSubTab === 'patota' && (
            <span className="font-semibold text-[#22205A]">
              Alertas automáticos de permanência (1m, 3m, 6m, 1 ano) com disparo WhatsApp.
            </span>
          )}
          {activeSubTab === 'bussola' && (
            <span>Base para geração das Bússolas Mensais e Mapas Astrais.</span>
          )}
        </div>
      </div>

      {/* Cards de Métricas em Destaque */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#68638C] uppercase tracking-wider">Total Cadastros</span>
            <div className="p-2 rounded-xl bg-[#FAF8F5] text-[#22205A]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-[#22205A] mt-2">
            {metrics.total.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-[#8C87A3] mt-1">100% ativos no banco CRM</div>
        </div>

        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#68638C] uppercase tracking-wider">Patota Ativos</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-emerald-600 mt-2">
            {metrics.patotaAtivos.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-[#8C87A3] mt-1">
            {metrics.patotaAlertas > 0 ? (
              <span className="text-rose-600 font-bold">🎉 {metrics.patotaAlertas} comemorando marco</span>
            ) : (
              'Membros no grupo VIP'
            )}
          </div>
        </div>

        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#68638C] uppercase tracking-wider">Mapas Natais</span>
            <div className="p-2 rounded-xl bg-purple-50 text-[#7C3AED]">
              <Compass className="h-4 w-4 text-[#7C3AED]" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-[#7C3AED] mt-2">
            {metrics.comMapaCalculado.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-[#8C87A3] mt-1">Calculados motor Astro.com</div>
        </div>

        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#68638C] uppercase tracking-wider">Aniversariantes ({MONTH_NAMES[currentMonthNumber - 1]})</span>
            <div className="p-2 rounded-xl bg-amber-50 text-[#D99426]">
              <Cake className="h-4 w-4 text-[#D99426]" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-[#D99426] mt-2">
            {metrics.aniversariantesMes.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-[#8C87A3] mt-1">Ações deste mês solar</div>
        </div>
      </div>

      {/* Barra de Filtros Avançados */}
      <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#68638C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, sobrenome, apelido, whatsapp, e-mail, cidade ou signo..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#DCD6CC] focus:border-[#F0B55E] rounded-xl text-[#22205A] text-xs placeholder:text-[#8C87A3] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Gênero */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#68638C] font-semibold text-[11px]">Gênero:</span>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as any)}
                className="bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs focus:outline-none"
              >
                <option value="all">Todos</option>
                <option value="Feminino">Feminino</option>
                <option value="Masculino">Masculino</option>
              </select>
            </div>

            {/* Filtros específicos da Aba Patota */}
            {activeSubTab === 'patota' && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#68638C] font-semibold text-[11px]">Status Patota:</span>
                  <select
                    value={patotaFilter}
                    onChange={(e) => setPatotaFilter(e.target.value)}
                    className="bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs focus:outline-none"
                  >
                    <option value="all">Todos (Ativos + Inativos)</option>
                    <option value="Ativo">Apenas Ativos</option>
                    <option value="Inativo">Apenas Inativos</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[#D99426] font-bold text-[11px]">Alertas de Marco:</span>
                  <select
                    value={patotaMilestoneFilter}
                    onChange={(e) => setPatotaMilestoneFilter(e.target.value)}
                    className="bg-[#FAF6EE] border border-[#E2D8C7] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs font-semibold focus:outline-none"
                  >
                    <option value="all">Todos os Membros</option>
                    <option value="com_marcos">🎉 Apenas com Alertas Ativos</option>
                    <option value="1_month">🎉 1 Mês de Grupo</option>
                    <option value="3_months">⭐ 3 Meses de Grupo</option>
                    <option value="6_months">🌟 6 Meses de Grupo</option>
                    <option value="12_months">👑 12 Meses (1 Ano)</option>
                  </select>
                </div>
              </>
            )}

            {/* Filtro por Mês de Nascimento (Mantido como solicitado pelo usuário) */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#68638C] font-semibold text-[11px]">Mês Nasc.:</span>
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs focus:outline-none"
              >
                <option value="all">Todos os Meses</option>
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={String(idx + 1)}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Signo Solar */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#68638C] font-semibold text-[11px]">Signo Solar:</span>
              <select
                value={sunSignFilter}
                onChange={(e) => setSunSignFilter(e.target.value)}
                className="bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs focus:outline-none"
              >
                <option value="all">Todos os Signos</option>
                {ASTRO_SIGNS.map((sign) => (
                  <option key={sign} value={sign}>
                    {SIGN_SYMBOLS[sign]} {sign}
                  </option>
                ))}
              </select>
            </div>

            {/* UF */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#68638C] font-semibold text-[11px]">UF:</span>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs focus:outline-none"
              >
                <option value="all">Todas</option>
                {uniqueStates.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* PLANILHA EXCEL ADAPTATIVA CONFORME A SUB-ABA ATIVA */}
      <div className="bg-white border border-[#E5E0D8] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[700px] relative scrollbar-thin">
          <table className="w-full text-left text-xs text-[#554F70] border-collapse min-w-[1900px]">
            {/* Header Sticky */}
            <thead className="bg-[#FAF8F5] text-[#22205A] font-bold uppercase tracking-wider text-[11px] sticky top-0 z-20 shadow-xs border-b border-[#DCD6CC]">
              <tr>
                {/* 1. COLUNA INICIAL: CADASTRO */}
                <th
                  onClick={() => toggleSort('cadastro')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer bg-[#F5F0E6] hover:bg-[#EFE7D8] transition-colors whitespace-nowrap min-w-[130px] sticky left-0 z-30 shadow-xs"
                >
                  <div className="flex items-center justify-between text-[#22205A]">
                    <div className="flex flex-col">
                      <span className="font-heading font-black">Cadastro</span>
                      <span className="text-[9px] text-[#D99426] font-normal lowercase tracking-normal">último acesso/serviço</span>
                    </div>
                    {sortColumn === 'cadastro' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                {/* 2. Nome */}
                <th
                  onClick={() => toggleSort('nome')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[120px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Nome</span>
                    {sortColumn === 'nome' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                {/* 3. Sobrenome */}
                <th
                  onClick={() => toggleSort('sobrenome')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[140px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Sobrenome</span>
                    {sortColumn === 'sobrenome' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                {/* 4. Apelido */}
                <th
                  onClick={() => toggleSort('apelido')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[110px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Apelido</span>
                    {sortColumn === 'apelido' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                {/* 5. Gênero */}
                <th
                  onClick={() => toggleSort('genero')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[90px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Gênero</span>
                    {sortColumn === 'genero' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                {/* ============================================================ */}
                {/* COLUNAS ESPECÍFICAS DA ABA 1: GERAL                           */}
                {/* ============================================================ */}
                {activeSubTab === 'geral' && (
                  <>
                    <th
                      onClick={() => toggleSort('idade')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[80px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Idade</span>
                        {sortColumn === 'idade' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th
                      onClick={() => toggleSort('whatsapp')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[170px]"
                    >
                      <div className="flex items-center justify-between">
                        <span>WhatsApp</span>
                        {sortColumn === 'whatsapp' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th
                      onClick={() => toggleSort('email')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[190px]"
                    >
                      <div className="flex items-center justify-between">
                        <span>E-mail</span>
                        {sortColumn === 'email' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th
                      onClick={() => toggleSort('dataNascimento')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[110px]"
                    >
                      <div className="flex items-center justify-between">
                        <span>Data Nasc.</span>
                        {sortColumn === 'dataNascimento' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th
                      onClick={() => toggleSort('horarioNascimento')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[80px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Horário</span>
                        {sortColumn === 'horarioNascimento' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th
                      onClick={() => toggleSort('cidade')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[130px]"
                    >
                      <div className="flex items-center justify-between">
                        <span>Cidade</span>
                        {sortColumn === 'cidade' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th
                      onClick={() => toggleSort('uf')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[60px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>UF</span>
                        {sortColumn === 'uf' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('sol')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[110px]">
                      <div className="flex items-center justify-between">
                        <span>Sol ☉</span>
                        {sortColumn === 'sol' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('lua')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[110px]">
                      <div className="flex items-center justify-between">
                        <span>Lua ☽</span>
                        {sortColumn === 'lua' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('ascendente')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[120px]">
                      <div className="flex items-center justify-between">
                        <span>ASC</span>
                        {sortColumn === 'ascendente' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('venus')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[110px]">
                      <div className="flex items-center justify-between">
                        <span>Vênus ♀</span>
                        {sortColumn === 'venus' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('marte')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[110px]">
                      <div className="flex items-center justify-between">
                        <span>Marte ♂</span>
                        {sortColumn === 'marte' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('quiron')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[100px]">
                      <div className="flex items-center justify-between">
                        <span>Quíron</span>
                        {sortColumn === 'quiron' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('jupiter')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[110px]">
                      <div className="flex items-center justify-between">
                        <span>Júpiter ♃</span>
                        {sortColumn === 'jupiter' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('saturno')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[110px]">
                      <div className="flex items-center justify-between">
                        <span>Saturno ♄</span>
                        {sortColumn === 'saturno' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('meioDoCeu')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[110px]">
                      <div className="flex items-center justify-between">
                        <span>MC</span>
                        {sortColumn === 'meioDoCeu' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>
                  </>
                )}

                {/* ============================================================ */}
                {/* COLUNAS ESPECÍFICAS DA ABA 2: PATOTA                         */}
                {/* ============================================================ */}
                {activeSubTab === 'patota' && (
                  <>
                    <th
                      onClick={() => toggleSort('whatsapp')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[170px]"
                    >
                      <div className="flex items-center justify-between">
                        <span>WhatsApp</span>
                        {sortColumn === 'whatsapp' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th
                      onClick={() => toggleSort('email')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[190px]"
                    >
                      <div className="flex items-center justify-between">
                        <span>E-mail</span>
                        {sortColumn === 'email' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th
                      onClick={() => toggleSort('dataNascimento')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[120px]"
                    >
                      <div className="flex items-center justify-between">
                        <span>Data de Nascimento</span>
                        {sortColumn === 'dataNascimento' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    {/* Status da Patota */}
                    <th
                      onClick={() => toggleSort('patotaStatus')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[110px]"
                    >
                      <div className="flex items-center justify-between">
                        <span>Status</span>
                        {sortColumn === 'patotaStatus' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    {/* Entrada (renomeado de Cliente Desde) */}
                    <th
                      onClick={() => toggleSort('clienteDesde')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[130px]"
                    >
                      <div className="flex items-center justify-between">
                        <span>Entrada (Grupo)</span>
                        {sortColumn === 'clienteDesde' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    {/* Tempo no Grupo & Alertas de 1m, 3m, 6m, 12m */}
                    <th className="py-3 px-3 border-r border-[#EAE5DC] bg-amber-50/70 whitespace-nowrap min-w-[200px]">
                      <div className="flex items-center gap-1.5 text-[#22205A]">
                        <Clock className="h-3.5 w-3.5 text-[#D99426]" />
                        <span>Tempo no Grupo & Alertas</span>
                      </div>
                    </th>
                  </>
                )}

                {/* ============================================================ */}
                {/* COLUNAS ESPECÍFICAS DA ABA 3: BÚSSOLA                         */}
                {/* ============================================================ */}
                {activeSubTab === 'bussola' && (
                  <>
                    <th
                      onClick={() => toggleSort('dataNascimento')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[120px]"
                    >
                      <div className="flex items-center justify-between">
                        <span>Data de Nascimento</span>
                        {sortColumn === 'dataNascimento' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th
                      onClick={() => toggleSort('horarioNascimento')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[90px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Horário</span>
                        {sortColumn === 'horarioNascimento' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th
                      onClick={() => toggleSort('cidade')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[130px]"
                    >
                      <div className="flex items-center justify-between">
                        <span>Cidade</span>
                        {sortColumn === 'cidade' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th
                      onClick={() => toggleSort('uf')}
                      className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[60px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>UF</span>
                        {sortColumn === 'uf' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('sol')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[110px]">
                      <div className="flex items-center justify-between">
                        <span>Sol ☉</span>
                        {sortColumn === 'sol' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('lua')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[110px]">
                      <div className="flex items-center justify-between">
                        <span>Lua ☽</span>
                        {sortColumn === 'lua' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('ascendente')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[120px]">
                      <div className="flex items-center justify-between">
                        <span>ASC (Ascendente)</span>
                        {sortColumn === 'ascendente' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('venus')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[110px]">
                      <div className="flex items-center justify-between">
                        <span>Vênus ♀</span>
                        {sortColumn === 'venus' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('marte')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[110px]">
                      <div className="flex items-center justify-between">
                        <span>Marte ♂</span>
                        {sortColumn === 'marte' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('quiron')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[100px]">
                      <div className="flex items-center justify-between">
                        <span>Quíron</span>
                        {sortColumn === 'quiron' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('jupiter')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[110px]">
                      <div className="flex items-center justify-between">
                        <span>Júpiter ♃</span>
                        {sortColumn === 'jupiter' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('saturno')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[110px]">
                      <div className="flex items-center justify-between">
                        <span>Saturno ♄</span>
                        {sortColumn === 'saturno' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>

                    <th onClick={() => toggleSort('meioDoCeu')} className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] whitespace-nowrap min-w-[120px]">
                      <div className="flex items-center justify-between">
                        <span>MC (Meio Céu)</span>
                        {sortColumn === 'meioDoCeu' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>
                  </>
                )}

                {/* Coluna Fixa: Ações */}
                <th className="py-3 px-3 text-right sticky right-0 bg-[#FAF8F5] z-10 shadow-xs whitespace-nowrap min-w-[120px]">
                  Ações
                </th>
              </tr>
            </thead>

            {/* Linhas de Dados */}
            <tbody className="divide-y divide-[#EAE5DC]">
              {paginatedContacts.map((contact) => {
                const patotaTenure = calculatePatotaTenure(contact.clienteDesde, contact.apelido || contact.nome);

                return (
                  <tr
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`hover:bg-[#FAF8F5] transition-colors cursor-pointer group ${
                      selectedContact?.id === contact.id ? 'bg-[#F5F2EB]' : ''
                    }`}
                  >
                    {/* 1. COLUNA INICIAL: CADASTRO */}
                    <td className="py-2.5 px-3 border-r border-[#EAE5DC] font-mono text-xs font-bold text-[#22205A] bg-[#FAF6EE] group-hover:bg-[#F3EDE0] sticky left-0 z-10 shadow-xs whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-white/80 border border-[#E2D8C7] text-[#22205A]">
                        {contact.cadastro || '14/03/2026'}
                      </span>
                    </td>

                    {/* Nome */}
                    <td className="py-2.5 px-3 border-r border-[#EAE5DC] font-bold text-[#22205A]">
                      {contact.nome}
                    </td>

                    {/* Sobrenome */}
                    <td className="py-2.5 px-3 border-r border-[#EAE5DC] text-[#443F64]">
                      {contact.sobrenome || '—'}
                    </td>

                    {/* Apelido */}
                    <td className="py-2.5 px-3 border-r border-[#EAE5DC] font-medium text-[#D99426]">
                      {contact.apelido || contact.nome}
                    </td>

                    {/* Gênero */}
                    <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          contact.genero === 'Feminino'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {contact.genero}
                      </span>
                    </td>

                    {/* ============================================================ */}
                    {/* LINHAS: ABA GERAL                                            */}
                    {/* ============================================================ */}
                    {activeSubTab === 'geral' && (
                      <>
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] text-center font-bold text-[#22205A]">
                          {contact.idade !== undefined ? `${contact.idade} anos` : '—'}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] font-mono">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[#22205A]">{contact.whatsapp || '—'}</span>
                            {contact.whatsapp && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenWhatsApp(contact.whatsapp, contact.apelido || contact.nome);
                                }}
                                title="Abrir WhatsApp com mensagem"
                                className="p-1 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                              >
                                <Send className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] text-[11px] text-[#68638C] truncate max-w-[190px]" title={contact.email}>
                          {contact.email || '—'}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] whitespace-nowrap">
                          {contact.dataNascimento || '—'}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] text-center font-mono text-[11px]">
                          {contact.horarioNascimento || '—'}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] truncate max-w-[130px]">
                          {contact.cidade || '—'}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] text-center font-bold text-[#22205A]">
                          {contact.uf || '—'}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                          {contact.sol ? (
                            <span className="font-semibold text-[#22205A] flex items-center gap-1">
                              <span>{SIGN_SYMBOLS[contact.sol] || '☉'}</span>
                              <span>{contact.sol}</span>
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                          {contact.lua ? (
                            <span className="font-medium text-[#443F64] flex items-center gap-1">
                              <span>{SIGN_SYMBOLS[contact.lua] || '☽'}</span>
                              <span>{contact.lua}</span>
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                          {contact.ascendente ? (
                            <span className="font-medium text-[#443F64] flex items-center gap-1">
                              <span className="text-[10px] font-bold text-[#D99426]">ASC</span>
                              <span>{contact.ascendente}</span>
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">{contact.venus || '—'}</td>
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">{contact.marte || '—'}</td>
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">{contact.quiron || '—'}</td>
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">{contact.jupiter || '—'}</td>
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">{contact.saturno || '—'}</td>
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">{contact.meioDoCeu || '—'}</td>
                      </>
                    )}

                    {/* ============================================================ */}
                    {/* LINHAS: ABA PATOTA                                           */}
                    {/* ============================================================ */}
                    {activeSubTab === 'patota' && (
                      <>
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] font-mono">
                          <span className="text-[#22205A] font-semibold">{contact.whatsapp || '—'}</span>
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] text-[11px] text-[#68638C] truncate max-w-[190px]" title={contact.email}>
                          {contact.email || '—'}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] whitespace-nowrap">
                          {contact.dataNascimento || '—'}
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              contact.patotaStatus === 'Ativo'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-gray-100 text-gray-700 border border-gray-300'
                            }`}
                          >
                            {contact.patotaStatus}
                          </span>
                        </td>

                        {/* Entrada (renomeado de Cliente Desde) */}
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] font-mono font-medium text-[#22205A]">
                          {contact.clienteDesde || contact.dataCadastro || '—'}
                        </td>

                        {/* Tempo no Grupo & Alertas */}
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] bg-amber-50/30">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-[#22205A] whitespace-nowrap">
                              {patotaTenure.formattedText}
                            </span>
                            {patotaTenure.milestone && (
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${patotaTenure.milestone.badgeClass}`}
                              >
                                {patotaTenure.milestone.label}
                              </span>
                            )}
                          </div>
                        </td>
                      </>
                    )}

                    {/* ============================================================ */}
                    {/* LINHAS: ABA BÚSSOLA                                          */}
                    {/* ============================================================ */}
                    {activeSubTab === 'bussola' && (
                      <>
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] whitespace-nowrap">
                          {contact.dataNascimento || '—'}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] text-center font-mono text-[11px]">
                          {contact.horarioNascimento || '—'}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] truncate max-w-[130px]">
                          {contact.cidade || '—'}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC] text-center font-bold text-[#22205A]">
                          {contact.uf || '—'}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                          {contact.sol ? (
                            <span className="font-semibold text-[#22205A] flex items-center gap-1">
                              <span>{SIGN_SYMBOLS[contact.sol] || '☉'}</span>
                              <span>{contact.sol}</span>
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                          {contact.lua ? (
                            <span className="font-medium text-[#443F64] flex items-center gap-1">
                              <span>{SIGN_SYMBOLS[contact.lua] || '☽'}</span>
                              <span>{contact.lua}</span>
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                          {contact.ascendente ? (
                            <span className="font-medium text-[#443F64] flex items-center gap-1">
                              <span className="text-[10px] font-bold text-[#D99426]">ASC</span>
                              <span>{contact.ascendente}</span>
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>

                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">{contact.venus || '—'}</td>
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">{contact.marte || '—'}</td>
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">{contact.quiron || '—'}</td>
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">{contact.jupiter || '—'}</td>
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">{contact.saturno || '—'}</td>
                        <td className="py-2.5 px-3 border-r border-[#EAE5DC]">{contact.meioDoCeu || '—'}</td>
                      </>
                    )}

                    {/* Coluna Fixa: Ações */}
                    <td className="py-2.5 px-3 text-right sticky right-0 bg-[#FAF8F5] group-hover:bg-[#F5F2EB] z-10 shadow-xs">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Se estiver na Patota, botão rápido de envio com mensagem de marco */}
                        {activeSubTab === 'patota' && contact.whatsapp && (
                          <button
                            onClick={() => {
                              const greeting = patotaTenure.milestone
                                ? patotaTenure.milestone.greetingMessage
                                : `Olá, ${contact.apelido || contact.nome}! Tudo bem? Passando para te mandar um abraço cósmico e desejar uma linda jornada na Patota da Casa 6! ✨`;
                              handleOpenWhatsApp(contact.whatsapp, contact.apelido || contact.nome, greeting);
                            }}
                            title={
                              patotaTenure.milestone
                                ? `Enviar WhatsApp comemorativo (${patotaTenure.milestone.label})`
                                : 'Enviar mensagem para este membro'
                            }
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${
                              patotaTenure.milestone
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs animate-pulse'
                                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            }`}
                          >
                            <Send className="h-3 w-3" />
                            <span>{patotaTenure.milestone ? patotaTenure.milestone.label : 'Mensagem'}</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedContact(contact)}
                          title="Abrir Prontuário Cósmico"
                          className="p-1 text-[#D99426] hover:text-[#22205A] rounded hover:bg-white"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => handleEditContact(contact)}
                          title="Editar Cadastro"
                          className="p-1 text-[#554F70] hover:text-[#22205A] rounded hover:bg-white"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteContact(contact.id, contact.fullName)}
                          title="Excluir Cadastro"
                          className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedContacts.length === 0 && (
                <tr>
                  <td colSpan={24} className="py-8 text-center text-xs text-[#8C87A3]">
                    Nenhum cadastro encontrado nesta aba com os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé da Tabela: Paginação Excel */}
        <div className="bg-[#FAF8F5] border-t border-[#E5E0D8] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#68638C]">
          <div className="flex items-center gap-3">
            <span>
              Exibindo <strong>{(currentPage - 1) * pageSize + 1}</strong> a{' '}
              <strong>{Math.min(currentPage * pageSize, sortedContacts.length)}</strong> de{' '}
              <strong>{sortedContacts.length}</strong> contatos na aba <strong>{activeSubTab.toUpperCase()}</strong>
            </span>

            <div className="flex items-center gap-1.5 border-l border-[#DCD6CC] pl-3">
              <span>Linhas por página:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-white border border-[#DCD6CC] rounded px-2 py-1 text-xs text-[#22205A] focus:outline-none"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              title="Primeira página"
              className="p-1.5 rounded-lg border border-[#DCD6CC] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F3EFEA] text-[#22205A]"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              title="Página anterior"
              className="p-1.5 rounded-lg border border-[#DCD6CC] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F3EFEA] text-[#22205A]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-3 font-semibold text-[#22205A]">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              title="Próxima página"
              className="p-1.5 rounded-lg border border-[#DCD6CC] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F3EFEA] text-[#22205A]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              title="Última página"
              className="p-1.5 rounded-lg border border-[#DCD6CC] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F3EFEA] text-[#22205A]"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ABA LATERAL CLARA (PRONTUÁRIO CÓSMICO / CRM) */}
      {selectedContact && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white border-l border-[#E5E0D8] shadow-2xl p-6 overflow-y-auto space-y-5 animate-slideLeft">
          <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
            <div>
              <span className="text-[10px] text-[#D99426] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Prontuário Cósmico / CRM
              </span>
              <h3 className="font-heading text-xl font-black text-[#22205A]">{selectedContact.fullName}</h3>
              <p className="text-xs text-[#68638C]">
                Cadastro: <strong>{selectedContact.cadastro}</strong> &bull; Gênero: {selectedContact.genero}
              </p>
            </div>
            <button
              onClick={() => setSelectedContact(null)}
              className="p-2 text-[#68638C] hover:text-[#22205A] rounded-lg hover:bg-[#FAF8F5] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Dados de Contato e WhatsApp */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE5DC] space-y-2.5 text-xs">
            <h4 className="font-bold text-[#22205A] uppercase tracking-wider text-[11px]">
              Dados de Contato & Localização
            </h4>
            <div className="space-y-1.5 text-[#554F70]">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#D99426]" />
                <span>{selectedContact.email || 'E-mail não informado'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Send className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-mono">{selectedContact.whatsapp || 'WhatsApp não informado'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#D99426]" />
                <span>
                  {selectedContact.cidade ? `${selectedContact.cidade} - ${selectedContact.uf}` : 'Localização não informada'}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleOpenWhatsApp(selectedContact.whatsapp, selectedContact.apelido || selectedContact.nome)}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Chamar {selectedContact.apelido || selectedContact.nome} no WhatsApp</span>
            </button>
          </div>

          {/* Dados Natais & Astrologia */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE5DC] space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#EAE5DC] pb-2">
              <h4 className="font-bold text-[#22205A] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#D99426]" />
                Mapa Natal & Pontos Cósmicos (Astro.com)
              </h4>
              <span className="text-[11px] font-bold text-[#D99426]">
                {selectedContact.idade !== undefined ? `${selectedContact.idade} anos` : 'Idade a calcular'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[#554F70]">
              <div><strong>Nascimento:</strong> {selectedContact.dataNascimento || '—'}</div>
              <div><strong>Horário:</strong> {selectedContact.horarioNascimento || '—'}</div>
              <div><strong>Entrada (Patota):</strong> {selectedContact.clienteDesde || '—'}</div>
              <div><strong>Última Entrega:</strong> {selectedContact.ultimaEntrega || '—'}</div>
            </div>

            {/* Grid dos Signos */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EAE5DC]">
              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Sol ☉</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">{selectedContact.sol || '—'}</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Lua ☽</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">{selectedContact.lua || '—'}</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Ascendente</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">{selectedContact.ascendente || '—'}</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Vênus ♀</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">{selectedContact.venus || '—'}</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Marte ♂</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">{selectedContact.marte || '—'}</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Quíron</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">{selectedContact.quiron || '—'}</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Júpiter ♃</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">{selectedContact.jupiter || '—'}</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Saturno ♄</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">{selectedContact.saturno || '—'}</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">MC (Meio Céu)</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">{selectedContact.meioDoCeu || '—'}</div>
              </div>
            </div>
          </div>

          {/* Patota Astral & Assinatura com Cálculo de Tempo */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE5DC] space-y-2 text-xs">
            <h4 className="font-bold text-[#22205A] uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span>Comunidade Patota Astral</span>
              {(() => {
                const tenure = calculatePatotaTenure(selectedContact.clienteDesde, selectedContact.apelido || selectedContact.nome);
                return tenure.milestone ? (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${tenure.milestone.badgeClass}`}>
                    {tenure.milestone.label}
                  </span>
                ) : null;
              })()}
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-[#68638C]">Status Atual:</span>
              <span
                className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                  selectedContact.patotaStatus === 'Ativo'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedContact.patotaStatus === 'Inativo'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {selectedContact.patotaStatus}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#554F70]">
              <span>Plano de Assinatura:</span>
              <strong className="text-[#22205A]">{selectedContact.patotaAssinatura}</strong>
            </div>
            <div className="flex items-center justify-between text-[#554F70]">
              <span>Entrada no Grupo:</span>
              <span className="font-mono">{selectedContact.clienteDesde}</span>
            </div>
            <div className="flex items-center justify-between text-[#554F70]">
              <span>Tempo de Permanência:</span>
              <span className="font-bold text-[#D99426]">
                {calculatePatotaTenure(selectedContact.clienteDesde, selectedContact.apelido || selectedContact.nome).formattedText}
              </span>
            </div>
          </div>

          {/* Anotações da Bianca */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-[#22205A] uppercase tracking-wider text-xs">
              Anotações & Insights da Bianca
            </h4>
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE5DC] text-xs text-[#22205A] leading-relaxed whitespace-pre-wrap">
              {selectedContact.notes || 'Sem anotações registradas.'}
            </div>
          </div>

          <div className="pt-3 border-t border-[#F0EBE1] flex gap-2">
            <button
              onClick={() => handleEditContact(selectedContact)}
              className="flex-1 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#DCD6CC] text-[#22205A] font-bold text-xs uppercase"
            >
              Editar Dados
            </button>
            <button
              onClick={() => handleDeleteContact(selectedContact.id, selectedContact.fullName)}
              className="py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs uppercase"
            >
              Excluir
            </button>
          </div>
        </div>
      )}

      {/* MODAL NOVO / EDITAR CADASTRO */}
      {isModalOpen && editingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-[#E5E0D8] rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <h3 className="font-heading text-lg font-bold text-[#22205A] flex items-center gap-2">
                <Users className="h-5 w-5 text-[#D99426]" />
                {editingContact.id ? 'Editar Cadastro no CRM' : 'Novo Cadastro no CRM'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#68638C] hover:text-[#22205A] text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              {/* Coluna Inicial: Cadastro (Último acesso / serviço) */}
              <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[#E2D8C7] space-y-1">
                <label className="text-xs font-bold text-[#22205A]">
                  Data de Cadastro / Último Acesso e Serviço Prestado *
                </label>
                <input
                  type="text"
                  required
                  value={editingContact.cadastro || ''}
                  onChange={(e) => setEditingContact({ ...editingContact, cadastro: e.target.value })}
                  placeholder="Ex: 14/03/2026"
                  className="w-full px-3 py-2 bg-white border border-[#DCD6CC] rounded-lg text-xs text-[#22205A] focus:outline-none focus:border-[#D99426]"
                />
                <span className="text-[10px] text-[#68638C]">
                  Esta é a primeira coluna do CRM, que indica a data do último serviço ou atendimento prestado.
                </span>
              </div>

              {/* Nome e Sobrenome */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Nome *</label>
                  <input
                    type="text"
                    required
                    value={editingContact.nome || ''}
                    onChange={(e) =>
                      setEditingContact({
                        ...editingContact,
                        nome: e.target.value,
                        fullName: `${e.target.value} ${editingContact.sobrenome || ''}`.trim()
                      })
                    }
                    placeholder="Primeiro nome"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg text-xs text-[#22205A] focus:outline-none focus:border-[#F0B55E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Sobrenome *</label>
                  <input
                    type="text"
                    required
                    value={editingContact.sobrenome || ''}
                    onChange={(e) =>
                      setEditingContact({
                        ...editingContact,
                        sobrenome: e.target.value,
                        fullName: `${editingContact.nome || ''} ${e.target.value}`.trim()
                      })
                    }
                    placeholder="Sobrenome completo"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg text-xs text-[#22205A] focus:outline-none focus:border-[#F0B55E]"
                  />
                </div>
              </div>

              {/* Apelido e Gênero */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Apelido (Para mensagens personalizadas)</label>
                  <input
                    type="text"
                    value={editingContact.apelido || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, apelido: e.target.value })}
                    placeholder="Ex: Ade, Mari, Cacá"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg text-xs text-[#22205A] focus:outline-none focus:border-[#F0B55E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Gênero</label>
                  <select
                    value={editingContact.genero || 'Feminino'}
                    onChange={(e) => setEditingContact({ ...editingContact, genero: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg text-xs text-[#22205A] focus:outline-none focus:border-[#F0B55E]"
                  >
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                  </select>
                </div>
              </div>

              {/* WhatsApp e E-mail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">WhatsApp (com DDD) *</label>
                  <input
                    type="text"
                    required
                    value={editingContact.whatsapp || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, whatsapp: e.target.value })}
                    placeholder="Ex: (11) 98765-4321"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg text-xs text-[#22205A] focus:outline-none focus:border-[#F0B55E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">E-mail</label>
                  <input
                    type="email"
                    value={editingContact.email || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                    placeholder="cliente@email.com"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg text-xs text-[#22205A] focus:outline-none focus:border-[#F0B55E]"
                  />
                </div>
              </div>

              {/* Nascimento e Horário com Cálculo Astro.com Automático */}
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#7C3AED]">
                  <Sparkles className="h-4 w-4" />
                  <span>Cálculo Automático de Idade & Mapa Natal (Astro.com)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#22205A]">Data de Nascimento (DD/MM/AAAA)</label>
                    <input
                      type="text"
                      value={editingContact.dataNascimento || ''}
                      onChange={(e) => handleModalBirthChange(e.target.value, editingContact.horarioNascimento || '')}
                      placeholder="Ex: 03/12/1964"
                      className="w-full px-3 py-2 bg-white border border-[#DCD6CC] rounded-lg text-xs text-[#22205A] focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#22205A]">Horário de Nascimento (HH:MM)</label>
                    <input
                      type="text"
                      value={editingContact.horarioNascimento || ''}
                      onChange={(e) => handleModalBirthChange(editingContact.dataNascimento || '', e.target.value)}
                      placeholder="Ex: 14:00"
                      className="w-full px-3 py-2 bg-white border border-[#DCD6CC] rounded-lg text-xs text-[#22205A] focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                </div>

                {editingContact.idade !== undefined && (
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#22205A] pt-1">
                    <span>Idade: <strong>{editingContact.idade} anos</strong></span>
                    <span>Sol: <strong>{editingContact.sol || '—'}</strong></span>
                    <span>Lua: <strong>{editingContact.lua || '—'}</strong></span>
                    <span>Ascendente: <strong>{editingContact.ascendente || '—'}</strong></span>
                  </div>
                )}
              </div>

              {/* Cidade e UF */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Cidade</label>
                  <input
                    type="text"
                    value={editingContact.cidade || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, cidade: e.target.value })}
                    placeholder="Ex: São Paulo"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg text-xs text-[#22205A] focus:outline-none focus:border-[#F0B55E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">UF</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={editingContact.uf || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, uf: e.target.value.toUpperCase() })}
                    placeholder="SP"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg text-xs text-[#22205A] uppercase text-center focus:outline-none focus:border-[#F0B55E]"
                  />
                </div>
              </div>

              {/* Patota Astral & Entrada */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Status Patota</label>
                  <select
                    value={editingContact.patotaStatus || 'Não Assinante'}
                    onChange={(e) => setEditingContact({ ...editingContact, patotaStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg text-xs text-[#22205A] focus:outline-none focus:border-[#F0B55E]"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Não Assinante">Não Assinante</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Entrada (Cliente Desde)</label>
                  <input
                    type="text"
                    value={editingContact.clienteDesde || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, clienteDesde: e.target.value })}
                    placeholder="Ex: 27/02/2025"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg text-xs text-[#22205A] focus:outline-none focus:border-[#F0B55E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Última Entrega</label>
                  <input
                    type="text"
                    value={editingContact.ultimaEntrega || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, ultimaEntrega: e.target.value })}
                    placeholder="Ex: 14/03/2026"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg text-xs text-[#22205A] focus:outline-none focus:border-[#F0B55E]"
                  />
                </div>
              </div>

              {/* Anotações */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Anotações / Histórico</label>
                <textarea
                  rows={3}
                  value={editingContact.notes || ''}
                  onChange={(e) => setEditingContact({ ...editingContact, notes: e.target.value })}
                  placeholder="Informações adicionais sobre atendimentos, mapa e preferências do cliente..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg text-xs text-[#22205A] focus:outline-none focus:border-[#F0B55E]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0EBE1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#DCD6CC] bg-white text-[#554F70] text-xs font-bold hover:bg-[#FAF8F5]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#22205A] text-[#F0B55E] text-xs font-bold uppercase tracking-wider hover:bg-[#1B1948]"
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
