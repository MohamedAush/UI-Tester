/**
 * Base Page Object
 * Parent class for all page objects following Page Object Model pattern
 */

const PageUtils = require('../helpers/page-utils');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to page
   */
  async goto(path = '') {
    await PageUtils.goto(this.page, path);
  }

  /**
   * Click element
   */
  async click(selector) {
    return PageUtils.click(this.page, selector);
  }

  /**
   * Type text
   */
  async type(selector, text) {
    return PageUtils.type(this.page, selector, text);
  }

  /**
   * Get text
   */
  async getText(selector) {
    return PageUtils.getText(this.page, selector);
  }

  /**
   * Get all text elements
   */
  async getAllText(selector) {
    return PageUtils.getAllText(this.page, selector);
  }

  /**
   * Check if element exists
   */
  async elementExists(selector) {
    return PageUtils.elementExists(this.page, selector);
  }

  /**
   * Wait for element
   */
  async waitForElement(selector, timeout) {
    return PageUtils.waitForElement(this.page, selector, timeout);
  }

  /**
   * Take screenshot
   */
  async screenshot(filename) {
    return PageUtils.screenshot(this.page, filename);
  }

  /**
   * Get page title
   */
  async getTitle() {
    return PageUtils.getTitle(this.page);
  }

  /**
   * Get current URL
   */
  async getURL() {
    return PageUtils.getURL(this.page);
  }

  /**
   * Evaluate JavaScript
   */
  async evaluate(fn, ...args) {
    return PageUtils.evaluate(this.page, fn, ...args);
  }

  /**
   * Wait for Vue to be ready
   */
  async waitForVue() {
    await this.page.waitForFunction(() => {
      return window.__VUE__ || (window.$nuxt && window.$nuxt.$root);
    });
  }

  /**
   * Get Vue component data
   */
  async getVueData(componentSelector) {
    return this.page.evaluate((selector) => {
      const el = document.querySelector(selector);
      if (el && el.__vue__) {
        return el.__vue__.$data;
      }
      return null;
    }, componentSelector);
  }
}

module.exports = BasePage;
