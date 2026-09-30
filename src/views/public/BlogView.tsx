/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /leituras (Blog)
 * Artigos autorais em estilo cartas de tarot celestes
 */

import React from 'react';
import { Calendar, User, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { BlogPost } from '../../types';

interface BlogViewProps {
  onNavigate: (path: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ onNavigate }) => {
  const posts: (BlogPost & { readTime: string; image: string })[] = [
    {
      id: 'eclipse-lunar-em-peixes',
      slug: 'eclipse-lunar-em-peixes',
      title: 'Eclipse Lunar em Peixes: O que essa energia desperta em você?',
      excerpt: 'Uma leitura profunda sobre a dissolução de ilusões e o chamado cósmico para acolher a sensibilidade intuitiva sem perder os pés na matéria.',
      authorName: 'Bianca Tofoli',
      authorBio: 'Astróloga e fundadora da Casa 6, pesquisadora de ciclos e simbolismo.',
      publishedAt: '2026-03-28',
      updatedAt: '2026-03-28',
      category: 'Lunações & Eclipses',
      tags: ['Eclipses', 'Peixes', 'Ciclos Celestes'],
      readTime: '5 min de leitura',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'mercurio-retrogrado-guia-consciente',
      slug: 'mercurio-retrogrado-guia-consciente',
      title: 'Mercúrio Retrógrado: Como navegar esse período com mais consciência',
      excerpt: 'Por que a retrogradação não é um castigo cósmico, mas uma pausa biográfica necessária para revisar acordos, repensar palavras e recalcular rotas.',
      authorName: 'Bianca Tofoli',
      authorBio: 'Astróloga e fundadora da Casa 6, pesquisadora de ciclos e simbolismo.',
      publishedAt: '2026-03-22',
      updatedAt: '2026-03-22',
      category: 'Trânsitos & Planetas',
      tags: ['Mercúrio Retrógrado', 'Comunicação', 'Pausa'],
      readTime: '6 min de leitura',
      image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'ano-novo-astrologico-renovacao',
      slug: 'ano-novo-astrologico-renovacao',
      title: 'Ano Novo Astrológico: Renovação, propósito e novos ciclos',
      excerpt: 'O ingresso do Sol em Áries marca o verdadeiro despertar do zodíaco. Como preparar a mente e o corpo para semear intenções duradouras.',
      authorName: 'Bianca Tofoli',
      authorBio: 'Astróloga e fundadora da Casa 6, pesquisadora de ciclos e simbolismo.',
      publishedAt: '2026-03-15',
      updatedAt: '2026-03-15',
      category: 'Ciclos Anuais',
      tags: ['Ano Novo Astrológico', 'Áries', 'Propósito'],
      readTime: '4 min de leitura',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'o-que-revela-a-casa-6',
      slug: 'o-que-revela-a-casa-6',
      title: 'O que revela a Casa 6 no Mapa Astral? Da rotina à maestria do corpo',
      excerpt: 'Por que a Casa 6 é frequentemente mal interpretada como mero trabalho mecânico, quando na verdade é o território do refinamento e da presença cotidiana.',
      authorName: 'Bianca Tofoli',
      authorBio: 'Astróloga e fundadora da Casa 6, pesquisadora de ciclos e simbolismo.',
      publishedAt: '2026-02-15',
      updatedAt: '2026-03-01',
      category: 'Fundamentos Astrológicos',
      tags: ['Casas Astrológicas', 'Casa 6', 'Rotina', 'Corpo'],
      readTime: '7 min de leitura',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="bg-[#F3EEE5] text-[#211D35] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-14">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6F4D84]">
          EDITORIAL & CADERNO ASTRAL
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#22205A] tracking-tight">
          Leituras Casa 6
        </h1>
        <p className="text-sm sm:text-base text-[#534D6B] leading-relaxed">
          Artigos autorais, estudos dos céus e reflexões de Bianca Tofoli sobre a experiência humana iluminada pela astrologia contemporânea.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col justify-between rounded-2xl bg-[#FCFAF7] border border-[#DAD2C4] overflow-hidden shadow-xs hover:shadow-lg transition-all group"
          >
            <div>
              <div className="relative aspect-[16/9] overflow-hidden border-b border-[#DAD2C4]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 protected-img"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080C35]/75 via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-3 left-3 text-[10px] text-[#FFB63F] font-heading">✦</span>
                <span className="absolute bottom-3 left-3 text-[11px] text-white/90 font-semibold tracking-wider">
                  {post.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-[#7A7394]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{post.publishedAt}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#22205A] leading-snug group-hover:text-[#6F4D84] transition-colors">
                  {post.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#534D6B] leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-[#DAD2C4]/40 mt-4 flex items-center justify-between text-xs font-bold text-[#22205A]">
              <span className="text-[#6F4D84]">Por Bianca Tofoli</span>
              <span className="inline-flex items-center gap-1 text-[#22205A] group-hover:text-[#FFB63F] transition-colors">
                <span>LER ARTIGO</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
