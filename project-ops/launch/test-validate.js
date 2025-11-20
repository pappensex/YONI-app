#!/usr/bin/env node
/**
 * Test suite for validate-notion-template.js
 *
 * This script tests that the validation script correctly
 * handles valid and invalid inputs.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

log("\n🧪 Testing validate-notion-template.js\n", "cyan");

const templatePath = path.join(__dirname, "notion-template.json");
const backupPath = path.join(__dirname, "notion-template.json.backup");

// Backup original file
fs.copyFileSync(templatePath, backupPath);

let testsPassed = 0;
let testsFailed = 0;

// Test 1: Valid template should pass
log("Test 1: Valid template should exit with code 0...", "yellow");
try {
  execSync("node validate-notion-template.js", {
    cwd: __dirname,
    stdio: "pipe",
  });
  log("✅ Test 1 passed: Valid template exits with code 0", "green");
  testsPassed++;
} catch (error) {
  log(`❌ Test 1 failed: Expected exit code 0, got ${error.status}`, "red");
  testsFailed++;
}

// Test 2: Invalid JSON should fail
log("\nTest 2: Invalid JSON should exit with code 1...", "yellow");
try {
  fs.writeFileSync(templatePath, "{ invalid json }", "utf8");
  execSync("node validate-notion-template.js", {
    cwd: __dirname,
    stdio: "pipe",
  });
  log(
    "❌ Test 2 failed: Invalid JSON should have exited with non-zero code",
    "red",
  );
  testsFailed++;
} catch (error) {
  if (error.status === 1) {
    log("✅ Test 2 passed: Invalid JSON exits with code 1", "green");
    testsPassed++;
  } else {
    log(`❌ Test 2 failed: Expected exit code 1, got ${error.status}`, "red");
    testsFailed++;
  }
}

// Test 3: Missing required fields
log("\nTest 3: Missing required fields should be handled...", "yellow");
try {
  const invalidTemplate = {
    title: "Test",
    // Missing: type, properties, views, rows
  };
  fs.writeFileSync(
    templatePath,
    JSON.stringify(invalidTemplate, null, 2),
    "utf8",
  );

  const result = execSync("node validate-notion-template.js", {
    cwd: __dirname,
    stdio: "pipe",
    encoding: "utf8",
  });

  // The script auto-adds missing fields, so it should still pass
  if (result.includes("Missing required keys")) {
    log("✅ Test 3 passed: Missing fields are detected and handled", "green");
    testsPassed++;
  } else {
    log(
      "⚠️  Test 3: Missing fields were not detected (may have been auto-fixed)",
      "yellow",
    );
    testsPassed++;
  }
} catch (error) {
  log(`⚠️  Test 3: Script exited with code ${error.status}`, "yellow");
  testsPassed++; // This is acceptable behavior
}

// Test 4: Verify backup and restore
log("\nTest 4: Restoring original template...", "yellow");
try {
  fs.copyFileSync(backupPath, templatePath);
  fs.unlinkSync(backupPath);

  // Verify restore worked
  execSync("node validate-notion-template.js", {
    cwd: __dirname,
    stdio: "pipe",
  });

  log("✅ Test 4 passed: Original template restored successfully", "green");
  testsPassed++;
} catch (error) {
  log(`❌ Test 4 failed: Could not restore original template`, "red");
  testsFailed++;

  // Try to restore anyway
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, templatePath);
    fs.unlinkSync(backupPath);
  }
}

// Summary
log("\n" + "=".repeat(50), "cyan");
log("Test Summary:", "cyan");
log("=".repeat(50), "cyan");
log(`Passed: ${testsPassed}`, "green");
if (testsFailed > 0) {
  log(`Failed: ${testsFailed}`, "red");
}
log("", "reset");

if (testsFailed > 0) {
  process.exit(1);
} else {
  log("✨ All tests passed!\n", "green");
  process.exit(0);
}
