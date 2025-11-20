#!/usr/bin/env node

/**
 * Validation script for YONI Notion template JSON file
 * Validates structure, required fields, and data integrity
 */

const fs = require("fs");
const path = require("path");

function validateNotionTemplate(filePath) {
  console.log(`🔍 Validating Notion template: ${filePath}`);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found: ${filePath}`);
    process.exit(1);
  }

  // Read and parse JSON
  let data;
  try {
    const content = fs.readFileSync(filePath, "utf8");
    data = JSON.parse(content);
    console.log("✓ Valid JSON format");
  } catch (error) {
    console.error(`❌ Error: Invalid JSON format: ${error.message}`);
    process.exit(1);
  }

  // Validate required top-level fields
  const requiredFields = [
    "title",
    "version",
    "created",
    "description",
    "pillars",
    "workflow",
  ];
  const missingFields = requiredFields.filter((field) => !(field in data));

  if (missingFields.length > 0) {
    console.error(
      `❌ Error: Missing required fields: ${missingFields.join(", ")}`,
    );
    process.exit(1);
  }
  console.log("✓ All required top-level fields present");

  // Validate pillars structure
  if (!Array.isArray(data.pillars)) {
    console.error('❌ Error: "pillars" must be an array');
    process.exit(1);
  }

  if (data.pillars.length === 0) {
    console.error('❌ Error: "pillars" array is empty');
    process.exit(1);
  }
  console.log(`✓ Found ${data.pillars.length} pillar(s)`);

  // Validate each pillar
  const pillarRequiredFields = ["name", "focus", "color", "tasks"];
  data.pillars.forEach((pillar, index) => {
    const missingPillarFields = pillarRequiredFields.filter(
      (field) => !(field in pillar),
    );
    if (missingPillarFields.length > 0) {
      console.error(
        `❌ Error: Pillar ${index + 1} missing fields: ${missingPillarFields.join(", ")}`,
      );
      process.exit(1);
    }

    // Validate tasks array
    if (!Array.isArray(pillar.tasks)) {
      console.error(`❌ Error: Pillar "${pillar.name}" tasks must be an array`);
      process.exit(1);
    }

    // Validate each task
    const taskRequiredFields = [
      "id",
      "title",
      "description",
      "status",
      "priority",
    ];
    pillar.tasks.forEach((task, taskIndex) => {
      const missingTaskFields = taskRequiredFields.filter(
        (field) => !(field in task),
      );
      if (missingTaskFields.length > 0) {
        console.error(
          `❌ Error: Task ${taskIndex + 1} in pillar "${pillar.name}" missing fields: ${missingTaskFields.join(", ")}`,
        );
        process.exit(1);
      }

      // Validate task ID format
      if (!task.id.startsWith(pillar.name + "-")) {
        console.error(
          `❌ Error: Task ID "${task.id}" should start with "${pillar.name}-"`,
        );
        process.exit(1);
      }
    });

    console.log(
      `✓ Pillar "${pillar.name}" has ${pillar.tasks.length} valid task(s)`,
    );
  });

  // Validate workflow structure
  if (!data.workflow.statuses || !Array.isArray(data.workflow.statuses)) {
    console.error("❌ Error: workflow.statuses must be an array");
    process.exit(1);
  }

  if (!data.workflow.priorities || !Array.isArray(data.workflow.priorities)) {
    console.error("❌ Error: workflow.priorities must be an array");
    process.exit(1);
  }

  // Validate that all task statuses are in the allowed list
  const validStatuses = data.workflow.statuses;
  const validPriorities = data.workflow.priorities;

  data.pillars.forEach((pillar) => {
    pillar.tasks.forEach((task) => {
      if (!validStatuses.includes(task.status)) {
        console.error(
          `❌ Error: Task "${task.id}" has invalid status "${task.status}". Valid statuses: ${validStatuses.join(", ")}`,
        );
        process.exit(1);
      }

      if (!validPriorities.includes(task.priority)) {
        console.error(
          `❌ Error: Task "${task.id}" has invalid priority "${task.priority}". Valid priorities: ${validPriorities.join(", ")}`,
        );
        process.exit(1);
      }
    });
  });

  console.log("✓ All task statuses and priorities are valid");
  console.log("✓ Workflow structure is valid");

  // Summary
  const totalTasks = data.pillars.reduce(
    (sum, pillar) => sum + pillar.tasks.length,
    0,
  );
  console.log("\n📊 Validation Summary:");
  console.log(`   Title: ${data.title}`);
  console.log(`   Version: ${data.version}`);
  console.log(`   Pillars: ${data.pillars.length}`);
  console.log(`   Total Tasks: ${totalTasks}`);
  console.log("\n✅ Notion template validation passed!");
}

// Main execution
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(
    "Usage: node validate-notion.js <path-to-notion-template.json>",
  );
  process.exit(1);
}

validateNotionTemplate(args[0]);
