/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visão Pública: /palestras (Palestras & Workshops Corporativos)
 * 
 * Atualizações de Arquitetura & Design:
 * - Destaque prioritário para a Norma Regulamentadora NR-1 e Saúde Mental Ocupacional (Portaria MTE nº 1.419/2024 e Lei nº 14.831/2024).
 * - Visual clean inspirado no estilo da Lojinha, com boxes elegantes para cada palestra realizada por Bianca Tofoli.
 * - Integração com a coleção 'palestras_portfolio' no banco de dados (Firestore).
 * - Coluna lateral fixa à esquerda com Impacto Mensurável (KPIs de Yale, Deloitte, Gallup) e Temas Especializados.
 * - Vídeos removidos conforme solicitação.
 * - Logos das empresas atendidas integrados no topo como prova social.
 * - Banner final "Vamos montar um evento para sua empresa?" conectado a um formulário corporativo completo.
 * - Direcionamento automático para o WhatsApp oficial com a proposta pré-formatada.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  HeartPulse,
  Users,
  Award,
  Building,
  Mail,
  Send,
  MessageCircle,
  HelpCircle,
  Briefcase,
  Check
} from 'lucide-react';
import { PalestraItem } from '../../types';
import { getPalestrasPortfolio } from '../../services/corporateService';
import { submitLeadBooking } from '../../services/leads';
import { SITE_CONFIG } from '../../config/site';

