/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /patota
 * Patota Astral — Comunidade e Assinatura Recorrente
 */

import React from 'react';
import { Sparkles, Calendar, Check, Users, MessageCircle, Moon, ArrowRight, ShieldCheck } from 'lucide-react';

interface PatotaAstralViewProps {
  onOpenBooking: (serviceId?: string) => void;
}

export const PatotaAstralView: React.FC<PatotaAstralViewProps> = ({ onOpenBooking }) => {
  const benefits = [
    'Encontros mensais ao vivo com Bianca Tofoli (análise aprofundada dos céus do mês)',
    'Acompanhamento de Lunações: Lua Nova e Lua Cheia aplicadas à vida prática',
    'Canal fechado e acolhedor de trocas, estudos e partilhas entre membros',
    'Acesso a gravações completas de todos os encontros anteriores e cadernos astrológicos',
    'Condições especiais exclusivas em vivências presenciais e consultas individuais da Casa 6'
  ];

  return (
    <div className="bg-[#F3EEE5] text-[#211D35] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-14">
      {/* Header Institucional */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#372B69] px-4 py-1.5 text-xs font-bold text-[#FFB63F] border border-[#FFB63F]/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>COMUNIDADE OFICIAL DA CASA 6</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#22205A] tracking-tight">
          Patota Astral — Assinatura
        </h1>
        <p className="text-sm sm:text-base text-[#534D6B] max-w-2xl mx-auto leading-relaxed">
          O aprendizado contínuo da astrologia vivenciado em grupo. Um círculo vivo de estudos para acompanhar os trânsitos cósmicos sem misticismo vazio e com muita conexão com a sua rotina real.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Pilares */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2 p-5 rounded-2xl bg-[#FCFAF7] border border-[#DAD2C4]">
            <Moon className="h-6 w-6 text-[#372B69] mx-auto" />
            <h3 className="font-heading font-bold text-[#22205A] text-sm">Ciclos Lunares</h3>
            <p className="text-xs text-[#534D6B]">Trabalhe a intenção das luas novas e a colheita dos plenilúnios.</p>
          </div>
          <div className="space-y-2 p-5 rounded-2xl bg-[#FCFAF7] border border-[#DAD2C4]">
            <Users className="h-6 w-6 text-[#372B69] mx-auto" />
            <h3 className="font-heading font-bold text-[#22205A] text-sm">Círculo Íntimo</h3>
            <p className="text-xs text-[#534D6B]">Trocas humanas acolhedoras entre pessoas com o mesmo anseio de evolução.</p>
          </div>
          <div className="space-y-2 p-5 rounded-2xl bg-[#FCFAF7] border border-[#DAD2C4]">
            <MessageCircle className="h-6 w-6 text-[#372B69] mx-auto" />
            <h3 className="font-heading font-bold text-[#22205A] text-sm">Acesso Direto</h3>
            <p className="text-xs text-[#534D6B]">Orientação próxima e humana de Bianca Tofoli mês a mês.</p>
          </div>
        </div>

        {/* Card do Plano de Assinatura */}
        <div className="rounded-3xl bg-[#FCFAF7] border border-[#DAD2C4] p-8 sm:p-12 shadow-sm space-y-8">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F4D84]">
              PLANOS & ACESSO CONTÍNUO
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#22205A]">
              O que você recebe ao assinar a Patota:
            </h2>
            <ul className="space-y-3 pt-2">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#534D6B]">
                  <div className="mt-0.5 rounded-full bg-[#FFB63F]/20 p-1 text-[#22205A] shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#080C35] via-[#22205A] to-[#372B69] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#22205A]">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFB63F]">
                ASSINATURA ASTRAL
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                Participe do Próximo Encontro da Patota
              </h3>
              <p className="text-xs text-[#DAD2C4]">
                Acesso imediato ao grupo exclusivo e aos cadernos de lunação vigentes.
              </p>
            </div>

            <button
              onClick={() => onOpenBooking('patota-astral-comunidade')}
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#FFB63F] px-8 py-3.5 text-xs sm:text-sm font-bold text-[#080C35] hover:bg-[#EAA329] transition-all transform hover:scale-105 active:scale-100 shadow-md cursor-pointer"
            >
              <span>ASSINAR A PATOTA ASTRAL</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
