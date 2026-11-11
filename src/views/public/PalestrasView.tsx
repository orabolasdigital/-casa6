/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /palestras
 * Palestras Oficiais, Capacitação NR-1 (Riscos Psicossociais e Saúde Mental) & Cartas de Tarô
 */

import React from 'react';
import { ShieldCheck, CheckCircle, ArrowRight, Building } from 'lucide-react';
import { OFFICIAL_LECTURES } from '../../config/site';
import { TarotCard } from '../../components/common/TarotCard';

interface PalestrasViewProps {
  onOpenBooking: (serviceId?: string) => void;
}

export const PalestrasView: React.FC<PalestrasViewProps> = ({ onOpenBooking }) => {
  return (
    <div className="bg-[#d8d6c8] text-[#1b1463] min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header Institucional */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C2593F]">
          PALESTRAS & WORKSHOPS CORPORATIVOS
        </span>
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#2B2566] tracking-tight">
          Palestras com Bianca Tofoli
        </h1>
        <p className="text-sm sm:text-base text-[#423C7B] max-w-2xl mx-auto leading-relaxed font-normal">
          Experiências transformadoras desenhadas para empresas, convenções, retiros e congressos. Integrando inteligência relacional, regulação do estresse e conformidade com a saúde mental no ambiente de trabalho.
        </p>
      </div>

      {/* =========================================================================
          DESTAQUE OBRIGATÓRIO: BIANCA TOFOLI & CAPACITAÇÃO NA NR-1 CORPORATIVA
          ========================================================================= */}
      <div className="max-w-5xl mx-auto bg-[#FFFFFF] rounded-3xl border-2 border-[#C2593F]/50 shadow-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Foto e Badge da Palestrante */}
        <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
          <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-[#C2593F] shadow-xl">
            <img
              src="https://static.wixstatic.com/media/02c8e0_defbbc681ee8458ba9a2f91f33f4e6da~mv2.jpg"
              alt="Bianca Tofoli — Palestrante Corporativa"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-[#2B2566]">Bianca Tofoli</h3>
            <p className="text-xs text-[#C2593F] font-bold uppercase tracking-wider">
              Palestrante & Especialista em Bem-Estar
            </p>
          </div>
        </div>

        {/* Conteúdo Institucional NR-1 */}
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C2593F] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
            <ShieldCheck className="h-4 w-4 text-white" />
            <span>CONFORMIDADE REGULATÓRIA • NORMA NR-1</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2B2566] leading-snug">
            Capacitada para Atuar nas Diretrizes da Norma Regulamentadora NR-1
          </h2>

          <p className="text-xs sm:text-sm text-[#372B69] leading-relaxed">
            A <strong>NR-1 (Gerenciamento de Riscos Ocupacionais - GRO)</strong> passou a exigir atenção mandatória aos <strong>riscos psicossociais</strong>, saúde mental e qualidade do clima organizacional. Bianca Tofoli conduz palestras e workshops desenhados para apoiar departamentos de Recursos Humanos e lideranças executivas na conscientização, prevenção da Síndrome de Burnout e fortalecimento do cuidado mútuo nas equipes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#1b1463] pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#25D366] shrink-0" />
              <span>Gestão do estresse e pausa consciente</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#25D366] shrink-0" />
              <span>Saúde mental e prevenção ao Burnout</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#25D366] shrink-0" />
              <span>Inteligência relacional e empatia ativa</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#25D366] shrink-0" />
              <span>Relatório de impacto corporativo pós-evento</span>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={() => onOpenBooking('palestra-nr1-corporativa')}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#fab03b] hover:bg-[#e59e2e] text-[#1b1463] font-extrabold px-8 py-3.5 text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Building className="h-4 w-4" />
              <span>CONTRATAR PALESTRA CORPORATIVA NR-1 VIA WHATSAPP</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Grid Oficial das 4 Palestras */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="border-b border-[#c7c5b6] pb-3 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-[#1b1463]">
            Catálogo Oficial de Temas
          </h2>
          <span className="text-xs text-[#6a62b8] font-bold uppercase tracking-wider">
            Formatos Presenciais e Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {OFFICIAL_LECTURES.map((lecture, index) => (
            <div key={lecture.id} className="w-full">
              <TarotCard
                index={index}
                totalInGroup={4}
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
                actionLabel="CONTRATAR VIA WHATSAPP"
                onAction={() => onOpenBooking(lecture.id)}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
