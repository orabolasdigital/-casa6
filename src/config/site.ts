/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Configurações Centralizadas Oficiais (Etapa 1 - Fonte Única de Verdade)
 */

import { ExperienceItem, LectureItem, ServiceItem, SiteConfiguration, TestimonialItem } from '../types';

export const SITE_CONFIG: SiteConfiguration = {
  brandName: 'Casa 6',
  commercialName: 'Casa 6 — Bianca Tofoli',
  tagline: 'Astrologia, Mapa Astral, Vivências e Patota Astral',
  founderName: 'Bianca Tofoli',
  founderTitle: 'Astróloga, Autora e Pesquisadora',
  whatsappNumberFormatted: '+55 11 95440-9774',
  whatsappNumberRaw: '5511954409774',
  emailContact: 'contato@casa6.com.br',
  instagramHandle: '@tofoli.bianca',
  instagramUrl: 'https://www.instagram.com/tofoli.bianca/',
  instagramBiancaHandle: '@tofoli.bianca',
  instagramBiancaUrl: 'https://www.instagram.com/tofoli.bianca/',
  facebookUrl: 'https://www.facebook.com/tofoli.bianca/',
  youtubeUrl: 'https://www.youtube.com/@biancatofoli',
  spotifyUrl: 'https://open.spotify.com/show/0xOuVgFFnoyNZ4Gagh0lkD?si=z7cX7N6GQMi6neMCCcrupw&utm_source=copy-link&nd=1&dlsi=056e0b08eb1446ce',
  operatingRegion: 'Atendimento Online Global & Presencial em São Paulo / Brasil',
  legalNotice: 'Site protegido contra cópia e uso indevido de conteúdo. Reprodução proibida (Lei Federal nº 9.610/1998).',
  developerCreditText: 'Desenvolvido por @orabolasdigital com estratégia humana e IA. Propriedade intelectual protegida.',
  developerCreditUrl: 'https://www.orabolasdigital.com'
};

/**
 * Ativos Oficiais de Marca da Casa 6
 * Atualizados com as imagens oficiais enviadas
 */
export const BRAND_ASSETS = {
  // Foto Bianca (usar no botão WhatsApp, e onde estiver falando de Bianca)
  biancaPhoto: 'https://static.wixstatic.com/media/02c8e0_54a33eeb476d45c49b7f4953c34177fc~mv2.jpeg',
  biancaPhotoLocal: '/assets/brand/bianca-perfil.jpg',

  // Logo horizontal branco (uso em fundos escuros: header, footer, etc.)
  logoHorizontalBranco: 'https://static.wixstatic.com/media/02c8e0_916db28bdef7413a82fde89b9ce7f738~mv2.png',
  logoHorizontalBrancoLocal: '/assets/brand/logo-horizontal-branco.png',

  // Logo quadrado branco (uso em fundos escuros)
  logoQuadradoBranco: 'https://static.wixstatic.com/media/02c8e0_ca7fa008704748b4a7569ca66a02a3bb~mv2.png',
  logoQuadradoBrancoLocal: '/assets/brand/logo-quadrado-branco.png',

  // Logo favicon branco (uso em fundos escuros / favicon)
  logoFaviconBranco: 'https://static.wixstatic.com/media/02c8e0_bce65db1891746ca848f16f8403ddaed~mv2.png',
  logoFaviconBrancoLocal: '/assets/brand/logo-favicon-branco.png',

  // Logo horizontal escuro (uso em fundos claros: modais, documentos, etc.)
  logoHorizontalEscuro: 'https://static.wixstatic.com/media/02c8e0_75b529b0748c4e54adf4e58bfa7c78dc~mv2.png',
  logoHorizontalEscuroLocal: '/assets/brand/logo-horizontal-escuro.png',

  // Logo quadrado escuro (uso em fundos claros)
  logoQuadradoEscuro: 'https://static.wixstatic.com/media/02c8e0_4e719d8db5e24feea8da15812151a65a~mv2.png',
  logoQuadradoEscuroLocal: '/assets/brand/logo-quadrado-escuro.png',
};

