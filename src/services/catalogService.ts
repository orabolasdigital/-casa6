/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo de Catálogo Unificado e Sincronização com Coleções Firestore
 * 
 * Coleções no Banco de Dados:
 * - produtos_atendimentos (Pronto Socorro, Mapa Natal, Revolução Solar, Combo Completo)
 * - produtos_palestras (WAAP, Respirar (A)calma, Autoconhecimento, Vamos Montar Juntos)
 * - produtos_assinatura (Bússola Guia, Patota Astral Trimestral/Semestral/Anual)
 * - produtos_lojinha (Box Semeadura e Coleção Ritos do Universo)
 * - blog_posts (Leituras com SEO e GEO)
 */

import { db, isFirebaseReady } from './firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

export interface AtendimentoProduct {
  id: string;
  title: string;
  image: string;
  description: string;
  options?: string[];
  features?: string[];
  price: number;
  priceFormatted: string;
  category: 'atendimentos';
  ctaType: 'mercadopago';
}

export interface PalestraProduct {
  id: string;
  title: string;
  image: string;
  description: string;
  topics: string[];
  duration: string;
  priceText: string;
  videoUrls?: string[];
  category: 'palestras';
  ctaType: 'whatsapp';
}

export interface AssinaturaProduct {
  id: string;
  serviceId: 'bussula' | 'patota';
  title: string;
  image: string;
  description: string;
  price: number;
  billingPeriod: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  isRecurring: boolean;
  priceFormatted: string;
  category: 'assinaturas';
  ctaType: 'mercadopago';
}

export interface LojinhaProduct {
  id: string;
  title: string;
  image: string;
  description: string;
  collectionName: string;
  collectionDescription: string;
  boxItems: string[];
  price: number;
  priceFormatted: string;
  category: 'lojinha';
  ctaType: 'mercadopago';
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  fullContent: string;
  publishedAt: string;
  authorName: string;
  imageUrl: string;
  category: string;
  readTime: string;
  seoKeywords: string[];
  geoCoverage: string;
  originalUrl: string;
}

// 1. Catálogo Oficial de Atendimentos
export const CATALOG_ATENDIMENTOS: AtendimentoProduct[] = [
  {
    id: 'pronto-socorro-astrologico',
    title: 'Pronto Socorro Astrológico',
    image: 'https://static.wixstatic.com/media/02c8e0_4d4ebb187e354ca78c685b29702bf786~mv2.png',
    description: 'O Pronto-Socorro Astrológico é um atendimento rápido e objetivo, voltado para situações específicas do momento.',
    options: [
      'Dois aspectos do momento, como Mercúrio Retrógrado e Vênus, ou Sol e Marte, e receber orientações sobre como essas energias afetam sua vida.',
      'Um setor da sua vida, como trabalho, relacionamentos, família ou finanças, para receber uma análise detalhada sobre tendências e caminhos possíveis.'
    ],
    features: [
      'Atendimento rápido e objetivo',
      'Resposta precisa sobre situação pontual',
      'Análise prática para tomada de decisão'
    ],
    price: 97,
    priceFormatted: 'R$ 97,00',
    category: 'atendimentos',
    ctaType: 'mercadopago'
  },
  {
    id: 'mapa-natal',
    title: 'Mapa Natal',
    image: 'https://static.wixstatic.com/media/02c8e0_6f75e1ba77e0487b87f65a9c03f759a8~mv2.png',
    description: 'O Mapa Natal é a base da astrologia e do seu autoconhecimento. Ele representa a fotografia do céu no momento exato em que você nasceu e revela aspectos fundamentais da sua personalidade, padrões de comportamento e sua missão de vida.',
    features: [
      'Clareza sobre pontos fortes e áreas de aprendizado',
      'Potencialização das suas qualidades para crescer e evoluir',
      'Material detalhado em PDF incluso',
      'Áudio explicativo personalizado para revisitar sempre que precisar'
    ],
    price: 480,
    priceFormatted: 'R$ 480,00',
    category: 'atendimentos',
    ctaType: 'mercadopago'
  },
  {
    id: 'mapa-revolucao-solar',
    title: 'Mapa Revolução Solar',
    image: 'https://static.wixstatic.com/media/02c8e0_5cfca337104c4deaacf9d1fdbbd3204e~mv2.png',
    description: 'O Mapa de Revolução Solar é uma análise focada no seu próximo ano astrológico, que começa a partir do seu aniversário. Ele indica quais serão as tendências, desafios e oportunidades que se apresentam ao longo dos próximos 12 meses.',
    features: [
      'Previsões personalizadas para os próximos 12 meses',
      'Planejamento estratégico de metas e oportunidades',
      'Preparação lúcida para os desafios do ano',
      'Ótimo complemento ao Mapa Natal'
    ],
    price: 440,
    priceFormatted: 'R$ 440,00',
    category: 'atendimentos',
    ctaType: 'mercadopago'
  },
  {
    id: 'combo-mapa-roda-revolucao',
    title: 'Mapa Natal + Roda Astrológica + Revolução Solar',
    image: 'https://static.wixstatic.com/media/02c8e0_591c1874c36d498bb9a584c02efe3fe7~mv2.png',
    description: 'Este pacote é ideal para quem deseja uma compreensão completa do seu mapa astral e as influências do próximo ano. Você terá acesso ao seu Mapa Natal, que detalha sua essência, a Roda Astrológica, uma ferramenta visual para organização do seu autoconhecimento, e a Revolução Solar, que revela as previsões do seu ano.',
    features: [
      'Mapa Natal completo com detalhamento da sua essência',
      'Roda Astrológica (ferramenta visual de autoconhecimento)',
      'Revolução Solar com previsões do seu ano pessoal',
      'Excelente escolha para planejamento e direcionamento aprofundados'
    ],
    price: 920,
    priceFormatted: 'R$ 920,00',
    category: 'atendimentos',
    ctaType: 'mercadopago'
  }
];

