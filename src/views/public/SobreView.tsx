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
                  src="https://static.wixstatic.com/media/02c8e0_63e97f88890846189f1b1042d3ce08c1~mv2.jpeg"
                  alt="Bianca Tofoli"
                  className="w-full h-full object-cover protected-img"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6a62b8]">
              BIOGRAFIA & PROPÓSITO
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[#2B2566] tracking-tight">
              Bianca Tofoli
            </h1>
            <p className="text-sm sm:text-base text-[#423C7B] leading-relaxed">
              Sou Bianca Tofoli, enfermeira formada pela UNESP - Botucatu, com mais de 10 anos de experiência em gestão de saúde e liderança de equipes, chegando a coordenar nove unidades de atendimento em SP. Em 2021, segui um novo chamado e fiz minha transição de carreira para a astrologia, trazendo comigo o propósito de continuar cuidando de pessoas — agora, de um jeito diferente.
            </p>
            <div className="pt-2 pl-4 border-l-2 border-[#F0B55E] text-left">
              <p className="font-highlight italic text-base sm:text-lg text-[#2B2566]">
                “Para mim, tudo tem rachaduras — mas é por elas que entra a luz, se assim permitirmos!”
              </p>
            </div>
          </div>
        </div>

        {/* Pilares */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1b1463]">
              Pilares
            </h2>
            <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed">
              Acreditamos que compreender a si mesmo é o primeiro passo para transformar sua vida. Quando você entende seus ciclos, padrões e potencialidades, é capaz de fazer escolhas mais alinhadas com o seu propósito e desenvolver relações mais saudáveis consigo e com os outros.
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-[#6a62b8]">
              Nosso trabalho é pautado em três pilares fundamentais:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FCFAF7] p-6 rounded-2xl border border-[#c7c5b6] shadow-sm space-y-2">
              <Sun className="h-6 w-6 text-[#fab03b]" />
              <h3 className="font-heading font-bold text-base text-[#1b1463]">Autoconhecimento</h3>
              <p className="text-xs text-[#372B69] leading-relaxed">
                Ferramentas para que você se compreenda melhor e use esse conhecimento no seu dia a dia.
              </p>
            </div>

            <div className="bg-[#FCFAF7] p-6 rounded-2xl border border-[#c7c5b6] shadow-sm space-y-2">
              <Moon className="h-6 w-6 text-[#6a62b8]" />
              <h3 className="font-heading font-bold text-base text-[#1b1463]">Equilíbrio</h3>
              <p className="text-xs text-[#372B69] leading-relaxed">
                Estratégias para harmonizar sua energia, rotina e relações.
              </p>
            </div>

            <div className="bg-[#FCFAF7] p-6 rounded-2xl border border-[#c7c5b6] shadow-sm space-y-2">
              <Sparkles className="h-6 w-6 text-[#fab03b]" />
              <h3 className="font-heading font-bold text-base text-[#1b1463]">Expansão</h3>
              <p className="text-xs text-[#372B69] leading-relaxed">
                Conhecimento aplicado para que você possa evoluir de forma contínua e consciente.
              </p>
            </div>
          </div>
        </div>

        {/* Seção Quem é Bianca e O que é a Casa 6 */}
        <section className="space-y-6 text-sm text-[#372B69] leading-relaxed">
          <div className="rounded-3xl bg-[#FCFAF7] p-8 border border-[#c7c5b6] shadow-sm space-y-4">
            <p>
              Acredito que a astrologia é uma poderosa ferramenta de autoconhecimento e transformação. Meu objetivo é integrá-la ao dia a dia das pessoas, na rotina, ajudando-as a encontrar mais equilíbrio e realização em suas carreiras, relacionamentos, saúde e bem-estar. Quero que cada pessoa descubra sua própria essência e viva de forma mais consciente e alinhada com seus propósitos.
            </p>
            <p className="font-medium text-[#1b1463]">
              A Casa 6 é a materialização desse propósito: um espaço onde você pode se compreender, alinhar sua energia e viver com mais autenticidade.
            </p>
          </div>

          <div className="rounded-3xl bg-[#FCFAF7] p-8 border border-[#c7c5b6] shadow-sm space-y-4">
            <h2 className="font-heading text-2xl font-bold text-[#1b1463]">
              A Casa 6
            </h2>
            <p>
              Nasceu com o propósito de promover o autoconhecimento, a expansão da consciência e o equilíbrio entre vida pessoal e profissional. Criamos um espaço seguro onde cada pessoa pode se reconectar consigo mesma e encontrar ferramentas para viver com mais clareza, propósito e bem-estar.
            </p>
            <p>
              Nosso trabalho é guiado pelo princípio de que o autoconhecimento é uma das chaves para uma vida mais harmoniosa. Unimos astrologia, terapias integrativas e consultorias personalizadas para oferecer suporte tanto no nível individual quanto no corporativo.
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
