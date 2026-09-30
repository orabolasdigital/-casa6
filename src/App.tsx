/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Aplicação Principal e Roteador Central (Etapa 1 - Fundação Congelada)
 */

import React, { useState, useEffect } from 'react';
import { APP_ROUTES } from './config/routes';
import { RouteMeta } from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BookingModal } from './components/common/BookingModal';
import { SEOMeta } from './components/common/SEOMeta';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { AntiCopyBanner } from './components/common/AntiCopyBanner';
import { initAntiCopyProtection } from './services/anticopy';
import { initAuthListener } from './services/auth';
import { trackAnalyticsEvent } from './services/analytics';

// Visões Públicas
import { HomeView } from './views/public/HomeView';
import { SobreView } from './views/public/SobreView';
import { AtendimentosView } from './views/public/AtendimentosView';
import { PatotaAstralView } from './views/public/PatotaAstralView';
import { VivenciasView } from './views/public/VivenciasView';
import { PalestrasView } from './views/public/PalestrasView';
import { BlogView } from './views/public/BlogView';
import { LojaView } from './views/public/LojaView';
import { LegalView } from './views/public/LegalViews';

// Visão Administrativa
import { AdminPanel } from './views/admin/AdminPanel';

export default function App() {
  // Inicialização do caminho (compatível com pathname e hash fallback para iframe)
  const getInitialPath = (): string => {
    if (typeof window === 'undefined') return '/';
    const hash = window.location.hash.replace('#', '');
    if (hash && hash.startsWith('/')) return hash;
    return window.location.pathname || '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();

  // Inicializa proteção anticópia e listener de autenticação
  useEffect(() => {
    const unsubAntiCopy = initAntiCopyProtection();
    const unsubAuth = initAuthListener();

    const handlePopState = () => {
      setCurrentPath(getInitialPath());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      unsubAntiCopy();
      unsubAuth();
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Navegação Programática com Histórico
  const navigateTo = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    trackAnalyticsEvent('page_view', { path });
  };

  // Abertura do Modal Global com Pré-preenchimento
  const handleOpenBooking = (serviceId?: string) => {
    setSelectedServiceId(serviceId);
    setBookingModalOpen(true);
    trackAnalyticsEvent('open_booking', { serviceId: serviceId || 'default' });
  };

  // Resolução de Metadados de SEO para a Rota Atual
  const resolveCurrentRouteMeta = (): RouteMeta => {
    if (currentPath.startsWith('/painel')) return APP_ROUTES.painel;
    if (currentPath === '/sobre') return APP_ROUTES.sobre;
    if (currentPath === '/atendimentos') return APP_ROUTES.atendimentos;
    if (currentPath.startsWith('/atendimentos/')) return APP_ROUTES.atendimentoDetalhe;
    if (currentPath === '/patota' || currentPath === '/patota-astral') return APP_ROUTES.patota;
    if (currentPath === '/vivencias') return APP_ROUTES.vivencias;
    if (currentPath.startsWith('/vivencias/')) return APP_ROUTES.vivenciaDetalhe;
    if (currentPath === '/palestras') return APP_ROUTES.palestras;
    if (currentPath === '/leituras' || currentPath === '/blog') return APP_ROUTES.leituras;
    if (currentPath.startsWith('/leituras/') || currentPath.startsWith('/blog/')) return APP_ROUTES.blogDetalhe;
    if (currentPath === '/lojinha' || currentPath === '/loja') return APP_ROUTES.lojinha;
    if (currentPath.startsWith('/lojinha/') || currentPath.startsWith('/loja/')) return APP_ROUTES.lojaDetalhe;
    if (currentPath === '/politica-de-privacidade') return APP_ROUTES.privacidade;
    if (currentPath === '/termos') return APP_ROUTES.termos;
    if (currentPath === '/politica-de-cookies') return APP_ROUTES.cookies;

    return APP_ROUTES.home;
  };

  const currentMeta = resolveCurrentRouteMeta();
  const isAdminRoute = currentPath.startsWith('/painel');

  return (
    <div className={`min-h-screen flex flex-col ${isAdminRoute ? 'admin-scope' : 'protected-content'}`}>
      {/* Injeção Dinâmica de SEO & JSON-LD */}
      <SEOMeta meta={currentMeta} />

      {/* Camada Anticópia Feedback */}
      {!isAdminRoute && <AntiCopyBanner />}

      {/* Header Público (Oculto no Painel Administrativo) */}
      {!isAdminRoute && (
        <Header
          currentPath={currentPath}
          onNavigate={navigateTo}
          onOpenBooking={handleOpenBooking}
        />
      )}

      {/* Conteúdo da Rota */}
      <main className="flex-1">
        {isAdminRoute ? (
          <AdminPanel onNavigateHome={() => navigateTo('/inicio')} />
        ) : currentPath === '/sobre' ? (
          <SobreView onOpenBooking={() => handleOpenBooking()} />
        ) : currentPath === '/atendimentos' || currentPath.startsWith('/atendimentos/') ? (
          <AtendimentosView onOpenBooking={handleOpenBooking} />
        ) : currentPath === '/patota' || currentPath === '/patota-astral' ? (
          <PatotaAstralView onOpenBooking={handleOpenBooking} />
        ) : currentPath === '/vivencias' || currentPath.startsWith('/vivencias/') ? (
          <VivenciasView onOpenBooking={() => handleOpenBooking()} />
        ) : currentPath === '/palestras' ? (
          <PalestrasView onOpenBooking={() => handleOpenBooking()} />
        ) : currentPath === '/leituras' || currentPath === '/blog' || currentPath.startsWith('/leituras/') || currentPath.startsWith('/blog/') ? (
          <BlogView onNavigate={navigateTo} />
        ) : currentPath === '/lojinha' || currentPath === '/loja' || currentPath.startsWith('/lojinha/') || currentPath.startsWith('/loja/') ? (
          <LojaView onOpenBooking={() => handleOpenBooking()} />
        ) : currentPath === '/politica-de-privacidade' ? (
          <LegalView type="privacidade" />
        ) : currentPath === '/termos' ? (
          <LegalView type="termos" />
        ) : currentPath === '/politica-de-cookies' ? (
          <LegalView type="cookies" />
        ) : (
          <HomeView onOpenBooking={handleOpenBooking} onNavigate={navigateTo} />
        )}
      </main>

      {/* Footer Público (Oculto no Painel Administrativo) */}
      {!isAdminRoute && <Footer onNavigate={navigateTo} />}

      {/* Modal Global Único de Agendamento (Strict 5 fields) */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedServiceId={selectedServiceId}
        sourcePageTitle={currentMeta.title}
      />

      {/* Banner de Consentimento LGPD */}
      {!isAdminRoute && <CookieConsentBanner />}
    </div>
  );
}
