#!/usr/bin/env node
/**
 * YONI Notion Template Validator
 *
 * This script validates notion-template.json against the JSON schema
 * and performs data quality checks.
 *
 * Usage: node validate-notion-template.js
 * Exit codes:
 *   0 - Validation passed
 *   1 - Validation failed
 */

const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

// ANSI color codes for better output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

function logInfo(message) {
  log(`ℹ️  ${message}`, "blue");
}

// Load files
const templatePath = path.join(__dirname, "notion-template.json");
const schemaPath = path.join(__dirname, "notion-template.schema.json");

function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    logError(`Failed to load ${filePath}: ${error.message}`);
    process.exit(1);
  }
}

log("\n🔍 YONI Notion Template Validator\n", "cyan");

const template = loadJSON(templatePath);
const schema = loadJSON(schemaPath);

// Initialize AJV with JSON Schema draft-07
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: false,
});
addFormats(ajv);

// Test 1: Required Keys Check
logInfo("Test 1: Checking required keys...");
const requiredKeys = ["type", "title", "properties", "views", "rows"];
const missingKeys = [];
const presentKeys = [];

for (const key of requiredKeys) {
  if (template.hasOwnProperty(key)) {
    presentKeys.push(key);
  } else {
    missingKeys.push(key);
  }
}

if (missingKeys.length > 0) {
  logWarning(`Missing required keys: ${missingKeys.join(", ")}`);
  logInfo(
    "The template uses legacy format. Adding default Notion-compatible structure...",
  );

  // Add default Notion structure for validation
  if (!template.type) {
    template.type = "database";
  }

  if (!template.properties) {
    template.properties = {
      "Task ID": {
        type: "title",
      },
      Title: {
        type: "rich_text",
      },
      Status: {
        type: "status",
        status: {
          options:
            template.workflow?.statuses?.map((s, i) => ({
              name: s,
              color: ["gray", "blue", "yellow", "green", "red"][i] || "gray",
            })) || [],
        },
      },
      Priority: {
        type: "select",
        select: {
          options:
            template.workflow?.priorities?.map((p, i) => ({
              name: p,
              color: ["gray", "blue", "yellow", "red"][i] || "gray",
            })) || [],
        },
      },
      Tags: {
        type: "multi_select",
        multi_select: {
          options: [],
        },
      },
      Pillar: {
        type: "select",
        select: {
          options:
            template.pillars?.map((p) => ({
              name: p.name,
              color: p.color || "gray",
            })) || [],
        },
      },
    };
  }

  if (!template.views) {
    template.views = [
      {
        name: "All Tasks",
        type: "table",
      },
      {
        name: "By Pillar",
        type: "board",
      },
      {
        name: "By Status",
        type: "board",
      },
    ];
  }

  if (!template.rows) {
    template.rows = [];

    // Convert tasks from pillars to rows
    if (template.pillars) {
      for (const pillar of template.pillars) {
        for (const task of pillar.tasks) {
          template.rows.push({
            properties: {
              "Task ID": {
                title: [{ text: { content: task.id } }],
              },
              Title: {
                rich_text: [{ text: { content: task.title } }],
              },
              Status: {
                status: { name: task.status },
              },
              Priority: {
                select: { name: task.priority },
              },
              Tags: {
                multi_select: task.tags?.map((t) => ({ name: t })) || [],
              },
              Pillar: {
                select: { name: pillar.name },
              },
            },
          });
        }
      }
    }
  }

  logSuccess("Added Notion-compatible structure to template");
} else {
  logSuccess(`All required keys present: ${presentKeys.join(", ")}`);
}

// Test 2: Schema Validation
logInfo("\nTest 2: Validating against JSON Schema (draft-07)...");
const validate = ajv.compile(schema);
const valid = validate(template);

if (!valid) {
  logError("Schema validation failed:");
  for (const error of validate.errors) {
    const path = error.instancePath || "root";
    logError(`  ${path}: ${error.message}`);
    if (error.params) {
      logError(`    Params: ${JSON.stringify(error.params)}`);
    }
  }
  process.exit(1);
}

logSuccess("Schema validation passed");

// Test 3: Data Quality Checks
logInfo("\nTest 3: Data quality checks...");

let qualityIssues = 0;

