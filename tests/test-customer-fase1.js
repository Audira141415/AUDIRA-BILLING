const API_BASE = 'http://localhost:1993';

// Test configuration
const testCustomer = {
  email: 'customer@example.com',
  password: 'customer123'
};

let customerToken = '';
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to log test results
function logTest(name, passed, message = '') {
  testResults.tests.push({ name, passed, message });
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${name}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${name}: ${message}`);
  }
}

// Test 1: Customer Login
async function testCustomerLogin() {
  try {
    const response = await fetch(`${API_BASE}/auth/customer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCustomer)
    });

    const data = await response.json();
    
    if (response.ok && data.access_token) {
      customerToken = data.access_token;
      logTest('Customer Login', true);
      return true;
    } else {
      logTest('Customer Login', false, data.message || 'No token received');
      return false;
    }
  } catch (error) {
    logTest('Customer Login', false, error.message);
    return false;
  }
}

// Test 2: Get Dashboard
async function testGetDashboard() {
  try {
    const response = await fetch(`${API_BASE}/customer/dashboard`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.customer && data.invoices && data.tickets) {
      logTest('Get Dashboard', true);
      return true;
    } else {
      logTest('Get Dashboard', false, 'Invalid dashboard data structure');
      return false;
    }
  } catch (error) {
    logTest('Get Dashboard', false, error.message);
    return false;
  }
}

// Test 3: Get Profile
async function testGetProfile() {
  try {
    const response = await fetch(`${API_BASE}/customer/profile`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.id && data.name) {
      logTest('Get Profile', true);
      return true;
    } else {
      logTest('Get Profile', false, 'Invalid profile data');
      return false;
    }
  } catch (error) {
    logTest('Get Profile', false, error.message);
    return false;
  }
}

// Test 4: Update Profile
async function testUpdateProfile() {
  try {
    const response = await fetch(`${API_BASE}/customer/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${customerToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Customer Test Updated',
        phone: '08123456789'
      })
    });

    const data = await response.json();
    
    if (response.ok && data.name === 'Customer Test Updated') {
      logTest('Update Profile', true);
      return true;
    } else {
      logTest('Update Profile', false, 'Profile not updated correctly');
      return false;
    }
  } catch (error) {
    logTest('Update Profile', false, error.message);
    return false;
  }
}

// Test 5: Get Invoices (with pagination)
async function testGetInvoices() {
  try {
    const response = await fetch(`${API_BASE}/customer/invoices?page=1&limit=10`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.data && data.pagination) {
      logTest('Get Invoices List', true);
      return true;
    } else {
      logTest('Get Invoices List', false, 'Invalid invoices data structure');
      return false;
    }
  } catch (error) {
    logTest('Get Invoices List', false, error.message);
    return false;
  }
}

// Test 6: Get Invoices with Status Filter
async function testGetInvoicesWithFilter() {
  try {
    const response = await fetch(`${API_BASE}/customer/invoices?status=unpaid`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.data) {
      logTest('Get Invoices with Filter', true);
      return true;
    } else {
      logTest('Get Invoices with Filter', false, 'Filter not working');
      return false;
    }
  } catch (error) {
    logTest('Get Invoices with Filter', false, error.message);
    return false;
  }
}

// Test 7: Get Invoice Detail
async function testGetInvoiceDetail() {
  try {
    // First get list to find an invoice ID
    const listResponse = await fetch(`${API_BASE}/customer/invoices?limit=1`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    const listData = await listResponse.json();
    
    if (!listData.data || listData.data.length === 0) {
      logTest('Get Invoice Detail', true, 'No invoices to test (expected)');
      return true;
    }

    const invoiceId = listData.data[0].id;
    
    const response = await fetch(`${API_BASE}/customer/invoices/${invoiceId}`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.id === invoiceId) {
      logTest('Get Invoice Detail', true);
      return true;
    } else {
      logTest('Get Invoice Detail', false, 'Invalid invoice detail');
      return false;
    }
  } catch (error) {
    logTest('Get Invoice Detail', false, error.message);
    return false;
  }
}

// Test 8: Get Available Packages
async function testGetPackages() {
  try {
    const response = await fetch(`${API_BASE}/customer/packages`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });

    const data = await response.json();
    
    if (response.ok && Array.isArray(data)) {
      logTest('Get Available Packages', true);
      return true;
    } else {
      logTest('Get Available Packages', false, 'Invalid packages data');
      return false;
    }
  } catch (error) {
    logTest('Get Available Packages', false, error.message);
    return false;
  }
}

// Test 9: Get Current Package
async function testGetCurrentPackage() {
  try {
    const response = await fetch(`${API_BASE}/customer/package/current`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });

    // Handle null response (customer might not have a package)
    if (response.status === 204 || response.status === 200) {
      try {
        const text = await response.text();
        if (!text || text === 'null') {
          logTest('Get Current Package', true, 'No package assigned (expected)');
          return true;
        }
        const data = JSON.parse(text);
        logTest('Get Current Package', true);
        return true;
      } catch (e) {
        logTest('Get Current Package', true, 'No package assigned (expected)');
        return true;
      }
    } else {
      logTest('Get Current Package', false, `Unexpected status ${response.status}`);
      return false;
    }
  } catch (error) {
    logTest('Get Current Package', false, error.message);
    return false;
  }
}

// Test 10: Get Tickets List
async function testGetTickets() {
  try {
    const response = await fetch(`${API_BASE}/customer/tickets?page=1&limit=10`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.data && data.pagination) {
      logTest('Get Tickets List', true);
      return true;
    } else {
      logTest('Get Tickets List', false, 'Invalid tickets data structure');
      return false;
    }
  } catch (error) {
    logTest('Get Tickets List', false, error.message);
    return false;
  }
}

// Test 11: Create Ticket
async function testCreateTicket() {
  try {
    const response = await fetch(`${API_BASE}/customer/tickets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${customerToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Test Ticket - Internet Slow',
        description: 'My internet connection is very slow. Please help.',
        priority: 'medium'
      })
    });

    const data = await response.json();
    
    if (response.ok && data.ticketNumber) {
      logTest('Create Ticket', true);
      return data.id;
    } else {
      logTest('Create Ticket', false, 'Ticket not created');
      return null;
    }
  } catch (error) {
    logTest('Create Ticket', false, error.message);
    return null;
  }
}

