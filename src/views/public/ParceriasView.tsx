/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /parcerias (Parcerias Comerciais, Permutas & Co-branding)
 * 
 * Arquitetura & Design:
 * - Coluna lateral fixa à esquerda com manifesto de impacto, modalidades aceitas e público qualificado.
 * - Coluna direita com boxes elegantes estilo Lojinha para cada parceria (coleção 'parcerias_portfolio').
 * - Formulário final específico para captação de propostas de parcerias com seleção de modalidade:
 *   Publicidade, Permuta, Divulgação ou Personalizado.
 * - Direcionamento automático para o WhatsApp oficial com a proposta pré-formatada.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Handshake,
  CheckCircle2,
  ArrowRight,
  Building,
  Heart,
  MessageCircle,
  Share2,
  Tag,
  Star,
  Layers,
  Award
} from 'lucide-react';
import { ParceriaItem } from '../../types';
import { getParceriasPortfolio } from '../../services/corporateService';
import { submitLeadBooking } from '../../services/leads';
import { SITE_CONFIG } from '../../config/site';

interface ParceriasViewProps {
  onOpenBooking: (serviceId?: string) => void;
}

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

export const ParceriasView: React.FC<ParceriasViewProps> = () => {
  const [parcerias, setParcerias] = useState<ParceriaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do Formulário de Parceria
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [tipoParceria, setTipoParceria] = useState<'Publicidade' | 'Permuta' | 'Divulgação' | 'Personalizado'>('Permuta');
  const [detalhesParceria, setDetalhesParceria] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getParceriasPortfolio();
        setParcerias(data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const scrollToFormWithCategory = (type: 'Publicidade' | 'Permuta' | 'Divulgação' | 'Personalizado') => {
    setTipoParceria(type);
    const element = document.getElementById('formulario-parceria-comercial');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitLeadBooking(
        {
          firstName: nome,
          lastName: sobrenome,
          fullName: `${nome} ${sobrenome}`.trim(),
          email,
          whatsapp,
          serviceId: 'palestras-corporativas'
        },
        `Parceria Comercial — ${empresa} (${tipoParceria})`
      );

      setFormSuccess(true);

      const msg = `Olá, Bianca! Gostaria de propor uma parceria comercial com a marca *${empresa}*.\n\n*Contato:* ${nome} ${sobrenome}\n*Modalidade:* ${tipoParceria}\n*E-mail:* ${email}\n*WhatsApp:* ${whatsapp}\n*Detalhes da Proposta:* ${detalhesParceria || 'Gostaria de apresentar nossa marca e conversar sobre sinergias.'}`;
      const waUrl = `https://wa.me/${SITE_CONFIG.whatsappNumberRaw}?text=${encodeURIComponent(msg)}`;

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 500);
    } catch (err) {
      console.warn('[ParceriasView] Erro ao enviar proposta:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] text-[#2B2566] min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden relative">
      
      {/* Elementos Cósmicos Decorativos Efémeros */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-24 right-[-90px] w-96 h-96 rounded-full border border-[#F0B55E]/15 opacity-40 animate-celestial-orbit-slow" />
        <div className="absolute top-1/2 left-[-100px] w-[500px] h-[500px] rounded-full border border-[#8C987F]/10 opacity-50 animate-celestial-orbit-reverse" />
        <div className="absolute top-40 left-10 text-[#F0B55E]/40 text-xs animate-pulse">✦</div>
        <div className="absolute bottom-52 right-1/4 text-[#8C987F]/30 text-[10px]">★</div>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 sm:space-y-16 lg:space-y-20 relative z-10">

        {/* =========================================================================
            1. CABEÇALHO CLEAN & MANIFESTO DE PARCERIAS
            ========================================================================= */}
        <RevealOnScroll delayMs={50}>
          <div className="space-y-6 text-center max-w-4xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F] block">
              CONEXÕES COM PROPÓSITO & CO-BRANDING
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B2566] tracking-tight">
              Parcerias & Permutas Estratégicas
            </h1>

            {/* Linha Divisória de Marca */}
            <div className="flex items-center justify-center gap-3 py-1">
              <span className="w-12 h-px bg-[#2B2566]/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]" />
              <span className="w-20 h-px bg-[#2B2566]/20" />
            </div>

            <p className="text-sm sm:text-base md:text-lg text-[#423C7B] leading-relaxed font-normal max-w-3xl mx-auto">
              Conectamos sua marca a uma comunidade leal, atenta e consciente. Trabalhamos modelos de <strong>Publicidade</strong>, <strong>Permuta</strong>, <strong>Divulgação</strong> e <strong>Co-criação de Produtos</strong> com marcas que compartilham valores de saúde, bem-estar, beleza e autoconhecimento.
            </p>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            2. ARQUITETURA EM 2 COLUNAS:
               - COLUNA ESQUERDA FIXA: BANNER VERTICAL COM TEXTO DE IMPACTO E MODALIDADES
               - COLUNA DIREITA: BOXES DAS PARCERIAS (CARA DA PÁGINA LOJINHAS)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* COLUNA ESQUERDA: BANNER VERTICAL FIXO / STICKY */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* Box 1: Frase e Texto de Impacto */}
            <div className="rounded-3xl bg-gradient-to-br from-[#2B2566] via-[#352668] to-[#201C4E] text-white p-7 shadow-xl border border-[#F0B55E]/30 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0B55E]/20 text-[#F0B55E] text-[10px] font-bold uppercase tracking-wider border border-[#F0B55E]/40">
                <Handshake className="h-3.5 w-3.5" />
                <span>Aliança Estratégica</span>
              </div>

              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F0B55E] leading-snug">
                &ldquo;Mais que visibilidade: uma conversa verdadeira com quem confia na nossa voz.&rdquo;
              </h3>

              <p className="text-xs sm:text-sm text-[#DAD2C4] leading-relaxed font-light">
                A Casa 6 não faz publicidade tradicional. Selecionamos marcas cujos produtos e serviços fazem parte genuína da rotina da Bianca e da vida dos membros da <strong>Patota Astral</strong>.
              </p>

              <div className="pt-2 border-t border-white/10 space-y-2 text-xs text-[#DAD2C4]/90">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#F0B55E] shrink-0" />
                  <span>Audiência 85% feminina, qualificada e decidora de compra</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#F0B55E] shrink-0" />
                  <span>Altíssima taxa de abertura e engajamento no WhatsApp</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#F0B55E] shrink-0" />
                  <span>Associação a saúde mental, estética consciente e autocuidado</span>
                </p>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => scrollToFormWithCategory('Permuta')}
                  className="w-full py-3 px-5 rounded-full bg-[#F0B55E] hover:bg-[#E2A34A] text-[#2B2566] font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer text-center"
                >
                  Propor Parceria com a Bianca
                </button>
              </div>
            </div>

            {/* Box 2: Modalidades Aceitas */}
            <div className="rounded-2xl bg-white/95 backdrop-blur-xs border border-[#EADBCC]/80 p-6 shadow-[0_10px_30px_rgba(43,37,102,0.03)] space-y-4">
              <div className="border-b border-[#EADBCC]/50 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F] block">
                  FORMATOS DISPONÍVEIS
                </span>
                <h4 className="font-heading text-base font-bold text-[#2B2566] mt-0.5">
                  Modalidades de Colaboração
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div
                  onClick={() => scrollToFormWithCategory('Permuta')}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EADBCC]/60 hover:border-[#F0B55E] transition-all cursor-pointer group"
                >
                  <span className="font-bold text-[#2B2566] group-hover:text-[#F0B55E] flex items-center justify-between">
                    <span>✦ Permuta Estratégica</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-[11px] text-[#534D6B] mt-1">
                    Troca direta de produtos de alto valor agregado para inclusão em edições da Lojinha ou eventos.
                  </p>
                </div>

                <div
                  onClick={() => scrollToFormWithCategory('Publicidade')}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EADBCC]/60 hover:border-[#F0B55E] transition-all cursor-pointer group"
                >
                  <span className="font-bold text-[#2B2566] group-hover:text-[#F0B55E] flex items-center justify-between">
                    <span>✦ Publicidade & Conteúdo</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-[11px] text-[#534D6B] mt-1">
                    Apresentação contextualizada no Instagram, YouTube ou cadernos editoriais autorais.
                  </p>
                </div>

                <div
                  onClick={() => scrollToFormWithCategory('Divulgação')}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EADBCC]/60 hover:border-[#F0B55E] transition-all cursor-pointer group"
                >
                  <span className="font-bold text-[#2B2566] group-hover:text-[#F0B55E] flex items-center justify-between">
                    <span>✦ Divulgação em Eventos</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-[11px] text-[#534D6B] mt-1">
                    Stands, presença em convenções presenciais, kits de boas-vindas e apoio institucional.
                  </p>
                </div>

                <div
                  onClick={() => scrollToFormWithCategory('Personalizado')}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EADBCC]/60 hover:border-[#F0B55E] transition-all cursor-pointer group"
                >
                  <span className="font-bold text-[#2B2566] group-hover:text-[#F0B55E] flex items-center justify-between">
                    <span>✦ Co-branding & Linha Autoral</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-[11px] text-[#534D6B] mt-1">
                    Criação conjunta de produtos físicos (velas, incensários, papelaria, cosméticos limpos).
                  </p>
                </div>
              </div>
            </div>

          </aside>

          {/* COLUNA DIREITA: BOXES COM CADA PARCERIA (ESTILO LOJINHA) */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#EADBCC]/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F] block">
                  CONEXÕES CONSOLIDADAS
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                  Exemplos de Parcerias & Colaborações
                </h2>
              </div>
              <span className="text-xs text-[#8C987F] font-semibold">
                {parcerias.length} parcerias ativas
              </span>
            </div>

            {/* Boxes das Parcerias cadastradas no banco de dados */}
            <div className="space-y-8">
              {parcerias.map((parceria, idx) => (
                <RevealOnScroll key={parceria.id || idx} delayMs={idx * 100}>
                  <article className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl border border-[#EADBCC]/70 shadow-[0_16px_40px_rgba(43,37,102,0.04)] hover:shadow-[0_20px_50px_rgba(43,37,102,0.07)] transition-all duration-500 overflow-hidden p-6 sm:p-8 flex flex-col justify-between">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      
                      {/* Foto / Galeria da Parceria */}
                      <div className="md:col-span-5 space-y-2">
                        <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border border-[#EADBCC]/60 bg-black/5 shadow-xs group">
                          <img
                            src={parceria.fotos[0] || 'https://static.wixstatic.com/media/02c8e0_ba9bbb820abf45ceaf08609f65cdd001~mv2.jpeg'}
                            alt={`Parceria com ${parceria.empresa}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute top-3 left-3 bg-[#2B2566]/90 backdrop-blur-xs text-[#F0B55E] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {parceria.tipo}
                          </div>
                        </div>

                        {/* Segunda foto opcional */}
                        {parceria.fotos.length > 1 && (
                          <div className="h-16 rounded-xl overflow-hidden border border-[#EADBCC]/60">
                            <img src={parceria.fotos[1]} alt="Produto da parceria" className="w-full h-full object-cover" loading="lazy" />
                          </div>
                        )}
                      </div>

                      {/* Conteúdo: Logo, O que a Bianca faz, O que a empresa oferece */}
                      <div className="md:col-span-7 space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            {parceria.logoUrl && (
                              <img src={parceria.logoUrl} alt={parceria.empresa} className="h-8 w-auto object-contain filter drop-shadow-2xs" />
                            )}
                            <h3 className="font-heading text-2xl font-bold text-[#2B2566]">
                              {parceria.empresa}
                            </h3>
                          </div>

                          <div className="pt-2 space-y-3">
                            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EADBCC]/60 space-y-1">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F0B55E] block">
                                O QUE A BIANCA FAZ COM A MARCA:
                              </span>
                              <p className="text-xs sm:text-[13px] text-[#423C7B] leading-relaxed">
                                {parceria.descricao}
                              </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white border border-[#EADBCC]/60 space-y-1">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C987F] block">
                                O QUE A EMPRESA OFERECE / CONTRAPARTIDA:
                              </span>
                              <p className="text-xs sm:text-[13px] text-[#534D6B] leading-relaxed">
                                {parceria.oQueOferece}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-1 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => scrollToFormWithCategory(parceria.tipo)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2B2566] hover:text-[#F0B55E] transition-colors cursor-pointer"
                          >
                            <span>Propor modelo semelhante</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </article>
                </RevealOnScroll>
              ))}
            </div>

          </section>

        </div>

        {/* =========================================================================
            3. FORMULÁRIO FINAL DE PROPOSTA DE PARCERIA
            ========================================================================= */}
        <RevealOnScroll delayMs={150}>
          <div id="formulario-parceria-comercial" className="space-y-6 pt-6 max-w-3xl mx-auto">
            
            <div className="bg-gradient-to-r from-[#2B2566] via-[#382D78] to-[#2B2566] text-white rounded-3xl p-8 sm:p-10 text-center space-y-2 shadow-2xl border border-[#F0B55E]/30 relative overflow-hidden">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#F0B55E] block">
                VAMOS CRIAR JUNTOS?
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#F0B55E] tracking-tight">
                Envie sua Proposta de Parceria
              </h2>
              <p className="text-xs sm:text-sm text-[#DAD2C4] max-w-xl mx-auto font-normal">
                Preencha os detalhes da sua marca. Analisamos todas as propostas para garantir afinidade com a nossa audiência.
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl border border-[#EADBCC]/70 p-6 sm:p-10 shadow-[0_16px_40px_rgba(43,37,102,0.04)] space-y-6">
              
              {formSuccess ? (
                <div className="p-6 rounded-2xl bg-green-50 border border-green-200 text-center space-y-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto" />
                  <h4 className="font-heading text-lg font-bold text-green-900">
                    Proposta Registrada com Sucesso!
                  </h4>
                  <p className="text-xs text-green-800 max-w-md mx-auto">
                    Redirecionando para a conversa no WhatsApp da Bianca Tofoli com a sua proposta. Caso a janela não abra automaticamente, use o botão abaixo:
                  </p>
                  <a
                    href={`https://wa.me/${SITE_CONFIG.whatsappNumberRaw}?text=${encodeURIComponent(`Olá, Bianca! Gostaria de conversar sobre uma parceria de ${tipoParceria} para a marca ${empresa}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#20ba5a]"
                  >
                    <MessageCircle className="h-4 w-4 fill-white" />
                    <span>Abrir Conversa no WhatsApp</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2B2566]">Nome *</label>
                      <input
                        type="text"
                        required
                        placeholder="Seu nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566] focus:outline-none focus:border-[#F0B55E] focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2B2566]">Sobrenome *</label>
                      <input
                        type="text"
                        required
                        placeholder="Seu sobrenome"
                        value={sobrenome}
                        onChange={(e) => setSobrenome(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566] focus:outline-none focus:border-[#F0B55E] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2B2566]">Nome da Empresa ou Marca *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nome da sua marca"
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566] focus:outline-none focus:border-[#F0B55E] focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2B2566]">WhatsApp (com DDD) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(11) 99999-9999"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566] focus:outline-none focus:border-[#F0B55E] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#2B2566]">E-mail para Contato *</label>
                    <input
                      type="email"
                      required
                      placeholder="seuemail@empresa.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566] focus:outline-none focus:border-[#F0B55E] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#2B2566]">Tipo de Parceria Desejada *</label>
                    <select
                      value={tipoParceria}
                      onChange={(e) => setTipoParceria(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566] focus:outline-none focus:border-[#F0B55E] focus:bg-white cursor-pointer"
                    >
                      <option value="Publicidade">Publicidade (Posts, Reels e Conteúdo Editorial)</option>
                      <option value="Permuta">Permuta (Troca de produtos e serviços estratégicos)</option>
                      <option value="Divulgação">Divulgação (Eventos presenciais, brindes e apoio institucional)</option>
                      <option value="Personalizado">Personalizado (Co-branding e desenvolvimento de produtos)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#2B2566]">Conte um pouco sobre sua marca e sua proposta</label>
                    <textarea
                      rows={3}
                      placeholder="Descreva o que sua marca oferece, o perfil do seu público e como imagina essa parceria..."
                      value={detalhesParceria}
                      onChange={(e) => setDetalhesParceria(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566] focus:outline-none focus:border-[#F0B55E] focus:bg-white resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                    >
                      <MessageCircle className="h-5 w-5 fill-white" />
                      <span>{isSubmitting ? 'ENVIANDO...' : 'ENVIAR PROPOSTA DE PARCERIA'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}

            </div>

          </div>
        </RevealOnScroll>

      </div>
    </div>
  );
};
