/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Carta de Tarô com Efeito 3D Flip (Fundo Azul/Roxo Inicial Virado -> Revelação ao Hover/Click)
 */

import React, { useState } from 'react';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

interface FlipTarotCardProps {
  index: number;
  romanNumeral?: string;
  categoryBadge?: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  actionLabel?: string;
  onAction?: () => void;
  onDetailClick?: () => void;
}

export const FlipTarotCard: React.FC<FlipTarotCardProps> = ({
  index,
  romanNumeral = 'I',
  categoryBadge = 'ATENDIMENTO',
  title,
  subtitle,
  imageUrl,
  actionLabel = 'AGENDAR CONSULTA',
  onAction,
  onDetailClick
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlipToggle = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`tarot-flip-container group relative w-full aspect-[5/8] max-w-[340px] mx-auto cursor-pointer select-none ${
        isFlipped ? 'is-flipped' : ''
      }`}
      onClick={handleFlipToggle}
      role="region"
      aria-label={`Carta de Tarô: ${title}`}
    >
      <div className="tarot-flip-inner w-full h-full">
        
        {/* =========================================================================
            FACE TRASEIRA (INICIAL / CARTA VIRADA COM FUNDO NOITE #2B2566)
            ========================================================================= */}
        <div className="tarot-face-back bg-[#2B2566] text-white p-6 sm:p-7 flex flex-col justify-between border-2 border-[#F0B55E]/40 shadow-xl rounded-2xl relative overflow-hidden">
          {/* Órbitas e Linhas Circulares Sutis do Brand Guide */}
          <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
            <svg className="w-80 h-80" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="90" stroke="#F0B55E" strokeWidth="0.8" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="70" stroke="#F0B55E" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="45" stroke="#F0B55E" strokeWidth="0.8" strokeDasharray="2 4" />
            </svg>
          </div>

          {/* Borda Dupla Estilizada Clássica de Tarô */}
          <div className="absolute inset-2.5 rounded-xl border border-[#F0B55E]/30 pointer-events-none" />

          {/* Topo: Número Romano e Categoria */}
          <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-[#F0B55E]">
            <span className="font-heading tracking-widest text-sm">{romanNumeral}</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#E6E3F1]/80">{categoryBadge}</span>
            <Star className="h-3.5 w-3.5 fill-[#F0B55E] text-[#F0B55E]" />
          </div>

          {/* Centro: Símbolo Cósmico e Título com Cormorant/Hatton Font */}
          <div className="relative z-10 text-center space-y-4 my-auto">
            {/* Logo Quadrado Branco Oficial Casa 6 em Fundo Escuro */}
            <div className="mx-auto w-20 h-16 flex items-center justify-center">
              <img
                src="https://static.wixstatic.com/media/02c8e0_ca7fa008704748b4a7569ca66a02a3bb~mv2.png"
                alt="Casa 6"
                className="max-h-14 max-w-full object-contain filter drop-shadow-[0_0_12px_rgba(240,181,94,0.3)]"
              />
            </div>

            <div className="space-y-1.5 px-2">
              <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                {title}
              </h3>
              {/* Linha-Ponto do Brand Guide */}
              <div className="flex items-center justify-center gap-2 max-w-[120px] mx-auto pt-1">
                <span className="flex-1 h-px bg-[#F0B55E]/40"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]"></span>
                <span className="flex-1 h-px bg-[#F0B55E]/40"></span>
              </div>
            </div>
          </div>

          {/* Rodapé da Carta Virada: Instrução de Virar */}
          <div className="relative z-10 text-center pt-2 border-t border-[#F0B55E]/20">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#F0B55E] uppercase tracking-wider animate-pulse">
              <span>✦ Passe o mouse para desvendar ✦</span>
            </span>
          </div>
        </div>

        {/* =========================================================================
            FACE FRONTAL (REVELADA NO HOVER / CLIQUE COM IMAGEM, TEXTO E BOTÃO)
            ========================================================================= */}
        <div className="tarot-face-front bg-[#FCFAF7] text-[#2B2566] p-5 sm:p-6 flex flex-col justify-between border-2 border-[#F0B55E] shadow-2xl rounded-2xl relative overflow-hidden">
          
          {/* Topo Frontal: Número Romano e Tag */}
          <div className="flex items-center justify-between text-xs text-[#2B2566] pb-2 border-b border-[#E2DCCF]">
            <span className="font-heading font-bold text-[#2B2566]">{romanNumeral}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C987F]">
              {categoryBadge}
            </span>
            <div className="w-2 h-2 rounded-full bg-[#F0B55E]" />
          </div>

          {/* Imagem Astrológica da Carta */}
          <div className="relative my-3 w-full h-[45%] rounded-xl overflow-hidden border border-[#E2DCCF] shadow-inner group-hover:scale-[1.02] transition-transform">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover protected-img"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2B2566]/80 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-3 right-3 text-white text-xs font-heading font-bold drop-shadow-md">
              {title}
            </div>
          </div>

          {/* Texto Base Explicativo Curto */}
          <div className="space-y-1.5 flex-1 flex flex-col justify-center">
            <p className="text-xs text-[#423C7B] leading-relaxed line-clamp-3 font-normal">
              {subtitle}
            </p>
          </div>

          {/* Ações: Botão Direcionando e Detalhes */}
          <div className="space-y-2 pt-2 border-t border-[#E2DCCF]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onAction) onAction();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#F0B55E] hover:bg-[#dfa247] text-[#2B2566] py-2.5 px-4 text-xs font-extrabold uppercase tracking-wider shadow-md transition-all cursor-pointer transform active:scale-98"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {onDetailClick && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDetailClick();
                }}
                className="w-full text-center text-[10px] font-bold uppercase tracking-wider text-[#8C987F] hover:text-[#2B2566] transition-colors py-0.5 cursor-pointer"
              >
                + Ler detalhamento completo
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
