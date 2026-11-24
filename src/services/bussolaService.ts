/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo de Serviços da Bússola (Bússola Pessoal, Amorosa e Profissional)
 * Integração: CRM acasa6, Trânsitos Astrológicos e Base de Textos Mensais
 */

import bussolaTransitosData from '../data/bussola_transitos.json';
import bussolaTextosBaseData from '../data/bussola_textos_base.json';
import { CRMContactDetail } from './crmService';

export type BussolaType = 'pessoal' | 'amorosa' | 'profissional';

export interface AstrologicalTransitMonth {
  ano: number;
  mes: number;
  competencia: string; // ex: '11/2026', '12/2026'
  interpretacaoMes: string; // Interpretação oficial do Céu do Mês da Bianca
  primeiraQuinzena?: string;
  segundaQuinzena?: string;
  aspectosRaw: string;
}

export interface BussolaItem {
  id: string;
  tipo: BussolaType;
  competencia: string;
  clienteId?: string;
  nomeCliente: string;
  apelidoCliente: string;
  whatsapp?: string;
  email?: string;
  sol: string;
  lua: string;
  ascendente: string;
  casaAtivada?: number;
  focoMensal: string; // Foco astrológico do mês unificado
  focoPrimeiraQuinzena?: string;
  focoSegundaQuinzena?: string;
  cuidados: string; // Exatamente 3 linhas sem hífens
  diasAstrais: string;
  diasAtencao: string;
  direcionamentoPratico: string; // Exatamente 3 linhas sem hífens
  perguntaDiario: string;
  palavraOrdem: string; // Exatamente 1 palavra
  gerarStatus: 'gerado' | 'pendente' | 'enviado';
  gerarFlag?: string; // 'S' ou vazio
  dataEnvioEmail?: string;
  dataEnvioWhatsapp?: string;
  updatedAt?: string;
}

const LOCAL_STORAGE_TRANSITOS = 'casa6_bussola_transitos';
const LOCAL_STORAGE_ITENS = 'casa6_bussola_itens';

const ZODIAC_SIGNS = [
  'Áries',
  'Touro',
  'Gêmeos',
  'Câncer',
  'Leão',
  'Virgem',
  'Libra',
  'Escorpião',
  'Sagitário',
  'Capricórnio',
  'Aquário',
  'Peixes'
];

/**
 * Calcula a Casa ativada no mês contando os signos a partir do Ascendente (Casa 1) no sentido anti-horário
 */
export function calculateBussolaHouse(ascendente: string, targetSign: string): number {
  if (!ascendente || !targetSign) return 1;
  const cleanAsc = ZODIAC_SIGNS.find((s) => s.toLowerCase() === ascendente.toLowerCase()) || 'Áries';
  const cleanTarget = ZODIAC_SIGNS.find((s) => s.toLowerCase() === targetSign.toLowerCase()) || cleanAsc;

  const ascIndex = ZODIAC_SIGNS.indexOf(cleanAsc);
  const targetIndex = ZODIAC_SIGNS.indexOf(cleanTarget);

  return ((targetIndex - ascIndex + 12) % 12) + 1;
}

/**
 * Extrai o signo principal de um bloco de trânsitos
 */
function extractPrimarySignFromTransit(transitText: string): string {
  if (!transitText) return 'Sagitário';
  for (const sign of ZODIAC_SIGNS) {
    if (transitText.toLowerCase().includes(`em ${sign.toLowerCase()}`)) {
      return sign;
    }
  }
  return 'Sagitário';
}

/**
 * Recupera lista de Trânsitos Astrológicos (armazenamento persistente com fallback do CSV/JSON)
 */
export function getBussolaTransitosList(): AstrologicalTransitMonth[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_TRANSITOS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Erro ao ler trânsitos do localStorage:', e);
    }
  }
  return bussolaTransitosData as AstrologicalTransitMonth[];
}

/**
 * Salva ou atualiza um mês de Trânsitos Astrológicos
 */
