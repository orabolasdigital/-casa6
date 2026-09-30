/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo Padronizado de Analytics & Eventos (Status: PREPARADO para GA4 / GTM)
 */

import { AnalyticsEventName, AnalyticsPayload } from '../types';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Disparador oficial de eventos analíticos da Casa 6
 */
export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  properties?: Record<string, unknown>
): AnalyticsPayload {
  const payload: AnalyticsPayload = {
    eventName,
    timestamp: new Date().toISOString(),
    page: typeof window !== 'undefined' ? window.location.pathname : '',
    properties
  };

  // 1. Envio para GTM DataLayer (quando configurado)
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...properties
    });
  }

  // 2. Envio para GA4 (quando inicializado)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, properties);
  }

  // 3. Log interno de auditoria e validação da Etapa 1
  if (import.meta.env.DEV) {
    console.info(`[Casa6 Analytics]: ${eventName}`, payload);
  }

  return payload;
}