/**
 * Catálogo Oficial de Atendimentos da Casa 6
 * Estruturado nas categorias solicitadas:
 * - Contínuo
 * - Únicos
 * - Combos
 */
export const OFFICIAL_SERVICES: ServiceItem[] = [
  // --- CONTÍNUO ---
  {
    id: 'pronto-socorro-astrologico',
    slug: 'pronto-socorro-astrologico',
    title: 'Pronto Socorro Astrológico',
    shortDescription: 'Atendimento ágil e focado para momentos de encruzilhada, crises de clareza ou decisões importantes sob a luz dos trânsitos pontuais.',
    category: 'continuo',
    categoryGroup: 'continuo',
    tarotImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    isPrimary: false,
    order: 1,
    isActive: true,
    badge: 'Contínuo & Urgente'
  },
  {
    id: 'acompanhamento-astral-mensal',
    slug: 'acompanhamento-astral-mensal',
    title: 'Acompanhamento Astral (Mensal)',
    shortDescription: 'Sessões mensais contínuas de orientação. Acompanhe os movimentos lunares e trânsitos de cada ciclo como bússola prática de vida e trabalho.',
    category: 'continuo',
    categoryGroup: 'continuo',
    tarotImage: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=600&q=80',
    isPrimary: true,
    order: 2,
    isActive: true,
    badge: 'Mensal Contínuo'
  },

  // --- ÚNICOS ---
  {
    id: 'mapa-natal-nascimento',
    slug: 'mapa-natal-nascimento',
    title: 'Mapa Natal (Nascimento)',
    shortDescription: 'O atendimento primordial da Casa 6. Leitura completa do seu mapa de nascimento, vocação, padrões inconscientes e potenciais de realização.',
    category: 'unicos',
    categoryGroup: 'unicos',
    tarotImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    isPrimary: true,
    order: 3,
    isActive: true,
    badge: 'Atendimento Central'
  },
  {
    id: 'planejamento-astral-mensal',
    slug: 'planejamento-astral-mensal',
    title: 'Planejamento astral (Mensal)',
    shortDescription: 'Sessão estratégica avulsa para planejar metas, projetos ou transições do mês em harmonia com os ciclos astrológicos vigentes.',
    category: 'unicos',
    categoryGroup: 'unicos',
    tarotImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    isPrimary: false,
    order: 4,
    isActive: true,
    badge: 'Sessão Estratégica'
  },
  {
    id: 'mapa-revolucao-solar',
    slug: 'mapa-revolucao-solar',
    title: 'Mapa Revolução Solar (Anual)',
    shortDescription: 'A bússola do seu ano pessoal calculada no seu aniversário. Desvenda os temas predominantes, áreas de expansão e oportunidades de transformação.',
    category: 'unicos',
    categoryGroup: 'unicos',
    tarotImage: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=600&q=80',
    isPrimary: true,
    order: 5,
    isActive: true,
    badge: 'Ciclo Anual'
  },

  // --- COMBOS ---
  {
    id: 'combo-mapa-roda-revolucao',
    slug: 'combo-mapa-roda-revolucao',
    title: 'Mapa Natal + Roda Astrológica + Revolução Solar (Anual)',
    shortDescription: 'A jornada imersiva mais completa da Casa 6: o retrato da sua essência natal, a leitura da roda e o planejamento estratégico do seu ano solar.',
    category: 'combos',
    categoryGroup: 'combos',
    tarotImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    isPrimary: true,
    order: 6,
    isActive: true,
    badge: 'Combo Completo'
  },
  {
    id: 'combo-mapa-roda-terapias',
    slug: 'combo-mapa-roda-terapias',
    title: 'Mapa Natal + Roda Astrológica + 2 Sessões de Barras de Access ou Reiki',
    shortDescription: 'Aliança profunda entre simbolismo e corpo: análise profunda do mapa e roda integrada a 2 sessões energéticas para destravar padrões e alinhar os centros sutis.',
    category: 'combos',
    categoryGroup: 'combos',
    tarotImage: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
    isPrimary: true,
    order: 7,
    isActive: true,
    badge: 'Combo Integrativo'
  }
];

