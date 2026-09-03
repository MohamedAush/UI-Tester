/**
 * Jest Configuration
 * Test framework configuration
 */

module.exports = {
  testEnvironment: 'node',
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
