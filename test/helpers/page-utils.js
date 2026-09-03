/**
 * Page Utilities
 * Common helper functions for page interactions
 */

const path = require('path');
const config = require('../../puppeteer.config');

class PageUtils {
  /**
   * Navigate to URL
   */
  static async goto(page, path = '') {
    const url = config.baseUrl + path;
    await page.goto(url, { waitUntil: config.navigation.waitUntil });
  }

  /**
   * Click element by selector
   */
  static async click(page, selector) {
    await page.waitForSelector(selector, { timeout: config.test.timeout });
    await page.click(selector);
  }

  /**
   * Type text into element
   */
  static async type(page, selector, text) {
    await page.waitForSelector(selector, { timeout: config.test.timeout });
    await page.type(selector, text);
  }

  /**
   * Clear input field
   */
  static async clearInput(page, selector) {
    await page.waitForSelector(selector);
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      el.value = '';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, selector);
  }

  /**
   * Get text content of element
   */
  static async getText(page, selector) {
    await page.waitForSelector(selector);
    return page.$eval(selector, (el) => el.textContent.trim());
  }

  /**
   * Get multiple text elements
   */
  static async getAllText(page, selector) {
    await page.waitForSelector(selector);
    return page.$$eval(selector, (elements) =>
      elements.map((el) => el.textContent.trim())
    );
  }

  /**
   * Get element attribute
   */
  static async getAttribute(page, selector, attribute) {
    await page.waitForSelector(selector);
    return page.$eval(selector, (el, attr) => el.getAttribute(attr), attribute);
  }

  /**
   * Check if element exists
   */
  static async elementExists(page, selector) {
    const element = await page.$(selector);
    return !!element;
  }

  /**
   * Wait for element to be visible
   */
  static async waitForElement(page, selector, timeout = config.test.timeout) {
    await page.waitForSelector(selector, { visible: true, timeout });
  }

  /**
   * Wait for element to disappear
   */
  static async waitForElementToDisappear(page, selector, timeout = config.test.timeout) {
    await page.waitForFunction(
      (sel) => !document.querySelector(sel),
      { timeout },
      selector
    );
  }

  /**
   * Wait for navigation
   */
  static async waitForNavigation(page) {
    await page.waitForNavigation({
      waitUntil: config.navigation.waitUntil,
      timeout: config.navigation.timeout,
    });
  }

  /**
   * Hover over element
   */
  static async hover(page, selector) {
    await page.hover(selector);
  }

  /**
   * Take screenshot
   */
  static async screenshot(page, filename) {
    const filePath = path.join(config.screenshot.path, filename);
    await page.screenshot({
      path: filePath,
      fullPage: config.screenshot.fullPage,
    });
    console.log(`Screenshot saved: ${filePath}`);
  }

  /**
   * Fill form with data object
   */
  static async fillForm(page, formData) {
    for (const [selector, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        await this.type(page, selector, value);
      } else if (typeof value === 'boolean') {
        // For checkboxes
        const isChecked = await page.$eval(selector, (el) => el.checked);
        if (isChecked !== value) {
          await this.click(page, selector);
        }
      }
    }
  }

  /**
   * Submit form
   */
  static async submitForm(page, formSelector) {
    await Promise.all([
      page.waitForNavigation({
        waitUntil: config.navigation.waitUntil,
        timeout: config.navigation.timeout,
      }),
      page.$eval(formSelector, (form) => form.requestSubmit()),
    ]);
  }

  /**
   * Collect console messages logged during `duration` ms
   */
  static async getConsoleMessages(page, duration = 1000) {
    const messages = [];
    const handler = (msg) => {
      messages.push({
        type: msg.type(),
        text: msg.text(),
      });
    };
    page.on('console', handler);
    await new Promise((resolve) => setTimeout(resolve, duration));
    page.off('console', handler);
    return messages;
  }

  /**
   * Execute JavaScript in page context
   */
  static async evaluate(page, fn, ...args) {
    return page.evaluate(fn, ...args);
  }

  /**
   * Wait for condition
   */
  static async waitForCondition(page, fn, timeout = config.test.timeout) {
    await page.waitForFunction(fn, { timeout });
  }

  /**
   * Get page title
   */
  static async getTitle(page) {
    return page.title();
  }

  /**
   * Get page URL
   */
  static async getURL(page) {
    return page.url();
  }

  /**
   * Handle dialog
   */
  static async acceptDialog(page) {
    page.once('dialog', (dialog) => dialog.accept());
  }

  /**
   * Handle dismiss dialog
   */
  static async dismissDialog(page) {
    page.once('dialog', (dialog) => dialog.dismiss());
  }
}

module.exports = PageUtils;
