/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Banner de Consentimento de Cookies & LGPD (Identidade Visual Oficial Atualizada)
 */

import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { getStoredConsent, saveConsent } from '../../services/consent';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [allowAnalytics, setAllowAnalytics] = useState(true);

  useEffect(() => {
    const existing = getStoredConsent();
    if (!existing) {
      setIsVisible(true);
    }

    const handleOpen = () => setIsVisible(true);
    window.addEventListener('open-casa6-cookies', handleOpen);
    return () => window.removeEventListener('open-casa6-cookies', handleOpen);
  }, []);

  if (!isVisible) return null;

  const handleAcceptAll = () => {
    saveConsent({ analitico: true, marketing: true });
    setIsVisible(false);
  };

  const handleAcceptNecessaryOnly = () => {
    saveConsent({ analitico: false, marketing: false });
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    saveConsent({ analitico: allowAnalytics, marketing: false });
    setIsVisible(false);
  };

  return (
    <aside
      aria-label="Consentimento de Cookies"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-[#22205A] text-[#FFFFFF] border-t-2 border-[#FFB63F] shadow-2xl"
    >
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2 text-[#FFB63F] font-bold text-sm">
            <Cookie className="h-4 w-4" />
            <span>Privacidade & Cookies (LGPD)</span>
          </div>
          <p className="text-xs text-[#DAD2C4] leading-relaxed">
            Utilizamos cookies essenciais para o funcionamento seguro da Casa 6 e cookies analíticos para mensuração de tráfego, garantindo respeito à sua privacidade e conformidade com a Lei nº 13.709/2018.
          </p>
          <div className="flex items-center gap-4 text-xs pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-[#FFFFFF]">
              <input type="checkbox" checked disabled className="rounded text-[#FFB63F]" />
              <span>Essenciais (Ativos)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[#DAD2C4] hover:text-[#FFFFFF]">
              <input
                type="checkbox"
                checked={allowAnalytics}
                onChange={(e) => setAllowAnalytics(e.target.checked)}
                className="rounded text-[#FFB63F]"
              />
              <span>Analíticos (GA4 / GTM)</span>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={handleAcceptAll}
            className="flex-1 md:flex-none rounded bg-[#FFB63F] px-4 py-2 text-xs font-bold text-[#080C35] hover:bg-[#EAA329] transition-colors"
          >
            Aceitar Todos
          </button>
          <button
            onClick={handleSaveCustom}
            className="flex-1 md:flex-none rounded bg-[#372B69] px-4 py-2 text-xs font-semibold text-[#FFFFFF] hover:bg-[#483474] transition-colors border border-[#483474]"
          >
            Salvar Preferências
          </button>
          <button
            onClick={handleAcceptNecessaryOnly}
            className="flex-1 md:flex-none px-3 py-2 text-xs text-[#DAD2C4] hover:underline"
          >
            Apenas Essenciais
          </button>
        </div>
      </div>
    </aside>
  );
};
