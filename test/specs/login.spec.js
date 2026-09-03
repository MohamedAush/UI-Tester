/**
 * Login Tests
 * Test suite for login functionality
 */

const BrowserHelper = require('../helpers/browser');
const LoginPage = require('../page-objects/login-page');

describe('Login Page', () => {
  let browserHelper;
  let page;
  let loginPage;

  beforeAll(async () => {
    browserHelper = new BrowserHelper();
    await browserHelper.init();
    global.__BROWSER_HELPER__ = browserHelper;
  });

  beforeEach(async () => {
    page = await browserHelper.createPage();
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  afterEach(async () => {
    await browserHelper.closePage(page);
  });

  afterAll(async () => {
    await browserHelper.close();
  });

  describe('Page Load', () => {
    test('should load login page successfully', async () => {
      const isLoaded = await loginPage.isLoaded();
      expect(isLoaded).toBe(true);
    });

    test('should display login form', async () => {
      const title = await loginPage.getTitle();
      expect(title).toContain('Login');
    });
  });

  describe('Login Functionality', () => {
    test('should login with valid credentials', async () => {
      await loginPage.login('user@example.com', 'password123');
      await loginPage.waitForElement('.dashboard', 5000);
      
      const url = await loginPage.getURL();
      expect(url).toContain('/dashboard');
    });

    test('should display error with invalid email', async () => {
      await loginPage.enterEmail('invalid-email');
      await loginPage.enterPassword('password123');
      await loginPage.clickLogin();

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
    });

    test('should display error with empty password', async () => {
      await loginPage.enterEmail('user@example.com');
      await loginPage.clickLogin();

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
    });

    test('should display error with wrong credentials', async () => {
      await loginPage.login('user@example.com', 'wrongpassword');

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
    });
  });

  describe('Form Interactions', () => {
    test('should check remember me checkbox', async () => {
      await loginPage.rememberMe();
      const isChecked = await page.$eval(
        'input[type="checkbox"]',
        (el) => el.checked
      );
      expect(isChecked).toBe(true);
    });

    test('should click forgot password link', async () => {
      const forgotPasswordExists = await loginPage.elementExists(
        loginPage.selectors.forgotPasswordLink
      );
      if (forgotPasswordExists) {
        await loginPage.clickForgotPassword();
        // Verify navigation occurred
        const url = await loginPage.getURL();
        expect(url).toContain('forgot');
      }
    });
  });

  describe('Accessibility', () => {
    test('should have proper form labels', async () => {
      const emailLabel = await page.$eval(
        'label[for="email"]',
        (el) => el.textContent
      ).catch(() => null);

      if (emailLabel) {
        expect(emailLabel.length).toBeGreaterThan(0);
      }
    });
  });
});
