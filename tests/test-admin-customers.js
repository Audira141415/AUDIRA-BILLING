const API_BASE = process.env.API_URL || 'http://localhost:3218';

// Test configuration
const adminUser = {
  email: 'admin@audira.net',
  password: 'admin123'
};

let adminToken = '';
let createdCustomerId = '';
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

// Test 1: Admin Login
async function testAdminLogin() {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminUser)
    });

    const data = await response.json();
    console.log('Login response:', data); // Debug
    
    // Check if we got access_token regardless of response.ok status
    if (data.access_token) {
      adminToken = data.access_token;
      logTest('Admin Login', true);
      return true;
    } else {
      logTest('Admin Login', false, `Status ${response.status}: ${data.message || JSON.stringify(data)}`);
      return false;
    }
  } catch (error) {
    logTest('Admin Login', false, error.message);
    return false;
  }
}

// Test 2: Get Customer Statistics
async function testGetStatistics() {
  try {
    const response = await fetch(`${API_BASE}/admin/customers/statistics/overview`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    const data = await response.json();
    
    if (response.ok && typeof data.total === 'number') {
      logTest('Get Customer Statistics', true);
      return true;
    } else {
      logTest('Get Customer Statistics', false, 'Invalid statistics data');
      return false;
    }
  } catch (error) {
    logTest('Get Customer Statistics', false, error.message);
    return false;
  }
}

// Test 3: Get Customers List (with pagination)
async function testGetCustomers() {
  try {
    const response = await fetch(`${API_BASE}/admin/customers?page=1&limit=10`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.data && data.pagination) {
      logTest('Get Customers List', true);
      return true;
    } else {
      logTest('Get Customers List', false, 'Invalid customers data structure');
      return false;
    }
  } catch (error) {
    logTest('Get Customers List', false, error.message);
    return false;
  }
}

// Test 4: Search Customers
async function testSearchCustomers() {
  try {
    const response = await fetch(`${API_BASE}/admin/customers?search=customer`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.data) {
      logTest('Search Customers', true);
      return true;
    } else {
      logTest('Search Customers', false, 'Search not working');
      return false;
    }
  } catch (error) {
    logTest('Search Customers', false, error.message);
    return false;
  }
}

// Test 5: Filter Customers by Status
async function testFilterByStatus() {
  try {
    const response = await fetch(`${API_BASE}/admin/customers?status=active`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.data) {
      logTest('Filter Customers by Status', true);
      return true;
    } else {
      logTest('Filter Customers by Status', false, 'Filter not working');
      return false;
    }
  } catch (error) {
    logTest('Filter Customers by Status', false, error.message);
    return false;
  }
}

// Test 6: Create Customer
async function testCreateCustomer() {
  try {
    const timestamp = Date.now();
    const response = await fetch(`${API_BASE}/admin/customers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `Test Customer ${timestamp}`,
        email: `test${timestamp}@example.com`,
        phone: '08123456789',
        address: 'Jl. Test No. 123',
        internetNumber: `INT-${timestamp}`,
        ipAddress: '192.168.1.100',
        installedModem: 'ONT Huawei',
        status: 'active'
      })
    });

    const data = await response.json();
    
    if (response.ok && data.id) {
      createdCustomerId = data.id;
      logTest('Create Customer', true);
      return true;
    } else {
      logTest('Create Customer', false, data.message || 'Customer not created');
      return false;
    }
  } catch (error) {
    logTest('Create Customer', false, error.message);
    return false;
  }
}

// Test 7: Get Customer Detail
async function testGetCustomerDetail() {
  try {
    if (!createdCustomerId) {
      // Get first customer from list
      const listResponse = await fetch(`${API_BASE}/admin/customers?limit=1`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const listData = await listResponse.json();
      
      if (!listData.data || listData.data.length === 0) {
        logTest('Get Customer Detail', false, 'No customers to test');
        return false;
      }
      createdCustomerId = listData.data[0].id;
    }

    const response = await fetch(`${API_BASE}/admin/customers/${createdCustomerId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.customer && data.customer.id === createdCustomerId) {
      logTest('Get Customer Detail', true);
      return true;
    } else {
      logTest('Get Customer Detail', false, 'Invalid customer detail');
      return false;
    }
  } catch (error) {
    logTest('Get Customer Detail', false, error.message);
    return false;
  }
}

// Test 8: Update Customer
async function testUpdateCustomer() {
  try {
    if (!createdCustomerId) {
      logTest('Update Customer', false, 'No customer ID available');
      return false;
    }

    const response = await fetch(`${API_BASE}/admin/customers/${createdCustomerId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Customer Updated',
        phone: '08987654321',
        address: 'Jl. Updated No. 456'
      })
    });

    const data = await response.json();
    
    if (response.ok && data.name === 'Test Customer Updated') {
      logTest('Update Customer', true);
      return true;
    } else {
      logTest('Update Customer', false, 'Customer not updated');
      return false;
    }
  } catch (error) {
    logTest('Update Customer', false, error.message);
    return false;
  }
}

// Test 9: Delete Customer
async function testDeleteCustomer() {
  try {
    if (!createdCustomerId) {
      logTest('Delete Customer', false, 'No customer ID available');
      return false;
    }

    const response = await fetch(`${API_BASE}/admin/customers/${createdCustomerId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.message) {
      logTest('Delete Customer (Soft Delete)', true);
      return true;
    } else {
      logTest('Delete Customer (Soft Delete)', false, 'Customer not deleted');
      return false;
    }
  } catch (error) {
    logTest('Delete Customer (Soft Delete)', false, error.message);
    return false;
  }
}

// Test 10: Bulk Import (small test)
async function testBulkImport() {
  try {
    const timestamp = Date.now();
    const response = await fetch(`${API_BASE}/admin/customers/bulk-import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customers: [
          {
            name: `Bulk Customer 1 ${timestamp}`,
            email: `bulk1${timestamp}@example.com`,
            phone: '08111111111',
            address: 'Bulk Address 1',
            status: 'active'
          },
          {
            name: `Bulk Customer 2 ${timestamp}`,
            email: `bulk2${timestamp}@example.com`,
            phone: '08222222222',
            address: 'Bulk Address 2',
            status: 'active'
          }
        ]
      })
    });

    const data = await response.json();
    
    if (response.ok && data.success >= 0) {
      logTest('Bulk Import Customers', true);
      return true;
    } else {
      logTest('Bulk Import Customers', false, 'Bulk import failed');
      return false;
    }
  } catch (error) {
    logTest('Bulk Import Customers', false, error.message);
    return false;
  }
}

// Test 11: Sort Customers
async function testSortCustomers() {
  try {
    const response = await fetch(`${API_BASE}/admin/customers?sortBy=name&sortOrder=asc`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.data) {
      logTest('Sort Customers', true);
      return true;
    } else {
      logTest('Sort Customers', false, 'Sorting not working');
      return false;
    }
  } catch (error) {
    logTest('Sort Customers', false, error.message);
    return false;
  }
}

// Test 12: Unauthorized Access
async function testUnauthorizedAccess() {
  try {
    const response = await fetch(`${API_BASE}/admin/customers`);
    
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
  console.log('\n🧪 FASE 2 - Admin Customer Management Test Suite');
  console.log('===============================================\n');

  // Authentication
  console.log('📝 Authentication Tests:');
  const loginSuccess = await testAdminLogin();
  if (!loginSuccess) {
    console.log('\n❌ Admin login failed. Cannot proceed with other tests.\n');
    return;
  }

  // Statistics
  console.log('\n📊 Statistics Tests:');
  await testGetStatistics();

  // Customer Management (Read)
  console.log('\n👥 Customer Management (Read):');
  await testGetCustomers();
  await testSearchCustomers();
  await testFilterByStatus();
  await testSortCustomers();

  // Customer Management (CRUD)
  console.log('\n✏️ Customer Management (CRUD):');
  await testCreateCustomer();
  await testGetCustomerDetail();
  await testUpdateCustomer();
  await testDeleteCustomer();

  // Bulk Operations
  console.log('\n📦 Bulk Operations:');
  await testBulkImport();

  // Authorization
  console.log('\n🔒 Authorization Tests:');
  await testUnauthorizedAccess();

  // Summary
  console.log('\n===============================================');
  console.log('📊 Test Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / testResults.tests.length) * 100).toFixed(1)}%`);
  console.log('===============================================\n');

  if (testResults.failed > 0) {
    console.log('❌ Failed Tests:');
    testResults.tests.filter(t => !t.passed).forEach(t => {
      console.log(`   - ${t.name}: ${t.message}`);
    });
    console.log('');
  }

  console.log('✨ FASE 2 Admin Customer Management: ' + (testResults.failed === 0 ? 'ALL TESTS PASSED! 🎉' : 'SOME TESTS FAILED'));
  console.log('');
}

// Execute tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
