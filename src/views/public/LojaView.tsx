/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /lojinha & /loja
 * Lojinha Oficial Casa 6 com Design Leve, Sofisticado e Formato E-commerce
 * 
 * Atualizações Recentes:
 * - Slideshow automático na imagem do Box Semeadura com transição suave entre as 9 fotos.
 * - Miniaturas clicáveis mantidas abaixo do slideshow para navegação manual.
 * - Removida a tag "1ª Edição" da imagem do Box Semeadura (mantida apenas a tag "Esgotado").
 * - Tag "Lote Esgotado" ao lado do preço em tom cinza suave (#8C987F / borda suave), sem vermelho agressivo.
 * - Botão "Avise-me quando chegar" discreto e elegante, com contorno suave e tipografia roxa (#2B2566).
 * - Tag "EM BREVE" nas outras 3 boxes mantida fixa (sem efeito de pulsação).
 * - Removida a palavra "Previsão" do preço (exibindo apenas "R$ 147,00").
 * - Tag "Próximo Lançamento" posicionada logo após o valor, alinhada com o mesmo padrão da tag "Lote Esgotado".
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Truck,
  MessageCircle,
  Bell,
  Clock,
  Star,
  Layers,
  Heart
} from 'lucide-react';
import { CATALOG_LOJINHA } from '../../services/catalogService';

interface LojaViewProps {
  onOpenBooking?: (serviceId?: string) => void;
}

/**
 * Componente utilitário para animação suave de subida ao rolar a página (como nuvens)
 */
const RevealOnScroll: React.FC<{
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}> = ({ children, delayMs = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-10 scale-[0.99]'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// 9 Fotos Oficiais do Box Semeadura fornecidas pelo usuário
const BOX_SEMEADURA_PHOTOS = [
  'https://static.wixstatic.com/media/02c8e0_ba9bbb820abf45ceaf08609f65cdd001~mv2.jpeg',
  'https://static.wixstatic.com/media/02c8e0_bffe59c202114da5976eac816b4d7f14~mv2.jpeg',
  'https://static.wixstatic.com/media/02c8e0_9dd6cf6b3ee04b91abaf08201cb06526~mv2.jpeg',
  'https://static.wixstatic.com/media/02c8e0_2086a601c1f7408bbd79045e0d8d7cfd~mv2.jpeg',
  'https://static.wixstatic.com/media/02c8e0_1f8e06ce84064aaca200e427d51066fc~mv2.jpeg',
  'https://static.wixstatic.com/media/02c8e0_e7e4c5ed222845cdac78fe934a92429b~mv2.jpeg',
  'https://static.wixstatic.com/media/02c8e0_7b018edeb5574a28bd5dc9093f2a0b7e~mv2.jpeg',
  'https://static.wixstatic.com/media/02c8e0_6dd7990883014184bb6c9bf76a7fbff2~mv2.jpeg',
  'https://static.wixstatic.com/media/02c8e0_44566d2ebbd841d9811abe172df16624~mv2.jpeg'
];

// Dados dos 4 Produtos Oficiais da Lojinha (Extensível para novos itens)
const STORE_PRODUCTS = [
  {
    id: 'box-semeadura',
    title: 'Box SEMEADURA',
    collectionName: 'COLEÇÃO RITOS DO UNIVERSO',
    collectionDescription: 'Feita para você despertar o seu florescer ASTRAL em uma jornada de crescimento e transformação. A Box Semeadura celebra a abertura do ano novo astrológico com itens curados para ritualizar intenções de renovação.',
    description: 'A box semeadura é um convite para você semear novos caminhos ritualizando a chegada do ano novo astrológico. Mais do que uma curadoria de produtos, é um portal de autoconhecimento e renovação.',
    status: 'sold_out',
    statusBadge: 'Esgotado',
    price: 147,
    priceFormatted: 'R$ 147,00',
    images: BOX_SEMEADURA_PHOTOS,
    boxItems: [
      '3 incensos de alecrim naturais (sem carvão);',
      '1 incensário artesanal de pedras naturais (citrino);',
      '2 mini velas laranjas para conexão solar;',
      '1 vela de proteção com sal grosso;',
      '1 kit prosperidade (pirita e citrino) com saquinho de organza;',
      '1 mini buquê ornamental de ervas;',
      '1 ebook sobre o ano novo astrológico e manual explicativo;',
      '1 playlist personalizada para acompanhar o seu ritual.'
    ]
  },
  {
    id: 'box-acolhimento',
    title: 'Box ACOLHIMENTO',
    collectionName: 'COLEÇÃO RITOS DO UNIVERSO',
    collectionDescription: 'O segundo capítulo da Coleção Ritos do Universo. Um mergulho no elemento Água e na energia lunar para nutrir emoções, fortalecer o autocuidado e acolher suas vulnerabilidades.',
    description: 'Um convite ao recolhimento e à nutrição da alma. Elementos aromáticos, infusões botânicas e rituais de restauração energética para acalmar a mente e honrar seus sentimentos mais profundos.',
    status: 'coming_soon',
    statusBadge: 'Em Breve',
    price: 147,
    priceFormatted: 'R$ 147,00',
    romanNumeral: 'II',
    teaserText: 'Em breve disponível na Lojinha Casa 6.',
    boxItems: [
      'Velas botânicas aromáticas com óleos essenciais relaxantes;',
      'Banho de ervas calmantes para purificação áurica;',
      'Cristal de quartzo rosa lapidado para ancoragem do afeto;',
      'Guia de rituais lunares de acolhimento e perdão;',
      'Acesso à meditação guiada de conexão com a criança interior.'
    ]
  },
  {
    id: 'box-crescimento',
    title: 'Box CRESCIMENTO',
    collectionName: 'COLEÇÃO RITOS DO UNIVERSO',
    collectionDescription: 'A terceira fase da colheita astrológica. Alinhada ao elemento Terra e Fogo, estimula o florescimento de planos, a fertilidade de novos projetos e a expansão de metas.',
    description: 'A energia da germinação e do desenvolvimento prático. Amuletos, essências revigorantes e ferramentas de planejamento astral para dar forma e firmeza às suas realizações na vida real.',
    status: 'coming_soon',
    statusBadge: 'Em Breve',
    price: 147,
    priceFormatted: 'R$ 147,00',
    romanNumeral: 'III',
    teaserText: 'Em preparação para o próximo ciclo astrológico.',
    boxItems: [
      'Incensos artesanais de canela e louro para atração e foco;',
      'Pedra pirita bruta para materialização de objetivos;',
      'Caderno de intenções e metas astrais;',
      'Essência botânica energizante para o ambiente de trabalho;',
      'Áudio explicativo sobre os trânsitos de expansão.'
    ]
  },
  {
    id: 'box-celebracao',
    title: 'Box CELEBRAÇÃO',
    collectionName: 'COLEÇÃO RITOS DO UNIVERSO',
    collectionDescription: 'A consagração e o encerramento do ciclo zodiacal. Rituais de gratidão pelas colheitas recebidas, limpeza de encerramento e celebração da própria trajetória.',
    description: 'A celebração da colheita e da plenitude. Uma curadoria especial para agradecer conquistas, harmonizar energias e selar com luz os aprendizados do ciclo que se completa.',
    status: 'coming_soon',
    statusBadge: 'Em Breve',
    price: 147,
    priceFormatted: 'R$ 147,00',
    romanNumeral: 'IV',
    teaserText: 'Edição comemorativa de final de ciclo.',
    boxItems: [
      'Vela dourada com essência festiva e brilho natural;',
      'Incenso de mirra e olíbano para consagração;',
      'Amuletos comemorativos da Casa 6;',
      'Manual de ritualização de gratidão e transição;',
      'Playlist especial de celebração astral.'
    ]
  }
];

export const LojaView: React.FC<LojaViewProps> = ({ onOpenBooking }) => {
  // Estado para foto ativa da galeria do Box Semeadura
  const [activeSemeaduraPhoto, setActiveSemeaduraPhoto] = useState<number>(0);

  // Slideshow automático transitando entre as fotos do Box Semeadura a cada 3.5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSemeaduraPhoto((prev) => (prev + 1) % BOX_SEMEADURA_PHOTOS.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  // Ação de WhatsApp para Notificação de Estoque / Lista de Espera
  const handleWhatsAppNotify = (productTitle: string, isSoldOut: boolean = false) => {
    if (onOpenBooking) {
      onOpenBooking(`lojinha-${productTitle.toLowerCase().replace(/\s+/g, '-')}`);
    } else {
      const message = isSoldOut
        ? `Olá Bianca! Gostaria de ser avisado(a) quando a ${productTitle} tiver novo estoque disponível na Lojinha Casa 6.`
        : `Olá Bianca! Gostaria de entrar na lista de espera para o lançamento da ${productTitle} na Lojinha Casa 6.`;
      const url = `https://wa.me/5511980295452?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="bg-[#FAF8F5] text-[#2B2566] min-h-screen py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden relative">
      
      {/* Elementos Cósmicos Decorativos Efémeros ao Fundo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-20 right-[-80px] w-96 h-96 rounded-full border border-[#F0B55E]/15 opacity-40 animate-celestial-orbit-slow" />
        <div className="absolute top-1/2 left-[-100px] w-[500px] h-[500px] rounded-full border border-[#8C987F]/10 opacity-50 animate-celestial-orbit-reverse" />
        <div className="absolute top-36 left-12 text-[#F0B55E]/40 text-xs animate-pulse">✦</div>
        <div className="absolute bottom-48 right-1/4 text-[#8C987F]/30 text-[10px]">★</div>
      </div>

      <div className="mx-auto max-w-5xl space-y-12 sm:space-y-16 relative z-10">
        
        {/* =========================================================================
            HEADER INSTITUCIONAL & E-COMMERCE (SEM LOGO, LEVE E SOFISTICADO)
            ========================================================================= */}
        <RevealOnScroll delayMs={50}>
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F] block">
              LOJINHA OFICIAL CASA 6 • RITUAIS & OBJETOS
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B2566] tracking-tight">
              Produtos Edição Limitada
            </h1>
            
            {/* Linha-Ponto do Brand Guide */}
            <div className="flex items-center justify-center gap-3 py-1">
              <span className="w-12 h-px bg-[#2B2566]/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]" />
              <span className="w-20 h-px bg-[#2B2566]/20" />
            </div>

            <p className="text-xs sm:text-sm md:text-[15px] text-[#423C7B] leading-relaxed font-normal">
              Curadorias rituais e amuletos desenhados para materializar os ciclos astrológicos na sua rotina com sensibilidade, presença e beleza.
            </p>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            LISTAGEM DOS 4 PRODUTOS: CARROSSEL NO MOBILE E EMPILHADOS NO DESKTOP
            ========================================================================= */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 scrollbar-none sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible sm:block sm:space-y-10">
          
          {/* ---------------------------------------------------------------------
              PRODUTO 1: BOX SEMEADURA (ESGOTADO / SLIDESHOW AUTOMÁTICO)
              --------------------------------------------------------------------- */}
          <RevealOnScroll delayMs={100} className="w-[86vw] sm:w-full shrink-0 snap-center sm:shrink flex flex-col">
            <div className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl lg:rounded-[32px] border border-[#EADBCC]/70 shadow-[0_16px_40px_rgba(43,37,102,0.04)] hover:shadow-[0_20px_50px_rgba(43,37,102,0.07)] transition-all duration-500 overflow-hidden p-6 sm:p-8 lg:p-10 h-full flex flex-col justify-between">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
                
                {/* Coluna da Imagem & Galeria de Miniaturas com Slideshow Automático */}
                <div className="lg:col-span-6 space-y-3">
                  {/* Foto Principal com Slideshow Automático e Crossfade Suave */}
                  <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border border-[#EADBCC]/60 bg-black/5 shadow-sm group">
                    {BOX_SEMEADURA_PHOTOS.map((photoUrl, pIdx) => (
                      <img
                        key={pIdx}
                        src={photoUrl}
                        alt={`Box SEMEADURA — Foto ${pIdx + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                          activeSemeaduraPhoto === pIdx
                            ? 'opacity-100 z-1 scale-100'
                            : 'opacity-0 z-0 scale-102 pointer-events-none'
                        }`}
                      />
                    ))}
                    
                    {/* Tag Esgotado em Destaque (Única tag mantida em cima da imagem) */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#8C987F] text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      <span>ESGOTADO</span>
                    </div>

                    <div className="absolute bottom-2 right-2 z-10 px-2 py-0.5 rounded-md bg-black/50 text-white text-[10px] backdrop-blur-xs">
                      Foto {activeSemeaduraPhoto + 1} de {BOX_SEMEADURA_PHOTOS.length}
                    </div>
                  </div>

                  {/* Grid de Miniaturas Clicáveis Mantidas Abaixo (9 fotos) */}
                  <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
                    {BOX_SEMEADURA_PHOTOS.map((thumbUrl, tIdx) => (
                      <button
                        key={tIdx}
                        type="button"
                        onClick={() => setActiveSemeaduraPhoto(tIdx)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          activeSemeaduraPhoto === tIdx
                            ? 'border-[#F0B55E] scale-105 shadow-sm'
                            : 'border-[#EADBCC]/70 opacity-60 hover:opacity-100 hover:border-[#2B2566]/40'
                        }`}
                        title={`Ver foto ${tIdx + 1}`}
                      >
                        <img
                          src={thumbUrl}
                          alt={`Miniatura ${tIdx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coluna de Detalhes, Preço e Botão "Avise-me quando chegar" Suave */}
                <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-center lg:text-left flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F] block">
                        COLEÇÃO RITOS DO UNIVERSO
                      </span>
                      <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#2B2566] leading-tight tracking-tight">
                        Box SEMEADURA
                      </h2>
                      
                      {/* Preço e Tag "Lote Esgotado" em tom cinza suave */}
                      <div className="flex items-center justify-center lg:justify-start gap-3 pt-1">
                        <span className="font-heading text-3xl font-extrabold text-[#2B2566]">
                          R$ 147,00
                        </span>
                        <span className="text-xs text-[#8C987F] font-bold bg-[#FAF8F5] border border-[#EADBCC] px-2.5 py-0.5 rounded-full">
                          Lote Esgotado
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed">
                      A Box Semeadura é um convite para você semear novos caminhos ritualizando a chegada do ano novo astrológico. Mais do que uma curadoria de produtos, é um portal de autoconhecimento e renovação.
                    </p>

                    {/* Conteúdo da Box */}
                    <div className="space-y-2 pt-2 border-t border-[#EADBCC]/50 text-left">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#2B2566] flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5 text-[#F0B55E]" />
                        <span>O QUE ACOMPANHA A BOX:</span>
                      </p>
                      <ul className="space-y-1 text-xs text-[#534D6B]">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#8C987F] shrink-0 mt-0.5" />
                          <span>3 incensos naturais de alecrim (sem carvão) + incensário de citrino</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#8C987F] shrink-0 mt-0.5" />
                          <span>Kit prosperidade (pirita e citrino) + 2 mini velas laranjas + vela de sal grosso</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#8C987F] shrink-0 mt-0.5" />
                          <span>Ebook exclusivo com manual ritualístico e playlist personalizada</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Botão Oficial: Avise-me quando chegar (Suave, sem tanto destaque, fonte roxa) */}
                  <div className="pt-4 border-t border-[#EADBCC]/60 space-y-2">
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-[#8C987F]">
                      <Truck className="h-4 w-4 text-[#2B2566]" />
                      <span>Envio nacional via Correios/Transportadora com rastreamento.</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleWhatsAppNotify('Box SEMEADURA', true)}
                      className="w-full py-3.5 px-6 rounded-full border border-[#2B2566]/25 hover:border-[#2B2566] bg-[#FAF8F5] hover:bg-white text-[#2B2566] font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 whitespace-nowrap"
                    >
                      <Bell className="h-4 w-4 text-[#2B2566]" />
                      <span>AVISE-ME QUANDO CHEGAR</span>
                      <ArrowRight className="h-4 w-4 text-[#2B2566]" />
                    </button>
                    <span className="text-[11px] text-[#8C987F] block text-center lg:text-left">
                      Receba uma notificação em primeira mão pelo WhatsApp quando abrirmos o próximo lote.
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* ---------------------------------------------------------------------
              PRODUTOS 2, 3 E 4: BOXES ACOLHIMENTO, CRESCIMENTO E CELEBRAÇÃO
              (TAG FIXA SEM PULSAÇÃO, SEM A PALAVRA "PREVISÃO", TAG NA MESMA POSIÇÃO)
              --------------------------------------------------------------------- */}
          {STORE_PRODUCTS.slice(1).map((item, idx) => (
            <RevealOnScroll
              key={item.id}
              delayMs={140 + idx * 60}
              className="w-[86vw] sm:w-full shrink-0 snap-center sm:shrink flex flex-col"
            >
              <div className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl lg:rounded-[32px] border border-[#EADBCC]/70 shadow-[0_16px_40px_rgba(43,37,102,0.04)] hover:shadow-[0_20px_50px_rgba(43,37,102,0.07)] transition-all duration-500 overflow-hidden p-6 sm:p-8 lg:p-10 h-full flex flex-col justify-between">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
                  
                  {/* Coluna da Imagem: Fundo Oficial da Carta de Tarô da Página Inicial com Tag Fixa */}
                  <div className="lg:col-span-6 flex items-center justify-center">
                    <div className="relative w-full aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden shadow-lg border-2 border-[#F0B55E]/40 bg-[#2B2566] text-white flex flex-col items-center justify-center p-6 text-center select-none group">
                      
                      {/* Órbitas e Linhas Circulares Sutis do Brand Guide */}
                      <div className="absolute inset-0 opacity-25 pointer-events-none flex items-center justify-center">
                        <svg className="w-96 h-96" viewBox="0 0 200 200" fill="none">
                          <circle cx="100" cy="100" r="90" stroke="#F0B55E" strokeWidth="0.8" strokeDasharray="3 3" />
                          <circle cx="100" cy="100" r="70" stroke="#F0B55E" strokeWidth="0.5" />
                          <circle cx="100" cy="100" r="45" stroke="#F0B55E" strokeWidth="0.8" strokeDasharray="2 4" />
                        </svg>
                      </div>

                      {/* Borda Dupla Estilizada Clássica de Tarô */}
                      <div className="absolute inset-2.5 rounded-xl border border-[#F0B55E]/30 pointer-events-none" />

                      {/* Brilho Dourado Sutil Fixo ao Fundo (sem pulsação) */}
                      <div className="absolute inset-0 bg-radial from-[#F0B55E]/10 via-transparent to-transparent pointer-events-none" />

                      {/* Conteúdo Central da Carta de Tarô */}
                      <div className="relative z-10 space-y-3 flex flex-col items-center">
                        {/* Número Romano */}
                        <span className="font-heading tracking-widest text-lg font-bold text-[#F0B55E]">
                          {item.romanNumeral}
                        </span>

                        {/* Favicon da Casa 6 no Centro */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-xs border border-[#F0B55E]/40 p-3 flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110">
                          <img
                            src="https://static.wixstatic.com/media/02c8e0_75b529b0748c4e54adf4e58bfa7c78dc~mv2.png"
                            alt="Casa 6"
                            className="w-full h-full object-contain filter drop-shadow-xs"
                          />
                        </div>

                        {/* Tag "EM BREVE" Fixa (Sem Animação de Pulsação) */}
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F0B55E] text-[#2B2566] text-xs font-extrabold uppercase tracking-widest shadow-sm">
                            <Sparkles className="h-3.5 w-3.5 fill-[#2B2566]" />
                            <span>EM BREVE</span>
                          </span>

                          <span className="text-[11px] text-[#E6E3F1]/80 block pt-1">
                            ✦ Logo logo teremos novos produtos aqui!
                          </span>
                        </div>
                      </div>

                      {/* Estrelas Decorativas nos Cantos */}
                      <div className="absolute top-4 left-4 text-[#F0B55E]/50 text-xs">✦</div>
                      <div className="absolute top-4 right-4 text-[#F0B55E]/50 text-xs">★</div>
                      <div className="absolute bottom-4 left-4 text-[#F0B55E]/50 text-xs">★</div>
                      <div className="absolute bottom-4 right-4 text-[#F0B55E]/50 text-xs">✦</div>
                    </div>
                  </div>

                  {/* Coluna de Detalhes, Preço e Tag "Próximo Lançamento" na Mesma Posição */}
                  <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-center lg:text-left flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F] block">
                          {item.collectionName}
                        </span>
                        <h3 className="font-heading text-3xl sm:text-4xl font-bold text-[#2B2566] leading-tight tracking-tight">
                          {item.title}
                        </h3>
                        
                        {/* Preço (sem a palavra "Previsão") e Tag "Próximo Lançamento" na mesma linha */}
                        <div className="flex items-center justify-center lg:justify-start gap-3 pt-1">
                          <span className="font-heading text-3xl font-extrabold text-[#2B2566]">
                            {item.priceFormatted}
                          </span>
                          <span className="text-xs text-[#8C987F] font-bold bg-[#FAF8F5] border border-[#EADBCC] px-2.5 py-0.5 rounded-full">
                            Próximo Lançamento
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed">
                        {item.description}
                      </p>

                      {/* Prévia do Conteúdo */}
                      {item.boxItems && (
                        <div className="space-y-1.5 pt-2 border-t border-[#EADBCC]/50 text-left">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#2B2566] flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-[#F0B55E]" />
                            <span>PRÉVIA DOS ITENS EM CRIAÇÃO:</span>
                          </p>
                          <ul className="space-y-1 text-xs text-[#534D6B]">
                            {item.boxItems.slice(0, 3).map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2">
                                <span className="text-[#F0B55E] font-bold">•</span>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Botão Oficial: Entrar na Lista de Espera */}
                    <div className="pt-4 border-t border-[#EADBCC]/60 space-y-2">
                      <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-[#8C987F]">
                        <Clock className="h-4 w-4 text-[#F0B55E]" />
                        <span>{item.teaserText}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleWhatsAppNotify(item.title, false)}
                        className="w-full py-3.5 px-6 rounded-full border border-[#F0B55E] hover:bg-[#F0B55E]/10 text-[#2B2566] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 whitespace-nowrap"
                      >
                        <MessageCircle className="h-4 w-4 text-[#F0B55E]" />
                        <span>ENTRAR NA LISTA DE ESPERA VIA WHATSAPP</span>
                        <ArrowRight className="h-4 w-4 text-[#F0B55E]" />
                      </button>
                      <span className="text-[11px] text-[#8C987F] block text-center lg:text-left">
                        Garanta prioridade de compra e desconto exclusivo no primeiro lote.
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}

        </div>

        {/* Indicador sutil de carrossel no mobile */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px] font-semibold text-[#8C987F] -mt-6">
          <span>Deslize para o lado para ver todos os produtos</span>
          <ArrowRight className="h-3 w-3" />
        </div>

        {/* =========================================================================
            RODAPÉ DE CONFIANÇA & EXPERIÊNCIA DE COMPRA SEGURA
            ========================================================================= */}
        <RevealOnScroll delayMs={240}>
          <div className="rounded-3xl bg-white/90 backdrop-blur-xs border border-[#EADBCC]/60 p-6 sm:p-8 text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_10px_30px_rgba(43,37,102,0.03)]">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-heading text-sm sm:text-base font-bold text-[#2B2566]">
                  Compra Segura & Atendimento Personalizado
                </h4>
                <p className="text-xs text-[#534D6B]">
                  Pagamento protegido com Mercado Pago Oficial, código de rastreamento enviado por WhatsApp e canal aberto diretamente com a Bianca.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleWhatsAppNotify('Lojinha Casa 6')}
              className="px-6 py-3 rounded-full bg-[#2B2566] hover:bg-[#1E1B4B] text-white text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer shadow-sm hover:shadow-md"
            >
              Tirar Dúvidas sobre Produtos
            </button>
          </div>
        </RevealOnScroll>

      </div>
    </div>
  );
};
