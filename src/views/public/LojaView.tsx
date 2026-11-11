/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /lojinha & /loja
 * Lojinha Oficial com Box Semeadura, Coleção Ritos do Universo e Checkout Mercado Pago
 */

import React, { useState } from 'react';
import { Package, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { CATALOG_LOJINHA, LojinhaProduct } from '../../services/catalogService';
import { MercadoPagoCheckoutModal } from '../../components/common/MercadoPagoCheckoutModal';

interface LojaViewProps {
  onOpenBooking?: () => void;
}

export const LojaView: React.FC<LojaViewProps> = () => {
  const [selectedProduct, setSelectedProduct] = useState<LojinhaProduct | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const product = CATALOG_LOJINHA[0];

  const handleBuy = (item: LojinhaProduct) => {
    setSelectedProduct(item);
    setCheckoutOpen(true);
  };

  return (
    <div className="bg-[#F4EFE6] text-[#2B2566] min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Institucional */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="flex justify-center pb-1">
            <img
              src="https://static.wixstatic.com/media/02c8e0_75b529b0748c4e54adf4e58bfa7c78dc~mv2.png"
              alt="Casa 6"
              className="h-10 w-auto object-contain"
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F]">
            LOJINHA OFICIAL CASA 6 • RITUAIS & OBJETOS
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#2B2566] tracking-tight">
            Lojinha Casa 6
          </h1>
          <p className="text-sm sm:text-base text-[#423C7B] leading-relaxed">
            Curadorias rituais e amuletos desenhados para materializar os ciclos astrológicos na sua rotina com sensibilidade e presença.
          </p>
        </div>

        {/* Card Destaque: Box SEMEADURA */}
        <div className="bg-[#FCFAF7] rounded-sm border border-[#DAD2C4] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 font-sans">
          
          {/* Imagem Oficial da Box */}
          <div className="lg:col-span-6 bg-[#2B2566]/5 relative flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[#DAD2C4] p-6 sm:p-10">
            <div className="relative w-full aspect-4/3 rounded-sm overflow-hidden shadow-lg border border-[#DAD2C4] bg-white">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <span className="absolute top-3 left-3 bg-[#1b1463] text-[#F0B55E] text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                EDIÇÃO LIMITADA
              </span>
            </div>
          </div>

          {/* Detalhamento Completo da Box */}
          <div className="lg:col-span-6 p-6 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C2593F] block">
                  {product.collectionName}
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1b1463] tracking-tight">
                  {product.title}
                </h2>
                <div className="font-heading text-3xl font-extrabold text-[#1b1463] pt-1">
                  {product.priceFormatted}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed">
                {product.description}
              </p>

              {/* Coleção Ritos do Universo */}
              <div className="bg-white p-4 rounded-sm border border-[#DAD2C4] space-y-1.5 text-xs text-[#534D6B]">
                <p className="font-bold text-[#1b1463] uppercase tracking-wider text-[11px]">
                  Sobre a {product.collectionName}:
                </p>
                <p className="leading-relaxed">
                  {product.collectionDescription}
                </p>
              </div>

              {/* Conteúdo da Box */}
              <div className="space-y-2 pt-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#1b1463] flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-[#F0B55E]" />
                  <span>CONTEÚDO DA BOX:</span>
                </p>
                <ul className="space-y-1.5 text-xs text-[#534D6B]">
                  {product.boxItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#25D366] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Ação de Compra */}
            <div className="pt-6 border-t border-[#DAD2C4] space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#8C987F]">
                <Truck className="h-4 w-4 text-[#1b1463]" />
                <span>Envio para todo o Brasil com cálculo de frete por CEP na próxima etapa.</span>
              </div>

              <button
                type="button"
                onClick={() => handleBuy(product)}
                className="w-full flex items-center justify-center gap-2.5 rounded-sm bg-[#1b1463] hover:bg-[#2B2566] text-[#F0B55E] py-4 px-8 text-sm font-extrabold uppercase tracking-wider shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="h-4 w-4 text-[#F0B55E]" />
                <span>COMPRAR BOX SEMEADURA ({product.priceFormatted})</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Garantia e Informações de Entrega */}
        <div className="rounded-sm bg-[#FCFAF7] border border-[#DAD2C4] p-5 text-center flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#534D6B] font-sans">
          <ShieldCheck className="h-5 w-5 text-[#25D366] shrink-0" />
          <span>
            Compra 100% segura com <strong>Mercado Pago Oficial</strong>. Coleta de endereço com preenchimento automático por CEP e código de rastreamento enviado por e-mail e WhatsApp.
          </span>
        </div>

      </div>

      {/* Modal de Checkout Mercado Pago */}
      {selectedProduct && (
        <MercadoPagoCheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          serviceType="loja"
          itemTitle={`${selectedProduct.title} — ${selectedProduct.collectionName}`}
          amount={selectedProduct.price}
          customerData={{
            firstName: '',
            lastName: '',
            email: '',
            whatsapp: ''
          }}
          onSuccess={() => {
            setCheckoutOpen(false);
          }}
        />
      )}
    </div>
  );
};
