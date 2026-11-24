const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let current = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(current);
      current = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(current);
      lines.push(row);
      row = [];
      current = '';
    } else {
      current += c;
    }
  }
  if (row.length || current) {
    row.push(current);
    lines.push(row);
  }
  return lines;
}

const transitosPath = 'c:\\Users\\ocris\\Desktop\\CRM acasa6 - Transitos Astrológicos.csv';
const textosPath = 'c:\\Users\\ocris\\Desktop\\CRM acasa6 - Base Textos Mensais.csv';

// 1. Process Transitos
const transitosRaw = fs.readFileSync(transitosPath, 'utf-8');
const transitosRows = parseCSV(transitosRaw);
const transitos = [];

for (let i = 1; i < transitosRows.length; i++) {
  const [anoStr, mesStr, aspectosRaw] = transitosRows[i];
  if (!anoStr || !mesStr) continue;
  const ano = parseInt(anoStr.trim(), 10);
  const mes = parseInt(mesStr.trim(), 10);
  const competencia = `${String(mes).padStart(2, '0')}/${ano}`;
  const rawText = (aspectosRaw || '').trim();

  // Split into Primeira Quinzena and Segunda Quinzena
  let p1 = '';
  let p2 = '';
  if (rawText.includes('SEGUNDA QUINZENA:')) {
    const parts = rawText.split('SEGUNDA QUINZENA:');
    p1 = parts[0].replace('PRIMEIRA QUINZENA:', '').trim();
    p2 = parts[1].trim();
  } else if (rawText.includes('PRIMEIRA QUINZENA:')) {
    p1 = rawText.replace('PRIMEIRA QUINZENA:', '').trim();
  } else {
    p1 = rawText;
  }

  transitos.push({
    ano,
    mes,
    competencia,
    primeiraQuinzena: p1,
    segundaQuinzena: p2,
    aspectosRaw: rawText
  });
}

const transitosDest = path.join(__dirname, '..', 'src', 'data', 'bussola_transitos.json');
fs.writeFileSync(transitosDest, JSON.stringify(transitos, null, 2), 'utf-8');
console.log(`Saved ${transitos.length} transitos to ${transitosDest}`);

// 2. Process Textos
const textosRaw = fs.readFileSync(textosPath, 'utf-8');
const textosRows = parseCSV(textosRaw);
const textos = [];

for (let i = 1; i < textosRows.length; i++) {
  const row = textosRows[i];
  if (!row || !row[1]) continue;
  const [
    competencia,
    nomeCliente,
    sol,
    lua,
    ascendente,
    foco1,
    foco2,
    cuidados,
    diasAstrais,
    diasAtencao,
    direcionamento,
    perguntaDiario,
    palavraOrdem,
    gerar
  ] = row;

  textos.push({
    id: `bussola_pessoal_${(competencia || '11/2026').replace('/', '_')}_${i}`,
    tipo: 'pessoal',
    competencia: (competencia || '11/2026').trim(),
    nomeCliente: (nomeCliente || '').trim(),
    apelidoCliente: (nomeCliente || '').trim().split(' ')[0],
    sol: (sol || '').trim(),
    lua: (lua || '').trim(),
    ascendente: (ascendente || '').trim(),
    focoPrimeiraQuinzena: (foco1 || '').trim(),
    focoSegundaQuinzena: (foco2 || '').trim(),
    cuidados: (cuidados || '').trim(),
    diasAstrais: (diasAstrais || '').trim(),
    diasAtencao: (diasAtencao || '').trim(),
    direcionamentoPratico: (direcionamento || '').trim(),
    perguntaDiario: (perguntaDiario || '').trim(),
    palavraOrdem: (palavraOrdem || '').trim(),
    gerarStatus: 'gerado',
    gerarFlag: (gerar || '').trim().toUpperCase()
  });
}

const textosDest = path.join(__dirname, '..', 'src', 'data', 'bussola_textos_base.json');
fs.writeFileSync(textosDest, JSON.stringify(textos, null, 2), 'utf-8');
console.log(`Saved ${textos.length} textos to ${textosDest}`);
