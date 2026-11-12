/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /atendimentos
 * Produtos Oficiais de Atendimentos Astrológicos com Checkout Mercado Pago
 * 
 * Funcionalidades e Design:
 * - Fundo suave, luminoso e acolhedor (#FAF8F5).
 * - Sem logotipo no cabeçalho.
 * - Sem a tag superior de preço nos boxes.
 * - Banners horizontais empilhados com layout alternado:
 *   - 1º Atendimento: Imagem 3D à DIREITA, texto e botão à ESQUERDA.
 *   - 2º Atendimento: Imagem 3D à ESQUERDA, texto e botão à DIREITA.
 *   - 3º Atendimento: Imagem 3D à DIREITA, texto e botão à ESQUERDA.
 *   - 4º Atendimento: Imagem 3D à ESQUERDA, texto e botão à DIREITA.
 * - Botão arredondado elegante em amarelo Sol (#F0B55E) com texto "Contratar agora".
 * - Destaque para o valor e legenda "Parcelado em até 3 vezes" nos atendimentos indicados.
 * - Efeito de subida suave ao scroll (como nuvens flutuando) com IntersectionObserver.
 * - Abertura do modal de checkout seguro ao clicar em "Contratar agora".
 */

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CATALOG_ATENDIMENTOS, AtendimentoProduct } from '../../services/catalogService';
import { MercadoPagoCheckoutModal } from '../../components/common/MercadoPagoCheckoutModal';

interface AtendimentosViewProps {
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

export const AtendimentosView: React.FC<AtendimentosViewProps> = () => {
  const [selectedProduct, setSelectedProduct] = useState<AtendimentoProduct | null>(null);

  // Atendimentos que oferecem parcelamento em até 3x
  const installmentsServices = ['mapa-natal', 'mapa-revolucao-solar', 'combo-mapa-roda-revolucao'];

  return (
    <div className="bg-[#FAF8F5] text-[#2B2566] min-h-screen py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden relative">
      
      {/* Elementos Cósmicos Decorativos Efémeros ao Fundo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-20 right-[-80px] w-96 h-96 rounded-full border border-[#F0B55E]/15 opacity-40 animate-celestial-orbit-slow" />
        <div className="absolute top-1/2 left-[-100px] w-[500px] h-[500px] rounded-full border border-[#8C987F]/10 opacity-50 animate-celestial-orbit-reverse" />
        <div className="absolute top-36 left-12 text-[#F0B55E]/40 text-xs animate-pulse">✦</div>
        <div className="absolute bottom-48 right-1/4 text-[#8C987F]/30 text-[10px]">★</div>
      </div>

      <div className="mx-auto max-w-5xl space-y-10 sm:space-y-14 relative z-10">
        
        {/* =========================================================================
            HEADER INSTITUCIONAL (SEM LOGOTIPO, MAIS LEVE E ELEGANTE)
            ========================================================================= */}
        <RevealOnScroll delayMs={50}>
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F] block">
              CONSULTAS & ATENDIMENTOS ASTROLÓGICOS
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B2566] tracking-tight">
              Nossos Atendimentos
            </h1>
            
            {/* Linha-Ponto do Brand Guide */}
            <div className="flex items-center justify-center gap-3 py-1">
              <span className="w-10 h-px bg-[#2B2566]/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]" />
              <span className="w-16 h-px bg-[#2B2566]/20" />
            </div>

            <p className="text-xs sm:text-sm md:text-[15px] text-[#423C7B] leading-relaxed font-normal">
              Consultas individuais personalizadas com Bianca Tofoli. Selecione o atendimento ideal para o seu momento e conclua com pagamento seguro via Mercado Pago.
            </p>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            BANNERS HORIZONTAIS EMPILHADOS COM LAYOUT ALTERNADO
            1º: Imagem à Direita
            2º: Imagem à Esquerda
            3º: Imagem à Direita
            4º: Imagem à Esquerda
            ========================================================================= */}
        <div className="space-y-8 sm:space-y-10">
          {CATALOG_ATENDIMENTOS.map((item, index) => {
            // Alterna layout: se par, imagem na direita; se ímpar, imagem na esquerda
            const isImageOnRight = index % 2 === 0;
            const hasInstallments = installmentsServices.includes(item.id);

            return (
              <RevealOnScroll key={item.id} delayMs={100 + index * 50}>
                <div className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl lg:rounded-[32px] border border-[#EADBCC]/60 shadow-[0_16px_40px_rgba(43,37,102,0.04)] hover:shadow-[0_20px_50px_rgba(43,37,102,0.07)] transition-all duration-500 overflow-hidden p-6 sm:p-8 lg:p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
                    
                    {/* Imagem 3D do Atendimento */}
                    <div
                      className={`lg:col-span-5 flex items-center justify-center ${
                        isImageOnRight ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                      }`}
                    >
                      <div className="w-48 sm:w-60 md:w-68 lg:w-76 aspect-square flex items-center justify-center p-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_24px_rgba(43,37,102,0.1)] transition-transform duration-500 hover:scale-105"
                          draggable={false}
                        />
                      </div>
                    </div>

                    {/* Conteúdo Textual, Preço e Botão */}
                    <div
                      className={`lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left ${
                        isImageOnRight ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                      }`}
                    >
                      <div className="space-y-2">
                        <h2 className="font-heading text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#2B2566] leading-snug tracking-tight">
                          {item.title}
                        </h2>
                        
                        <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed font-normal">
                          {item.description}
                        </p>
                      </div>

                      {/* Opções específicas (ex: Pronto Socorro) */}
                      {item.options && (
                        <div className="space-y-2 pt-1 border-t border-[#EADBCC]/50 text-left">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#2B2566]">
                            Nesta modalidade, você pode escolher:
                          </p>
                          <ul className="space-y-1.5 text-xs text-[#534D6B]">
                            {item.options.map((opt, oIdx) => (
                              <li key={oIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-[#F0B55E] shrink-0 mt-0.5" />
                                <span>{opt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recursos / Detalhes */}
                      {item.features && (
                        <div className="space-y-1.5 pt-1 border-t border-[#EADBCC]/50 text-left">
                          <ul className="space-y-1.5 text-xs text-[#534D6B]">
                            {item.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Bloco de Preço Destaque & Botão "Contratar agora" */}
                      <div className="pt-4 border-t border-[#EADBCC]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left space-y-0.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C987F] block">
                            VALOR DO INVESTIMENTO
                          </span>
                          <span className="font-heading text-3xl sm:text-4xl font-extrabold text-[#2B2566] tracking-tight block">
                            {item.priceFormatted}
                          </span>
                          {hasInstallments && (
                            <span className="text-[11px] font-semibold text-[#12BB40] inline-flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#12BB40] inline-block animate-pulse" />
                              Parcelado em até 3 vezes
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedProduct(item)}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#F0B55E] bg-[#F0B55E] hover:bg-[#dfa247] text-[#2B2566] px-8 py-3.5 text-xs sm:text-[13px] font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        >
                          <span>Contratar agora</span>
                          <ArrowRight className="h-4 w-4 text-[#2B2566]" />
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* =========================================================================
            SELO DE GARANTIA E PAGAMENTO SEGURO
            ========================================================================= */}
        <RevealOnScroll delayMs={300}>
          <div className="max-w-3xl mx-auto rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-xs border border-[#EADBCC]/60 p-5 sm:p-6 text-center flex flex-col sm:flex-row items-center justify-center gap-3.5 text-xs text-[#534D6B] shadow-[0_8px_24px_rgba(43,37,102,0.03)] font-sans">
            <ShieldCheck className="h-5 w-5 text-[#25D366] shrink-0" />
            <span>
              Ambiente seguro criptografado com tecnologia <strong>Mercado Pago Oficial</strong>. Pagamento via Pix imediato ou cartão de crédito parcelado em até 12x.
            </span>
          </div>
        </RevealOnScroll>

      </div>

      {/* Modal de Pagamento Mercado Pago */}
      {selectedProduct && (
        <MercadoPagoCheckoutModal
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          serviceType="atendimento"
          itemTitle={selectedProduct.title}
          amount={selectedProduct.price}
          customerData={{
            firstName: '',
            lastName: '',
            email: '',
            whatsapp: ''
          }}
          onSuccess={() => {
            setSelectedProduct(null);
          }}
        />
      )}

    </div>
  );
};