/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo: Gestão de Páginas (CMS das 9 Páginas do Site com Edição Completa de Textos, Links e Cores)
 * Tema Claro (Light Theme)
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Image as ImageIcon,
  Palette,
  Eye,
  Layers,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';

export interface FullPageCMS {
  slug: string;
  name: string;
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  section1Title: string;
  section1Text: string;
  section2Title: string;
  section2Text: string;
  bannerFinalTitle: string;
  bannerFinalSubtitle: string;
  bannerButtonText: string;
  primaryColor: string;
  accentColor: string;
}

export const DEFAULT_FULL_PAGES: Record<string, FullPageCMS> = {
  inicio: {
    slug: 'inicio',
    name: 'Início',
    heroTag: 'ASTROLOGIA • AUTOCONHECIMENTO • VIDA REAL',
    heroTitle: 'Autoconhecimento, equilíbrio e transformação para sua vida.',
    heroSubtitle: 'Descubra a Casa 6 e se conecte com a sua essência através da astrologia com um olhar lúcido e acolhedor.',
    heroImage: 'https://static.wixstatic.com/media/02c8e0_eebda8070c014b7e9e29291edb53c2c7~mv2.jpg',
    ctaButtonText: 'CONHEÇA NOSSOS ATENDIMENTOS',
    ctaButtonLink: '/atendimentos',
    section1Title: 'Astrologia com os pés no chão',
    section1Text: 'A Casa 6 traduz o mapa astral para o seu cotidiano real, sem misticismos complicados.',
    section2Title: 'Comunidade Patota Astral',
    section2Text: 'Acompanhe as lunações diárias por R$ 47,00/mês diretamente no seu WhatsApp.',
    bannerFinalTitle: 'Pronta para iniciar sua jornada cósmica?',
    bannerFinalSubtitle: 'Agende uma consulta ou escolha sua Bússola Astral personalizada.',
    bannerButtonText: 'Falar no WhatsApp',
    primaryColor: '#22205A',
    accentColor: '#F0B55E'
  },
  sobre: {
    slug: 'sobre',
    name: 'Sobre',
    heroTag: 'SOBRE A CASA 6',
    heroTitle: 'Astrologia com os pés no chão e o olhar na alma.',
    heroSubtitle: 'A Casa 6 nasce do encontro da astrologia séria com a saúde, a rotina e o acolhimento.',
    heroImage: 'https://static.wixstatic.com/media/02c8e0_eebda8070c014b7e9e29291edb53c2c7~mv2.jpg',
    ctaButtonText: 'CONHEÇA A TRAJETÓRIA',
    ctaButtonLink: '#historia',
    section1Title: 'Quem é Bianca Tofoli',
    section1Text: 'Enfermeira de formação, gestora corporativa e astróloga com mais de 10 anos de experiência.',
    section2Title: 'Por que Casa 6?',
    section2Text: 'No mapa astral, a Casa 6 rege a saúde diária, o trabalho, os hábitos e a cura na prática.',
    bannerFinalTitle: 'Vamos conversar?',
    bannerFinalSubtitle: 'Tire suas dúvidas diretamente pelo WhatsApp.',
    bannerButtonText: 'Enviar Mensagem',
    primaryColor: '#22205A',
    accentColor: '#F0B55E'
  },
  atendimentos: {
    slug: 'atendimentos',
    name: 'Atendimentos',
    heroTag: 'CONSULTAS & MAPAS INDIVIDUAIS',
    heroTitle: 'Escolha a consulta certa para o seu momento',
    heroSubtitle: 'Atendimentos online individuais com gravação, material em PDF e acolhimento profundo.',
    heroImage: 'https://static.wixstatic.com/media/02c8e0_4d4ebb187e354ca78c685b29702bf786~mv2.png',
    ctaButtonText: 'VER MAPAS DISPONÍVEIS',
    ctaButtonLink: '#catalogo',
    section1Title: 'Pronto Socorro Astrológico vs. Mapa Natal',
    section1Text: 'O Pronto Socorro atende crises pontuais em 60 min. O Mapa Natal é o dossiê da sua vida inteira.',
    section2Title: 'Revolução Solar Anual',
    section2Text: 'O mapa do seu ano contado a partir da data do seu aniversário.',
    bannerFinalTitle: 'Dúvidas sobre qual mapa escolher?',
    bannerFinalSubtitle: 'Nossa equipe orienta você na escolha do melhor formato para sua fase atual.',
    bannerButtonText: 'Pedir Orientação',
    primaryColor: '#22205A',
    accentColor: '#F0B55E'
  },
  palestras: {
    slug: 'palestras',
    name: 'Palestras',
    heroTag: 'PALESTRAS & WORKSHOPS CORPORATIVOS',
    heroTitle: 'Saúde Mental, Prevenção NR-1 e Bem-Estar no Trabalho',
    heroSubtitle: 'Encontros vivenciais, inteligência emocional e conformidade com a Norma Regulamentadora NR-1.',
    heroImage: 'https://static.wixstatic.com/media/02c8e0_427896bbb9fc41d19b341c27b8911c11~mv2.png',
    ctaButtonText: 'SOLICITAR PROPOSTA PARA EMPRESA',
    ctaButtonLink: '#formulario-evento',
    section1Title: 'Conformidade com a Norma NR-1',
    section1Text: 'Programas de prevenção ativa de estresse ocupacional e promoção de saúde mental nas empresas.',
    section2Title: 'Impacto Mensurável nas Organizações',
    section2Text: 'Mais de 1.200 colaboradores impactados nas principais redes de saúde do país.',
    bannerFinalTitle: 'Vamos montar um evento para sua empresa?',
    bannerFinalSubtitle: 'Formatos customizados de 1h30 a workshops imersivos de 6 horas.',
    bannerButtonText: 'Solicitar Proposta',
    primaryColor: '#22205A',
    accentColor: '#F0B55E'
  },
  parcerias: {
    slug: 'parcerias',
    name: 'Parcerias',
    heroTag: 'CONEXÕES COM PROPÓSITO',
    heroTitle: 'Parcerias & Permutas Estratégicas',
    heroSubtitle: 'Conecte sua marca a um público consciente: permutas, co-branding e divulgação autoral.',
    heroImage: 'https://static.wixstatic.com/media/02c8e0_8af738fb419e424887681c32ca6a68a4~mv2.png',
    ctaButtonText: 'PROPOR UMA PARCERIA',
    ctaButtonLink: '#formulario-parceria',
    section1Title: 'Modalidades de Parceria',
    section1Text: 'Permutas qualificadas, co-criação de produtos da Lojinha, patrocínios editoriais e eventos conjuntos.',
    section2Title: 'Público Qualificado',
    section2Text: 'Comunidade engajada em saúde, bem-estar, autocuidado, psicologia e desenvolvimento humano.',
    bannerFinalTitle: 'Vamos criar algo juntos?',
    bannerFinalSubtitle: 'Envie sua ideia de parceria e vamos conversar sobre viabilidade.',
    bannerButtonText: 'Enviar Proposta',
    primaryColor: '#22205A',
    accentColor: '#F0B55E'
  },
  bussola: {
    slug: 'bussola',
    name: 'Bússola',
    heroTag: 'FAMÍLIA DE BÚSSOLAS ASTROLÓGICAS',
    heroTitle: 'O céu aponta caminhos. O autoconhecimento ajuda você a escolher a direção.',
    heroSubtitle: 'Bússolas personalizadas em PDF entregues no WhatsApp por R$ 47,00 cada.',
    heroImage: 'https://static.wixstatic.com/media/02c8e0_688edec712d4401984a6e1cf8afeb93e~mv2.png',
    ctaButtonText: 'ESCOLHER MINHA BÚSSOLA',
    ctaButtonLink: '#catalogo-bussolas',
    section1Title: 'Valor Unificado de Todas as Bússolas',
    section1Text: 'Todas as bússolas por R$ 47,00 cada: Profissional, Afetiva, Saúde e Pessoal.',
    section2Title: 'Entrega Imediata e Prática',
    section2Text: 'Receba seu relatório em PDF com design exclusivo diretamente no seu WhatsApp.',
    bannerFinalTitle: 'Precisa de clareza imediata?',
    bannerFinalSubtitle: 'Peça sua Bússola e comece seu alinhamento hoje mesmo.',
    bannerButtonText: 'Comprar por R$ 47,00',
    primaryColor: '#22205A',
    accentColor: '#F0B55E'
  },
  patota: {
    slug: 'patota',
    name: 'Patota',
    heroTag: 'ASTROLOGIA DIÁRIA POR ASSINATURA',
    heroTitle: 'Apenas R$ 1,50 por dia!',
    heroSubtitle: 'Grupo VIP com áudios matinais no WhatsApp, encontros ao vivo mensais e rituais de lunação.',
    heroImage: 'https://static.wixstatic.com/media/02c8e0_e5132493b4a14c0498c5df95ee68c593~mv2.png',
    ctaButtonText: 'ASSINAR A PATOTA ASTRAL',
    ctaButtonLink: '#planos',
    section1Title: '4 Modalidades de Assinatura',
    section1Text: 'Mensal (R$ 47/mês), Trimestral, Semestral e Anual com desconto de 2 meses grátis.',
    section2Title: 'Áudios de Segunda a Sexta',
    section2Text: 'Comece seu dia alinhada aos trânsitos da Lua e planetas de forma leve e prática.',
    bannerFinalTitle: 'Faça parte da nossa comunidade',
    bannerFinalSubtitle: 'Vagas com acolhimento contínuo e encontros ao vivo todo mês.',
    bannerButtonText: 'Assinar por R$ 47/mês',
    primaryColor: '#22205A',
    accentColor: '#F0B55E'
  },
  leituras: {
    slug: 'leituras',
    name: 'Leituras',
    heroTag: 'CADERNO ASTRAL • EDITORIAL',
    heroTitle: 'Leituras Astrais',
    heroSubtitle: 'Reflexões, trânsitos astrológicos e ensaios lúcidos de Bianca Tofoli.',
    heroImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
    ctaButtonText: 'EXPLORAR ARTIGOS',
    ctaButtonLink: '#artigos',
    section1Title: 'Eclipses e Lunações',
    section1Text: 'Análises aprofundadas dos grandes trânsitos cósmicos e seus impactos no cotidiano.',
    section2Title: 'Mercúrio Retrógrado sem Medo',
    section2Text: 'Aprenda a usar os períodos de revisão a seu favor.',
    bannerFinalTitle: 'Gostou dos textos?',
    bannerFinalSubtitle: 'Inscreva-se na Patota para receber reflexões diárias.',
    bannerButtonText: 'Conhecer a Patota',
    primaryColor: '#22205A',
    accentColor: '#F0B55E'
  },
  lojinha: {
    slug: 'lojinha',
    name: 'Lojinha',
    heroTag: 'LOJINHA OFICIAL CASA 6 • RITUAIS & OBJETOS',
    heroTitle: 'Edições Limitadas',
    heroSubtitle: 'Curadorias rituais, Box Semeadura e amuletos desenhados para materializar os ciclos.',
    heroImage: 'https://static.wixstatic.com/media/02c8e0_ba9bbb820abf45ceaf08609f65cdd001~mv2.jpeg',
    ctaButtonText: 'CONHECER A BOX SEMEADURA',
    ctaButtonLink: '#box-semeadura',
    section1Title: 'Coleção Ritos do Universo',
    section1Text: 'Velas aromáticas, cristais energizados e incensos puros para os seus rituais.',
    section2Title: 'Política de Entrega e Frete Seguro',
    section2Text: 'Envio cuidadoso para todo o Brasil com rastreamento e frete grátis acima de R$ 250.',
    bannerFinalTitle: 'Materialize suas intenções',
    bannerFinalSubtitle: 'Objetos rituais criados com afeto e propósito astrológico.',
    bannerButtonText: 'Ver Produtos',
    primaryColor: '#22205A',
    accentColor: '#F0B55E'
  }
};

