import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length);
  if (lines.length === 0) return [];
  const headers = splitCSVLine(lines[0]).map(h => h.trim().toLowerCase());
  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i]);
    const row = {};
    for (let j = 0; j < headers.length; j++) row[headers[j]] = cols[j] ?? '';
    out.push(row);
  }
  return out;
}

function splitCSVLine(line) {
  const res = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (q && line[i + 1] === '"') { cur += '"'; i++; } else { q = !q; }
    } else if (ch === ',' && !q) {
      res.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  res.push(cur);
  return res;
}

try {
  const csvPath = join(__dirname, '../data/products.csv');
  const csvText = readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvText);
  
  const outputPath = join(__dirname, '../public/data/products.json');
  writeFileSync(outputPath, JSON.stringify(rows, null, 2));
  
  console.log(`Seeded ${rows.length} products to ${outputPath}`);
} catch (error) {
  console.error('Seed error:', error.message);
  process.exit(1);
}