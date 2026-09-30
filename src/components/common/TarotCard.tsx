/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Componente Visual Oficial: Carta de Tarô Contemporânea & Editorial
 * 
 * Especificações:
 * - Proporção vertical estrita: aspect-[5/8]
 * - 65–75% da área vertical ocupada pela arte/imagem
 * - Acabamento com moldura dupla refinada (filete externo fino + borda interna dourada)
 * - Micro-parallax e escala sutil na imagem com suporte a prefers-reduced-motion
 * - Raio moderado (rounded-xl) evitando formato de box SaaS
 * - Tipografia oficial Hatton nos títulos e Futura nos detalhes
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TarotCardProps {
  romanNumeral?: string;
  categoryBadge?: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  actionLabel?: string;
  onAction: () => void;
  isLarge?: boolean;
  className?: string;
}

export const TarotCard: React.FC<TarotCardProps> = ({
  romanNumeral,
  categoryBadge,
  title,
  subtitle,
  imageUrl,
  actionLabel = 'AGENDAR',
  onAction,
  isLarge = false,
  className = ''
}) => {
  return (
    <article
      onClick={onAction}
      className={`group relative flex flex-col justify-between rounded-xl bg-[#FCFAF7] border border-[#DAD2C4] shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer select-none ${
        isLarge ? 'aspect-[5/8] sm:aspect-[5/7] max-w-md w-full' : 'aspect-[5/8] w-full'
      } ${className}`}
      style={{
        boxShadow: '0 4px 16px rgba(8, 12, 53, 0.04), 0 1px 3px rgba(8, 12, 53, 0.06)'
      }}
    >
      {/* Moldura Interna de Carta de Tarô (Filete Dourado Duplo) */}
      <div className="absolute inset-1.5 rounded-[10px] border border-[#FFB63F]/40 pointer-events-none z-20 transition-colors group-hover:border-[#FFB63F]/80" />
      <div className="absolute inset-2.5 rounded-[8px] border border-[#DAD2C4]/30 pointer-events-none z-20" />

      {/* ÁREA SUPERIOR DA CARTA (68–72% DA ALTURA): IMAGEM CINEMATOGRÁFICA */}
      <div className="relative h-[70%] w-full overflow-hidden shrink-0 bg-[#080C35]">
        {/* Imagem com micro-movimento no hover */}
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-108 motion-reduce:transform-none protected-img"
          draggable={false}
          loading="lazy"
        />

        {/* Gradiente Noturno Casa 6 para fusão suave com a base da carta */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080C35]/90 via-[#22205A]/30 to-transparent pointer-events-none" />

        {/* Topo da Carta: Glifo Astrológico / Numeração Romana / Estrela */}
        <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-1.5">
            <span className="text-[#FFB63F] text-xs font-heading">✦</span>
            {romanNumeral && (
              <span className="text-[10px] font-heading tracking-widest text-[#FFB63F] font-bold">
                {romanNumeral}
              </span>
            )}
          </div>
          {categoryBadge && (
            <span className="rounded-full bg-[#080C35]/75 backdrop-blur-xs px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#DAD2C4] border border-[#FFB63F]/30">
              {categoryBadge}
            </span>
          )}
        </div>

        {/* Mini estrela decorativa no rodapé da imagem */}
        <div className="absolute bottom-2 right-4 text-[10px] text-[#FFB63F]/80 font-heading">
          ✧
        </div>
      </div>

      {/* ÁREA INFERIOR DA CARTA (30% DA ALTURA): TEXTO EDITORIAL & CTA */}
      <div className="h-[30%] p-3.5 sm:p-4 flex flex-col justify-between bg-[#FCFAF7] z-10">
        <div className="space-y-1">
          <h3 className="font-heading text-sm sm:text-base font-bold text-[#22205A] leading-tight line-clamp-2 group-hover:text-[#6F4D84] transition-colors">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-[#534D6B] leading-snug line-clamp-2 font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Ação da Carta */}
        <div className="pt-1.5 flex items-center justify-between border-t border-[#DAD2C4]/60">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#22205A] group-hover:text-[#6F4D84] transition-colors flex items-center gap-1">
            <span>{actionLabel}</span>
          </span>
          <div className="h-6 w-6 rounded-full bg-[#FFB63F] flex items-center justify-center text-[#080C35] shadow-xs group-hover:bg-[#EAA329] group-hover:scale-110 transition-transform">
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </article>
  );
};
