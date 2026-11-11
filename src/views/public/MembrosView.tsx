/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão da Área de Membros (/membros & /painel-membro)
 * Login com E-mail e CPF -> Consulta de pedidos, assinaturas e visualização em HTML do relatório da Bússola Guia
 */

import React, { useState, useEffect } from 'react';
import { User, Lock, Download, FileText, CheckCircle2, Compass, ShieldCheck, LogOut } from 'lucide-react';
import { OrderRecord } from '../../types';
import { getOrdersByMember } from '../../services/mercadopago';

export const MembrosView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReportOrder, setSelectedReportOrder] = useState<OrderRecord | null>(null);
  const [loginError, setLoginError] = useState('');

  // Verifica se já estava logado na sessão
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('casa6_member_email');
    const savedCpf = sessionStorage.getItem('casa6_member_cpf');
    if (savedEmail && savedCpf) {
      setEmail(savedEmail);
      setCpf(savedCpf);
      fetchMemberData(savedEmail, savedCpf);
    }
  }, []);

  const fetchMemberData = async (userEmail: string, userCpf: string) => {
    setIsLoading(true);
    setLoginError('');
    try {
      const records = await getOrdersByMember(userEmail, userCpf);
      setOrders(records);
      setIsAuthenticated(true);
      sessionStorage.setItem('casa6_member_email', userEmail);
      sessionStorage.setItem('casa6_member_cpf', userCpf);

      // Se houver algum relatório da bússola, seleciona o mais recente por padrão
      const bussula = records.find((r) => r.serviceType === 'bussula' && r.reportHtml);
      if (bussula) {
        setSelectedReportOrder(bussula);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Erro ao carregar seus dados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !cpf.trim()) {
      setLoginError('Informe seu e-mail e CPF cadastrados no momento da compra.');
      return;
    }
    await fetchMemberData(email, cpf);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('casa6_member_email');
    sessionStorage.removeItem('casa6_member_cpf');
    setIsAuthenticated(false);
    setOrders([]);
    setSelectedReportOrder(null);
  };

  const handleDownloadPdf = (order: OrderRecord) => {
    // Abre a visualização de impressão/PDF da janela
    const printWindow = window.open('', '_blank');
    if (printWindow && order.reportHtml) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Bússola Guia — Casa 6</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: white; }
            </style>
          </head>
          <body>
            ${order.reportHtml}
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="bg-[#F4EFE6] text-[#2B2566] min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header Institucional da Área de Membros */}
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <div className="flex justify-center pb-1">
          <img
            src="https://static.wixstatic.com/media/02c8e0_75b529b0748c4e54adf4e58bfa7c78dc~mv2.png"
            alt="Casa 6"
            className="h-10 w-auto object-contain"
          />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F]">
          PORTAL EXCLUSIVO DO CLIENTE
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#2B2566]">
          Área de Membros
        </h1>
        <p className="text-xs sm:text-sm text-[#423C7B] max-w-lg mx-auto">
          Acesse seus relatórios da Bússola Guia, status da Patota Astral e histórico de pedidos.
        </p>
      </div>

      {!isAuthenticated ? (
        /* =========================================================================
           TELA DE LOGIN DO MEMBRO (LOGIN = E-MAIL / SENHA = CPF)
           ========================================================================= */
        <div className="max-w-md mx-auto bg-[#FCFAF7] rounded-3xl border-2 border-[#F0B55E] shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#2B2566] text-[#F0B55E] mx-auto flex items-center justify-center">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-xl font-bold text-[#2B2566]">Acesso do Membro</h2>
            <p className="text-xs text-[#423C7B]">
              Área de acesso restrito. Informe seu e-mail cadastrado como login e seu CPF como senha.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2B2566] mb-1">Login (E-mail de Cadastro) *</label>
              <input
                type="email"
                required
                autoComplete="username"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#F0B55E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2566] mb-1">Senha (CPF cadastrado) *</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="Digite seu CPF (apenas números ou pontuado)"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full text-xs rounded-xl border border-[#E2DCCF] bg-white px-3.5 py-2.5 text-[#2B2566] focus:border-[#F0B55E] focus:outline-none"
              />
              <p className="text-[10px] text-[#8C987F] mt-1">
                Sua senha é o CPF informado na contratação do serviço ou assinatura.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#F0B55E] hover:bg-[#dfa247] text-[#2B2566] py-3.5 px-6 text-xs font-extrabold uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{isLoading ? 'Verificando...' : 'ENTRAR NA ÁREA DE MEMBROS'}</span>
            </button>
          </form>

          <div className="text-[11px] text-center text-[#68638C] border-t border-[#E2DCCF]/60 pt-3">
            Ainda não possui cadastro?{' '}
            <a href="/bussola" className="text-[#2B2566] font-bold hover:underline">
              Contrate a Bússola Guia
            </a>{' '}
            ou a{' '}
            <a href="/patota" className="text-[#2B2566] font-bold hover:underline">
              Patota Astral
            </a>
          </div>
        </div>
      ) : (
        /* =========================================================================
           PAINEL DO MEMBRO AUTENTICADO
           ========================================================================= */
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Barra de Usuário */}
          <div className="bg-[#FCFAF7] rounded-2xl p-4 sm:p-6 border border-[#E2DCCF] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2B2566] text-[#F0B55E] flex items-center justify-center font-bold">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#8C987F] font-bold uppercase tracking-wider">Membro Conectado</p>
                <p className="text-sm font-bold text-[#2B2566]">{email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-[#423C7B] hover:text-red-600 cursor-pointer font-bold transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair da conta</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Coluna Esquerda: Lista de Pedidos & Assinaturas */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-heading text-xl font-bold text-[#2B2566] flex items-center gap-2">
                <Compass className="h-5 w-5 text-[#F0B55E]" />
                <span>Seus Pedidos & Assinaturas</span>
              </h2>

              {orders.length === 0 ? (
                <div className="bg-[#FCFAF7] rounded-2xl p-6 border border-[#E2DCCF] text-center space-y-3">
                  <p className="text-xs text-[#423C7B]">
                    Nenhum pedido vinculado a este e-mail/CPF no momento.
                  </p>
                  <a
                    href="/bussola"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2B2566] bg-[#F0B55E] hover:bg-[#dfa247] py-2 px-4 rounded-full"
                  >
                    Contratar Bússola Guia
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => {
                    const isSelected = selectedReportOrder?.id === order.id;
                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedReportOrder(order)}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2B2566] text-white border-[#F0B55E] shadow-md'
                            : 'bg-[#FCFAF7] text-[#2B2566] border-[#E2DCCF] hover:border-[#F0B55E]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs pb-1">
                          <span className={`font-bold uppercase tracking-wider text-[10px] ${isSelected ? 'text-[#F0B55E]' : 'text-[#8C987F]'}`}>
                            {order.serviceType.toUpperCase()} • #{order.id}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#25D366] font-bold">
                            <CheckCircle2 className="h-3 w-3" />
                            Aprovado
                          </span>
                        </div>

                        <h3 className="font-heading text-base font-bold my-1">
                          {order.itemTitle}
                        </h3>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-current/20">
                          <span className="opacity-80">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="font-bold">
                            R$ {order.amount.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Coluna Direita: Visualizador do Relatório Astrológico em HTML & PDF */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold text-[#2B2566] flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#F0B55E]" />
                  <span>Visualizador do Relatório Mensal</span>
                </h2>

                {selectedReportOrder && (
                  <button
                    onClick={() => handleDownloadPdf(selectedReportOrder)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#2B2566] text-[#F0B55E] px-4 py-2 text-xs font-bold shadow-xs hover:bg-[#181343] transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Baixar / Imprimir PDF</span>
                  </button>
                )}
              </div>

              {selectedReportOrder?.reportHtml ? (
                <div className="bg-[#FCFAF7] rounded-3xl border border-[#E2DCCF] p-4 sm:p-6 shadow-md overflow-hidden">
                  <div
                    className="prose max-w-none text-xs sm:text-sm"
                    dangerouslySetInnerHTML={{ __html: selectedReportOrder.reportHtml }}
                  />
                </div>
              ) : (
                <div className="bg-[#FCFAF7] rounded-3xl border border-[#E2DCCF] p-10 text-center space-y-3">
                  <Compass className="h-10 w-10 text-[#8C987F] mx-auto" />
                  <h3 className="font-heading text-lg font-bold text-[#2B2566]">
                    Selecione um pedido ao lado
                  </h3>
                  <p className="text-xs text-[#423C7B] max-w-md mx-auto">
                    Clique em um dos seus relatórios da Bússola Guia para visualizar a análise completa em HTML ou gerar o PDF de alta resolução.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
