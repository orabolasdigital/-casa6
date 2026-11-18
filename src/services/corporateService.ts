/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo de Serviços Corporativos: Palestras Realizadas & Parcerias Comerciais
 * Coleções Firestore: 'palestras_portfolio' e 'parcerias_portfolio'
 */

import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { PalestraItem, ParceriaItem } from '../types';
import { db, isFirebaseReady } from './firebase';

const LOCAL_STORAGE_PALESTRAS_KEY = 'casa6_palestras_portfolio';
const LOCAL_STORAGE_PARCERIAS_KEY = 'casa6_parcerias_portfolio';

/**
 * 4 Palestras Realizadas Iniciais Oficiais
 */
export const INITIAL_PALESTRAS: PalestraItem[] = [
  {
    id: 'palestra-sulamerica',
    empresa: 'SulAmérica Saúde',
    logoUrl: 'https://static.wixstatic.com/media/02c8e0_9faeeab290534345a6aaa65fddb10d0f~mv2.png',
    fotos: [
      'https://static.wixstatic.com/media/02c8e0_fe08bedd21184bf390fb985cae10f64f~mv2.jpeg',
      'https://static.wixstatic.com/media/02c8e0_a13640d454f24a28aa319aff4da6d884~mv2.jpeg',
      'https://static.wixstatic.com/media/02c8e0_e81f0acbec8f4d0f81705da0870786e9~mv2.jpeg'
    ],
    duracao: '1h30',
    descricao: 'Palestra magna sobre inteligência emocional, regulação da ansiedade e bem-estar para mais de 300 profissionais da área da saúde e corporativo.',
    conteudo: [
      'Técnicas de respiração e autorregulação em momentos de crise',
      'Prevenção ativa do estresse ocupacional e burnout em conformidade com a NR-1',
      'Inteligência emocional nas tomadas de decisão sob pressão'
    ],
    tags: ['Saúde Mental', 'NR-1 & Prevenção', 'Liderança', 'Bem-Estar'],
    destaque: true,
    createdAt: '2026-11-18T00:00:00.000Z'
  },
  {
    id: 'palestra-fleury',
    empresa: 'Grupo Fleury',
    logoUrl: 'https://static.wixstatic.com/media/02c8e0_aaf906445da54658b1fa405f95a96e77~mv2.png',
    fotos: [
      'https://static.wixstatic.com/media/02c8e0_e4f2fc5649194eb98a6447eb737b0c1f~mv2.png',
      'https://static.wixstatic.com/media/02c8e0_45226c3678894dd28686198467fba683~mv2.png',
      'https://static.wixstatic.com/media/02c8e0_380e873fc70146d7bb82d2fd025c3753~mv2.jpeg'
    ],
    duracao: '2h00',
    descricao: 'Encontro vivencial sobre comunicação sem ruído, autoconhecimento e conexão interpessoal entre lideranças e equipes multidisciplinares.',
    conteudo: [
      'A imagem que comunica: presença e linguagem não-verbal',
      'Eliminação de ruídos e conflitos interpessoais entre setores',
      'Construção de segurança psicológica nos times'
    ],
    tags: ['Comunicação Sem Ruído', 'Segurança Psicológica', 'Equipes'],
    destaque: true,
    createdAt: '2026-11-18T00:00:00.000Z'
  },
  {
    id: 'palestra-amais',
    empresa: 'a+ Medicina Diagnóstica',
    logoUrl: 'https://static.wixstatic.com/media/02c8e0_368973d7ca9543d88d89379497662314~mv2.png',
    fotos: [
      'https://static.wixstatic.com/media/02c8e0_cf41c479031f420eb8651aebe7d44e9b~mv2.jpeg',
      'https://static.wixstatic.com/media/02c8e0_451d9f2ed93849988c296896d5c302de~mv2.jpeg',
      'https://static.wixstatic.com/media/02c8e0_2d5939458116477fb9baac48e5f40050~mv2.jpeg'
    ],
    duracao: '1h30',
    descricao: 'Palestra comemorativa do Mês da Mulher: superação da síndrome da impostora, protagonismo feminino e equilíbrio entre vida pessoal e carreira.',
    conteudo: [
      'Coragem em Si: vencendo a autossabotagem e a síndrome da impostora',
      'Liderança feminina com humanização e assertividade',
      'Rituais práticos de autocuidado para a rotina corporativa'
    ],
    tags: ['Liderança Feminina', 'Autoajuda', 'Autocuidado', 'Protagonismo'],
    destaque: true,
    createdAt: '2026-11-18T00:00:00.000Z'
  },
  {
    id: 'palestra-hermes-pardini',
    empresa: 'Hermes Pardini',
    logoUrl: 'https://static.wixstatic.com/media/02c8e0_0b8081b7c7c14335b43abbc6a3653930~mv2.png',
    fotos: [
      'https://static.wixstatic.com/media/02c8e0_45226c3678894dd28686198467fba683~mv2.png',
      'https://static.wixstatic.com/media/02c8e0_fe08bedd21184bf390fb985cae10f64f~mv2.jpeg'
    ],
    duracao: '3h00 (Workshop Imersivo)',
    descricao: 'Workshop prático com dinâmicas corporativas para alinhamento de propósito individual com os objetivos estratégicos da organização.',
    conteudo: [
      'Propósito x Vocação: integrando talentos às metas da empresa',
      'Gestão humanizada e combate à rotatividade (turnover)',
      'Plano individual de ação com foco em saúde mental contínua'
    ],
    tags: ['Propósito & Vocação', 'Retenção de Talentos', 'NR-1', 'Cultura'],
    destaque: false,
    createdAt: '2026-11-18T00:00:00.000Z'
  }
];

