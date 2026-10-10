const http = require('http');

const API_BASE = 'http://localhost:1993';
let customerToken = '';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsedBody = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: parsedBody, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    req.setTimeout(5000);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test runner
async function runTests() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   🧪 CUSTOMER ENDPOINTS TEST SUITE    ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log(`API Base: ${API_BASE}`);
  console.log(`Started: ${new Date().toLocaleString()}\n`);

  let passed = 0;
  let failed = 0;
  const results = [];

  const test = async (name, fn) => {
    try {
      const startTime = Date.now();
      await fn();
      const duration = Date.now() - startTime;
      console.log(`✓ ${name} (${duration}ms)`);
      results.push({ name, status: 'PASS', duration });
      passed++;
    } catch (error) {
      console.log(`✗ ${name}`);
      console.log(`  Error: ${error.message}`);
      results.push({ name, status: 'FAIL', error: error.message });
      failed++;
    }
  };

  // ==================== SETUP ====================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' 📋 SETUP - Getting Customer Token');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const loginRes = await makeRequest('POST', '/auth/customer/login', {
      email: 'customer@example.com',
      password: 'customer123',
    });

    if (loginRes.status === 200 || loginRes.status === 201) {
      customerToken = loginRes.data.access_token;
      console.log('Customer login: ✓');
      console.log(`Token: ${customerToken.substring(0, 20)}...\n`);
    } else {
      throw new Error(`Customer login failed: ${loginRes.status}`);
    }
  } catch (error) {
    console.log('❌ SETUP FAILED: Cannot get customer token');
    console.log(`Error: ${error.message}\n`);
    process.exit(1);
  }

  // ==================== DASHBOARD TESTS ====================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' 📊 DASHBOARD TESTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await test('GET /customer/dashboard - Get dashboard stats', async () => {
    const res = await makeRequest('GET', '/customer/dashboard', null, customerToken);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.data.customer) throw new Error('Missing customer data');
    if (!res.data.invoices) throw new Error('Missing invoices data');
    if (!res.data.tickets) throw new Error('Missing tickets data');
  });

  // ==================== PROFILE TESTS ====================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' 👤 PROFILE TESTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await test('GET /customer/profile - Get profile', async () => {
    const res = await makeRequest('GET', '/customer/profile', null, customerToken);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.data.name) throw new Error('Missing name');
    if (!res.data.email) throw new Error('Missing email');
  });

  await test('PUT /customer/profile - Update profile', async () => {
    const res = await makeRequest('PUT', '/customer/profile', {
      name: 'Updated Customer Name',
      phone: '081234567890',
    }, customerToken);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.data.name !== 'Updated Customer Name') throw new Error('Name not updated');
  });

  // ==================== INVOICE TESTS ====================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' 💰 INVOICE TESTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await test('GET /customer/invoices - Get all invoices', async () => {
    const res = await makeRequest('GET', '/customer/invoices', null, customerToken);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.data.data) throw new Error('Missing data array');
    if (!res.data.meta) throw new Error('Missing meta pagination');
  });

  await test('GET /customer/invoices?page=1&limit=5 - Pagination', async () => {
    const res = await makeRequest('GET', '/customer/invoices?page=1&limit=5', null, customerToken);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.data.meta.limit !== 5) throw new Error('Limit not applied');
  });

  await test('GET /customer/invoices?status=unpaid - Filter by status', async () => {
    const res = await makeRequest('GET', '/customer/invoices?status=unpaid', null, customerToken);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });

  // ==================== PACKAGE TESTS ====================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' 📦 PACKAGE TESTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await test('GET /customer/packages - Get available packages', async () => {
    const res = await makeRequest('GET', '/customer/packages', null, customerToken);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!Array.isArray(res.data)) throw new Error('Expected array of packages');
  });

  await test('GET /customer/package/current - Get current package', async () => {
    const res = await makeRequest('GET', '/customer/package/current', null, customerToken);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });

  // ==================== TICKET TESTS ====================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' 🎫 TICKET TESTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let createdTicketId = null;

  await test('POST /customer/tickets - Create new ticket', async () => {
    const res = await makeRequest('POST', '/customer/tickets', {
      title: 'Test Issue - Internet Slow',
      description: 'My internet connection is very slow today',
      priority: 'high',
    }, customerToken);
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    if (!res.data.id) throw new Error('Missing ticket ID');
    if (!res.data.ticketNumber) throw new Error('Missing ticket number');
    createdTicketId = res.data.id;
  });

  await test('GET /customer/tickets - Get all tickets', async () => {
    const res = await makeRequest('GET', '/customer/tickets', null, customerToken);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.data.data) throw new Error('Missing data array');
    if (!res.data.meta) throw new Error('Missing meta pagination');
  });

  await test('GET /customer/tickets/:id - Get ticket detail', async () => {
    if (!createdTicketId) {
      // Get any ticket
      const listRes = await makeRequest('GET', '/customer/tickets', null, customerToken);
      if (listRes.data.data && listRes.data.data.length > 0) {
        createdTicketId = listRes.data.data[0].id;
      }
    }
    
    if (createdTicketId) {
      const res = await makeRequest('GET', `/customer/tickets/${createdTicketId}`, null, customerToken);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      if (res.data.id !== createdTicketId) throw new Error('Wrong ticket returned');
    }
  });

  await test('GET /customer/tickets?status=open - Filter by status', async () => {
    const res = await makeRequest('GET', '/customer/tickets?status=open', null, customerToken);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });

  // ==================== AUTHORIZATION TESTS ====================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' 🔒 AUTHORIZATION TESTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await test('No token - Should return 401', async () => {
    const res = await makeRequest('GET', '/customer/dashboard', null, null);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('Invalid token - Should return 401', async () => {
    const res = await makeRequest('GET', '/customer/dashboard', null, 'invalid-token');
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // ==================== RESULTS ====================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' 📊 TEST SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const total = passed + failed;
  const passRate = ((passed / total) * 100).toFixed(1);

  console.log(`Total Tests:  ${total}`);
  console.log(`Passed:       ${passed}`);
  console.log(`Failed:       ${failed}`);
  console.log(`Pass Rate:    ${passRate}%`);
  console.log(`Duration:     ${(results.reduce((sum, r) => sum + (r.duration || 0), 0) / 1000).toFixed(2)}s\n`);

  // Category breakdown
  const categories = {
    'Dashboard': results.filter(r => r.name.includes('dashboard')),
    'Profile': results.filter(r => r.name.includes('profile')),
    'Invoice': results.filter(r => r.name.includes('invoice')),
    'Package': results.filter(r => r.name.includes('package')),
    'Ticket': results.filter(r => r.name.includes('ticket')),
    'Auth': results.filter(r => r.name.includes('token')),
  };

  console.log('📋 BY CATEGORY');
  Object.entries(categories).forEach(([cat, tests]) => {
    const catPassed = tests.filter(t => t.status === 'PASS').length;
    const catTotal = tests.length;
    const catPercent = catTotal > 0 ? ((catPassed / catTotal) * 100).toFixed(0) : 0;
    console.log(`${cat.padEnd(12)} ${catPassed}✓ ${catTotal - catPassed}✗ (${catPercent}%)`);
  });

  console.log(`\nCompleted: ${new Date().toLocaleString()}\n`);

  if (failed === 0) {
    console.log('✅ EXCELLENT! All customer endpoints working!\n');
  } else {
    console.log(`⚠️  ${failed} test(s) failed. Review errors above.\n`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('\n❌ Test suite crashed:', error.message);
  process.exit(1);
});
