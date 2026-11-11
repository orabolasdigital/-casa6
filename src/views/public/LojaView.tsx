/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /lojinha & /loja
 * Estrutura oficial idêntica ao print anexado com filtro lateral de preço e Checkout Mercado Pago
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MercadoPagoCheckoutModal } from '../../components/common/MercadoPagoCheckoutModal';

interface LojaViewProps {
  onOpenBooking: () => void;
}

export const LojaView: React.FC<LojaViewProps> = ({ onOpenBooking }) => {
  const [maxPriceFilter, setMaxPriceFilter] = useState(120);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const products = [
    {
      id: 'ps-astral-outubro-novembro',
      title: 'PS Astral — Outubro + Novembro',
      price: 97.0,
      priceFormatted: 'R$ 97,00',
      shipping: 'Frete',
      badge: null,
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'patota-astral-lojinha',
      title: 'PATOTA ASTRAL',
      price: 53.0,
      priceFormatted: 'R$ 53,00',
      shipping: 'Frete',
      badge: 'Assinatura',
      imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'bussula-guia-lojinha',
      title: 'BÚSSOLA GUIA (RELATÓRIO MENSAL)',
      price: 68.0,
      priceFormatted: 'R$ 68,00',
      shipping: 'Frete',
      badge: 'Novo',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const filteredProducts = products.filter((p) => p.price <= maxPriceFilter);

  const handleAddToCart = (product: any) => {
    setSelectedProduct(product);
    setCheckoutOpen(true);
  };

  return (
    <div className="bg-[#F4EFE6] text-[#2B2566] min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Container Principal em Grid (Sidebar Filtrar + Grade de Produtos) */}
        <div className="bg-[#FCFAF7] rounded-3xl border border-[#E2DCCF] shadow-xl p-6 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* =========================================================================
              COLUNA ESQUERDA: FILTRAR & SLIDER DE PREÇO (CONFORME PRINT OFICIAL)
              ========================================================================= */}
          <aside className="md:col-span-3 space-y-8 border-b md:border-b-0 md:border-r border-[#E2DCCF]/60 pb-8 md:pb-0 md:pr-8">
            <h2 className="font-heading text-2xl font-normal text-[#2B2566]">
              Filtrar
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-medium text-[#1b1463]">
                <span>Preço</span>
                <span>—</span>
              </div>

              {/* Slider de Preço */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="50"
                  max="120"
                  step="1"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full accent-[#1b1463] cursor-pointer"
                />

                <div className="flex items-center justify-between text-xs text-[#372B69]">
                  <span>R$ 53</span>
                  <span>Até R$ {maxPriceFilter}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* =========================================================================
              COLUNA DIREITA: GRADE DE PRODUTOS & PAGINAÇÃO (CONFORME PRINT OFICIAL)
              ========================================================================= */}
          <main className="md:col-span-9 space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="space-y-4 group">
                  
                  {/* Foto Quadrada com Badge */}
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-[#c7c5b6] shadow-xs bg-[#1b1463]">
                    {product.badge && (
                      <span className="absolute top-2 left-2 z-10 bg-[#d8d6c8] text-[#1b1463] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-xs">
                        {product.badge}
                      </span>
                    )}

                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 protected-img"
                      draggable={false}
                    />
                  </div>

                  {/* Informações: Título, Preço e Frete */}
                  <div className="space-y-1">
                    <h3 className="font-heading font-medium text-sm sm:text-base text-[#1b1463] leading-snug">
                      {product.title}
                    </h3>
                    <div className="w-6 h-0.5 bg-[#fab03b] my-1" />
                    <p className="text-sm font-bold text-[#f58220]">
                      {product.priceFormatted}
                    </p>
                    <p className="text-[11px] text-[#372B69]">
                      {product.shipping}
                    </p>
                  </div>

                  {/* Botão Oficial Laranja/Dourado: Adicionar ao carrinho */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-3 px-4 rounded-full bg-[#F0B55E] hover:bg-[#dfa247] text-[#2B2566] text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer transform active:scale-98"
                  >
                    Adicionar ao carrinho
                  </button>
                </div>
              ))}
            </div>

            {/* Paginação do Print: < 1 > */}
            <div className="flex items-center justify-center gap-4 text-xs text-[#372B69] pt-6 border-t border-[#c7c5b6]/40">
              <button aria-label="Página anterior" className="p-1 hover:text-[#1b1463] cursor-pointer">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-bold text-[#1b1463]">1</span>
              <button aria-label="Próxima página" className="p-1 hover:text-[#1b1463] cursor-pointer">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </main>

        </div>
      </div>

      {/* Modal de Checkout Mercado Pago */}
      {selectedProduct && (
        <MercadoPagoCheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          serviceType="loja"
          itemTitle={selectedProduct.title}
          amount={selectedProduct.price}
          customerData={{
            firstName: '',
            lastName: '',
            email: '',
            whatsapp: ''
          }}
          onSuccess={() => {
            // Sucesso gravado
          }}
        />
      )}
    </div>
  );
};
