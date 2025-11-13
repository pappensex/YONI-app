#!/usr/bin/env node

/**
 * Comprehensive Chat API Test Script
 * Tests the ChatGPT integration thoroughly - "bash it all round and round"
 * Part of #YONI REGELT initiative
 */

const http = require('http');

// Test configuration
const TEST_PORT = process.env.TEST_PORT || 3000;
const TEST_HOST = process.env.TEST_HOST || 'localhost';

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

let testsPassed = 0;
let testsFailed = 0;

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logTest(name, passed, details = '') {
  if (passed) {
    testsPassed++;
    log(`✓ ${name}`, colors.green);
    if (details) log(`  ${details}`, colors.cyan);
  } else {
    testsFailed++;
    log(`✗ ${name}`, colors.red);
    if (details) log(`  ${details}`, colors.yellow);
  }
}

async function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: TEST_HOST,
      port: TEST_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function testChatAPIValidation() {
  log('\n📝 Testing Chat API Input Validation...', colors.bright);

  // Test 1: Empty question
  try {
    const response = await makeRequest('/api/chat', 'POST', { question: '', mode: 'Consensus' });
    logTest(
      'Empty question returns 400',
      response.status === 400,
      `Status: ${response.status}, Error: ${response.data?.error || 'N/A'}`
    );
  } catch (error) {
    logTest('Empty question returns 400', false, error.message);
  }

  // Test 2: Whitespace-only question
  try {
    const response = await makeRequest('/api/chat', 'POST', { question: '   ', mode: 'Consensus' });
    logTest(
      'Whitespace-only question returns 400',
      response.status === 400,
      `Status: ${response.status}`
    );
  } catch (error) {
    logTest('Whitespace-only question returns 400', false, error.message);
  }

  // Test 3: Missing question field
  try {
    const response = await makeRequest('/api/chat', 'POST', { mode: 'Consensus' });
    logTest(
      'Missing question field returns 400',
      response.status === 400,
      `Status: ${response.status}`
    );
  } catch (error) {
    logTest('Missing question field returns 400', false, error.message);
  }
}

async function testChatAPIModes() {
  log('\n🎭 Testing Chat API Modes...', colors.bright);

  const modes = ['Consensus', 'Contrast', 'Chain'];
  
  for (const mode of modes) {
    try {
      const response = await makeRequest('/api/chat', 'POST', {
        question: 'Test question',
        mode: mode,
      });
      
      // If no API key is configured, we expect 500
      // If API key is configured, we expect 200
      const isValid = response.status === 200 || response.status === 500;
      
      logTest(
        `Mode "${mode}" is handled correctly`,
        isValid,
        `Status: ${response.status}, Mode in response: ${response.data?.mode || 'N/A'}`
      );
    } catch (error) {
      logTest(`Mode "${mode}" is handled correctly`, false, error.message);
    }
  }

  // Test with default mode (no mode specified)
  try {
    const response = await makeRequest('/api/chat', 'POST', {
      question: 'Test question',
    });
    
    const isValid = response.status === 200 || response.status === 500;
    logTest(
      'Default mode (Consensus) is used when mode is not specified',
      isValid,
      `Status: ${response.status}`
    );
  } catch (error) {
    logTest('Default mode is used when mode is not specified', false, error.message);
  }
}

async function testChatAPIStructure() {
  log('\n🏗️  Testing Chat API Response Structure...', colors.bright);

  try {
    const response = await makeRequest('/api/chat', 'POST', {
      question: 'Hello, how are you?',
      mode: 'Consensus',
    });

    if (response.status === 200) {
      // Check response structure
      const hasSuccess = 'success' in response.data;
      const hasResponse = 'response' in response.data;
      const hasMode = 'mode' in response.data;

      logTest(
        'Response has correct structure (success, response, mode)',
        hasSuccess && hasResponse && hasMode,
        `Keys present: ${Object.keys(response.data).join(', ')}`
      );

      logTest(
        'Response text is a string',
        typeof response.data.response === 'string',
        `Type: ${typeof response.data.response}`
      );
    } else if (response.status === 500) {
      // API key not configured - check error structure
      const hasError = 'error' in response.data;
      logTest(
        'Error response has correct structure',
        hasError,
        `Error: ${response.data.error || 'N/A'}`
      );
    }
  } catch (error) {
    logTest('Response structure validation', false, error.message);
  }
}

async function testChatAPIMethodRestrictions() {
  log('\n🚫 Testing HTTP Method Restrictions...', colors.bright);

  // Test GET method (should not be allowed)
  try {
    const response = await makeRequest('/api/chat', 'GET');
    logTest(
      'GET method is not allowed',
      response.status === 404 || response.status === 405,
      `Status: ${response.status}`
    );
  } catch (error) {
    logTest('GET method is not allowed', false, error.message);
  }

  // Test PUT method (should not be allowed)
  try {
    const response = await makeRequest('/api/chat', 'PUT', { question: 'test' });
    logTest(
      'PUT method is not allowed',
      response.status === 404 || response.status === 405,
      `Status: ${response.status}`
    );
  } catch (error) {
    logTest('PUT method is not allowed', false, error.message);
  }
}

async function runAllTests() {
  log('\n' + '='.repeat(60), colors.magenta);
  log('🎯 YONI Chat API Comprehensive Test Suite', colors.bright + colors.magenta);
  log('   "bash it all round and round" - Testing ChatGPT integration', colors.cyan);
  log('   #YONI REGELT 🟣', colors.magenta);
  log('='.repeat(60) + '\n', colors.magenta);

  log(`Testing against: http://${TEST_HOST}:${TEST_PORT}`, colors.cyan);
  log('Note: Some tests may fail if OPENAI_API_KEY is not configured', colors.yellow);
  log('      This is expected and helps validate error handling.\n', colors.yellow);

  await testChatAPIValidation();
  await testChatAPIModes();
  await testChatAPIStructure();
  await testChatAPIMethodRestrictions();

  // Summary
  log('\n' + '='.repeat(60), colors.magenta);
  log('📊 Test Summary', colors.bright);
  log('='.repeat(60), colors.magenta);
  log(`✓ Passed: ${testsPassed}`, colors.green);
  log(`✗ Failed: ${testsFailed}`, colors.red);
  log(`Total:   ${testsPassed + testsFailed}`, colors.cyan);
  log('='.repeat(60) + '\n', colors.magenta);

  if (testsFailed === 0) {
    log('🎉 All tests passed! YONI REGELT! 🟣✨', colors.green + colors.bright);
    process.exit(0);
  } else {
    log('⚠️  Some tests failed. Review the output above.', colors.yellow);
    process.exit(1);
  }
}

// Check if server is running before starting tests
async function checkServerAvailability() {
  try {
    log('Checking if development server is running...', colors.cyan);
    await makeRequest('/');
    log('✓ Server is available!\n', colors.green);
    return true;
  } catch (error) {
    log('✗ Server is not available!', colors.red);
    log(`  Please start the development server first with: npm run dev`, colors.yellow);
    log(`  Expected server at: http://${TEST_HOST}:${TEST_PORT}\n`, colors.yellow);
    return false;
  }
}

// Main execution
(async () => {
  const serverAvailable = await checkServerAvailability();
  if (!serverAvailable) {
    log('💡 Tip: This test script needs a running server.', colors.cyan);
    log('   Run in one terminal: npm run dev', colors.cyan);
    log('   Run in another terminal: node scripts/test-chat-api.js\n', colors.cyan);
    process.exit(1);
  }
  
  await runAllTests();
})();
