/**
 * Dashboard Reporter
 * Writes real, structured Jest run results for the test results dashboard,
 * replacing generate-report.js's static/fake output.
 */
const fs = require('fs');
const path = require('path');
const config = require('../../puppeteer.config');
const { buildScreenshotFilename } = require('../helpers/screenshot-naming');

const REPORTS_DIR = path.join(__dirname, '..', 'reports');
const MANIFEST_PATH = path.join(REPORTS_DIR, 'manifest.json');
const MAX_HISTORY = 50;

class DashboardReporter {
  onRunComplete(testContexts, results) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
    const runId = this._buildRunId(results.startTime);
    const endTime = Date.now();

    const testSuites = results.testResults.map((suiteResult) => ({
      testFilePath: path.relative(process.cwd(), suiteResult.testFilePath),
      status: suiteResult.numFailingTests > 0 ? 'failed' : 'passed',
      numPassingTests: suiteResult.numPassingTests,
      numFailingTests: suiteResult.numFailingTests,
      numPendingTests: suiteResult.numPendingTests,
      perfStats: { ...suiteResult.perfStats },
      failureMessage: suiteResult.failureMessage || null,
      tests: suiteResult.testResults.map((assertion) => {
        const screenshotFile = assertion.status === 'failed'
          ? buildScreenshotFilename(suiteResult.testFilePath, assertion.fullName)
          : null;
        const screenshotExists = screenshotFile
          && fs.existsSync(path.join(config.screenshot.path, screenshotFile));
        return {
          title: assertion.title,
          fullName: assertion.fullName,
          ancestorTitles: assertion.ancestorTitles,
          status: assertion.status,
          duration: assertion.duration,
          failureMessages: assertion.failureMessages,
          screenshot: screenshotExists ? screenshotFile : null,
        };
      }),
    }));

    const runData = {
      id: runId,
      startTime: results.startTime,
      endTime,
      duration: endTime - results.startTime,
      success: results.success,
      numTotalTestSuites: results.numTotalTestSuites,
      numPassedTestSuites: results.numPassedTestSuites,
      numFailedTestSuites: results.numFailedTestSuites,
      numPendingTestSuites: results.numPendingTestSuites,
      numTotalTests: results.numTotalTests,
      numPassedTests: results.numPassedTests,
      numFailedTests: results.numFailedTests,
      numPendingTests: results.numPendingTests,
      numTodoTests: results.numTodoTests,
      testSuites,
    };

    const runFile = `run-${runId}.json`;
    fs.writeFileSync(path.join(REPORTS_DIR, runFile), JSON.stringify(runData, null, 2));
    this._updateManifest({
      id: runId,
      file: runFile,
      startTime: results.startTime,
      endTime,
      duration: endTime - results.startTime,
      success: results.success,
      numTotalTests: results.numTotalTests,
      numPassedTests: results.numPassedTests,
      numFailedTests: results.numFailedTests,
      numPendingTests: results.numPendingTests,
    });
  }

  _buildRunId(startTime) {
    return new Date(startTime).toISOString().replace(/[:.]/g, '-');
  }

  _updateManifest(entry) {
    let manifest = [];
    if (fs.existsSync(MANIFEST_PATH)) {
      try {
        manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
      } catch {
        manifest = [];
      }
    }
    manifest.unshift(entry);
    if (manifest.length > MAX_HISTORY) {
      manifest = manifest.slice(0, MAX_HISTORY);
    }
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  }
}

module.exports = DashboardReporter;