// 2. Catálogo Oficial de Palestras
export const CATALOG_PALESTRAS: PalestraProduct[] = [
  {
    id: 'palestra-waap',
    title: 'WAAP: Workshop Astrológico de Autoconhecimento Profissional',
    image: 'https://static.wixstatic.com/media/02c8e0_427896bbb9fc41d19b341c27b8911c11~mv2.png',
    description: 'Este workshop é uma imersão completa no autoconhecimento aplicado ao ambiente profissional. Utilizando a astrologia como ferramenta de análise, exploramos o perfil de cada colaborador e como suas características podem ser potencializadas dentro da equipe.',
    topics: [
      'Como a astrologia pode auxiliar na compreensão dos talentos e desafios individuais;',
      'Como utilizar os pontos fortes para melhorar a performance profissional;',
      'Identificação de padrões comportamentais e estratégias para equilibrá-los;',
      'Dinâmicas interativas para fortalecer a conexão entre os participantes.'
    ],
    duration: '06 Horas',
    priceText: 'Sob Consulta',
    category: 'palestras',
    ctaType: 'whatsapp'
  },
  {
    id: 'palestra-respirar-calma',
    title: 'RESPIRAR (A)CALMA',
    image: 'https://static.wixstatic.com/media/02c8e0_1c8cc4414b974a1fa7953b603e066b2b~mv2.png',
    description: 'Um encontro voltado para a gestão do estresse e da ansiedade no ambiente corporativo. Com técnicas de respiração, relaxamento e mindfulness, esta palestra ajuda os participantes a desenvolver maior equilíbrio emocional e resiliência diante dos desafios do dia a dia.',
    topics: [
      'O impacto do estresse e da ansiedade no desempenho profissional;',
      'Estratégias para manter a calma e a clareza mental em momentos de pressão;',
      'Exercícios de respiração e práticas simples para relaxamento imediato;',
      'Como criar um ambiente de trabalho mais leve e produtivo.'
    ],
    duration: 'Até 02 Horas',
    priceText: 'Sob Consulta',
    category: 'palestras',
    ctaType: 'whatsapp'
  },
  {
    id: 'palestra-autoconhecimento-cuidado',
    title: 'AUTOCONHECIMENTO: Uma ferramenta de cuidado para si e para o outro',
    image: 'https://static.wixstatic.com/media/02c8e0_7e64906fe5664ee29a2dad07d76d8c7a~mv2.png',
    description: 'O autoconhecimento é um dos pilares para a construção de um ambiente organizacional saudável. Esta palestra propõe uma jornada de reflexão sobre a importância de compreender a si mesmo para melhorar a qualidade das relações interpessoais e o clima no trabalho.',
    topics: [
      'O papel do autoconhecimento no desenvolvimento profissional e pessoal;',
      'Como compreender as próprias emoções influencia na comunicação com os outros;',
      'Estratégias para fortalecer a empatia e a inteligência emocional no ambiente corporativo;',
      'Exercícios práticos para aplicar no dia a dia e melhorar as interações na equipe.'
    ],
    duration: 'Até 02 Horas',
    priceText: 'Sob Consulta',
    category: 'palestras',
    ctaType: 'whatsapp'
  },
  {
    id: 'palestra-vamos-montar-juntos',
    title: 'VAMOS MONTAR JUNTOS?',
    image: 'https://static.wixstatic.com/media/02c8e0_b033d99920454a7e90dd46c0059ac290~mv2.png',
    description: 'Podemos pensar juntos em um tema personalizado para seu evento, de forma que atenda as necessidades do encontro.',
    topics: [
      'Desenvolvimento de formato customizado para seu evento ou congresso',
      'Alinhamento com a cultura organizacional e objetivos da liderança',
      'Integração de práticas, dinâmicas e reflexões sob medida'
    ],
    videoUrls: [
      'https://www.youtube.com/watch?v=KMuJ2eIAZ2Q',
      'https://youtu.be/Zcn9Wcr7EaM?si=4k_yXcw0JCTCHptq',
      'https://www.youtube.com/watch?v=Xan_7ewnYPM',
      'https://www.youtube.com/watch?v=1cOzmlIYkBA',
      'https://www.youtube.com/watch?v=1pjYM2OwjU0',
      'https://www.youtube.com/watch?v=skRzgdfUkM8',
      'https://www.youtube.com/watch?v=FA4g-hi1IuU&t=2s'
    ],
    duration: 'Pensamos juntos',
    priceText: 'Sob Consulta',
    category: 'palestras',
    ctaType: 'whatsapp'
  }
];

