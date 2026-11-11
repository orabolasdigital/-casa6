/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /vivencias
 * Imersão Vivencial Oficial: Curando os Ciclos
 */

import React from 'react';
import { MapPin, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { OFFICIAL_EXPERIENCES } from '../../config/site';
import { TarotCard } from '../../components/common/TarotCard';

interface VivenciasViewProps {
  onOpenBooking: () => void;
}

export const VivenciasView: React.FC<VivenciasViewProps> = ({ onOpenBooking }) => {
  const vivencia = OFFICIAL_EXPERIENCES[0];

  return (
    <div className="bg-[#F3EEE5] text-[#211D35] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-14">
      {/* Header Institucional */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6F4D84]">
          VIVÊNCIAS & IMERSÕES
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#22205A] tracking-tight">
          Vivências Casa 6
        </h1>
        <p className="text-sm sm:text-base text-[#534D6B] max-w-2xl mx-auto leading-relaxed">
          Sentir a astrologia no corpo, nos ciclos e no coração. Encontros cuidadosamente desenhados por Bianca Tofoli para integrar os arquétipos na experiência viva e coletiva.
        </p>
      </div>

      {/* Destaque Principal da Vivência: Curando os Ciclos */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Carta de Tarô Grande */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[340px]">
            <TarotCard
              index={0}
              totalInGroup={1}
              romanNumeral="XII"
              categoryBadge="VIVÊNCIA"
              title={vivencia.title}
              subtitle="Imersão autoral de transição e renovação"
              imageUrl="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80"
              actionLabel="SOLICITAR INSCRIÇÃO"
              onAction={onOpenBooking}
              isLarge={true}
            />
          </div>
        </div>

        {/* Conteúdo Detalhado */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#FCFAF7] border border-[#DAD2C4] shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#6F4D84] uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-[#FFB63F]" />
              <span>Encontro Imersivo com Bianca Tofoli</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#22205A]">
              {vivencia.title}
            </h2>

            <p className="text-sm sm:text-base text-[#534D6B] leading-relaxed">
              {vivencia.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F3EEE5] border border-[#E6DFD3]">
                <Calendar className="h-5 w-5 text-[#372B69] shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-[#22205A] block">Turma Exclusiva</span>
                  <span className="text-[#534D6B]">{vivencia.dateInfo}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F3EEE5] border border-[#E6DFD3]">
                <MapPin className="h-5 w-5 text-[#372B69] shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-[#22205A] block">Formato & Local</span>
                  <span className="text-[#534D6B]">{vivencia.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DAD2C4]/60">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#FFB63F] px-8 py-3.5 text-xs sm:text-sm font-bold text-[#080C35] hover:bg-[#EAA329] transition-all transform hover:scale-105 active:scale-100 shadow-md cursor-pointer"
            >
              <span>SOLICITAR INSCRIÇÃO NA VIVÊNCIA</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