/**
 * 4 Exemplos Iniciais de Parcerias Comerciais
 */
export const INITIAL_PARCERIAS: ParceriaItem[] = [
  {
    id: 'parceria-botanica',
    empresa: 'Botânica & Rituais Naturais',
    logoUrl: 'https://static.wixstatic.com/media/02c8e0_8af738fb419e424887681c32ca6a68a4~mv2.png',
    fotos: [
      'https://static.wixstatic.com/media/02c8e0_ba9bbb820abf45ceaf08609f65cdd001~mv2.jpeg',
      'https://static.wixstatic.com/media/02c8e0_bffe59c202114da5976eac816b4d7f14~mv2.jpeg'
    ],
    tipo: 'Permuta',
    descricao: 'Co-criação de curadorias botânicas e aromaterapia para as edições limitadas da Casa 6 e kits de eventos corporativos.',
    oQueOferece: 'Insumos botânicos puros, óleos essenciais e incensos de citrino em troca de divulgação qualificada e associação de marca autoral.',
    destaque: true,
    createdAt: '2026-11-18T00:00:00.000Z'
  },
  {
    id: 'parceria-florescer',
    empresa: 'Espaço & Clínica Florescer',
    logoUrl: 'https://static.wixstatic.com/media/02c8e0_deeebd7d569e49648f10569a657b530c~mv2.png',
    fotos: [
      'https://static.wixstatic.com/media/02c8e0_fe08bedd21184bf390fb985cae10f64f~mv2.jpeg',
      'https://static.wixstatic.com/media/02c8e0_a13640d454f24a28aa319aff4da6d884~mv2.jpeg'
    ],
    tipo: 'Divulgação',
    descricao: 'Realização de imersões presenciais com suporte de infraestrutura física, salas integradas e acolhimento dos participantes.',
    oQueOferece: 'Auditório premium para até 80 pessoas e condições de acesso exclusivas aos membros da comunidade Patota Astral.',
    destaque: true,
    createdAt: '2026-11-18T00:00:00.000Z'
  },
  {
    id: 'parceria-cravo',
    empresa: 'Cravo Cosméticos & Autocuidado',
    logoUrl: 'https://static.wixstatic.com/media/02c8e0_79bd2eb0deaf49888df17c53599c26a6~mv2.png',
    fotos: [
      'https://static.wixstatic.com/media/02c8e0_e81f0acbec8f4d0f81705da0870786e9~mv2.jpeg',
      'https://static.wixstatic.com/media/02c8e0_e4f2fc5649194eb98a6447eb737b0c1f~mv2.png'
    ],
    tipo: 'Publicidade',
    descricao: 'Campanhas editoriais nas redes sociais da Bianca Tofoli e no canal do YouTube conectando beleza limpa, rituais e autocuidado.',
    oQueOferece: 'Patrocínio de conteúdos no Caderno Astral, linhas de cuidados e amostras personalizadas para eventos presenciais.',
    destaque: true,
    createdAt: '2026-11-18T00:00:00.000Z'
  },
  {
    id: 'parceria-papelaria',
    empresa: 'Papelaria Fina & Cadernos Astrais',
    logoUrl: 'https://static.wixstatic.com/media/02c8e0_b033d99920454a7e90dd46c0059ac290~mv2.png',
    fotos: [
      'https://static.wixstatic.com/media/02c8e0_9dd6cf6b3ee04b91abaf08201cb06526~mv2.jpeg',
      'https://static.wixstatic.com/media/02c8e0_2086a601c1f7408bbd79045e0d8d7cfd~mv2.jpeg'
    ],
    tipo: 'Personalizado',
    descricao: 'Desenvolvimento conjunto de planners astrológicos, cadernos de intenções de lunação e materiais de apoio para empresas.',
    oQueOferece: 'Produção gráfica sob demanda com acabamento nobre em capa dura, fitas de cetim e comercialização compartilhada.',
    destaque: false,
    createdAt: '2026-11-18T00:00:00.000Z'
  }
];

