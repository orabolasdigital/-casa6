/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /palestras
 * Apresentações oficiais com design em cartas de tarô celestes (proporção 5:8)
 */

import React from 'react';
import { Presentation, ArrowRight } from 'lucide-react';
import { OFFICIAL_LECTURES } from '../../config/site';
import { TarotCard } from '../../components/common/TarotCard';

interface PalestrasViewProps {
  onOpenBooking: (serviceId?: string) => void;
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
        <p className="text-sm sm:text-base text-[#534D6B] max-w-2xl mx-auto leading-relaxed font-normal">
          Encontros desenhados para empresas, coletivos, congressos e eventos culturais, integrando autoconhecimento, inteligência emocional e arquétipos à realidade humana. Apresentadas no formato editorial de cartas de tarô.
        </p>
      </div>

      {/* Grid de Palestras em Estilo Cartas de Tarot 5:8 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {OFFICIAL_LECTURES.map((lecture, index) => (
          <div key={lecture.id} className="w-full max-w-[340px] mx-auto sm:max-w-none">
            <TarotCard
              romanNumeral={index === 0 ? 'IV' : index === 1 ? 'V' : index === 2 ? 'VI' : 'VII'}
              categoryBadge={lecture.format === 'corporativo' ? 'CORPORATIVO' : lecture.format === 'presencial' ? 'PRESENCIAL' : 'ONLINE'}
              title={lecture.title}
              subtitle={lecture.summary}
              imageUrl={
                index === 0
                  ? 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'
                  : index === 1
                  ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
                  : index === 2
                  ? 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80'
                  : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'
              }
              actionLabel="SOLICITAR"
              onAction={() => onOpenBooking(lecture.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

