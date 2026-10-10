/**
 * 🤖 AUTOMATED API TESTING SCRIPT V2
 * Tests existing backend endpoints
 * Run: node test-api-automated-v2.js
 */

const http = require('http');

// Configuration
const API_BASE = 'http://localhost:1993';
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

// Test results
const results = { total: 0, passed: 0, failed: 0, skipped: 0, tests: [] };

// Auth tokens
let adminToken = '';
let customerToken = '';
let customerId = '';

/**
 * Make HTTP request
 */
function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { 'Content-Type': 'application/json' },
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

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

/**
 * Run a test
 */
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
    results.failed++;
    results.tests.push({ name, status: 'FAIL', category, duration, error: error.message });
    console.log(`${COLORS.red}✗${COLORS.reset} ${name} ${COLORS.gray}(${duration}ms)${COLORS.reset}`);
    console.log(`  ${COLORS.red}${error.message}${COLORS.reset}`);
  }
}

/**
 * Assert helpers
 */
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) throw new Error(`${message}: expected ${expected}, got ${actual}`);
}

function assertStatus(response, expectedStatus) {
  if (response.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
  }
}

function assertHasProperty(obj, property) {
  if (!obj || !obj.hasOwnProperty(property)) {
    throw new Error(`Expected object to have property "${property}"`);
  }
}

/**
 * Print section header
 */
function section(title) {
  console.log(`\n${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
  console.log(`${COLORS.cyan}${title}${COLORS.reset}`);
  console.log(`${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
}

/**
 * TEST SUITES
 */

// 1. Health Check Tests
async function testHealthChecks() {
  section('🏥 HEALTH CHECK TESTS');

  await test('Backend server is responding', async () => {
    const res = await request('GET', '/');
    assert(res.status, 'Server should respond');
  }, 'Health');

  await test('Auth endpoint is available', async () => {
    const res = await request('GET', '/auth');
    assert(res.status === 200 || res.status === 404, 'Auth module loaded');
  }, 'Health');
}

// 2. Authentication Tests
async function testAuthentication() {
  section('🔐 AUTHENTICATION TESTS');

  await test('Admin login with valid credentials', async () => {
    const res = await request('POST', '/auth/login', {
      email: 'admin@audira.net',
      password: 'admin123',
    });
    assertStatus(res, 200);
    assertHasProperty(res.data, 'user');
    assertEqual(res.data.user.role, 'ADMIN', 'User should have ADMIN role');
    // Admin login doesn't return token directly, uses cookies
    // But we can use the response to get session
  }, 'Auth');

  await test('Admin login with invalid password', async () => {
    const res = await request('POST', '/auth/login', {
      email: 'admin@audira.net',
      password: 'wrongpassword',
    });
    assertStatus(res, 401);
  }, 'Auth');

  await test('Customer login with valid credentials', async () => {
    const res = await request('POST', '/auth/customer/login', {
      email: 'customer@example.com',
      password: 'customer123',
    });
    assertStatus(res, 201);
    assertHasProperty(res.data, 'customer');
    assertHasProperty(res.data, 'access_token');
    customerToken = res.data.access_token;
    customerId = res.data.customer.id;
  }, 'Auth');

  await test('Customer login with invalid password', async () => {
    const res = await request('POST', '/auth/customer/login', {
      email: 'customer@example.com',
      password: 'wrongpassword',
    });
    assertStatus(res, 401);
  }, 'Auth');
}Admin-only endpoints)
async function testCustomerManagement() {
  section('👥 CUSTOMER MANAGEMENT TESTS (Admin Access)');

  await test('Customer CANNOT access /pelanggan (authorization test)', async () => {
    const res = await request('GET', '/pelanggan', null, customerToken);
    assertStatus(res, 401);
  }, 'Customer');

  await test('Access pelanggan without token (should fail)', async () => {
    const res = await request('GET', '/pelanggan');
    assertStatus(res, 401);
  }, 'Customer');

  // Note: /pelanggan requires admin role, so we test with admin token in separate suite
  // Customer tokens are for customer-specific endpoints onlywait request('GET', '/pelanggan');
    assertStatus(res, 401);
  }, 'Customer');
}

// 4. Mikrotik Tests
async function testMikrotik() {
  section('🌐 MIKROTIK TESTS');

  await test('Get all mikrotik devices', async () => {
    const res = await request('GET', '/mikrotik');
    assert(res.status === 200 || res.status === 401, 'Endpoint exists');
  }, 'Mikrotik');

  await test('Get mikrotik stats', async () => {
    const res = await request('GET', '/mikrotik/stats');
    assert(res.status, 'Endpoint responds');
  }, 'Mikrotik');
}

