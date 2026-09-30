/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: Sobre Bianca Tofoli & Casa 6 (Identidade Visual Oficial Atualizada)
 */

import React from 'react';
import { Calendar, Award, BookOpen, Compass } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

interface SobreViewProps {
  onOpenBooking: () => void;
}

export const SobreView: React.FC<SobreViewProps> = ({ onOpenBooking }) => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header Institucional */}
      <div className="space-y-4 text-center md:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6F4D84]">
          Biografia & Propósito
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#22205A]">
          Sobre Bianca Tofoli e a Casa 6
        </h1>
        <p className="text-base text-[#534D6B] leading-relaxed">
          Uma prática astrológica contemporânea, lúcida e voltada para a compreensão dos ciclos humanos reais.
        </p>
      </div>

      {/* Conteúdo Editorial Estruturado (GEO & E-E-A-T) */}
      <section className="space-y-6 text-sm sm:text-base text-[#534D6B] leading-relaxed">
        <div className="rounded-xl bg-[#FCFAF7] p-6 sm:p-8 border border-[#DAD2C4] shadow-xs space-y-4">
          <h2 className="font-heading text-xl font-bold text-[#22205A]">
            Quem é Bianca Tofoli?
          </h2>
          <p>
            <strong className="text-[#22205A]">Bianca Tofoli</strong> é astróloga, pesquisadora e fundadora da{' '}
            <strong className="text-[#22205A]">Casa 6</strong>. Dedicada ao estudo aprofundado do simbolismo celeste e dos ciclos biográficos, Bianca desenvolve uma leitura de mapa astral que conecta o rigor técnico tradicional à sensibilidade analítica contemporânea.
          </p>
          <p>
            Seu trabalho se diferencia pela recusa ao determinismo simplista: a astrologia praticada na Casa 6 é uma ferramenta de clareza, autonomia e discernimento prático, permitindo que cada indivíduo reconheça suas potências, compreenda seus tempos e faça escolhas alinhadas à sua própria natureza.
          </p>
        </div>

        <div className="rounded-xl bg-[#FCFAF7] p-6 sm:p-8 border border-[#DAD2C4] shadow-xs space-y-4">
          <h2 className="font-heading text-xl font-bold text-[#22205A]">
            O que representa a Casa 6?
          </h2>
          <p>
            Na tradição astrológica, a Casa 6 rege o cotidiano, a rotina, o corpo, o ofício e a arte de colocar em prática os talentos individuais. É a casa do aprimoramento contínuo, onde o invisível se torna visível na matéria.
          </p>
          <p>
            Inspirada por esse arquétipo, a Casa 6 nasceu para ser um espaço de acolhimento e aprendizado contínuo, englobando consultas individuais de Mapa Astral, a comunidade recorrente <em>Patota Astral</em>, vivências imersivas presenciais e produções autorais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="rounded-lg bg-[#FCFAF7] p-4 text-center space-y-1 border border-[#DAD2C4]">
            <Compass className="h-6 w-6 text-[#372B69] mx-auto" />
            <h3 className="font-heading font-bold text-[#22205A] text-sm">Consultas Individuais</h3>
            <p className="text-xs text-[#534D6B]">Leituras aprofundadas com Bianca Tofoli.</p>
          </div>
          <div className="rounded-lg bg-[#FCFAF7] p-4 text-center space-y-1 border border-[#DAD2C4]">
            <BookOpen className="h-6 w-6 text-[#372B69] mx-auto" />
            <h3 className="font-heading font-bold text-[#22205A] text-sm">Patota Astral</h3>
            <p className="text-xs text-[#534D6B]">Comunidade mensal de estudos e ciclos.</p>
          </div>
          <div className="rounded-lg bg-[#FCFAF7] p-4 text-center space-y-1 border border-[#DAD2C4]">
            <Award className="h-6 w-6 text-[#372B69] mx-auto" />
            <h3 className="font-heading font-bold text-[#22205A] text-sm">Vivências & Palestras</h3>
            <p className="text-xs text-[#534D6B]">Imersões e eventos corporativos.</p>
          </div>
        </div>
      </section>

      {/* Região e Como Contratar */}
      <section className="rounded-xl bg-[#22205A] p-6 sm:p-8 text-[#FFFFFF] space-y-4 border border-[#372B69] shadow-md">
        <h3 className="font-heading text-xl font-bold text-[#FFB63F]">
          Como contratar e região de atendimento
        </h3>
        <p className="text-sm text-[#DAD2C4] leading-relaxed">
          As consultas astrológicas com Bianca Tofoli são realizadas em formato online para clientes em todo o Brasil e no exterior, com gravações disponibilizadas com total confidencialidade. Vivências e eventos presenciais ocorrem em São Paulo e cidades parceiras.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onOpenBooking()}
            className="flex items-center gap-2 rounded bg-[#FFB63F] px-6 py-3 text-sm font-bold text-[#080C35] hover:bg-[#EAA329] transition-colors shadow"
          >
            <Calendar className="h-4 w-4" />
            <span>AGENDAR CONSULTA COM BIANCA</span>
          </button>
        </div>
      </section>
    </div>
  );
};
