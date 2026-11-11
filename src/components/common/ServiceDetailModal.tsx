/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Modal de Detalhamento Profundo de Atendimentos (SEO & Indexação LLM)
 */

import React from 'react';
import { X, CheckCircle, Clock, Calendar, Sparkles, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { ServiceItem } from '../../types';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (serviceId: string) => void;
}

// Detalhamentos profundos enriquecidos para SEO, clareza e autoridade
const DETAILED_SERVICE_CONTENT: Record<string, {
  whatIs: string;
  whoIsFor: string;
  methodology: string;
  deliverables: string[];
  duration: string;
  format: string;
}> = {
  'pronto-socorro-astrologico': {
    whatIs: 'O Pronto Socorro Astrológico é uma consulta focada e imediata de intervenção cósmica para momentos de encruzilhada, tomadas de decisão urgentes, crises de clareza ou momentos de forte instabilidade emocional e profissional. Diferente de leituras gerais, analisamos os trânsitos exatos que estão ativando o seu mapa natal no exato momento.',
    whoIsFor: 'Indicado para quem precisa de respostas rápidas sobre prazos, negociações societárias, dilemas de relacionamento ou alinhamento frente a trânsitos pesados como eclipses e quadraturas planetárias.',
    methodology: 'Investigação sinastral e temporal dos trânsitos vigentes (Saturno, Plutão, Urano e Nódulos Lunares) em diálogo direto com as casas astrológicas do consulente.',
    deliverables: [
      'Sessão ao vivo de 50 minutos com Bianca Tofoli',
      'Gravação em áudio de alta definição para escutar quando precisar',
      'Resumo com as principais datas-chave de desbloqueio',
      'Suporte via WhatsApp por 48 horas após a consulta'
    ],
    duration: '50 minutos',
    format: 'Online via Google Meet ou presencial em SP'
  },
  'acompanhamento-astral-mensal': {
    whatIs: 'O Acompanhamento Astral Mensal é um processo contínuo de mentoria biográfica e astrológica. Em cada mês, analisamos a lunação em vigor, a revolução lunar do período e como os planetas ativam seus projetos, relacionamentos e saúde física e emocional.',
    whoIsFor: 'Ideal para líderes, empreendedores, terapeutas e pessoas em processos profundos de transição de vida que desejam ter na astrologia uma bússola de gestão pessoal e profissional.',
    methodology: 'Acompanhamento ciclo a ciclo (Lua Nova, Quarto Crescente, Lua Cheia e Minguante), sincronizando agendas de trabalho e pausas vitais aos movimentos astronômicos.',
    deliverables: [
      '1 sessão mensal aprofundada de 60 minutos',
      'Planejador cósmico mensal personalizado em PDF',
      'Canal direto de áudios via WhatsApp com Bianca Tofoli para momentos de transição',
      'Acesso prioritário a vagas nas vivências da Casa 6'
    ],
    duration: '60 minutos por mês (recorrente)',
    format: 'Online individual'
  },
  'mapa-natal-nascimento': {
    whatIs: 'O Mapa Natal é o atendimento primordial e a espinha dorsal de todo o trabalho da Casa 6. É a fotografia exata do céu no instante e local do seu nascimento. Uma bússola arquetípica completa que desvenda a estrutura da sua personalidade, talentos inatos, feridas ancestrais (Quíron), propósito vocacional (Meio do Céu) e dinâmicas afetivas (Vênus e Casa 7).',
    whoIsFor: 'Para qualquer pessoa que busca autoconhecimento genuíno, libertação de padrões inconscientes de repetição e um reencontro com a própria essência sem misticismos rasos.',
    methodology: 'Astrologia psicológica humanista e contemporânea integrada à escuta terapêutica acolhedora. Bianca traduz símbolos complexos em clareza lúcida e prática para o cotidiano.',
    deliverables: [
      'Sessão completa individual de 90 minutos',
      'Gravação integral em áudio MP3 para download permanente',
      'Mandala astrológica gráfica de alta resolução',
      'Guia com os principais pontos focais do seu mapa'
    ],
    duration: '90 minutos',
    format: 'Online ou presencial'
  },
  'planejamento-astral-mensal': {
    whatIs: 'Uma sessão estratégica avulsa focada no planejamento do seu próximo ciclo de 30 a 60 dias. Mapeia os melhores períodos para lançamentos, contratos, viagens, cirurgias ou descansos estratégicos.',
    whoIsFor: 'Profissionais autônomos, gestores e indivíduos que precisam planejar um período importante com máxima assertividade temporal.',
    methodology: 'Cruzamento dos trânsitos dos planetas rápidos (Mercúrio, Vênus, Marte) com as casas de produtividade (Casas 2, 6 e 10) do consulente.',
    deliverables: [
      'Sessão estratégica de 60 minutos',
      'Cronograma com janelas de oportunidade e datas de cautela',
      'Áudio da sessão'
    ],
    duration: '60 minutos',
    format: 'Online'
  },
  'mapa-revolucao-solar': {
    whatIs: 'Calculada para o instante exato em que o Sol retorna à mesma posição do seu nascimento no dia do seu aniversário. Revela a atmosfera, prioridades, desafios e oportunidades exclusivas daquele ciclo de 12 meses.',
    whoIsFor: 'Recomendada para ser realizada nas semanas que antecedem ou sucedem o seu aniversário de nascimento.',
    methodology: 'Superposição do Mapa da Revolução Solar com o Mapa Natal (sinastria natal/anual) e análise das profecções e fardárias.',
    deliverables: [
      'Sessão profunda de 75 a 90 minutos',
      'Análise de relocação geográfica (melhor cidade para passar o aniversário se aplicável)',
      'Gravação completa em áudio',
      'Mapa gráfico do ano'
    ],
    duration: '90 minutos',
    format: 'Online ou presencial'
  },
  'combo-mapa-roda-revolucao': {
    whatIs: 'A experiência astrológica mais completa e profunda da Casa 6. Combina a leitura detalhada do seu Mapa Natal (quem você é na essência), a Roda Astrológica (diagnóstico das 12 áreas de vida no presente) e a Revolução Solar (as tendências do seu próximo ano).',
    whoIsFor: 'Para quem deseja um mergulho definitivo e transformador em sua história biográfica com acompanhamento de excelência.',
    methodology: 'Abordagem multidimensional integrando os arquétipos primordiais aos trânsitos de curto e longo prazo.',
    deliverables: [
      '2 encontros individuais de 90 minutos cada',
      'Relatório editorial completo',
      'Gravações completas em áudio',
      'Acompanhamento de 15 dias via WhatsApp para tirar dúvidas'
    ],
    duration: '2 sessões de 90 minutos (3 horas no total)',
    format: 'Online ou presencial'
  },
  'combo-mapa-roda-terapias': {
    whatIs: 'Uma jornada integrativa que une o intelecto e o corpo sutil. Após a leitura lúcida do Mapa Natal e da Roda Astrológica, realizamos 2 sessões energéticas presenciais de Barras de Access ou Reiki para dissolver crenças limitantes e alinhar os centros vitais.',
    whoIsFor: 'Pessoas com sobrecarga mental, estresse crônico, dificuldades para relaxar ou que sentem que "entenderam racionalmente o mapa", mas precisam sentir a liberação no corpo físico.',
    methodology: 'Integração de Astrologia Psicológica com técnicas somáticas de toque nos 32 pontos cerebrais (Barras de Access) e harmonização com Reiki tradicional.',
    deliverables: [
      '1 sessão de Mapa Natal e Roda Astrológica (90 minutos)',
      '2 sessões presenciais de Barras de Access ou Reiki (60 minutos cada)',
      'Áudio da leitura astrológica'
    ],
    duration: '3 encontros (total de 3h30)',
    format: 'Presencial em São Paulo'
  }
};

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onBook
}) => {
  if (!isOpen || !service) return null;

  const details = DETAILED_SERVICE_CONTENT[service.id] || {
    whatIs: service.shortDescription,
    whoIsFor: 'Indicado para todas as pessoas em busca de autoconhecimento lúcido e transformação prática.',
    methodology: 'Astrologia humanista contemporânea focada em autonomia e propósito.',
    deliverables: ['Sessão individual com Bianca Tofoli', 'Gravação completa em áudio', 'Suporte'],
    duration: '60 a 90 minutos',
    format: 'Online ou presencial'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#2B2566]/85 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#FCFAF7] border border-[#F0B55E] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header do Modal com Imagem e Título */}
        <div className="relative bg-[#2B2566] text-white p-6 sm:p-8 shrink-0 overflow-hidden">
          {/* Fundo Estelar */}
          <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${service.tarotImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2566] via-[#2B2566]/90 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between pb-1 pr-10">
              <img
                src="https://static.wixstatic.com/media/02c8e0_916db28bdef7413a82fde89b9ce7f738~mv2.png"
                alt="Casa 6"
                className="h-6 w-auto object-contain opacity-90"
              />
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F0B55E] bg-[#181343]/80 px-2.5 py-1 rounded-full border border-[#F0B55E]/40">
                <Sparkles className="h-3 w-3" />
                <span>{service.badge || service.categoryGroup?.toUpperCase() || 'ATENDIMENTO'}</span>
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white tracking-tight">
              {service.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#E6E3F1] pt-1">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#F0B55E]" />
                {details.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#F0B55E]" />
                {details.format}
              </span>
            </div>
          </div>
        </div>

        {/* Corpo com Informações Ricas para SEO e LLM */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-[#1b1463]">
          
          {/* O que é */}
          <div className="space-y-2">
            <h3 className="font-heading text-lg font-bold text-[#1b1463] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#fab03b] rounded-full" />
              O que é este atendimento?
            </h3>
            <p className="text-xs sm:text-sm text-[#372B69] leading-relaxed">
              {details.whatIs}
            </p>
          </div>

          {/* Para quem é */}
          <div className="space-y-2">
            <h3 className="font-heading text-lg font-bold text-[#1b1463] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#fab03b] rounded-full" />
              Para quem é recomendado?
            </h3>
            <p className="text-xs sm:text-sm text-[#372B69] leading-relaxed">
              {details.whoIsFor}
            </p>
          </div>

          {/* O que está incluso */}
          <div className="space-y-3 bg-[#d8d6c8]/40 p-5 rounded-xl border border-[#c7c5b6]">
            <h3 className="font-heading text-base font-bold text-[#1b1463] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#fab03b]" />
              O que está incluso na sua consulta:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#1b1463]">
              {details.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Metodologia */}
          <div className="space-y-2">
            <h3 className="font-heading text-base font-bold text-[#1b1463]">
              Metodologia de Bianca Tofoli:
            </h3>
            <p className="text-xs sm:text-sm text-[#372B69] leading-relaxed">
              {details.methodology}
            </p>
          </div>
        </div>

        {/* Rodapé com CTA para o Formulário Master do WhatsApp */}
        <div className="p-4 sm:p-6 bg-[#FCFAF7] border-t border-[#c7c5b6] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-center sm:text-left">
            <span className="text-[11px] text-[#6a62b8] font-bold uppercase tracking-wider block">
              Consulta com Bianca Tofoli
            </span>
            <span className="text-xs text-[#372B69]">
              Agendamento direto pelo WhatsApp Oficial
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBook(service.id);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white px-7 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-lg transition-all cursor-pointer transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4 fill-white" />
            <span>AGENDAR ESTE ATENDIMENTO</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