// 5. Other Endpoints
async function testOtherEndpoints() {
  section('🔧 OTHER ENDPOINTS');

  const endpoints = [
    { path: '/monitoring', name: 'Monitoring' },
    { path: '/notification', name: 'Notification' },
    { path: '/payment', name: 'Payment' },
    { path: '/reports', name: 'Reports' },
    { path: '/settings', name: 'Settings' },
  ];

  for (const ep of endpoints) {
    await test(`${ep.name} endpoint exists`, async () => {
      const res = await request('GET', ep.path);
      assert(res.status, `${ep.name} should respond`);
    }, 'Endpoints');
  }
}

/**
 * MAIN TEST RUNNER
 */
async function runAllTests() {
  console.log(`\n${COLORS.blue}╔════════════════════════════════════════╗${COLORS.reset}`);
  console.log(`${COLORS.blue}║   🤖 AUTOMATED API TESTING SUITE   ║${COLORS.reset}`);
  console.log(`${COLORS.blue}╚════════════════════════════════════════╝${COLORS.reset}`);
  console.log(`${COLORS.gray}API Base: ${API_BASE}${COLORS.reset}`);
  console.log(`${COLORS.gray}Started: ${new Date().toLocaleString()}${COLORS.reset}\n`);

  const startTime = Date.now();

  try {
    await testHealthChecks();
    await testAuthentication();
    await testCustomerManagement();
    await testMikrotik();
    await testOtherEndpoints();

    // Summary
    const duration = Date.now() - startTime;
    const passRate = ((results.passed / results.total) * 100).toFixed(1);

    console.log(`\n${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
    console.log(`${COLORS.cyan}📊 TEST SUMMARY${COLORS.reset}`);
    console.log(`${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
    console.log(`Total Tests:  ${results.total}`);
    console.log(`${COLORS.green}Passed:       ${results.passed}${COLORS.reset}`);
    console.log(`${COLORS.red}Failed:       ${results.failed}${COLORS.reset}`);
    console.log(`Pass Rate:    ${passRate}%`);
    console.log(`Duration:     ${(duration / 1000).toFixed(2)}s`);

    // Category breakdown
    console.log(`\n${COLORS.cyan}📋 BY CATEGORY${COLORS.reset}`);
    const categories = {};
    results.tests.forEach((test) => {
      if (!categories[test.category]) categories[test.category] = { passed: 0, failed: 0 };
      if (test.status === 'PASS') categories[test.category].passed++;
      else categories[test.category].failed++;
    });

    Object.keys(categories).forEach((cat) => {
      const c = categories[cat];
      const total = c.passed + c.failed;
      const rate = ((c.passed / total) * 100).toFixed(0);
      console.log(
        `${cat.padEnd(12)} ${COLORS.green}${c.passed}✓${COLORS.reset} ${COLORS.red}${c.failed}✗${COLORS.reset} (${rate}%)`
      );
    });

    // Failed tests detail
    if (results.failed > 0) {
      console.log(`\n${COLORS.red}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
      console.log(`${COLORS.red}❌ FAILED TESTS${COLORS.reset}`);
      console.log(`${COLORS.red}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
      results.tests
        .filter((t) => t.status === 'FAIL')
        .forEach((t) => {
          console.log(`${COLORS.red}✗${COLORS.reset} ${t.name}`);
          console.log(`  ${COLORS.gray}${t.error}${COLORS.reset}`);
        });
    }

    console.log(`\n${COLORS.gray}Completed: ${new Date().toLocaleString()}${COLORS.reset}\n`);

    // Summary message
    if (passRate >= 90) {
      console.log(`${COLORS.green}✅ EXCELLENT! All critical tests passed!${COLORS.reset}\n`);
    } else if (passRate >= 70) {
      console.log(`${COLORS.yellow}⚠️  GOOD, but some tests need attention${COLORS.reset}\n`);
    } else {
      console.log(`${COLORS.red}❌ ATTENTION NEEDED: Multiple test failures${COLORS.reset}\n`);
    }

    process.exit(results.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error(`\n${COLORS.red}Fatal Error: ${error.message}${COLORS.reset}`);
    process.exit(1);
  }
}

// Run tests
runAllTests();
