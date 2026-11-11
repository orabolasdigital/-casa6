/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo Oficial de Integração Firebase / Firestore
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

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

const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// CRITICAL: Conforme exigência do skill, vincular ao firestoreDatabaseId se provisionado, senão default
export const db: Firestore = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);
export const auth: Auth = getAuth(app);
export const isFirebaseReady = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);

/**
 * Lança erro estruturado conforme exigência formal do skill Firebase Integration
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentAuth = auth;
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

// Teste de conexão seguro
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'system', 'connection_test'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Casa6 Firebase] Cliente offline ou aguardando sincronização.');
      return false;
    }
    return true; // Se respondeu mesmo com permissão/not found, conexão com o backend Firestore foi estabelecida
  }
}