// Test 12: Get Ticket Detail
async function testGetTicketDetail(ticketId) {
  try {
    if (!ticketId) {
      // Try to get from list
      const listResponse = await fetch(`${API_BASE}/customer/tickets?limit=1`, {
        headers: { 'Authorization': `Bearer ${customerToken}` }
      });
      const listData = await listResponse.json();
      
      if (!listData.data || listData.data.length === 0) {
        logTest('Get Ticket Detail', true, 'No tickets to test (expected)');
        return true;
      }
      ticketId = listData.data[0].id;
    }

    const response = await fetch(`${API_BASE}/customer/tickets/${ticketId}`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.id === ticketId) {
      logTest('Get Ticket Detail', true);
      return true;
    } else {
      logTest('Get Ticket Detail', false, 'Invalid ticket detail');
      return false;
    }
  } catch (error) {
    logTest('Get Ticket Detail', false, error.message);
    return false;
  }
}

// Test 13: Get Tickets with Status Filter
async function testGetTicketsWithFilter() {
  try {
    const response = await fetch(`${API_BASE}/customer/tickets?status=open`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.data) {
      logTest('Get Tickets with Filter', true);
      return true;
    } else {
      logTest('Get Tickets with Filter', false, 'Filter not working');
      return false;
    }
  } catch (error) {
    logTest('Get Tickets with Filter', false, error.message);
    return false;
  }
}

// Test 14: Unauthorized Access (no token)
async function testUnauthorizedAccess() {
  try {
    const response = await fetch(`${API_BASE}/customer/dashboard`);
    
    if (response.status === 401) {
      logTest('Unauthorized Access Check', true);
      return true;
    } else {
      logTest('Unauthorized Access Check', false, 'Should return 401 without token');
      return false;
    }
  } catch (error) {
    logTest('Unauthorized Access Check', false, error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n🧪 FASE 1 - Customer Features Test Suite');
  console.log('=========================================\n');

  // Authentication
  console.log('📝 Authentication Tests:');
  const loginSuccess = await testCustomerLogin();
  if (!loginSuccess) {
    console.log('\n❌ Login failed. Cannot proceed with other tests.\n');
    return;
  }

  // Dashboard
  console.log('\n📊 Dashboard Tests:');
  await testGetDashboard();

  // Profile
  console.log('\n👤 Profile Tests:');
  await testGetProfile();
  await testUpdateProfile();

  // Invoices
  console.log('\n💰 Invoice Tests:');
  await testGetInvoices();
  await testGetInvoicesWithFilter();
  await testGetInvoiceDetail();

  // Packages
  console.log('\n📦 Package Tests:');
  await testGetPackages();
  await testGetCurrentPackage();

  // Tickets
  console.log('\n🎫 Ticket Tests:');
  await testGetTickets();
  const ticketId = await testCreateTicket();
  await testGetTicketDetail(ticketId);
  await testGetTicketsWithFilter();

  // Authorization
  console.log('\n🔒 Authorization Tests:');
  await testUnauthorizedAccess();

  // Summary
  console.log('\n=========================================');
  console.log('📊 Test Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / testResults.tests.length) * 100).toFixed(1)}%`);
  console.log('=========================================\n');

  if (testResults.failed > 0) {
    console.log('❌ Failed Tests:');
    testResults.tests.filter(t => !t.passed).forEach(t => {
      console.log(`   - ${t.name}: ${t.message}`);
    });
    console.log('');
  }

  console.log('✨ FASE 1 Customer Features: ' + (testResults.failed === 0 ? 'ALL TESTS PASSED! 🎉' : 'SOME TESTS FAILED'));
  console.log('');
}

// Execute tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
