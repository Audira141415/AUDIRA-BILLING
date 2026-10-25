const API_BASE_URL = process.env.API_URL || 'http://localhost:3218';

async function testServiceManagement() {
  console.log('='.repeat(80));
  console.log('TEST SERVICE MANAGEMENT API');
  console.log('='.repeat(80));
  console.log('');

  let token;

  try {
    // 1. Login
    console.log('1. Testing Login...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@audira.net',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    token = loginData.access_token || loginData.token;
    console.log('✅ Login successful');
    console.log(`   Token: ${token.substring(0, 20)}...`);
    console.log('');

    // 2. Get Service Statistics
    console.log('2. Testing Get Service Statistics...');
    const statsResponse = await fetch(`${API_BASE_URL}/services/statistics/overview`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!statsResponse.ok) {
      throw new Error(`Get statistics failed: ${statsResponse.status}`);
    }

    const statsData = await statsResponse.json();
    console.log('✅ Statistics retrieved successfully:');
    console.log(`   Total Services: ${statsData.total}`);
    console.log(`   Active: ${statsData.active}`);
    console.log(`   Inactive: ${statsData.inactive}`);
    console.log(`   Suspended: ${statsData.suspended}`);
    console.log(`   PPPoE: ${statsData.pppoeCount}`);
    console.log(`   Hotspot: ${statsData.hotspotCount}`);
    console.log('');

    // 3. Get List of Services
    console.log('3. Testing Get List of Services...');
    const servicesResponse = await fetch(`${API_BASE_URL}/services?page=1&limit=5`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!servicesResponse.ok) {
      throw new Error(`Get services failed: ${servicesResponse.status}`);
    }

    const servicesData = await servicesResponse.json();
    console.log('✅ Services list retrieved successfully:');
    console.log(`   Total: ${servicesData.pagination.total}`);
    console.log(`   Current Page: ${servicesData.pagination.currentPage}`);
    console.log(`   Services on this page: ${servicesData.data.length}`);
    if (servicesData.data.length > 0) {
      console.log('   First service:');
      console.log(`     - Name: ${servicesData.data[0].name}`);
      console.log(`     - Type: ${servicesData.data[0].type}`);
      console.log(`     - Username: ${servicesData.data[0].username}`);
      console.log(`     - Status: ${servicesData.data[0].status}`);
      console.log(`     - Customer: ${servicesData.data[0].customer.name}`);
      if (servicesData.data[0].package) {
        console.log(`     - Package: ${servicesData.data[0].package.name}`);
      }
    }
    console.log('');

    // 4. Test Filter by Type
    console.log('4. Testing Filter by Type (PPPoE)...');
    const pppoeResponse = await fetch(`${API_BASE_URL}/services?type=pppoe&limit=3`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!pppoeResponse.ok) {
      throw new Error(`Filter by type failed: ${pppoeResponse.status}`);
    }

    const pppoeData = await pppoeResponse.json();
    console.log('✅ PPPoE services retrieved:');
    console.log(`   Found ${pppoeData.pagination.total} PPPoE services`);
    console.log('');

    // 5. Test Filter by Status
    console.log('5. Testing Filter by Status (Active)...');
    const activeResponse = await fetch(`${API_BASE_URL}/services?status=active&limit=3`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!activeResponse.ok) {
      throw new Error(`Filter by status failed: ${activeResponse.status}`);
    }

    const activeData = await activeResponse.json();
    console.log('✅ Active services retrieved:');
    console.log(`   Found ${activeData.pagination.total} active services`);
    console.log('');

    // 6. Test Search
    console.log('6. Testing Search functionality...');
    const searchResponse = await fetch(`${API_BASE_URL}/services?search=test&limit=3`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!searchResponse.ok) {
      throw new Error(`Search failed: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    console.log('✅ Search completed:');
    console.log(`   Found ${searchData.pagination.total} services matching "test"`);
    console.log('');

    // 7. Get Customers (for create test)
    console.log('7. Getting customers for create test...');
    const customersResponse = await fetch(`${API_BASE_URL}/admin/customers?limit=1`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!customersResponse.ok) {
      throw new Error(`Get customers failed: ${customersResponse.status}`);
    }

    const customersData = await customersResponse.json();
    if (customersData.data.length === 0) {
      console.log('⚠️  No customers found, skipping create test');
    } else {
      const testCustomer = customersData.data[0];
      console.log(`✅ Found customer: ${testCustomer.name}`);
      console.log('');

      // 8. Create Service
      console.log('8. Testing Create Service...');
      const createResponse = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: `Test Service ${Date.now()}`,
          type: 'pppoe',
          username: `testuser${Date.now()}`,
          password: 'testpassword123',
          description: 'Test service created by automated test',
          customerId: testCustomer.id,
          status: 'active'
        })
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(`Create service failed: ${createResponse.status} - ${errorData.message}`);
      }

      const createData = await createResponse.json();
      console.log('✅ Service created successfully:');
      console.log(`   ID: ${createData.id}`);
      console.log(`   Name: ${createData.name}`);
      console.log(`   Username: ${createData.username}`);
      console.log(`   Type: ${createData.type}`);
      console.log('');

      // 9. Get Service Detail
      console.log('9. Testing Get Service Detail...');
      const detailResponse = await fetch(`${API_BASE_URL}/services/${createData.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!detailResponse.ok) {
        throw new Error(`Get service detail failed: ${detailResponse.status}`);
      }

      const detailData = await detailResponse.json();
      console.log('✅ Service detail retrieved:');
      console.log(`   Name: ${detailData.name}`);
      console.log(`   Type: ${detailData.type}`);
      console.log(`   Username: ${detailData.username}`);
      console.log(`   Customer: ${detailData.customer.name} (${detailData.customer.email})`);
      console.log('');

      // 10. Update Service
      console.log('10. Testing Update Service...');
      const updateResponse = await fetch(`${API_BASE_URL}/services/${createData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description: 'Updated by automated test',
          status: 'active'
        })
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(`Update service failed: ${updateResponse.status} - ${errorData.message}`);
      }

      const updateData = await updateResponse.json();
      console.log('✅ Service updated successfully:');
      console.log(`   Description: ${updateData.description}`);
      console.log('');

      // 11. Delete Service
      console.log('11. Testing Delete Service (Soft Delete)...');
      const deleteResponse = await fetch(`${API_BASE_URL}/services/${createData.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!deleteResponse.ok) {
        throw new Error(`Delete service failed: ${deleteResponse.status}`);
      }

      const deleteData = await deleteResponse.json();
      console.log('✅ Service deleted successfully (status set to inactive)');
      console.log('');
    }

    // 12. Get Services by Customer
    if (customersData.data.length > 0) {
      const testCustomer = customersData.data[0];
      console.log(`12. Testing Get Services by Customer (${testCustomer.name})...`);
      const customerServicesResponse = await fetch(
        `${API_BASE_URL}/services/customer/${testCustomer.id}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!customerServicesResponse.ok) {
        throw new Error(`Get customer services failed: ${customerServicesResponse.status}`);
      }

      const customerServicesData = await customerServicesResponse.json();
      console.log('✅ Customer services retrieved:');
      console.log(`   Found ${customerServicesData.length} services for this customer`);
      console.log('');
    }

    // Summary
    console.log('='.repeat(80));
    console.log('TEST SUMMARY: ALL TESTS PASSED ✅');
    console.log('='.repeat(80));
    console.log('');
    console.log('Service Management API endpoints tested:');
    console.log('  ✅ POST /auth/login');
    console.log('  ✅ GET /services/statistics/overview');
    console.log('  ✅ GET /services (with pagination)');
    console.log('  ✅ GET /services?type=pppoe (filter by type)');
    console.log('  ✅ GET /services?status=active (filter by status)');
    console.log('  ✅ GET /services?search=test (search)');
    console.log('  ✅ POST /services (create)');
    console.log('  ✅ GET /services/:id (detail)');
    console.log('  ✅ PUT /services/:id (update)');
    console.log('  ✅ DELETE /services/:id (soft delete)');
    console.log('  ✅ GET /services/customer/:customerId');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ TEST FAILED:');
    console.error(`   ${error.message}`);
    console.error('');
    process.exit(1);
  }
}

testServiceManagement();
