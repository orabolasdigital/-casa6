/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /atendimentos
 * Produtos Oficiais de Atendimentos Astrológicos com Checkout Mercado Pago
 */

import React, { useState } from 'react';
import { Star, ShieldCheck, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { CATALOG_ATENDIMENTOS, AtendimentoProduct } from '../../services/catalogService';
import { MercadoPagoCheckoutModal } from '../../components/common/MercadoPagoCheckoutModal';

interface AtendimentosViewProps {
  onOpenBooking?: (serviceId?: string) => void;
}

export const AtendimentosView: React.FC<AtendimentosViewProps> = () => {
  const [selectedProduct, setSelectedProduct] = useState<AtendimentoProduct | null>(null);

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
          Consultas individuais personalizadas com Bianca Tofoli. Selecione o atendimento ideal para o seu momento e conclua com pagamento seguro via Mercado Pago (Pix ou Cartão em até 12x).
        </p>
      </div>

      {/* Grid Oficial dos 4 Atendimentos */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {CATALOG_ATENDIMENTOS.map((item) => (
          <div
            key={item.id}
            className="bg-[#FCFAF7] rounded-sm border border-[#DAD2C4] shadow-md hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden"
          >
            {/* Imagem / Logo Oficial do Atendimento */}
            <div className="relative w-full h-56 sm:h-64 bg-[#2B2566]/5 overflow-hidden flex items-center justify-center p-4 border-b border-[#DAD2C4]">
              <img
                src={item.image}
                alt={item.title}
                className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-3 right-3 bg-[#1b1463] text-[#F0B55E] px-3 py-1 rounded-sm text-xs font-bold font-sans">
                {item.priceFormatted}
              </div>
            </div>

            {/* Conteúdo Descritivo Exato */}
            <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between font-sans">
              <div className="space-y-3">
                <h2 className="font-heading text-2xl font-bold text-[#1b1463] leading-snug">
                  {item.title}
                </h2>
                
                <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed">
                  {item.description}
                </p>

                {/* Opções específicas (ex: Pronto Socorro) */}
                {item.options && (
                  <div className="space-y-2 pt-2 border-t border-[#DAD2C4]/60">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#1b1463]">
                      Nesta modalidade, você pode escolher:
                    </p>
                    <ul className="space-y-1.5 text-xs text-[#534D6B]">
                      {item.options.map((opt, oIdx) => (
                        <li key={oIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#F0B55E] shrink-0 mt-0.5" />
                          <span>{opt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recursos / Detalhes */}
                {item.features && (
                  <div className="space-y-1.5 pt-2 border-t border-[#DAD2C4]/60">
                    <ul className="space-y-1 text-xs text-[#534D6B]">
                      {item.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#25D366] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bloco de Preço & CTA */}
              <div className="pt-6 border-t border-[#DAD2C4] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C987F] block">
                    VALOR DO INVESTIMENTO
                  </span>
                  <span className="font-heading text-2xl font-extrabold text-[#1b1463]">
                    {item.priceFormatted}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProduct(item)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-sm bg-[#1b1463] hover:bg-[#2B2566] text-[#F0B55E] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>CONTRATAR COM MERCADO PAGO</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Selo de Garantia e Pagamento Seguro */}
      <div className="max-w-4xl mx-auto rounded-sm bg-[#FCFAF7] border border-[#DAD2C4] p-5 text-center flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#534D6B] font-sans">
        <ShieldCheck className="h-5 w-5 text-[#25D366] shrink-0" />
        <span>
          Ambiente seguro criptografado com tecnologia <strong>Mercado Pago Oficial</strong>. Pagamento via Pix imediato ou cartão de crédito parcelado em até 12x.
        </span>
      </div>

      {/* Modal de Pagamento Mercado Pago */}
      {selectedProduct && (
        <MercadoPagoCheckoutModal
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          serviceType="atendimento"
          itemTitle={selectedProduct.title}
          amount={selectedProduct.price}
          customerData={{
            firstName: '',
            lastName: '',
            email: '',
            whatsapp: ''
          }}
          onSuccess={() => {
            setSelectedProduct(null);
          }}
        />
      )}

    </div>
  );
};