// 3. Catálogo Oficial de Assinaturas Recorrentes
export const CATALOG_ASSINATURAS: AssinaturaProduct[] = [
  {
    id: 'bussula-guia-mensal',
    serviceId: 'bussula',
    title: 'Bússola Guia — Relatório Astral Mensal Personalizado',
    image: 'https://static.wixstatic.com/media/02c8e0_688edec712d4401984a6e1cf8afeb93e~mv2.png',
    description: 'Relatório em PDF com o seu mês astrológico personalizado entregue mensalmente no seu WhatsApp + acesso à Área de Membros.',
    price: 47,
    billingPeriod: 'mensal',
    isRecurring: true,
    priceFormatted: 'R$ 47,00/mês (renovação automática)',
    category: 'assinaturas',
    ctaType: 'mercadopago'
  },
  {
    id: 'patota-astral-trimestral',
    serviceId: 'patota',
    title: 'Patota Astral — Assinatura Trimestral',
    image: 'https://static.wixstatic.com/media/02c8e0_e5132493b4a14c0498c5df95ee68c593~mv2.png',
    description: 'Grupo VIP no WhatsApp com previsões diárias, encontros mensais ao vivo com Bianca Tofoli, materiais exclusivos e sorteios.',
    price: 53,
    billingPeriod: 'trimestral',
    isRecurring: true,
    priceFormatted: 'R$ 53,00 (renovação automática)',
    category: 'assinaturas',
    ctaType: 'mercadopago'
  },
  {
    id: 'patota-astral-semestral',
    serviceId: 'patota',
    title: 'Patota Astral — Assinatura Semestral',
    image: 'https://static.wixstatic.com/media/02c8e0_e5132493b4a14c0498c5df95ee68c593~mv2.png',
    description: 'Grupo VIP no WhatsApp com previsões diárias, encontros mensais ao vivo com Bianca Tofoli, materiais exclusivos e sorteios.',
    price: 51,
    billingPeriod: 'semestral',
    isRecurring: true,
    priceFormatted: 'R$ 51,00 (renovação automática)',
    category: 'assinaturas',
    ctaType: 'mercadopago'
  },
  {
    id: 'patota-astral-anual',
    serviceId: 'patota',
    title: 'Patota Astral — Assinatura Anual',
    image: 'https://static.wixstatic.com/media/02c8e0_e5132493b4a14c0498c5df95ee68c593~mv2.png',
    description: 'Grupo VIP no WhatsApp com previsões diárias, encontros mensais ao vivo com Bianca Tofoli, materiais exclusivos e sorteios. Cerca de R$ 1,50 por dia.',
    price: 43,
    billingPeriod: 'anual',
    isRecurring: true,
    priceFormatted: 'R$ 43,00 (renovação automática)',
    category: 'assinaturas',
    ctaType: 'mercadopago'
  }
];

