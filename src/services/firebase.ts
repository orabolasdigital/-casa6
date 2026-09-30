/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo de Integração Firebase (Status: PREPARADO / CONGELADO)
 * 
 * Cumpre as diretrizes da skill firebase-integration-rpc:
 * - Tratamento padronizado de erro FirestoreErrorInfo
 * - Detecção estrita de conectividade e credenciais
 * - Sem criação de credenciais falsas ou simulações opacas
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let isConfigured = false;

// Verificação de ambiente para carregar configuração real se existente
try {
  // Verificação de variáveis de ambiente padrão do Vite
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (apiKey && projectId) {
    const config = {
      apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };

    if (!getApps().length) {
      appInstance = initializeApp(config);
    } else {
      appInstance = getApps()[0];
    }

    firestoreInstance = getFirestore(appInstance);
    authInstance = getAuth(appInstance);
    isConfigured = true;
  }
} catch {
  // Em fase de fundação / Etapa 1 sem projeto console vinculado, permanece em estado PREPARADO
  isConfigured = false;
}

export const isFirebaseReady = isConfigured;
export const db = firestoreInstance;
export const auth = authInstance;

/**
 * Lança erro estruturado conforme exigência formal do skill Firebase Integration
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentAuth = authInstance;
  const currentUser = currentAuth?.currentUser;

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email
      })) || []
    },
    operationType,
    path
  };

  console.error('[Casa6 Firestore Error]:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
