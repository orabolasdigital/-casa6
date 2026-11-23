/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo: Cadastros (CRM Master — Coração do Sistema)
 * Visualização Estilo Planilha Excel com Ordenação, Filtros Avançados, Exportação e Motor Astrológico
 * Tema Claro (Light Theme)
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Send,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  X,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Cake,
  RefreshCw,
  Eye
} from 'lucide-react';
import {
  CRMContactDetail,
  getCRMContactsList,
  saveCRMContactDetail,
  deleteCRMContactDetail
} from '../../../services/crmService';
import {
  calculateAge,
  calculateAstroProfile,
  ASTRO_SIGNS,
  MONTH_NAMES,
  SIGN_SYMBOLS,
  SIGN_ELEMENTS,
  inferGender,
  cleanPhone
} from '../../../utils/astroEngine';

type SortColumn =
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
  | 'dataCadastro'
  | 'ultimoAcesso';

type SortOrder = 'asc' | 'desc';

export const OperationsCRM: React.FC = () => {
  const [contacts, setContacts] = useState<CRMContactDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Feminino' | 'Masculino'>('all');
  const [patotaFilter, setPatotaFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [sunSignFilter, setSunSignFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');

  // Ordenação
  const [sortColumn, setSortColumn] = useState<SortColumn>('dataCadastro');
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

  // Extrair estados únicos para filtro
  const uniqueStates = useMemo(() => {
    const states = contacts
      .map((c) => c.uf?.trim())
      .filter((uf): uf is string => Boolean(uf && uf.length === 2));
    return Array.from(new Set(states)).sort();
  }, [contacts]);

  // Mês atual para metric card de aniversariantes
  const currentMonthNumber = useMemo(() => new Date().getMonth() + 1, []);

  // Métricas rápidas
  const metrics = useMemo(() => {
    const total = contacts.length;
    const patotaAtivos = contacts.filter((c) => c.patotaStatus === 'Ativo').length;
    const patotaInativos = contacts.filter((c) => c.patotaStatus === 'Inativo').length;
    const aniversariantesMes = contacts.filter(
      (c) => c.mesNumero === currentMonthNumber || c.mesNascimento?.toLowerCase().includes(MONTH_NAMES[currentMonthNumber - 1]?.toLowerCase())
    ).length;

    return { total, patotaAtivos, patotaInativos, aniversariantesMes };
  }, [contacts, currentMonthNumber]);

  // Filtragem e Ordenação
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // Busca textual
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
          contact.ascendente.toLowerCase().includes(q) ||
          contact.patotaStatus.toLowerCase().includes(q);

        if (!matchText) return false;
      }

      // Filtro Gênero
      if (genderFilter !== 'all' && contact.genero !== genderFilter) {
        return false;
      }

      // Filtro Patota
      if (patotaFilter !== 'all' && contact.patotaStatus !== patotaFilter) {
        return false;
      }

      // Filtro Mês Nascimento
      if (monthFilter !== 'all') {
        const targetMonthNum = parseInt(monthFilter, 10);
        if (contact.mesNumero !== targetMonthNum && contact.mesNascimento !== MONTH_NAMES[targetMonthNum - 1]) {
          return false;
        }
      }

      // Filtro Signo Solar
      if (sunSignFilter !== 'all' && contact.sol !== sunSignFilter) {
        return false;
      }

      // Filtro UF
      if (stateFilter !== 'all' && contact.uf !== stateFilter) {
        return false;
      }

      return true;
    });
  }, [contacts, searchQuery, genderFilter, patotaFilter, monthFilter, sunSignFilter, stateFilter]);

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

  // Paginação
  const totalPages = Math.ceil(sortedContacts.length / pageSize) || 1;
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedContacts.slice(start, start + pageSize);
  }, [sortedContacts, currentPage, pageSize]);

  // Resetar página ao mudar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, genderFilter, patotaFilter, monthFilter, sunSignFilter, stateFilter, pageSize]);

  const toggleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  // Exportar para Excel / CSV formatado com BOM UTF-8
  const handleExportCSV = () => {
    const headers = [
      'Nome',
      'Sobrenome',
      'Apelido',
      'Gênero',
      'Idade',
      'WhatsApp',
      'E-mail',
      'Data Nascimento',
      'Mês Nascimento',
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
      'Meio do Céu',
      'Patota Status',
      'Patota Assinatura',
      'Cadastro Desde',
      'Último Acesso'
    ];

    const rows = sortedContacts.map((c) => [
      c.nome,
      c.sobrenome,
      c.apelido,
      c.genero,
      c.idade ?? '',
      c.whatsapp,
      c.email,
      c.dataNascimento,
      c.mesNascimento,
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
      c.meioDoCeu,
      c.patotaStatus,
      c.patotaAssinatura,
      c.dataCadastro,
      c.ultimoAcesso
    ]);

    const csvContent = [
      headers.map((h) => `"${h}"`).join(';'),
      ...rows.map((row) => row.map((val) => `"${String(val || '').replace(/"/g, '""')}"`).join(';'))
    ].join('\r\n');

    // UTF-8 BOM (\uFEFF) para garantir abertura perfeita no Microsoft Excel brasileiro
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `casa6_crm_cadastros_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setNotification({
      type: 'success',
      text: `Exportação concluída! ${sortedContacts.length} contatos exportados com sucesso para Excel.`
    });
  };

  const handleOpenWhatsApp = (whatsapp: string, apelidoOrNome: string) => {
    const cleanDigits = whatsapp.replace(/\D/g, '');
    if (!cleanDigits) {
      alert('Número de WhatsApp não informado para este cadastro.');
      return;
    }
    const phoneWithCountry = cleanDigits.startsWith('55') ? cleanDigits : `55${cleanDigits}`;
    const greeting = `Olá, ${apelidoOrNome || 'querida(o)'}! Aqui é a Bianca Tófoli da Casa 6. Tudo bem com você?`;
    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(greeting)}`, '_blank');
  };

  const handleOpenNewModal = () => {
    setEditingContact({
      id: '',
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
      patotaStatus: 'Não Assinante',
      patotaAssinatura: '—',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleEditContact = (contact: CRMContactDetail) => {
    setEditingContact({ ...contact });
    setIsModalOpen(true);
  };

  // Atualização em tempo real do modal quando digita Data ou Horário de Nascimento
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
      {/* Cabeçalho */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#E5E0D8] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#D99426] text-xs font-bold uppercase tracking-widest">
            <Users className="h-4 w-4" />
            <span>Operações &bull; Cadastros (CRM Master)</span>
          </div>
          <h2 className="text-2xl font-heading font-black text-[#22205A] mt-1">
            Planilha Master de Clientes ({filteredContacts.length} de {contacts.length})
          </h2>
          <p className="text-xs sm:text-sm text-[#68638C]">
            Visualização Excel completa com dados astrológicos, cálculo dinâmico de idade, filtros avançados e exportação.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            title="Exportar planilha para Excel (.csv com UTF-8)"
            className="py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#DCD6CC] text-[#22205A] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            <span>Exportar Excel (CSV)</span>
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

      {/* Cards de Métricas em Destaque */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#68638C] uppercase tracking-wider">Total Clientes</span>
            <div className="p-2 rounded-xl bg-[#FAF8F5] text-[#22205A]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-[#22205A] mt-2">
            {metrics.total.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-[#8C87A3] mt-1">100% integrados no CRM</div>
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
          <div className="text-[11px] text-[#8C87A3] mt-1">Membros com assinatura ativa</div>
        </div>

        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#68638C] uppercase tracking-wider">Patota Inativos</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-amber-600 mt-2">
            {metrics.patotaInativos.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-[#8C87A3] mt-1">Para campanhas de retorno</div>
        </div>

        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#68638C] uppercase tracking-wider">Aniversariantes ({MONTH_NAMES[currentMonthNumber - 1]})</span>
            <div className="p-2 rounded-xl bg-purple-50 text-[#22205A]">
              <Cake className="h-4 w-4 text-[#D99426]" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-[#D99426] mt-2">
            {metrics.aniversariantesMes.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-[#8C87A3] mt-1">Mês vigente para disparo de ações</div>
        </div>
      </div>

      {/* Barra de Filtros Avançados */}
      <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 space-y-3 shadow-xs">
        {/* Linha 1: Busca e Filtros Rápidos */}
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

            {/* Patota Status */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#68638C] font-semibold text-[11px]">Patota:</span>
              <select
                value={patotaFilter}
                onChange={(e) => setPatotaFilter(e.target.value)}
                className="bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs focus:outline-none"
              >
                <option value="all">Todos os Status</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Não Assinante">Não Assinante</option>
              </select>
            </div>

            {/* Mês Nascimento */}
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

      {/* PLANILHA MASTER EXCEL */}
      <div className="bg-white border border-[#E5E0D8] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[700px] relative scrollbar-thin">
          <table className="w-full text-left text-xs text-[#554F70] border-collapse min-w-[2100px]">
            {/* Header Sticky Estilo Excel */}
            <thead className="bg-[#FAF8F5] text-[#22205A] font-bold uppercase tracking-wider text-[11px] sticky top-0 z-20 shadow-xs border-b border-[#DCD6CC]">
              <tr>
                <th
                  onClick={() => toggleSort('nome')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[120px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Nome</span>
                    {sortColumn === 'nome' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('sobrenome')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[150px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Sobrenome</span>
                    {sortColumn === 'sobrenome' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('apelido')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[110px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Apelido</span>
                    {sortColumn === 'apelido' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('genero')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[90px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Gênero</span>
                    {sortColumn === 'genero' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

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
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[200px]"
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
                  onClick={() => toggleSort('mesNumero')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[100px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Mês Nasc.</span>
                    {sortColumn === 'mesNumero' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
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

                {/* Colunas Astrológicas */}
                <th
                  onClick={() => toggleSort('sol')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[110px] text-[#22205A]"
                >
                  <div className="flex items-center justify-between">
                    <span>Sol ☉</span>
                    {sortColumn === 'sol' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('lua')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[110px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Lua ☽</span>
                    {sortColumn === 'lua' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('ascendente')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[120px]"
                >
                  <div className="flex items-center justify-between">
                    <span>ASC (Ascendente)</span>
                    {sortColumn === 'ascendente' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('venus')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[110px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Vênus ♀</span>
                    {sortColumn === 'venus' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('marte')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[110px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Marte ♂</span>
                    {sortColumn === 'marte' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('quiron')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[100px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Quíron</span>
                    {sortColumn === 'quiron' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('jupiter')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[110px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Júpiter ♃</span>
                    {sortColumn === 'jupiter' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('saturno')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[110px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Saturno ♄</span>
                    {sortColumn === 'saturno' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('meioDoCeu')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[110px]"
                >
                  <div className="flex items-center justify-between">
                    <span>MC (Meio Céu)</span>
                    {sortColumn === 'meioDoCeu' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                {/* Patota & Assinatura */}
                <th
                  onClick={() => toggleSort('patotaStatus')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[120px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Patota Status</span>
                    {sortColumn === 'patotaStatus' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('patotaAssinatura')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[120px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Assinatura</span>
                    {sortColumn === 'patotaAssinatura' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('dataCadastro')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[110px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Cadastro</span>
                    {sortColumn === 'dataCadastro' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('ultimoAcesso')}
                  className="py-3 px-3 border-r border-[#EAE5DC] cursor-pointer hover:bg-[#F3EFEA] transition-colors whitespace-nowrap min-w-[110px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Último Acesso</span>
                    {sortColumn === 'ultimoAcesso' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </th>

                <th className="py-3 px-3 text-right sticky right-0 bg-[#FAF8F5] z-10 shadow-xs whitespace-nowrap min-w-[100px]">
                  Ações
                </th>
              </tr>
            </thead>

            {/* Linhas de Dados */}
            <tbody className="divide-y divide-[#EAE5DC]">
              {paginatedContacts.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`hover:bg-[#FAF8F5] transition-colors cursor-pointer group ${
                    selectedContact?.id === contact.id ? 'bg-[#F5F2EB]' : ''
                  }`}
                >
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

                  {/* Idade */}
                  <td className="py-2.5 px-3 border-r border-[#EAE5DC] text-center font-bold text-[#22205A]">
                    {contact.idade !== undefined ? `${contact.idade} anos` : '—'}
                  </td>

                  {/* WhatsApp */}
                  <td className="py-2.5 px-3 border-r border-[#EAE5DC] font-mono">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[#22205A]">{contact.whatsapp || '—'}</span>
                      {contact.whatsapp && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenWhatsApp(contact.whatsapp, contact.apelido || contact.nome);
                          }}
                          title="Abrir WhatsApp com mensagem personalizada"
                          className="p-1 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                        >
                          <Send className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* E-mail */}
                  <td className="py-2.5 px-3 border-r border-[#EAE5DC] text-[11px] text-[#68638C] truncate max-w-[200px]" title={contact.email}>
                    {contact.email || '—'}
                  </td>

                  {/* Data Nascimento */}
                  <td className="py-2.5 px-3 border-r border-[#EAE5DC] whitespace-nowrap">
                    {contact.dataNascimento || '—'}
                  </td>

                  {/* Mês Nascimento */}
                  <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                    {contact.mesNascimento ? (
                      <span className="text-[11px] font-semibold text-[#22205A]">{contact.mesNascimento}</span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Horário */}
                  <td className="py-2.5 px-3 border-r border-[#EAE5DC] text-center font-mono text-[11px]">
                    {contact.horarioNascimento || '—'}
                  </td>

                  {/* Cidade */}
                  <td className="py-2.5 px-3 border-r border-[#EAE5DC] truncate max-w-[130px]">
                    {contact.cidade || '—'}
                  </td>

                  {/* UF */}
                  <td className="py-2.5 px-3 border-r border-[#EAE5DC] text-center font-bold text-[#22205A]">
                    {contact.uf || '—'}
                  </td>

                  {/* Pontos Astrológicos */}
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

                  <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                    {contact.venus || '—'}
                  </td>

                  <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                    {contact.marte || '—'}
                  </td>

                  <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                    {contact.quiron || '—'}
                  </td>

                  <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                    {contact.jupiter || '—'}
                  </td>

                  <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                    {contact.saturno || '—'}
                  </td>

                  <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                    {contact.meioDoCeu || '—'}
                  </td>

                  {/* Patota Status */}
                  <td className="py-2.5 px-3 border-r border-[#EAE5DC]">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        contact.patotaStatus === 'Ativo'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : contact.patotaStatus === 'Inativo'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {contact.patotaStatus}
                    </span>
                  </td>

                  {/* Patota Assinatura */}
                  <td className="py-2.5 px-3 border-r border-[#EAE5DC] text-[11px]">
                    {contact.patotaAssinatura}
                  </td>

                  {/* Cadastro */}
                  <td className="py-2.5 px-3 border-r border-[#EAE5DC] text-[11px] text-[#68638C]">
                    {contact.dataCadastro}
                  </td>

                  {/* Último Acesso */}
                  <td className="py-2.5 px-3 border-r border-[#EAE5DC] text-[11px] text-[#68638C]">
                    {contact.ultimoAcesso || '—'}
                  </td>

                  {/* Ações */}
                  <td className="py-2.5 px-3 text-right sticky right-0 bg-[#FAF8F5] group-hover:bg-[#F5F2EB] z-10 shadow-xs">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
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
              ))}

              {paginatedContacts.length === 0 && (
                <tr>
                  <td colSpan={26} className="py-8 text-center text-xs text-[#8C87A3]">
                    Nenhum cadastro encontrado com os filtros aplicados.
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
              <strong>{sortedContacts.length}</strong> contatos
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
                Apelido de tratamento: <strong>{selectedContact.apelido || selectedContact.nome}</strong> &bull; Gênero: {selectedContact.genero}
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

          {/* Dados Natais & Astrologia Completa */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE5DC] space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#EAE5DC] pb-2">
              <h4 className="font-bold text-[#22205A] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#D99426]" />
                Mapa Natal & Pontos Cósmicos
              </h4>
              <span className="text-[11px] font-bold text-[#D99426]">
                {selectedContact.idade !== undefined ? `${selectedContact.idade} anos` : 'Idade a calcular'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[#554F70]">
              <div>
                <strong>Nascimento:</strong> {selectedContact.dataNascimento || '—'}
              </div>
              <div>
                <strong>Horário:</strong> {selectedContact.horarioNascimento || '—'}
              </div>
              <div>
                <strong>Mês:</strong> {selectedContact.mesNascimento || '—'}
              </div>
              <div>
                <strong>Cadastro:</strong> {selectedContact.dataCadastro || '—'}
              </div>
            </div>

            {/* Grid dos Signos */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EAE5DC]">
              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Sol ☉</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">
                  {selectedContact.sol || '—'}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Lua ☽</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">
                  {selectedContact.lua || '—'}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Ascendente</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">
                  {selectedContact.ascendente || '—'}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Vênus ♀</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">
                  {selectedContact.venus || '—'}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Marte ♂</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">
                  {selectedContact.marte || '—'}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Quíron</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">
                  {selectedContact.quiron || '—'}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Júpiter ♃</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">
                  {selectedContact.jupiter || '—'}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Saturno ♄</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">
                  {selectedContact.saturno || '—'}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white border border-[#EAE5DC] text-center">
                <div className="text-[10px] text-[#68638C] font-bold uppercase">Meio do Céu</div>
                <div className="font-bold text-xs text-[#22205A] mt-0.5">
                  {selectedContact.meioDoCeu || '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Patota Astral & Assinatura */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE5DC] space-y-2 text-xs">
            <h4 className="font-bold text-[#22205A] uppercase tracking-wider text-[11px]">
              Comunidade Patota Astral
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
            {selectedContact.ultimoAcesso && (
              <div className="flex items-center justify-between text-[#554F70]">
                <span>Último Acesso / Entrega:</span>
                <span className="font-mono">{selectedContact.ultimoAcesso}</span>
              </div>
            )}
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
              onClick={() => {
                handleEditContact(selectedContact);
              }}
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
              {/* Nome e Sobrenome Separados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Nome (1ª palavra) *</label>
                  <input
                    type="text"
                    required
                    value={editingContact.nome || ''}
                    onChange={(e) => {
                      const newNome = e.target.value;
                      const newSobrenome = editingContact.sobrenome || '';
                      setEditingContact({
                        ...editingContact,
                        nome: newNome,
                        fullName: `${newNome} ${newSobrenome}`.trim(),
                        apelido: editingContact.apelido || newNome,
                        genero: inferGender(newNome, editingContact.genero)
                      });
                    }}
                    placeholder="Ex: Maria"
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Sobrenome</label>
                  <input
                    type="text"
                    value={editingContact.sobrenome || ''}
                    onChange={(e) => {
                      const newSobrenome = e.target.value;
                      const currentNome = editingContact.nome || '';
                      setEditingContact({
                        ...editingContact,
                        sobrenome: newSobrenome,
                        fullName: `${currentNome} ${newSobrenome}`.trim()
                      });
                    }}
                    placeholder="Ex: Clara Silva Oliveira"
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  />
                </div>
              </div>

              {/* Apelido e Gênero */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">
                    Apelido (como a Bianca chamará o cliente)
                  </label>
                  <input
                    type="text"
                    value={editingContact.apelido || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, apelido: e.target.value })}
                    placeholder="Ex: Mari"
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Gênero</label>
                  <select
                    value={editingContact.genero || 'Feminino'}
                    onChange={(e) => setEditingContact({ ...editingContact, genero: e.target.value as any })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  >
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                  </select>
                </div>
              </div>

              {/* WhatsApp e E-mail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">WhatsApp (com DDD)</label>
                  <input
                    type="text"
                    value={editingContact.whatsapp || ''}
                    onChange={(e) => {
                      const info = cleanPhone('', e.target.value);
                      setEditingContact({
                        ...editingContact,
                        whatsapp: e.target.value,
                        ddd: info.ddd,
                        telefone: info.telefone
                      });
                    }}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">E-mail</label>
                  <input
                    type="email"
                    value={editingContact.email || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                    placeholder="cliente@email.com"
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  />
                </div>
              </div>

              {/* Data Nascimento e Horário (com cálculo automático) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE5DC]">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#22205A] flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#D99426]" />
                    Data Nasc. (DD/MM/AAAA)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 15/05/1992"
                    value={editingContact.dataNascimento || ''}
                    onChange={(e) => handleModalBirthChange(e.target.value, editingContact.horarioNascimento || '')}
                    className="w-full bg-white border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#22205A] flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#D99426]" />
                    Horário (HH:MM)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 14:30"
                    value={editingContact.horarioNascimento || ''}
                    onChange={(e) => handleModalBirthChange(editingContact.dataNascimento || '', e.target.value)}
                    className="w-full bg-white border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#22205A]">Idade Calculada</label>
                  <div className="py-1.5 px-2.5 bg-white border border-[#DCD6CC] rounded-lg text-xs font-bold text-[#D99426]">
                    {editingContact.idade !== undefined ? `${editingContact.idade} anos` : 'Informe a data'}
                  </div>
                </div>
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
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
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
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs uppercase text-center"
                  />
                </div>
              </div>

              {/* Signos (Calculados ou Editáveis) */}
              <div className="space-y-2 bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE5DC]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#22205A] flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#D99426]" />
                    Pontos Astrológicos (Auto-calculados)
                  </span>
                  <span className="text-[10px] text-[#68638C]">
                    Calculados via AstroEngine
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-[#68638C]">Sol ☉</label>
                    <input
                      type="text"
                      value={editingContact.sol || ''}
                      onChange={(e) => setEditingContact({ ...editingContact, sol: e.target.value })}
                      className="w-full bg-white border border-[#DCD6CC] rounded px-2 py-1 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#68638C]">Lua ☽</label>
                    <input
                      type="text"
                      value={editingContact.lua || ''}
                      onChange={(e) => setEditingContact({ ...editingContact, lua: e.target.value })}
                      className="w-full bg-white border border-[#DCD6CC] rounded px-2 py-1 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#68638C]">ASC</label>
                    <input
                      type="text"
                      value={editingContact.ascendente || ''}
                      onChange={(e) => setEditingContact({ ...editingContact, ascendente: e.target.value })}
                      className="w-full bg-white border border-[#DCD6CC] rounded px-2 py-1 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#68638C]">Vênus ♀</label>
                    <input
                      type="text"
                      value={editingContact.venus || ''}
                      onChange={(e) => setEditingContact({ ...editingContact, venus: e.target.value })}
                      className="w-full bg-white border border-[#DCD6CC] rounded px-2 py-1 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#68638C]">Marte ♂</label>
                    <input
                      type="text"
                      value={editingContact.marte || ''}
                      onChange={(e) => setEditingContact({ ...editingContact, marte: e.target.value })}
                      className="w-full bg-white border border-[#DCD6CC] rounded px-2 py-1 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#68638C]">Quíron</label>
                    <input
                      type="text"
                      value={editingContact.quiron || ''}
                      onChange={(e) => setEditingContact({ ...editingContact, quiron: e.target.value })}
                      className="w-full bg-white border border-[#DCD6CC] rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Patota Status e Assinatura */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Patota Astral Status</label>
                  <select
                    value={editingContact.patotaStatus || 'Não Assinante'}
                    onChange={(e) => setEditingContact({ ...editingContact, patotaStatus: e.target.value as any })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  >
                    <option value="Não Assinante">Não Assinante</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Patota Assinatura</label>
                  <select
                    value={editingContact.patotaAssinatura || '—'}
                    onChange={(e) => setEditingContact({ ...editingContact, patotaAssinatura: e.target.value as any })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  >
                    <option value="—">—</option>
                    <option value="Mensal">Mensal</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                    <option value="Bonificado">Bonificado</option>
                  </select>
                </div>
              </div>

              {/* Anotações da Bianca */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Anotações & Observações</label>
                <textarea
                  rows={2}
                  value={editingContact.notes || ''}
                  onChange={(e) => setEditingContact({ ...editingContact, notes: e.target.value })}
                  placeholder="Observações sobre consultas, trânsitos, preferências..."
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0EBE1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#68638C] hover:bg-[#FAF8F5]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#22205A] hover:bg-[#1B1948] text-[#F0B55E] font-bold text-xs uppercase tracking-wider shadow-xs cursor-pointer"
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