/**
 * Obtém a lista de palestras realizadas (Firestore ou LocalStorage)
 */
export async function getPalestrasPortfolio(): Promise<PalestraItem[]> {
  if (isFirebaseReady && db) {
    try {
      const snapshot = await getDocs(collection(db, 'palestras_portfolio'));
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => d.data() as PalestraItem);
      }
      // Se vazio, semeia os 4 exemplos
      for (const item of INITIAL_PALESTRAS) {
        await setDoc(doc(db, 'palestras_portfolio', item.id), item);
      }
      return INITIAL_PALESTRAS;
    } catch (err) {
      console.warn('[CorporateService] Erro ao buscar palestras do Firestore:', err);
    }
  }

  // Fallback LocalStorage
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_PALESTRAS_KEY);
      if (cached) return JSON.parse(cached);
      localStorage.setItem(LOCAL_STORAGE_PALESTRAS_KEY, JSON.stringify(INITIAL_PALESTRAS));
    } catch {
      // Ignora erro de storage
    }
  }

  return INITIAL_PALESTRAS;
}

/**
 * Obtém a lista de parcerias comerciais (Firestore ou LocalStorage)
 */
export async function getParceriasPortfolio(): Promise<ParceriaItem[]> {
  if (isFirebaseReady && db) {
    try {
      const snapshot = await getDocs(collection(db, 'parcerias_portfolio'));
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => d.data() as ParceriaItem);
      }
      // Se vazio, semeia os 4 exemplos
      for (const item of INITIAL_PARCERIAS) {
        await setDoc(doc(db, 'parcerias_portfolio', item.id), item);
      }
      return INITIAL_PARCERIAS;
    } catch (err) {
      console.warn('[CorporateService] Erro ao buscar parcerias do Firestore:', err);
    }
  }

  // Fallback LocalStorage
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_PARCERIAS_KEY);
      if (cached) return JSON.parse(cached);
      localStorage.setItem(LOCAL_STORAGE_PARCERIAS_KEY, JSON.stringify(INITIAL_PARCERIAS));
    } catch {
      // Ignora erro de storage
    }
  }

  return INITIAL_PARCERIAS;
}