// 4. Catálogo Oficial da Lojinha
export const CATALOG_LOJINHA: LojinhaProduct[] = [
  {
    id: 'box-semeadura',
    title: 'Box SEMEADURA',
    image: 'https://static.wixstatic.com/media/02c8e0_ba9bbb820abf45ceaf08609f65cdd001~mv2.jpeg/v1/fill/w_1015,h_735,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/02c8e0_ba9bbb820abf45ceaf08609f65cdd001~mv2.jpeg',
    description: 'A box semeadura é um convite para você semear novos caminhos ritualizando a chegada do ano novo astrológico. Mais do que uma curadoria de produtos, é um portal para o autoconhecimento e para sua renovação. Abra, sinta e permita-se florescer.',
    collectionName: 'COLEÇÃO RITOS DO UNIVERSO',
    collectionDescription: 'Feitas para você despertar o seu florescer ASTRAL em uma jornada de crescimento e transformação. Durante o ano você poderá adquirir quatro boxes que misturam astrologia com espiritualidade permitindo você à ritualizar e manifestar os seus desejos da alma, na prática. Cada box celebrará uma fase da sua colheita, que serão chamadas de: Box Semeadura, Box Acolhimento, Box Crescimento e Box Celebração.',
    boxItems: [
      '3 incensos de alecrim (sem carvão);',
      '1 incensário de pedras naturais - citrino;',
      '2 mini velas laranjas;',
      '1 vela de proteção de sal grosso;',
      '1 kit prosperidade (pirita e citrino) com saquinho de organza;',
      '1 mini buquê ornamental;',
      '1 ebook sobre o ano novo astrológico e mais o manual para esta ritualização, explicando também a escolha de cada item;',
      '1 playlist personalizada para acompanhamento desta fase;'
    ],
    price: 147,
    priceFormatted: 'R$ 147,00',
    category: 'lojinha',
    ctaType: 'mercadopago'
  }
];

