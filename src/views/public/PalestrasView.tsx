/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /palestras
 * Apresentações oficiais com design em cartas de tarot celestes
 */

import React from 'react';
import { ArrowRight, Sparkles, Presentation, Users, Calendar } from 'lucide-react';
import { OFFICIAL_LECTURES } from '../../config/site';

interface PalestrasViewProps {
  onOpenBooking: () => void;
}

export const PalestrasView: React.FC<PalestrasViewProps> = ({ onOpenBooking }) => {
  return (
    <div className="bg-[#F3EEE5] text-[#211D35] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-14">
      {/* Header Institucional */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6F4D84]">
          PALESTRAS & WORKSHOPS
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#22205A] tracking-tight">
          Palestras com Bianca Tofoli
        </h1>
        <p className="text-sm sm:text-base text-[#534D6B] max-w-2xl mx-auto leading-relaxed">
          Encontros pensados para empresas, coletivos, congressos e eventos culturais, integrando autoconhecimento, inteligência emocional e arquétipos à realidade humana.
        </p>
      </div>

      {/* Grid de Palestras em Estilo Cartas de Tarot */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {OFFICIAL_LECTURES.map((lecture, index) => (
          <div
            key={lecture.id}
            className="rounded-2xl bg-[#FCFAF7] border border-[#DAD2C4] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
              {/* Carta de Tarot Simbólica */}
              <div className="relative w-32 sm:w-36 aspect-[3/4] rounded-xl overflow-hidden shadow-md shrink-0 border border-[#DAD2C4]/80">
                <img
                  src={
                    index === 0
                      ? 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'
                      : index === 1
                      ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
                      : index === 2
                      ? 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80'
                      : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={lecture.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 protected-img"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080C35]/70 via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-2 left-2 text-[10px] text-[#FFB63F] font-heading">✦</span>
              </div>

              <div className="space-y-3 flex-1">
                <span className="inline-block rounded-full bg-[#372B69] text-[#FFB63F] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {lecture.format === 'corporativo' ? 'Corporativo / Presencial' : lecture.format === 'presencial' ? 'Vivência Presencial' : 'Online / Global'}
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#22205A] leading-snug">
                  {lecture.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#534D6B] leading-relaxed">
                  {lecture.summary}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 border-t border-[#DAD2C4]/50 bg-[#FCFAF7]">
              <button
                onClick={onOpenBooking}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#FFB63F] py-2.5 text-xs font-bold text-[#080C35] hover:bg-[#EAA329] transition-colors shadow-xs"
              >
                <Presentation className="h-4 w-4" />
                <span>SOLICITAR PROPOSTA PARA MEU EVENTO</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
