/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo de Gerenciamento de Usuários e Acessos ao Painel (/painel)
 * Coleção Firestore: 'admin_users'
 * 
 * Níveis de Acesso (RBAC):
 * - Suporte (Master): Não pode ser removido, alterado ou ajustado. Acesso irrestrito.
 * - Bianca (Administradora): Pode inserir, excluir, alterar nomes e senhas de outros membros (inclusive Caio).
 * - Caio (Operador/Básico): Acesso a todas as funções operacionais, mas não pode inserir nem excluir usuários; pode alterar apenas seu próprio nome e senha.
 */

import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { AdminUser, UserProfile, UserRole } from '../types';
import { db, isFirebaseReady, handleFirestoreError, OperationType } from './firebase';

const LOCAL_STORAGE_ADMIN_USERS_KEY = 'casa6_admin_users_repository';

/**
 * Cadastros Iniciais Obrigatórios
 */
export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'suporte',
    username: 'Suporte',
    password: '20007Trinta5',
    role: 'master',
    isProtected: true,
    createdAt: '2026-11-18T00:00:00.000Z',
    updatedAt: '2026-11-18T00:00:00.000Z'
  },
  {
    id: 'bianca',
    username: 'Bianca',
    password: 'bianca',
    role: 'admin',
    isProtected: false,
    createdAt: '2026-11-18T00:00:00.000Z',
    updatedAt: '2026-11-18T00:00:00.000Z'
  },
  {
    id: 'caio',
    username: 'Caio',
    password: 'caio',
    role: 'operador',
    isProtected: false,
    createdAt: '2026-11-18T00:00:00.000Z',
    updatedAt: '2026-11-18T00:00:00.000Z'
  }
];

/**
 * Lê os usuários locais do LocalStorage
 */
function getLocalAdminUsers(): AdminUser[] {
  if (typeof window === 'undefined') return INITIAL_ADMIN_USERS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ADMIN_USERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_ADMIN_USERS_KEY, JSON.stringify(INITIAL_ADMIN_USERS));
      return INITIAL_ADMIN_USERS;
    }
    const parsed = JSON.parse(raw) as AdminUser[];
    // Garante que o Suporte sempre exista na lista
    if (!parsed.some((u) => u.id === 'suporte' || u.username.toLowerCase() === 'suporte')) {
      const merged = [INITIAL_ADMIN_USERS[0], ...parsed];
      localStorage.setItem(LOCAL_STORAGE_ADMIN_USERS_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (err) {
    console.warn('[AdminUsers] Erro ao ler LocalStorage:', err);
    return INITIAL_ADMIN_USERS;
  }
}

/**
 * Salva os usuários no LocalStorage
 */
function saveLocalAdminUsers(users: AdminUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_ADMIN_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.warn('[AdminUsers] Erro ao salvar LocalStorage:', err);
  }
}

/**
 * Obtém todos os usuários administradores da coleção 'admin_users'
 */
export async function getAdminUsersList(): Promise<AdminUser[]> {
  if (isFirebaseReady && db) {
    try {
      const snapshot = await getDocs(collection(db, 'admin_users'));
      if (!snapshot.empty) {
        const remoteUsers = snapshot.docs.map((d) => d.data() as AdminUser);

        // Garante que o Suporte mestre nunca se perca
        const hasSuporte = remoteUsers.some((u) => u.id === 'suporte' || u.username.toLowerCase() === 'suporte');
        if (!hasSuporte) {
          await setDoc(doc(db, 'admin_users', 'suporte'), INITIAL_ADMIN_USERS[0]);
          remoteUsers.unshift(INITIAL_ADMIN_USERS[0]);
        }

        saveLocalAdminUsers(remoteUsers);
        return remoteUsers;
      }

      // Se a coleção estiver vazia, popula com os 3 acessos iniciais no Firestore
      for (const initUser of INITIAL_ADMIN_USERS) {
        await setDoc(doc(db, 'admin_users', initUser.id), initUser);
      }
      saveLocalAdminUsers(INITIAL_ADMIN_USERS);
      return INITIAL_ADMIN_USERS;
    } catch (err) {
      console.warn('[AdminUsers] Erro ao acessar Firestore, utilizando fallback local:', err);
    }
  }

  return getLocalAdminUsers();
}

/**
 * Autentica um usuário por Nome e Senha
 */
export async function authenticateAdminUser(
  username: string,
  passwordAttempt: string
): Promise<AdminUser | null> {
  const users = await getAdminUsersList();
  const normalized = username.trim().toLowerCase();

  const found = users.find(
    (u) => u.username.trim().toLowerCase() === normalized && u.password === passwordAttempt
  );

  return found || null;
}

/**
 * Cadastra um novo usuário no painel de controle
 * Restrição: Caio (operador) não pode inserir cadastros. Apenas Bianca (admin) e Suporte (master).
 */
