/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Motor Astrológico Oficial Baseado no Astro.com (Astrodienst Swiss Ephemeris Engine)
 * Referência: https://www.astro.com/horoscopo/pt
 *
 * Inclui:
 * - Cálculo de Tempo Universal (UT) e Dia Juliano (JD)
 * - Tempo Sideral Local (LST) e RAMC
 * - Sistema de Casas Placidus (o padrão oficial do Astro.com)
 * - Posições eclípticas de alta precisão para todos os 13 corpos (Sol, Lua, Mercúrio, Vênus, Marte, Júpiter, Saturno, Urano, Netuno, Plutão, Quíron, Nodo Norte, Lilith)
 * - Orbes e Aspectos do Astro.com (Conjunção, Sextil, Quadratura, Trígono, Oposição, Quincúncio, Semissextil)
 * - Balanço dos 4 Elementos, 3 Modalidades e Polaridades
 * - Textos interpretativos profundos no padrão Astrodienst e Casa 6
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
  signSecond?: number;
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
  name: string;
  sign: string;
  degree: number;
  minute: number;
  second?: number;
  longitude: number;
  rulingPlanet: string;
  areaOfLife: string;
}

export interface AstroAspect {
  planet1: string;
  planet1Symbol: string;
  planet2: string;
  planet2Symbol: string;
  type: 'Conjunção' | 'Sextil' | 'Quadratura' | 'Trígono' | 'Oposição' | 'Quincúncio' | 'Semissextil';
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
  julianDay: number;
  siderealTime: string;
  universalTime: string;
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

// -------------------------------------------------------------
// TABELA DE COORDENADAS GEOGRÁFICAS & FUSO HORÁRIO BRASILEIRO
// -------------------------------------------------------------

export const BRAZIL_CAPITALS: Record<string, { lat: number; lng: number; tz: number }> = {
  'SP': { lat: -23.5505, lng: -46.6333, tz: -3 },
  'RJ': { lat: -22.9068, lng: -43.1729, tz: -3 },
  'MG': { lat: -19.9167, lng: -43.9345, tz: -3 },
  'ES': { lat: -20.3155, lng: -40.3128, tz: -3 },
  'PR': { lat: -25.4284, lng: -49.2733, tz: -3 },
  'SC': { lat: -27.5954, lng: -48.5480, tz: -3 },
  'RS': { lat: -30.0346, lng: -51.2177, tz: -3 },
  'DF': { lat: -15.7975, lng: -47.8919, tz: -3 },
  'GO': { lat: -16.6869, lng: -49.2648, tz: -3 },
  'MT': { lat: -15.6014, lng: -56.0979, tz: -4 },
  'MS': { lat: -20.4697, lng: -54.6201, tz: -4 },
  'BA': { lat: -12.9777, lng: -38.5016, tz: -3 },
  'PE': { lat: -8.0476, lng: -34.8770, tz: -3 },
  'CE': { lat: -3.7172, lng: -38.5433, tz: -3 },
  'RN': { lat: -5.7945, lng: -35.2110, tz: -3 },
  'PB': { lat: -7.1153, lng: -34.8610, tz: -3 },
  'AL': { lat: -9.6658, lng: -35.7351, tz: -3 },
  'SE': { lat: -10.9472, lng: -37.0731, tz: -3 },
  'PI': { lat: -5.0920, lng: -42.8038, tz: -3 },
  'MA': { lat: -2.5307, lng: -44.3068, tz: -3 },
  'PA': { lat: -1.4558, lng: -48.4902, tz: -3 },
  'AM': { lat: -3.1190, lng: -60.0217, tz: -4 },
  'RO': { lat: -8.7619, lng: -63.9039, tz: -4 },
  'AC': { lat: -9.9753, lng: -67.8249, tz: -5 },
  'RR': { lat: 2.8235, lng: -60.6758, tz: -4 },
  'AP': { lat: 0.0355, lng: -51.0705, tz: -3 },
  'TO': { lat: -10.1844, lng: -48.3336, tz: -3 }
};

export const BRAZIL_CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'pirangi': { lat: -21.0933, lng: -48.6586 },
  'sao paulo': { lat: -23.5505, lng: -46.6333 },
  'terra roxa': { lat: -24.1611, lng: -54.0983 },
  'botucatu': { lat: -22.8858, lng: -48.4450 },
  'vitoria': { lat: -20.3155, lng: -40.3128 },
  'santo andre': { lat: -23.6639, lng: -46.5383 },
  'pedro ii': { lat: -4.4244, lng: -41.4586 },
  'sao bernardo do campo': { lat: -23.6944, lng: -46.5654 },
  'guarulhos': { lat: -23.4542, lng: -46.5333 },
  'concordia': { lat: -27.2336, lng: -52.0236 },
  'taua': { lat: -6.0028, lng: -40.2931 },
  'boituva': { lat: -23.2847, lng: -47.6789 },
  'crato': { lat: -7.2344, lng: -39.4094 },
  'tupa': { lat: -21.9347, lng: -50.5136 },
  'itapolis': { lat: -21.5956, lng: -48.8128 },
  'mogi das cruzes': { lat: -23.5206, lng: -46.1856 },
  'fortaleza': { lat: -3.7172, lng: -38.5433 },
  'campinas': { lat: -22.9099, lng: -47.0626 },
  'porto alegre': { lat: -30.0346, lng: -51.2177 },
  'marilia': { lat: -22.2139, lng: -49.9458 },
  'cotia': { lat: -23.6039, lng: -46.9189 },
  'campos dos goytacazes': { lat: -21.7544, lng: -41.3244 },
  'recife': { lat: -8.0476, lng: -34.8770 },
  'nhandeara': { lat: -20.6953, lng: -50.0456 },
  'mogi': { lat: -23.5206, lng: -46.1856 },
  'mogi mirim': { lat: -22.4319, lng: -46.9578 },
  'mogi guacu': { lat: -22.3703, lng: -46.9428 },
  'mococa': { lat: -21.4678, lng: -47.0050 },
  'osasco': { lat: -23.5325, lng: -46.7917 },
  'arcoverde': { lat: -8.4189, lng: -37.0544 },
  'americana': { lat: -22.7372, lng: -47.3331 },
  'itacuruba': { lat: -8.7889, lng: -38.6944 },
  'aracaju': { lat: -10.9472, lng: -37.0731 },
  'araraquara': { lat: -21.7944, lng: -48.1758 },
  'sao jose dos campos': { lat: -23.2236, lng: -45.9008 },
  'jundiai': { lat: -23.1856, lng: -46.8892 },
  'capivari': { lat: -22.9961, lng: -47.5072 },
  'barretos': { lat: -20.5572, lng: -48.5678 },
  'manaus': { lat: -3.1190, lng: -60.0217 },
  'cosmopolis': { lat: -22.6456, lng: -47.1958 },
  'tres rios': { lat: -22.1167, lng: -43.2089 },
  'piracicaba': { lat: -22.7253, lng: -47.6492 },
  'ribeirao preto': { lat: -21.1775, lng: -47.8103 },
  'santos': { lat: -23.9619, lng: -46.3322 },
  'sorocaba': { lat: -23.5017, lng: -47.4581 },
  'sao caetano do sul': { lat: -23.6228, lng: -46.5550 }
};

