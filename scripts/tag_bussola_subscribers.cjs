const fs = require('fs');
const path = require('path');

const contactsPath = path.join(__dirname, '..', 'src', 'data', 'imported_crm_contacts.json');
const textosPath = path.join(__dirname, '..', 'src', 'data', 'bussola_textos_base.json');

const contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf-8'));
const textos = JSON.parse(fs.readFileSync(textosPath, 'utf-8'));

const namesInTextos = new Set(textos.map(t => t.nomeCliente.toLowerCase().trim()));

let taggedCount = 0;
for (const c of contacts) {
  const fullName = (c.fullName || `${c.nome || ''} ${c.sobrenome || ''}`).toLowerCase().trim();
  const nomeOnly = (c.nome || '').toLowerCase().trim();
  
  if (!Array.isArray(c.tags)) {
    c.tags = [];
  }

  // Check if subscriber of Patota or in textos
  const isSubscriber = c.patotaStatus === 'Ativo' || namesInTextos.has(fullName) || namesInTextos.has(nomeOnly);
  
  if (isSubscriber) {
    if (!c.tags.includes('Assinante Bússola')) {
      c.tags.push('Assinante Bússola');
    }
    taggedCount++;
  }
}

fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2), 'utf-8');
console.log(`Tagged ${taggedCount} contacts with 'Assinante Bússola' in ${contactsPath}`);