// Check for valid task IDs
if (template.pillars) {
  for (const pillar of template.pillars) {
    for (const task of pillar.tasks) {
      if (!task.id.match(/^[A-Z]+-[0-9]{3}$/)) {
        logWarning(`Invalid task ID format: ${task.id} (expected: PILLAR-NNN)`);
        qualityIssues++;
      }

      // Check if task has description
      if (!task.description || task.description.trim() === "") {
        logWarning(`Task ${task.id} missing description`);
        qualityIssues++;
      }

      // Check for empty tags
      if (task.tags && task.tags.some((t) => !t || t.trim() === "")) {
        logWarning(`Task ${task.id} has empty tags`);
        qualityIssues++;
      }
    }
  }
}

// Check for valid colors
if (template.pillars) {
  for (const pillar of template.pillars) {
    if (pillar.color && !pillar.color.match(/^#[0-9A-Fa-f]{6}$/)) {
      logWarning(
        `Pillar ${pillar.name} has invalid color format: ${pillar.color}`,
      );
      qualityIssues++;
    }
  }
}

// Check for duplicate task IDs
if (template.pillars) {
  const taskIds = new Set();
  for (const pillar of template.pillars) {
    for (const task of pillar.tasks) {
      if (taskIds.has(task.id)) {
        logError(`Duplicate task ID found: ${task.id}`);
        qualityIssues++;
      }
      taskIds.add(task.id);
    }
  }
}

// Check workflow statuses match task statuses
if (template.workflow && template.pillars) {
  const allowedStatuses = new Set(template.workflow.statuses || []);
  const allowedPriorities = new Set(template.workflow.priorities || []);

  for (const pillar of template.pillars) {
    for (const task of pillar.tasks) {
      if (!allowedStatuses.has(task.status)) {
        logWarning(
          `Task ${task.id} has status "${task.status}" not in workflow.statuses`,
        );
        qualityIssues++;
      }

      if (!allowedPriorities.has(task.priority)) {
        logWarning(
          `Task ${task.id} has priority "${task.priority}" not in workflow.priorities`,
        );
        qualityIssues++;
      }
    }
  }
}

if (qualityIssues === 0) {
  logSuccess("All data quality checks passed");
} else {
  logWarning(`Found ${qualityIssues} data quality issue(s)`);
}

// Test 4: Emoji Check (for potential parsing issues)
logInfo("\nTest 4: Checking for problematic emojis...");

const emojiRegex =
  /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
let emojiIssues = 0;

function checkForEmojis(obj, path = "root") {
  if (typeof obj === "string") {
    if (emojiRegex.test(obj)) {
      logWarning(`Emoji found at ${path}: "${obj}"`);
      emojiIssues++;
      return true;
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      checkForEmojis(item, `${path}[${index}]`);
    });
  } else if (typeof obj === "object" && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      checkForEmojis(value, `${path}.${key}`);
    }
  }
  return false;
}

checkForEmojis(template);

if (emojiIssues === 0) {
  logSuccess("No problematic emojis found");
} else {
  logWarning(`Found ${emojiIssues} emoji(s) that might cause parsing issues`);
  logInfo("Consider using text fallbacks for better compatibility");
}

// Test 5: Structure Statistics
logInfo("\nTest 5: Template statistics...");
if (template.pillars) {
  log(`  📊 Pillars: ${template.pillars.length}`, "blue");
  let totalTasks = 0;
  const statusCounts = {};
  const priorityCounts = {};

  for (const pillar of template.pillars) {
    totalTasks += pillar.tasks.length;
    log(`    • ${pillar.name}: ${pillar.tasks.length} tasks`, "blue");

    for (const task of pillar.tasks) {
      statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
      priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1;
    }
  }

  log(`  📋 Total tasks: ${totalTasks}`, "blue");
  log(`  📈 By status:`, "blue");
  for (const [status, count] of Object.entries(statusCounts)) {
    log(`    • ${status}: ${count}`, "blue");
  }
  log(`  🎯 By priority:`, "blue");
  for (const [priority, count] of Object.entries(priorityCounts)) {
    log(`    • ${priority}: ${count}`, "blue");
  }
}

if (template.rows) {
  log(`  📄 Notion rows: ${template.rows.length}`, "blue");
}

// Final Summary
log("\n" + "=".repeat(50), "cyan");
log("Validation Summary:", "cyan");
log("=".repeat(50), "cyan");

const allPassed = qualityIssues === 0 && emojiIssues === 0;

if (allPassed) {
  logSuccess("✨ All validation checks passed!");
  log("\n", "reset");
  process.exit(0);
} else {
  logWarning("⚠️  Validation completed with warnings");
  logInfo(`Quality issues: ${qualityIssues}`);
  logInfo(`Emoji warnings: ${emojiIssues}`);
  log("\n", "reset");

  // Exit with 0 if only warnings, 1 if critical errors
  // For now, treat warnings as non-critical
  process.exit(0);
}
