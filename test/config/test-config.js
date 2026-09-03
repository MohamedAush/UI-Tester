/**
 * Test Configuration
 * Centralized test configuration and utilities
 */

class TestConfig {
  /**
   * Get test data for login
   */
  static getLoginCredentials() {
    return {
      valid: {
        email: 'user@example.com',
        password: 'password123',
      },
      invalid: {
        email: 'invalid-email',
        password: 'wrongpassword',
      },
      empty: {
        email: '',
        password: '',
      },
    };
  }

  /**
   * Get test data for dashboard
   */
  static getDashboardTestData() {
    return {
      searchQueries: ['test', 'example', 'dashboard'],
      items: [
        { name: 'Item 1', description: 'First test item' },
        { name: 'Item 2', description: 'Second test item' },
      ],
    };
  }

  /**
   * Get performance benchmarks
   */
  static getPerformanceBenchmarks() {
    return {
      pageLoad: 5000, // 5 seconds
      interaction: 2000, // 2 seconds
      formSubmit: 3000, // 3 seconds
    };
  }

  /**
   * Get browser list for cross-browser testing
   */
  static getBrowsers() {
    return ['chrome', 'firefox', 'webkit'];
  }

  /**
   * Get device list for responsive testing
   */
  static getDevices() {
    return ['desktop', 'mobile', 'tablet'];
  }

  /**
   * Retry configuration
   */
  static getRetryConfig() {
    return {
      maxRetries: 2,
      retryDelay: 1000, // 1 second
    };
  }
}

module.exports = TestConfig;
