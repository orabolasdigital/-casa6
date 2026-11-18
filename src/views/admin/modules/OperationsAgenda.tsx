/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo: Agenda de Atendimentos (Calendário Mensal & Sincronização Google)
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Video,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  Phone,
  Mail,
  Send,
  Trash2,
  Edit2,
  RefreshCw,
  Share2
} from 'lucide-react';
import {
  AppointmentItem,
  getAppointmentsList,
  saveAppointmentItem,
  deleteAppointmentItem,
  generateGoogleCalendarUrl
} from '../../../services/agendaService';
import { CRMContactDetail, getCRMContactsList } from '../../../services/crmService';

export const OperationsAgenda: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [contacts, setContacts] = useState<CRMContactDetail[]>([]);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date(2026, 10, 1)); // Nov 2026
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAppointment, setEditingAppointment] = useState<Partial<AppointmentItem> | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Contas do Google Calendar
  const googleAccounts = [
    { email: 'bianca@casa6.com.br', label: 'Bianca Tofoli (Principal)', color: '#F0B55E' },
    { email: 'consultas.casa6@gmail.com', label: 'Consultas & Mapas', color: '#68B684' },
    { email: 'corporativo.casa6@gmail.com', label: 'Palestras & Empresas', color: '#5E9FF0' }
  ];

  const loadData = async () => {
    const [apts, crms] = await Promise.all([getAppointmentsList(), getCRMContactsList()]);
    setAppointments(apts);
    setContacts(crms);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const monthYearLabel = currentMonthDate.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  // Dias do mês atual para montar a grade
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayWeekIndex = new Date(year, month, 1).getDay(); // 0 = Domingo

  const filteredAppointments = appointments.filter((apt) => {
    if (filterAccount !== 'all' && apt.gmailAccount !== filterAccount) return false;
    if (filterStatus !== 'all' && apt.status !== filterStatus) return false;
    return true;
  });

  const handleOpenNewModal = (dateStr?: string) => {
    setEditingAppointment({
      id: '',
      clientName: '',
      clientEmail: '',
      clientWhatsapp: '',
      serviceName: 'Mapa Natal Individual',
      serviceId: 'mapa-natal',
      date: dateStr || new Date().toISOString().split('T')[0],
      time: '14:00',
      durationMinutes: 90,
      meetLink: 'https://meet.google.com/new',
      status: 'agendado',
      gmailAccount: googleAccounts[0].email,
      amount: 350.0,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    try {
      await saveAppointmentItem(editingAppointment);
      setNotification({ type: 'success', text: 'Atendimento agendado/atualizado com sucesso!' });
      setIsModalOpen(false);
      setEditingAppointment(null);
      await loadData();
    } catch (err: any) {
      setNotification({ type: 'error', text: err?.message || 'Erro ao salvar atendimento.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja realmente remover este agendamento?')) return;
    try {
      await deleteAppointmentItem(id);
      setNotification({ type: 'success', text: 'Atendimento removido com sucesso.' });
      await loadData();
    } catch (err: any) {
      setNotification({ type: 'error', text: 'Erro ao remover agendamento.' });
    }
  };

  const handleSelectContactForModal = (contactId: string) => {
    const found = contacts.find((c) => c.id === contactId);
    if (!found) return;
    setEditingAppointment((prev) => ({
      ...prev,
      contactId: found.id,
      clientName: found.fullName,
      clientEmail: found.email,
      clientWhatsapp: found.whatsapp
    }));
  };

  const handleSendReminderWhatsApp = (apt: AppointmentItem) => {
    const cleanPhone = apt.clientWhatsapp.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const text = encodeURIComponent(
      `Olá, ${apt.clientName}! 🪐 Passando para confirmar nosso atendimento de *${apt.serviceName}* agendado para *${apt.date} às ${apt.time}*.\n\nLink do Google Meet: ${apt.meetLink}\n\nQualquer dúvida estou à disposição! — Bianca Tofoli | Casa 6`
    );
    window.open(`https://wa.me/${phoneWithCountry}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#372B69] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#F0B55E] text-xs font-bold uppercase tracking-widest">
            <CalendarIcon className="h-4 w-4" />
            <span>Operações &bull; Gestão de Consultas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white capitalize">
            Agenda de Atendimentos ({monthYearLabel})
          </h2>
          <p className="text-xs sm:text-sm text-[#DAD2C4]">
            Visualização em calendário mensal sincronizável com múltiplos e-mails Google e conectado ao CRM.
          </p>
        </div>

        <button
          onClick={() => handleOpenNewModal()}
          className="py-2.5 px-4 rounded-xl bg-[#F0B55E] hover:bg-[#E5A344] text-[#1E1B4B] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Agendamento</span>
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

      {/* Barra de Filtros e Contas Vinculadas */}
      <div className="bg-[#1D1B48] border border-[#372B69] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg bg-[#2B2566] text-white hover:text-[#F0B55E] transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-heading font-bold text-sm text-white capitalize min-w-[130px] text-center">
            {monthYearLabel}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg bg-[#2B2566] text-white hover:text-[#F0B55E] transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#DAD2C4]">Conta Google:</span>
            <select
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              className="bg-[#2B2566] border border-[#372B69] rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none"
            >
              <option value="all">Todas as contas ({googleAccounts.length})</option>
              {googleAccounts.map((acc) => (
                <option key={acc.email} value={acc.email}>
                  {acc.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#DAD2C4]">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#2B2566] border border-[#372B69] rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none"
            >
              <option value="all">Todos</option>
              <option value="agendado">Agendados</option>
              <option value="confirmado">Confirmados</option>
              <option value="realizado">Realizados</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calendário Mensal Estilo Google Agenda */}
      <div className="bg-[#1D1B48] border border-[#372B69] rounded-2xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-7 bg-[#2B2566] border-b border-[#372B69] text-center text-xs font-bold text-[#F0B55E] uppercase py-3">
          <span>Dom</span>
          <span>Seg</span>
          <span>Ter</span>
          <span>Qua</span>
          <span>Qui</span>
          <span>Sex</span>
          <span>Sáb</span>
        </div>

        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#372B69]">
          {/* Espaços em branco antes do 1º dia */}
          {Array.from({ length: firstDayWeekIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="min-h-[110px] bg-[#161438]/50 p-2 opacity-30" />
          ))}

          {/* Dias do Mês */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayApts = filteredAppointments.filter((a) => a.date === dateStr);

            return (
              <div
                key={dateStr}
                onClick={() => handleOpenNewModal(dateStr)}
                className="min-h-[110px] p-2 bg-[#1D1B48] hover:bg-[#25225a] transition-colors cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#DAD2C4] group-hover:text-white">
                    {dayNum}
                  </span>
                  {dayApts.length > 0 && (
                    <span className="text-[10px] bg-[#F0B55E] text-[#1E1B4B] font-extrabold px-1.5 py-0.2 rounded-full">
                      {dayApts.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1 mt-1 overflow-y-auto max-h-[85px]">
                  {dayApts.map((apt) => (
                    <div
                      key={apt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAppointment(apt);
                        setIsModalOpen(true);
                      }}
                      className="text-[10px] p-1.5 rounded-md bg-[#2B2566] border border-[#F0B55E]/30 text-white truncate hover:border-[#F0B55E] transition-all"
                    >
                      <div className="font-bold text-[#F0B55E] flex items-center justify-between">
                        <span>{apt.time}</span>
                        <span className="capitalize text-[9px] text-[#DAD2C4]">
                          {apt.status}
                        </span>
                      </div>
                      <div className="truncate font-medium">{apt.clientName}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista Rápida dos Próximos Atendimentos */}
      <div className="bg-[#1D1B48] border border-[#372B69] rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2 border-b border-[#372B69] pb-3">
          <Clock className="h-5 w-5 text-[#F0B55E]" />
          Próximos Atendimentos Agendados & Ações Rápidas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.slice(0, 6).map((apt) => (
            <div
              key={apt.id}
              className="bg-[#2B2566] border border-[#372B69] rounded-xl p-4 space-y-3 hover:border-[#F0B55E]/60 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-[#1D1B48] text-[#F0B55E] border border-[#F0B55E]/30">
                    {apt.date} às {apt.time}
                  </span>
                  <span className="text-[10px] text-white/70">{apt.durationMinutes} min</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm truncate">{apt.clientName}</h4>
                  <p className="text-xs text-[#DAD2C4] font-medium">{apt.serviceName}</p>
                </div>
                <p className="text-[11px] text-[#DAD2C4]/80 italic line-clamp-2">
                  "{apt.notes || 'Sem observações adicionais.'}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSendReminderWhatsApp(apt)}
                    title="Enviar lembrete via WhatsApp"
                    className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                  <a
                    href={apt.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    title="Entrar na sala Google Meet"
                    className="p-1.5 rounded-lg bg-blue-600/30 text-blue-300 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <Video className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={generateGoogleCalendarUrl(apt)}
                    target="_blank"
                    rel="noreferrer"
                    title="Adicionar à Agenda Google"
                    className="p-1.5 rounded-lg bg-[#1D1B48] text-[#F0B55E] hover:bg-[#F0B55E] hover:text-[#1E1B4B] transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingAppointment(apt);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-[#DAD2C4] hover:text-white"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(apt.id)}
                    className="p-1.5 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Criação / Edição de Atendimento */}
      {isModalOpen && editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#1D1B48] border border-[#F0B55E]/40 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#372B69] pb-3">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-[#F0B55E]" />
                {editingAppointment.id ? 'Editar Atendimento' : 'Novo Atendimento'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#DAD2C4] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAppointment} className="space-y-4">
              {/* Vincular Cliente do CRM */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#DAD2C4]">Vincular Cliente do CRM</label>
                <select
                  onChange={(e) => handleSelectContactForModal(e.target.value)}
                  className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                >
                  <option value="">Selecione para autopreencher dados...</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.whatsapp})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#DAD2C4]">Nome do Cliente *</label>
                  <input
                    type="text"
                    required
                    value={editingAppointment.clientName || ''}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, clientName: e.target.value })}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#DAD2C4]">WhatsApp do Cliente *</label>
                  <input
                    type="text"
                    required
                    value={editingAppointment.clientWhatsapp || ''}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, clientWhatsapp: e.target.value })}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#DAD2C4]">Data *</label>
                  <input
                    type="date"
                    required
                    value={editingAppointment.date || ''}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, date: e.target.value })}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#DAD2C4]">Horário *</label>
                  <input
                    type="time"
                    required
                    value={editingAppointment.time || ''}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, time: e.target.value })}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#DAD2C4]">Serviço</label>
                  <input
                    type="text"
                    value={editingAppointment.serviceName || ''}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, serviceName: e.target.value })}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#DAD2C4]">Conta Google Calendar</label>
                  <select
                    value={editingAppointment.gmailAccount || ''}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, gmailAccount: e.target.value })}
                    className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                  >
                    {googleAccounts.map((a) => (
                      <option key={a.email} value={a.email}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#DAD2C4]">Link do Google Meet</label>
                <input
                  type="url"
                  value={editingAppointment.meetLink || ''}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, meetLink: e.target.value })}
                  className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#DAD2C4]">Observações Internas</label>
                <textarea
                  rows={3}
                  value={editingAppointment.notes || ''}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, notes: e.target.value })}
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
                  Salvar Atendimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