export async function savePalestraItem(item: Partial<PalestraItem>): Promise<PalestraItem> {
  const currentList = await getPalestrasPortfolio();
  const id = item.id || `palestra_${Date.now()}`;
  const fullItem: PalestraItem = {
    id,
    empresa: item.empresa || 'Nova Empresa',
    logoUrl: item.logoUrl || 'https://static.wixstatic.com/media/02c8e0_9faeeab290534345a6aaa65fddb10d0f~mv2.png',
    fotos: item.fotos && item.fotos.length > 0 ? item.fotos : ['https://static.wixstatic.com/media/02c8e0_fe08bedd21184bf390fb985cae10f64f~mv2.jpeg'],
    duracao: item.duracao || '1h30',
    descricao: item.descricao || 'Descrição da palestra corporativa.',
    conteudo: item.conteudo || ['Tópico 1', 'Tópico 2'],
    tags: item.tags || ['Bem-Estar', 'NR-1'],
    destaque: item.destaque ?? true,
    createdAt: item.createdAt || new Date().toISOString()
  };

  const idx = currentList.findIndex((p) => p.id === id);
  let updated: PalestraItem[];
  if (idx >= 0) {
    updated = [...currentList];
    updated[idx] = fullItem;
  } else {
    updated = [fullItem, ...currentList];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_PALESTRAS_KEY, JSON.stringify(updated));
  }

  if (isFirebaseReady && db) {
    try {
      await setDoc(doc(db, 'palestras_portfolio', id), fullItem, { merge: true });
    } catch (err) {
      console.warn('[CorporateService] Erro ao salvar palestra no Firestore:', err);
    }
  }

  return fullItem;
}

export async function deletePalestraItem(id: string): Promise<void> {
  const currentList = await getPalestrasPortfolio();
  const filtered = currentList.filter((p) => p.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_PALESTRAS_KEY, JSON.stringify(filtered));
  }

  if (isFirebaseReady && db) {
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'palestras_portfolio', id));
    } catch (err) {
      console.warn('[CorporateService] Erro ao excluir palestra do Firestore:', err);
    }
  }
}

export async function saveParceriaItem(item: Partial<ParceriaItem>): Promise<ParceriaItem> {
  const currentList = await getParceriasPortfolio();
  const id = item.id || `parceria_${Date.now()}`;
  const fullItem: ParceriaItem = {
    id,
    empresa: item.empresa || 'Nova Empresa / Parceiro',
    logoUrl: item.logoUrl || 'https://static.wixstatic.com/media/02c8e0_8af738fb419e424887681c32ca6a68a4~mv2.png',
    fotos: item.fotos && item.fotos.length > 0 ? item.fotos : ['https://static.wixstatic.com/media/02c8e0_ba9bbb820abf45ceaf08609f65cdd001~mv2.jpeg'],
    tipo: item.tipo || 'Permuta',
    descricao: item.descricao || 'Descrição da parceria estratégica.',
    oQueOferece: item.oQueOferece || 'O que a parceria oferece para os clientes e comunidade Casa 6.',
    destaque: item.destaque ?? true,
    createdAt: item.createdAt || new Date().toISOString()
  };

  const idx = currentList.findIndex((p) => p.id === id);
  let updated: ParceriaItem[];
  if (idx >= 0) {
    updated = [...currentList];
    updated[idx] = fullItem;
  } else {
    updated = [fullItem, ...currentList];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_PARCERIAS_KEY, JSON.stringify(updated));
  }

  if (isFirebaseReady && db) {
    try {
      await setDoc(doc(db, 'parcerias_portfolio', id), fullItem, { merge: true });
    } catch (err) {
      console.warn('[CorporateService] Erro ao salvar parceria no Firestore:', err);
    }
  }

  return fullItem;
}

export async function deleteParceriaItem(id: string): Promise<void> {
  const currentList = await getParceriasPortfolio();
  const filtered = currentList.filter((p) => p.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_PARCERIAS_KEY, JSON.stringify(filtered));
  }

  if (isFirebaseReady && db) {
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'parcerias_portfolio', id));
    } catch (err) {
      console.warn('[CorporateService] Erro ao excluir parceria do Firestore:', err);
    }
  }
}

