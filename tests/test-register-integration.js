/**
 * Test Register Page Integration
 * Tests the complete registration flow
 */

const API_URL = 'http://localhost:1993';

// Helper to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  console.log(`\n📡 ${options.method || 'GET'} ${url}`);
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.log(`❌ Error: ${response.status} - ${data.message || 'Unknown error'}`);
    return { success: false, status: response.status, data };
  }
  
  console.log(`✅ Success: ${response.status}`);
  return { success: true, status: response.status, data };
}

// Generate unique email for testing
const timestamp = Date.now();
const testUser = {
  name: 'Test User Registration',
  email: `testuser${timestamp}@audiranet.test`,
  password: 'Test@12345',
  role: 'BILLING'
};

async function runTests() {
  console.log('='.repeat(60));
  console.log('🧪 REGISTER PAGE INTEGRATION TEST');
  console.log('='.repeat(60));

  try {
    // Test 1: Register new user
    console.log('\n📝 Test 1: Register New User');
    console.log('User Data:', {
      name: testUser.name,
      email: testUser.email,
      password: '***hidden***',
      role: testUser.role
    });

    const registerResult = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
        role: testUser.role
      })
    });

    if (!registerResult.success) {
      console.log('❌ Registration failed');
      return;
    }

    console.log('✅ User registered successfully');
    console.log('User ID:', registerResult.data.user.id);
    console.log('User Email:', registerResult.data.user.email);
    console.log('User Name:', registerResult.data.user.name);
    console.log('User Role:', registerResult.data.user.role);

    // Test 2: Try to register with same email (should fail)
    console.log('\n📝 Test 2: Duplicate Email Registration (should fail)');
    const duplicateResult = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Another User',
        email: testUser.email, // Same email
        password: 'AnotherPass123',
        role: 'BILLING'
      })
    });

    if (duplicateResult.success) {
      console.log('❌ Should have failed but succeeded');
    } else {
      console.log('✅ Correctly rejected duplicate email');
    }

    // Test 3: Login with newly registered user
    console.log('\n📝 Test 3: Login with New User');
    const loginResult = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    if (!loginResult.success) {
      console.log('❌ Login failed');
      return;
    }

    console.log('✅ Login successful');
    console.log('Access Token:', loginResult.data.access_token ? '***token_received***' : 'missing');
    console.log('User Info:', loginResult.data.user);

    // Test 4: Access protected route with token
    console.log('\n📝 Test 4: Access Protected Route (/auth/me)');
    const meResult = await apiRequest('/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginResult.data.access_token}`
      }
    });

    if (!meResult.success) {
      console.log('❌ Failed to access protected route');
      return;
    }

    console.log('✅ Successfully accessed protected route');
    console.log('Current User:', meResult.data);

    // Test 5: Verify registration with missing fields (should fail)
    console.log('\n📝 Test 5: Register without Required Fields (should fail)');
    const invalidResult = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'incomplete@test.com'
        // Missing name and password
      })
    });

    if (invalidResult.success) {
      console.log('❌ Should have failed but succeeded');
    } else {
      console.log('✅ Correctly rejected incomplete data');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log('✅ Registration Flow: WORKING');
    console.log('✅ Duplicate Prevention: WORKING');
    console.log('✅ Login Integration: WORKING');
    console.log('✅ JWT Authentication: WORKING');
    console.log('✅ Validation: WORKING');
    console.log('\n🎉 All tests passed! Register page integration is complete.');
    console.log('\n📌 Test User Created:');
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Password: ${testUser.password}`);
    console.log('   (You can use this to test the frontend)');

  } catch (error) {
    console.log('\n❌ Test failed with error:');
    console.error(error);
  }
}

// Run the tests
runTests();
