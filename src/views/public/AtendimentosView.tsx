/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /atendimentos
 * Catálogo Oficial estruturado em Contínuo, Únicos e Combos
 * com cartas de tarô viradas e Modal Profundo de Detalhamento para SEO e LLMs
 */

import React, { useState } from 'react';
import { Clock, Star, Layers } from 'lucide-react';
import { OFFICIAL_SERVICES } from '../../config/site';
import { FlipTarotCard } from '../../components/common/FlipTarotCard';
import { ServiceDetailModal } from '../../components/common/ServiceDetailModal';
import { ServiceItem } from '../../types';

interface AtendimentosViewProps {
  onOpenBooking: (serviceId?: string) => void;
}

export const AtendimentosView: React.FC<AtendimentosViewProps> = ({ onOpenBooking }) => {
  const [activeTab, setActiveTab] = useState<'todos' | 'continuo' | 'unicos' | 'combos'>('todos');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const continuoServices = OFFICIAL_SERVICES.filter((s) => s.categoryGroup === 'continuo');
  const unicosServices = OFFICIAL_SERVICES.filter((s) => s.categoryGroup === 'unicos');
  const combosServices = OFFICIAL_SERVICES.filter((s) => s.categoryGroup === 'combos');

  const handleCardClick = (service: ServiceItem) => {
    setSelectedService(service);
  };

  return (
    <div className="bg-[#F4EFE6] text-[#2B2566] min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header Institucional */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="flex justify-center pb-1">
          <img
            src="https://static.wixstatic.com/media/02c8e0_75b529b0748c4e54adf4e58bfa7c78dc~mv2.png"
            alt="Casa 6"
            className="h-10 w-auto object-contain"
          />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F]">
          CONSULTAS & ATENDIMENTOS ASTROLÓGICOS
        </span>
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#2B2566] tracking-tight">
          Nossos Atendimentos
        </h1>
        <p className="text-sm sm:text-base text-[#423C7B] max-w-2xl mx-auto leading-relaxed font-normal">
          Um espaço seguro de escuta acolhedora e mapeamento lúcido dos seus ciclos para iluminar decisões e trazer propósito à sua vida. Toque em qualquer carta para abrir o detalhamento completo.
        </p>

        {/* Filtros de Categoria */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'todos'
                ? 'bg-[#1b1463] text-[#fab03b] shadow-md'
                : 'bg-[#FCFAF7] text-[#372B69] border border-[#c7c5b6] hover:border-[#1b1463]'
            }`}
          >
            Todos os Atendimentos
          </button>
          <button
            onClick={() => setActiveTab('continuo')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'continuo'
                ? 'bg-[#1b1463] text-[#fab03b] shadow-md'
                : 'bg-[#FCFAF7] text-[#372B69] border border-[#c7c5b6] hover:border-[#1b1463]'
            }`}
          >
            Contínuo (2)
          </button>
          <button
            onClick={() => setActiveTab('unicos')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'unicos'
                ? 'bg-[#1b1463] text-[#fab03b] shadow-md'
                : 'bg-[#FCFAF7] text-[#372B69] border border-[#c7c5b6] hover:border-[#1b1463]'
            }`}
          >
            Únicos (3)
          </button>
          <button
            onClick={() => setActiveTab('combos')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'combos'
                ? 'bg-[#1b1463] text-[#fab03b] shadow-md'
                : 'bg-[#FCFAF7] text-[#372B69] border border-[#c7c5b6] hover:border-[#1b1463]'
            }`}
          >
            Combos (2)
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* GRUPO 1: CONTÍNUO */}
        {(activeTab === 'todos' || activeTab === 'continuo') && (
          <section className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-[#c7c5b6] pb-3">
              <Clock className="h-5 w-5 text-[#fab03b]" />
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1b1463]">
                Atendimentos Contínuos
              </h2>
              <span className="text-xs text-[#6a62b8] font-bold uppercase tracking-wider">
                • Pronto Socorro & Acompanhamento
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl">
              {continuoServices.map((service, idx) => (
                <div key={service.id} className="w-full">
                  <FlipTarotCard
                    index={idx}
                    romanNumeral={idx === 0 ? 'I' : 'II'}
                    categoryBadge={service.badge || 'CONTÍNUO'}
                    title={service.title}
                    subtitle={service.shortDescription}
                    imageUrl={service.tarotImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'}
                    actionLabel="AGENDAR NO WHATSAPP"
                    onAction={() => onOpenBooking(service.id)}
                    onDetailClick={() => handleCardClick(service)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GRUPO 2: ÚNICOS */}
        {(activeTab === 'todos' || activeTab === 'unicos') && (
          <section className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-[#c7c5b6] pb-3">
              <Star className="h-5 w-5 text-[#fab03b]" />
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1b1463]">
                Atendimentos Únicos
              </h2>
              <span className="text-xs text-[#6a62b8] font-bold uppercase tracking-wider">
                • Mapa Natal, Planejamento & Revolução Solar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {unicosServices.map((service, idx) => (
                <div key={service.id} className="w-full">
                  <FlipTarotCard
                    index={idx}
                    romanNumeral={idx === 0 ? 'III' : idx === 1 ? 'IV' : 'V'}
                    categoryBadge={service.badge || 'ÚNICO'}
                    title={service.title}
                    subtitle={service.shortDescription}
                    imageUrl={service.tarotImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'}
                    actionLabel="AGENDAR NO WHATSAPP"
                    onAction={() => onOpenBooking(service.id)}
                    onDetailClick={() => handleCardClick(service)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GRUPO 3: COMBOS */}
        {(activeTab === 'todos' || activeTab === 'combos') && (
          <section className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-[#c7c5b6] pb-3">
              <Layers className="h-5 w-5 text-[#fab03b]" />
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1b1463]">
                Combos Exclusivos
              </h2>
              <span className="text-xs text-[#6a62b8] font-bold uppercase tracking-wider">
                • Jornadas Integradas & Terapias Sutis
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl">
              {combosServices.map((service, idx) => (
                <div key={service.id} className="w-full">
                  <FlipTarotCard
                    index={idx}
                    romanNumeral={idx === 0 ? 'VI' : 'VII'}
                    categoryBadge={service.badge || 'COMBO'}
                    title={service.title}
                    subtitle={service.shortDescription}
                    imageUrl={service.tarotImage || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'}
                    actionLabel="AGENDAR COMBO"
                    onAction={() => onOpenBooking(service.id)}
                    onDetailClick={() => handleCardClick(service)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Modal com Detalhamento Profundo para SEO e Indexação */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
        onBook={(serviceId) => {
          setSelectedService(null);
          onOpenBooking(serviceId);
        }}
      />

    </div>
  );
};
