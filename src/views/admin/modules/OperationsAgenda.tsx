/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo: Agenda de Atendimentos (Calendário Mensal & Sincronização Google)
 * Tema Claro (Light Theme)
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
  Send,
  Trash2,
  Edit2
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
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date(2026, 10, 1));
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

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayWeekIndex = new Date(year, month, 1).getDay();

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
    <div className="space-y-6 animate-fadeIn text-[#22205A]">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E0D8] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#D99426] text-xs font-bold uppercase tracking-widest">
            <CalendarIcon className="h-4 w-4" />
            <span>Operações &bull; Gestão de Consultas</span>
          </div>
          <h2 className="text-2xl font-heading font-black text-[#22205A] mt-1 capitalize">
            Agenda de Atendimentos ({monthYearLabel})
          </h2>
          <p className="text-xs sm:text-sm text-[#68638C]">
            Visualização em calendário mensal sincronizável com múltiplos e-mails Google e conectado ao CRM.
          </p>
        </div>

        <button
          onClick={() => handleOpenNewModal()}
          className="py-2.5 px-4 rounded-xl bg-[#22205A] hover:bg-[#1B1948] text-[#F0B55E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Agendamento</span>
        </button>
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

      {/* Barra de Filtros */}
      <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg border border-[#E5E0D8] text-[#22205A] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-heading font-bold text-sm text-[#22205A] capitalize min-w-[130px] text-center">
            {monthYearLabel}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg border border-[#E5E0D8] text-[#22205A] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#68638C]">Conta Google:</span>
            <select
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              className="bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs focus:outline-none"
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
            <span className="text-[#68638C]">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#FAF8F5] border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-[#22205A] text-xs focus:outline-none"
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

      {/* Calendário Mensal Estilo Google Agenda Claro */}
      <div className="bg-white border border-[#E5E0D8] rounded-2xl overflow-hidden shadow-xs">
        <div className="grid grid-cols-7 bg-[#FAF8F5] border-b border-[#E5E0D8] text-center text-xs font-bold text-[#22205A] uppercase py-3">
          <span>Dom</span>
          <span>Seg</span>
          <span>Ter</span>
          <span>Qua</span>
          <span>Qui</span>
          <span>Sex</span>
          <span>Sáb</span>
        </div>

        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#E5E0D8]">
          {/* Espaços antes do 1º dia */}
          {Array.from({ length: firstDayWeekIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="min-h-[105px] bg-[#FAF8F5]/60 p-2 opacity-50" />
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
                className="min-h-[105px] p-2 bg-white hover:bg-[#FAF8F5] transition-colors cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#554F70] group-hover:text-[#22205A]">
                    {dayNum}
                  </span>
                  {dayApts.length > 0 && (
                    <span className="text-[10px] bg-[#22205A] text-[#F0B55E] font-extrabold px-1.5 py-0.2 rounded-full">
                      {dayApts.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1 mt-1 overflow-y-auto max-h-[80px]">
                  {dayApts.map((apt) => (
                    <div
                      key={apt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAppointment(apt);
                        setIsModalOpen(true);
                      }}
                      className="text-[10px] p-1.5 rounded-md bg-[#FAF8F5] border border-[#E5E0D8] text-[#22205A] truncate hover:border-[#D99426] transition-all"
                    >
                      <div className="font-bold text-[#D99426] flex items-center justify-between">
                        <span>{apt.time}</span>
                        <span className="capitalize text-[9px] text-[#68638C]">
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
      <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-heading text-base font-bold text-[#22205A] flex items-center gap-2 border-b border-[#F0EBE1] pb-3">
          <Clock className="h-4 w-4 text-[#D99426]" />
          Próximos Atendimentos & Ações Rápidas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.slice(0, 6).map((apt) => (
            <div
              key={apt.id}
              className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-4 space-y-3 hover:border-[#D99426] transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-white text-[#22205A] border border-[#E5E0D8]">
                    {apt.date} às {apt.time}
                  </span>
                  <span className="text-[10px] text-[#68638C]">{apt.durationMinutes} min</span>
                </div>
                <div>
                  <h4 className="text-[#22205A] font-bold text-sm truncate">{apt.clientName}</h4>
                  <p className="text-xs text-[#554F70] font-medium">{apt.serviceName}</p>
                </div>
                <p className="text-[11px] text-[#68638C] italic line-clamp-2">
                  "{apt.notes || 'Sem observações adicionais.'}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSendReminderWhatsApp(apt)}
                    title="Enviar lembrete via WhatsApp"
                    className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                  <a
                    href={apt.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    title="Entrar na sala Google Meet"
                    className="p-1.5 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <Video className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={generateGoogleCalendarUrl(apt)}
                    target="_blank"
                    rel="noreferrer"
                    title="Adicionar à Agenda Google"
                    className="p-1.5 rounded-lg bg-white border border-[#E5E0D8] text-[#22205A] hover:bg-[#22205A] hover:text-[#F0B55E] transition-colors"
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
                    className="p-1.5 text-[#554F70] hover:text-[#22205A]"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(apt.id)}
                    className="p-1.5 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Criação / Edição */}
      {isModalOpen && editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-[#E5E0D8] rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <h3 className="font-heading text-base font-bold text-[#22205A] flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-[#D99426]" />
                {editingAppointment.id ? 'Editar Atendimento' : 'Novo Atendimento'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#68638C] hover:text-[#22205A] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAppointment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Vincular Cliente do CRM</label>
                <select
                  onChange={(e) => handleSelectContactForModal(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                >
                  <option value="">Selecione para autopreencher dados...</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.whatsapp})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Nome do Cliente *</label>
                  <input
                    type="text"
                    required
                    value={editingAppointment.clientName || ''}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, clientName: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">WhatsApp do Cliente *</label>
                  <input
                    type="text"
                    required
                    value={editingAppointment.clientWhatsapp || ''}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, clientWhatsapp: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Data *</label>
                  <input
                    type="date"
                    required
                    value={editingAppointment.date || ''}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, date: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Horário *</label>
                  <input
                    type="time"
                    required
                    value={editingAppointment.time || ''}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, time: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Serviço</label>
                  <input
                    type="text"
                    value={editingAppointment.serviceName || ''}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, serviceName: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#22205A]">Conta Google Calendar</label>
                  <select
                    value={editingAppointment.gmailAccount || ''}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, gmailAccount: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                  >
                    {googleAccounts.map((a) => (
                      <option key={a.email} value={a.email}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Link do Google Meet</label>
                <input
                  type="url"
                  value={editingAppointment.meetLink || ''}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, meetLink: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-[#22205A] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#22205A]">Observações Internas</label>
                <textarea
                  rows={2}
                  value={editingAppointment.notes || ''}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, notes: e.target.value })}
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
                  className="px-5 py-2.5 rounded-xl bg-[#22205A] hover:bg-[#1B1948] text-[#F0B55E] font-bold text-xs uppercase tracking-wider shadow-xs"
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
