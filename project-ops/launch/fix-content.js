#!/usr/bin/env node
/**
 * YONI Content Auto-Fix Script
 *
 * This script automatically normalizes JSON and CSV files
 * in the project-ops/launch directory to ensure consistent formatting.
 *
 * Usage: node fix-content.js
 * Exit codes:
 *   0 - Fixes applied successfully (or no changes needed)
 *   1 - Error occurred
 */

const fs = require("fs");
const path = require("path");

// ANSI color codes for better output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
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

function logInfo(message) {
  log(`ℹ️  ${message}`, "blue");
}

log("\n🔧 YONI Content Auto-Fix\n", "cyan");

let filesFixed = 0;
let filesChecked = 0;

/**
 * Normalize JSON file formatting
 * - Consistent 2-space indentation
 * - Unix line endings (LF)
 * - Trailing newline
 */
function fixJSONFile(filePath) {
  try {
    const originalContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(originalContent);

    // Normalize: 2-space indentation, ensure trailing newline
    const normalizedContent = JSON.stringify(data, null, 2) + "\n";

    // Check if content changed
    if (originalContent !== normalizedContent) {
      fs.writeFileSync(filePath, normalizedContent, "utf8");
      logSuccess(`Fixed: ${path.basename(filePath)}`);
      filesFixed++;
      return true;
    } else {
      logInfo(`No changes needed: ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to fix ${filePath}: ${error.message}`);
    throw error;
  }
}

/**
 * Normalize CSV file formatting
 * - Unix line endings (LF)
 * - Trailing newline
 * - Consistent whitespace
 */
function fixCSVFile(filePath) {
  try {
    const originalContent = fs.readFileSync(filePath, "utf8");

    // Normalize line endings to Unix (LF)
    let normalizedContent = originalContent
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");

    // Ensure trailing newline
    if (!normalizedContent.endsWith("\n")) {
      normalizedContent += "\n";
    }

    // Remove trailing whitespace from each line
    normalizedContent = normalizedContent
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n");

    // Check if content changed
    if (originalContent !== normalizedContent) {
      fs.writeFileSync(filePath, normalizedContent, "utf8");
      logSuccess(`Fixed: ${path.basename(filePath)}`);
      filesFixed++;
      return true;
    } else {
      logInfo(`No changes needed: ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to fix ${filePath}: ${error.message}`);
    throw error;
  }
}

// Main execution
const launchDir = __dirname;
const files = fs.readdirSync(launchDir);

logInfo("Checking JSON files...\n");
const jsonFiles = files.filter((f) => f.endsWith(".json"));
for (const file of jsonFiles) {
  const filePath = path.join(launchDir, file);
  filesChecked++;
  fixJSONFile(filePath);
}

logInfo("\nChecking CSV files...\n");
const csvFiles = files.filter((f) => f.endsWith(".csv"));
for (const file of csvFiles) {
  const filePath = path.join(launchDir, file);
  filesChecked++;
  fixCSVFile(filePath);
}

// Summary
log("\n" + "=".repeat(50), "cyan");
log("Fix Summary:", "cyan");
log("=".repeat(50), "cyan");
log(`Files checked: ${filesChecked}`, "blue");
log(`Files fixed: ${filesFixed}`, filesFixed > 0 ? "green" : "blue");
log("", "reset");

if (filesFixed > 0) {
  logSuccess("✨ Auto-fixes applied successfully!");
} else {
  logInfo("✨ All files already properly formatted!");
}

log("", "reset");
process.exit(0);
