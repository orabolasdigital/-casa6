import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculateFullNatalChart, calculateAge, parseDate, MONTH_NAMES } from '../src/utils/astroEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../src/data/imported_crm_contacts.json');
const contacts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`Carregados ${contacts.length} contatos para enriquecimento astrológico.`);

let calculatedCount = 0;

const enrichedContacts = contacts.map((c: any) => {
  const dataNasc = c.dataNascimento ? c.dataNascimento.trim() : '';
  const horaNasc = c.horarioNascimento ? c.horarioNascimento.trim() : '';
  const cidade = c.cidade ? c.cidade.trim() : 'São Paulo';
  const uf = c.uf ? c.uf.trim() : 'SP';

  if (dataNasc) {
    const parsed = parseDate(dataNasc);
    if (parsed) {
      const age = calculateAge(parsed.day, parsed.month, parsed.year);
      c.idade = age !== undefined ? age : c.idade;
      c.mesNascimento = MONTH_NAMES[parsed.month - 1] || c.mesNascimento;
      c.mesNumero = parsed.month;
      c.diaNascimento = String(parsed.day).padStart(2, '0');
      c.anoNascimento = String(parsed.year);

      try {
        const chart = calculateFullNatalChart(
          c.fullName || `${c.nome} ${c.sobrenome}`.trim(),
          dataNasc,
          horaNasc || '12:00',
          cidade,
          uf
        );

        c.sol = chart.sunSign || c.sol;
        c.lua = chart.moonSign || c.lua;
        c.ascendente = chart.ascendantSign || c.ascendente;
        c.meioDoCeu = chart.midheavenSign || c.meioDoCeu;

        const venusObj = chart.planets.find(p => p.id === 'venus');
        if (venusObj) c.venus = venusObj.sign;

        const marsObj = chart.planets.find(p => p.id === 'mars');
        if (marsObj) c.marte = marsObj.sign;

        const jupObj = chart.planets.find(p => p.id === 'jupiter');
        if (jupObj) c.jupiter = jupObj.sign;

        const satObj = chart.planets.find(p => p.id === 'saturn');
        if (satObj) c.saturno = satObj.sign;

        const chirObj = chart.planets.find(p => p.id === 'chiron');
        if (chirObj) c.quiron = chirObj.sign;

        calculatedCount++;
      } catch (err) {
        console.warn(`Erro no cálculo para ${c.nome}:`, err);
      }
    }
  }

  // Garantir tags e atributos
  if (c.sol && !c.tags?.includes(`Sol em ${c.sol}`)) {
    c.tags = [...(c.tags || []), `Sol em ${c.sol}`];
  }

  return c;
});

fs.writeFileSync(jsonPath, JSON.stringify(enrichedContacts, null, 2), 'utf8');
console.log(`✅ Sucesso! ${calculatedCount} mapas natais calculados e gravados em src/data/imported_crm_contacts.json.`);