/**
 * Catálogo Oficial de Palestras da Casa 6
 */
export const OFFICIAL_LECTURES: LectureItem[] = [
  {
    id: 'palestra-waap',
    slug: 'waap-workshop-astrologico',
    title: 'WAAP: Workshop Astrológico de Autoconhecimento Profissional',
    summary: 'Uma imersão voltada para carreira, propósito, talentos inatos e vocação através do mapa astrológico aplicado à vida profissional.',
    format: 'corporativo'
  },
  {
    id: 'palestra-respirar-calma',
    slug: 'respirar-a-calma',
    title: 'RESPIRAR (a) CALMA',
    summary: 'Palestra e vivência sobre pausa consciente, gestão da ansiedade e reconciliação com o tempo interior em um mundo hiperconectado.',
    format: 'presencial'
  },
  {
    id: 'palestra-autoconhecimento-cuidado',
    slug: 'autoconhecimento-ferramenta-cuidado',
    title: 'AUTOCONHECIMENTO: Uma ferramenta de cuidado para si e para o outro',
    summary: 'Aprofundamento na empatia, inteligência relacional e limites saudáveis através da compreensão dos arquétipos humanos.',
    format: 'online'
  },
  {
    id: 'palestra-temas-personalizados',
    slug: 'temas-personalizados-eventos',
    title: 'TEMAS PERSONALIZADOS PARA SEU EVENTO!',
    summary: 'Desenvolvimento de palestras, rodas de conversa e experiências sob medida para empresas, congressos, retiros e coletivos.',
    format: 'corporativo'
  }
];

/**
 * Catálogo Oficial de Vivências da Casa 6
 */
export const OFFICIAL_EXPERIENCES: ExperienceItem[] = [
  {
    id: 'vivencia-curando-os-ciclos',
    slug: 'curando-os-ciclos',
    title: 'Curando os Ciclos',
    summary: 'Uma experiência presencial e imersiva de fechamento e abertura de ciclos biográficos. Mapeamento dos padrões repetitivos através da astrologia, liberação somática e rituais conscientes de transição.',
    dateInfo: 'Próxima Turma com Inscrições Abertas',
    location: 'Espaço Casa 6 — São Paulo & Online',
    status: 'aberta'
  }
];

/**
 * Depoimentos Testemunhais Oficiais (Carrossel Lento)
 * Feedbacks reais recebidos de consulentes e membros da Patota Astral (com anonimato preservado)
 */
