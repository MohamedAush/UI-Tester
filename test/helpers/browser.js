/**
 * Browser Helper
 * Manages browser and page lifecycle
 */

const puppeteer = require('puppeteer');
const config = require('../../puppeteer.config');

class BrowserHelper {
  constructor() {
    this.browser = null;
    this.pages = [];
  }

  /**
   * Initialize browser
   */
  async init() {
    this.browser = await puppeteer.launch(config.browser);
    return this.browser;
  }

  /**
   * Create new page
   */
  async createPage() {
    if (!this.browser) {
      await this.init();
    }

    const page = await this.browser.newPage();
    await page.setViewport(config.viewport);
    
    // Set user agent for Vue detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    );

    // Enable console logging
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`[Browser Console Error] ${msg.text()}`);
      }
    });

    // Handle page errors
    page.on('error', (err) => {
      console.error('[Page Error]', err);
    });

    this.pages.push(page);
    return page;
  }

  /**
   * Set device emulation
   */
  async setDevice(page, deviceName = 'desktop') {
    const device = config.devices[deviceName];
    if (!device) {
      throw new Error(`Device '${deviceName}' not found in config`);
    }

    await page.setViewport(device.viewport);
    await page.setUserAgent(device.userAgent);

    if (device.isMobile) {
      await page.setDefaultNavigationTimeout(config.navigation.timeout);
    }
  }

  /**
   * Close single page
   */
  async closePage(page) {
    if (page) {
      await page.close();
      this.pages = this.pages.filter((p) => p !== page);
    }
  }

  /**
   * Close all pages and browser
   */
  async close() {
    for (const page of this.pages) {
      await page.close();
    }
    this.pages = [];

    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Get active page
   */
  getActivePage() {
    return this.pages[this.pages.length - 1] || null;
  }
}

module.exports = BrowserHelper;
