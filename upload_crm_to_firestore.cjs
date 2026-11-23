const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, writeBatch, getDocs } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

const firebaseConfig = require('./firebase-applet-config.json');
const contactsData = require('./src/data/imported_crm_contacts.json');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadAllContacts() {
  console.log('🚀 Iniciando envio direto para o Firestore...');
  console.log('Projeto:', firebaseConfig.projectId);
  console.log('Total de contatos a enviar:', contactsData.length);

  try {
    // 1. Verificar estado atual da coleção
    const initialSnap = await getDocs(collection(db, 'crm_contatos'));
    console.log('📄 Documentos atuais em crm_contatos antes do envio:', initialSnap.docs.length);

    // 2. Enviar em lotes (batch) de 400 documentos (limite seguro do Firestore é 500)
    const chunkSize = 400;
    let totalUploaded = 0;

    for (let i = 0; i < contactsData.length; i += chunkSize) {
      const chunk = contactsData.slice(i, i + chunkSize);
      const batch = writeBatch(db);

      for (const item of chunk) {
        // Garantir ID único e limpo
        const docId = item.id || `crm_${i}_${Math.random().toString(36).substring(2, 7)}`;
        const docRef = doc(db, 'crm_contatos', docId);

        // Prepara objeto compatível tanto com CRMContact quanto com CRMContactDetail
        const firestoreData = {
          ...item,
          id: docId,
          firstName: item.nome || item.firstName || '',
          lastName: item.sobrenome || item.lastName || '',
          fullName: item.fullName || `${item.nome} ${item.sobrenome}`.trim(),
          email: item.email || '',
          whatsapp: item.whatsapp || '',
          cadastro: item.cadastro || item.ultimoAcesso || item.dataCadastro || '14/03/2026',
          clienteDesde: item.clienteDesde || item.dataCadastro || '2025/2026',
          ultimaEntrega: item.ultimaEntrega || item.ultimoAcesso || '—',
          updatedAt: new Date().toISOString()
        };

        batch.set(docRef, firestoreData, { merge: true });
      }

      console.log(`Enviando lote de ${chunk.length} contatos (${i + 1} a ${Math.min(i + chunkSize, contactsData.length)})...`);
      await batch.commit();
      totalUploaded += chunk.length;
      console.log(`✅ Lote gravado! Progresso: ${totalUploaded}/${contactsData.length}`);
    }

    console.log('\n🎉 Todos os contatos foram gravados com sucesso no Firestore!');
    const finalSnap = await getDocs(collection(db, 'crm_contatos'));
    console.log('🔥 Total final de documentos na coleção crm_contatos:', finalSnap.docs.length);

  } catch (error) {
    console.error('❌ Erro durante o envio para o Firestore:', error);
  } finally {
    process.exit(0);
  }
}

uploadAllContacts();
