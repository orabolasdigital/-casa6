const fs = require('fs');
const { execSync } = require('child_process');

const zipPath = 'C:\\Users\\ocris\\.gemini\\antigravity\\brain\\9b54d9ef-853e-42de-aa62-15d34e5df320\\.user_uploaded\\media_1795532840875_d3b26404.docx';
const dest = './temp_bussola';

if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
execSync(`tar -xf "${zipPath}" -C "${dest}"`);

const xml = fs.readFileSync(dest + '/word/document.xml', 'utf8');
const text = xml.replace(/<w:p[^>]*>/g, '\n').replace(/<[^>]+>/g, '').trim();
fs.writeFileSync('bussola_ficha_text.txt', text);
console.log(text.slice(0, 1500));