export function saveBussolaTransit(transit: AstrologicalTransitMonth): AstrologicalTransitMonth[] {
  const current = getBussolaTransitosList();
  const index = current.findIndex((t) => t.competencia === transit.competencia);
  let updated: AstrologicalTransitMonth[];

  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...transit };
  } else {
    updated = [transit, ...current];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_TRANSITOS, JSON.stringify(updated));
  }
  return updated;
}

/**
 * Recupera todos os itens de Bússola salvos (com fallback da Base Textos Mensais real)
 */
export function getBussolaItemsList(competencia?: string, tipo?: BussolaType): BussolaItem[] {
  let all: BussolaItem[] = [];

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ITENS);
      if (stored) {
        all = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Erro ao ler itens de bússola do localStorage:', e);
    }
  }

  if (!all || all.length === 0) {
    all = (bussolaTextosBaseData as any[]).map((t, idx) => ({
      ...t,
      tipo: t.tipo || 'pessoal',
      gerarStatus: t.gerarStatus || 'gerado',
      focoMensal: t.focoMensal || (t.focoPrimeiraQuinzena && t.focoSegundaQuinzena ? `${t.focoPrimeiraQuinzena} ${t.focoSegundaQuinzena}` : t.focoPrimeiraQuinzena || '')
    })) as BussolaItem[];
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_ITENS, JSON.stringify(all));
    }
  } else {
    all = all.map((item) => ({
      ...item,
      focoMensal: item.focoMensal || (item.focoPrimeiraQuinzena && item.focoSegundaQuinzena ? `${item.focoPrimeiraQuinzena} ${item.focoSegundaQuinzena}` : item.focoPrimeiraQuinzena || '')
    }));
  }

  return all.filter((item) => {
    if (competencia && item.competencia !== competencia) return false;
    if (tipo && item.tipo !== tipo) return false;
    return true;
  });
}

/**
 * Salva ou atualiza um item de Bússola
 */
export function saveBussolaItem(item: BussolaItem): BussolaItem {
  const current = getBussolaItemsList();
  const index = current.findIndex((b) => b.id === item.id);
  let updated: BussolaItem[];

  const itemToSave = {
    ...item,
    updatedAt: new Date().toISOString()
  };

  if (index >= 0) {
    updated = [...current];
    updated[index] = itemToSave;
  } else {
    updated = [itemToSave, ...current];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_ITENS, JSON.stringify(updated));
  }
  return itemToSave;
}

/**
 * Palavras de Ordem tradicionais da Casa 6
 */
const PALAVRAS_DE_ORDEM = [
  'Segurança',
  'Discernimento',
  'Posicionamento',
  'Renovação',
  'Foco',
  'Limite',
  'Paciência',
  'Leveza',
  'Autonomia',
  'Presença',
  'Autoestima',
  'Estrutura',
  'Pragmatismo',
  'Descanso',
  'Firmeza',
  'Centramento',
  'Clareza',
  'Direção',
  'Confiança',
  'Cuidado'
];

/**
 * Motor Gerador no Estilo Editorial e Visceral da Bianca Tófoli
 * Gera os 8 campos oficiais para Bússola Pessoal, Amorosa ou Profissional
 */
