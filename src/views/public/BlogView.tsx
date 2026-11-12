/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /leituras (Blog Oficial & Leituras Astrais)
 * 
 * Funcionalidades & Design:
 * - Mesma layoutação, leveza e sofisticação das páginas Sobre, Atendimentos e Encontros (#FAF8F5).
 * - Sem logotipo no cabeçalho.
 * - Título oficial: "Leituras Astrais" com linha-ponto dourada do Brand Guide.
 * - Boxes de artigos horizontais com cantos bem arredondados (rounded-3xl), sombras suaves e microinterações elegantes.
 * - Botão "Ler o texto completo" em formato refinado, sem quebras indesejadas e com borda/acabamento suave.
 * - Ao clicar em "Ler o texto completo", redireciona para a rota com slug dedicado: /leituras/:slug.
 * - Exibição da página de artigo individual completa com breadcrumb de retorno, imagem de capa panorâmica, metadados, formatação editorial rica, chamada para atendimento e artigos relacionados.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Sparkles,
  Share2,
  Check,
  BookOpen
} from 'lucide-react';
import { CATALOG_BLOG_POSTS, BlogPostItem } from '../../services/catalogService';

interface BlogViewProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
  onOpenBooking?: (serviceId?: string) => void;
}

/**
 * Componente utilitário para animação suave de subida ao rolar a página (como nuvens)
 */
