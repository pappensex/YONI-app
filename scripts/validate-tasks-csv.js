#!/usr/bin/env node
/* Validate launch_tasks.csv with a minimal RFC4180 parser */
const fs = require('fs');
const path = require('path');

const FILE = process.argv[2] || 'project-ops/launch/launch_tasks.csv';
const csv = fs.readFileSync(path.resolve(FILE), 'utf8');

// Robust split respecting quotes
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i=0;i<text.length;i++){
    const c = text[i], n = text[i+1];
    if (inQ) {
      if (c === '"' && n === '"') { field += '"'; i++; }
      else if (c === '"') { inQ = false; }
      else field += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { row.push(field); field=''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && n === '\n') i++;
        row.push(field); rows.push(row); row=[]; field='';
      } else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const table = parseCSV(csv).filter(r => !(r.length===1 && r[0]===''));
if (table.length === 0) { console.error('Empty CSV'); process.exit(1); }

const header = table[0];
const expect = ['Task','Pillar','Priority','Status','Owner','Due Date','Parent','Notes'];
const miss = expect.filter(h => !header.includes(h));
if (miss.length){ console.error('Missing headers: ' + miss.join(', ')); process.exit(1); }

const idx = Object.fromEntries(header.map((h,i)=>[h,i]));
const isoDate = /^\d{4}-\d{2}-\d{2}$/;
const validPillar = new Set(['BUILD','PAYMENT','YOUTUBE']);
const validPriority = new Set(['🔥','⚡','⏳']);
const validStatus = new Set(['To Do','In Progress','Done']);

const errors = [];
for (let r=1;r<table.length;r++){
  const row = table[r];
  const line = r+1;
  const date = row[idx['Due Date']] || '';
  if (!isoDate.test(date)) errors.push(`Line ${line}: bad date "${date}" (YYYY-MM-DD)`);
  const pillar = row[idx['Pillar']] || '';
  if (!validPillar.has(pillar)) errors.push(`Line ${line}: invalid Pillar "${pillar}"`);
  const prio = row[idx['Priority']] || '';
  if (!validPriority.has(prio)) errors.push(`Line ${line}: invalid Priority "${prio}"`);
  const status = row[idx['Status']] || '';
  if (!validStatus.has(status)) errors.push(`Line ${line}: invalid Status "${status}"`);
  const task = (row[idx['Task']]||'').trim();
  if (!task) errors.push(`Line ${line}: empty Task`);
}

if (errors.length){
  console.error('launch_tasks.csv validation failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log('launch_tasks.csv OK');
