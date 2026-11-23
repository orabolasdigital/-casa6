import fs from 'fs';
import { calculatePatotaTenure } from '../src/services/crmService.js';

const contacts = JSON.parse(fs.readFileSync('src/data/imported_crm_contacts.json', 'utf8'));

const bussolaEligible = contacts.filter((c: any) => {
  if (c.patotaStatus !== 'Ativo') return false;
  const tenure = calculatePatotaTenure(c.clienteDesde, c.apelido || c.nome);
  if (tenure.months < 12 && tenure.days < 365) return false;
  if (!c.dataNascimento || !c.horarioNascimento || !c.cidade || !c.uf) return false;
  return true;
});

console.log('Total Patota Ativos:', contacts.filter((c: any) => c.patotaStatus === 'Ativo').length);
console.log('Total elegíveis para Bússola (>1 ano Patota + dados completos):', bussolaEligible.length);
console.log('Exemplos:', bussolaEligible.slice(0, 3).map((c: any) => ({
  nome: c.fullName,
  patota: c.patotaStatus,
  clienteDesde: c.clienteDesde,
  tenure: calculatePatotaTenure(c.clienteDesde, c.nome).formattedText,
  nasc: c.dataNascimento,
  hora: c.horarioNascimento,
  cidade: c.cidade,
  sol: c.sol,
  asc: c.ascendente
})));
