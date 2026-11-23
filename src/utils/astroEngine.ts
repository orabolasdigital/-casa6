/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Motor Astrológico & Utilitários de CRM (AstroEngine)
 *
 * Realiza cálculos dinâmicos de:
 * - Idade em tempo real
 * - Inferência inteligente de Gênero
 * - Formatação e separação de Telefones/WhatsApp
 * - Signos: Sol, Lua, Ascendente, Vênus, Marte, Quíron, Júpiter, Saturno e Meio do Céu (MC)
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

export const MONTH_ABBR = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
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

const KNOWN_MALE = new Set([
  'fabio', 'fábio', 'adivaldo', 'adriano', 'alexandre', 'anderson', 'andre', 'andré',
  'antonio', 'antônio', 'bruno', 'caio', 'carlos', 'cesar', 'césar', 'claudio', 'cláudio',
  'daniel', 'diego', 'eduardo', 'felipe', 'fernando', 'gabriel', 'guilherme', 'gustavo',
  'henrique', 'igor', 'joao', 'joão', 'jose', 'josé', 'julio', 'júlio', 'leonardo',
  'lucas', 'luis', 'luís', 'luiz', 'marcelo', 'marcio', 'márcio', 'marcos', 'mateus',
  'matheus', 'paulo', 'pedro', 'rafael', 'renato', 'ricardo', 'roberto', 'rodrigo',
  'sergio', 'sérgio', 'thiago', 'tiago', 'victor', 'vinicius', 'vitor'
]);

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

  if (!cleanFirst) return 'Feminino';
  if (KNOWN_MALE.has(cleanFirst)) return 'Masculino';
  if (cleanFirst.endsWith('a') || cleanFirst.endsWith('e') || cleanFirst.endsWith('i') || cleanFirst.endsWith('y')) {
    return 'Feminino';
  }
  if (cleanFirst.endsWith('o') || cleanFirst.endsWith('os') || cleanFirst.endsWith('or') || cleanFirst.endsWith('el')) {
    return 'Masculino';
  }
  return 'Feminino';
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

export function parseCityState(cityStateStr?: string): { cidade: string; uf: string } {
  if (!cityStateStr) return { cidade: '', uf: '' };
  const parts = cityStateStr.split(/[-–—\/,]/);
  if (parts.length >= 2) {
    return {
      cidade: parts[0].trim(),
      uf: parts[parts.length - 1].trim().toUpperCase()
    };
  }
  return { cidade: cityStateStr.trim(), uf: '' };
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