interface PalestrasViewProps {
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

// Logos de Clientes Atendidos por Bianca Tofoli
const CLIENT_LOGOS = [
  { name: 'SulAmérica Saúde', url: 'https://static.wixstatic.com/media/02c8e0_9faeeab290534345a6aaa65fddb10d0f~mv2.png' },
  { name: 'Grupo Fleury', url: 'https://static.wixstatic.com/media/02c8e0_aaf906445da54658b1fa405f95a96e77~mv2.png' },
  { name: 'a+ Medicina Diagnóstica', url: 'https://static.wixstatic.com/media/02c8e0_368973d7ca9543d88d89379497662314~mv2.png' },
  { name: 'Florescer', url: 'https://static.wixstatic.com/media/02c8e0_8af738fb419e424887681c32ca6a68a4~mv2.png' },
  { name: 'Cravo', url: 'https://static.wixstatic.com/media/02c8e0_deeebd7d569e49648f10569a657b530c~mv2.png' },
  { name: 'Hermes Pardini', url: 'https://static.wixstatic.com/media/02c8e0_0b8081b7c7c14335b43abbc6a3653930~mv2.png' },
  { name: 'Clínica Nossa Senhora das Graças', url: 'https://static.wixstatic.com/media/02c8e0_79bd2eb0deaf49888df17c53599c26a6~mv2.png' }
];

// Métricas de Impacto Mensurável (Fontes Internacionais)
const MEASURABLE_METRICS = [
  { stat: '2x', title: 'Decisões sob Pressão', desc: 'Clareza analítica em ambientes de alta tensão.', source: 'Yale Center' },
  { stat: '+56%', title: 'Foco & Performance', desc: 'Redução drástica de afastamentos por desgaste.', source: 'Deloitte' },
  { stat: '-30%', title: 'Ansiedade & Estresse', desc: 'Regulação respiratória e ancoragem imediata.', source: 'APA' },
  { stat: '-Turnover', title: 'Retenção de Talentos', desc: 'Segurança psicológica reduz desligamentos.', source: 'Gallup' }
];

// Temas Especializados Adicionais
const CORPORATE_TOPICS = [
  { tag: 'COMUNICAÇÃO', title: 'A Imagem que Comunica', desc: 'Postura não-verbal e credibilidade nas relações de trabalho.' },
  { tag: 'LIDERANÇA', title: 'Coragem em Si', desc: 'Vencendo a síndrome da impostora e autossabotagem em cargos de gestão.' },
  { tag: 'PROPÓSITO', title: 'Propósito x Vocação', desc: 'Integrando talentos individuais com as metas estratégicas da empresa.' },
  { tag: 'EQUILÍBRIO', title: 'Autorregulação em Pressão', desc: 'Ferramentas práticas de respiração para manter o centro em crises.' }
];

export const PalestrasView: React.FC<PalestrasViewProps> = () => {
  const [palestras, setPalestras] = useState<PalestraItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do Formulário Corporativo Final
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [temaSelecionado, setTemaSelecionado] = useState('Saúde Mental & Conformidade NR-1');
  const [detalhesEvento, setDetalhesEvento] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPalestrasPortfolio();
        setPalestras(data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const scrollToFormWithTheme = (themeName: string) => {
    setTemaSelecionado(themeName);
    const element = document.getElementById('formulario-evento-corporativo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Salva no banco de dados como Lead Corporativo
      await submitLeadBooking(
        {
          firstName: nome,
          lastName: sobrenome,
          fullName: `${nome} ${sobrenome}`.trim(),
          email,
          whatsapp,
          serviceId: 'palestras-corporativas'
        },
        `Palestra Corporativa — ${empresa} (${temaSelecionado})`
      );

      setFormSuccess(true);

      // Prepara e abre WhatsApp com mensagem formal
      const msg = `Olá, Bianca! Gostaria de solicitar uma proposta de palestra/evento corporativo para a empresa *${empresa}*.\n\n*Contato:* ${nome} ${sobrenome}\n*Tema Solicitado:* ${temaSelecionado}\n*E-mail:* ${email}\n*WhatsApp:* ${whatsapp}\n*Detalhes do Evento:* ${detalhesEvento || 'Gostaria de alinhar formatos e datas disponíveis.'}`;
      const waUrl = `https://wa.me/${SITE_CONFIG.whatsappNumberRaw}?text=${encodeURIComponent(msg)}`;
      
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 500);
    } catch (err) {
      console.warn('[PalestrasView] Erro ao enviar solicitação:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] text-[#2B2566] min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden relative">
      
      {/* Elementos Decorativos Efémeros Celestes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-20 right-[-80px] w-96 h-96 rounded-full border border-[#F0B55E]/15 opacity-40 animate-celestial-orbit-slow" />
        <div className="absolute top-1/3 left-[-120px] w-[500px] h-[500px] rounded-full border border-[#8C987F]/10 opacity-50 animate-celestial-orbit-reverse" />
        <div className="absolute top-36 left-12 text-[#F0B55E]/40 text-xs animate-pulse">✦</div>
        <div className="absolute bottom-48 right-1/4 text-[#8C987F]/30 text-[10px]">★</div>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 sm:space-y-16 lg:space-y-20 relative z-10">

        {/* =========================================================================
            1. CABEÇALHO CLEAN + DESTAQUE NR-1 + LOGOS DE EMPRESAS ATENDIDAS
            ========================================================================= */}
        <RevealOnScroll delayMs={50}>
          <div className="space-y-8 text-center">
            <div className="max-w-4xl mx-auto space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C987F] block">
                DESENVOLVIMENTO HUMANO & CORPORATIVO
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B2566] tracking-tight">
                Palestras & Workshops Corporativos
              </h1>

              {/* Linha Divisória de Marca */}
              <div className="flex items-center justify-center gap-3 py-1">
                <span className="w-12 h-px bg-[#2B2566]/20" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0B55E]" />
                <span className="w-20 h-px bg-[#2B2566]/20" />
              </div>

              <p className="text-sm sm:text-base md:text-lg text-[#423C7B] leading-relaxed font-normal max-w-3xl mx-auto">
                Experiências transformadoras conduzidas por <strong>Bianca Tofoli</strong>: enfermeira graduada pela UNESP com mais de 10 anos de liderança em saúde e gestão de equipes, unindo inteligência emocional, lucidez e práticas humanizadas para convenções, SIPATs e lideranças.
              </p>
            </div>

            {/* Destaque Obrigatório: Norma Regulamentadora NR-1 e Saúde Mental */}
            <div className="max-w-4xl mx-auto rounded-2xl bg-white/95 border border-[#EADBCC]/80 p-5 sm:p-6 shadow-[0_8px_24px_rgba(43,37,102,0.03)] text-left flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-[#2B2566] text-[#F0B55E] flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="h-6 w-6 text-[#F0B55E]" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-heading text-base font-bold text-[#2B2566]">
                    Conformidade com a Norma Regulamentadora NR-1 & Riscos Psicossociais
                  </h3>
                  <span className="text-[10px] bg-[#F0B55E]/20 text-[#2B2566] font-bold px-2 py-0.5 rounded-full">
                    Portaria MTE nº 1.419/2024
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#534D6B] leading-relaxed">
                  As diretrizes legais tornaram mandatória a prevenção ao estresse crônico, burnout e sobrecarga no Programa de Gerenciamento de Riscos (PGR). As palestras da Bianca atendem integralmente as exigências de RH e SESMT, capacitando equipes com segurança psicológica e acolhimento preventivo.
                </p>
              </div>
            </div>

            {/* Logos das Empresas que já confiaram */}
            <div className="pt-2 border-t border-[#EADBCC]/50 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C987F] block">
                EMPRESAS & INSTITUIÇÕES QUE JÁ CONFIARAM NO TRABALHO
              </span>

              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-12 pt-1">
                {CLIENT_LOGOS.map((client, idx) => (
                  <div
                    key={idx}
                    className="h-10 sm:h-12 flex items-center justify-center transition-all duration-300 hover:scale-105"
                    title={client.name}
                  >
                    <img
                      src={client.url}
                      alt={client.name}
                      className="max-h-8 sm:max-h-10 w-auto object-contain filter drop-shadow-xs"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            2. ARQUITETURA EM 2 COLUNAS:
               - COLUNA ESQUERDA FIXA: IMPACTO MENSURÁVEL + TEMAS ESPECIALIZADOS
               - COLUNA DIREITA: BOXES DAS PALESTRAS REALIZADAS (CARA DE LOJINHA)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* COLUNA ESQUERDA (LATERAL FIXA / STICKY NO DESKTOP) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* Box 1: Impacto Mensurável (KPIs) */}
            <div className="rounded-2xl bg-white/95 backdrop-blur-xs border border-[#EADBCC]/80 p-6 shadow-[0_10px_30px_rgba(43,37,102,0.03)] space-y-4">
              <div className="border-b border-[#EADBCC]/50 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F] block">
                  RESULTADOS COMPROVADOS
                </span>
                <h3 className="font-heading text-lg font-bold text-[#2B2566] flex items-center gap-1.5 mt-0.5">
                  <TrendingUp className="h-4 w-4 text-[#F0B55E]" />
                  <span>Impacto Mensurável</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {MEASURABLE_METRICS.map((metric, mIdx) => (
                  <div key={mIdx} className="bg-[#FAF8F5] rounded-xl p-3 border border-[#EADBCC]/60 space-y-1">
                    <span className="font-heading text-xl font-extrabold text-[#2B2566] block leading-none">
                      {metric.stat}
                    </span>
                    <span className="text-[11px] font-bold text-[#423C7B] block leading-tight">
                      {metric.title}
                    </span>
                    <span className="text-[9px] text-[#8C987F] block">
                      Fonte: {metric.source}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#534D6B] leading-relaxed pt-1">
                Estratégias humanizadas com fundamentação científica para equipes de alta performance.
              </p>
            </div>

            {/* Box 2: Temas Especializados & Abordagens */}
            <div className="rounded-2xl bg-white/95 backdrop-blur-xs border border-[#EADBCC]/80 p-6 shadow-[0_10px_30px_rgba(43,37,102,0.03)] space-y-4">
              <div className="border-b border-[#EADBCC]/50 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F] block">
                  COMPETÊNCIAS TRABALHADAS
                </span>
                <h3 className="font-heading text-lg font-bold text-[#2B2566] flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="h-4 w-4 text-[#F0B55E]" />
                  <span>Temas & Abordagens</span>
                </h3>
              </div>

              <div className="space-y-3">
                {CORPORATE_TOPICS.map((topic, tIdx) => (
                  <div key={tIdx} className="space-y-1 pb-2 border-b border-[#EADBCC]/40 last:border-0 last:pb-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#F0B55E] block">
                      {topic.tag}
                    </span>
                    <h4 className="text-xs font-bold text-[#2B2566]">
                      {topic.title}
                    </h4>
                    <p className="text-[11px] text-[#534D6B] leading-snug">
                      {topic.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 3: Botão de Ação Rápida */}
            <div className="rounded-2xl bg-gradient-to-br from-[#2B2566] to-[#382D78] text-white p-5 text-center space-y-3 shadow-lg">
              <h4 className="font-heading text-sm font-bold text-[#F0B55E]">
                Precisa de um tema sob medida?
              </h4>
              <p className="text-[11px] text-[#DAD2C4] leading-relaxed">
                Desenhamos vivências e palestras alinhadas aos desafios específicos do seu time.
              </p>
              <button
                type="button"
                onClick={() => scrollToFormWithTheme('Personalizado / Sob Medida')}
                className="w-full py-2.5 px-4 rounded-full bg-[#F0B55E] hover:bg-[#E2A34A] text-[#2B2566] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow"
              >
                Solicitar Tema Personalizado
              </button>
            </div>

          </aside>

          {/* COLUNA DIREITA: BOXES COM CADA PALESTRA (ESTILO LOJINHA) */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#EADBCC]/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C987F] block">
                  PORTFÓLIO CORPORATIVO
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B2566]">
                  Palestras & Encontros Realizados
                </h2>
              </div>
              <span className="text-xs text-[#8C987F] font-semibold">
                {palestras.length} experiências cadastradas
              </span>
            </div>

            {/* Lista dos Boxes com a cara da página Lojinhas */}
            <div className="space-y-8">
              {palestras.map((palestra, pIdx) => (
                <RevealOnScroll key={palestra.id || pIdx} delayMs={pIdx * 100}>
                  <article className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl border border-[#EADBCC]/70 shadow-[0_16px_40px_rgba(43,37,102,0.04)] hover:shadow-[0_20px_50px_rgba(43,37,102,0.07)] transition-all duration-500 overflow-hidden p-6 sm:p-8 flex flex-col justify-between">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      
                      {/* Coluna Visual: Foto da Palestra */}
                      <div className="md:col-span-5 space-y-2">
                        <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border border-[#EADBCC]/60 bg-black/5 shadow-xs group">
                          <img
                            src={palestra.fotos[0] || 'https://static.wixstatic.com/media/02c8e0_fe08bedd21184bf390fb985cae10f64f~mv2.jpeg'}
                            alt={`Palestra na empresa ${palestra.empresa}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute top-3 left-3 bg-[#2B2566]/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Clock className="h-3 w-3 text-[#F0B55E]" />
                            <span>{palestra.duracao}</span>
                          </div>
                        </div>

                        {/* Mini Galeria se houver mais de uma foto */}
                        {palestra.fotos.length > 1 && (
                          <div className="flex gap-2">
                            {palestra.fotos.slice(1, 3).map((thumb, tIdx) => (
                              <div key={tIdx} className="w-1/2 aspect-video rounded-lg overflow-hidden border border-[#EADBCC]/60 bg-black/5">
                                <img src={thumb} alt="Detalhe do encontro" className="w-full h-full object-cover" loading="lazy" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Coluna Descritiva: Empresa, Tags, O que foi falado e Botão */}
                      <div className="md:col-span-7 space-y-4">
                        <div className="space-y-1.5">
                          {/* Tags / Palavras-Chave do Tema */}
                          <div className="flex flex-wrap gap-1.5">
                            {palestra.tags.map((tag, tagIdx) => (
                              <span
                                key={tagIdx}
                                className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF8F5] text-[#8C987F] border border-[#EADBCC]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Nome da Empresa Atendida */}
                          <h3 className="font-heading text-2xl font-bold text-[#2B2566] flex items-center gap-2">
                            <Building className="h-5 w-5 text-[#F0B55E] shrink-0" />
                            <span>{palestra.empresa}</span>
                          </h3>

                          {/* Breve Descrição */}
                          <p className="text-xs sm:text-sm text-[#423C7B] leading-relaxed pt-1">
                            {palestra.descricao}
                          </p>
                        </div>

                        {/* O que foi falado / Conteúdo Abordado */}
                        <div className="space-y-1.5 pt-2 border-t border-[#EADBCC]/50 text-left">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#2B2566] flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-[#F0B55E]" />
                            <span>O QUE FOI ABORDADO:</span>
                          </p>
                          <ul className="space-y-1 text-xs text-[#534D6B]">
                            {palestra.conteudo.map((item, cIdx) => (
                              <li key={cIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#8C987F] shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Botão Oficial: Contratar esse tema */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => scrollToFormWithTheme(`${palestra.empresa} — ${palestra.tags[0] || 'Palestra Corporativa'}`)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2B2566] hover:bg-[#1E1B4B] text-[#F0B55E] font-bold text-xs uppercase tracking-wider shadow hover:shadow-md transition-all cursor-pointer active:scale-98"
                          >
                            <span>CONTRATAR ESSE TEMA</span>
                            <ArrowRight className="h-4 w-4 text-[#F0B55E]" />
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
            3. BANNER CHAMATIVO & FORMULÁRIO FINAL CORPORATIVO
            ========================================================================= */}
        <RevealOnScroll delayMs={150}>
          <div id="formulario-evento-corporativo" className="space-y-8 pt-6">
            
            {/* Banner Chamativo: Vamos montar um evento para sua empresa? */}
            <div className="bg-gradient-to-r from-[#2B2566] via-[#382D78] to-[#2B2566] text-white rounded-3xl p-8 sm:p-12 text-center space-y-3 shadow-2xl border border-[#F0B55E]/30 relative overflow-hidden">
              <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#F0B55E]/10 rounded-full blur-3xl pointer-events-none" />

              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#F0B55E] block">
                SOLUÇÃO INSTITUCIONAL SOB MEDIDA
              </span>

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F0B55E] tracking-tight">
                Vamos montar um evento para sua empresa?
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-[#DAD2C4] max-w-2xl mx-auto font-normal leading-relaxed">
                Seja para a <strong>Semana da SIPAT</strong>, <strong>Setembro Amarelo</strong>, <strong>Convenções de Liderança</strong> ou <strong>Encontros de Bem-Estar</strong>, estruturamos uma experiência memorável que dialoga diretamente com as metas do seu time e com a conformidade da <strong>NR-1</strong>.
              </p>
            </div>

            {/* Container do Formulário Corporativo */}
            <div className="bg-white/95 backdrop-blur-xs rounded-[28px] sm:rounded-3xl border border-[#EADBCC]/70 p-6 sm:p-10 shadow-[0_16px_40px_rgba(43,37,102,0.04)] max-w-3xl mx-auto space-y-6">
              
              <div className="text-center space-y-1">
                <h3 className="font-heading text-2xl font-bold text-[#2B2566]">
                  Solicite uma Proposta Corporativa
                </h3>
                <p className="text-xs text-[#534D6B]">
                  Preencha os dados abaixo. Nossa equipe entrará em contato via WhatsApp com os formatos e disponibilidade.
                </p>
              </div>

              {formSuccess ? (
                <div className="p-6 rounded-2xl bg-green-50 border border-green-200 text-center space-y-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto" />
                  <h4 className="font-heading text-lg font-bold text-green-900">
                    Solicitação Encaminhada com Sucesso!
                  </h4>
                  <p className="text-xs text-green-800 max-w-md mx-auto">
                    Redirecionando para a conversa no WhatsApp da Bianca Tofoli com sua proposta preenchida. Caso a janela não tenha aberto automaticamente, clique no botão abaixo:
                  </p>
                  <a
                    href={`https://wa.me/${SITE_CONFIG.whatsappNumberRaw}?text=${encodeURIComponent(`Olá, Bianca! Gostaria de uma proposta corporativa para a empresa ${empresa}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#20ba5a]"
                  >
                    <MessageCircle className="h-4 w-4 fill-white" />
                    <span>Falar no WhatsApp Agora</span>
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
                      <label className="text-xs font-bold text-[#2B2566]">Empresa em que trabalha *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nome da sua organização"
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
                    <label className="text-xs font-bold text-[#2B2566]">E-mail Corporativo *</label>
                    <input
                      type="email"
                      required
                      placeholder="seunome@empresa.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566] focus:outline-none focus:border-[#F0B55E] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#2B2566]">Tema do Evento *</label>
                    <select
                      value={temaSelecionado}
                      onChange={(e) => setTemaSelecionado(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DAD2C4] bg-[#FAF8F5] text-xs text-[#2B2566] focus:outline-none focus:border-[#F0B55E] focus:bg-white cursor-pointer"
                    >
                      <option value="Saúde Mental & Conformidade NR-1">Saúde Mental & Conformidade NR-1 (Prevenção e Bem-estar)</option>
                      <option value="Inteligência Emocional & Decisões sob Pressão">Inteligência Emocional & Decisões sob Pressão</option>
                      <option value="Comunicação sem Ruído & Segurança Psicológica">Comunicação sem Ruído & Segurança Psicológica</option>
                      <option value="Liderança Feminina & Síndrome da Impostora">Liderança Feminina & Síndrome da Impostora</option>
                      <option value="Propósito x Vocação nas Empresas">Propósito x Vocação nas Empresas</option>
                      <option value="Personalizado">Personalizado (Outro tema sob medida)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#2B2566]">Detalhes do Evento & Informações Adicionais</label>
                    <textarea
                      rows={3}
                      placeholder="Conte sobre o perfil do público, data prevista, formato (presencial ou online) e objetivos do encontro..."
                      value={detalhesEvento}
                      onChange={(e) => setDetalhesEvento(e.target.value)}
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
                      <span>{isSubmitting ? 'ENVIANDO...' : 'SOLICITAR PROPOSTA PARA EMPRESA'}</span>
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
