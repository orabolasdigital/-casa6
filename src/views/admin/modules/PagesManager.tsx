/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo: Gestão de Páginas (CMS Completo de 9 Páginas do Site com Restauração Original)
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
  Sparkles
} from 'lucide-react';
import {
  PageCMSContent,
  getPagesCMSList,
  savePageCMSContent,
  restorePageCMSDefault
} from '../../../services/adminConfigService';

export type PageSlug =
  | 'pag_inicio'
  | 'pag_sobre'
  | 'pag_atendimentos'
  | 'pag_palestras'
  | 'pag_parcerias'
  | 'pag_bussola'
  | 'pag_patota'
  | 'pag_leituras'
  | 'pag_lojinha';

interface PagesManagerProps {
  initialSlug?: PageSlug;
}

export const PagesManager: React.FC<PagesManagerProps> = ({ initialSlug = 'pag_inicio' }) => {
  const [pages, setPages] = useState<PageCMSContent[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug.replace('pag_', ''));
  const [currentPage, setCurrentPage] = useState<PageCMSContent | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadPages = async () => {
    const list = await getPagesCMSList();
    setPages(list);
    const found = list.find((p) => p.slug === selectedSlug) || list[0];
    if (found) setCurrentPage(found);
  };

  useEffect(() => {
    loadPages();
  }, [selectedSlug]);

  const handleSelectPage = (slug: string) => {
    setSelectedSlug(slug);
    const found = pages.find((p) => p.slug === slug);
    if (found) setCurrentPage(found);
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPage) return;
    setIsSaving(true);
    try {
      await savePageCMSContent(currentPage);
      setNotification({ type: 'success', text: `Conteúdo da página "${currentPage.name}" salvo com sucesso!` });
      await loadPages();
    } catch {
      setNotification({ type: 'error', text: 'Erro ao salvar página.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreDefault = async () => {
    if (!currentPage) return;
    if (!window.confirm(`Tem certeza que deseja restaurar a página "${currentPage.name}" para o conteúdo original de fábrica?`)) return;
    try {
      const restored = await restorePageCMSDefault(currentPage.slug);
      setCurrentPage(restored);
      setNotification({ type: 'success', text: `Página "${currentPage.name}" restaurada para o padrão original.` });
      await loadPages();
    } catch {
      setNotification({ type: 'error', text: 'Erro ao restaurar página.' });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#372B69] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#F0B55E] text-xs font-bold uppercase tracking-widest">
            <Layers className="h-4 w-4" />
            <span>Páginas &bull; CMS do Site</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Editor de Conteúdo das Páginas
          </h2>
          <p className="text-xs sm:text-sm text-[#DAD2C4]">
            Edite títulos, subtítulos hero, links de imagens e seções das 9 páginas oficiais da Casa 6 com restauração instantânea.
          </p>
        </div>

        {currentPage && (
          <button
            onClick={handleRestoreDefault}
            className="py-2.5 px-4 rounded-xl bg-[#2B2566] hover:bg-[#372B69] border border-[#F0B55E]/40 text-[#F0B55E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restaurar Original de {currentPage.name}</span>
          </button>
        )}
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

      {/* Seletor em Grade das 9 Páginas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
        {pages.map((p) => {
          const isSelected = selectedSlug === p.slug;
          return (
            <button
              key={p.slug}
              onClick={() => handleSelectPage(p.slug)}
              className={`p-3 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                isSelected
                  ? 'bg-[#F0B55E] text-[#1E1B4B] border-[#F0B55E] font-bold shadow-lg scale-102'
                  : 'bg-[#1D1B48] text-[#DAD2C4] border-[#372B69] hover:bg-[#2B2566] hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span className="text-[11px] font-bold truncate w-full">{p.name}</span>
              <span className="text-[9px] opacity-75 font-mono">/{p.slug}</span>
            </button>
          );
        })}
      </div>

      {/* Editor da Página Selecionada */}
      {currentPage && (
        <form onSubmit={handleSavePage} className="bg-[#1D1B48] border border-[#372B69] rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#372B69] pb-4">
            <div>
              <span className="text-[10px] text-[#F0B55E] font-bold uppercase tracking-wider">
                Editando Página Oficial
              </span>
              <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                <span>{currentPage.name}</span>
                <a
                  href={`/${currentPage.slug === 'inicio' ? '' : currentPage.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#DAD2C4] hover:text-[#F0B55E] flex items-center gap-1 font-mono font-normal"
                >
                  <ExternalLink className="h-3 w-3" /> Ver online
                </a>
              </h3>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-6 rounded-xl bg-[#F0B55E] hover:bg-[#E5A344] text-[#1E1B4B] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#DAD2C4]">Tag / Chapeuzinho do Hero</label>
                <input
                  type="text"
                  value={currentPage.heroTag}
                  onChange={(e) => setCurrentPage({ ...currentPage, heroTag: e.target.value })}
                  className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#DAD2C4]">Título Principal (H1)</label>
                <input
                  type="text"
                  value={currentPage.heroTitle}
                  onChange={(e) => setCurrentPage({ ...currentPage, heroTitle: e.target.value })}
                  className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#DAD2C4]">Subtítulo Explicativo</label>
                <textarea
                  rows={3}
                  value={currentPage.heroSubtitle}
                  onChange={(e) => setCurrentPage({ ...currentPage, heroSubtitle: e.target.value })}
                  className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl p-3 text-white text-xs leading-relaxed"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#DAD2C4] flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-[#F0B55E]" />
                  Link da Imagem de Destaque / Banner
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={currentPage.heroImage || ''}
                  onChange={(e) => setCurrentPage({ ...currentPage, heroImage: e.target.value })}
                  className="w-full bg-[#2B2566] border border-[#372B69] rounded-xl px-3 py-2 text-white text-xs font-mono"
                />
                {currentPage.heroImage && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-[#372B69] max-h-36">
                    <img src={currentPage.heroImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#DAD2C4]">Cor de Fundo da Seção</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentPage.palettePrimaryColor}
                      onChange={(e) => setCurrentPage({ ...currentPage, palettePrimaryColor: e.target.value })}
                      className="h-8 w-10 rounded border-0 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-white">{currentPage.palettePrimaryColor}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#DAD2C4]">Cor de Destaque / Ouro</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentPage.paletteAccentColor}
                      onChange={(e) => setCurrentPage({ ...currentPage, paletteAccentColor: e.target.value })}
                      className="h-8 w-10 rounded border-0 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-white">{currentPage.paletteAccentColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
