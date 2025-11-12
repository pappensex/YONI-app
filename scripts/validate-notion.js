#!/usr/bin/env node
/* Validate notion-template.json */
const fs = require('fs');
const path = require('path');

const FILE = process.argv[2] || 'project-ops/launch/notion-template.json';
const j = JSON.parse(fs.readFileSync(path.resolve(FILE), 'utf8'));

const errors = [];
const reqTop = ['type','title','properties','views','rows'];
reqTop.forEach(k => { if (!(k in j)) errors.push(`Missing top-level key: ${k}`); });

if (j.type !== 'database') errors.push(`type must be "database"`);
if (typeof j.title !== 'string' || !j.title.trim()) errors.push(`title must be non-empty string`);

const props = j.properties || {};
const requiredProps = ['Task','Status','Owner','Pillar','Priority','Due Date','Notes'];
requiredProps.forEach(p => { if (!(p in props)) errors.push(`Missing property: ${p}`); });

const expectTypes = {
  'Task':'title','Status':'select','Owner':'people','Pillar':'select',
  'Priority':'select','Due Date':'date','Notes':'rich_text'
};
Object.entries(expectTypes).forEach(([k,v])=>{
  if (props[k]?.type !== v) errors.push(`Property "${k}" must be type "${v}"`);
});

function dupNames(list=[]) {
  const seen = new Set(); const dups = new Set();
  list.forEach(o => { const n = (o.name||'').toString(); if (seen.has(n)) dups.add(n); else seen.add(n); });
  return [...dups];
}
['Status','Pillar','Priority'].forEach(p=>{
  const opts = (props[p] && props[p].options) || [];
  if (!Array.isArray(opts) || opts.length===0) errors.push(`Property "${p}" must define non-empty options array`);
  const d = dupNames(opts);
  if (d.length) errors.push(`Duplicate options in "${p}": ${d.join(', ')}`);
});

const validStatus = new Set(['To Do','In Progress','Done']);
const validPillar  = new Set(['BUILD','PAYMENT','YOUTUBE']);
const validPriority = new Set(['🔥','⚡','⏳']);
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

if (!Array.isArray(j.rows) || j.rows.length===0) errors.push('rows must be a non-empty array');
j.rows?.forEach((r,i)=>{
  const where = `rows[${i}]`;
  ['Task','Status','Pillar','Priority','Due Date'].forEach(k=>{
    if (!(k in r)) errors.push(`${where} missing key: ${k}`);
  });
  if (r['Status'] && !validStatus.has(r['Status'])) errors.push(`${where} invalid Status: ${r['Status']}`);
  if (r['Pillar'] && !validPillar.has(r['Pillar'])) errors.push(`${where} invalid Pillar: ${r['Pillar']}`);
  if (r['Priority'] && !validPriority.has(r['Priority'])) errors.push(`${where} invalid Priority: ${r['Priority']}`);
  if (r['Due Date'] && !isoDate.test(r['Due Date'])) errors.push(`${where} invalid Due Date: ${r['Due Date']} (YYYY-MM-DD)`);
});

const requiredViews = new Set(['📅 Timeline','🎯 High Priority','💡 Progress']);
const viewNames = new Set((j.views||[]).map(v=>v.name));
requiredViews.forEach(v=>{ if (!viewNames.has(v)) errors.push(`Missing view: ${v}`); });

if (errors.length) {
  console.error('notion-template.json validation failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log('notion-template.json OK');