// 5. Catálogo Oficial do Blog (6 Artigos Originais do Wix com SEO & GEO)
export const CATALOG_BLOG_POSTS: BlogPostItem[] = [
  {
    id: 'o-significado-da-eclipse',
    slug: 'o-significado-da-eclipse',
    title: 'O Significado do Eclipse',
    excerpt: 'Os eclipses são momentos poderosos de mudança e revelação. Eles acontecem quando o Sol, a Lua e a Terra se alinham, intensificando energias e trazendo transformações profundas a serem observadas.',
    fullContent: `O Significado do Eclipse\n\nPor Bianca Tofoli • 25 de Fevereiro de 2025\n\nEclipses: Portais de Transformação e Autoconhecimento\n\n"Tudo que acontece perto de eclipses ou entre eclipses deve ser considerado a nível de autoconhecimento."\n\nOs eclipses são momentos poderosos de mudança e revelação. Eles acontecem quando o Sol, a Lua e a Terra se alinham, intensificando energias e trazendo transformações profundas a serem observadas.\n\n☀ Eclipse Solar: Acontece sempre na Lua Nova, quando a Lua cobre o Sol. Marca inícios e oportunidades inesperadas. É um chamado para novos caminhos, mas pode trazer reviravoltas que nos tiram da zona de conforto. Excelente para redefinir metas e se reconectar com sua essência.\n\n🌕 Eclipse Lunar: Ocorre sempre na Lua Cheia, quando a Terra projeta sua sombra sobre a Lua. Traz encerramentos, finalizações de ciclos, verdades reveladas e forte impacto emocional. É um período de libertação, ideal para deixar para trás o que já não faz sentido.\n\nO que aprender com os eclipses?\n1. Autoconhecimento: Eles mostram o que precisa ser visto, mesmo que desconfortável.\n2. Desapego: Ensinam a soltar padrões e relações que não contribuem para seu crescimento.\n3. Alinhamento com seu destino: Muitas vezes, algo inesperado acontece, abrindo portas para novas possibilidades.\n\nOs eclipses aceleram mudanças. Em vez de resistir, observe o que a vida está tentando lhe mostrar e confie no processo!\n\nBoa reflexão!\nBjus, Bi Tofoli`,
    publishedAt: '25 Fev 2025',
    authorName: 'Bianca Tofoli',
    imageUrl: 'https://static.wixstatic.com/media/2feeec_5ba1606844d64da09a6379c7d46a5d36~mv2_d_5455_4286_s_4_2.jpg/v1/fill/w_2000,h_1571,al_c,q_90,usm_0.66_1.00_0.01/2feeec_5ba1606844d64da09a6379c7d46a5d36~mv2_d_5455_4286_s_4_2.jpg',
    category: 'ECLIPSE',
    readTime: '3 min de leitura',
    seoKeywords: ['eclipse', 'eclipse solar', 'eclipse lunar', 'autoconhecimento', 'astrologia', 'casa 6', 'bianca tofoli'],
    geoCoverage: 'São Paulo, Brasil',
    originalUrl: 'https://www.acasa6.com/post/o-significado-da-eclipse'
  },
  {
    id: 'mercurio-influencia-no-que-fazer-ou-nao-fazer',
    slug: 'mercurio-influencia-no-que-fazer-ou-nao-fazer',
    title: 'Mercúrio Retrógrado: O que fazer e evitar nesse período?',
    excerpt: 'Na visão do autoconhecimento podemos e devemos enxergar este trânsito astrológico sem grandes polêmicas e receios, usando o período a nosso favor.',
    fullContent: `Mercúrio Retrógrado: O que fazer e evitar nesse período?\n\nPor Bianca Tofoli • 26 de Fevereiro de 2025\n\nNa visão do autoconhecimento podemos e devemos enxergar este trânsito astrológico sem grandes polêmicas e receios:\n\nDe 15/03/2025 a 07/04/2025, teremos o primeiro MR do ano, que começará sua retrogradação no signo de Áries e retornará até Peixes, trazendo desafios e oportunidades.\n\n"Nenhum trânsito astrológico causa algo em nós, mas sim faz uma correspondência com o nosso cotidiano."\n\nO que fazer:\n• Revisar contratos e planos: Antes de assinar algo importante, releia com atenção.\n• Resgatar projetos antigos: Ótimo momento para dar continuidade ao que foi deixado de lado.\n• Refletir antes de agir: Em Áries, há impulsividade; em Peixes, confusão. Pense antes de grandes decisões.\n• Analisar sua forma de se comunicar: Excelente momento de reflexão e conexão espiritual.\n• Olhar no seu mapa natal onde você tem do grau 9° de Áries até 26° de Peixes.\n\nO que evitar:\n• Comprar eletrônicos ou iniciar projetos tecnológicos sem cautela.\n• Conversas impulsivas e discussões desnecessárias.\n• Viagens sem planejamento prévio de documentos e horários.\n• Evite prometer mais do que pode cumprir!\n\nUse esse tempo para ajustar rotas e evitar arrependimentos!\n\nBjus, Bi Tofoli`,
    publishedAt: '26 Fev 2025',
    authorName: 'Bianca Tofoli',
    imageUrl: 'https://static.wixstatic.com/media/2feeec_5413fbe5a80947fdb71f2bdc55b60b00~mv2_d_7200_4800_s_4_2.jpg/v1/fill/w_2000,h_1333,al_c,q_90,usm_0.66_1.00_0.01/2feeec_5413fbe5a80947fdb71f2bdc55b60b00~mv2_d_7200_4800_s_4_2.jpg',
    category: 'TRÂNSITOS',
    readTime: '4 min de leitura',
    seoKeywords: ['mercurio retrogrado', 'aries', 'peixes', 'comunicacao', 'rotina', 'astrologia', 'casa 6'],
    geoCoverage: 'São Paulo, Brasil',
    originalUrl: 'https://www.acasa6.com/post/merc%C3%BArio-influencia-no-que-fazer-ou-n%C3%A3o-fazer'
  },
  {
    id: 'eclipse-lunar-em-virgem-lua-de-sangue',
    slug: 'o-significado-da-eclipse-1',
    title: 'Eclipse Lunar em Virgem: A Lua de Sangue que Revela e Cura!',
    excerpt: 'No dia 14 de março de 2025, o céu traz a Lua de Sangue em Virgem. Um chamado para revisar rotinas, hábitos de saúde, produtividade e o equilíbrio entre trabalho e bem-estar.',
    fullContent: `Eclipse Lunar em Virgem: A Lua de Sangue que Revela e Cura!\n\nPor Bianca Tofoli • 12 de Março de 2025\n\nPrepare-se para o Grande Despertar do Dia 14 de Março!\n\nO Eclipse Lunar Total em Virgem, conhecido como Lua de Sangue, ocorre quando a Terra se alinha perfeitamente entre o Sol e a Lua. Astrologicamente, eclipses lunares representam momentos de encerramento, clareza e transformação. Quando acontece no signo detalhista de Virgem, ele nos convida a revisar rotinas, hábitos de saúde e o equilíbrio com o bem-estar.\n\nO que observar e como se preparar?\n1. Olhe para o seu mapa natal: Descubra onde está o signo de Virgem (e Peixes, Gêmeos ou Sagitário).\n2. Prepare um ritual de limpeza e renovação: Anote hábitos que deseja deixar para trás e ressignifique-os.\n3. Práticas recomendadas: Meditação, respiração consciente e banho de ervas purificadoras (alecrim da Caixa Semeadura).\n\nOrganize seu espaço físico e desapegue do que não serve mais.\n\nBjus, Bi Tofoli`,
    publishedAt: '12 Mar 2025',
    authorName: 'Bianca Tofoli',
    imageUrl: 'https://static.wixstatic.com/media/4e25e6_df45a33a5c7b4046b0d73fe2ef60078e~mv2.png/v1/fill/w_1300,h_735,al_c,q_90/4e25e6_df45a33a5c7b4046b0d73fe2ef60078e~mv2.png',
    category: 'ECLIPSE',
    readTime: '5 min de leitura',
    seoKeywords: ['eclipse lunar virgem', 'lua de sangue', 'saude', 'rotina', 'cura', 'astrologia', 'casa 6'],
    geoCoverage: 'São Paulo, Brasil',
    originalUrl: 'https://www.acasa6.com/post/o-significado-da-eclipse-1'
  },
  {
    id: 'ano-novo-astrologico-2025',
    slug: 'o-significado-da-eclipse-1-1',
    title: 'Ano Novo Astrológico: O que é isso e por que este recomeço será diferente?',
    excerpt: 'O Ano Novo Astrológico marca o início de um novo ciclo zodiacal quando o Sol entra no signo de Áries. Em 2025, essa transição acontece às 6h02 do dia 20 de março.',
    fullContent: `Ano Novo Astrológico: O que é isso e por que este recomeço será diferente?\n\nPor Bianca Tofoli • 18 de Março de 2025\n\n"Este é o chamado deste novo ciclo: Avançar com coragem, sim. Mas sem deixar para trás aquilo que é essencial."\n\nO Ano Novo Astrológico marca o início do zodíaco no momento em que o Sol ingressa em Áries. Em 2025, acontece às 6h02 de 20 de março.\n\nDiferente do calendário gregoriano, o Ano Novo Astrológico está alinhado aos ciclos celestes vivos. A entrada do Sol em Áries simboliza renovação pura. Em 2025, acontece com Vênus e Mercúrio retrógrados, exigindo avançar com reflexão e alinhamento aos próprios valores.\n\nPrincipais influências do ciclo:\n1. Júpiter entrando em Câncer: acolhimento, expansão e conexão íntima.\n2. Nodo Norte em Peixes: resgate da espiritualidade e da sensibilidade.\n3. Saturno e Netuno: reavaliação de estruturas e reconexão com o essencial.\n4. Urano em Gêmeos: revolução na comunicação e diálogos conscientes.\n\nA Caixa Semeadura da Casa 6 foi desenhada exatamente para apoiar essa passagem.\n\nBjus, Bi Tofoli`,
    publishedAt: '18 Mar 2025',
    authorName: 'Bianca Tofoli',
    imageUrl: 'https://static.wixstatic.com/media/4e25e6_ce08add5cc744fef98db54df079d83ea~mv2.webp/v1/fill/w_774,h_484,al_c,q_85/4e25e6_ce08add5cc744fef98db54df079d83ea~mv2.webp',
    category: 'CICLOS',
    readTime: '6 min de leitura',
    seoKeywords: ['ano novo astrologico', 'sol em aries', 'renovacao', 'jupiter em cancer', 'caixa semeadura'],
    geoCoverage: 'São Paulo, Brasil',
    originalUrl: 'https://www.acasa6.com/post/o-significado-da-eclipse-1-1'
  },
  {
    id: 'mercurio-retrogrado-em-leao',
    slug: 'mercurio-retrogrado-o-que-significa-ele-em-leao',
    title: 'Mercúrio Retrógrado: O que significa ele em Leão?',
    excerpt: 'De 18/07/25 até 11/08/25, teremos Mercúrio retrógrado no signo de Leão. Como repensar se estamos nos comunicando com o coração ou com o ego.',
    fullContent: `Mercúrio Retrógrado: O que significa ele em Leão?\n\nPor Bianca Tofoli • 17 de Julho de 2025\n\nDe 18/07/25 até 11/08/25, o trânsito de Mercúrio Retrógrado acontece no signo de Leão, do grau 15 ao 04.\n\nO que fazer:\n1. Reavalie sua forma de se expressar: Você fala para ser ouvido ou para ser admirado? Escute com o coração.\n2. Revise projetos criativos inacabados: Reabra gavetas e finalize textos e criações com nova maturidade.\n3. Observe o orgulho ferido: O silêncio lúcido é o maior sinal de autoconfiança.\n4. Volte a acender seu brilho interno: Retome o que você fazia por puro prazer.\n5. Refaça sua relação com a autoestima: Afirme-se de dentro para fora.\n\nO que evitar:\n• Assinar acordos e contratos sem ler as letras miúdas com extrema atenção.\n• Decisões precipitadas motivadas por orgulho ou vaidade ferida.\n• Grandes compras tecnológicas sem conferir garantias.\n\nBjus, Bi Tofoli`,
    publishedAt: '17 Jul 2025',
    authorName: 'Bianca Tofoli',
    imageUrl: 'https://static.wixstatic.com/media/2feeec_5413fbe5a80947fdb71f2bdc55b60b00~mv2_d_7200_4800_s_4_2.jpg/v1/fill/w_2000,h_1333,al_c,q_90,usm_0.66_1.00_0.01/2feeec_5413fbe5a80947fdb71f2bdc55b60b00~mv2_d_7200_4800_s_4_2.jpg',
    category: 'TRÂNSITOS',
    readTime: '4 min de leitura',
    seoKeywords: ['mercurio retrogrado leao', 'autoestima', 'expressao', 'criatividade', 'astrologia'],
    geoCoverage: 'São Paulo, Brasil',
    originalUrl: 'https://www.acasa6.com/post/merc%C3%BArio-retr%C3%B3grado-o-que-significa-ele-em-le%C3%A3o'
  },
  {
    id: 'eclipses-setembro-2025-peixes-virgem',
    slug: 'eclipse-lunar-em-peixes-e-solar-em-virgem-o-que-podemos-esperar-do-mes-de-setembro-2025',
    title: 'Eclipse Lunar em Peixes e Solar em Virgem: O que esperar de Setembro/2025',
    excerpt: 'O mês de setembro de 2025 será marcado pelo Eclipse Lunar em Peixes (dia 7) e pelo Eclipse Solar em Virgem (dia 21), trazendo a união entre a sensibilidade intuitiva e o planejamento prático.',
    fullContent: `Eclipse Lunar em Peixes e Solar em Virgem: O que podemos esperar do mês de Setembro/2025\n\nPor Bianca Tofoli • 04 de Setembro de 2025\n\nO mês de setembro de 2025 será marcado por dois eventos astrológicos de grande impacto: um Eclipse Lunar em Peixes, no dia 7, e um Eclipse Solar em Virgem, no dia 21. Muito além de um espetáculo no céu, esses eclipses trazem reflexões profundas sobre como organizamos a vida.\n\nO Eclipse Lunar em Peixes convida a um mergulho emocional e espiritual. Ajuda a reconhecer feridas, praticar o perdão e deixar ir o que já não faz sentido.\n\nO Eclipse Solar em Virgem, duas semanas depois, pede ação, rotina e método. A transformação acontece nos detalhes do dia a dia e nos cuidados com o corpo físico.\n\nOs dois fenômenos se complementam: viver com consciência significa unir o sonho de Peixes à realização concreta de Virgem.\n\nComo aproveitar:\n• Faça uma pausa para ouvir sua intuição.\n• Ajuste sua rotina de sono e exames de saúde.\n• Crie metas claras e duradouras.\n• Pratique empatia consigo e com os outros.\n\nBjus, Bi Tofoli`,
    publishedAt: '04 Set 2025',
    authorName: 'Bianca Tofoli',
    imageUrl: 'https://static.wixstatic.com/media/4e25e6_df45a33a5c7b4046b0d73fe2ef60078e~mv2.png/v1/fill/w_1300,h_735,al_c,q_90/4e25e6_df45a33a5c7b4046b0d73fe2ef60078e~mv2.png',
    category: 'ECLIPSE',
    readTime: '5 min de leitura',
    seoKeywords: ['eclipse peixes', 'eclipse virgem', 'setembro 2025', 'espiritualidade', 'organizacao', 'casa 6'],
    geoCoverage: 'São Paulo, Brasil',
    originalUrl: 'https://www.acasa6.com/post/eclipse-lunar-em-peixes-e-solar-em-virgem-o-que-podemos-esperar-do-m%C3%AAs-de-setembro-2025'
  }
];

