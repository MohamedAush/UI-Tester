#!/usr/bin/env node

/**
 * Test Runner
 * Main entry point for running tests
 */

const jest = require('jest');
const path = require('path');

async function runTests() {
  const argv = process.argv.slice(2);

  // Default configuration
  const config = {
    config: path.join(__dirname, 'jest.config.js'),
    verbose: true,
  };

  // Add any additional CLI arguments
  const finalArgs = Object.keys(config).reduce((args, key) => {
    if (typeof config[key] === 'boolean') {
      if (config[key]) {
        args.push(`--${key}`);
      }
    } else {
      args.push(`--${key}`, config[key]);
    }
    return args;
  }, [...argv]);

  try {
    console.log('🧪 Starting UI Testing Tool...\n');
    console.log('📋 Configuration:');
    console.log(`   Base URL: ${process.env.BASE_URL || 'http://localhost:3000'}`);
    console.log(`   Headless: ${process.env.HEADLESS !== 'false'}`);
    console.log(`   Slow Motion: ${process.env.SLOW_MO || '0'}ms`);
    console.log(`   Viewport: 1280x720\n`);

    const result = await jest.run(finalArgs);

    if (result === 0) {
      console.log('\n✅ All tests passed!');
    } else {
      console.log('\n❌ Some tests failed.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Test runner error:', error);
    process.exit(1);
  }
}

runTests();