const RevealOnScroll: React.FC<{
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}> = ({ children, delayMs = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-10 scale-[0.99]'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const BlogView: React.FC<BlogViewProps> = ({
  onNavigate,
  currentPath,
  onOpenBooking
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  // Extrai o slug da rota atual (/leituras/:slug ou /blog/:slug)
  const getSlugFromPath = (path?: string): string | null => {
    const effectivePath = path || (typeof window !== 'undefined' ? window.location.pathname : '');
    const match = effectivePath.match(/^\/(?:leituras|blog)\/([^/?#]+)/i);
    return match ? decodeURIComponent(match[1]) : null;
  };

  const activeSlug = getSlugFromPath(currentPath);
  const activePost = activeSlug
    ? CATALOG_BLOG_POSTS.find(
        (post) => post.slug === activeSlug || post.id === activeSlug
      )
    : null;

  // Navegação segura
  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const handleShareArticle = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Scroll para o topo quando o artigo mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSlug]);

  return (
    <div className="bg-[#FAF8F5] text-[#2B2566] min-h-screen py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden relative">
      
      {/* Elementos Cósmicos Decorativos Efémeros ao Fundo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-20 right-[-80px] w-96 h-96 rounded-full border border-[#F0B55E]/15 opacity-40 animate-celestial-orbit-slow" />
        <div className="absolute top-1/2 left-[-100px] w-[500px] h-[500px] rounded-full border border-[#8C987F]/10 opacity-50 animate-celestial-orbit-reverse" />
        <div className="absolute top-36 left-12 text-[#F0B55E]/40 text-xs animate-pulse">✦</div>
        <div className="absolute bottom-48 right-1/4 text-[#8C987F]/30 text-[10px]">★</div>
      </div>

      {/* =========================================================================
          CENÁRIO A: ARTIGO INDIVIDUAL COMPLETO (/leituras/:slug)
          ========================================================================= */}
      {activePost ? (
        <article className="mx-auto max-w-4xl space-y-8 sm:space-y-10 relative z-10">
          
          {/* Breadcrumb / Botão Voltar */}
          <RevealOnScroll delayMs={50}>
            <div className="flex items-center justify-between gap-4 border-b border-[#EADBCC]/60 pb-4">
              <button
                type="button"
                onClick={() => handleNavigate('/leituras')}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#2B2566] hover:text-[#F0B55E] transition-colors cursor-pointer group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Voltar para Leituras Astrais</span>
              </button>

              <button
                type="button"
                onClick={handleShareArticle}
                className="inline-flex items-center gap-1.5 text-xs text-[#8C987F] hover:text-[#2B2566] transition-colors cursor-pointer"
                title="Copiar link do artigo"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#25D366]" />
                    <span className="text-[#25D366] font-medium">Link copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Compartilhar</span>
                  </>
                )}
              </button>
            </div>
          </RevealOnScroll>

          {/* Cabeçalho do Artigo */}
          <RevealOnScroll delayMs={100}>
            <div className="space-y-4 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#F0B55E] bg-[#F0B55E]/10 px-3 py-1 rounded-full border border-[#F0B55E]/20">
                <Sparkles className="h-3 w-3" />
                <span>{activePost.category}</span>
              </span>

              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#2B2566] leading-tight tracking-tight">
                {activePost.title}
              </h1>

              {/* Metadados Editoriais */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs text-[#8C987F] pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#F0B55E]" />
                  <span>{activePost.publishedAt}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[#F0B55E]" />
                  <span>{activePost.readTime}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#25D366]" />
                  <span>{activePost.geoCoverage}</span>
                </span>
                <span>•</span>
                <span className="font-medium text-[#2B2566]">
                  Por {activePost.authorName}
                </span>
              </div>
            </div>
          </RevealOnScroll>

          {/* Imagem de Capa do Artigo com Moldura Elegante */}
          <RevealOnScroll delayMs={150}>
            <div className="w-full aspect-16/9 sm:aspect-21/9 max-h-[480px] rounded-[28px] sm:rounded-3xl overflow-hidden border border-[#EADBCC]/60 shadow-[0_16px_40px_rgba(43,37,102,0.06)] bg-black/5">
              <img
                src={activePost.imageUrl}
                alt={activePost.title}
                className="w-full h-full object-cover"
              />
            </div>
          </RevealOnScroll>

          {/* Conteúdo do Artigo */}
          <RevealOnScroll delayMs={200}>
            <div className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl border border-[#EADBCC]/60 p-6 sm:p-10 lg:p-12 shadow-[0_16px_40px_rgba(43,37,102,0.04)] space-y-6 text-[#423C7B] leading-relaxed text-sm sm:text-base">
              {activePost.fullContent.split('\n\n').map((paragraph, pIdx) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                // Citação destacada
                if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
                  return (
                    <blockquote
                      key={pIdx}
                      className="border-l-2 border-[#F0B55E] pl-4 sm:pl-6 py-2 my-6 italic text-[#2B2566] font-heading text-base sm:text-lg bg-[#FAF8F5]/80 rounded-r-2xl"
                    >
                      {trimmed}
                    </blockquote>
                  );
                }

                // Subtítulos ou tópicos numerados
                if (/^[0-9]\./.test(trimmed) || trimmed.startsWith('•')) {
                  return (
                    <div key={pIdx} className="space-y-1.5 pl-2 sm:pl-4">
                      {trimmed.split('\n').map((line, lIdx) => (
                        <p key={lIdx} className="text-[#534D6B] text-xs sm:text-sm">
                          {line}
                        </p>
                      ))}
                    </div>
                  );
                }

                return (
                  <p key={pIdx} className="text-[#423C7B] text-xs sm:text-sm leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}

              {/* Tags de Palavras-Chave */}
              {activePost.seoKeywords && activePost.seoKeywords.length > 0 && (
                <div className="pt-6 border-t border-[#EADBCC]/50 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C987F] block">
                    PALAVRAS-CHAVE:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activePost.seoKeywords.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 text-[11px] bg-[#FAF8F5] border border-[#EADBCC] px-2.5 py-1 rounded-full text-[#534D6B]"
                      >
                        <Tag className="h-3 w-3 text-[#F0B55E]" />
                        <span>#{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </RevealOnScroll>

          {/* Bloco de Convite / CTA ao Final do Artigo */}
          <RevealOnScroll delayMs={250}>
            <div className="bg-gradient-to-br from-[#2B2566] to-[#1C1844] text-white rounded-[28px] sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(43,37,102,0.1)] border border-[#F0B55E]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F0B55E] block">
                  APROFUNDE SEU AUTOCONHECIMENTO
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white leading-snug">
                  Deseja entender como esses trânsitos afetam seu mapa individual?
                </h3>
                <p className="text-xs sm:text-sm text-[#DAD2C4] max-w-xl">
                  Agende sua consulta personalizada de Mapa Natal ou tire dúvidas diretamente com Bianca Tofoli no WhatsApp.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleNavigate('/atendimentos')}
                  className="px-6 py-3 rounded-full border border-[#F0B55E] text-[#F0B55E] hover:bg-[#F0B55E]/10 font-medium text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap text-center"
                >
                  Ver Atendimentos
                </button>
                <button
                  type="button"
                  onClick={() => onOpenBooking ? onOpenBooking('leitura-astral') : handleNavigate('/atendimentos')}
                  className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <MessageCircle className="h-4 w-4 fill-white" />
                  <span>Falar no WhatsApp</span>
                </button>
              </div>
            </div>
          </RevealOnScroll>

          {/* Outros Artigos Recomendados */}
          <RevealOnScroll delayMs={300}>
            <div className="space-y-5 pt-4">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#2B2566]">
                Outras Leituras Astrais
              </h3>

              <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 -mx-4 px-4 scrollbar-none sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible sm:grid sm:grid-cols-2 sm:gap-4">
                {CATALOG_BLOG_POSTS.filter((p) => p.id !== activePost.id)
                  .slice(0, 2)
                  .map((otherPost) => (
                    <div
                      key={otherPost.id}
                      onClick={() => handleNavigate('/leituras/' + otherPost.slug)}
                      className="w-[78vw] sm:w-auto shrink-0 snap-center sm:shrink bg-white/90 backdrop-blur-xs rounded-2xl border border-[#EADBCC]/60 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-[#F0B55E] uppercase tracking-wider block">
                          {otherPost.category} • {otherPost.publishedAt}
                        </span>
                        <h4 className="font-heading text-base font-bold text-[#2B2566] group-hover:text-[#F0B55E] transition-colors leading-snug">
                          {otherPost.title}
                        </h4>
                        <p className="text-xs text-[#534D6B] line-clamp-2 leading-relaxed">
                          {otherPost.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-medium text-[#2B2566] group-hover:text-[#F0B55E] transition-colors">
                        <span>Ler artigo</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </RevealOnScroll>

        </article>
      ) : (
        /* =========================================================================
            CENÁRIO B: LISTA GERAL DE LEITURAS ASTRAIS (/leituras)
            ========================================================================= */
        <div className="mx-auto max-w-5xl space-y-10 sm:space-y-14 relative z-10">
          
          {/* Header Editorial (Sem Logotipo, com Linha-Ponto e Novo Título "Leituras Astrais") */}
          <RevealOnScroll delayMs={50}>
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F] block">
                CADERNO ASTRAL & ARTIGOS AUTORAIS
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B2566] tracking-tight">
                Leituras Astrais
              </h1>
              
              {/* Linha-Ponto do Brand Guide */}
              <div className="flex items-center justify-center gap-3 py-1">
                <span className="w-12 h-px bg-[#2B2566]/20" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]" />
                <span className="w-20 h-px bg-[#2B2566]/20" />
              </div>

              <p className="text-xs sm:text-sm md:text-[15px] text-[#423C7B] leading-relaxed font-normal">
                Artigos autorais, estudos astrológicos, lunações e reflexões práticas de Bianca Tofoli para integrar a astrologia ao seu autoconhecimento e rotina.
              </p>
            </div>
          </RevealOnScroll>

          {/* Lista Oficial dos Artigos em Boxes Horizontais: Carrossel no Mobile e Empilhados no Desktop */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 scrollbar-none sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible sm:block sm:space-y-8">
            {CATALOG_BLOG_POSTS.map((post, idx) => (
              <RevealOnScroll
                key={post.id}
                delayMs={100 + idx * 50}
                className="w-[86vw] sm:w-full shrink-0 snap-center sm:shrink flex flex-col"
              >
                <article className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl lg:rounded-[32px] border border-[#EADBCC]/60 shadow-[0_16px_40px_rgba(43,37,102,0.04)] hover:shadow-[0_20px_50px_rgba(43,37,102,0.07)] transition-all duration-500 overflow-hidden p-6 sm:p-8 h-full flex flex-col justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
                    
                    {/* Imagem do Artigo */}
                    <div className="md:col-span-4 h-52 sm:h-56 rounded-2xl overflow-hidden bg-black/5 border border-[#EADBCC]/60 relative group">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 bg-[#2B2566]/90 backdrop-blur-xs text-[#F0B55E] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#F0B55E]/30 shadow-xs">
                        {post.category}
                      </span>
                    </div>

                    {/* Conteúdo Editorial */}
                    <div className="md:col-span-8 space-y-3.5 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        
                        {/* Metadados */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#8C987F]">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-[#F0B55E]" />
                            <span>{post.publishedAt}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-[#F0B55E]" />
                            <span>{post.readTime}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-[#25D366]" />
                            <span>{post.geoCoverage}</span>
                          </span>
                        </div>

                        {/* Título */}
                        <h2
                          onClick={() => handleNavigate('/leituras/' + post.slug)}
                          className="font-heading text-xl sm:text-2xl font-bold text-[#2B2566] hover:text-[#F0B55E] transition-colors leading-snug cursor-pointer tracking-tight"
                        >
                          {post.title}
                        </h2>

                        {/* Resumo */}
                        <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed line-clamp-3 font-normal">
                          {post.excerpt}
                        </p>

                        {/* Tags de SEO / Temas */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {post.seoKeywords.slice(0, 4).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="inline-flex items-center gap-1 text-[10px] bg-[#FAF8F5] border border-[#EADBCC] px-2 py-0.5 rounded-full text-[#534D6B]"
                            >
                              <Tag className="h-2.5 w-2.5 text-[#F0B55E]" />
                              <span>#{tag}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Botão "Ler o texto completo" elegante com borda fina */}
                      <div className="pt-3 border-t border-[#EADBCC]/50 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleNavigate('/leituras/' + post.slug)}
                          className="px-5 py-2 rounded-full border border-[#F0B55E] text-[#2B2566] hover:bg-[#F0B55E]/10 font-medium text-xs tracking-wide transition-all inline-flex items-center gap-2 cursor-pointer group whitespace-nowrap"
                        >
                          <span>Ler o texto completo</span>
                          <ArrowRight className="h-3.5 w-3.5 text-[#F0B55E] transition-transform group-hover:translate-x-1" />
                        </button>

                        <span className="text-[11px] text-[#8C987F]">
                          Por {post.authorName}
                        </span>
                      </div>

                    </div>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>

          {/* Indicador sutil de carrossel no mobile */}
          <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px] font-semibold text-[#8C987F] -mt-2">
            <span>Deslize para o lado para ver todos os artigos</span>
            <ArrowRight className="h-3 w-3" />
          </div>

        </div>
      )}

    </div>
  );
};
