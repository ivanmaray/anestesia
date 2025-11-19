#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error('Usage: node scripts/pdfjsExtract.cjs /path/to/file.pdf');
  process.exit(1);
}
if (!fs.existsSync(pdfPath)) {
  console.error('File not found:', pdfPath);
  process.exit(1);
}

const raw = fs.readFileSync(pdfPath);
const uint8 = new Uint8Array(raw);

function extractTextFromDoc(data) {
  return pdfjsLib.getDocument({ data }).promise.then(function (doc) {
    const numPages = doc.numPages;
    const pages = [];
    const tasks = [];
    for (let i = 1; i <= numPages; i++) {
      tasks.push(doc.getPage(i).then(page => page.getTextContent().then(content => {
        const strings = content.items.map(i => i.str || i.unicode || '').join(' ');
        pages.push({ page: i, text: strings });
      })));
    }
    return Promise.all(tasks).then(() => pages.sort((a, b) => a.page - b.page).map(p => p.text).join('\n'));
  });
}

extractTextFromDoc(uint8).then(text => {
  const outPath = path.join(process.cwd(), 'docs', 'protocols', 'protocol-extract-text.txt');
  fs.writeFileSync(outPath, text);
  console.log('Extracted text saved to', outPath);
  // Quick search for KPIs and PHI indicators
  const kpis = text.match(/(Reducci[oó]n de errores|Reduccion de errores|Aceptaci[oó]n recomendaciones|Aceptacion recomendaciones|\b[0-9]{1,3}%\b)/gi);
  if (kpis) console.log('Possible KPI phrases found:', [...new Set(kpis)].join(', '));
  else console.log('No KPI phrases found in extracted text.');
  const sensitive = text.match(/(Paciente|DNI|RUT|historia cl[ií]nica|historia clinica|NHC|HC\:|NHC\:|DNI\:|RUT\:|[A-Z][a-z]+\s[A-Z][a-z]+\s\(DNI|[0-9]{7,12})/gi);
  if (sensitive) console.log('Possible PHI indicators:', [...new Set(sensitive)].slice(0,10).join(', '));
  else console.log('No obvious PHI indicators found by simple matching.');
}).catch(err => {
  console.error('Error extracting PDF text:', err);
  process.exit(1);
});
