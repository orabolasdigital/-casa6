/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Hub Central do Painel de Controles (Grid Visual de 4 Seções e Itens)
 * Estilo visual refinado inspirado no layout solicitado, aplicado à identidade Casa 6.
 */

import React from 'react';
import {
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
  ArrowRight
} from 'lucide-react';

export type SectionKey = 'operacoes' | 'servicos' | 'fluxos' | 'paginas';
export type ItemKey =
  // Operações
  | 'calculadora'
  | 'agenda'
  | 'cadastros'
  // Serviços
  | 'serv_atendimentos'
  | 'serv_palestras'
  | 'serv_parcerias'
  | 'serv_patota'
  | 'serv_bussola'
  | 'serv_lojinha'
  // Fluxos
  | 'fluxo_mensagens'
  | 'fluxo_automacoes'
  | 'fluxo_blog'
  | 'fluxo_pagamento'
  | 'fluxo_vinculacoes'
  | 'fluxo_acessos'
  // Páginas
  | 'pag_inicio'
  | 'pag_sobre'
  | 'pag_atendimentos'
  | 'pag_palestras'
  | 'pag_parcerias'
  | 'pag_bussola'
  | 'pag_patota'
  | 'pag_leituras'
  | 'pag_lojinha';

interface AdminHubGridProps {
  onSelectItem: (section: SectionKey, item: ItemKey) => void;
  crmCount: number;
  agendaCount: number;
}

