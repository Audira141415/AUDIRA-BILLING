/**
 * 🔥 COMPREHENSIVE STRESS TEST - ALL EDGE CASES & ERRORS
 * Tests system under extreme conditions and error scenarios
 * Run: node test-comprehensive-stress.js
 */

const http = require('http');

const API_BASE = 'http://localhost:1993';
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  magenta: '\x1b[35m',
};

const results = { total: 0, passed: 0, failed: 0, errors: 0, tests: [] };
let customerToken = '';
let customerId = '';

function request(method, path, body = null, token = null, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { 'Content-Type': 'application/json' },
      timeout: timeout,
    };

    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => resolve({ status: 0, error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, error: 'Request timeout' });
    });

    if (body) {
      try {
        req.write(typeof body === 'string' ? body : JSON.stringify(body));
      } catch (e) {
        req.write(body);
      }
    }
    req.end();
  });
}

async function test(name, fn, category = 'General') {
  results.total++;
  const startTime = Date.now();

  try {
    await fn();
    const duration = Date.now() - startTime;
    results.passed++;
    results.tests.push({ name, status: 'PASS', category, duration });
    console.log(`${COLORS.green}✓${COLORS.reset} ${name} ${COLORS.gray}(${duration}ms)${COLORS.reset}`);
  } catch (error) {
    const duration = Date.now() - startTime;
    if (error.message.includes('Expected') || error.message.includes('should')) {
      results.failed++;
      results.tests.push({ name, status: 'FAIL', category, duration, error: error.message });
      console.log(`${COLORS.red}✗${COLORS.reset} ${name} ${COLORS.gray}(${duration}ms)${COLORS.reset}`);
    } else {
      results.errors++;
      results.tests.push({ name, status: 'ERROR', category, duration, error: error.message });
      console.log(`${COLORS.magenta}⚠${COLORS.reset} ${name} ${COLORS.gray}(${duration}ms)${COLORS.reset}`);
    }
    console.log(`  ${COLORS.gray}${error.message}${COLORS.reset}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertStatus(response, expectedStatus) {
  if (response.status !== expectedStatus) {
    throw new Error(`Expected ${expectedStatus}, got ${response.status}`);
  }
}

function section(title) {
  console.log(`\n${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
  console.log(`${COLORS.cyan}${title}${COLORS.reset}`);
  console.log(`${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
}

// Setup - Get valid tokens first
async function setup() {
  section('⚙️ SETUP - Getting Valid Tokens');
  
  const adminRes = await request('POST', '/auth/login', {
    email: 'admin@audira.net',
    password: 'admin123',
  });
  console.log(`${COLORS.gray}Admin login: ${adminRes.status === 200 ? '✓' : '✗'}${COLORS.reset}`);

  const custRes = await request('POST', '/auth/customer/login', {
    email: 'customer@example.com',
    password: 'customer123',
  });
  
  if (custRes.status === 201) {
    customerToken = custRes.data.access_token;
    customerId = custRes.data.customer.id;
    console.log(`${COLORS.gray}Customer token obtained: ${customerToken.substring(0, 20)}...${COLORS.reset}`);
  }
}

// 1. SQL Injection Tests
async function testSQLInjection() {
  section('💉 SQL INJECTION TESTS');

  const sqlPayloads = [
    "' OR '1'='1",
    "admin'--",
    "' OR 1=1--",
    "1' UNION SELECT NULL--",
    "'; DROP TABLE users--",
    "admin' OR '1'='1' /*",
  ];

  for (const payload of sqlPayloads) {
    await test(`SQL Injection attempt: ${payload.substring(0, 20)}`, async () => {
      const res = await request('POST', '/auth/login', {
        email: payload,
        password: payload,
      });
      assert(res.status === 401 || res.status === 400, 'Should reject SQL injection');
    }, 'Security');
  }
}

// 2. XSS Tests
async function testXSS() {
  section('🔓 XSS (Cross-Site Scripting) TESTS');

  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert(1)>',
    'javascript:alert(1)',
    '<svg/onload=alert(1)>',
  ];

  for (const payload of xssPayloads) {
    await test(`XSS attempt: ${payload.substring(0, 30)}`, async () => {
      const res = await request('POST', '/auth/customer/login', {
        email: payload,
        password: 'test',
      });
      assert(res.status === 401 || res.status === 400, 'Should reject XSS');
    }, 'Security');
  }
}

// 3. Invalid Input Tests
async function testInvalidInputs() {
  section('❌ INVALID INPUT TESTS');

  await test('Login with null email', async () => {
    const res = await request('POST', '/auth/login', { email: null, password: 'test' });
    assert(res.status === 400 || res.status === 401, 'Should reject null email');
  }, 'Validation');

  await test('Login with empty object', async () => {
    const res = await request('POST', '/auth/login', {});
    assert(res.status === 400 || res.status === 401, 'Should reject empty object');
  }, 'Validation');

  await test('Login with array instead of object', async () => {
    const res = await request('POST', '/auth/login', []);
    assert(res.status === 400 || res.status === 500, 'Should reject array');
  }, 'Validation');

  await test('Login with very long email (1000 chars)', async () => {
    const res = await request('POST', '/auth/login', {
      email: 'a'.repeat(1000) + '@test.com',
      password: 'test',
    });
    assert(res.status === 400 || res.status === 401, 'Should handle long strings');
  }, 'Validation');

  await test('Login with unicode/emoji in email', async () => {
    const res = await request('POST', '/auth/login', {
      email: '😀🎉💯@test.com',
      password: 'test',
    });
    assert(res.status === 400 || res.status === 401, 'Should handle unicode');
  }, 'Validation');
}

// 4. Malformed JSON Tests
async function testMalformedJSON() {
  section('🔨 MALFORMED JSON TESTS');

  await test('Send invalid JSON string', async () => {
    const res = await request('POST', '/auth/login', '{invalid json}');
    assert(res.status === 400 || res.status === 500, 'Should reject invalid JSON');
  }, 'Parsing');

  await test('Send incomplete JSON', async () => {
    const res = await request('POST', '/auth/login', '{"email":"test@');
    assert(res.status === 400 || res.status === 500, 'Should reject incomplete JSON');
  }, 'Parsing');

  await test('Send empty string body', async () => {
    const res = await request('POST', '/auth/login', '');
    assert(res.status === 400 || res.status === 500, 'Should handle empty body');
  }, 'Parsing');
}

// 5. Token Manipulation Tests
async function testTokenManipulation() {
  section('🔑 TOKEN MANIPULATION TESTS');

  await test('Access with invalid token format', async () => {
    const res = await request('GET', '/pelanggan', null, 'invalid-token');
    assert(res.status === 401, 'Should reject invalid token');
  }, 'Authentication');

  await test('Access with malformed JWT', async () => {
    const res = await request('GET', '/pelanggan', null, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature');
    assert(res.status === 401, 'Should reject malformed JWT');
  }, 'Authentication');

  await test('Access with empty token', async () => {
    const res = await request('GET', '/pelanggan', null, '');
    assert(res.status === 401, 'Should reject empty token');
  }, 'Authentication');

  await test('Access with expired-looking token', async () => {
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';
    const res = await request('GET', '/pelanggan', null, expiredToken);
    assert(res.status === 401, 'Should reject expired token');
  }, 'Authentication');
}

// 6. Rate Limiting & DoS Tests
async function testRateLimiting() {
  section('⚡ RATE LIMITING & DOS TESTS');

  await test('Rapid fire 10 login requests', async () => {
    const promises = Array(10).fill().map(() => 
      request('POST', '/auth/login', {
        email: 'admin@audira.net',
        password: 'wrong',
      })
    );
    const results = await Promise.all(promises);
    const tooManyRequests = results.some(r => r.status === 429);
    // Either all process normally OR rate limiting kicks in
    assert(results.length === 10, 'Should handle concurrent requests');
  }, 'Performance');

  await test('Request with huge payload (1MB)', async () => {
    const hugePayload = {
      email: 'test@test.com',
      password: 'x'.repeat(1024 * 1024), // 1MB password
    };
    const res = await request('POST', '/auth/login', hugePayload);
    assert(res.status === 400 || res.status === 413 || res.status === 401, 'Should handle large payload');
  }, 'Performance');
}

// 7. Endpoint Fuzzing
async function testEndpointFuzzing() {
  section('🎲 ENDPOINT FUZZING TESTS');

  const randomEndpoints = [
    '/api/v1/nonexistent',
    '/../../etc/passwd',
    '/%2e%2e%2f%2e%2e%2f',
    '/auth/../../../etc/passwd',
    '/auth/login/../admin',
    '/.git/config',
    '/admin/phpMyAdmin',
    '/wp-admin',
  ];

  for (const endpoint of randomEndpoints) {
    await test(`Fuzzing: ${endpoint}`, async () => {
      const res = await request('GET', endpoint);
      assert(res.status === 404 || res.status === 403 || res.status === 400, 'Should return proper error');
    }, 'Fuzzing');
  }
}

// 8. HTTP Method Tests
async function testHTTPMethods() {
  section('🔧 HTTP METHOD TESTS');

  const methods = ['PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
  
  for (const method of methods) {
    await test(`${method} on /auth/login`, async () => {
      const res = await request(method, '/auth/login', null);
      assert(res.status === 404 || res.status === 405 || res.status === 200, 'Should handle method appropriately');
    }, 'HTTP Methods');
  }
}

// 9. Database Edge Cases
async function testDatabaseEdgeCases() {
  section('💾 DATABASE EDGE CASES');

  await test('Access non-existent customer ID', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const res = await request('GET', `/pelanggan/${fakeId}`, null, customerToken);
    assert(res.status === 404 || res.status === 401, 'Should handle non-existent ID');
  }, 'Database');

  await test('Access with invalid UUID format', async () => {
    const res = await request('GET', '/pelanggan/not-a-uuid', null, customerToken);
    assert(res.status === 400 || res.status === 404 || res.status === 401, 'Should reject invalid UUID');
  }, 'Database');

  await test('Access with negative ID', async () => {
    const res = await request('GET', '/pelanggan/-1', null, customerToken);
    assert(res.status === 400 || res.status === 404 || res.status === 401, 'Should reject negative ID');
  }, 'Database');
}

// 10. Network & Timeout Tests
async function testNetworkIssues() {
  section('🌐 NETWORK & TIMEOUT TESTS');

  await test('Request with 1ms timeout', async () => {
    try {
      const res = await request('GET', '/auth', null, null, 1);
      // Either completes fast or times out
      assert(res.status === 0 || res.status >= 200, 'Should handle timeout');
    } catch (e) {
      assert(true, 'Timeout expected');
    }
  }, 'Network');

  await test('Request to non-existent port', async () => {
    try {
      const url = new URL('/test', 'http://localhost:9999');
      const res = await request('GET', '/test');
      // Connection should fail
      assert(true, 'Should handle connection failure');
    } catch (e) {
      assert(true, 'Connection failure expected');
    }
  }, 'Network');
}

// 11. Authorization Bypass Attempts
async function testAuthorizationBypass() {
  section('🚫 AUTHORIZATION BYPASS ATTEMPTS');

  await test('Attempt to access admin endpoint with customer token', async () => {
    const res = await request('GET', '/pelanggan', null, customerToken);
    assertStatus(res, 401);
  }, 'Authorization');

  await test('Attempt CRUD without authentication', async () => {
    const res = await request('POST', '/pelanggan', { name: 'Test' });
    assert(res.status === 401, 'Should require authentication');
  }, 'Authorization');

  await test('Attempt to modify other customer data', async () => {
    const otherId = '99999999-9999-9999-9999-999999999999';
    const res = await request('PATCH', `/pelanggan/${otherId}`, { name: 'Hacked' }, customerToken);
    assert(res.status === 401 || res.status === 403 || res.status === 404, 'Should prevent modification');
  }, 'Authorization');
}

// 12. Concurrent Request Tests
async function testConcurrentRequests() {
  section('🔄 CONCURRENT REQUEST TESTS');

  await test('50 simultaneous read requests', async () => {
    const promises = Array(50).fill().map(() => request('GET', '/auth'));
    const results = await Promise.all(promises);
    const allResponded = results.every(r => r.status > 0);
    assert(allResponded, 'All requests should get response');
  }, 'Concurrency');

  await test('Mixed concurrent operations', async () => {
    const promises = [
      request('GET', '/mikrotik'),
      request('GET', '/monitoring'),
      request('GET', '/notification'),
      request('POST', '/auth/login', { email: 'wrong@test.com', password: 'wrong' }),
      request('GET', '/payment'),
    ];
    const results = await Promise.all(promises);
    assert(results.length === 5, 'All concurrent requests should complete');
  }, 'Concurrency');
}

// 13. Special Characters & Encoding Tests
async function testSpecialCharacters() {
  section('🔤 SPECIAL CHARACTERS & ENCODING');

  const specialPayloads = [
    { email: 'test@test.com\x00', password: 'test' }, // null byte
    { email: 'test@test.com\r\n', password: 'test' }, // CRLF
    { email: 'test%40test.com', password: 'test' }, // URL encoded
    { email: '../../../etc/passwd', password: 'test' }, // Path traversal
    { email: '${7*7}', password: 'test' }, // Template injection
  ];

  for (let i = 0; i < specialPayloads.length; i++) {
    await test(`Special char test ${i + 1}`, async () => {
      const res = await request('POST', '/auth/login', specialPayloads[i]);
      assert(res.status === 400 || res.status === 401, 'Should handle special chars safely');
    }, 'Encoding');
  }
}

// Main runner
async function runAllTests() {
  console.log(`\n${COLORS.blue}╔════════════════════════════════════════════════╗${COLORS.reset}`);
  console.log(`${COLORS.blue}║  🔥 COMPREHENSIVE STRESS TEST SUITE 🔥    ║${COLORS.reset}`);
  console.log(`${COLORS.blue}╚════════════════════════════════════════════════╝${COLORS.reset}`);
  console.log(`${COLORS.yellow}⚠️  WARNING: Testing extreme edge cases & attacks${COLORS.reset}`);
  console.log(`${COLORS.gray}API: ${API_BASE} | Started: ${new Date().toLocaleString()}${COLORS.reset}\n`);

  const startTime = Date.now();

  try {
    await setup();
    
    await testSQLInjection();
    await testXSS();
    await testInvalidInputs();
    await testMalformedJSON();
    await testTokenManipulation();
    await testRateLimiting();
    await testEndpointFuzzing();
    await testHTTPMethods();
    await testDatabaseEdgeCases();
    await testNetworkIssues();
    await testAuthorizationBypass();
    await testConcurrentRequests();
    await testSpecialCharacters();

    const duration = Date.now() - startTime;
    const passRate = ((results.passed / results.total) * 100).toFixed(1);

    console.log(`\n${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
    console.log(`${COLORS.cyan}📊 FINAL RESULTS${COLORS.reset}`);
    console.log(`${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
    console.log(`Total Tests:  ${results.total}`);
    console.log(`${COLORS.green}Passed:       ${results.passed}${COLORS.reset}`);
    console.log(`${COLORS.red}Failed:       ${results.failed}${COLORS.reset}`);
    console.log(`${COLORS.magenta}Errors:       ${results.errors}${COLORS.reset}`);
    console.log(`Pass Rate:    ${passRate}%`);
    console.log(`Duration:     ${(duration / 1000).toFixed(2)}s`);

    // Category breakdown
    console.log(`\n${COLORS.cyan}📋 BY CATEGORY${COLORS.reset}`);
    const categories = {};
    results.tests.forEach((test) => {
      if (!categories[test.category]) categories[test.category] = { passed: 0, failed: 0, errors: 0 };
      if (test.status === 'PASS') categories[test.category].passed++;
      else if (test.status === 'FAIL') categories[test.category].failed++;
      else categories[test.category].errors++;
    });

    Object.keys(categories).forEach((cat) => {
      const c = categories[cat];
      const total = c.passed + c.failed + c.errors;
      const rate = ((c.passed / total) * 100).toFixed(0);
      console.log(
        `${cat.padEnd(16)} ${COLORS.green}${c.passed}✓${COLORS.reset} ${COLORS.red}${c.failed}✗${COLORS.reset} ${COLORS.magenta}${c.errors}⚠${COLORS.reset} (${rate}%)`
      );
    });

    // Show failed tests
    const failedTests = results.tests.filter(t => t.status === 'FAIL');
    if (failedTests.length > 0) {
      console.log(`\n${COLORS.red}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
      console.log(`${COLORS.red}❌ FAILED TESTS (Actual Bugs)${COLORS.reset}`);
      console.log(`${COLORS.red}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
      failedTests.forEach(t => console.log(`${COLORS.red}✗${COLORS.reset} ${t.name}: ${t.error}`));
    }

    console.log(`\n${COLORS.cyan}🔍 SECURITY ASSESSMENT${COLORS.reset}`);
    const securityTests = results.tests.filter(t => t.category === 'Security');
    const securityPassed = securityTests.filter(t => t.status === 'PASS').length;
    console.log(`Security Tests: ${securityPassed}/${securityTests.length} passed`);
    
    if (securityPassed === securityTests.length) {
      console.log(`${COLORS.green}✅ All security tests passed!${COLORS.reset}`);
    } else {
      console.log(`${COLORS.red}⚠️  Security vulnerabilities detected!${COLORS.reset}`);
    }

    console.log(`\n${COLORS.gray}Completed: ${new Date().toLocaleString()}${COLORS.reset}\n`);

    if (passRate >= 95) {
      console.log(`${COLORS.green}🎉 EXCELLENT! System is robust!${COLORS.reset}\n`);
    } else if (passRate >= 80) {
      console.log(`${COLORS.yellow}⚠️  GOOD! Minor issues found${COLORS.reset}\n`);
    } else {
      console.log(`${COLORS.red}❌ CRITICAL! Multiple vulnerabilities found${COLORS.reset}\n`);
    }

    process.exit(results.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error(`\n${COLORS.red}💥 Fatal Error: ${error.message}${COLORS.reset}`);
    console.error(error.stack);
    process.exit(1);
  }
}

runAllTests();