export function generateBussolaContentForClient(
  contact: CRMContactDetail,
  transit: AstrologicalTransitMonth,
  tipo: BussolaType = 'pessoal'
): BussolaItem {
  const nomeCompleto = contact.fullName || `${contact.nome} ${contact.sobrenome || ''}`.trim() || 'Cliente';
  const apelido = contact.apelido || contact.nome || nomeCompleto.split(' ')[0] || 'Querida';
  const sol = contact.sol || 'Touro';
  const lua = contact.lua || 'Escorpião';
  const asc = contact.ascendente || 'Virgem';

  const primaryTransitSign = extractPrimarySignFromTransit(transit.primeiraQuinzena || transit.aspectosRaw);
  const casaAtivada = calculateBussolaHouse(asc, primaryTransitSign);

  let focoMensal = '';
  let cuidados = '';
  let diasAstrais = '';
  let diasAtencao = '';
  let direcionamento = '';
  let perguntaDiario = '';
  let palavraOrdem = PALAVRAS_DE_ORDEM[Math.abs((contact.nome.length + casaAtivada) % PALAVRAS_DE_ORDEM.length)];

  if (tipo === 'pessoal') {
    focoMensal = `${apelido}, este mês chega destrancando as principais pendências da sua Casa ${casaAtivada}. O que estava engasgado na sua garganta ganha palavras firmes, discernimento e acolhimento. Seu Ascendente em ${asc} busca ordem na rotina, enquanto a sua Lua em ${lua} precisa aprender a não engolir sapos só para manter uma falsa harmonia ao redor. Os movimentos celestes do mês iluminam as suas prioridades reais e exigem presença consciente no seu próprio ritmo. Com o seu Sol em ${sol}, pare de tentar abraçar o mundo ou resolver a vida de todo mundo na marra: cuide da sua estrutura diária, honre os seus limites e faça da sua paz inegociável.`;
    cuidados = `Não engula incômodos na rotina apenas para evitar conflitos na casa.\nEvite assumir tarefas extras dos outros achando que dá conta de tudo.\nPare de se chicotear exigindo perfeição em cada detalhe do dia a dia.`;
    diasAstrais = `13 e 22/11: Acordos saem e a energia física se renova. Mande a mensagem pendente.`;
    diasAtencao = `09 e 24/11: Tensão nas conversas e mente acelerada. Saia de fininho da confusão.`;
    direcionamento = `Mande aquela mensagem clara resolvendo uma pendência antiga de conversa.\nOrganize uma gaveta ou armário que estava virando depósito de bagunça.\nSepare pelo menos trinta minutos à noite para ficar offline e em silêncio.`;
    perguntaDiario = `O que você tem tanto medo de perder quando tenta controlar tudo ao seu redor em vez de respirar e confiar no seu próprio valor?`;
  } else if (tipo === 'amorosa') {
    focoMensal = `${apelido}, o céu deste mês joga um holofote transparente nas suas relações e na verdade dos seus acordos afetivos. Com a forte ativação na Casa ${casaAtivada}, não dá mais para empurrar desconfortos para debaixo do tapete. Sua Lua em ${lua} busca segurança e reciprocidade genuína, enquanto o Sol em ${sol} pede lealdade aos seus valores mais profundos. O momento pede coragem para abrir o coração em conversas francas e sem joguinhos. Com seu Ascendente em ${asc}, evite transformar pequenos desgastes em tempestades: o amor maduro não exige que você se anule para ser escolhida, mas sim que você construa intimidade com presença, respeito e escuta real.`;
    cuidados = `Não transforme conversas de alinhamento afetivo em tribunais de acusação.\nCuidado para não projetar no parceiro inseguranças que são apenas suas.\nPare de aceitar migalhas de atenção só por medo da solidão ou do vazio.`;
    diasAstrais = `14 e 23/11: Harmonia a dois e diálogos curativos. Proponha um momento a dois.`;
    diasAtencao = `08 e 25/11: Clima inflamado nas trocas e suscetibilidade. Respire antes de responder.`;
    direcionamento = `Fale uma necessidade emocional sua com delicadeza e sem tom de cobrança.\nFaça um gesto de afeto despretensioso para quem caminha ao seu lado.\nReserve uma noite da semana para cuidar exclusivamente da sua autoestima.`;
    perguntaDiario = `Quanto do que você cobra na relação é uma necessidade real de parceria e quanto é apenas carência disfarçada de controle?`;
    palavraOrdem = 'Acolhimento';
  } else {
    // profissional
    focoMensal = `${apelido}, este mês exige ordem cirúrgica, maturidade estratégica e clareza na entrega do seu valor profissional. A ativação direta na sua Casa ${casaAtivada} destrava negociações emperradas e traz o momento ideal para reposicionar os seus serviços e projetos. Com o Sol em ${sol} e o Ascendente em ${asc}, você carrega uma autoridade natural; pare de se apequenar ou aceitar remunerações injustas por mero receio de incomodar. Sua Lua em ${lua} exige que você construa um território de trabalho onde seja genuinamente respeitada. Faça combinados formais, organize o seu cronograma com disciplina e canalize sua energia para onde há retorno concreto.`;
    cuidados = `Evite disputas de ego no ambiente de trabalho para provar que tem razão.\nNão assuma responsabilidades executivas de terceiros sem a devida remuneração.\nContenha a pressa ansiosa de querer ver todos os resultados para ontem.`;
    diasAstrais = `12 e 26/11: Portas profissionais abertas e metas alinhadas. Agende a reunião chave.`;
    diasAtencao = `10 e 24/11: Sobrecarga na equipe e cobranças pesadas. Mantenha a cabeça fria.`;
    direcionamento = `Alinhe uma expectativa profissional em uma conversa franca e documentada.\nRevise e estruture o seu cronograma de entregas dos próximos quinze dias.\nFeche a agenda no horário exato e proíba-se de responder demandas no descanso.`;
    perguntaDiario = `Onde você está hesitando em assumir o seu valor profissional por puro medo do peso que a sua própria autoridade carrega?`;
    palavraOrdem = 'Posicionamento';
  }

  const id = `bussola_${tipo}_${contact.id || Date.now()}_${transit.competencia.replace('/', '_')}`;

  return {
    id,
    tipo,
    competencia: transit.competencia,
    clienteId: contact.id,
    nomeCliente: nomeCompleto,
    apelidoCliente: apelido,
    whatsapp: contact.whatsapp || contact.telefone || '',
    email: contact.email || '',
    sol,
    lua,
    ascendente: asc,
    casaAtivada,
    focoMensal,
    focoPrimeiraQuinzena: focoMensal,
    focoSegundaQuinzena: focoMensal,
    cuidados,
    diasAstrais,
    diasAtencao,
    direcionamentoPratico: direcionamento,
    perguntaDiario,
    palavraOrdem,
    gerarStatus: 'gerado',
    gerarFlag: 'S'
  };
}

