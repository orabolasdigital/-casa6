/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Footer Oficial Moderno e Estruturado (Design System Alinhado à Referência)
 * 
 * Contém:
 * - 4 Colunas Estruturadas (Marca & Redes Sociais, Atendimentos & Serviços, Contato Comercial, Localização)
 * - Botão de Ação Comercial / Agendamento
 * - Todos os Links Oficiais de Redes Sociais (Instagram, Facebook, YouTube, Spotify, WhatsApp)
 * - Cláusulas de Proteção de Conteúdo (Lei Federal nº 9.610/1998)
 * - Créditos Oficiais @orabolasdigital com link externo
 * - Links de Governança: Preferências de Cookies, Catálogo Técnico e Acesso Administrativo
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Instagram,
  Facebook,
  Youtube,
  Music2,
  MessageCircle,
  Mail,
  Clock,
  MapPin,
  ExternalLink,
  Terminal,
  X,
  Code2,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [techCatalogOpen, setTechCatalogOpen] = useState(false);

  const handleOpenCookies = () => {
    window.dispatchEvent(new CustomEvent('open-casa6-cookies'));
  };

  const handleOpenBooking = () => {
    window.dispatchEvent(new CustomEvent('open-casa6-whatsapp', { detail: { serviceId: 'pronto-socorro-astrologico' } }));
  };

  return (
    <footer className="relative w-full bg-[#18202C] text-[#E6EAF0] border-t border-white/10 font-sans">
      {/* Topo do Footer: 4 Colunas Estruturadas */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 items-start">
          
          {/* =========================================================================
              COLUNA 1: LOGO, BIOGRAFIA, BADGE E REDES SOCIAIS
              ========================================================================= */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center">
              <img
                src="https://static.wixstatic.com/media/02c8e0_916db28bdef7413a82fde89b9ce7f738~mv2.png"
                alt="Casa 6 — Bianca Tofoli"
                className="h-10 w-auto object-contain cursor-pointer"
                onClick={() => onNavigate('/inicio')}
              />
            </div>

            <p className="text-xs text-[#A0AEC0] leading-relaxed max-w-sm">
              Plataforma oficial de Bianca Tofoli: enfermeira, gestora, palestrante e astróloga. Consultas individuais de Mapa Natal, Bússola Guia, comunidade Patota Astral e palestras corporativas.
            </p>

            {/* Selo / Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#F0B55E]/40 bg-[#F0B55E]/10 text-[#F0B55E] text-[10px] font-bold tracking-wider uppercase">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>ATENDIMENTO & CUIDADO DESDE 2021</span>
            </div>

            {/* Ícones de Redes Sociais em Caixas Quadradas */}
            <div className="flex items-center gap-2 pt-1">
              {/* Instagram */}
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram @tofoli.bianca"
                className="h-9 w-9 rounded-sm border border-white/20 bg-white/5 hover:bg-[#F0B55E] hover:text-[#18202C] hover:border-[#F0B55E] transition-all flex items-center justify-center text-[#E6EAF0]"
              >
                <Instagram className="h-4 w-4" />
              </a>

              {/* Facebook */}
              {SITE_CONFIG.facebookUrl && (
                <a
                  href={SITE_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook Bianca Tofoli"
                  className="h-9 w-9 rounded-sm border border-white/20 bg-white/5 hover:bg-[#F0B55E] hover:text-[#18202C] hover:border-[#F0B55E] transition-all flex items-center justify-center text-[#E6EAF0]"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}

              {/* YouTube */}
              <a
                href={SITE_CONFIG.youtubeUrl || 'https://www.youtube.com/@biancatofoli'}
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube @biancatofoli"
                className="h-9 w-9 rounded-sm border border-white/20 bg-white/5 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all flex items-center justify-center text-[#E6EAF0]"
              >
                <Youtube className="h-4 w-4" />
              </a>

              {/* Spotify */}
              {SITE_CONFIG.spotifyUrl && (
                <a
                  href={SITE_CONFIG.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Spotify Podcast"
                  className="h-9 w-9 rounded-sm border border-white/20 bg-white/5 hover:bg-[#1DB954] hover:text-white hover:border-[#1DB954] transition-all flex items-center justify-center text-[#E6EAF0]"
                >
                  <Music2 className="h-4 w-4" />
                </a>
              )}

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsappNumberRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Oficial +55 11 95440-9774"
                className="h-9 w-9 rounded-sm border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all flex items-center justify-center text-[#25D366]"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* =========================================================================
              COLUNA 2: ATENDIMENTOS & SERVIÇOS
              ========================================================================= */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-white border-b border-white/10 pb-2">
              ATENDIMENTOS & SERVIÇOS
            </h3>
            <ul className="space-y-2 text-xs text-[#A0AEC0]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/atendimentos')}
                  className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer"
                >
                  PRONTO SOCORRO ASTROLÓGICO
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/atendimentos')}
                  className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer"
                >
                  MAPA NATAL
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/atendimentos')}
                  className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer"
                >
                  MAPA REVOLUÇÃO SOLAR
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/atendimentos')}
                  className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer"
                >
                  MAPA NATAL + RODA + REVOLUÇÃO
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/bussula')}
                  className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer text-[#F0B55E] font-bold"
                >
                  BÚSSOLA GUIA (RELATÓRIO MENSAL)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/patota')}
                  className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer"
                >
                  PATOTA ASTRAL (GRUPO VIP)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/lojinha')}
                  className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer"
                >
                  BOX SEMEADURA (LOJINHA)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/palestras')}
                  className="hover:text-[#F0B55E] transition-colors text-left uppercase tracking-wide cursor-pointer font-bold text-[#E6EAF0]"
                >
                  PALESTRAS & WORKSHOPS
                </button>
              </li>
            </ul>
          </div>

          {/* =========================================================================
              COLUNA 3: CONTATO COMERCIAL
              ========================================================================= */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-white border-b border-white/10 pb-2">
              CONTATO COMERCIAL
            </h3>
            
            <div className="space-y-2.5 text-xs text-[#A0AEC0]">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsappNumberRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] transition-colors"
                >
                  WhatsApp: {SITE_CONFIG.whatsappNumberFormatted}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#F0B55E] shrink-0" />
                <a
                  href={`mailto:${SITE_CONFIG.emailContact}`}
                  className="hover:text-[#F0B55E] transition-colors"
                >
                  {SITE_CONFIG.emailContact}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#A0AEC0] shrink-0" />
                <span>Segunda a Sexta: 09h00 às 18h00</span>
              </div>
            </div>

            {/* Botão Comercial Estilo Destaque */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenBooking}
                className="w-full flex items-center justify-center gap-2 rounded-sm bg-[#E65100] hover:bg-[#F57C00] text-white py-3 px-4 text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer transform active:scale-98"
              >
                <MessageCircle className="h-4 w-4 fill-white" />
                <span>SOLICITAR AGENDAMENTO</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* =========================================================================
              COLUNA 4: LOCALIZAÇÃO & ATENDIMENTO
              ========================================================================= */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-white border-b border-white/10 pb-2">
              LOCALIZAÇÃO & ATENDIMENTO
            </h3>

            <div className="space-y-2 text-xs text-[#A0AEC0]">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#E65100] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">São Paulo – SP</p>
                  <p>Atendimento Online Global via Google Meet</p>
                  <p className="text-[11px] text-[#A0AEC0]/70">Presencial sob consulta prévia.</p>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Sao+Paulo+SP"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#F0B55E] hover:underline pt-1"
              >
                <span>Abrir no Google Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <p className="text-[11px] text-[#A0AEC0]/80 pt-1 leading-relaxed">
                Consultas individuais com hora marcada e suporte aos consulentes via WhatsApp oficial.
              </p>
            </div>
          </div>

        </div>

        {/* Linha Divisória Fina */}
        <div className="my-8 h-px bg-white/10"></div>

        {/* =========================================================================
            SUB-FOOTER: GOVERNANÇA, COPYRIGHT, SEGURANÇA E DESENVOLVEDOR
            ========================================================================= */}
        <div className="space-y-3 text-xs text-[#A0AEC0]">
          
          {/* Linha 1: Copyright e Links Institucionais */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-[11px]">
              © {new Date().getFullYear()} {SITE_CONFIG.commercialName}. Todos os direitos reservados.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
              <button
                type="button"
                onClick={handleOpenCookies}
                className="hover:text-[#F0B55E] transition-colors cursor-pointer"
              >
                Preferências de Cookies
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setTechCatalogOpen(true)}
                className="hover:text-[#F0B55E] transition-colors cursor-pointer"
              >
                Catálogo Técnico
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => onNavigate('/admin')}
                className="hover:text-[#F0B55E] transition-colors cursor-pointer text-[#F0B55E] font-bold"
              >
                Acesso Administrativo
              </button>
            </div>
          </div>

          {/* Linha 2: Proteção de Conteúdo (Lei 9.610/1998) & Créditos Oras Bolas */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pt-2 border-t border-white/5 text-[11px] text-center lg:text-left">
            {/* Proteção / Site Seguro */}
            <div className="flex items-center justify-center gap-1.5 text-[#25D366]">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="text-[#A0AEC0]">
                {SITE_CONFIG.legalNotice}
              </span>
            </div>

            {/* Crédito Desenvolvido por @orabolasdigital */}
            <div className="flex items-center justify-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-[#F0B55E] shrink-0" />
              <span>
                Desenvolvido por{' '}
                <a
                  href={SITE_CONFIG.developerCreditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#F0B55E] underline underline-offset-2 font-bold transition-colors"
                >
                  @orabolasdigital
                </a>{' '}
                com estratégia humana e IA. Propriedade intelectual protegida.
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Modal de Catálogo Técnico e Governança */}
      {techCatalogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl rounded-sm bg-[#1E2532] text-[#E6EAF0] shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-[#18202C] p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                <Code2 className="h-4 w-4 text-[#F0B55E]" />
                <span>Catálogo Técnico & Governança da Plataforma</span>
              </div>
              <button
                type="button"
                onClick={() => setTechCatalogOpen(false)}
                className="p-1 rounded-sm text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#A0AEC0] leading-relaxed">
              <div className="p-3 bg-white/5 rounded-sm border border-white/10 space-y-1">
                <h4 className="font-bold text-white uppercase text-[11px]">1. Arquitetura e Engenharia</h4>
                <p>Aplicação SPA desenvolvida em TypeScript com React 19 e Vite 8. Estilização baseada no Tailwind CSS com paleta estrita Casa 6.</p>
              </div>

              <div className="p-3 bg-white/5 rounded-sm border border-white/10 space-y-1">
                <h4 className="font-bold text-white uppercase text-[11px]">2. Pagamentos e Conformidade PCI-DSS</h4>
                <p>Integração oficial Checkout Bricks (Mercado Pago SDK v2) com tokenização client-side no navegador e validação anti-fraude no backend Node.js. Aceite exclusivo de Pix e Cartão de Crédito com parcelamento.</p>
              </div>

              <div className="p-3 bg-white/5 rounded-sm border border-white/10 space-y-1">
                <h4 className="font-bold text-white uppercase text-[11px]">3. Banco de Dados e CRM</h4>
                <p>Persistência em Google Cloud Firestore com coleções normalizadas: crm_contatos, produtos_atendimentos, produtos_palestras, produtos_assinatura, produtos_lojinha e blog_posts.</p>
              </div>

              <div className="p-3 bg-white/5 rounded-sm border border-white/10 space-y-1">
                <h4 className="font-bold text-white uppercase text-[11px]">4. Segurança e Proteção Anticópia</h4>
                <p>Sistema anticópia ativo com bloqueio de atalhos e seleção de texto desautorizada nos termos da Lei Federal nº 9.610/1998.</p>
              </div>
            </div>

            <div className="p-4 bg-[#18202C] border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setTechCatalogOpen(false)}
                className="px-4 py-2 bg-[#F0B55E] text-[#18202C] font-bold text-xs rounded-sm hover:opacity-90"
              >
                Fechar Catálogo
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
