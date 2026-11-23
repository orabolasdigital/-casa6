/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Motor Astrológico & Efemérides Estilo Astrolink (AstroEngine Pro)
 *
 * Funcionalidades:
 * - Cálculo de longitude eclíptica para todos os corpos celestes (Sol, Lua, Mercúrio, Vênus, Marte, Júpiter, Saturno, Urano, Netuno, Plutão, Quíron, Nodo Norte, Lilith)
 * - Cálculo das 12 Casas Astrológicas e Cúspides com Ascendente e Meio do Céu
 * - Matriz de Aspectos Planetários (Conjunção, Sextil, Quadratura, Trígono, Oposição) com orbes
 * - Balanço dos 4 Elementos, 3 Modalidades e Polaridades Yang/Yin
 * - Biblioteca de Interpretações Personalizadas estilo Astrolink / Casa 6
 */

export const ASTRO_SIGNS = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer',
  'Leão', 'Virgem', 'Libra', 'Escorpião',
  'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
] as const;

export type AstroSign = typeof ASTRO_SIGNS[number];

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const SIGN_SYMBOLS: Record<string, string> = {
  'Áries': '♈',
  'Touro': '♉',
  'Gêmeos': '♊',
  'Câncer': '♋',
  'Leão': '♌',
  'Virgem': '♍',
  'Libra': '♎',
  'Escorpião': '♏',
  'Sagitário': '♐',
  'Capricórnio': '♑',
  'Aquário': '♒',
  'Peixes': '♓'
};

export const SIGN_ELEMENTS: Record<string, 'Fogo' | 'Terra' | 'Ar' | 'Água'> = {
  'Áries': 'Fogo',
  'Touro': 'Terra',
  'Gêmeos': 'Ar',
  'Câncer': 'Água',
  'Leão': 'Fogo',
  'Virgem': 'Terra',
  'Libra': 'Ar',
  'Escorpião': 'Água',
  'Sagitário': 'Fogo',
  'Capricórnio': 'Terra',
  'Aquário': 'Ar',
  'Peixes': 'Água'
};

export const SIGN_MODALITIES: Record<string, 'Cardinal' | 'Fixo' | 'Mutável'> = {
  'Áries': 'Cardinal',
  'Touro': 'Fixo',
  'Gêmeos': 'Mutável',
  'Câncer': 'Cardinal',
  'Leão': 'Fixo',
  'Virgem': 'Mutável',
  'Libra': 'Cardinal',
  'Escorpião': 'Fixo',
  'Sagitário': 'Mutável',
  'Capricórnio': 'Cardinal',
  'Aquário': 'Fixo',
  'Peixes': 'Mutável'
};

export const SIGN_RULERS: Record<string, string> = {
  'Áries': 'Marte ♂',
  'Touro': 'Vênus ♀',
  'Gêmeos': 'Mercúrio ☿',
  'Câncer': 'Lua ☽',
  'Leão': 'Sol ☉',
  'Virgem': 'Mercúrio ☿',
  'Libra': 'Vênus ♀',
  'Escorpião': 'Plutão ♇ / Marte ♂',
  'Sagitário': 'Júpiter ♃',
  'Capricórnio': 'Saturno ♄',
  'Aquário': 'Urano ♅ / Saturno ♄',
  'Peixes': 'Netuno ♆ / Júpiter ♃'
};

