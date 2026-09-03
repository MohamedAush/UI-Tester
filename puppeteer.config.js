module.exports = {
  baseUrl: process.env.BASE_URL || 'https://www.muraidhoo.gov.mv',

  browser: {
    headless: true,
    slowMo: 0,
    devtools: false
  },

  viewport: {
    width: 1280,
    height: 720
  },

  navigation: {
    waitUntil: 'networkidle2',
    timeout: 30000
  },

  test: {
    timeout: 30000
  },

  screenshot: {
    enabled: true,
    path: 'test/screenshots',
    fullPage: true
  }
};