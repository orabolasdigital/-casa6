/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /leituras (Blog Oficial com SEO e GEO)
 */

import React, { useState } from 'react';
import { ArrowRight, X, Calendar, Clock, MapPin, Tag, ExternalLink } from 'lucide-react';
import { CATALOG_BLOG_POSTS, BlogPostItem } from '../../services/catalogService';

interface BlogViewProps {
  onNavigate?: (path: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPostItem | null>(null);

  return (
    <div className="bg-[#F4EFE6] text-[#2B2566] min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Schema.org Blog/Article JSON-LD para Indexação SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Leituras Casa 6 — Bianca Tofoli',
            description: 'Artigos autorais, estudos astrológicos e reflexões sobre autoconhecimento e rotina.',
            publisher: {
              '@type': 'Organization',
              name: 'Casa 6',
              logo: 'https://static.wixstatic.com/media/02c8e0_75b529b0748c4e54adf4e58bfa7c78dc~mv2.png'
            },
            spatialCoverage: 'São Paulo, Brasil',
            blogPost: CATALOG_BLOG_POSTS.map((post) => ({
              '@type': 'BlogPosting',
              headline: post.title,
              image: post.imageUrl,
              datePublished: post.publishedAt,
              author: {
                '@type': 'Person',
                name: post.authorName
              },
              articleBody: post.excerpt,
              url: post.originalUrl
            }))
          })
        }}
      />

      {/* Header Institucional */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="flex justify-center pb-1">
          <img
            src="https://static.wixstatic.com/media/02c8e0_75b529b0748c4e54adf4e58bfa7c78dc~mv2.png"
            alt="Casa 6"
            className="h-10 w-auto object-contain"
          />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F]">
          CADERNO ASTRAL & ARTIGOS AUTORAIS
        </span>
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#2B2566] tracking-tight">
          Leituras Casa 6
        </h1>
        <p className="text-sm sm:text-base text-[#423C7B] leading-relaxed">
          Artigos autorais, trânsitos celestes e reflexões práticas de Bianca Tofoli para integrar a astrologia ao seu autoconhecimento e rotina.
        </p>
      </div>

      {/* Grid Oficial dos 6 Artigos no Formato de Caixas Retangulares com Imagem à Esquerda */}
      <div className="max-w-5xl mx-auto space-y-6">
        {CATALOG_BLOG_POSTS.map((post, idx) => (
          <article
            key={post.id}
            className="bg-[#FCFAF7] rounded-sm border border-[#DAD2C4] shadow-md hover:shadow-xl hover:border-[#1b1463] transition-all p-5 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-center font-sans"
          >
            {/* Thumbnail / Foto do Artigo */}
            <div className="md:col-span-4 h-52 sm:h-56 rounded-sm overflow-hidden bg-[#2B2566]/5 border border-[#DAD2C4] relative group">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute top-2.5 left-2.5 bg-[#1b1463] text-[#F0B55E] text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                {post.category}
              </span>
            </div>

            {/* Conteúdo Editorial */}
            <div className="md:col-span-8 space-y-3">
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

              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#1b1463] leading-snug">
                {post.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              {/* Tags de SEO */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.seoKeywords.slice(0, 4).map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="inline-flex items-center gap-1 text-[10px] bg-white border border-[#DAD2C4] px-2 py-0.5 rounded-sm text-[#534D6B]"
                  >
                    <Tag className="h-2.5 w-2.5 text-[#8C987F]" />
                    <span>#{tag}</span>
                  </span>
                ))}
              </div>

              {/* Botão de Ler Artigo Completo */}
              <div className="pt-2 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#1b1463] hover:text-[#C2593F] transition-colors cursor-pointer group"
                >
                  <span className="underline underline-offset-4">Ler texto completo</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
                <a
                  href={post.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#8C987F] hover:text-[#1b1463] inline-flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Ver original</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal de Leitura Integral do Artigo */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#080C35]/80 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl rounded-sm bg-[#FCFAF7] shadow-2xl border border-[#DAD2C4] overflow-hidden flex flex-col max-h-[90vh] font-sans">
            {/* Header do Artigo */}
            <div className="bg-[#1b1463] text-white p-5 flex items-center justify-between border-b border-[#F0B55E]/40 shrink-0">
              <div className="space-y-1 pr-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F0B55E] block">
                  {selectedPost.category} • {selectedPost.publishedAt}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white leading-snug">
                  {selectedPost.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Fechar artigo"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Imagem de Capa do Artigo */}
            <div className="w-full h-48 sm:h-64 overflow-hidden relative shrink-0">
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Texto Integral */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#423C7B] leading-relaxed whitespace-pre-line">
              {selectedPost.fullContent}
            </div>

            {/* Footer do Modal */}
            <div className="p-4 bg-white border-t border-[#DAD2C4] flex items-center justify-between text-xs text-[#8C987F] shrink-0">
              <span>Autoria: Bianca Tofoli • Casa 6</span>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="px-4 py-1.5 rounded-sm bg-[#1b1463] text-white font-bold text-xs hover:bg-[#2B2566] transition-colors"
              >
                Fechar Leitura
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
