#!/usr/bin/env node

/**
 * Validate YONI Notion Template JSON
 * Ensures the notion-template.json follows the expected structure
 */

const fs = require('fs');
const path = require('path');

// Get file path from command line argument
const filePath = process.argv[2];

if (!filePath) {
  console.error('Error: No file path provided');
  console.error('Usage: node validate-notion.js <path-to-notion-template.json>');
  process.exit(1);
}

// Resolve absolute path
const absolutePath = path.resolve(filePath);

// Check if file exists
if (!fs.existsSync(absolutePath)) {
  console.error(`Error: File not found: ${absolutePath}`);
  process.exit(1);
}

// Read and parse JSON
let data;
try {
  const fileContent = fs.readFileSync(absolutePath, 'utf8');
  data = JSON.parse(fileContent);
} catch (error) {
  console.error(`Error: Failed to parse JSON: ${error.message}`);
  process.exit(1);
}

// Validation checks
const errors = [];
const warnings = [];

// Required top-level fields
const requiredFields = ['title', 'version', 'created', 'description', 'pillars'];
requiredFields.forEach(field => {
  if (!data[field]) {
    errors.push(`Missing required field: ${field}`);
  }
});

// Validate pillars
if (data.pillars) {
  if (!Array.isArray(data.pillars)) {
    errors.push('Field "pillars" must be an array');
  } else {
    const validPillarNames = ['BUILD', 'PAYMENT', 'YOUTUBE'];
    const foundPillars = new Set();

    data.pillars.forEach((pillar, index) => {
      if (!pillar.name) {
        errors.push(`Pillar at index ${index} missing "name" field`);
      } else {
        foundPillars.add(pillar.name);
        if (!validPillarNames.includes(pillar.name)) {
          warnings.push(`Pillar "${pillar.name}" is not a standard pillar name (expected: ${validPillarNames.join(', ')})`);
        }
      }

      if (!pillar.focus) {
        errors.push(`Pillar "${pillar.name || index}" missing "focus" field`);
      }

      if (!pillar.color) {
        warnings.push(`Pillar "${pillar.name || index}" missing "color" field`);
      }

      if (!pillar.tasks) {
        errors.push(`Pillar "${pillar.name || index}" missing "tasks" field`);
      } else if (!Array.isArray(pillar.tasks)) {
        errors.push(`Pillar "${pillar.name || index}" tasks must be an array`);
      } else {
        // Validate tasks
        pillar.tasks.forEach((task, taskIndex) => {
          const taskRequiredFields = ['id', 'title', 'description', 'status', 'priority'];
          taskRequiredFields.forEach(field => {
            if (!task[field]) {
              errors.push(`Task at pillar "${pillar.name}" index ${taskIndex} missing "${field}"`);
            }
          });

          // Validate task ID format
          if (task.id && !task.id.startsWith(pillar.name + '-')) {
            warnings.push(`Task ID "${task.id}" should start with "${pillar.name}-"`);
          }
        });
      }
    });

    // Check for missing standard pillars
    validPillarNames.forEach(name => {
      if (!foundPillars.has(name)) {
        warnings.push(`Standard pillar "${name}" not found`);
      }
    });
  }
}

// Validate workflow statuses and priorities
if (data.workflow) {
  if (!data.workflow.statuses || !Array.isArray(data.workflow.statuses)) {
    warnings.push('Workflow statuses should be defined as an array');
  }
  if (!data.workflow.priorities || !Array.isArray(data.workflow.priorities)) {
    warnings.push('Workflow priorities should be defined as an array');
  }
}

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
console.log(`   Found ${data.pillars.length} pillars with ${data.pillars.reduce((sum, p) => sum + (p.tasks?.length || 0), 0)} total tasks\n`);
process.exit(0);
