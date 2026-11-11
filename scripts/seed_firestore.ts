import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDocs, collection } from 'firebase/firestore';
import {
  CATALOG_ATENDIMENTOS,
  CATALOG_PALESTRAS,
  CATALOG_ASSINATURAS,
  CATALOG_LOJINHA,
  CATALOG_BLOG_POSTS
} from '../src/services/catalogService';

const firebaseConfig = {
  projectId: "casa6-cloud",
  appId: "1:237351344613:web:e2c9636b91f9e41660770c",
  apiKey: "AIzaSyBY389O7vgEWjLAGAVtcmxFfs0eHG62SVM",
  authDomain: "casa6-cloud.firebaseapp.com",
  storageBucket: "casa6-cloud.firebasestorage.app",
  messagingSenderId: "237351344613",
  measurementId: "G-BQ7YLE1QVG"
};

console.log('Iniciando sincronização com Firebase:', firebaseConfig.projectId);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runSeed() {
  try {
    console.log('\n--- 1. Populando produtos_atendimentos ---');
    for (const item of CATALOG_ATENDIMENTOS) {
      await setDoc(doc(db, 'produtos_atendimentos', item.id), item, { merge: true });
      console.log(`[OK] Atendimento: ${item.title} (${item.id})`);
    }

    console.log('\n--- 2. Populando produtos_palestras ---');
    for (const item of CATALOG_PALESTRAS) {
      await setDoc(doc(db, 'produtos_palestras', item.id), item, { merge: true });
      console.log(`[OK] Palestra: ${item.title} (${item.id})`);
    }

    console.log('\n--- 3. Populando produtos_assinatura ---');
    for (const item of CATALOG_ASSINATURAS) {
      await setDoc(doc(db, 'produtos_assinatura', item.id), item, { merge: true });
      console.log(`[OK] Assinatura: ${item.title} (${item.id})`);
    }

    console.log('\n--- 4. Populando produtos_lojinha ---');
    for (const item of CATALOG_LOJINHA) {
      await setDoc(doc(db, 'produtos_lojinha', item.id), item, { merge: true });
      console.log(`[OK] Lojinha: ${item.title} (${item.id})`);
    }

    console.log('\n--- 5. Populando blog_posts (Leituras Astrais) ---');
    for (const item of CATALOG_BLOG_POSTS) {
      await setDoc(doc(db, 'blog_posts', item.id), item, { merge: true });
      console.log(`[OK] Blog Post: ${item.title} (${item.id})`);
    }

    console.log('\n--- 6. Inicializando crm_contatos ---');
    const adminContact = {
      id: 'contato_institucional_casa6',
      firstName: 'Bianca',
      lastName: 'Tofoli',
      fullName: 'Bianca Tofoli',
      email: 'contato@acasa6.com.br',
      whatsapp: '+5511999999999',
      sourcePage: 'institucional',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'crm_contatos', adminContact.id), adminContact, { merge: true });
    console.log(`[OK] CRM Contato inicial criado: ${adminContact.fullName}`);

    console.log('\n--- 7. Inicializando coleções operacionais (orders & system) ---');
    await setDoc(doc(db, 'system', 'connection_test'), {
      status: 'online',
      projectId: firebaseConfig.projectId,
      timestamp: new Date().toISOString(),
      environment: 'production'
    }, { merge: true });
    console.log('[OK] Documento de sistema connection_test verificado.');

    console.log('\n======================================================');
    console.log('TODAS AS COLEÇÕES FORAM HABILITADAS E POVOADAS NO FIREBASE COM SUCESSO!');
    console.log('======================================================');
    process.exit(0);
  } catch (err) {
    console.error('[ERRO DURANTE O SEED]:', err);
    process.exit(1);
  }
}

runSeed();
