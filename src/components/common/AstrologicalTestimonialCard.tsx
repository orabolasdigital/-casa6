/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Card de Depoimento com Adornos Astrológicos Exclusivos
 * Cada box possui um motivo cósmico diferente (Lua, Sol, Estrela Guia, Órbita Planetária),
 * marcas d'água astrais, cantoneiras douradas e acabamento de alta elegância.
 */

import React from 'react';
import { Star } from 'lucide-react';
import { TestimonialItem } from '../../types';

interface AstrologicalTestimonialCardProps {
  testimonial: TestimonialItem;
  cardIndex: number; // 0, 1, 2, 3 dentro do grupo
  groupIndex: number; // 0, 1, 2 (qual das 3 bolinhas)
}

export const AstrologicalTestimonialCard: React.FC<AstrologicalTestimonialCardProps> = ({
  testimonial,
  cardIndex,
  groupIndex
}) => {
  // 4 Temas Cósmicos distintos para cada um dos 4 cards do combo
  const motifType = cardIndex % 4;

  // Paleta de acentos astrais sofisticados
  const getAccents = () => {
    switch (motifType) {
      case 0: // TEMA LUA CRESCENTE (MÍSTICO & INTUITIVO)
        return {
          symbolName: 'Lua Astral',
          borderHover: 'hover:border-[#EFA63E]',
          glowShadow: 'hover:shadow-[0_16px_36px_rgba(239,166,62,0.16)]',
          badgeBg: 'bg-[#F4EFE6] text-[#B87314] border-[#E2DCCF]',
          goldLine: 'from-transparent via-[#EFA63E]/60 to-transparent',
          iconColor: 'text-[#EFA63E]',
          svgMotif: (
            /* Lua Crescente com Pequena Estrela */
            <svg className="w-5 h-5 text-[#EFA63E]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.88 0 5.49-1.22 7.33-3.18-4.83-.44-8.62-4.23-9.06-9.06C10.78 7.49 12 4.88 12 2z" />
              <path d="M19 4l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8z" />
            </svg>
          ),
          watermark: (
            /* Órbita Lunar com Fases Sutis no Fundo */
            <svg className="absolute -right-6 -bottom-6 w-36 h-36 opacity-7 pointer-events-none text-[#2B2566]" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="50" cy="8" r="4" fill="currentColor" />
              <circle cx="92" cy="50" r="4" fill="currentColor" />
              <circle cx="50" cy="92" r="4" fill="currentColor" />
              <circle cx="8" cy="50" r="4" fill="currentColor" />
            </svg>
          )
        };

      case 1: // TEMA SOL RADIANTE (VITALIDADE & CLAREZA)
        return {
          symbolName: 'Sol Cósmico',
          borderHover: 'hover:border-[#F0B55E]',
          glowShadow: 'hover:shadow-[0_16px_36px_rgba(240,181,94,0.18)]',
          badgeBg: 'bg-[#FDF6E9] text-[#C9801C] border-[#F0B55E]/40',
          goldLine: 'from-transparent via-[#F0B55E]/70 to-transparent',
          iconColor: 'text-[#F0B55E]',
          svgMotif: (
            /* Sol com Raios de 8 Pontas */
            <svg className="w-5 h-5 text-[#F0B55E]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ),
          watermark: (
            /* Mandala Solar Radiante */
            <svg className="absolute -right-6 -bottom-6 w-36 h-36 opacity-7 pointer-events-none text-[#F0B55E]" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" />
              <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.6" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.6" />
              <line x1="18" y1="18" x2="82" y2="82" stroke="currentColor" strokeWidth="0.6" />
              <line x1="18" y1="82" x2="82" y2="18" stroke="currentColor" strokeWidth="0.6" />
            </svg>
          )
        };

      case 2: // TEMA ESTRELA POLAR / SÍRIUS (DIREÇÃO & SABEDORIA)
        return {
          symbolName: 'Estrela Guia',
          borderHover: 'hover:border-[#8C987F]',
          glowShadow: 'hover:shadow-[0_16px_36px_rgba(140,152,127,0.18)]',
          badgeBg: 'bg-[#F2F5F0] text-[#556348] border-[#8C987F]/30',
          goldLine: 'from-transparent via-[#8C987F]/60 to-transparent',
          iconColor: 'text-[#8C987F]',
          svgMotif: (
            /* Estrela Sirius de 8 Pontas */
            <svg className="w-5 h-5 text-[#8C987F]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1l2.5 7.5L22 11l-7.5 2.5L12 21l-2.5-7.5L2 11l7.5-2.5L12 1z" />
              <circle cx="12" cy="11" r="1.5" fill="#FFFFFF" />
            </svg>
          ),
          watermark: (
            /* Mapa de Constelação Geométrica */
            <svg className="absolute -right-6 -bottom-6 w-36 h-36 opacity-8 pointer-events-none text-[#8C987F]" viewBox="0 0 100 100" fill="none">
              <polygon points="50,10 90,50 50,90 10,50" stroke="currentColor" strokeWidth="0.8" />
              <polygon points="50,22 78,50 50,78 22,50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              <circle cx="50" cy="10" r="2.5" fill="currentColor" />
              <circle cx="90" cy="50" r="2.5" fill="currentColor" />
              <circle cx="50" cy="90" r="2.5" fill="currentColor" />
              <circle cx="10" cy="50" r="2.5" fill="currentColor" />
            </svg>
          )
        };

      case 3: // TEMA PLANETÁRIO / ÓRBITA CÓSMICA (HARMONIA & CICLOS)
      default:
        return {
          symbolName: 'Órbita Celeste',
          borderHover: 'hover:border-[#B87314]',
          glowShadow: 'hover:shadow-[0_16px_36px_rgba(184,115,20,0.18)]',
          badgeBg: 'bg-[#FAF3E5] text-[#9A5E0B] border-[#B87314]/30',
          goldLine: 'from-transparent via-[#B87314]/60 to-transparent',
          iconColor: 'text-[#B87314]',
          svgMotif: (
            /* Planeta Saturno com Anéis */
            <svg className="w-5 h-5 text-[#B87314]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.25" />
              <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-22 12 12)" strokeLinecap="round" />
            </svg>
          ),
          watermark: (
            /* Órbitas Elípticas Concorrentes */
            <svg className="absolute -right-6 -bottom-6 w-36 h-36 opacity-7 pointer-events-none text-[#2B2566]" viewBox="0 0 100 100" fill="none">
              <ellipse cx="50" cy="50" rx="44" ry="24" transform="rotate(-30 50 50)" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
              <ellipse cx="50" cy="50" rx="44" ry="24" transform="rotate(30 50 50)" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1" />
            </svg>
          )
        };
    }
  };

  const accent = getAccents();

  return (
    <div
      className={`relative rounded-2xl bg-white text-[#2B2566] border border-[#E2DCCF] p-6 sm:p-7 shadow-[0_4px_20px_rgba(43,37,102,0.05)] ${accent.borderHover} ${accent.glowShadow} transition-all duration-300 flex flex-col justify-between overflow-hidden group select-text`}
    >
      {/* Marca D'Água Astrológica de Fundo */}
      {accent.watermark}

      {/* Cantoneira Dourada Astral Superior Esquerda */}
      <div className="absolute top-2.5 left-2.5 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
        <svg className="w-3.5 h-3.5 text-[#F0B55E]" viewBox="0 0 16 16" fill="none">
          <path d="M1 9V1H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="1" cy="1" r="1" fill="currentColor" />
        </svg>
      </div>

      {/* Cantoneira Dourada Astral Superior Direita */}
      <div className="absolute top-2.5 right-2.5 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
        <svg className="w-3.5 h-3.5 text-[#F0B55E]" viewBox="0 0 16 16" fill="none">
          <path d="M15 9V1H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="15" cy="1" r="1" fill="currentColor" />
        </svg>
      </div>

      {/* Topo do Card: Símbolo Cósmico Único + Badge do Atendimento + Tag de Grupo */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between gap-2">
          {/* Símbolo Astrológico Adornado */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E2DCCF] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              {accent.svgMotif}
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B87314] font-heading">
              {accent.symbolName}
            </span>
          </div>

          {/* Badge do Tipo de Serviço / Consulta */}
          <span
            className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${accent.badgeBg} truncate max-w-[200px]`}
          >
            {testimonial.serviceTitle}
          </span>
        </div>

        {/* Linha Fina Dourada com Estrelinha de Divisão */}
        <div className="relative py-1">
          <div className={`h-px w-full bg-gradient-to-r ${accent.goldLine}`} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[9px] text-[#F0B55E] select-none">
            ✦
          </div>
        </div>

        {/* Texto do Depoimento com Aspas e Tipografia Editorial na Cor Roxa Padrão */}
        <p className="font-heading italic text-sm sm:text-[14px] text-[#2B2566] leading-relaxed pt-1">
          “{testimonial.content}”
        </p>
      </div>

      {/* Rodapé do Card: Linha Dourada, Identificação Anônima Elegante e 5 Estrelas */}
      <div className="pt-4 border-t border-[#EFEAE1] flex items-center justify-between relative z-10 mt-4">
        <div className="space-y-0.5">
          <span className="font-heading font-bold text-xs text-[#2B2566] block">
            {testimonial.authorName}
          </span>
          <span className="text-[10px] text-[#8C987F] block">
            Depoimento Verificado • Casa 6
          </span>
        </div>

        {/* Avaliação em 5 Estrelas Douradas */}
        <div className="flex items-center gap-0.5 text-[#F0B55E]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-[#F0B55E] text-[#F0B55E]" />
          ))}
        </div>
      </div>
    </div>
  );
};
