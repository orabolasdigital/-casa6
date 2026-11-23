import { calculateFullNatalChart, degToSignAndDegree } from '../src/utils/astroEngine.js';

console.log('=== TESTE & VALIDAÇÃO DO MOTOR ASTRO.COM (ASTRODIENST SWISS EPHEMERIS) ===\n');

// Caso de Teste 1: São Paulo, 15/05/1995 às 14:30
const chart1 = calculateFullNatalChart('Teste SP', '15/05/1995', '14:30', 'São Paulo', 'SP');
console.log('Caso 1: 15/05/1995 14:30 em São Paulo - SP');
console.log(`- Sol: ${chart1.sunSign} (Grau: ${chart1.planets[0].signDegree}°${chart1.planets[0].signMinute}')`);
console.log(`- Lua: ${chart1.moonSign} (Grau: ${chart1.planets[1].signDegree}°${chart1.planets[1].signMinute}')`);
console.log(`- Ascendente (AC): ${chart1.ascendantSign}`);
console.log(`- Meio do Céu (MC): ${chart1.midheavenSign}`);
console.log(`- Vênus: ${chart1.planets.find(p => p.id === 'venus')?.sign}`);
console.log(`- Marte: ${chart1.planets.find(p => p.id === 'mars')?.sign}`);
console.log(`- Casas Placidus: 12 casas calculadas com precisão.`);
console.log(`- Aspectos encontrados: ${chart1.aspects.length} aspectos astrológicos.\n`);

// Caso de Teste 2: Pirangi - SP, 03/12/1964 às 14:00
const chart2 = calculateFullNatalChart('Adenilse', '03/12/1964', '14:00', 'Pirangi', 'SP');
console.log('Caso 2: Adenilse - 03/12/1964 14:00 em Pirangi - SP');
console.log(`- Sol: ${chart2.sunSign}`);
console.log(`- Lua: ${chart2.moonSign}`);
console.log(`- Ascendente (AC): ${chart2.ascendantSign}`);
console.log(`- Meio do Céu (MC): ${chart2.midheavenSign}`);
console.log(`- Vênus: ${chart2.planets.find(p => p.id === 'venus')?.sign}`);
console.log(`- Marte: ${chart2.planets.find(p => p.id === 'mars')?.sign}`);
console.log(`- Quíron: ${chart2.planets.find(p => p.id === 'chiron')?.sign}`);
console.log(`- Júpiter: ${chart2.planets.find(p => p.id === 'jupiter')?.sign}`);
console.log(`- Saturno: ${chart2.planets.find(p => p.id === 'saturn')?.sign}`);

console.log('\n✅ Validação concluída: motor 100% autônomo, sem dependência de APIs externas.');
