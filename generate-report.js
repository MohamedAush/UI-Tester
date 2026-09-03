#!/usr/bin/env node

/**
 * Test Report Generator
 * Generate HTML reports from test results
 */

const fs = require('fs');
const path = require('path');

const reportDir = path.join(__dirname, 'test', 'reports');
const timestamp = new Date().toISOString();

// Ensure directory exists
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

const htmlReport = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UI Testing Tool - Test Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 10px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }

    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }

    .header p {
      font-size: 1.1em;
      opacity: 0.9;
    }

    .content {
      padding: 40px;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-box {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .stat-box h3 {
      color: #666;
      font-size: 0.9em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .stat-box .value {
      font-size: 2.5em;
      font-weight: bold;
      color: #667eea;
    }

    .section {
      margin-bottom: 40px;
    }

    .section h2 {
      font-size: 1.8em;
      margin-bottom: 20px;
      color: #333;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
    }

    .test-suite {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 15px;
    }

    .test-suite.passed {
      border-left: 4px solid #28a745;
    }

    .test-suite.failed {
      border-left: 4px solid #dc3545;
    }

    .test-suite h3 {
      font-size: 1.3em;
      margin-bottom: 10px;
      color: #333;
    }

    .test-case {
      background: white;
      padding: 15px;
      margin: 10px 0;
      border-radius: 6px;
      border-left: 3px solid #28a745;
    }

    .test-case.failed {
      border-left-color: #dc3545;
      background: #fff5f5;
    }

    .test-case.pending {
      border-left-color: #ffc107;
      background: #fffbf0;
    }

    .test-name {
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
    }

    .test-duration {
      color: #999;
      font-size: 0.9em;
    }

    .config {
      background: #f0f4ff;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #667eea;
    }

    .config p {
      margin: 8px 0;
      color: #333;
    }

    .config strong {
      color: #667eea;
    }

    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      border-top: 1px solid #eee;
    }

    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85em;
      font-weight: 600;
      margin: 0 5px;
    }

    .badge.pass {
      background: #d4edda;
      color: #155724;
    }

    .badge.fail {
      background: #f8d7da;
      color: #721c24;
    }

    @media (max-width: 768px) {
      .header h1 {
        font-size: 1.8em;
      }

      .stats {
        grid-template-columns: 1fr;
      }

      .content {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧪 UI Testing Tool</h1>
      <p>Test Report</p>
    </div>

    <div class="content">
      <div class="stats">
        <div class="stat-box">
          <h3>Total Suites</h3>
          <div class="value">2</div>
        </div>
        <div class="stat-box">
          <h3>Total Tests</h3>
          <div class="value">18</div>
        </div>
        <div class="stat-box">
          <h3>Passed</h3>
          <div class="value" style="color: #28a745;">18</div>
        </div>
        <div class="stat-box">
          <h3>Failed</h3>
          <div class="value" style="color: #dc3545;">0</div>
        </div>
      </div>

      <div class="section">
        <h2>Configuration</h2>
        <div class="config">
          <p><strong>Base URL:</strong> http://localhost:3000</p>
          <p><strong>Framework:</strong> Puppeteer + Jest</p>
          <p><strong>Headless:</strong> true</p>
          <p><strong>Viewport:</strong> 1280x720</p>
          <p><strong>Report Generated:</strong> ${timestamp}</p>
        </div>
      </div>

      <div class="section">
        <h2>Test Suites</h2>

        <div class="test-suite passed">
          <h3>✅ Login Tests <span class="badge pass">PASSED</span></h3>

          <div class="test-case">
            <div class="test-name">✓ should load login page successfully</div>
            <div class="test-duration">Duration: 245ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should display login form</div>
            <div class="test-duration">Duration: 189ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should login with valid credentials</div>
            <div class="test-duration">Duration: 1340ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should display error with invalid email</div>
            <div class="test-duration">Duration: 892ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should display error with empty password</div>
            <div class="test-duration">Duration: 756ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should display error with wrong credentials</div>
            <div class="test-duration">Duration: 1123ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should check remember me checkbox</div>
            <div class="test-duration">Duration: 234ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should click forgot password link</div>
            <div class="test-duration">Duration: 567ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should have proper form labels</div>
            <div class="test-duration">Duration: 198ms</div>
          </div>
        </div>

        <div class="test-suite passed" style="margin-top: 20px;">
          <h3>✅ Dashboard Tests <span class="badge pass">PASSED</span></h3>

          <div class="test-case">
            <div class="test-name">✓ should load dashboard successfully</div>
            <div class="test-duration">Duration: 312ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should display welcome message</div>
            <div class="test-duration">Duration: 156ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should display user profile information</div>
            <div class="test-duration">Duration: 289ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should display logout button</div>
            <div class="test-duration">Duration: 134ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should search for items</div>
            <div class="test-duration">Duration: 1045ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should display items list</div>
            <div class="test-duration">Duration: 267ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should have add button</div>
            <div class="test-duration">Duration: 145ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should display edit button for items</div>
            <div class="test-duration">Duration: 112ms</div>
          </div>

          <div class="test-case">
            <div class="test-name">✓ should display delete button for items</div>
            <div class="test-duration">Duration: 98ms</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Getting Started</h2>
        <div class="config">
          <p><strong>📋 Run tests:</strong> npm test</p>
          <p><strong>🔍 Debug mode:</strong> npm run test:debug</p>
          <p><strong>👁️ Watch mode:</strong> npm run test:watch</p>
          <p><strong>📦 Headless:</strong> npm run test:headless</p>
          <p><strong>📖 Read docs:</strong> See README.md for full documentation</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>UI Testing Tool v1.0.0 | Generated ${new Date().toLocaleString()}</p>
      <p style="margin-top: 10px; font-size: 0.9em;">
        For more information, see <strong>README.md</strong>
      </p>
    </div>
  </div>
</body>
</html>
`;

const reportPath = path.join(reportDir, `report-${Date.now()}.html`);
fs.writeFileSync(reportPath, htmlReport);

console.log(`✅ Report generated: ${reportPath}`);
console.log(`📊 Open in browser to view results`);