/**
 * Renderiza o HTML oficial da Bússola Mobile (440px x 1800px) idêntico ao padrão Casa 6
 */
export function renderBussolaMobileHTML(item: BussolaItem): string {
  const cuidadosLinhas = item.cuidados.split('\n').filter((l) => l.trim().length > 0);
  const cuidadosHTML = cuidadosLinhas.map((linha) => `<li style="margin-bottom: 7px;">${linha.replace(/^[•\-\*]\s*/, '')}</li>`).join('');

  const dirLinhas = item.direcionamentoPratico.split('\n').filter((l) => l.trim().length > 0);
  const dirHTML = dirLinhas.map((linha) => `<p style="margin-bottom: 7px; text-align: justify;">${linha}</p>`).join('');

  const tipoLabel = item.tipo === 'amorosa' ? 'Bússola Amorosa' : item.tipo === 'profissional' ? 'Bússola Profissional' : 'Bússola Pessoal';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${item.nomeCliente} — ${tipoLabel} (${item.competencia})</title>
<style>
  @page {
    size: 440px 1800px;
    margin: 0;
    background-color: #F4EFE6;
  }
  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
  * { box-sizing: border-box; }
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #282566;
    font-size: 13.5px;
    line-height: 1.45;
    background-color: #F4EFE6;
    margin: 0;
    padding: 0;
    width: 440px;
    max-width: 440px;
    margin: 0 auto;
  }
  .header {
    background-color: #282566;
    color: #FFFFFF;
    padding: 45px 25px 35px 25px;
  }
  .header-table { width: 100%; border-collapse: collapse; }
  .header-text-col { width: 75%; vertical-align: top; }
  .header-logo-col { width: 25%; vertical-align: middle; text-align: right; }
  .marca-topo {
    color: #F0B55E;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom: 6px;
  }
  .cliente-nome {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 34px;
    margin: 6px 0 10px 0;
    font-weight: normal;
    color: #FFFFFF;
    line-height: 1.15;
  }
  .subtitulo {
    font-size: 12.5px;
    color: #E6E3F1;
    font-weight: 500;
  }
  .logo-circulo {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    border: 2px solid #F0B55E;
    background: #1D1B48;
    color: #F0B55E;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-family: Georgia, serif;
    font-weight: bold;
  }
  .triade {
    background-color: #E6E3F1;
    color: #282566;
    text-align: left;
    padding: 12px 25px;
    font-size: 11px;
    font-weight: bold;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
  .content { padding: 25px; }
  .box-branca {
    background-color: #FFFFFF;
    border: 1px solid #D5D8CC;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 14px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  }
  .box-title-gold {
    color: #F0B55E;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
  }
  p { margin: 0 0 10px 0; text-align: justify; }
  .section-title-serif {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 20px;
    color: #282566;
    margin: 24px 0 12px 0;
  }
  ul { margin: 0 0 14px 0; padding-left: 20px; }
  li { text-align: justify; line-height: 1.45; }
  .section-title-green {
    font-size: 11px;
    color: #8C987F;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    font-weight: bold;
    margin: 22px 0 10px 0;
  }
  .box-pergunta {
    background-color: #F7E6CD;
    color: #282566;
    font-weight: 600;
    padding: 18px;
    border-radius: 8px;
    margin: 22px 0;
    text-align: justify;
    font-size: 13px;
    line-height: 1.5;
    border-left: 4px solid #F0B55E;
  }
  .box-final {
    background-color: #282566;
    border: 2px solid #F0B55E;
    border-radius: 8px;
    text-align: center;
    padding: 28px 16px;
    margin-top: 14px;
    color: #FFFFFF;
  }
  .palavra-label {
    font-family: Georgia, serif;
    font-size: 18px;
    color: #FFFFFF;
    margin-bottom: 12px;
  }
  .palavra-destaque {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 42px;
    color: #F0B55E;
    font-style: italic;
    letter-spacing: 1px;
    font-weight: bold;
  }
  .footer-marca {
    text-align: center;
    font-size: 9.5px;
    color: #8C8E82;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-top: 28px;
    margin-bottom: 15px;
  }
</style>
</head>
<body>
  <div class="header">
    <table class="header-table">
      <tr>
        <td class="header-text-col">
          <div class="marca-topo">CASA 6 • PATOTA ASTRAL</div>
          <h1 class="cliente-nome">${item.nomeCliente}</h1>
          <div class="subtitulo">${tipoLabel} • ${item.competencia}</div>
        </td>
        <td class="header-logo-col">
          <div class="logo-circulo">C6</div>
        </td>
      </tr>
    </table>
  </div>

  <div class="triade">
    SOL: ${item.sol.toUpperCase()} &nbsp;&nbsp;|&nbsp;&nbsp; ASC: ${item.ascendente.toUpperCase()} &nbsp;&nbsp;|&nbsp;&nbsp; LUA: ${item.lua.toUpperCase()}
  </div>

  <div class="content">
    <div class="box-branca" style="margin-top: 4px;">
      <div class="box-title-gold">FOCO ASTROLÓGICO DO MÊS</div>
      <p style="margin: 0; line-height: 1.55; text-align: justify;">${item.focoMensal || item.focoPrimeiraQuinzena}</p>
    </div>

    <h2 class="section-title-serif">Cuidados & Pontos de Atenção</h2>
    <ul>
      ${cuidadosHTML}
    </ul>

    <div class="box-branca" style="margin-top: 16px;">
      <div class="box-title-gold">DIAS ASTRAIS</div>
      <p style="margin: 0;">${item.diasAstrais}</p>
    </div>

    <div class="box-branca">
      <div class="box-title-gold">DIAS DE ATENÇÃO</div>
      <p style="margin: 0;">${item.diasAtencao}</p>
    </div>

    <div class="section-title-green">DIRECIONAMENTO PRÁTICO</div>
    ${dirHTML}

    <div class="box-pergunta">
      ${item.perguntaDiario}
    </div>

    <div class="box-final">
      <div class="palavra-label">A sua principal chave do mês se resume<br>em</div>
      <div class="palavra-destaque">${item.palavraOrdem}</div>
    </div>

    <div class="footer-marca">CASA 6 • DIRECIONAMENTO E PRÁTICA NA ROTINA</div>
  </div>
</body>
</html>`;
}

/**
 * Abre a janela de visualização e aciona a impressão/download de PDF
 */
export function downloadBussolaPDF(item: BussolaItem): void {
  const html = renderBussolaMobileHTML(item);
  const printWindow = window.open('', '_blank', 'width=480,height=900,scrollbars=yes');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  }
}

/**
 * Formata o texto completo da Bússola para envio via WhatsApp
 */
export function formatBussolaWhatsAppMessage(item: BussolaItem): string {
  const tipoLabel = item.tipo === 'amorosa' ? 'Bússola Amorosa' : item.tipo === 'profissional' ? 'Bússola Profissional' : 'Bússola Pessoal';
  return `✨ *${tipoLabel.toUpperCase()} — CASA 6* ✨
*Mês:* ${item.competencia}
*Consulente:* ${item.nomeCliente} (${item.apelidoCliente})
*Tríade:* Sol em ${item.sol} | Ascendente em ${item.ascendente} | Lua em ${item.lua}
${item.casaAtivada ? `*Casa Ativada:* Casa ${item.casaAtivada}` : ''}

━━━━━━━━━━━━━━━━━━━━
✨ *FOCO ASTROLÓGICO DO MÊS:*
${item.focoMensal || item.focoPrimeiraQuinzena}

⚠️ *CUIDADOS & PONTOS DE ATENÇÃO:*
${item.cuidados}

🟢 *DIAS ASTRAIS:*
${item.diasAstrais}

🛑 *DIAS DE ATENÇÃO:*
${item.diasAtencao}

🌿 *DIRECIONAMENTO PRÁTICO:*
${item.direcionamentoPratico}

📖 *PERGUNTA PARA O SEU DIÁRIO:*
"${item.perguntaDiario}"

🔑 *A SUA PALAVRA DE ORDEM:*
*${item.palavraOrdem.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━
_Com carinho e direção,_
_Bianca Tófoli • Casa 6_`;
}

/**
 * Disparo para o WhatsApp da cliente
 */
export function sendBussolaViaWhatsApp(item: BussolaItem): void {
  const text = formatBussolaWhatsAppMessage(item);
  const rawPhone = (item.whatsapp || '').replace(/\D/g, '');
  const cleanPhone = rawPhone.startsWith('55') ? rawPhone : `55${rawPhone}`;
  const encodedText = encodeURIComponent(text);

  saveBussolaItem({
    ...item,
    dataEnvioWhatsapp: new Date().toLocaleDateString('pt-BR')
  });

  if (cleanPhone && cleanPhone.length >= 10) {
    window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
  } else {
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  }
}

/**
 * Disparo por E-mail (mailto ou webhook)
 */
export function sendBussolaViaEmail(item: BussolaItem): void {
  const tipoLabel = item.tipo === 'amorosa' ? 'Bússola Amorosa' : item.tipo === 'profissional' ? 'Bússola Profissional' : 'Bússola Pessoal';
  const subject = encodeURIComponent(`Sua ${tipoLabel} do Mês (${item.competencia}) — Casa 6`);
  const bodyText = formatBussolaWhatsAppMessage(item);
  const encodedBody = encodeURIComponent(bodyText);

  saveBussolaItem({
    ...item,
    dataEnvioEmail: new Date().toLocaleDateString('pt-BR')
  });

  const email = item.email || '';
  window.open(`mailto:${email}?subject=${subject}&body=${encodedBody}`, '_blank');
}
