/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /leituras (Blog)
 * Estrutura exata do print oficial: caixas retangulares com carta de tarô lateral esquerda
 */

import React, { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { BlogPost } from '../../types';

interface BlogViewProps {
  onNavigate: (path: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ onNavigate }) => {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const posts = [
    {
      id: 'eclipse-lunar-em-peixes',
      title: 'Eclipse Lunar em Peixes: O que essa energia desperta em você?',
      excerpt: 'Uma leitura profunda sobre a dissolução de ilusões e o chamado cósmico para acolher a sensibilidade intuitiva sem perder os pés na matéria.',
      authorName: 'Bianca Tofoli',
      publishedAt: '18 Setembro 2024',
      category: 'ECLIPSE',
      roman: 'I',
      readTime: '5 min de leitura',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      fullText: `Os eclipses no eixo Virgem-Peixes funcionam como aceleradores de destino. Enquanto Peixes nos convida a dissolver a rigidez, acolher a espiritualidade e confiar no fluxo invisível da vida, Virgem exige que aterrissamos esses insights na matéria, na rotina e na saúde do corpo. Durante este período, padrões de autosabotagem e ilusões afetivas tendem a vir à tona com força cristalina. A recomendação de Bianca Tofoli para este trânsito é priorizar o silêncio, a hidratação e evitar decisões definitivas sob a turbulência emocional do ápice do eclipse.`
    },
    {
      id: 'mercurio-retrogrado-guia-consciente',
      title: 'Mercúrio Retrógrado: Como navegar esse período com mais consciência',
      excerpt: 'Por que a retrogradação não é um castigo cósmico, mas uma pausa biográfica necessária para revisar acordos, repensar palavras e recalcular rotas.',
      authorName: 'Bianca Tofoli',
      publishedAt: '02 Agosto 2024',
      category: 'TRÂNSITOS',
      roman: 'II',
      readTime: '6 min de leitura',
      image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
      fullText: `Mercúrio é o mensageiro dos deuses, o regente da cognição, da palavra, das trocas comerciais e das conexões neurais. Três a quatro vezes ao ano, seu movimento aparente retrocede no céu. Em vez de temer falhas técnicas ou mal-entendidos, encare a retrogradação como um presente da natureza: um tempo sagrado para desacelerar o ritmo frenético, reler o que foi escrito, revisar contratos pendentes e reconciliar-se com pendências do passado.`
    },
    {
      id: 'ano-novo-astrologico-renovacao',
      title: 'Ano Novo Astrológico: Renovação, propósito e novos ciclos',
      excerpt: 'O ingresso do Sol em Áries marca o verdadeiro despertar do zodíaco. Como preparar a mente e o corpo para semear intenções duradouras.',
      authorName: 'Bianca Tofoli',
      publishedAt: '20 Março 2024',
      category: 'CICLOS',
      roman: 'III',
      readTime: '4 min de leitura',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      fullText: `Diferente do calendário civil de janeiro, o Ano Novo Astrológico tem início exato no Equinócio, momento em que o Sol ingressa no grau zero de Áries. É o fogo primal que rompe a casca da semente. Neste momento, todas as doze forças arquetípicas se renovam. É a hora ideal para realizar o seu Mapa de Revolução Solar ou planejar os grandes projetos que demandarão coragem e pioneirismo nos próximos doze meses.`
    },
    {
      id: 'o-que-revela-a-casa-6',
      title: 'O que revela a Casa 6 no Mapa Astral? Da rotina à maestria do corpo',
      excerpt: 'Por que a Casa 6 é frequentemente mal interpretada como mero trabalho mecânico, quando na verdade é o território do refinamento e da presença cotidiana.',
      authorName: 'Bianca Tofoli',
      publishedAt: '15 Fevereiro 2024',
      category: 'FUNDAMENTOS',
      roman: 'IV',
      readTime: '7 min de leitura',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      fullText: `Na astrologia tradicional, a Casa 6 rege os hábitos diários, o trabalho instrumental, a saúde psicossomática e os pequenos ajustes que sustentam a vida. Foi inspirada nessa casa que nasceu o projeto Casa 6: um lembrete constante de que a sabedoria espiritual mais refinada não reside em abstrações inalcançáveis, mas no modo como você acorda, respira, cuida do seu corpo e organiza sua rotina no plano real.`
    }
  ];

  return (
    <div className="bg-[#F4EFE6] text-[#2B2566] min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header Institucional */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="flex justify-center pb-1">
          <img
            src="https://static.wixstatic.com/media/02c8e0_75b529b0748c4e54adf4e58bfa7c78dc~mv2.png"
            alt="Casa 6"
            className="h-10 w-auto object-contain"
          />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F]">
          EDITORIAL & CADERNO ASTRAL
        </span>
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#2B2566] tracking-tight">
          Leituras Casa 6
        </h1>
        <p className="text-sm sm:text-base text-[#423C7B] leading-relaxed">
          Artigos autorais, estudos dos céus e reflexões de Bianca Tofoli sobre a experiência humana iluminada pela astrologia contemporânea.
        </p>
      </div>

      {/* Lista de Artigos no Formato de Caixas Retangulares com Carta de Tarô à Esquerda */}
      <div className="max-w-5xl mx-auto space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-[#FCFAF7] rounded-3xl border border-[#c7c5b6] shadow-md hover:border-[#fab03b] transition-all p-5 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
          >
            {/* Imagem em Formato de Carta de Tarô à Esquerda */}
            <div className="md:col-span-4 flex justify-center">
              <div className="w-40 sm:w-48 aspect-[5/8] rounded-2xl overflow-hidden border-2 border-[#fab03b] shadow-xl relative group">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover protected-img"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b1463] via-transparent to-transparent opacity-80" />
                <div className="absolute top-2.5 left-2.5 text-[11px] font-bold text-[#fab03b] bg-[#1b1463]/90 px-2 py-0.5 rounded-full border border-[#fab03b]/40">
                  {post.roman}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-heading font-bold">
                  {post.category}
                </div>
              </div>
            </div>

            {/* Conteúdo Editorial à Direita */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#6a62b8] uppercase tracking-wider">
                <span>{post.category}</span>
                <span>•</span>
                <span>{post.publishedAt}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1b1463] leading-snug">
                {post.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#372B69] leading-relaxed">
                {post.excerpt}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1b1463] text-[#fab03b] hover:bg-[#372B69] px-7 py-3 text-xs font-extrabold uppercase tracking-wider shadow-md transition-colors cursor-pointer"
                >
                  <span>LER ARTIGO COMPLETO</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Leitor de Artigo Completo */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#1b1463]/85 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#FCFAF7] border-2 border-[#fab03b] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#1b1463] hover:bg-gray-100"
              aria-label="Fechar"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="space-y-2 border-b border-[#c7c5b6] pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6a62b8]">
                {selectedPost.category} • Por {selectedPost.authorName} • {selectedPost.publishedAt}
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1b1463]">
                {selectedPost.title}
              </h2>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-video border border-[#c7c5b6]">
              <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>

            <div className="text-xs sm:text-sm text-[#372B69] leading-relaxed space-y-4">
              <p>{selectedPost.fullText}</p>
            </div>

            <div className="pt-4 border-t border-[#c7c5b6] flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-6 py-2.5 rounded-full bg-[#1b1463] text-[#fab03b] text-xs font-bold"
              >
                Fechar Artigo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
