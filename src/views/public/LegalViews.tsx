/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Visões Públicas: Políticas e Termos Legais (Identidade Visual Oficial Atualizada)
 */

import React from 'react';
import { SITE_CONFIG } from '../../config/site';

interface LegalViewProps {
  type: 'privacidade' | 'termos' | 'cookies';
}

export const LegalView: React.FC<LegalViewProps> = ({ type }) => {
  if (type === 'privacidade') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6F4D84]">
            Privacidade & Segurança de Dados
          </span>
          <h1 className="font-heading text-3xl font-bold text-[#22205A]">
            Política de Privacidade (LGPD)
          </h1>
          <p className="text-xs text-[#7A7394]">
            Conforme a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).
          </p>
        </div>

        <div className="rounded-xl bg-[#FCFAF7] p-6 sm:p-8 border border-[#DAD2C4] space-y-6 text-sm text-[#534D6B] leading-relaxed shadow-xs">
          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#22205A]">1. Princípios e Coleta Mínima</h2>
            <p>
              A Casa 6 segue o princípio da necessidade e da minimização de dados. Nosso formulário de agendamento recolhe exclusivamente os dados essenciais para o primeiro contato: Nome, Sobrenome, WhatsApp, E-mail e o Serviço de interesse.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#22205A]">2. Finalidade do Tratamento</h2>
            <p>
              Os dados coletados destinam-se exclusivamente a:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Iniciar o atendimento individualizado para agendamento de consultas com Bianca Tofoli;</li>
              <li>Encaminhar a mensagem pré-formatada para o canal de WhatsApp oficial;</li>
              <li>Cumprir obrigações legais e regulatórias cabíveis.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#22205A]">3. Confidencialidade Absoluta</h2>
            <p>
              Dados astrológicos e conversas terapêuticas são tratadas sob estrito sigilo profissional. Nunca comercializamos, cedemos ou compartilhamos seus dados com terceiros para fins publicitários não solicitados.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#22205A]">4. Direitos do Titular</h2>
            <p>
              Você tem direito de confirmar a existência de tratamento, acessar seus dados, solicitar correção ou eliminação definitiva a qualquer momento pelo e-mail oficial: <strong className="text-[#22205A]">{SITE_CONFIG.emailContact}</strong>.
            </p>
          </section>
        </div>
      </div>
    );
  }

  if (type === 'termos') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6F4D84]">
            Legislação & Propriedade Intelectual
          </span>
          <h1 className="font-heading text-3xl font-bold text-[#22205A]">
            Termos de Uso e Proteção de Conteúdo
          </h1>
          <p className="text-xs text-[#7A7394]">
            Protegido nos termos da Lei Federal nº 9.610/1998 (Direitos Autorais).
          </p>
        </div>

        <div className="rounded-xl bg-[#FCFAF7] p-6 sm:p-8 border border-[#DAD2C4] space-y-6 text-sm text-[#534D6B] leading-relaxed shadow-xs">
          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#22205A]">1. Direitos Autorais Reservados</h2>
            <p>
              Todo o conteúdo editorial, ensaios, textos do Caderno Astral, metodologias de análise de mapa, design e marcas presentes neste website são de propriedade intelectual exclusiva de <strong className="text-[#22205A]">Bianca Tofoli / Casa 6</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#22205A]">2. Proibição de Reprodução Não Autorizada</h2>
            <p>
              É expressamente proibida a cópia, clonagem, scraping, raspagem automatizada por robôs não autorizados, impressão comercial ou reprodução integral ou parcial sem prévia e expressa autorização por escrito.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#22205A]">3. Natureza dos Atendimentos</h2>
            <p>
              As leituras de Mapa Astral, Revolução Solar e atendimentos integrativos constituem ferramentas de reflexão, orientação e autoconhecimento, não substituindo tratamentos médicos, psiquiátricos, psicológicos ou jurídicos formais.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6F4D84]">
          Transparência Técnica
        </span>
        <h1 className="font-heading text-3xl font-bold text-[#22205A]">
          Política de Cookies
        </h1>
        <p className="text-xs text-[#7A7394]">
          Controle e transparência sobre dados de navegação.
        </p>
      </div>

      <div className="rounded-xl bg-[#FCFAF7] p-6 sm:p-8 border border-[#DAD2C4] space-y-6 text-sm text-[#534D6B] leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-bold text-[#22205A]">1. O que são cookies?</h2>
          <p>
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo pelo navegador para memorizar preferências, manter sessões autenticadas e analisar a performance do website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-lg font-bold text-[#22205A]">2. Categorias que utilizamos</h2>
          <p>
            <strong className="text-[#22205A]">Cookies Estritamente Necessários:</strong> Permitem a navegação segura, integridade do formulário de agendamento e acesso autenticado ao painel administrativo. Não podem ser desativados.
          </p>
          <p>
            <strong className="text-[#22205A]">Cookies Analíticos (GA4 / GTM):</strong> Permitem avaliar o volume de visitas e o desempenho das páginas, ajudando a Casa 6 a aprimorar seus conteúdos. São acionados apenas mediante seu consentimento.
          </p>
        </section>
      </div>
    </div>
  );
};
