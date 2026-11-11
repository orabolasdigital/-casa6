/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /sobre
 * Sobre Bianca Tofoli & Casa 6 (Estrutura Fiel ao Print com os 3 Pilares)
 */

import React from 'react';
import { Sun, Moon, Sparkles, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

interface SobreViewProps {
  onOpenBooking: () => void;
}

export const SobreView: React.FC<SobreViewProps> = ({ onOpenBooking }) => {
  return (
    <div className="bg-[#d8d6c8] text-[#1b1463] min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="mx-auto max-w-5xl space-y-14">
        
        {/* Header e Foto com Órbitas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 sm:w-80 aspect-square">
              <div className="absolute inset-0 rounded-full border border-[#fab03b] -rotate-12 scale-110 pointer-events-none"></div>
              <div className="absolute inset-0 rounded-full border border-[#c7c5b6] rotate-45 scale-105 pointer-events-none"></div>
              <div className="absolute -top-3 -left-3 text-[#fab03b] text-2xl font-heading">✦</div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-[#fab03b]"></div>

              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://static.wixstatic.com/media/02c8e0_defbbc681ee8458ba9a2f91f33f4e6da~mv2.jpg"
                  alt="Bianca Tofoli"
                  className="w-full h-full object-cover protected-img"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6a62b8]">
              BIOGRAFIA & FILOSOFIA
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[#2B2566] tracking-tight">
              Bianca Tofoli & Casa 6
            </h1>
            <p className="text-sm sm:text-base text-[#423C7B] leading-relaxed">
              Uma prática astrológica contemporânea, lúcida e voltada para a compreensão dos ciclos humanos reais.
            </p>
            <div className="pt-2 pl-4 border-l-2 border-[#F0B55E] text-left">
              <p className="font-highlight italic text-base sm:text-lg text-[#2B2566]">
                “A astrologia não serve para adivinhar futuros fictícios, mas para nos recordar da grandeza lúcida de quem já somos.”
              </p>
            </div>
          </div>
        </div>

        {/* Os 3 Pilares Oficiais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FCFAF7] p-6 rounded-2xl border border-[#c7c5b6] shadow-sm space-y-2">
            <Sun className="h-6 w-6 text-[#fab03b]" />
            <h3 className="font-heading font-bold text-base text-[#1b1463]">Autoconhecimento</h3>
            <p className="text-xs text-[#372B69] leading-relaxed">
              Mapeamento do mapa natal, desarmando armadilhas inconscientes e ativando talentos natos com autonomia.
            </p>
          </div>

          <div className="bg-[#FCFAF7] p-6 rounded-2xl border border-[#c7c5b6] shadow-sm space-y-2">
            <Moon className="h-6 w-6 text-[#6a62b8]" />
            <h3 className="font-heading font-bold text-base text-[#1b1463]">Equilíbrio</h3>
            <p className="text-xs text-[#372B69] leading-relaxed">
              Harmonia entre o corpo físico, a respiração e os trânsitos cósmicos de cada fase da lua.
            </p>
          </div>

          <div className="bg-[#FCFAF7] p-6 rounded-2xl border border-[#c7c5b6] shadow-sm space-y-2">
            <Sparkles className="h-6 w-6 text-[#fab03b]" />
            <h3 className="font-heading font-bold text-base text-[#1b1463]">Expansão</h3>
            <p className="text-xs text-[#372B69] leading-relaxed">
              Planejamento astral e coragem para fazer transições de carreira e relacionamentos lúcidos.
            </p>
          </div>
        </div>

        {/* Seção Quem é Bianca e O que é a Casa 6 */}
        <section className="space-y-6 text-sm text-[#372B69] leading-relaxed">
          <div className="rounded-3xl bg-[#FCFAF7] p-8 border border-[#c7c5b6] shadow-sm space-y-3">
            <h2 className="font-heading text-2xl font-bold text-[#1b1463]">
              Quem é Bianca Tofoli?
            </h2>
            <p>
              <strong className="text-[#1b1463]">Bianca Tofoli</strong> é astróloga, pesquisadora e fundadora da{' '}
              <strong className="text-[#1b1463]">Casa 6</strong>. Com sólida formação em astrologia psicológica e simbologia arquetípica, Bianca desenvolve uma leitura de mapa que une a precisão dos cálculos celestes à sensibilidade humana acolhedora.
            </p>
            <p>
              Além de consultas individuais, Bianca conduz workshops corporativos em consonância com a Norma Regulamentadora NR-1, mentorias contínuas na comunidade Patota Astral e vivências imersivas no Brasil.
            </p>
          </div>

          <div className="rounded-3xl bg-[#1b1463] text-white p-8 border border-[#fab03b] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#fab03b]">
                ATENDIMENTO ONLINE GLOBAL
              </span>
              <h3 className="font-heading text-2xl font-bold">
                Agende sua Consulta com Bianca Tofoli
              </h3>
              <p className="text-xs text-[#d8d6c8]">
                Sessões individuais personalizadas via Google Meet ou presencial em São Paulo.
              </p>
            </div>

            <button
              onClick={onOpenBooking}
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#fab03b] hover:bg-[#e59e2e] text-[#1b1463] font-bold py-3.5 px-8 text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 active:scale-100 cursor-pointer"
            >
              <span>AGENDAR VIA WHATSAPP</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