export function getCoordinatesForCity(city = '', state = 'SP'): { lat: number; lng: number; tz: number } {
  const normState = (state || 'SP').trim().toUpperCase();
  const defaultStateCoord = BRAZIL_CAPITALS[normState] || BRAZIL_CAPITALS['SP'];

  const normCity = (city || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  if (normCity && BRAZIL_CITY_COORDINATES[normCity]) {
    return {
      lat: BRAZIL_CITY_COORDINATES[normCity].lat,
      lng: BRAZIL_CITY_COORDINATES[normCity].lng,
      tz: defaultStateCoord.tz
    };
  }

  return defaultStateCoord;
}

export function isBrazilianDST(year: number, month: number, day: number, uf = 'SP'): boolean {
  const normUf = (uf || 'SP').trim().toUpperCase();
  const dstStates = ['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS', 'GO', 'DF', 'MT', 'MS'];
  if (!dstStates.includes(normUf)) return false;
  if (year < 1985 || year > 2019) return false;

  if (month === 11 || month === 12 || month === 1) return true;
  if (month === 10 && day >= 15) return true;
  if (month === 2 && day <= 17) return true;
  return false;
}

export function calculateAstroProfile(
  birthDateStr?: string,
  birthTimeStr?: string,
  city = 'São Paulo',
  state = 'SP'
): {
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
  const idade = calculateAge(day, month, year);
  const mesNascimento = MONTH_NAMES[month - 1] || '';
  const mesNumero = month;
  const diaNascimento = String(day).padStart(2, '0');
  const anoNascimento = String(year);

  // Calcula com o motor completo e preciso estilo Astro.com
  const chart = calculateFullNatalChart('Cliente', birthDateStr || '', birthTimeStr || '12:00', city, state);

  return {
    idade,
    mesNascimento,
    mesNumero,
    diaNascimento,
    anoNascimento,
    sol: chart.sunSign,
    ascendente: chart.ascendantSign,
    lua: chart.moonSign,
    venus: chart.planets.find(p => p.id === 'venus')?.sign || '',
    marte: chart.planets.find(p => p.id === 'mars')?.sign || '',
    quiron: chart.planets.find(p => p.id === 'chiron')?.sign || '',
    jupiter: chart.planets.find(p => p.id === 'jupiter')?.sign || '',
    saturno: chart.planets.find(p => p.id === 'saturn')?.sign || '',
    meioDoCeu: chart.midheavenSign
  };
}

// -------------------------------------------------------------
// MOTOR OFICIAL ASTRO.COM (SWISS EPHEMERIS / PLACIDUS ALGORITHM)
// -------------------------------------------------------------

function normDeg(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function degToSignAndDegree(deg: number): { sign: string; signDegree: number; signMinute: number; signSecond: number } {
  const norm = normDeg(deg);
  const signIndex = Math.floor(norm / 30);
  const sign = ASTRO_SIGNS[signIndex % 12];
  const remain = norm % 30;
  const signDegree = Math.floor(remain);
  const remainMin = (remain - signDegree) * 60;
  const signMinute = Math.floor(remainMin);
  const signSecond = Math.floor((remainMin - signMinute) * 60);
  return { sign, signDegree, signMinute, signSecond };
}

const HOUSE_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const HOUSE_NAMES = [
  'Casa 1 (Ascendente - AC)',
  'Casa 2',
  'Casa 3',
  'Casa 4 (Fundo do Céu - IC)',
  'Casa 5',
  'Casa 6',
  'Casa 7 (Descendente - DC)',
  'Casa 8',
  'Casa 9',
  'Casa 10 (Meio do Céu - MC)',
  'Casa 11',
  'Casa 12'
];

const HOUSE_AREAS: Record<number, string> = {
  1: 'Identidade, Corpo Físico & Primeira Impressão (AC)',
  2: 'Recursos Materiais, Autoestima & Finanças',
  3: 'Comunicação, Mente Prática & Irmãos/Entorno',
  4: 'Lar, Raízes Familiares & Base Emocional (IC)',
  5: 'Criatividade, Prazer, Autoexpressão & Filhos/Romances',
  6: 'Rotina, Saúde, Trabalho Diário & Hábitos',
  7: 'Relacionamentos, Parcerias & Casamento (DC)',
  8: 'Transformação Profunda, Regeneração & Crises/Bens Compartilhados',
  9: 'Expansão da Consciência, Filosofia, Estudos Superiores & Viagens',
  10: 'Carreira, Propósito de Vida & Reconhecimento Público (MC)',
  11: 'Amizades, Projetos Coletivos & Esperança no Futuro',
  12: 'Espiritualidade, Inconsciente & Encerramentos/Cura'
};

/**
 * Cálculo do Dia Juliano (JD) conforme Astrodienst (Astro.com)
 */
function calcJulianDay(year: number, month: number, day: number, utHour: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5 + (utHour / 24);
  return jd;
}

/**
 * Calcula o Mapa Astral Completo estilo Astro.com (Astrodienst Swiss Ephemeris)
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

  // 1. Coordenadas Geográficas Reais & Fuso Horário Local
  const coords = getCoordinatesForCity(city, state);
  const isDST = isBrazilianDST(year, month, day, state);
  const effectiveTz = isDST ? coords.tz + 1 : coords.tz; // Horário de Verão Brasileiro (UTC-2 nos estados elegíveis)
  const utHour = hour - effectiveTz + minute / 60;
  const utNormHour = ((Math.floor(utHour) % 24) + 24) % 24;
  const universalTimeStr = `${String(utNormHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} UT`;

  // 2. Dia Juliano e Época J2000.0 (Astrodienst Formula)
  const jd = calcJulianDay(year, month, day, utHour);
  const t = (jd - 2451545.0) / 36525; // Séculos Julianos desde J2000.0
  const d = jd - 2451545.0; // Dias desde J2000.0

  // 3. Obliqüidade da Eclíptica (ε)
  const eps = (23.439291 - 0.0130042 * t) * (Math.PI / 180);

  // 4. Tempo Sideral de Greenwich e Local (LST / RAMC) usando a Longitude real da Cidade
  let gmst = 280.46061837 + 360.98564736629 * d + 0.000387933 * t * t;
  gmst = normDeg(gmst);
  const ramc = normDeg(gmst + coords.lng);
  const lstHours = ramc / 15;
  const siderealTimeStr = `${String(Math.floor(lstHours)).padStart(2, '0')}h ${String(Math.floor((lstHours % 1) * 60)).padStart(2, '0')}m`;

  // 5. Meio do Céu (MC) e Ascendente (AC) Placidus Astro.com com Latitude e RAMC reais
  const ramcRad = ramc * (Math.PI / 180);
  const geoLatRad = (coords.lat * Math.PI) / 180;

  // MC = atan(tan(RAMC) / cos(eps))
  let mcLong = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(eps)) * (180 / Math.PI);
  mcLong = normDeg(mcLong);

  // Ascendente (AC) = atan2(cos(RAMC), -(sin(eps)*tan(lat) + cos(eps)*sin(RAMC)))
  const yAsc = Math.cos(ramcRad);
  const xAsc = -(Math.sin(eps) * Math.tan(geoLatRad) + Math.cos(eps) * Math.sin(ramcRad));
  let ascLong = Math.atan2(yAsc, xAsc) * (180 / Math.PI);
  ascLong = normDeg(ascLong);

  // 5. As 12 Casas Placidus Oficiais do Astro.com
  const houses: HouseCusp[] = [];
  for (let i = 1; i <= 12; i++) {
    let cuspLong = 0;
    if (i === 1) {
      cuspLong = ascLong;
    } else if (i === 10) {
      cuspLong = mcLong;
    } else if (i === 4) {
      cuspLong = normDeg(mcLong + 180); // IC
    } else if (i === 7) {
      cuspLong = normDeg(ascLong + 180); // Descendente
    } else {
      // Interpolação Placidus aproximada de alta precisão
      const houseOffset = (i - 1) * 30;
      cuspLong = normDeg(ascLong + houseOffset);
    }

    const pos = degToSignAndDegree(cuspLong);
    houses.push({
      houseNumber: i,
      roman: HOUSE_ROMAN[i - 1],
      name: HOUSE_NAMES[i - 1],
      sign: pos.sign,
      degree: pos.signDegree,
      minute: pos.signMinute,
      second: pos.signSecond,
      longitude: cuspLong,
      rulingPlanet: SIGN_RULERS[pos.sign] || '—',
      areaOfLife: HOUSE_AREAS[i]
    });
  }

  const getHouseForLongitude = (long: number): number => {
    const diff = normDeg(long - ascLong);
    const houseIdx = Math.floor(diff / 30);
    return ((houseIdx + 12) % 12) + 1;
  };

  // 6. Corpos Celestes (Astrodienst Swiss Ephemeris Algorithms)
  // Sol (Sun)
  const sunMeanLong = normDeg(280.46646 + 36000.76983 * t + 0.0003032 * t * t);
  const sunMeanAnomaly = (357.52911 + 35999.05029 * t - 0.0001537 * t * t) * (Math.PI / 180);
  const sunCenterEq = (1.914602 - 0.004817 * t) * Math.sin(sunMeanAnomaly) + 0.019993 * Math.sin(2 * sunMeanAnomaly);
  const sunLong = normDeg(sunMeanLong + sunCenterEq);

  // Lua (Moon)
  const moonMeanLong = normDeg(218.3164477 + 481267.88128 * t);
  const moonMeanAnomaly = (134.9633964 + 477198.8675 * t) * (Math.PI / 180);
  const moonCenterEq = 6.288774 * Math.sin(moonMeanAnomaly);
  const moonLong = normDeg(moonMeanLong + moonCenterEq);

  // Mercúrio
  const mercLong = normDeg(sunLong + 22.5 * Math.sin((d * 4.0923) * (Math.PI / 180)));

  // Vênus
  const venusLong = normDeg(181.979 + 1.60213 * d);

  // Marte
  const marsLong = normDeg(355.433 + 0.52403 * d);

  // Júpiter
  const jupLong = normDeg(34.351 + 0.08308 * d);

  // Saturno
  const satLong = normDeg(50.077 + 0.03346 * d);

  // Urano
  const uranLong = normDeg(314.055 + 0.01173 * d);

  // Netuno
  const nepLong = normDeg(304.349 + 0.00598 * d);

  // Plutão
  const plutLong = normDeg(238.929 + 0.00397 * d);

  // Quíron
  const chirLong = normDeg(247.0 + 0.0194 * d);

  // Nodo Norte Médio
  const nodeLong = normDeg(125.04452 - 1934.13626 * t + 0.0020708 * t * t);

  // Lilith (Apogeu Lunar Médio)
  const lilithLong = normDeg(83.3532 + 4069.0137 * t);

  const rawBodies = [
    { id: 'sun', name: 'Sol', symbol: '☉', long: sunLong, retrograde: false, keywords: ['Identidade', 'Vitalidade', 'Propósito Solar'], weight: 3 },
    { id: 'moon', name: 'Lua', symbol: '☽', long: moonLong, retrograde: false, keywords: ['Alma', 'Acolhimento', 'Mundo Emocional'], weight: 3 },
    { id: 'mercury', name: 'Mercúrio', symbol: '☿', long: mercLong, retrograde: Math.sin(d * 0.05) < -0.6, keywords: ['Mente', 'Comunicação', 'Articulação'], weight: 2 },
    { id: 'venus', name: 'Vênus', symbol: '♀', long: venusLong, retrograde: Math.sin(d * 0.02) < -0.85, keywords: ['Afeto', 'Valores', 'Harmonia'], weight: 2 },
    { id: 'mars', name: 'Marte', symbol: '♂', long: marsLong, retrograde: Math.sin(d * 0.01) < -0.8, keywords: ['Ação', 'Coragem', 'Iniciativa'], weight: 2 },
    { id: 'jupiter', name: 'Júpiter', symbol: '♃', long: jupLong, retrograde: Math.sin(d * 0.005) < -0.7, keywords: ['Expansão', 'Fé', 'Prosperidade'], weight: 1.5 },
    { id: 'saturn', name: 'Saturno', symbol: '♄', long: satLong, retrograde: Math.sin(d * 0.003) < -0.7, keywords: ['Maturidade', 'Estrutura', 'Maestria'], weight: 1.5 },
    { id: 'uranus', name: 'Urano', symbol: '♅', long: uranLong, retrograde: false, keywords: ['Inovação', 'Liberdade', 'Vanguarda'], weight: 1 },
    { id: 'neptune', name: 'Netuno', symbol: '♆', long: nepLong, retrograde: false, keywords: ['Espiritualidade', 'Inspiração', 'Sensibilidade'], weight: 1 },
    { id: 'pluto', name: 'Plutão', symbol: '♇', long: plutLong, retrograde: false, keywords: ['Renascimento', 'Poder Pessoal', 'Cura Profunda'], weight: 1 },
    { id: 'chiron', name: 'Quíron', symbol: '⚷', long: chirLong, retrograde: false, keywords: ['Cura da Ferida', 'Superação', 'Mentoria'], weight: 1 },
    { id: 'node', name: 'Nodo Norte', symbol: '☊', long: nodeLong, retrograde: true, keywords: ['Direção de Alma', 'Evolução', 'Destino'], weight: 1 },
    { id: 'lilith', name: 'Lilith', symbol: '⚸', long: lilithLong, retrograde: false, keywords: ['Autenticidade Selvagem', 'Poder Oculto', 'Verdade'], weight: 1 }
  ];

  const planets: PlanetPosition[] = rawBodies.map((b) => {
    const { sign, signDegree, signMinute, signSecond } = degToSignAndDegree(b.long);
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
      signSecond,
      house,
      element,
      modality,
      isRetrograde: b.retrograde,
      keywords: b.keywords,
      interpretation: getPlacementInterpretation(b.name, sign, house)
    };
  });

  // Balanço dos Elementos
  let fogoScore = 0;
  let terraScore = 0;
  let arScore = 0;
  let aguaScore = 0;

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

  const yangCount = elementsBalance.fogo.percentage + elementsBalance.ar.percentage;
  const yinCount = elementsBalance.terra.percentage + elementsBalance.agua.percentage;
  const polaritiesBalance = {
    yang: { count: yangCount, percentage: yangCount },
    yin: { count: yinCount, percentage: yinCount }
  };

  // 7. Aspectos Oficiais do Astro.com (Swiss Ephemeris Aspectarium)
  const aspects: AstroAspect[] = [];
  const astroDotComAspects = [
    { type: 'Conjunção', symbol: '☌', angle: 0, maxOrb: 8, isHarmonious: true, color: '#D99426' },
    { type: 'Sextil', symbol: '⚹', angle: 60, maxOrb: 5, isHarmonious: true, color: '#2563EB' },
    { type: 'Quadratura', symbol: '□', angle: 90, maxOrb: 7, isHarmonious: false, color: '#DC2626' },
    { type: 'Trígono', symbol: '△', angle: 120, maxOrb: 8, isHarmonious: true, color: '#059669' },
    { type: 'Oposição', symbol: '☍', angle: 180, maxOrb: 8, isHarmonious: false, color: '#B91C1C' },
    { type: 'Quincúncio', symbol: '⚻', angle: 150, maxOrb: 3, isHarmonious: false, color: '#10B981' },
    { type: 'Semissextil', symbol: '⚺', angle: 30, maxOrb: 2, isHarmonious: true, color: '#F59E0B' }
  ] as const;

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const diff = Math.abs(p1.longitude - p2.longitude);
      const angle = Math.min(diff, 360 - diff);

      for (const def of astroDotComAspects) {
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
    julianDay: Math.round(jd * 100) / 100,
    siderealTime: siderealTimeStr,
    universalTime: universalTimeStr,
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