/**
 * Função de sincronização com o Firestore:
 * Garante que todas as coleções existam e estejam atualizadas no banco de dados.
 */
export async function syncCatalogWithFirestore(): Promise<void> {
  if (!isFirebaseReady || !db) {
    console.info('[Catalog] Firestore em modo local/fallback.');
    return;
  }

  try {
    // 1. Produtos Atendimentos
    for (const item of CATALOG_ATENDIMENTOS) {
      await setDoc(doc(db, 'produtos_atendimentos', item.id), item, { merge: true });
    }

    // 2. Produtos Palestras
    for (const item of CATALOG_PALESTRAS) {
      await setDoc(doc(db, 'produtos_palestras', item.id), item, { merge: true });
    }

    // 3. Produtos Assinaturas
    for (const item of CATALOG_ASSINATURAS) {
      await setDoc(doc(db, 'produtos_assinatura', item.id), item, { merge: true });
    }

    // 4. Produtos Lojinha
    for (const item of CATALOG_LOJINHA) {
      await setDoc(doc(db, 'produtos_lojinha', item.id), item, { merge: true });
    }

    // 5. Blog Posts
    for (const item of CATALOG_BLOG_POSTS) {
      await setDoc(doc(db, 'blog_posts', item.id), item, { merge: true });
    }

    console.info('[Catalog] Sincronização de catálogo com Firestore concluída com sucesso!');
  } catch (err) {
    console.warn('[Catalog Sync Warning]', err);
  }
}

/**
 * Retorna os últimos artigos editoriais cadastrados (por padrão os 3 mais recentes),
 * buscando diretamente da coleção `blog_posts` no Firestore com fallback automático.
 */
export async function getLatestBlogPosts(limitCount = 3): Promise<BlogPostItem[]> {
  if (!isFirebaseReady || !db) {
    return CATALOG_BLOG_POSTS.slice(0, limitCount);
  }

  try {
    const snap = await getDocs(collection(db, 'blog_posts'));
    if (!snap.empty) {
      const posts: BlogPostItem[] = [];
      snap.forEach(docSnap => {
        posts.push({ id: docSnap.id, ...(docSnap.data() as BlogPostItem) });
      });

      if (posts.length > 0) {
        // Ordena mantendo a ordem dos IDs conhecidos ou do Firestore
        return posts.slice(0, limitCount);
      }
    }
  } catch (err) {
    console.warn('[Catalog] Aviso ao buscar blog_posts no Firestore:', err);
  }

  return CATALOG_BLOG_POSTS.slice(0, limitCount);
}
