#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
const pdfModule = await import('pdf-parse');
const pdfParse = pdfModule.default || pdfModule;

// Usage: node scripts/extractProtocolSections.js /path/to/protocol.pdf
const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error('Usage: node scripts/extractProtocolSections.js /path/to/protocol.pdf');
  process.exit(1);
}

if (!fs.existsSync(pdfPath)) {
  console.error('File not found:', pdfPath);
  process.exit(1);
}

const fileBuffer = fs.readFileSync(pdfPath);
const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

pdfParse(fileBuffer).then(function(data) {
  const text = data.text;
  const baseName = path.basename(pdfPath, path.extname(pdfPath));
  const outPath = path.join(process.cwd(), `${baseName}-extract.json`);
  const out = {
    source: pdfPath,
    extractedAt: new Date().toISOString(),
    sha256: hash,
    info: data.info || {},
    text: text,
  };
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log('Extracted text written to', outPath);
  // Quick KPI search
  const kpiMatches = [];
  const reNumbers = /([0-9]{1,3})\s*%/g;
  let m;
  while ((m = reNumbers.exec(text)) !== null) {
    kpiMatches.push(m[0]);
  }
  if (kpiMatches.length) {
    console.log('Numeric percentages found in the PDF text (possible KPIs):', [...new Set(kpiMatches)].join(', '));
  } else {
    console.log('No obvious percentage KPIs detected in the PDF text.');
  }
}).catch(err => {
  console.error('Error parsing PDF:', err);
  process.exit(1);
});
