/**
 * Jest Configuration
 * Test framework configuration
 */

module.exports = {
  testEnvironment: '<rootDir>/test/environment/puppeteer-failure-environment.js',
  reporters: ['default', '<rootDir>/test/reporters/dashboard-reporter.js'],
  testMatch: ['**/test/specs/**/*.spec.js'],
  testTimeout: 60000,
  forceExit: true,
  detectOpenHandles: false,
  verbose: true,
  collectCoverage: false,
  coverageDirectory: './test/coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['js', 'json'],
  globals: {
    TEST_TIMEOUT: 60000,
  },
};
