/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Gestão de Consentimento e Privacidade (LGPD - Lei nº 13.709/2018)
 */

export interface ConsentPreferences {
  essencial: boolean; // Sempre verdadeiro
  analitico: boolean;
  marketing: boolean;
  updatedAt: string;
}

const CONSENT_STORAGE_KEY = 'casa6_cookie_consent_v1';

export function getStoredConsent(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveConsent(preferences: { analitico: boolean; marketing: boolean }): ConsentPreferences {
  const finalPrefs: ConsentPreferences = {
    essencial: true,
    analitico: preferences.analitico,
    marketing: preferences.marketing,
    updatedAt: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(finalPrefs));
  }

  return finalPrefs;
}