export const OFFICIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'depoimento-1',
    authorName: 'Membro da Patota Astral',
    serviceTitle: 'Patota Astral • Guia Diário',
    content: 'A Patota Astral faz toda a diferença na minha vida! As previsões me ajudam a entender melhor os desafios e oportunidades que surgem. É como ter um guia sempre à mão para navegar pelas mudanças e decisões.',
    isFeatured: true
  },
  {
    id: 'depoimento-2',
    authorName: 'Consulente de Mapa & Trânsitos',
    serviceTitle: 'Mapa Astral & Trânsitos',
    content: 'Tudo o que você falou e descreveu faz todo sentido perfeitamente, é como se soubesse tudo o que estou vivendo e sentindo. Você é muito incrível no que faz! Anos atrás você fez meu mapa e foi tão incrível quanto agora.',
    isFeatured: true
  },
  {
    id: 'depoimento-3',
    authorName: 'Membro da Patota Astral',
    serviceTitle: 'Patota Astral • Rotina & Acolhimento',
    content: 'Na maior parte dos dias é o primeiro "bom dia" que escuto e só de ouvir já me acolho e me sinto acolhida. Hoje faz parte da minha rotina até para conseguir me organizar e me preparar para o dia.',
    isFeatured: true
  },
  {
    id: 'depoimento-4',
    authorName: 'Consulente de Revolução Solar',
    serviceTitle: 'Revolução Solar & Patota',
    content: 'Os áudios da Patota fazem muita diferença no dia a dia! Ainda mais que fiz a Revolução Solar com você: sempre que comenta algo nos áudios, corro no meu PDF para ler mais. É incrível a conexão!',
    isFeatured: true
  },
  {
    id: 'depoimento-5',
    authorName: 'Membro da Patota Astral',
    serviceTitle: 'Patota Astral • Clareza & Direção',
    content: 'É um privilégio fazer parte da Patota Astral! Nos sentimos acolhidos e ancorados pelos astros através de previsões repletas de verdade e amor. Seus áudios me ajudam a dar o tom para minha semana e tirar o melhor proveito dos desafios.',
    isFeatured: true
  },
  {
    id: 'depoimento-6',
    authorName: 'Consulente Casa 6',
    serviceTitle: 'Acolhimento & Respiração',
    content: 'Começou a bater ansiedade e corri na Patota Astral, entendi tudo e respirei! É impressionante como suas orientações trazem calma imediata e colocam a gente no centro.',
    isFeatured: true
  },
  {
    id: 'depoimento-7',
    authorName: 'Membro da Comunidade',
    serviceTitle: 'Orientação Diária Real',
    content: 'Ainda bem que temos você para nos auxiliar a dar uma equilibrada, senão teríamos pirado e causado estrago em algumas situações. Obrigada Bibi, a Patota salva os nossos dias!',
    isFeatured: true
  },
  {
    id: 'depoimento-8',
    authorName: 'Membro da Patota Astral',
    serviceTitle: 'Patota Astral • Conhecimento & Cura',
    content: 'A reflexão de hoje foi sensacional! Essa Patota Astral é cura, é conhecimento, é vida! Gratidão por sua vida e por todo o conhecimento que você compartilha com tanto amor.',
    isFeatured: true
  },
  {
    id: 'depoimento-9',
    authorName: 'Consulente Casa 6',
    serviceTitle: 'Acolhimento & Autocompaixão',
    content: 'Durante as etapas do processo eu me apegava muito às suas dicas e áudios na Patota. Sempre me lembrava das suas recomendações para seguir vibrando alto e ter mais compaixão com meus sentimentos em períodos difíceis.',
    isFeatured: true
  },
  {
    id: 'depoimento-10',
    authorName: 'Membro da Comunidade',
    serviceTitle: 'Inspiração Diária',
    content: 'Você é tão necessária! Você não faz ideia do quanto seus conteúdos me ajudam diariamente. Parece que meu dia só se inicia de verdade depois dos seus áudios e previsões! Obrigada por tanto.',
    isFeatured: true
  },
  {
    id: 'depoimento-11',
    authorName: 'Membro da Patota Astral',
    serviceTitle: 'Patota Astral • Energia do Dia',
    content: 'A Patota Astral já faz parte das minhas manhãs. Fico sabendo sobre a energia do dia e isso dá uma boa consciência do que pode acontecer pra gente já ficar atento e até aproveitar melhor os momentos. Suas explicações são muito claras!',
    isFeatured: true
  },
  {
    id: 'depoimento-12',
    authorName: 'Membro da Comunidade',
    serviceTitle: 'Comunidade Patota Astral',
    content: 'Sua Patota é um cristal, Bibi! Amo fazer parte dela, me sinto conectada e amparada todos os dias.',
    isFeatured: true
  },
  {
    id: 'depoimento-13',
    authorName: 'Membro da Patota Astral',
    serviceTitle: 'Direcionamento & Luz',
    content: 'Parabéns à minha predileta e dedicada astróloga, que ilumina e direciona meus dias na Patota! Você é luz na nossa rotina.',
    isFeatured: true
  }
];
