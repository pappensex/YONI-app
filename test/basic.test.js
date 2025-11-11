import { test } from 'node:test';
import assert from 'node:assert';

test('YONI app basic validation', () => {
  // Basic sanity test to ensure the test framework works
  assert.ok(true, 'Test framework is working');
});

test('Environment check', () => {
  // Verify we're in a Node.js environment
  assert.ok(process.versions.node, 'Running in Node.js');
});
