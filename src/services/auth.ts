/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo de Autenticação e RBAC (/painel) (Etapa 1 - Fundação Congelada)
 */

import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as fbSignOut } from 'firebase/auth';
import { UserProfile, UserRole } from '../types';
import { auth, isFirebaseReady } from './firebase';

const LOCAL_STORAGE_AUTH_KEY = 'casa6_admin_session';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  isFirebaseActive: boolean;
}

type AuthSubscriber = (state: AuthState) => void;
const subscribers: Set<AuthSubscriber> = new Set();

let currentState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  isFirebaseActive: isFirebaseReady
};

function notifySubscribers() {
  subscribers.forEach((cb) => cb(currentState));
}

// Inicializador de sessão
export function initAuthListener(): () => void {
  if (isFirebaseReady && auth) {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        // Mapeia usuário do Firebase para UserProfile com role
        const mappedUser: UserProfile = {
          id: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || 'Operador Casa 6',
          role: 'admin', // Em produção com Firestore, busca do documento /users/{uid}
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        currentState = {
          isAuthenticated: true,
          user: mappedUser,
          isLoading: false,
          isFirebaseActive: true
        };
      } else {
        currentState = {
          isAuthenticated: false,
          user: null,
          isLoading: false,
          isFirebaseActive: true
        };
      }
      notifySubscribers();
    });

    return unsubscribe;
  }

  // Fallback seguro para ambiente de teste da Etapa 1
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as UserProfile;
      currentState = {
        isAuthenticated: true,
        user: parsed,
        isLoading: false,
        isFirebaseActive: false
      };
    } else {
      currentState = {
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isFirebaseActive: false
      };
    }
  } catch {
    currentState = {
      isAuthenticated: false,
      user: null,
      isLoading: false,
      isFirebaseActive: false
    };
  }

  notifySubscribers();
  return () => {};
}

export function subscribeAuth(callback: AuthSubscriber): () => void {
  subscribers.add(callback);
  callback(currentState);
  return () => {
    subscribers.delete(callback);
  };
}

export function getCurrentUser(): UserProfile | null {
  return currentState.user;
}

export function hasRole(role: UserRole): boolean {
  if (!currentState.user) return false;
  if (currentState.user.role === 'admin') return true;
  return currentState.user.role === role;
}

/**
 * Autenticação via Google Popup no Firebase Auth
 */
export async function loginWithGoogle(): Promise<UserProfile> {
  if (isFirebaseReady && auth) {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;

    const mappedUser: UserProfile = {
      id: fbUser.uid,
      email: fbUser.email || '',
      displayName: fbUser.displayName || 'Administrador',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return mappedUser;
  }

  throw new Error('Firebase Auth ainda não provisionado no ambiente de nuvem.');
}

/**
 * Autenticação para Homologação da Fundação da Etapa 1
 */
export function loginDevSession(role: UserRole = 'admin', email = 'bianca@casa6.com.br'): UserProfile {
  const devUser: UserProfile = {
    id: `dev_${Date.now()}`,
    email,
    displayName: role === 'admin' ? 'Bianca Tofoli (Admin)' : 'Editor Equipe Casa 6',
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(devUser));
  }

  currentState = {
    isAuthenticated: true,
    user: devUser,
    isLoading: false,
    isFirebaseActive: isFirebaseReady
  };

  notifySubscribers();
  return devUser;
}

/**
 * Logout Seguro
 */
export async function logoutAdminSession(): Promise<void> {
  if (isFirebaseReady && auth) {
    await fbSignOut(auth);
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
  }

  currentState = {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    isFirebaseActive: isFirebaseReady
  };

  notifySubscribers();
}
