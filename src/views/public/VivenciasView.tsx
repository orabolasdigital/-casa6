/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /vivencias
 * Imersão Vivencial Oficial: Curando os Ciclos
 */

import React from 'react';
import { MapPin, Calendar, ArrowRight, Sparkles, HeartHandshake } from 'lucide-react';
import { OFFICIAL_EXPERIENCES } from '../../config/site';

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
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl bg-[#FCFAF7] border border-[#DAD2C4] overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12">
          {/* Carta de Tarot Gigante em Destaque */}
          <div className="lg:col-span-5 relative min-h-[380px] overflow-hidden border-b lg:border-b-0 lg:border-r border-[#DAD2C4]">
            <img
              src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80"
              alt="Vivência Curando os Ciclos"
              className="w-full h-full object-cover protected-img"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080C35]/85 via-[#22205A]/40 to-transparent pointer-events-none" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="rounded-full bg-[#FFB63F] text-[#080C35] px-3 py-1 text-xs font-bold shadow">
                Inscrições Abertas
              </span>
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#FFB63F] font-semibold">
                IMERSÃO AUTORAL
              </span>
              <h3 className="font-heading text-2xl font-bold text-white">
                Curando os Ciclos
              </h3>
            </div>
          </div>

          {/* Conteúdo Detalhado */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#FFB63F] px-8 py-3.5 text-xs sm:text-sm font-bold text-[#080C35] hover:bg-[#EAA329] transition-all transform hover:scale-105 active:scale-100 shadow-md"
              >
                <span>QUERO PARTICIPAR DA VIVÊNCIA</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
