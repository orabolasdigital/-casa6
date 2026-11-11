/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Componente Visual Oficial: Carta de Tarô Contemporânea & Editorial
 * 
 * Refinamento de Animação e Profundidade (Física de Objeto Real):
 * 1. Sem zoom na imagem no hover (imagem estática em escala).
 * 2. Sombra sutil de repouso: 0 8px 20px rgba(8,12,53,0.06), 0 2px 6px rgba(8,12,53,0.05).
 *    Sombra suave no hover: 0 14px 32px rgba(8,12,53,0.10), 0 4px 10px rgba(8,12,53,0.06).
 * 3. Inclinação no hover (2° a 3°) com direção alternada por índice + translateY(-4px).
 * 4. Perspectiva 3D com preserve-3d e leve rotação nos eixos X/Y (1°).
 * 5. Parallax interno na imagem durante scroll vertical (-8px a +8px), sem background-attachment: fixed.
 * 6. Revelação progressiva (reveal) ao entrar no viewport com stagger (80ms).
 * 7. Assinatura de abertura de baralho inicial (-2° a +2°), repousando perfeitamente reta após reveal.
 * 8. Comportamento mobile seguro: sem inclinação residual no touch, apenas hover em ponteiro fino.
 * 9. Suporte completo a prefers-reduced-motion (elimina rotações, parallax e delays).
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export interface TarotCardProps {
  index?: number;
  totalInGroup?: number;
  romanNumeral?: string;
  categoryBadge?: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  actionLabel?: string;
  onAction: () => void;
  isLarge?: boolean;
  className?: string;
  customTilt?: number;
}

// Sequência padronizada de rotação física sutil (entre 1.5° e 2.5°, máx 3°)
const TILT_SEQUENCE = [-2, 2, -1.5, 2.5, -2.2, 1.8];

export const TarotCard: React.FC<TarotCardProps> = ({
  index = 0,
  totalInGroup = 3,
  romanNumeral,
  categoryBadge,
  title,
  subtitle,
  imageUrl,
  actionLabel = 'AGENDAR',
  onAction,
  isLarge = false,
  className = '',
  customTilt
}) => {
  const cardRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [hasEntered, setHasEntered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Cálculo da inclinação sutil individual no hover (-2° a +2.5°)
  const hoverTilt = customTilt ?? TILT_SEQUENCE[index % TILT_SEQUENCE.length];
  const tiltY = hoverTilt > 0 ? 1 : -1;

  // Cálculo da abertura inicial de baralho (leque suave antes da revelação)
  const initialSpread = (() => {
    if (totalInGroup <= 1) return 0;
    if (totalInGroup === 3) {
      return index === 0 ? -2 : index === 1 ? 0 : 2;
    }
    if (totalInGroup === 4) {
      return index === 0 ? -2 : index === 1 ? -0.7 : index === 2 ? 0.7 : 2;
    }
    const ratio = index / (totalInGroup - 1); // 0 a 1
    return Math.round((-2 + ratio * 4) * 10) / 10;
  })();

  // Stagger escalonado por índice da carta (0ms, 80ms, 160ms, 240ms)
  const staggerDelay = Math.min((index % 4) * 80, 320);

  // Detecção de prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  // IntersectionObserver para Revelação no Scroll & Loop Otimizado de Parallax Interno
  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    // Se preferir movimento reduzido, revela imediatamente sem animação de entrada
    if (prefersReducedMotion) {
      setHasEntered(true);
      return;
    }

    let isVisible = false;
    let rafId: number | null = null;

    // Atualização leve de Parallax Interno da Imagem (-8px a +8px)
    const updateParallax = () => {
      if (!isVisible || !imageRef.current || !cardEl) return;

      const rect = cardEl.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;

      // Centro relativo do card em relação ao centro da janela (-1 a +1)
      const cardCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const normalized = (viewportCenter - cardCenter) / (windowHeight / 2);
      const clamped = Math.max(-1, Math.min(1, normalized));

      // Deslocamento vertical muito sutil da imagem (±8px)
      const offset = Math.round(clamped * 8 * 10) / 10;

      imageRef.current.style.setProperty('--parallax-y', `${offset}px`);
    };

    const handleScroll = () => {
      if (!isVisible) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateParallax);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEntered(true);
            isVisible = true;
            updateParallax();
          } else {
            isVisible = false;
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    observer.observe(cardEl);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  // Estilo dinâmico de entrada e CSS variables para o hover
  const getDynamicStyles = (): React.CSSProperties => {
    const vars: Record<string, string | number> = {
      '--card-hover-tilt': `${hoverTilt}deg`,
      '--card-tilt-y': `${tiltY}deg`
    };

    if (prefersReducedMotion) {
      return {
        ...vars,
        opacity: 1,
        transform: 'none'
      };
    }

    if (!hasEntered) {
      return {
        ...vars,
        opacity: 0,
        transform: `translateY(28px) rotate(${initialSpread}deg)`
      };
    }

    return {
      ...vars,
      opacity: 1,
      transform: 'translateY(0px) rotate(0deg)',
      transitionDelay: `${staggerDelay}ms`
    };
  };

  return (
    <div className="tarot-collection-perspective w-full h-full flex justify-center">
      <article
        ref={cardRef}
        onClick={onAction}
        className={`tarot-card-item group relative flex flex-col justify-between rounded-xl bg-[#FCFAF7] border border-[#DAD2C4] overflow-hidden cursor-pointer select-none ${
          isLarge ? 'aspect-[5/8] sm:aspect-[5/7] max-w-md w-full' : 'aspect-[5/8] w-full'
        } ${className}`}
        style={getDynamicStyles()}
      >
        {/* Moldura Interna Dupla de Carta de Tarô (Filete Dourado) */}
        <div className="absolute inset-1.5 rounded-[10px] border border-[#FFB63F]/40 pointer-events-none z-20 transition-colors group-hover:border-[#FFB63F]/80" />
        <div className="absolute inset-2.5 rounded-[8px] border border-[#DAD2C4]/30 pointer-events-none z-20" />

        {/* ÁREA SUPERIOR DA CARTA (68–72% DA ALTURA): JANELA DE RECORTE COM PARALLAX INTERNO */}
        <div className="tarot-card-image-window relative h-[70%] w-full overflow-hidden shrink-0 bg-[#080C35]">
          {/* 
            Imagem com área ligeiramente maior (-12px a +12px de folga vertical) 
            Desloca verticalmente com scroll sem zoom ou escala excessiva
          */}
          <img
            ref={imageRef}
            src={imageUrl}
            alt={title}
            className="tarot-card-image-parallax absolute inset-x-0 w-full h-[calc(100%+24px)] -top-3 object-cover object-center protected-img"
            draggable={false}
            loading="lazy"
          />

          {/* Gradiente Noturno Casa 6 para fusão suave com a base da carta */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080C35]/90 via-[#22205A]/30 to-transparent pointer-events-none" />

          {/* Topo da Carta: Glifo Astrológico / Numeração Romana / Categoria */}
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

        {/* ÁREA INFERIOR DA CARTA (30% DA ALTURA): TEXTO EDITORIAL & AÇÃO */}
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
            <div className="h-6 w-6 rounded-full bg-[#FFB63F] flex items-center justify-center text-[#080C35] shadow-xs group-hover:bg-[#EAA329] group-hover:scale-105 transition-transform">
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
