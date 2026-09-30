/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /lojinha
 * Publicações autorais, guias e cadernos de estudo
 */

import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { ProductItem } from '../../types';

interface LojaViewProps {
  onOpenBooking: () => void;
}

export const LojaView: React.FC<LojaViewProps> = ({ onOpenBooking }) => {
  const products: ProductItem[] = [
    {
      id: 'guia-casas-astrologicas',
      slug: 'guia-casas-astrologicas',
      title: 'Guia Essencial das 12 Casas: A Alquimia da Vida Prática',
      type: 'digital',
      shortDescription: 'Livro digital de autoria de Bianca Tofoli desmistificando os 12 setores do mapa com foco prático e contemporâneo.'
    },
    {
      id: 'caderno-de-transitos',
      slug: 'caderno-de-transitos',
      title: 'Caderno de Trânsitos & Ciclos Lunares',
      type: 'fisico',
      shortDescription: 'Diário guiado impresso para anotações das lunações e acompanhamento dos movimentos planetários ao longo do ano.'
    }
  ];

  return (
    <div className="bg-[#F3EEE5] text-[#211D35] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-14">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6F4D84]">
          LIVROS, FERRAMENTAS & PUBLICAÇÕES
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#22205A] tracking-tight">
          Lojinha Casa 6
        </h1>
        <p className="text-sm sm:text-base text-[#534D6B] leading-relaxed">
          Materiais de estudo e ferramentas cuidadosamente produzidas por Bianca Tofoli para aprofundar seu contato diário com a astrologia.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((item, idx) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl bg-[#FCFAF7] p-6 sm:p-8 border border-[#DAD2C4] shadow-xs hover:shadow-md transition-all group"
          >
            <div className="space-y-4">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[#DAD2C4]">
                <img
                  src={
                    idx === 0
                      ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
                      : 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 protected-img"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080C35]/60 via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-2 left-2 text-[10px] text-[#FFB63F] font-heading">✦</span>
              </div>

              <div className="space-y-2">
                <span className="inline-block rounded-full bg-[#372B69] text-[#FFB63F] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {item.type === 'digital' ? 'E-book / Digital' : 'Produto Físico'}
                </span>
                <h2 className="font-heading text-xl font-bold text-[#22205A]">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#534D6B] leading-relaxed">
                  {item.shortDescription}
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={onOpenBooking}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#FFB63F] py-2.5 text-xs font-bold text-[#080C35] hover:bg-[#EAA329] transition-colors shadow-xs cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>ADQUIRIR NA LOJINHA</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
