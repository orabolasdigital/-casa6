/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /atendimentos
 * Catálogo Oficial estruturado em Contínuo, Únicos e Combos
 */

import React, { useState } from 'react';
import { Calendar, ArrowRight, Sparkles, Star, Layers, Clock, Zap } from 'lucide-react';
import { OFFICIAL_SERVICES } from '../../config/site';

interface AtendimentosViewProps {
  onOpenBooking: (serviceId?: string) => void;
}

export const AtendimentosView: React.FC<AtendimentosViewProps> = ({ onOpenBooking }) => {
  const [activeTab, setActiveTab] = useState<'todos' | 'continuo' | 'unicos' | 'combos'>('todos');

  const continuoServices = OFFICIAL_SERVICES.filter((s) => s.categoryGroup === 'continuo');
  const unicosServices = OFFICIAL_SERVICES.filter((s) => s.categoryGroup === 'unicos');
  const combosServices = OFFICIAL_SERVICES.filter((s) => s.categoryGroup === 'combos');

  return (
    <div className="bg-[#F3EEE5] text-[#211D35] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-14">
      {/* Header Institucional */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6F4D84]">
          CONSULTAS & ATENDIMENTOS ASTROLÓGICOS
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#22205A] tracking-tight">
          Nossos Atendimentos
        </h1>
        <p className="text-sm sm:text-base text-[#534D6B] max-w-2xl mx-auto leading-relaxed">
          Um espaço seguro de acolhimento, escuta atenta e mapeamento lúcido dos seus ciclos para iluminar decisões e trazer propósito à sua vida.
        </p>

        {/* Filtros Rápidos */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'todos'
                ? 'bg-[#22205A] text-[#FFB63F] shadow-sm'
                : 'bg-[#FCFAF7] text-[#534D6B] border border-[#DAD2C4] hover:border-[#22205A]'
            }`}
          >
            Todos os Atendimentos
          </button>
          <button
            onClick={() => setActiveTab('continuo')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'continuo'
                ? 'bg-[#22205A] text-[#FFB63F] shadow-sm'
                : 'bg-[#FCFAF7] text-[#534D6B] border border-[#DAD2C4] hover:border-[#22205A]'
            }`}
          >
            Contínuo
          </button>
          <button
            onClick={() => setActiveTab('unicos')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'unicos'
                ? 'bg-[#22205A] text-[#FFB63F] shadow-sm'
                : 'bg-[#FCFAF7] text-[#534D6B] border border-[#DAD2C4] hover:border-[#22205A]'
            }`}
          >
            Únicos
          </button>
          <button
            onClick={() => setActiveTab('combos')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'combos'
                ? 'bg-[#22205A] text-[#FFB63F] shadow-sm'
                : 'bg-[#FCFAF7] text-[#534D6B] border border-[#DAD2C4] hover:border-[#22205A]'
            }`}
          >
            Combos
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* GRUPO 1: CONTÍNUO */}
        {(activeTab === 'todos' || activeTab === 'continuo') && (
          <section className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-[#DAD2C4] pb-3">
              <Clock className="h-5 w-5 text-[#FFB63F]" />
              <h2 className="font-heading text-2xl font-bold text-[#22205A]">
                Contínuo
              </h2>
              <span className="text-xs text-[#6F4D84] font-medium">• Acompanhamento dinâmico & mensal</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {continuoServices.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl bg-[#FCFAF7] border border-[#DAD2C4] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
                    {/* Imagem estilo carta de tarot */}
                    <div className="relative w-32 sm:w-36 aspect-[3/4] rounded-xl overflow-hidden shadow-md shrink-0 border border-[#DAD2C4]/80">
                      <img
                        src={service.tarotImage}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 protected-img"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080C35]/70 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute top-2 left-2 text-[10px] text-[#FFB63F] font-heading">✦</span>
                    </div>

                    <div className="space-y-3 flex-1">
                      {service.badge && (
                        <span className="inline-block rounded-full bg-[#22205A] text-[#FFB63F] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          {service.badge}
                        </span>
                      )}
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#22205A] leading-snug">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#534D6B] leading-relaxed">
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-[#DAD2C4]/50 bg-[#FCFAF7]">
                    <button
                      onClick={() => onOpenBooking(service.id)}
                      className="w-full flex items-center justify-center gap-2 rounded-full bg-[#FFB63F] py-2.5 text-xs font-bold text-[#080C35] hover:bg-[#EAA329] transition-colors shadow-xs"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>AGENDAR ATENDIMENTO</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GRUPO 2: ÚNICOS */}
        {(activeTab === 'todos' || activeTab === 'unicos') && (
          <section className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-[#DAD2C4] pb-3">
              <Star className="h-5 w-5 text-[#FFB63F]" />
              <h2 className="font-heading text-2xl font-bold text-[#22205A]">
                Únicos
              </h2>
              <span className="text-xs text-[#6F4D84] font-medium">• Mapa Natal, Planejamento e Revolução Solar</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {unicosServices.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl bg-[#FCFAF7] border border-[#DAD2C4] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Imagem Carta de Tarot */}
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-[#DAD2C4]/80">
                      <img
                        src={service.tarotImage}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 protected-img"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080C35]/70 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute top-2 left-2 text-[10px] text-[#FFB63F] font-heading">✦</span>
                    </div>

                    <div className="space-y-2">
                      {service.badge && (
                        <span className="inline-block rounded-full bg-[#372B69] text-[#FFB63F] px-2.5 py-0.5 text-[10px] font-bold">
                          {service.badge}
                        </span>
                      )}
                      <h3 className="font-heading text-lg font-bold text-[#22205A] leading-snug">
                        {service.title}
                      </h3>
                      <p className="text-xs text-[#534D6B] leading-relaxed">
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <button
                      onClick={() => onOpenBooking(service.id)}
                      className="w-full flex items-center justify-center gap-2 rounded-full bg-[#FFB63F] py-2.5 text-xs font-bold text-[#080C35] hover:bg-[#EAA329] transition-colors shadow-xs"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>SOLICITAR AGENDAMENTO</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GRUPO 3: COMBOS */}
        {(activeTab === 'todos' || activeTab === 'combos') && (
          <section className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-[#DAD2C4] pb-3">
              <Layers className="h-5 w-5 text-[#FFB63F]" />
              <h2 className="font-heading text-2xl font-bold text-[#22205A]">
                Combos
              </h2>
              <span className="text-xs text-[#6F4D84] font-medium">• Jornadas integradas de autoconhecimento</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {combosServices.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl bg-[#FCFAF7] border border-[#DAD2C4] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
                    {/* Imagem estilo carta de tarot */}
                    <div className="relative w-32 sm:w-36 aspect-[3/4] rounded-xl overflow-hidden shadow-md shrink-0 border border-[#DAD2C4]/80">
                      <img
                        src={service.tarotImage}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 protected-img"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080C35]/70 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute top-2 left-2 text-[10px] text-[#FFB63F] font-heading">✦</span>
                    </div>

                    <div className="space-y-3 flex-1">
                      {service.badge && (
                        <span className="inline-block rounded-full bg-[#22205A] text-[#FFB63F] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          {service.badge}
                        </span>
                      )}
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#22205A] leading-snug">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#534D6B] leading-relaxed">
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-[#DAD2C4]/50 bg-[#FCFAF7]">
                    <button
                      onClick={() => onOpenBooking(service.id)}
                      className="w-full flex items-center justify-center gap-2 rounded-full bg-[#FFB63F] py-2.5 text-xs font-bold text-[#080C35] hover:bg-[#EAA329] transition-colors shadow-xs"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>AGENDAR COMBO</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
