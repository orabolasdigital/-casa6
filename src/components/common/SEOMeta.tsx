/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Injetor Centralizado de Metadados e JSON-LD Dinâmico (SEO & GEO)
 */

import React, { useEffect } from 'react';
import { RouteMeta } from '../../types';

interface SEOMetaProps {
  meta: RouteMeta;
  schema?: Record<string, unknown>;
}

export const SEOMeta: React.FC<SEOMetaProps> = ({ meta, schema }) => {
  useEffect(() => {
    // 1. Atualização do Título da Aba
    document.title = meta.title;

    // 2. Atualização da Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', meta.description);

    // 3. Atualização de Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', meta.canonicalUrl);

    // 4. Injeção de JSON-LD específico da página se fornecido
    const scriptId = 'dynamic-page-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [meta, schema]);

  return null;
};
