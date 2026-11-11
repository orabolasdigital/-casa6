/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /palestras
 * Catálogo Oficial de Palestras Corporativas e Workshops com Bianca Tofoli
 */

import React from 'react';
import { MessageCircle, Clock, Video, ArrowRight, ExternalLink } from 'lucide-react';
import { CATALOG_PALESTRAS } from '../../services/catalogService';

interface PalestrasViewProps {
  onOpenBooking: (serviceId?: string) => void;
}

export const PalestrasView: React.FC<PalestrasViewProps> = ({ onOpenBooking }) => {
  const handleWhatsAppAction = (palestraId: string) => {
    onOpenBooking(palestraId);
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
          PALESTRAS & WORKSHOPS CORPORATIVOS
        </span>
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#2B2566] tracking-tight">
          Palestras & Encontros
        </h1>
        <p className="text-sm sm:text-base text-[#423C7B] max-w-2xl mx-auto leading-relaxed font-normal">
          Experiências transformadoras conduzidas por Bianca Tofoli para empresas, convenções e congressos. Integrando autoconhecimento, inteligência relacional e regulação do estresse.
        </p>
      </div>

      {/* Grid Oficial das 4 Palestras */}
      <div className="max-w-6xl mx-auto space-y-10">
        {CATALOG_PALESTRAS.map((item) => (
          <div
            key={item.id}
            className="bg-[#FCFAF7] rounded-sm border border-[#DAD2C4] shadow-md hover:shadow-xl transition-all overflow-hidden grid grid-cols-1 lg:grid-cols-12"
          >
            {/* Imagem / Logo Oficial da Palestra */}
            <div className="lg:col-span-5 bg-[#2B2566]/5 p-6 sm:p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[#DAD2C4]">
              <img
                src={item.image}
                alt={item.title}
                className="max-h-72 w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Conteúdo Descritivo da Palestra */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-between font-sans">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DAD2C4]/60 pb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b1463] uppercase tracking-wider">
                    <Clock className="h-4 w-4 text-[#F0B55E]" />
                    <span>TEMPO: {item.duration}</span>
                  </span>
                  <span className="text-xs font-bold text-[#8C987F] uppercase tracking-wider">
                    VALOR: {item.priceText}
                  </span>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1b1463] leading-snug">
                  {item.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed">
                  {item.description}
                </p>

                {item.topics && item.topics.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#1b1463]">
                      O que será abordado?
                    </p>
                    <ul className="space-y-1.5 text-xs text-[#534D6B]">
                      {item.topics.map((topic, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <span className="text-[#F0B55E] font-bold">•</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Vídeos de Inspiração para "Vamos Montar Juntos?" */}
                {item.videoUrls && item.videoUrls.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#DAD2C4]/60">
                    <p className="text-xs font-bold text-[#1b1463] flex items-center gap-1.5">
                      <Video className="h-4 w-4 text-[#C2593F]" />
                      <span>Veja alguns vídeos com temas para te inspirar:</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {item.videoUrls.map((url, vIdx) => (
                        <a
                          key={vIdx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[#1b1463] hover:text-[#C2593F] transition-colors p-2 rounded-sm bg-white border border-[#DAD2C4] hover:border-[#C2593F]"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-[#C2593F] shrink-0" />
                          <span className="truncate">Vídeo {vIdx + 1}: {url.replace('https://', '')}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botão CTA direcionando para WhatsApp */}
              <div className="pt-4 border-t border-[#DAD2C4] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#8C987F]">
                  Atendimento corporativo customizado via WhatsApp oficial.
                </div>

                <button
                  type="button"
                  onClick={() => handleWhatsAppAction(item.id)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-sm bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <MessageCircle className="h-4 w-4 fill-white" />
                  <span>SOLICITAR PROPOSTA VIA WHATSAPP</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
