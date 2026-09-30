/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /atendimentos
 * Catálogo Oficial estruturado em Contínuo, Únicos e Combos
 * com cartas de tarô autênticas em proporção vertical 5:8
 */

import React, { useState } from 'react';
import { Calendar, ArrowRight, Clock, Star, Layers } from 'lucide-react';
import { OFFICIAL_SERVICES } from '../../config/site';
import { TarotCard } from '../../components/common/TarotCard';

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
        <p className="text-sm sm:text-base text-[#534D6B] max-w-2xl mx-auto leading-relaxed font-normal">
          Um espaço seguro de acolhimento, escuta atenta e mapeamento lúcido dos seus ciclos para iluminar decisões e trazer propósito à sua vida. Apresentados em cartas de tarô editoriais colecionáveis.
        </p>

        {/* Filtros Rápidos */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'todos'
                ? 'bg-[#22205A] text-[#FFB63F] shadow-sm'
                : 'bg-[#FCFAF7] text-[#534D6B] border border-[#DAD2C4] hover:border-[#22205A]'
            }`}
          >
            Todos os Atendimentos
          </button>
          <button
            onClick={() => setActiveTab('continuo')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'continuo'
                ? 'bg-[#22205A] text-[#FFB63F] shadow-sm'
                : 'bg-[#FCFAF7] text-[#534D6B] border border-[#DAD2C4] hover:border-[#22205A]'
            }`}
          >
            Contínuo
          </button>
          <button
            onClick={() => setActiveTab('unicos')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'unicos'
                ? 'bg-[#22205A] text-[#FFB63F] shadow-sm'
                : 'bg-[#FCFAF7] text-[#534D6B] border border-[#DAD2C4] hover:border-[#22205A]'
            }`}
          >
            Únicos
          </button>
          <button
            onClick={() => setActiveTab('combos')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-3xl mx-auto lg:mx-0">
              {continuoServices.map((service, idx) => (
                <div key={service.id} className="w-full max-w-[340px] mx-auto">
                  <TarotCard
                    romanNumeral={idx === 0 ? 'I' : 'II'}
                    categoryBadge={service.badge || 'CONTÍNUO'}
                    title={service.title}
                    subtitle={service.shortDescription}
                    imageUrl={service.tarotImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'}
                    actionLabel="AGENDAR CONSULTA"
                    onAction={() => onOpenBooking(service.id)}
                  />
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
              <span className="text-xs text-[#6F4D84] font-medium">• Mapa Natal, Planejamento Astral e Mapa Revolução Solar</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {unicosServices.map((service, idx) => (
                <div key={service.id} className="w-full max-w-[340px] mx-auto">
                  <TarotCard
                    romanNumeral={idx === 0 ? 'III' : idx === 1 ? 'IV' : 'V'}
                    categoryBadge={service.badge || 'ÚNICO'}
                    title={service.title}
                    subtitle={service.shortDescription}
                    imageUrl={service.tarotImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'}
                    actionLabel="AGENDAR CONSULTA"
                    onAction={() => onOpenBooking(service.id)}
                  />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-3xl mx-auto lg:mx-0">
              {combosServices.map((service, idx) => (
                <div key={service.id} className="w-full max-w-[340px] mx-auto">
                  <TarotCard
                    romanNumeral={idx === 0 ? 'VI' : 'VII'}
                    categoryBadge={service.badge || 'COMBO'}
                    title={service.title}
                    subtitle={service.shortDescription}
                    imageUrl={service.tarotImage || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'}
                    actionLabel="AGENDAR COMBO"
                    onAction={() => onOpenBooking(service.id)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

