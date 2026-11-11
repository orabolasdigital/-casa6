/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Carta de Tarô com Efeito 3D Flip Oficial
 * Suporta:
 * 1. Consultas Individuais (Cartas roxas com símbolo transparente e carta dourada especial para o Combo).
 * 2. Leituras Astrais / Blog (Fundo da foto do artigo com camada de roxo sobreposta, favicon Casa 6 como símbolo e botão de leitura ao virar).
 */

import React, { useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';

interface FlipTarotCardProps {
  index: number;
  romanNumeral?: string;
  categoryBadge?: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  backgroundImageUrl?: string; // Foto de fundo com overlay roxo para Leituras Astrais
  iconUrl?: string;            // Símbolo do atendimento OU favicon da Casa 6
  date?: string;               // Data de publicação do artigo
  priceFormatted?: string;
  isGoldenCard?: boolean;
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
  backgroundImageUrl,
  iconUrl,
  date,
  priceFormatted,
  isGoldenCard = false,
  actionLabel = 'AGENDAR CONSULTA',
  onAction,
  onDetailClick
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlipToggle = () => {
    setIsFlipped(!isFlipped);
  };

  // Se houver backgroundImageUrl, o ícone central é exclusivamente o iconUrl (ex: favicon)
  const activeSymbol = backgroundImageUrl ? iconUrl : (iconUrl || imageUrl);

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
            FACE 1 (INICIAL / CARTA VIRADA)
            - Para Leituras Astrais: Foto do blog ao fundo com overlay roxo + Favicon no centro
            - Para Atendimentos: Fundo roxo #2B2566 ou dourado com símbolo transparente
            ========================================================================= */}
        <div
          className={`tarot-face-back p-6 sm:p-7 flex flex-col justify-between shadow-xl rounded-2xl relative overflow-hidden ${
            isGoldenCard
              ? 'bg-gradient-to-br from-[#F5CA75] via-[#EFA63E] to-[#C9801C] text-[#2B2566] border-2 border-white/80 shadow-[0_12px_36px_rgba(239,166,62,0.4)]'
              : 'bg-[#2B2566] text-white border-2 border-[#F0B55E]/40'
          }`}
        >
          {/* Fundo Fotográfico com Camada de Roxo (Leituras Astrais) */}
          {backgroundImageUrl && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2B2566]/94 via-[#2B2566]/88 to-[#2B2566]/92 pointer-events-none" />
            </>
          )}

          {/* Órbitas e Linhas Circulares Sutis do Brand Guide */}
          <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
            <svg className="w-80 h-80" viewBox="0 0 200 200" fill="none">
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke={isGoldenCard ? '#2B2566' : '#F0B55E'}
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
              <circle
                cx="100"
                cy="100"
                r="70"
                stroke={isGoldenCard ? '#2B2566' : '#F0B55E'}
                strokeWidth="0.5"
              />
              <circle
                cx="100"
                cy="100"
                r="45"
                stroke={isGoldenCard ? '#2B2566' : '#F0B55E'}
                strokeWidth="0.8"
                strokeDasharray="2 4"
              />
            </svg>
          </div>

          {/* Borda Dupla Estilizada Clássica de Tarô */}
          <div
            className={`absolute inset-2.5 rounded-xl border pointer-events-none ${
              isGoldenCard ? 'border-[#2B2566]/25' : 'border-[#F0B55E]/30'
            }`}
          />

          {/* Topo: Número Romano, Categoria e Estrela */}
          <div
            className={`relative z-10 flex items-center justify-between text-xs font-semibold ${
              isGoldenCard ? 'text-[#2B2566]' : 'text-[#F0B55E]'
            }`}
          >
            <span className="font-heading tracking-widest text-sm font-bold">{romanNumeral}</span>
            <span
              className={`text-[10px] uppercase tracking-[0.25em] font-extrabold ${
                isGoldenCard ? 'bg-white/40 text-[#2B2566] px-2 py-0.5 rounded-full' : 'text-[#E6E3F1]/80'
              }`}
            >
              {categoryBadge}
            </span>
            <Star
              className={`h-3.5 w-3.5 ${
                isGoldenCard ? 'fill-[#2B2566] text-[#2B2566]' : 'fill-[#F0B55E] text-[#F0B55E]'
              }`}
            />
          </div>

          {/* Centro: Símbolo Central (Favicon para Blog / Símbolo do Atendimento) + Título */}
          <div className="relative z-10 text-center space-y-3.5 my-auto">
            {activeSymbol && (
              <div
                className={`mx-auto flex items-center justify-center p-1 ${
                  backgroundImageUrl ? 'w-14 h-14' : 'w-32 sm:w-36 h-28 sm:h-32'
                }`}
              >
                <img
                  src={activeSymbol}
                  alt={title}
                  className={`object-contain filter transition-transform duration-500 group-hover:scale-108 ${
                    backgroundImageUrl
                      ? 'max-h-12 max-w-full drop-shadow-[0_0_10px_rgba(240,181,94,0.5)]'
                      : isGoldenCard
                      ? 'max-h-26 sm:max-h-30 max-w-[95%] drop-shadow-[0_6px_16px_rgba(43,37,102,0.35)]'
                      : 'max-h-26 sm:max-h-30 max-w-[95%] drop-shadow-[0_0_18px_rgba(240,181,94,0.5)]'
                  }`}
                  draggable={false}
                />
              </div>
            )}

            <div className="space-y-1.5 px-1">
              <h3
                className={`font-heading text-lg sm:text-xl font-bold tracking-tight leading-snug ${
                  backgroundImageUrl ? 'line-clamp-3' : ''
                } ${isGoldenCard ? 'text-[#2B2566] font-black' : 'text-white'}`}
              >
                {title}
              </h3>
              {/* Linha-Ponto do Brand Guide */}
              <div className="flex items-center justify-center gap-2 max-w-[120px] mx-auto pt-1">
                <span
                  className={`flex-1 h-px ${isGoldenCard ? 'bg-[#2B2566]/35' : 'bg-[#F0B55E]/40'}`}
                ></span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isGoldenCard ? 'bg-[#2B2566]' : 'bg-[#F0B55E]'}`}
                ></span>
                <span
                  className={`flex-1 h-px ${isGoldenCard ? 'bg-[#2B2566]/35' : 'bg-[#F0B55E]/40'}`}
                ></span>
              </div>
            </div>
          </div>

          {/* Rodapé da Carta Virada: Instrução de Virar */}
          <div
            className={`relative z-10 text-center pt-2 border-t ${
              isGoldenCard ? 'border-[#2B2566]/20' : 'border-[#F0B55E]/20'
            }`}
          >
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider ${
                isGoldenCard ? 'text-[#2B2566]' : 'text-[#F0B55E] animate-pulse'
              }`}
            >
              <span>✦ Passe o mouse para desvendar ✦</span>
            </span>
          </div>
        </div>

        {/* =========================================================================
            FACE 2 (VERSO REVELADO AO VIRAR / HOVER)
            Exibe Resumo e Botão de Leitura ou Agendamento
            ========================================================================= */}
        <div
          className={`tarot-face-front p-5 sm:p-6 flex flex-col justify-between shadow-2xl rounded-2xl relative overflow-hidden ${
            isGoldenCard
              ? 'bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E5] to-[#F7ECD4] text-[#2B2566] border-2 border-[#EFA63E]'
              : 'bg-[#FCFAF7] text-[#2B2566] border-2 border-[#F0B55E]'
          }`}
        >
          {/* Topo Frontal: Número Romano e Tag */}
          <div className="flex items-center justify-between text-xs text-[#2B2566] pb-2 border-b border-[#E2DCCF]">
            <span className="font-heading font-bold text-[#2B2566]">{romanNumeral}</span>
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${
                isGoldenCard ? 'text-[#B87314]' : 'text-[#8C987F]'
              }`}
            >
              {categoryBadge}
            </span>
            <div
              className={`w-2 h-2 rounded-full ${isGoldenCard ? 'bg-[#EFA63E]' : 'bg-[#F0B55E]'}`}
            />
          </div>

          {/* Caso 1: Leituras Astrais / Blog (com backgroundImageUrl) */}
          {backgroundImageUrl ? (
            <div className="space-y-3 my-auto py-2">
              <div className="relative w-full h-28 sm:h-32 rounded-xl overflow-hidden border border-[#E2DCCF] shadow-xs">
                <img
                  src={backgroundImageUrl}
                  alt={title}
                  className="w-full h-full object-cover protected-img"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B2566]/75 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-full bg-[#F0B55E] text-[#2B2566] text-[9px] font-black uppercase tracking-wider">
                  {categoryBadge}
                </span>
              </div>

              <div className="space-y-1 text-center px-1">
                <h4 className="font-heading font-bold text-base sm:text-lg text-[#2B2566] leading-snug line-clamp-2">
                  {title}
                </h4>
                {date && (
                  <span className="text-[10px] text-[#8C987F] font-medium block">
                    Por Bianca Tofoli • {date}
                  </span>
                )}
                <p className="text-xs text-[#423C7B] leading-relaxed line-clamp-3 font-normal pt-0.5">
                  {subtitle}
                </p>
              </div>
            </div>
          ) : iconUrl ? (
            /* Caso 2: Atendimentos com Símbolo Transparente Grande (Sem borda e fundo 100% transparente) */
            <>
              <div className="relative my-2 w-full h-[40%] flex items-center justify-center p-1 bg-transparent transition-transform duration-300 group-hover:scale-105">
                <img
                  src={iconUrl}
                  alt={title}
                  className="max-h-26 sm:max-h-30 max-w-[90%] object-contain filter drop-shadow-[0_8px_16px_rgba(43,37,102,0.18)]"
                  draggable={false}
                />
              </div>

              <div className="space-y-1 text-center my-auto px-1">
                <h4 className="font-heading font-bold text-lg sm:text-xl text-[#2B2566] tracking-tight">
                  {title}
                </h4>
                {priceFormatted && (
                  <div className="text-xs sm:text-sm font-bold text-[#B87314]">
                    {priceFormatted}
                  </div>
                )}
                <p className="text-xs text-[#423C7B] leading-relaxed line-clamp-2 font-normal pt-1">
                  {subtitle}
                </p>
              </div>
            </>
          ) : (
            /* Caso 3: Imagem padrão */
            <div className="relative my-3 w-full h-[45%] rounded-xl overflow-hidden border border-[#E2DCCF] shadow-inner group-hover:scale-[1.02] transition-transform">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover protected-img"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2566]/80 via-transparent to-transparent" />
            </div>
          )}

          {/* Ações: Botão Direcionando e Detalhes */}
          <div className="space-y-2 pt-2 border-t border-[#E2DCCF]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onAction) onAction();
              }}
              className={`w-full flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-extrabold uppercase tracking-wider shadow-md transition-all cursor-pointer transform active:scale-98 ${
                isGoldenCard
                  ? 'bg-[#2B2566] hover:bg-[#1E194D] text-[#F0B55E]'
                  : 'bg-[#F0B55E] hover:bg-[#dfa247] text-[#2B2566]'
              }`}
            >
              <span>{actionLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {onDetailClick && !backgroundImageUrl && (
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
