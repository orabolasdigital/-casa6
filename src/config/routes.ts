/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Mapeamento Centralizado de Rotas & Metadados de SEO
 */

import { RouteMeta } from '../types';

export const APP_ROUTES: Record<string, RouteMeta> = {
  home: {
    path: '/inicio',
    title: 'Casa 6 — Bianca Tofoli | Astrologia, Mapa Astral & Patota Astral',
    description: 'Plataforma oficial da Casa 6 por Bianca Tofoli. Consultas de Mapa Astral, Vivências e a comunidade Patota Astral com olhar contemporâneo e autoral.',
    canonicalUrl: 'https://casa6.com.br/inicio',
    section: 'Institucional',
    isAdmin: false,
    showInNav: true,
    navLabel: 'início'
  },
  sobre: {
    path: '/sobre',
    title: 'Sobre Bianca Tofoli & Casa 6 | Trajetória e Filosofia Astrológica',
    description: 'Conheça Bianca Tofoli, fundadora da Casa 6: formação, visão contemporânea da astrologia e compromisso com o autoconhecimento lúcido.',
    canonicalUrl: 'https://casa6.com.br/sobre',
    section: 'Institucional',
    isAdmin: false,
    showInNav: true,
    navLabel: 'sobre'
  },
  atendimentos: {
    path: '/atendimentos',
    title: 'Atendimentos & Consultas Astrológicas | Casa 6 — Bianca Tofoli',
    description: 'Pronto Socorro, Acompanhamento Astral, Mapa Natal, Planejamento e Combos. Agende sua consulta com Bianca Tofoli.',
    canonicalUrl: 'https://casa6.com.br/atendimentos',
    section: 'Serviços',
    isAdmin: false,
    showInNav: true,
    navLabel: 'atendimentos'
  },
  atendimentoDetalhe: {
    path: '/atendimentos/:slug',
    title: 'Consulta de Mapa Astral | Casa 6 — Bianca Tofoli',
    description: 'Detalhamento do atendimento de Astrologia, formato da sessão e direcionamento para agendamento.',
    canonicalUrl: 'https://casa6.com.br/atendimentos',
    section: 'Serviços',
    isAdmin: false
  },
  patota: {
    path: '/patota',
    title: 'Patota Astral (Assinatura) | Comunidade Recorrente — Casa 6',
    description: 'Acompanhamento astrológico contínuo por assinatura com Bianca Tofoli. Estudos dos céus, encontros mensais e alinhamento prático.',
    canonicalUrl: 'https://casa6.com.br/patota',
    section: 'Produtos',
    isAdmin: false,
    showInNav: true,
    navLabel: 'patota'
  },
  patotaAstral: {
    path: '/patota-astral',
    title: 'Patota Astral | Comunidade e Encontros Recorrentes — Casa 6',
    description: 'Acompanhamento astrológico contínuo com Bianca Tofoli.',
    canonicalUrl: 'https://casa6.com.br/patota',
    section: 'Produtos',
    isAdmin: false
  },
  vivencias: {
    path: '/vivencias',
    title: 'Vivências & Imersões | Curando os Ciclos — Casa 6',
    description: 'Vivência Curando os Ciclos e imersões vivenciais para sentir a astrologia no corpo, na mente e na expressão criativa.',
    canonicalUrl: 'https://casa6.com.br/vivencias',
    section: 'Experiências',
    isAdmin: false,
    showInNav: true,
    navLabel: 'vivências'
  },
  vivenciaDetalhe: {
    path: '/vivencias/:slug',
    title: 'Vivência Astrológica | Casa 6',
    description: 'Informações detalhadas sobre a vivência e solicitação de vaga.',
    canonicalUrl: 'https://casa6.com.br/vivencias',
    section: 'Experiências',
    isAdmin: false
  },
  palestras: {
    path: '/palestras',
    title: 'Palestras & Workshops | Bianca Tofoli — Casa 6',
    description: 'WAAP, RESPIRAR (a) CALMA, Autoconhecimento e temas personalizados para eventos corporativos e coletivos.',
    canonicalUrl: 'https://casa6.com.br/palestras',
    section: 'Palestras',
    isAdmin: false,
    showInNav: true,
    navLabel: 'palestras'
  },
  leituras: {
    path: '/leituras',
    title: 'Leituras & Caderno Astral | Blog Casa 6 — Bianca Tofoli',
    description: 'Artigos autorais, ensaios sobre os céus, trânsitos planetários e reflexões de Bianca Tofoli.',
    canonicalUrl: 'https://casa6.com.br/leituras',
    section: 'Editorial',
    isAdmin: false,
    showInNav: true,
    navLabel: 'leituras'
  },
  blog: {
    path: '/blog',
    title: 'Leituras & Caderno Astral | Blog Casa 6',
    description: 'Artigos autorais, ensaios sobre os céus e reflexões de Bianca Tofoli.',
    canonicalUrl: 'https://casa6.com.br/leituras',
    section: 'Editorial',
    isAdmin: false
  },
  blogDetalhe: {
    path: '/leituras/:slug',
    title: 'Artigo | Caderno Astral Casa 6',
    description: 'Leitura editorial e reflexões astrológicas autorais por Bianca Tofoli.',
    canonicalUrl: 'https://casa6.com.br/leituras',
    section: 'Editorial',
    isAdmin: false
  },
  lojinha: {
    path: '/lojinha',
    title: 'Lojinha Casa 6 | Livros, Guias e Produtos Astrológicos',
    description: 'Cadernos de lunações, guias de trânsitos e produtos autorais da Casa 6.',
    canonicalUrl: 'https://casa6.com.br/lojinha',
    section: 'E-commerce',
    isAdmin: false,
    showInNav: true,
    navLabel: 'lojinha'
  },
  loja: {
    path: '/loja',
    title: 'Lojinha Casa 6',
    description: 'Lojinha Casa 6.',
    canonicalUrl: 'https://casa6.com.br/lojinha',
    section: 'E-commerce',
    isAdmin: false
  },
  lojaDetalhe: {
    path: '/loja/:slug',
    title: 'Produto | Loja Casa 6',
    description: 'Detalhes do produto oficial da Casa 6.',
    canonicalUrl: 'https://casa6.com.br/loja',
    section: 'Loja',
    isAdmin: false
  },
  privacidade: {
    path: '/politica-de-privacidade',
    title: 'Política de Privacidade & LGPD | Casa 6 — Bianca Tofoli',
    description: 'Como protegemos seus dados pessoais de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).',
    canonicalUrl: 'https://casa6.com.br/politica-de-privacidade',
    section: 'Legal',
    isAdmin: false
  },
  termos: {
    path: '/termos',
    title: 'Termos de Uso & Propriedade Intelectual | Casa 6',
    description: 'Termos gerais de navegação, contratação de serviços e proteção de direitos autorais (Lei nº 9.610/1998).',
    canonicalUrl: 'https://casa6.com.br/termos',
    section: 'Legal',
    isAdmin: false
  },
  cookies: {
    path: '/politica-de-cookies',
    title: 'Política de Cookies e Consentimento | Casa 6',
    description: 'Informações claras sobre o uso de cookies estritamente necessários e analíticos.',
    canonicalUrl: 'https://casa6.com.br/politica-de-cookies',
    section: 'Legal',
    isAdmin: false
  },
  painel: {
    path: '/painel',
    title: 'Painel Administrativo | Casa 6 (Acesso Restrito)',
    description: 'Ambiente seguro e autenticado de gestão de leads, conteúdos e configurações da Casa 6.',
    canonicalUrl: 'https://casa6.com.br/painel',
    section: 'Administração',
    isAdmin: true
  }
};
