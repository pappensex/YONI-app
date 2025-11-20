/**
 * Test file for Notion formula utilities
 * Run with: node --loader ts-node/esm notionFormulas.test.ts
 */

import {
  prop,
  round,
  format,
  toNumber,
  calculateSubtasksDone,
} from "./notionFormulas";

// Test data
const testData = {
  "Subtasks Done": 5.7,
  "Total Tasks": 10,
  Progress: 57.333333,
};

console.log("🧪 Testing Notion Formula Utilities\n");

// Test prop()
console.log("Testing prop():");
console.log(
  '  prop(testData, "Subtasks Done"):',
  prop(testData, "Subtasks Done"),
);
console.log("  Expected: 5.7\n");

// Test round()
console.log("Testing round():");
console.log("  round(5.7):", round(5.7));
console.log("  Expected: 6");
console.log("  round(57.333333):", round(57.333333));
console.log("  Expected: 57\n");

// Test format()
console.log("Testing format():");
console.log("  format(6):", format(6));
console.log('  Expected: "6"');
console.log("  typeof format(6):", typeof format(6));
console.log("  Expected: string\n");

// Test toNumber()
console.log("Testing toNumber():");
console.log('  toNumber("6"):', toNumber("6"));
console.log("  Expected: 6");
console.log('  typeof toNumber("6"):', typeof toNumber("6"));
console.log("  Expected: number\n");

// Test complete formula: toNumber(format(round(prop("Subtasks Done"))))
console.log("Testing complete formula:");
console.log("  Input data:", { "Subtasks Done": 5.7 });
console.log(
  "  calculateSubtasksDone(data):",
  calculateSubtasksDone({ "Subtasks Done": 5.7 }),
);
console.log("  Expected: 6");
console.log("  Step by step:");
console.log('    1. prop(data, "Subtasks Done") = 5.7');
console.log("    2. round(5.7) = 6");
console.log('    3. format(6) = "6"');
console.log('    4. toNumber("6") = 6\n');

// Test with percentage calculation (as used in YoniDeployControlCenter)
console.log("Testing with percentage (Deploy Control Center use case):");
const done = 5;
const total = 8;
const percentage = (done / total) * 100; // 62.5
console.log("  done/total =", `${done}/${total} = ${percentage}%`);
console.log(
  '  calculateSubtasksDone({ "Subtasks Done": percentage }):',
  calculateSubtasksDone({ "Subtasks Done": percentage }),
);
console.log("  Expected: 63 (rounded from 62.5)\n");

console.log("✅ All tests completed!");