export async function createAdminUser(
  creator: UserProfile,
  data: {
    username: string;
    password: string;
    role: 'admin' | 'operador';
  }
): Promise<AdminUser> {
  if (creator.role === 'operador' || creator.role === 'editor') {
    throw new Error('Você não tem permissão para inserir novos usuários no banco de dados.');
  }

  const cleanName = data.username.trim();
  if (!cleanName) throw new Error('O nome do usuário é obrigatório.');
  if (!data.password.trim()) throw new Error('A senha é obrigatória.');

  const currentUsers = await getAdminUsersList();
  if (currentUsers.some((u) => u.username.toLowerCase() === cleanName.toLowerCase())) {
    throw new Error(`Já existe um usuário cadastrado com o nome "${cleanName}".`);
  }

  const id = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString().slice(-4);
  const now = new Date().toISOString();

  const newUser: AdminUser = {
    id,
    username: cleanName,
    password: data.password.trim(),
    role: data.role,
    isProtected: false,
    createdAt: now,
    updatedAt: now
  };

  if (isFirebaseReady && db) {
    try {
      await setDoc(doc(db, 'admin_users', id), newUser);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `admin_users/${id}`);
    }
  }

  const updatedList = [...currentUsers, newUser];
  saveLocalAdminUsers(updatedList);
  return newUser;
}

/**
 * Atualiza o nome ou a senha de um usuário
 * Regras:
 * - Suporte é mestre protegido: NÃO pode ser alterado por ninguém.
 * - Caio (operador): só pode alterar seu próprio nome e sua própria senha.
 * - Bianca (admin) e Suporte: podem alterar nome e senha de qualquer outro membro.
 */
export async function updateAdminUser(
  currentUser: UserProfile,
  targetId: string,
  updates: {
    username?: string;
    password?: string;
    role?: 'admin' | 'operador';
  }
): Promise<AdminUser> {
  const currentUsers = await getAdminUsersList();
  const targetUser = currentUsers.find((u) => u.id === targetId);

  if (!targetUser) {
    throw new Error('Usuário não encontrado.');
  }

  // O Suporte não pode ser alterado de nenhuma forma
  if (targetUser.isProtected || targetUser.id === 'suporte' || targetUser.username.toLowerCase() === 'suporte') {
    throw new Error('O usuário Suporte é um administrador mestre protegido e não pode ser alterado ou ajustado.');
  }

  // Se for operador (Caio), só pode alterar seu próprio cadastro
  if (currentUser.role === 'operador' || currentUser.role === 'editor') {
    const isSelf =
      currentUser.id === targetId ||
      currentUser.displayName.toLowerCase() === targetUser.username.toLowerCase();

    if (!isSelf) {
      throw new Error('Operadores só têm permissão para alterar o próprio nome e a própria senha.');
    }

    // Operador não pode mudar seu próprio cargo
    if (updates.role && updates.role !== 'operador') {
      throw new Error('Você não tem permissão para alterar seu nível de acesso.');
    }
  }

  // Validação de duplicidade de nome caso esteja alterando o nome
  if (updates.username && updates.username.trim().toLowerCase() !== targetUser.username.toLowerCase()) {
    const cleanName = updates.username.trim();
    if (currentUsers.some((u) => u.id !== targetId && u.username.toLowerCase() === cleanName.toLowerCase())) {
      throw new Error(`Já existe outro usuário cadastrado com o nome "${cleanName}".`);
    }
  }

  const now = new Date().toISOString();
  const updatedUser: AdminUser = {
    ...targetUser,
    username: updates.username ? updates.username.trim() : targetUser.username,
    password: updates.password ? updates.password.trim() : targetUser.password,
    role: updates.role ? updates.role : targetUser.role,
    updatedAt: now
  };

  if (isFirebaseReady && db) {
    try {
      await updateDoc(doc(db, 'admin_users', targetId), {
        username: updatedUser.username,
        password: updatedUser.password,
        role: updatedUser.role,
        updatedAt: now
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `admin_users/${targetId}`);
    }
  }

  const updatedList = currentUsers.map((u) => (u.id === targetId ? updatedUser : u));
  saveLocalAdminUsers(updatedList);
  return updatedUser;
}

/**
 * Exclui um usuário do painel
 * Regras:
 * - Suporte é mestre protegido: NÃO pode ser excluído por ninguém.
 * - Caio (operador): NÃO pode excluir ninguém.
 * - Bianca (admin) e Suporte: podem excluir outros usuários (inclusive Caio).
 */
export async function deleteAdminUser(
  currentUser: UserProfile,
  targetId: string
): Promise<void> {
  const currentUsers = await getAdminUsersList();
  const targetUser = currentUsers.find((u) => u.id === targetId);

  if (!targetUser) {
    throw new Error('Usuário não encontrado.');
  }

  // Suporte não pode ser excluído
  if (targetUser.isProtected || targetUser.id === 'suporte' || targetUser.username.toLowerCase() === 'suporte') {
    throw new Error('O usuário Suporte é um administrador mestre e não pode ser removido.');
  }

  // Operador não pode excluir ninguém
  if (currentUser.role === 'operador' || currentUser.role === 'editor') {
    throw new Error('Operadores não têm permissão para excluir usuários do banco de dados.');
  }

  // Não pode excluir a própria conta logada
  if (currentUser.id === targetId || currentUser.displayName.toLowerCase() === targetUser.username.toLowerCase()) {
    throw new Error('Você não pode excluir sua própria conta enquanto estiver conectado com ela.');
  }

  if (isFirebaseReady && db) {
    try {
      await deleteDoc(doc(db, 'admin_users', targetId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `admin_users/${targetId}`);
    }
  }

  const updatedList = currentUsers.filter((u) => u.id !== targetId);
  saveLocalAdminUsers(updatedList);
}
