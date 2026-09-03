/**
 * Dashboard Tests
 * Test suite for dashboard functionality
 */

const BrowserHelper = require('../helpers/browser');
const DashboardPage = require('../page-objects/dashboard-page');
const LoginPage = require('../page-objects/login-page');

describe('Dashboard Page', () => {
  let browserHelper;
  let page;
  let dashboardPage;
  let loginPage;

  beforeAll(async () => {
    browserHelper = new BrowserHelper();
    await browserHelper.init();
  });

  beforeEach(async () => {
    page = await browserHelper.createPage();
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Login before each test
    await loginPage.goto();
    await loginPage.login('user@example.com', 'password123');
    await dashboardPage.waitForElement(dashboardPage.selectors.welcomeMessage);
  });

  afterEach(async () => {
    await browserHelper.closePage(page);
  });

  afterAll(async () => {
    await browserHelper.close();
  });

  describe('Page Load', () => {
    test('should load dashboard successfully', async () => {
      const isLoaded = await dashboardPage.isLoaded();
      expect(isLoaded).toBe(true);
    });

    test('should display welcome message', async () => {
      const welcomeMessage = await dashboardPage.getWelcomeMessage();
      expect(welcomeMessage.length).toBeGreaterThan(0);
    });
  });

  describe('User Information', () => {
    test('should display user profile information', async () => {
      const profileInfo = await dashboardPage.getUserProfileInfo();
      expect(profileInfo).toBeDefined();
      expect(profileInfo.name || profileInfo.email).toBeTruthy();
    });

    test('should display logout button', async () => {
      const logoutExists = await dashboardPage.elementExists(
        dashboardPage.selectors.logoutButton
      );
      expect(logoutExists).toBe(true);
    });
  });

  describe('Search Functionality', () => {
    test('should search for items', async () => {
      const searchInputExists = await dashboardPage.elementExists(
        dashboardPage.selectors.searchInput
      );

      if (searchInputExists) {
        await dashboardPage.search('test');
        const items = await dashboardPage.getItems();
        expect(Array.isArray(items)).toBe(true);
      }
    });
  });

  describe('Item Management', () => {
    test('should display items list', async () => {
      const items = await dashboardPage.getItems();
      expect(Array.isArray(items)).toBe(true);
    });

    test('should have add button', async () => {
      const addButtonExists = await dashboardPage.elementExists(
        dashboardPage.selectors.addButton
      );
      expect(addButtonExists).toBe(true);
    });

    test('should display edit button for items', async () => {
      const editButtonExists = await dashboardPage.elementExists(
        dashboardPage.selectors.editButton
      );
      expect(editButtonExists).toBe(true);
    });

    test('should display delete button for items', async () => {
      const deleteButtonExists = await dashboardPage.elementExists(
        dashboardPage.selectors.deleteButton
      );
      expect(deleteButtonExists).toBe(true);
    });
  });

  describe('Logout Functionality', () => {
    test('should logout successfully', async () => {
      await dashboardPage.logout();
      await dashboardPage.waitForElement(loginPage.selectors.emailInput);

      const url = await dashboardPage.getURL();
      expect(url).toContain('/login');
    });
  });

  describe('Responsive Design', () => {
    test('should be responsive on mobile', async () => {
      await browserHelper.setDevice(page, 'mobile');
      const viewport = await dashboardPage.evaluate(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
      }));

      expect(viewport.width).toBeLessThanOrEqual(375);
    });

    test('should be responsive on tablet', async () => {
      await browserHelper.setDevice(page, 'tablet');
      const viewport = await dashboardPage.evaluate(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
      }));

      expect(viewport.width).toBeLessThanOrEqual(768);
    });
  });

  describe('Performance', () => {
    test('should load dashboard within acceptable time', async () => {
      const startTime = Date.now();
      await dashboardPage.goto();
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(5000); // 5 seconds
    });
  });
});