export const ELEMENT_COLORS: Record<'Fogo' | 'Terra' | 'Ar' | 'Água', { bg: string; text: string; hex: string }> = {
  'Fogo': { bg: 'bg-rose-50 border-rose-200 text-rose-700', text: 'text-rose-600', hex: '#EF4444' },
  'Terra': { bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', text: 'text-emerald-700', hex: '#10B981' },
  'Ar': { bg: 'bg-amber-50 border-amber-200 text-amber-800', text: 'text-amber-700', hex: '#F59E0B' },
  'Água': { bg: 'bg-blue-50 border-blue-200 text-blue-800', text: 'text-blue-700', hex: '#3B82F6' }
};

export interface PlanetPosition {
  id: string;
  name: string;
  symbol: string;
  longitude: number;
  sign: string;
  signDegree: number;
  signMinute: number;
  house: number;
  element: 'Fogo' | 'Terra' | 'Ar' | 'Água';
  modality: 'Cardinal' | 'Fixo' | 'Mutável';
  isRetrograde: boolean;
  keywords: string[];
  interpretation: string;
}

export interface HouseCusp {
  houseNumber: number;
  roman: string;
  sign: string;
  degree: number;
  minute: number;
  longitude: number;
  rulingPlanet: string;
  areaOfLife: string;
}

export interface AstroAspect {
  planet1: string;
  planet1Symbol: string;
  planet2: string;
  planet2Symbol: string;
  type: 'Conjunção' | 'Sextil' | 'Quadratura' | 'Trígono' | 'Oposição';
  symbol: string;
  angle: number;
  orb: number;
  isHarmonious: boolean;
  color: string;
  description: string;
}

export interface NatalChartData {
  clientName: string;
  birthDateStr: string;
  birthTimeStr: string;
  city: string;
  state: string;
  age?: number;
  sunSign: string;
  moonSign: string;
  ascendantSign: string;
  midheavenSign: string;
  planets: PlanetPosition[];
  houses: HouseCusp[];
  aspects: AstroAspect[];
  elementsBalance: {
    fogo: { count: number; percentage: number };
    terra: { count: number; percentage: number };
    ar: { count: number; percentage: number };
    agua: { count: number; percentage: number };
    dominant: string;
  };
  modalitiesBalance: {
    cardinal: { count: number; percentage: number };
    fixo: { count: number; percentage: number };
    mutavel: { count: number; percentage: number };
    dominant: string;
  };
  polaritiesBalance: {
    yang: { count: number; percentage: number };
    yin: { count: number; percentage: number };
  };
  interpretations: {
    essence: string;
    emotions: string;
    ascendant: string;
    mind: string;
    relationships: string;
    drive: string;
    expansion: string;
    lessons: string;
    woundsAndHealing: string;
    vocation: string;
  };
}

// Utilitários de Data e Horário
export function parseDate(dateStr?: string): { day: number; month: number; year: number } | null {
  if (!dateStr) return null;
  const parts = dateStr.split(/[\/\-\.]/);
  if (parts.length < 3) return null;
  let day: number, month: number, year: number;
  if (parts[0].length === 4) {
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    day = parseInt(parts[2], 10);
  } else {
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    year = parseInt(parts[2], 10);
  }
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (year < 100) year += year > 30 ? 1900 : 2000;
  return { day, month, year };
}

export function parseTime(timeStr?: string): { hour: number; minute: number } | null {
  if (!timeStr) return null;
  const parts = timeStr.split(/[:hH]/);
  if (parts.length < 1) return null;
  const hour = parseInt(parts[0], 10);
  const minute = parts.length > 1 ? parseInt(parts[1], 10) : 0;
  if (isNaN(hour)) return null;
  return { hour: Math.min(23, Math.max(0, hour)), minute: isNaN(minute) ? 0 : Math.min(59, Math.max(0, minute)) };
}

export function calculateAge(day?: number, month?: number, year?: number, dateStr?: string): number | undefined {
  if (!day || !month || !year) {
    if (dateStr) {
      const parsed = parseDate(dateStr);
      if (parsed) {
        day = parsed.day;
        month = parsed.month;
        year = parsed.year;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  const m = today.getMonth() + 1 - month;
  if (m < 0 || (m === 0 && today.getDate() < day)) {
    age--;
  }
  return age >= 0 && age < 130 ? age : undefined;
}

export function getSunSign(day?: number, month?: number): string {
  if (!day || !month) return '';
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Áries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Touro';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gêmeos';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Câncer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leão';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgem';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Escorpião';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagitário';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricórnio';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquário';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Peixes';
  return 'Áries';
}

export function getAscendant(sunSign: string, hour?: number, minute?: number): string {
  if (!sunSign) return '';
  const sunIdx = ASTRO_SIGNS.indexOf(sunSign as AstroSign);
  if (sunIdx === -1) return '';
  const totalMinutes = (hour !== undefined && hour !== null ? hour : 12) * 60 + (minute || 0);
  const shiftFrom6am = ((totalMinutes - 360 + 1440) % 1440);
  const signShift = Math.floor(shiftFrom6am / 120);
  return ASTRO_SIGNS[(sunIdx + signShift) % 12];
}

export function getMoonSign(year?: number, month?: number, day?: number): string {
  if (!year || !month || !day) return '';
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const daysSince1970 = date.getTime() / (1000 * 60 * 60 * 24);
  const moonLong = (190.5 + daysSince1970 * 13.176396) % 360;
  const positiveLong = (moonLong + 360) % 360;
  const signIdx = Math.floor(positiveLong / 30);
  return ASTRO_SIGNS[signIdx % 12];
}

export function getVenusSign(year?: number, month?: number, day?: number): string {
  if (!year || !month || !day) return '';
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const daysSince2000 = (date.getTime() - 946684800000) / (1000 * 60 * 60 * 24);
  const venusLong = (181.979 + daysSince2000 * 1.60213) % 360;
  const signIdx = Math.floor(((venusLong + 360) % 360) / 30);
  return ASTRO_SIGNS[signIdx % 12];
}

export function getMarsSign(year?: number, month?: number, day?: number): string {
  if (!year || !month || !day) return '';
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const daysSince2000 = (date.getTime() - 946684800000) / (1000 * 60 * 60 * 24);
  const marsLong = (355.433 + daysSince2000 * 0.52403) % 360;
  const signIdx = Math.floor(((marsLong + 360) % 360) / 30);
  return ASTRO_SIGNS[signIdx % 12];
}

export function getJupiterSign(year?: number, month?: number, day?: number): string {
  if (!year || !month || !day) return '';
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const daysSince2000 = (date.getTime() - 946684800000) / (1000 * 60 * 60 * 24);
  const jupiterLong = (34.351 + daysSince2000 * 0.08308) % 360;
  const signIdx = Math.floor(((jupiterLong + 360) % 360) / 30);
  return ASTRO_SIGNS[signIdx % 12];
}

export function getSaturnSign(year?: number, month?: number, day?: number): string {
  if (!year || !month || !day) return '';
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const daysSince2000 = (date.getTime() - 946684800000) / (1000 * 60 * 60 * 24);
  const saturnLong = (50.077 + daysSince2000 * 0.03346) % 360;
  const signIdx = Math.floor(((saturnLong + 360) % 360) / 30);
  return ASTRO_SIGNS[signIdx % 12];
}

export function getChironSign(year?: number, month?: number, day?: number): string {
  if (!year || !month || !day) return '';
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const daysSince2000 = (date.getTime() - 946684800000) / (1000 * 60 * 60 * 24);
  const chironLong = (247.0 + daysSince2000 * 0.0194) % 360;
  const signIdx = Math.floor(((chironLong + 360) % 360) / 30);
  return ASTRO_SIGNS[signIdx % 12];
}

export function getMidheaven(ascSign?: string): string {
  if (!ascSign) return '';
  const idx = ASTRO_SIGNS.indexOf(ascSign as AstroSign);
  if (idx === -1) return '';
  return ASTRO_SIGNS[(idx + 9) % 12];
}

export function inferGender(rawName?: string, existingGender?: string): 'Feminino' | 'Masculino' {
  if (existingGender) {
    const g = existingGender.trim().toLowerCase();
    if (g.startsWith('f')) return 'Feminino';
    if (g.startsWith('m')) return 'Masculino';
  }
  if (!rawName) return 'Feminino';
  const cleanFirst = rawName
    .replace(/[^\p{L}\s]/gu, '')
    .trim()
    .split(/\s+/)[0]
    .toLowerCase();

  const KNOWN_MALE = new Set([
    'fabio', 'fábio', 'adivaldo', 'adriano', 'alexandre', 'anderson', 'andre', 'andré',
    'antonio', 'antônio', 'bruno', 'caio', 'carlos', 'cesar', 'césar', 'claudio', 'cláudio',
    'daniel', 'diego', 'eduardo', 'felipe', 'fernando', 'gabriel', 'guilherme', 'gustavo',
    'henrique', 'igor', 'joao', 'joão', 'jose', 'josé', 'julio', 'júlio', 'leonardo',
    'lucas', 'luis', 'luís', 'luiz', 'marcelo', 'marcio', 'márcio', 'marcos', 'mateus',
    'matheus', 'paulo', 'pedro', 'rafael', 'renato', 'ricardo', 'roberto', 'rodrigo',
    'sergio', 'sérgio', 'thiago', 'tiago', 'victor', 'vinicius', 'vitor'
  ]);

  if (!cleanFirst) return 'Feminino';
  if (KNOWN_MALE.has(cleanFirst)) return 'Masculino';
  if (cleanFirst.endsWith('a') || cleanFirst.endsWith('e') || cleanFirst.endsWith('i') || cleanFirst.endsWith('y')) {
    return 'Feminino';
  }
  return 'Masculino';
}

export function cleanPhone(ddd?: string, tel?: string): { ddd: string; telefone: string; whatsapp: string } {
  const raw = `${ddd || ''}${tel || ''}`.replace(/\D/g, '');
  if (!raw) return { ddd: '', telefone: '', whatsapp: '' };

  let extractedDdd = '';
  let extractedTel = '';
  let formattedWhatsapp = '';

  if (raw.length === 11) {
    extractedDdd = raw.slice(0, 2);
    extractedTel = `${raw.slice(2, 7)}-${raw.slice(7)}`;
    formattedWhatsapp = `(${extractedDdd}) ${extractedTel}`;
  } else if (raw.length === 10) {
    extractedDdd = raw.slice(0, 2);
    extractedTel = `${raw.slice(2, 6)}-${raw.slice(6)}`;
    formattedWhatsapp = `(${extractedDdd}) ${extractedTel}`;
  } else {
    extractedDdd = (ddd || '').replace(/\D/g, '');
    extractedTel = (tel || '').trim();
    formattedWhatsapp = raw;
  }

  return { ddd: extractedDdd, telefone: extractedTel, whatsapp: formattedWhatsapp };
}

export function calculateAstroProfile(birthDateStr?: string, birthTimeStr?: string): {
  idade?: number;
  mesNascimento: string;
  mesNumero?: number;
  diaNascimento: string;
  anoNascimento: string;
  sol: string;
  ascendente: string;
  lua: string;
  venus: string;
  marte: string;
  quiron: string;
  jupiter: string;
  saturno: string;
  meioDoCeu: string;
} {
  const parsedDate = parseDate(birthDateStr);
  const parsedTime = parseTime(birthTimeStr);

  if (!parsedDate) {
    return {
      idade: undefined,
      mesNascimento: '',
      mesNumero: undefined,
      diaNascimento: '',
      anoNascimento: '',
      sol: '',
      ascendente: '',
      lua: '',
      venus: '',
      marte: '',
      quiron: '',
      jupiter: '',
      saturno: '',
      meioDoCeu: ''
    };
  }

  const { day, month, year } = parsedDate;
  const hour = parsedTime ? parsedTime.hour : 12;
  const minute = parsedTime ? parsedTime.minute : 0;

  const idade = calculateAge(day, month, year);
  const mesNascimento = MONTH_NAMES[month - 1] || '';
  const mesNumero = month;
  const diaNascimento = String(day).padStart(2, '0');
  const anoNascimento = String(year);

  const sol = getSunSign(day, month);
  const ascendente = getAscendant(sol, hour, minute);
  const lua = getMoonSign(year, month, day);
  const venus = getVenusSign(year, month, day);
  const marte = getMarsSign(year, month, day);
  const jupiter = getJupiterSign(year, month, day);
  const saturno = getSaturnSign(year, month, day);
  const quiron = getChironSign(year, month, day);
  const meioDoCeu = getMidheaven(ascendente);

  return {
    idade,
    mesNascimento,
    mesNumero,
    diaNascimento,
    anoNascimento,
    sol,
    ascendente,
    lua,
    venus,
    marte,
    quiron,
    jupiter,
    saturno,
    meioDoCeu
  };
}

// -------------------------------------------------------------
// MOTOR COMPLETO ESTILO ASTROLINK (EFEMÉRIDES + MANDALA + CASAS)
// -------------------------------------------------------------

function normDeg(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function degToSignAndDegree(deg: number): { sign: string; signDegree: number; signMinute: number } {
  const norm = normDeg(deg);
  const signIndex = Math.floor(norm / 30);
  const sign = ASTRO_SIGNS[signIndex % 12];
  const remain = norm % 30;
  const signDegree = Math.floor(remain);
  const signMinute = Math.floor((remain - signDegree) * 60);
  return { sign, signDegree, signMinute };
}

const HOUSE_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const HOUSE_AREAS: Record<number, string> = {
  1: 'Identidade, Corpo & Primeira Impressão',
  2: 'Recursos Materiais, Autoestima & Finanças',
  3: 'Comunicação, Mente Prática & Entorno',
  4: 'Lar, Raízes Familiares & Base Emocional',
  5: 'Criatividade, Prazer, Autoexpressão & Romances',
  6: 'Rotina, Saúde, Trabalho Diário & Hábitos',
  7: 'Relacionamentos, Parcerias & Casamento',
  8: 'Transformação Profunda, Regeneração & Crises',
  9: 'Expansão da Consciência, Filosofia & Viagens',
  10: 'Carreira, Propósito de Vida & Reconhecimento',
  11: 'Amizades, Projetos Coletivos & Esperança no Futuro',
  12: 'Espiritualidade, Inconsciente & Encerramentos'
};

/**
 * Calcula o Mapa Astral Completo estilo Astrolink
 */
export function calculateFullNatalChart(
  clientName: string,
  birthDateStr: string,
  birthTimeStr: string,
  city = 'São Paulo',
  state = 'SP'
): NatalChartData {
  const parsedDate = parseDate(birthDateStr) || { day: 15, month: 5, year: 1995 };
  const parsedTime = parseTime(birthTimeStr) || { hour: 12, minute: 0 };
  const { day, month, year } = parsedDate;
  const { hour, minute } = parsedTime;

  const age = calculateAge(day, month, year);

  // Dias decorridos desde J2000.0 (1 de Janeiro de 2000, 12h UTC)
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour + 3, minute, 0)); // Aproximação fuso BR (-3)
  const daysSince2000 = (utcDate.getTime() - 946684800000) / (1000 * 60 * 60 * 24);

  // 1. Sol
  const sunMeanLong = normDeg(280.46 + 0.9856474 * daysSince2000);
  const sunMeanAnomaly = (357.528 + 0.9856003 * daysSince2000) * (Math.PI / 180);
  const sunLong = normDeg(sunMeanLong + 1.915 * Math.sin(sunMeanAnomaly) + 0.02 * Math.sin(2 * sunMeanAnomaly));

  // 2. Ascendente e Meio do Céu
  // Tempo Sideral Local aproximado
  const lstHours = (6.6974 + 0.0657098 * daysSince2000 + hour + minute / 60) % 24;
  const ramc = normDeg(lstHours * 15);
  // MC = RAMC
  const mcLong = ramc;
  // ASC = RAMC + 90 graus (aproximação para casas iguais/Placidus tropical no Brasil)
  const ascLong = normDeg(ramc + 90);

  // 3. 12 Casas Astrológicas
  const houses: HouseCusp[] = [];
  for (let i = 1; i <= 12; i++) {
    const cuspLong = normDeg(ascLong + (i - 1) * 30);
    const pos = degToSignAndDegree(cuspLong);
    houses.push({
      houseNumber: i,
      roman: HOUSE_ROMAN[i - 1],
      sign: pos.sign,
      degree: pos.signDegree,
      minute: pos.signMinute,
      longitude: cuspLong,
      rulingPlanet: SIGN_RULERS[pos.sign] || '—',
      areaOfLife: HOUSE_AREAS[i]
    });
  }

  // Função auxiliar para determinar em qual casa cai uma longitude
  const getHouseForLongitude = (long: number): number => {
    const diff = normDeg(long - ascLong);
    const houseIdx = Math.floor(diff / 30);
    return ((houseIdx + 12) % 12) + 1;
  };

  // 4. Lua
  const moonLong = normDeg(218.316 + 13.176396 * daysSince2000 + 6.289 * Math.sin((134.963 + 13.064993 * daysSince2000) * (Math.PI / 180)));

  // 5. Mercúrio
  const mercLong = normDeg(sunLong + 22 * Math.sin((daysSince2000 * 4.0923) * (Math.PI / 180)));

  // 6. Vênus
  const venusLong = normDeg(181.98 + 1.60213 * daysSince2000);

  // 7. Marte
  const marsLong = normDeg(355.43 + 0.52403 * daysSince2000);

  // 8. Júpiter
  const jupLong = normDeg(34.35 + 0.08308 * daysSince2000);

  // 9. Saturno
  const satLong = normDeg(50.08 + 0.03344 * daysSince2000);

  // 10. Urano
  const uranLong = normDeg(314.05 + 0.01173 * daysSince2000);

  // 11. Netuno
  const nepLong = normDeg(304.35 + 0.00598 * daysSince2000);

  // 12. Plutão
  const plutLong = normDeg(238.93 + 0.00397 * daysSince2000);

  // 13. Quíron
  const chirLong = normDeg(247.0 + 0.0194 * daysSince2000);

  // 14. Nodo Norte (Rahu)
  const nodeLong = normDeg(125.04 - 0.05295 * daysSince2000);

  // 15. Lilith (Lua Negra)
  const lilithLong = normDeg(83.35 + 0.1114 * daysSince2000);

  const rawBodies = [
    { id: 'sun', name: 'Sol', symbol: '☉', long: sunLong, retrograde: false, keywords: ['Identidade', 'Vitalidade', 'Propósito'], weight: 3 },
    { id: 'moon', name: 'Lua', symbol: '☽', long: moonLong, retrograde: false, keywords: ['Emoções', 'Acolhimento', 'Intuição'], weight: 3 },
    { id: 'mercury', name: 'Mercúrio', symbol: '☿', long: mercLong, retrograde: Math.sin(daysSince2000 * 0.05) < -0.6, keywords: ['Comunicação', 'Mente', 'Aprendizado'], weight: 2 },
    { id: 'venus', name: 'Vênus', symbol: '♀', long: venusLong, retrograde: Math.sin(daysSince2000 * 0.02) < -0.85, keywords: ['Amor', 'Valores', 'Harmonia'], weight: 2 },
    { id: 'mars', name: 'Marte', symbol: '♂', long: marsLong, retrograde: Math.sin(daysSince2000 * 0.01) < -0.8, keywords: ['Ação', 'Coragem', 'Iniciativa'], weight: 2 },
    { id: 'jupiter', name: 'Júpiter', symbol: '♃', long: jupLong, retrograde: Math.sin(daysSince2000 * 0.005) < -0.7, keywords: ['Expansão', 'Fé', 'Sabedoria'], weight: 1.5 },
    { id: 'saturn', name: 'Saturno', symbol: '♄', long: satLong, retrograde: Math.sin(daysSince2000 * 0.003) < -0.7, keywords: ['Maturidade', 'Limites', 'Estrutura'], weight: 1.5 },
    { id: 'uranus', name: 'Urano', symbol: '♅', long: uranLong, retrograde: false, keywords: ['Inovação', 'Liberdade', 'Originalidade'], weight: 1 },
    { id: 'neptune', name: 'Netuno', symbol: '♆', long: nepLong, retrograde: false, keywords: ['Inspiração', 'Sensibilidade', 'Misticismo'], weight: 1 },
    { id: 'pluto', name: 'Plutão', symbol: '♇', long: plutLong, retrograde: false, keywords: ['Renascimento', 'Poder Pessoal', 'Cura'], weight: 1 },
    { id: 'chiron', name: 'Quíron', symbol: '⚷', long: chirLong, retrograde: false, keywords: ['Cura da Ferida', 'Superação', 'Resiliência'], weight: 1 },
    { id: 'node', name: 'Nodo Norte', symbol: '☊', long: nodeLong, retrograde: true, keywords: ['Missão de Alma', 'Crescimento', 'Futuro'], weight: 1 },
    { id: 'lilith', name: 'Lilith', symbol: '⚸', long: lilithLong, retrograde: false, keywords: ['Poder Selvagem', 'Autenticidade', 'Sombra'], weight: 1 }
  ];

  // Adiciona interpretações específicas para cada corpo celeste no signo e casa
  const planets: PlanetPosition[] = rawBodies.map((b) => {
    const { sign, signDegree, signMinute } = degToSignAndDegree(b.long);
    const house = getHouseForLongitude(b.long);
    const element = SIGN_ELEMENTS[sign];
    const modality = SIGN_MODALITIES[sign];

    return {
      id: b.id,
      name: b.name,
      symbol: b.symbol,
      longitude: b.long,
      sign,
      signDegree,
      signMinute,
      house,
      element,
      modality,
      isRetrograde: b.retrograde,
      keywords: b.keywords,
      interpretation: getPlacementInterpretation(b.name, sign, house)
    };
  });

  // Balanço dos 4 Elementos com pesos
  let fogoScore = 0;
  let terraScore = 0;
  let arScore = 0;
  let aguaScore = 0;

  // Inclui peso do Ascendente no elemento
  const ascSign = degToSignAndDegree(ascLong).sign;
  const ascElement = SIGN_ELEMENTS[ascSign];
  if (ascElement === 'Fogo') fogoScore += 3;
  if (ascElement === 'Terra') terraScore += 3;
  if (ascElement === 'Ar') arScore += 3;
  if (ascElement === 'Água') aguaScore += 3;

  planets.forEach((p, idx) => {
    const w = rawBodies[idx].weight;
    if (p.element === 'Fogo') fogoScore += w;
    if (p.element === 'Terra') terraScore += w;
    if (p.element === 'Ar') arScore += w;
    if (p.element === 'Água') aguaScore += w;
  });

  const totalScore = fogoScore + terraScore + arScore + aguaScore || 1;
  const elementsBalance = {
    fogo: { count: fogoScore, percentage: Math.round((fogoScore / totalScore) * 100) },
    terra: { count: terraScore, percentage: Math.round((terraScore / totalScore) * 100) },
    ar: { count: arScore, percentage: Math.round((arScore / totalScore) * 100) },
    agua: { count: aguaScore, percentage: Math.round((aguaScore / totalScore) * 100) },
    dominant:
      fogoScore >= terraScore && fogoScore >= arScore && fogoScore >= aguaScore
        ? 'Fogo 🔥'
        : terraScore >= arScore && terraScore >= aguaScore
        ? 'Terra 🌍'
        : arScore >= aguaScore
        ? 'Ar 💨'
        : 'Água 💧'
  };

  // Balanço das Modalidades
  let cardCount = 0;
  let fixCount = 0;
  let mutCount = 0;
  planets.forEach((p) => {
    if (p.modality === 'Cardinal') cardCount++;
    if (p.modality === 'Fixo') fixCount++;
    if (p.modality === 'Mutável') mutCount++;
  });
  const totalModalities = cardCount + fixCount + mutCount || 1;
  const modalitiesBalance = {
    cardinal: { count: cardCount, percentage: Math.round((cardCount / totalModalities) * 100) },
    fixo: { count: fixCount, percentage: Math.round((fixCount / totalModalities) * 100) },
    mutavel: { count: mutCount, percentage: Math.round((mutCount / totalModalities) * 100) },
    dominant:
      cardCount >= fixCount && cardCount >= mutCount
        ? 'Cardinal ⚡ (Iniciador)'
        : fixCount >= mutCount
        ? 'Fixo ⚓ (Estabilizador)'
        : 'Mutável 🌊 (Adaptável)'
  };

  // Polaridades (Yang / Positivo: Fogo e Ar | Yin / Negativo: Terra e Água)
  const yangCount = elementsBalance.fogo.percentage + elementsBalance.ar.percentage;
  const yinCount = elementsBalance.terra.percentage + elementsBalance.agua.percentage;
  const polaritiesBalance = {
    yang: { count: yangCount, percentage: yangCount },
    yin: { count: yinCount, percentage: yinCount }
  };

  // 5. Cálculo dos Aspectos Planetários
  const aspects: AstroAspect[] = [];
  const aspectDefs = [
    { type: 'Conjunção', symbol: '☌', angle: 0, maxOrb: 8, isHarmonious: true, color: '#D99426' },
    { type: 'Sextil', symbol: '⚹', angle: 60, maxOrb: 5, isHarmonious: true, color: '#3B82F6' },
    { type: 'Quadratura', symbol: '□', angle: 90, maxOrb: 7, isHarmonious: false, color: '#EF4444' },
    { type: 'Trígono', symbol: '△', angle: 120, maxOrb: 8, isHarmonious: true, color: '#10B981' },
    { type: 'Oposição', symbol: '☍', angle: 180, maxOrb: 8, isHarmonious: false, color: '#DC2626' }
  ] as const;

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const diff = Math.abs(p1.longitude - p2.longitude);
      const angle = Math.min(diff, 360 - diff);

      for (const def of aspectDefs) {
        const orb = Math.abs(angle - def.angle);
        if (orb <= def.maxOrb) {
          aspects.push({
            planet1: p1.name,
            planet1Symbol: p1.symbol,
            planet2: p2.name,
            planet2Symbol: p2.symbol,
            type: def.type,
            symbol: def.symbol,
            angle: Math.round(angle * 10) / 10,
            orb: Math.round(orb * 10) / 10,
            isHarmonious: def.isHarmonious,
            color: def.color,
            description: `${p1.name} em ${def.type} com ${p2.name} (orbe de ${orb.toFixed(1)}°)`
          });
          break;
        }
      }
    }
  }

  const sunSign = degToSignAndDegree(sunLong).sign;
  const moonSign = degToSignAndDegree(moonLong).sign;
  const midheavenSign = degToSignAndDegree(mcLong).sign;

  // 6. Interpretações Síntese da Casa 6
  const interpretations = {
    essence: getSunInterpretation(sunSign, planets[0].house),
    emotions: getMoonInterpretation(moonSign, planets[1].house),
    ascendant: getAscendantInterpretation(ascSign),
    mind: getMercuryInterpretation(planets[2].sign, planets[2].house),
    relationships: getVenusInterpretation(planets[3].sign, planets[3].house),
    drive: getMarsInterpretation(planets[4].sign, planets[4].house),
    expansion: getJupiterInterpretation(planets[5].sign, planets[5].house),
    lessons: getSaturnInterpretation(planets[6].sign, planets[6].house),
    woundsAndHealing: getChironInterpretation(planets[10].sign, planets[10].house),
    vocation: `Seu Meio do Céu em ${midheavenSign} aponta que seu propósito e vocação se realizam através de ${getVocationTheme(midheavenSign)}.`
  };

  return {
    clientName,
    birthDateStr,
    birthTimeStr,
    city,
    state,
    age,
    sunSign,
    moonSign,
    ascendantSign: ascSign,
    midheavenSign,
    planets,
    houses,
    aspects,
    elementsBalance,
    modalitiesBalance,
    polaritiesBalance,
    interpretations
  };
}

// -------------------------------------------------------------
// TEXTOS INTERPRETATIVOS ACOLHEDORES ESTILO BIANCA TÓFOLI
// -------------------------------------------------------------

function getPlacementInterpretation(planetName: string, sign: string, house: number): string {
  return `${planetName} em ${sign} na Casa ${house} traz uma energia singular para sua vida. No signo de ${sign}, expressa suas qualidades com nuances do elemento ${SIGN_ELEMENTS[sign]}, direcionando essa potência principalmente para os temas da Casa ${house} (${HOUSE_AREAS[house]}).`;
}

function getSunInterpretation(sign: string, house: number): string {
  const descriptions: Record<string, string> = {
    'Áries': 'Corajosa, pioneira e com forte impulso de liderança e autenticidade.',
    'Touro': 'Estável, sensorial, prática e com talento natural para construir valor duradouro.',
    'Gêmeos': 'Curiosa, articulada, versátil e com mente sempre ávida por conexões e aprendizados.',
    'Câncer': 'Protetora, intuitiva, sensível e com profunda sabedoria afetiva e acolhedora.',
    'Leão': 'Magnética, generosa, criativa e com brilho natural para inspirar e expressar sua verdade.',
    'Virgem': 'Atenta aos detalhes, organizada, dedicada ao aprimoramento e ao serviço com excelência.',
    'Libra': 'Diplomática, justa, esteta e com talento nato para harmonizar relações e ambientes.',
    'Escorpião': 'Profunda, perspicaz, magnética e mestre na arte de se regenerar e transformar crises em poder.',
    'Sagitário': 'Otimista, expansiva, visionária e em constante busca por verdade e horizontes maiores.',
    'Capricórnio': 'Focada, resiliente, madura e movida pela maestria e construção de legado sustentável.',
    'Aquário': 'Inovadora, humanitária, livre e sempre um passo à frente do seu tempo.',
    'Peixes': 'Empática, intuitiva, mística e com capacidade sublime de sentir e acolher o invisível.'
  };

  return `Seu Sol em ${sign} na Casa ${house} representa o núcleo pulsante da sua identidade. ${descriptions[sign] || ''} Na Casa ${house}, esse brilho vital se expressa com força na área de ${HOUSE_AREAS[house]}.`;
}

function getMoonInterpretation(sign: string, house: number): string {
  return `Sua Lua em ${sign} na Casa ${house} revela como sua alma busca segurança emocional. Você se sente nutrida e em paz quando honra a essência do elemento ${SIGN_ELEMENTS[sign]}, encontrando refúgio e intimidade nos assuntos da Casa ${house}.`;
}

function getAscendantInterpretation(sign: string): string {
  return `Seu Ascendente em ${sign} é o seu portal de entrada no mundo — a lente pela qual a vida te enxerga e como você dá o primeiro passo diante de qualquer nova jornada. Você transmite a energia do elemento ${SIGN_ELEMENTS[sign]}, combinando presença com autenticidade.`;
}

function getMercuryInterpretation(sign: string, house: number): string {
  return `Mercúrio em ${sign} na Casa ${house} rege o fluxo das suas ideias, fala e raciocínio. Sua inteligência opera com o dinamismo de ${sign}, comunicando-se com clareza nos assuntos cotidianos da Casa ${house}.`;
}

function getVenusInterpretation(sign: string, house: number): string {
  return `Vênus em ${sign} na Casa ${house} ilumina sua forma de amar, seduzir e cultivar o prazer. Você valoriza relações autênticas e atrai abundância e harmonia ao honrar a beleza de ${sign}.`;
}

function getMarsInterpretation(sign: string, house: number): string {
  return `Marte em ${sign} na Casa ${house} é o motor da sua ação, desejo e combatividade. Sua força de vontade se acende quando você luta pelo que acredita, mobilizando iniciativa com a energia de ${sign}.`;
}

function getJupiterInterpretation(sign: string, house: number): string {
  return `Júpiter em ${sign} na Casa ${house} aponta onde a vida te abre caminhos de bênçãos, fé e expansão. Seu horizonte se amplia especialmente quando você investe nos temas da Casa ${house}.`;
}

function getSaturnInterpretation(sign: string, house: number): string {
  return `Saturno em ${sign} na Casa ${house} marca o seu grande portal de amadurecimento e estrutura. O que no início parecia um desafio ou cobrança torna-se, com paciência e dedicação, sua maior autoridade e fortaleza de vida.`;
}

function getChironInterpretation(sign: string, house: number): string {
  return `Quíron em ${sign} na Casa ${house} localiza a ferida ancestral que se transforma no seu maior dom de cura e mentoria para outras pessoas.`;
}

function getVocationTheme(sign: string): string {
  const vocations: Record<string, string> = {
    'Áries': 'iniciativa pioneira, liderança ágil e projetos independentes',
    'Touro': 'gestão de valor, estabilidade financeira, estética e processos sólidos',
    'Gêmeos': 'comunicação, mídia, educação, mediação e intercâmbio de saberes',
    'Câncer': 'cuidado humano, psicologia, acolhimento, nutrição e bem-estar',
    'Leão': 'expressão autoral, liderança inspiradora, artes e mentoria de destaque',
    'Virgem': 'saúde integrada, organização analítica, otimização e processos de excelência',
    'Libra': 'direito, consultoria de relacionamentos, design, artes e diplomacia',
    'Escorpião': 'investigação profunda, psicanálise, gestão de crises e regeneração',
    'Sagitário': 'ensino superior, expansão internacional, consultoria estratégica e mentoria filosófica',
    'Capricórnio': 'gestão corporativa, planejamento a longo prazo, arquitetura e grandes estruturas',
    'Aquário': 'inovação tecnológica, causas coletivas, projetos de vanguarda e redes humanas',
    'Peixes': 'terapias sutis, artes sensíveis, espiritualidade e cura integrativa'
  };
  return vocations[sign] || 'expressão autêntica e alinhamento com seu propósito';
}