const LOCAL_STORAGE_CMS_PAGES = 'casa6_full_cms_pages';

export const PagesManager: React.FC<{ initialSlug?: string }> = ({ initialSlug = 'inicio' }) => {
  const [pagesData, setPagesData] = useState<Record<string, FullPageCMS>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_CMS_PAGES);
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return DEFAULT_FULL_PAGES;
  });

  const [activeSlug, setActiveSlug] = useState<string>(initialSlug.replace('pag_', ''));
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (initialSlug) {
      setActiveSlug(initialSlug.replace('pag_', ''));
    }
  }, [initialSlug]);

  const currentPage = pagesData[activeSlug] || pagesData['inicio'];

  const handleUpdateCurrentPage = (field: keyof FullPageCMS, value: string) => {
    setPagesData((prev) => ({
      ...prev,
      [activeSlug]: {
        ...prev[activeSlug],
        [field]: value
      }
    }));
  };

  const handleSaveCurrentPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_CMS_PAGES, JSON.stringify(pagesData));
    }
    setNotification({ type: 'success', text: `Textos e configurações da página "${currentPage.name}" salvos com sucesso!` });
  };

  const handleRestoreCurrentPageDefault = () => {
    if (!window.confirm(`Tem certeza que deseja restaurar a página "${currentPage.name}" para o conteúdo original de fábrica?`)) return;
    const restored = DEFAULT_FULL_PAGES[activeSlug];
    setPagesData((prev) => {
      const next = { ...prev, [activeSlug]: restored };
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_CMS_PAGES, JSON.stringify(next));
      }
      return next;
    });
    setNotification({ type: 'success', text: `Página "${currentPage.name}" restaurada para o padrão original.` });
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#22205A]">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E0D8] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#D99426] text-xs font-bold uppercase tracking-widest">
            <Layers className="h-4 w-4" />
            <span>Páginas &bull; CMS Editorial Completo</span>
          </div>
          <h2 className="text-2xl font-heading font-black text-[#22205A] mt-1">
            Editor da Página: {currentPage.name} (/{currentPage.slug === 'inicio' ? '' : currentPage.slug})
          </h2>
          <p className="text-xs sm:text-sm text-[#68638C]">
            Edite todos os textos, links, imagens e cores de cada uma das 9 páginas oficiais do site.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href={`/${currentPage.slug === 'inicio' ? '' : currentPage.slug}`}
            target="_blank"
            rel="noreferrer"
            className="py-2 px-3.5 rounded-xl border border-[#DCD6CC] bg-white hover:bg-[#FAF8F5] text-[#22205A] font-bold text-xs uppercase flex items-center gap-1.5 shadow-2xs"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Ver Online</span>
          </a>

          <button
            type="button"
            onClick={handleRestoreCurrentPageDefault}
            className="py-2 px-3.5 rounded-xl border border-[#DCD6CC] bg-white hover:bg-[#FAF8F5] text-[#22205A] font-bold text-xs uppercase flex items-center gap-1.5 shadow-2xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#D99426]" />
            <span>Restaurar Original</span>
          </button>
        </div>
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

      {/* Formulário Completo de Edição dos Textos da Página */}
      <form onSubmit={handleSaveCurrentPage} className="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs space-y-6">
        
        {/* Bloco 1: Hero Principal */}
        <div className="space-y-4">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#22205A] border-b border-[#F0EBE1] pb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#D99426]" />
            1. Cabeçalho / Hero Principal
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#22205A]">Tag Superior (Chapeuzinho)</label>
              <input
                type="text"
                value={currentPage.heroTag}
                onChange={(e) => handleUpdateCurrentPage('heroTag', e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#22205A]">URL da Imagem / Foto do Hero</label>
              <input
                type="url"
                value={currentPage.heroImage}
                onChange={(e) => handleUpdateCurrentPage('heroImage', e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#22205A]">Título Principal da Página (H1)</label>
            <input
              type="text"
              value={currentPage.heroTitle}
              onChange={(e) => handleUpdateCurrentPage('heroTitle', e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#22205A]">Subtítulo Explicativo</label>
            <textarea
              rows={3}
              value={currentPage.heroSubtitle}
              onChange={(e) => handleUpdateCurrentPage('heroSubtitle', e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl p-3 text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#22205A]">Texto do Botão de Ação (CTA)</label>
              <input
                type="text"
                value={currentPage.ctaButtonText}
                onChange={(e) => handleUpdateCurrentPage('ctaButtonText', e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#22205A]">Link de Destino do Botão</label>
              <input
                type="text"
                value={currentPage.ctaButtonLink}
                onChange={(e) => handleUpdateCurrentPage('ctaButtonLink', e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Seções de Conteúdo Narrativo */}
        <div className="space-y-4 pt-2 border-t border-[#F0EBE1]">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#22205A] border-b border-[#F0EBE1] pb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#D99426]" />
            2. Seções Intermediárias de Conteúdo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE5DC]">
              <label className="text-xs font-bold text-[#22205A]">Título da Seção 1</label>
              <input
                type="text"
                value={currentPage.section1Title}
                onChange={(e) => handleUpdateCurrentPage('section1Title', e.target.value)}
                className="w-full bg-white border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-xs font-bold"
              />
              <label className="text-xs font-bold text-[#22205A]">Texto da Seção 1</label>
              <textarea
                rows={3}
                value={currentPage.section1Text}
                onChange={(e) => handleUpdateCurrentPage('section1Text', e.target.value)}
                className="w-full bg-white border border-[#DCD6CC] rounded-lg p-2 text-xs"
              />
            </div>

            <div className="space-y-2 p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE5DC]">
              <label className="text-xs font-bold text-[#22205A]">Título da Seção 2</label>
              <input
                type="text"
                value={currentPage.section2Title}
                onChange={(e) => handleUpdateCurrentPage('section2Title', e.target.value)}
                className="w-full bg-white border border-[#DCD6CC] rounded-lg px-2.5 py-1.5 text-xs font-bold"
              />
              <label className="text-xs font-bold text-[#22205A]">Texto da Seção 2</label>
              <textarea
                rows={3}
                value={currentPage.section2Text}
                onChange={(e) => handleUpdateCurrentPage('section2Text', e.target.value)}
                className="w-full bg-white border border-[#DCD6CC] rounded-lg p-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Bloco 3: Banner Final / Chamada */}
        <div className="space-y-4 pt-2 border-t border-[#F0EBE1]">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#22205A] border-b border-[#F0EBE1] pb-2 flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-[#D99426]" />
            3. Banner de Chamada Final (Rodapé da Página)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#22205A]">Título do Banner Final</label>
              <input
                type="text"
                value={currentPage.bannerFinalTitle}
                onChange={(e) => handleUpdateCurrentPage('bannerFinalTitle', e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#22205A]">Texto do Botão Final</label>
              <input
                type="text"
                value={currentPage.bannerButtonText}
                onChange={(e) => handleUpdateCurrentPage('bannerButtonText', e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#22205A]">Subtítulo do Banner Final</label>
            <input
              type="text"
              value={currentPage.bannerFinalSubtitle}
              onChange={(e) => handleUpdateCurrentPage('bannerFinalSubtitle', e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CC] rounded-xl px-3 py-2 text-xs"
            />
          </div>
        </div>

        {/* Bloco 4: Cores da Página */}
        <div className="space-y-3 pt-2 border-t border-[#F0EBE1]">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#22205A] flex items-center gap-2">
            <Palette className="h-4 w-4 text-[#D99426]" />
            4. Paleta Visual desta Página
          </h3>

          <div className="grid grid-cols-2 gap-4 max-w-sm">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#22205A]">Cor Principal</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentPage.primaryColor}
                  onChange={(e) => handleUpdateCurrentPage('primaryColor', e.target.value)}
                  className="h-8 w-10 rounded border-0 bg-transparent cursor-pointer"
                />
                <span className="text-xs font-mono text-[#554F70]">{currentPage.primaryColor}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#22205A]">Cor Dourada / Acento</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentPage.accentColor}
                  onChange={(e) => handleUpdateCurrentPage('accentColor', e.target.value)}
                  className="h-8 w-10 rounded border-0 bg-transparent cursor-pointer"
                />
                <span className="text-xs font-mono text-[#554F70]">{currentPage.accentColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botão Salvar Todas as Alterações */}
        <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-end">
          <button
            type="submit"
            className="py-3 px-8 rounded-xl bg-[#22205A] hover:bg-[#1B1948] text-[#F0B55E] font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Salvar Alterações de {currentPage.name}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
