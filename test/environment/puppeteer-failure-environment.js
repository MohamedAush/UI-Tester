/**
 * Puppeteer Failure Environment
 * Extends the default Node test environment to auto-capture a screenshot
 * of the active page whenever a test fails, gated by
 * puppeteer.config.js's screenshot.onFailure toggle.
 */
const NodeEnvironment = require('jest-environment-node').default;
const config = require('../../puppeteer.config');
const PageUtils = require('../helpers/page-utils');
const { buildScreenshotFilename } = require('../helpers/screenshot-naming');

class PuppeteerFailureEnvironment extends NodeEnvironment {
  constructor(envConfig, context) {
    super(envConfig, context);
    this.testPath = context.testPath;
  }

  async handleTestEvent(event) {
    if (event.name !== 'test_fn_failure') return;
    if (!config.screenshot || !config.screenshot.onFailure) return;

    const browserHelper = this.global.__BROWSER_HELPER__;
    const page = browserHelper && browserHelper.getActivePage && browserHelper.getActivePage();
    if (!page || page.isClosed()) return;

    const fullName = this._getFullName(event.test);
    const filename = buildScreenshotFilename(this.testPath, fullName);

    try {
      await PageUtils.screenshot(page, filename);
    } catch (err) {
      console.error(`[PuppeteerFailureEnvironment] Screenshot capture failed: ${err.message}`);
    }
  }

  _getFullName(test) {
    const titles = [test.name];
    let current = test.parent;
    while (current && current.parent) {
      titles.unshift(current.name);
      current = current.parent;
    }
    return titles.join(' ');
  }
}

module.exports = PuppeteerFailureEnvironment;