export const AdminHubGrid: React.FC<AdminHubGridProps> = ({
  onSelectItem,
  crmCount,
  agendaCount
}) => {
  return (
    <div className="space-y-12 pb-12">
      
      {/* =========================================================================
          SEÇÃO 1: OPERAÇÕES (O Coração Operacional do Projeto)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-[#372B69] pb-2">
          <span className="h-2 w-2 rounded-full bg-[#F0B55E]" />
          <h2 className="font-heading text-xl sm:text-2xl font-black text-white tracking-wider uppercase">
            OPERAÇÕES
          </h2>
          <span className="text-xs text-[#DAD2C4]/70 font-normal">
            (Calculadora Astral, Agenda de Atendimentos & CRM de Cadastros)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Item 1: Calculadora Astral */}
          <div
            onClick={() => onSelectItem('operacoes', 'calculadora')}
            className="group relative rounded-2xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center border border-[#F0B55E]/30 group-hover:scale-110 transition-transform">
                <Calculator className="h-6 w-6 text-[#F0B55E]" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#F0B55E] transition-colors uppercase tracking-wide">
                  Calculadora Astral
                </h3>
                <p className="text-xs text-[#DAD2C4] leading-relaxed mt-1">
                  Cálculo de trânsitos, geração automática de textos e emissão de Bússolas em PDF prontas para envio no WhatsApp e e-mail.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[#F0B55E] pt-2 border-t border-white/5">
              <span>Bússola Pessoal & Trânsitos</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Item 2: Agenda Atendimentos */}
          <div
            onClick={() => onSelectItem('operacoes', 'agenda')}
            className="group relative rounded-2xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center border border-[#F0B55E]/30 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-[#F0B55E]" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#F0B55E] transition-colors uppercase tracking-wide">
                    Agenda Atendimentos
                  </h3>
                  {agendaCount > 0 && (
                    <span className="text-[10px] bg-[#F0B55E] text-[#2B2566] px-2 py-0.5 rounded-full font-bold">
                      {agendaCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#DAD2C4] leading-relaxed mt-1">
                  Calendário mensal com sincronização Google Agenda (múltiplos Gmails), histórico de consultas e agendamentos vinculados ao CRM.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[#F0B55E] pt-2 border-t border-white/5">
              <span>Google Meet & Histórico</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Item 3: Cadastros (CRM) */}
          <div
            onClick={() => onSelectItem('operacoes', 'cadastros')}
            className="group relative rounded-2xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center border border-[#F0B55E]/30 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-[#F0B55E]" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#F0B55E] transition-colors uppercase tracking-wide">
                    Cadastros (CRM)
                  </h3>
                  {crmCount > 0 && (
                    <span className="text-[10px] bg-[#25D366] text-white px-2 py-0.5 rounded-full font-bold">
                      {crmCount} Contatos
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#DAD2C4] leading-relaxed mt-1">
                  Planilha interativa de contatos, ordenação, gaveta lateral com histórico individual e disparo de WhatsApp em um clique.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[#F0B55E] pt-2 border-t border-white/5">
              <span>Coração do Sistema</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 2: SERVIÇOS (Catálogo, Coleções & Fretes)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-[#372B69] pb-2">
          <span className="h-2 w-2 rounded-full bg-[#F0B55E]" />
          <h2 className="font-heading text-xl sm:text-2xl font-black text-white tracking-wider uppercase">
            SERVIÇOS
          </h2>
          <span className="text-xs text-[#DAD2C4]/70 font-normal">
            (Edição das Coleções, Textos, Imagens, Preços & Botão Restaurar Padrões)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {/* Atendimentos */}
          <div
            onClick={() => onSelectItem('servicos', 'serv_atendimentos')}
            className="group rounded-2xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:-translate-y-1"
          >
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center border border-[#F0B55E]/30">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-white group-hover:text-[#F0B55E] transition-colors uppercase">
                Atendimentos
              </h3>
              <p className="text-xs text-[#DAD2C4] line-clamp-2">
                Mapa Natal, Revolução Solar, Pronto Socorro Astrológico e Combos.
              </p>
            </div>
            <span className="text-[10px] text-[#F0B55E] font-bold flex items-center gap-1">
              <span>Editar /atendimentos</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Palestras */}
          <div
            onClick={() => onSelectItem('servicos', 'serv_palestras')}
            className="group rounded-2xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:-translate-y-1"
          >
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center border border-[#F0B55E]/30">
                <Presentation className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-white group-hover:text-[#F0B55E] transition-colors uppercase">
                Palestras
              </h3>
              <p className="text-xs text-[#DAD2C4] line-clamp-2">
                Portfólio de palestras para empresas, temas de saúde mental e NR-1.
              </p>
            </div>
            <span className="text-[10px] text-[#F0B55E] font-bold flex items-center gap-1">
              <span>Editar /palestras</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Parcerias */}
          <div
            onClick={() => onSelectItem('servicos', 'serv_parcerias')}
            className="group rounded-2xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:-translate-y-1"
          >
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center border border-[#F0B55E]/30">
                <Handshake className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-white group-hover:text-[#F0B55E] transition-colors uppercase">
                Parcerias
              </h3>
              <p className="text-xs text-[#DAD2C4] line-clamp-2">
                Marcas parceiras, permutas, divulgação e co-criação institucional.
              </p>
            </div>
            <span className="text-[10px] text-[#F0B55E] font-bold flex items-center gap-1">
              <span>Editar /parcerias</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Patota Astral */}
          <div
            onClick={() => onSelectItem('servicos', 'serv_patota')}
            className="group rounded-2xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:-translate-y-1"
          >
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center border border-[#F0B55E]/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-white group-hover:text-[#F0B55E] transition-colors uppercase">
                Patota Astral
              </h3>
              <p className="text-xs text-[#DAD2C4] line-clamp-2">
                Planos de assinatura (R$ 47/mês), benefícios 3D e grupo VIP.
              </p>
            </div>
            <span className="text-[10px] text-[#F0B55E] font-bold flex items-center gap-1">
              <span>Editar /patota</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Bússola */}
          <div
            onClick={() => onSelectItem('servicos', 'serv_bussola')}
            className="group rounded-2xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:-translate-y-1"
          >
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center border border-[#F0B55E]/30">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-white group-hover:text-[#F0B55E] transition-colors uppercase">
                Bússola
              </h3>
              <p className="text-xs text-[#DAD2C4] line-clamp-2">
                Família de Bússolas (Profissional, Amorosa, Pessoal e Materna).
              </p>
            </div>
            <span className="text-[10px] text-[#F0B55E] font-bold flex items-center gap-1">
              <span>Editar /bussola</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Lojinha */}
          <div
            onClick={() => onSelectItem('servicos', 'serv_lojinha')}
            className="group rounded-2xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:-translate-y-1"
          >
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center border border-[#F0B55E]/30">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-white group-hover:text-[#F0B55E] transition-colors uppercase">
                Lojinha
              </h3>
              <p className="text-xs text-[#DAD2C4] line-clamp-2">
                Produtos, Box Semeadura e configuração de frete (Fixo, KM ou Estado).
              </p>
            </div>
            <span className="text-[10px] text-[#F0B55E] font-bold flex items-center gap-1">
              <span>Editar /loja & Fretes</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 3: FLUXOS (Comunicação, Automações, Pagamentos & Rastreamento)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-[#372B69] pb-2">
          <span className="h-2 w-2 rounded-full bg-[#F0B55E]" />
          <h2 className="font-heading text-xl sm:text-2xl font-black text-white tracking-wider uppercase">
            FLUXOS
          </h2>
          <span className="text-xs text-[#DAD2C4]/70 font-normal">
            (Mensagens WhatsApp, E-mail Marketing, Blog SEO, Mercado Pago & Pixels)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {/* Mensagens */}
          <div
            onClick={() => onSelectItem('fluxos', 'fluxo_mensagens')}
            className="group rounded-2xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:-translate-y-1"
          >
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center border border-[#F0B55E]/30">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-white group-hover:text-[#F0B55E] transition-colors uppercase">
                Mensagens
              </h3>
              <p className="text-xs text-[#DAD2C4] line-clamp-2">
                Templates de mensagens de WhatsApp enviados pela Bianca aos clientes.
              </p>
            </div>
            <span className="text-[10px] text-[#F0B55E] font-bold flex items-center gap-1">
              <span>Gerenciar Modelos</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Automações */}
          <div
            onClick={() => onSelectItem('fluxos', 'fluxo_automacoes')}
            className="group rounded-2xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:-translate-y-1"
          >
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center border border-[#F0B55E]/30">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-white group-hover:text-[#F0B55E] transition-colors uppercase">
                Automações
              </h3>
              <p className="text-xs text-[#DAD2C4] line-clamp-2">
                Disparos automáticos de e-mail marketing, formulários e cópias para Bianca.
              </p>
            </div>
            <span className="text-[10px] text-[#F0B55E] font-bold flex items-center gap-1">
              <span>Configurar Disparos</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Blog (Caderno Astral) */}
          <div
            onClick={() => onSelectItem('fluxos', 'fluxo_blog')}
            className="group rounded-2xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:-translate-y-1"
          >
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center border border-[#F0B55E]/30">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-white group-hover:text-[#F0B55E] transition-colors uppercase">
                Blog
              </h3>
              <p className="text-xs text-[#DAD2C4] line-clamp-2">
                Editor visual completo dos artigos do Caderno Astral com SEO e formatação.
              </p>
            </div>
            <span className="text-[10px] text-[#F0B55E] font-bold flex items-center gap-1">
              <span>Editor de Artigos</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Pagamento */}
          <div
            onClick={() => onSelectItem('fluxos', 'fluxo_pagamento')}
            className="group rounded-2xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:-translate-y-1"
          >
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center border border-[#F0B55E]/30">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-white group-hover:text-[#F0B55E] transition-colors uppercase">
                Pagamento
              </h3>
              <p className="text-xs text-[#DAD2C4] line-clamp-2">
                Credenciais de chave do Mercado Pago para atualização direta no sistema.
              </p>
            </div>
            <span className="text-[10px] text-[#F0B55E] font-bold flex items-center gap-1">
              <span>Chaves Mercado Pago</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Vinculações */}
          <div
            onClick={() => onSelectItem('fluxos', 'fluxo_vinculacoes')}
            className="group rounded-2xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:-translate-y-1"
          >
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center border border-[#F0B55E]/30">
                <Share2 className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-white group-hover:text-[#F0B55E] transition-colors uppercase">
                Vinculações
              </h3>
              <p className="text-xs text-[#DAD2C4] line-clamp-2">
                Google Meu Negócio, GTM, GA4, Meta Ads, TikTok, Twitter e scripts.
              </p>
            </div>
            <span className="text-[10px] text-[#F0B55E] font-bold flex items-center gap-1">
              <span>Pixels & Tracking</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Acessos */}
          <div
            onClick={() => onSelectItem('fluxos', 'fluxo_acessos')}
            className="group rounded-2xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:-translate-y-1"
          >
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center border border-[#F0B55E]/30">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-white group-hover:text-[#F0B55E] transition-colors uppercase">
                Acessos
              </h3>
              <p className="text-xs text-[#DAD2C4] line-clamp-2">
                Controle de permissões (Suporte [Mestre], Bianca [Admin] e Caio [Operador]).
              </p>
            </div>
            <span className="text-[10px] text-[#F0B55E] font-bold flex items-center gap-1">
              <span>Gerenciar Usuários</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 4: PÁGINAS (CMS de Conteúdo & Cores das 9 Páginas do Site)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-[#372B69] pb-2">
          <span className="h-2 w-2 rounded-full bg-[#F0B55E]" />
          <h2 className="font-heading text-xl sm:text-2xl font-black text-white tracking-wider uppercase">
            PÁGINAS
          </h2>
          <span className="text-xs text-[#DAD2C4]/70 font-normal">
            (Editar Textos, Títulos, Banners, Imagens & Cores com Botão Restaurar Original)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { id: 'pag_inicio' as ItemKey, label: '/início', desc: 'Home & Banners' },
            { id: 'pag_sobre' as ItemKey, label: '/sobre', desc: 'Biografia & História' },
            { id: 'pag_atendimentos' as ItemKey, label: '/atendimentos', desc: 'Consultas & Mapas' },
            { id: 'pag_palestras' as ItemKey, label: '/palestras', desc: 'Corporativo & NR-1' },
            { id: 'pag_parcerias' as ItemKey, label: '/parcerias', desc: 'Permutas & Marcas' },
            { id: 'pag_bussola' as ItemKey, label: '/bussola', desc: 'Família de Bússolas' },
            { id: 'pag_patota' as ItemKey, label: '/patota', desc: 'Comunidade Astral' },
            { id: 'pag_leituras' as ItemKey, label: '/leituras', desc: 'Caderno Editorial' },
            { id: 'pag_lojinha' as ItemKey, label: '/lojinha', desc: 'Produtos & Rituais' }
          ].map((page) => (
            <div
              key={page.id}
              onClick={() => onSelectItem('paginas', page.id)}
              className="group rounded-xl bg-[#1D1B48] border border-[#372B69] hover:border-[#F0B55E] p-4 shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-2 hover:-translate-y-0.5"
            >
              <div>
                <span className="font-heading text-sm font-bold text-white group-hover:text-[#F0B55E] transition-colors block">
                  {page.label}
                </span>
                <span className="text-[11px] text-[#DAD2C4] block">
                  {page.desc}
                </span>
              </div>
              <span className="text-[10px] text-[#F0B55E] font-semibold flex items-center gap-1">
                <span>Editar Página</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
