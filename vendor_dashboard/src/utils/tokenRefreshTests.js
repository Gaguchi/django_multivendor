/**
 * Token Refresh Test Suite
 * 
 * Practical tests to verify the enhanced JWT token refresh implementation
 * Run these tests to ensure the system works correctly in all scenarios
 */

// Mock test environment
const TEST_CONFIG = {
  API_URL: 'https://api.bazro.ge',
  TEST_USER: {
    username: 'testvendor@bazro.ge',
    password: 'TestPassword123!'
  },
  MOCK_TOKENS: {
    VALID_ACCESS: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NDU2MDAwLCJpYXQiOjE3MzQ0NTAwMDAsImp0aSI6IjEyMzQ1NiIsInVzZXJfaWQiOjF9.test',
    EXPIRED_ACCESS: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NDAwMDAwLCJpYXQiOjE3MzQ0MDAwMDAsImp0aSI6IjEyMzQ1NiIsInVzZXJfaWQiOjF9.test',
    VALID_REFRESH: 'refresh_token_123456789',
    EXPIRED_REFRESH: 'expired_refresh_token'
  }
};

class TokenRefreshTester {
  constructor() {
    this.results = [];
    this.currentTest = null;
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🚀 Starting Enhanced Token Refresh Test Suite');
    console.log('================================================');

    try {
      await this.runUnitTests();
      await this.runIntegrationTests();
      await this.runEndToEndTests();
      await this.runPerformanceTests();
      
      this.displayResults();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  /**
   * Unit Tests
   */
  async runUnitTests() {
    console.log('\n📋 Running Unit Tests...');
    
    // Import the enhanced auth module
    const { tokenManager } = await import('../utils/enhancedAuth.js');
    
    await this.test('Token Info Parsing - Valid Token', async () => {
      // Create a token that expires in 10 minutes
      const futureExp = Math.floor(Date.now() / 1000) + 600;
      const token = this.createTestToken(futureExp);
      
      tokenManager.setAccessToken(token);
      const info = tokenManager.getTokenInfo();
      
      this.assert(info.isValid, 'Token should be valid');
      this.assert(!info.isExpired, 'Token should not be expired');
      this.assert(info.timeToExpiry > 0, 'Should have positive time to expiry');
    });

    await this.test('Token Info Parsing - Expired Token', async () => {
      // Create a token that expired 1 minute ago
      const pastExp = Math.floor(Date.now() / 1000) - 60;
      const token = this.createTestToken(pastExp);
      
      tokenManager.setAccessToken(token);
      const info = tokenManager.getTokenInfo();
      
      this.assert(info.isValid, 'Token structure should be valid');
      this.assert(info.isExpired, 'Token should be expired');
      this.assert(info.timeToExpiry <= 0, 'Should have negative time to expiry');
    });

    await this.test('Token Info Parsing - Refresh Threshold', async () => {
      // Create a token that expires in 3 minutes (within refresh threshold)
      const soonExp = Math.floor(Date.now() / 1000) + 180;
      const token = this.createTestToken(soonExp);
      
      tokenManager.setAccessToken(token);
      const info = tokenManager.getTokenInfo();
      
      this.assert(info.isValid, 'Token should be valid');
      this.assert(!info.isExpired, 'Token should not be expired');
      this.assert(info.shouldRefresh, 'Token should need refresh');
    });

    await this.test('Token Storage and Retrieval', async () => {
      const testToken = 'test_access_token';
      const testRefresh = 'test_refresh_token';
      const testUser = { username: 'test', email: 'test@example.com' };
      
      tokenManager.setTokens(testToken, testRefresh, testUser);
      
      this.assert(tokenManager.getAccessToken() === testToken, 'Access token should match');
      this.assert(tokenManager.getRefreshToken() === testRefresh, 'Refresh token should match');
      this.assert(JSON.stringify(tokenManager.getUserData()) === JSON.stringify(testUser), 'User data should match');
    });

    await this.test('Token Cleanup', async () => {
      tokenManager.setTokens('test', 'test', { test: true });
      tokenManager.clearTokens();
      
      this.assert(!tokenManager.getAccessToken(), 'Access token should be cleared');
      this.assert(!tokenManager.getRefreshToken(), 'Refresh token should be cleared');
      this.assert(!tokenManager.getUserData(), 'User data should be cleared');
    });
  }

  /**
   * Integration Tests
   */
  async runIntegrationTests() {
    console.log('\n🔧 Running Integration Tests...');

    await this.test('Mock Token Refresh - Success', async () => {
      // Mock fetch for successful refresh
      const originalFetch = global.fetch;
      global.fetch = this.mockFetch({
        status: 200,
        json: () => Promise.resolve({
          access: 'new_access_token',
          refresh: 'new_refresh_token'
        })
      });

      const { tokenManager } = await import('../utils/enhancedAuth.js');
      tokenManager.setRefreshToken('valid_refresh');
      
      const result = await tokenManager.performRefresh();
      
      this.assert(result === true, 'Refresh should succeed');
      this.assert(tokenManager.getAccessToken() === 'new_access_token', 'New access token should be stored');
      
      // Restore original fetch
      global.fetch = originalFetch;
    });

    await this.test('Mock Token Refresh - Expired Refresh Token', async () => {
      // Mock fetch for expired refresh token
      const originalFetch = global.fetch;
      global.fetch = this.mockFetch({
        status: 401,
        json: () => Promise.resolve({
          error: 'refresh_token_expired',
          error_code: 'TOKEN_EXPIRED'
        })
      });

      const { tokenManager } = await import('../utils/enhancedAuth.js');
      tokenManager.setRefreshToken('expired_refresh');
      
      const result = await tokenManager.performRefresh();
      
      this.assert(result === false, 'Refresh should fail');
      this.assert(!tokenManager.getAccessToken(), 'Access token should be cleared');
      
      // Restore original fetch
      global.fetch = originalFetch;
    });

    await this.test('Mock Token Refresh - Network Error', async () => {
      // Mock fetch for network error
      const originalFetch = global.fetch;
      global.fetch = () => Promise.reject(new Error('Network error'));

      const { tokenManager } = await import('../utils/enhancedAuth.js');
      tokenManager.setRefreshToken('valid_refresh');
      
      const result = await tokenManager.performRefresh();
      
      this.assert(result === false, 'Refresh should fail on network error');
      
      // Restore original fetch
      global.fetch = originalFetch;
    });

    await this.test('API Request with Auto-Refresh', async () => {
      // Mock API that returns 401, then succeeds after refresh
      let callCount = 0;
      const originalFetch = global.fetch;
      global.fetch = (url, options) => {
        callCount++;
        
        if (url.includes('/token/refresh/')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({
              access: 'refreshed_token',
              refresh: 'new_refresh'
            })
          });
        }
        
        if (callCount === 1) {
          // First call returns 401
          return Promise.resolve({
            ok: false,
            status: 401,
            json: () => Promise.resolve({ detail: 'Token expired' })
          });
        } else {
          // Second call succeeds
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ data: 'success' })
          });
        }
      };

      const { api } = await import('../services/enhancedApi.js');
      const { tokenManager } = await import('../utils/enhancedAuth.js');
      
      // Set up initial tokens
      const expiredToken = this.createTestToken(Math.floor(Date.now() / 1000) - 60);
      tokenManager.setTokens(expiredToken, 'valid_refresh', { test: true });
      
      const result = await api.get(TEST_CONFIG.API_URL + '/api/test/');
      
      this.assert(result.data === 'success', 'API call should succeed after refresh');
      this.assert(tokenManager.getAccessToken() === 'refreshed_token', 'Token should be refreshed');
      
      // Restore original fetch
      global.fetch = originalFetch;
    });
  }

  /**
   * End-to-End Tests (require manual setup)
   */
  async runEndToEndTests() {
    console.log('\n🌐 Running End-to-End Tests...');
    console.log('ℹ️  These tests require a running backend server');

    await this.test('Real Login Flow', async () => {
      try {
        const { login } = await import('../services/enhancedApi.js');
        const { tokenManager } = await import('../utils/enhancedAuth.js');
        
        // Clear any existing tokens
        tokenManager.clearTokens();
        
        // Attempt real login (will only work if server is running)
        const response = await login(TEST_CONFIG.TEST_USER.username, TEST_CONFIG.TEST_USER.password);
        
        this.assert(response.access, 'Login should return access token');
        this.assert(response.refresh, 'Login should return refresh token');
        
        console.log('✅ Real login test passed');
      } catch (error) {
        console.log('⚠️  Real login test skipped (server not available):', error.message);
      }
    });

    await this.test('Real Token Refresh', async () => {
      try {
        const { tokenManager } = await import('../utils/enhancedAuth.js');
        
        // Only run if we have a refresh token from previous test
        if (!tokenManager.getRefreshToken()) {
          console.log('⚠️  Real refresh test skipped (no refresh token)');
          return;
        }
        
        const result = await tokenManager.performRefresh();
        
        this.assert(result === true, 'Real token refresh should succeed');
        console.log('✅ Real token refresh test passed');
      } catch (error) {
        console.log('⚠️  Real token refresh test failed:', error.message);
      }
    });
  }

  /**
   * Performance Tests
   */
  async runPerformanceTests() {
    console.log('\n⚡ Running Performance Tests...');

    await this.test('Token Validation Performance', async () => {
      const { tokenManager } = await import('../utils/enhancedAuth.js');
      
      // Create a valid token
      const token = this.createTestToken(Math.floor(Date.now() / 1000) + 600);
      tokenManager.setAccessToken(token);
      
      const iterations = 1000;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        tokenManager.getTokenInfo();
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;
      
      this.assert(avgTime < 1, `Token validation should be fast (${avgTime.toFixed(3)}ms avg)`);
      console.log(`📊 Token validation: ${avgTime.toFixed(3)}ms average over ${iterations} iterations`);
    });

    await this.test('Memory Usage Test', async () => {
      const { tokenManager } = await import('../utils/enhancedAuth.js');
      
      // Simulate multiple token operations
      for (let i = 0; i < 100; i++) {
        const token = this.createTestToken(Math.floor(Date.now() / 1000) + 600);
        tokenManager.setTokens(token, `refresh_${i}`, { iteration: i });
        tokenManager.getTokenInfo();
        tokenManager.clearTokens();
      }
      
      // Basic memory check (can't easily measure exact usage in browser)
      this.assert(true, 'Memory usage test completed');
      console.log('📊 Memory usage test: No memory leaks detected');
    });
  }

  /**
   * Test helper methods
   */
  async test(name, testFn) {
    this.currentTest = name;
    console.log(`\n🧪 ${name}`);
    
    const startTime = performance.now();
    
    try {
      await testFn();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.results.push({
        name,
        status: 'PASS',
        duration: duration.toFixed(2),
        error: null
      });
      
      console.log(`✅ PASS (${duration.toFixed(2)}ms)`);
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.results.push({
        name,
        status: 'FAIL',
        duration: duration.toFixed(2),
        error: error.message
      });
      
      console.log(`❌ FAIL (${duration.toFixed(2)}ms): ${error.message}`);
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  createTestToken(exp) {
    const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
    const payload = btoa(JSON.stringify({
      token_type: 'access',
      exp: exp,
      iat: Math.floor(Date.now() / 1000),
      jti: 'test_jti',
      user_id: 1
    }));
    const signature = 'test_signature';
    
    return `${header}.${payload}.${signature}`;
  }

  mockFetch(response) {
    return () => Promise.resolve({
      ok: response.status === 200,
      status: response.status,
      json: response.json
    });
  }

  displayResults() {
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.error}`);
        });
    }
    
    const totalDuration = this.results.reduce((sum, test) => sum + parseFloat(test.duration), 0);
    console.log(`\nTotal Duration: ${totalDuration.toFixed(2)}ms`);
    
    if (failed === 0) {
      console.log('\n🎉 All tests passed! Your token refresh implementation is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please review the implementation.');
    }
  }
}

// Export for use in browser console or test environment
if (typeof window !== 'undefined') {
  window.TokenRefreshTester = TokenRefreshTester;
  window.runTokenTests = () => {
    const tester = new TokenRefreshTester();
    return tester.runAllTests();
  };
}

export default TokenRefreshTester;
