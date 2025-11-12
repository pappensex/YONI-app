#!/usr/bin/env node

/**
 * Validate YONI Tasks CSV
 * Ensures the tasks CSV follows the expected structure
 */

const fs = require('fs');
const path = require('path');

// Get file path from command line argument
const filePath = process.argv[2];

if (!filePath) {
  console.error('Error: No file path provided');
  console.error('Usage: node validate-tasks-csv.js <path-to-tasks.csv>');
  process.exit(1);
}

// Resolve absolute path
const absolutePath = path.resolve(filePath);

// Check if file exists
if (!fs.existsSync(absolutePath)) {
  console.error(`Error: File not found: ${absolutePath}`);
  process.exit(1);
}

// Read CSV file
let fileContent;
try {
  fileContent = fs.readFileSync(absolutePath, 'utf8');
} catch (error) {
  console.error(`Error: Failed to read file: ${error.message}`);
  process.exit(1);
}

// Parse CSV
const lines = fileContent.trim().split('\n');
if (lines.length === 0) {
  console.error('Error: CSV file is empty');
  process.exit(1);
}

const errors = [];
const warnings = [];

// Parse header
const headerLine = lines[0];
const headers = headerLine.split(',').map(h => h.trim());

// Expected headers
const expectedHeaders = ['Pillar', 'Task ID', 'Title', 'Description', 'Status', 'Priority', 'Tags', 'Example'];

// Validate headers
const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
if (missingHeaders.length > 0) {
  errors.push(`Missing required headers: ${missingHeaders.join(', ')}`);
}

const unexpectedHeaders = headers.filter(h => !expectedHeaders.includes(h));
if (unexpectedHeaders.length > 0) {
  warnings.push(`Unexpected headers: ${unexpectedHeaders.join(', ')}`);
}

// Parse data rows
const rows = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue; // Skip empty lines

  // Simple CSV parsing (handles quoted fields)
  const fields = [];
  let current = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());

  if (fields.length !== headers.length) {
    warnings.push(`Row ${i + 1}: Expected ${headers.length} fields, found ${fields.length}`);
  }

  const row = {};
  headers.forEach((header, index) => {
    row[header] = fields[index] || '';
  });
  rows.push({ lineNumber: i + 1, data: row });
}

// Validate data rows
const validPillars = ['BUILD', 'PAYMENT', 'YOUTUBE'];
const validStatuses = ['pending', 'in_progress', 'review', 'completed', 'blocked'];
const validPriorities = ['low', 'medium', 'high', 'critical'];
const taskIds = new Set();

rows.forEach(({ lineNumber, data }) => {
  // Validate Pillar
  if (!data['Pillar']) {
    errors.push(`Row ${lineNumber}: Missing Pillar`);
  } else if (!validPillars.includes(data['Pillar'])) {
    warnings.push(`Row ${lineNumber}: Unknown pillar "${data['Pillar']}" (expected: ${validPillars.join(', ')})`);
  }

  // Validate Task ID
  if (!data['Task ID']) {
    errors.push(`Row ${lineNumber}: Missing Task ID`);
  } else {
    if (taskIds.has(data['Task ID'])) {
      errors.push(`Row ${lineNumber}: Duplicate Task ID "${data['Task ID']}"`);
    }
    taskIds.add(data['Task ID']);

    // Check Task ID format
    if (data['Pillar'] && !data['Task ID'].startsWith(data['Pillar'] + '-')) {
      warnings.push(`Row ${lineNumber}: Task ID "${data['Task ID']}" should start with "${data['Pillar']}-"`);
    }
  }

  // Validate Title
  if (!data['Title']) {
    errors.push(`Row ${lineNumber}: Missing Title`);
  }

  // Validate Description
  if (!data['Description']) {
    warnings.push(`Row ${lineNumber}: Missing Description`);
  }

  // Validate Status
  if (!data['Status']) {
    errors.push(`Row ${lineNumber}: Missing Status`);
  } else if (!validStatuses.includes(data['Status'])) {
    warnings.push(`Row ${lineNumber}: Unknown status "${data['Status']}" (expected: ${validStatuses.join(', ')})`);
  }

  // Validate Priority
  if (!data['Priority']) {
    errors.push(`Row ${lineNumber}: Missing Priority`);
  } else if (!validPriorities.includes(data['Priority'])) {
    warnings.push(`Row ${lineNumber}: Unknown priority "${data['Priority']}" (expected: ${validPriorities.join(', ')})`);
  }
});

// Report results
console.log(`\n✓ Validating: ${path.basename(absolutePath)}`);
console.log(`  Location: ${absolutePath}\n`);

if (warnings.length > 0) {
  console.log('⚠ Warnings:');
  warnings.forEach(warning => console.log(`  - ${warning}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('✗ Validation Errors:');
  errors.forEach(error => console.log(`  - ${error}`));
  console.log('');
  console.log(`❌ Validation failed with ${errors.length} error(s)\n`);
  process.exit(1);
}

console.log(`✅ Validation successful!`);
console.log(`   Validated ${rows.length} task(s) across ${validPillars.length} pillars\n`);
process.exit(0);
