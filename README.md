# UI Testing Tool

A comprehensive end-to-end testing framework for Vue.js applications using Puppeteer. This tool provides a scalable, maintainable testing solution with the Page Object Model pattern, extensive utilities, and example tests.

## Features

✅ **Puppeteer-based E2E Testing** - Automate user interactions across browsers  
✅ **Page Object Model** - Maintainable test structure following industry best practices  
✅ **Vue.js Support** - Built-in helpers for Vue component testing  
✅ **Multi-Device Testing** - Desktop, mobile, and tablet configurations  
✅ **Comprehensive Utilities** - Rich helper functions for common interactions  
✅ **Jest Integration** - Familiar test framework with excellent reporting  
✅ **Screenshot Capture** - Automated screenshots for visual regression  
✅ **Responsive Testing** - Built-in device emulation  
✅ **Test Configuration** - Centralized, environment-aware configuration  

## Project Structure

```
├── package.json                 # Project dependencies
├── puppeteer.config.js         # Puppeteer configuration
├── jest.config.js              # Jest configuration
├── run-tests.js                # Test runner entry point
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
└── test/
    ├── helpers/
    │   ├── browser.js          # Browser lifecycle management
    │   └── page-utils.js       # Page interaction utilities
    ├── page-objects/
    │   ├── base-page.js        # Base page object class
    │   ├── login-page.js       # Login page object example
    │   └── dashboard-page.js   # Dashboard page object example
    ├── specs/
    │   ├── login.spec.js       # Login test suite
    │   └── dashboard.spec.js   # Dashboard test suite
    ├── config/
    │   └── test-config.js      # Test configuration & data
    ├── screenshots/            # Screenshot output directory
    ├── videos/                 # Video recording directory
    ├── reports/                # Test reports directory
    └── coverage/               # Coverage reports directory
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone/Download the project**
   ```bash
   cd "untitled folder"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your application URL** (optional)
   ```bash
   export BASE_URL="http://localhost:3000"
   ```

## Usage

### Run All Tests

```bash
npm test
```

### Run Tests in Headless Mode (CI/CD)

```bash
npm run test:headless
```

### Run Tests with Browser Visible (Debug)

```bash
npm run test:debug
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Specific Test File

```bash
npx jest test/specs/login.spec.js
```

### Run Tests with Custom Configuration

```bash
BASE_URL="http://my-app.com" HEADLESS=false npm test
```

## Configuration

### Environment Variables

- `BASE_URL` - Application URL (default: `http://localhost:3000`)
- `HEADLESS` - Run browser in headless mode (default: `true`)
- `SLOW_MO` - Slow down interactions in milliseconds (default: `0`)
- `DEVTOOLS` - Open DevTools on start (default: `false`)
- `RECORD_VIDEO` - Record test videos (default: `false`)

### puppeteer.config.js

Centralized configuration for all Puppeteer settings:

```javascript
{
  browser: {        // Browser launch options
    headless: true,
    slowMo: 0,
    args: [...]
  },
  navigation: {     // Navigation settings
    waitUntil: 'networkidle2',
    timeout: 30000
  },
  test: {           // Test defaults
    timeout: 30000,
    retries: 1
  },
  viewport: {       // Default viewport
    width: 1280,
    height: 720
  },
  devices: {        // Device configurations
    desktop: {...},
    mobile: {...},
    tablet: {...}
  }
}
```

## Creating Tests

### 1. Create a Page Object

```javascript
// test/page-objects/my-page.js
const BasePage = require('./base-page');

class MyPage extends BasePage {
  get selectors() {
    return {
      title: '.page-title',
      button: 'button.submit',
      input: 'input.search'
    };
  }

  async goto() {
    await super.goto('/my-page');
  }

  async clickButton() {
    await this.click(this.selectors.button);
  }

  async getTitle() {
    return this.getText(this.selectors.title);
  }
}

module.exports = MyPage;
```

### 2. Write Tests

```javascript
// test/specs/my-page.spec.js
const BrowserHelper = require('../helpers/browser');
const MyPage = require('../page-objects/my-page');

describe('My Page', () => {
  let browserHelper, page, myPage;

  beforeAll(async () => {
    browserHelper = new BrowserHelper();
    await browserHelper.init();
  });

  beforeEach(async () => {
    page = await browserHelper.createPage();
    myPage = new MyPage(page);
    await myPage.goto();
  });

  afterEach(async () => {
    await browserHelper.closePage(page);
  });

  afterAll(async () => {
    await browserHelper.close();
  });

  test('should load page successfully', async () => {
    const title = await myPage.getTitle();
    expect(title).toBeDefined();
  });

  test('should click button', async () => {
    await myPage.clickButton();
    // Add assertions
  });
});
```

## Page Object Model (POM)

The Page Object Model is a design pattern that represents each page/component as a class with methods representing user interactions.

### Benefits

- **Maintainability**: Selectors in one place
- **Reusability**: Share page objects across tests
- **Readability**: Test code reads like documentation
- **Scalability**: Easy to extend for new pages

### Base Page Class

`BasePage` provides common methods:

```javascript
await page.goto(path);           // Navigate
await page.click(selector);       // Click element
await page.type(selector, text);  // Type text
await page.getText(selector);     // Get text content
await page.elementExists(sel);    // Check existence
await page.screenshot(filename);  // Take screenshot
await page.getTitle();            // Get page title
await page.evaluate(fn);          // Execute JS
```

## Page Utils

The `PageUtils` class provides comprehensive helper functions for page interactions:

```javascript
// Navigation
await PageUtils.goto(page, '/path');
await PageUtils.waitForNavigation(page);

// Interaction
await PageUtils.click(page, selector);
await PageUtils.type(page, selector, text);
await PageUtils.clearInput(page, selector);
await PageUtils.hover(page, selector);

// Assertions
await PageUtils.elementExists(page, selector);
await PageUtils.waitForElement(page, selector);
await PageUtils.waitForElementToDisappear(page, selector);

// Content
await PageUtils.getText(page, selector);
await PageUtils.getAllText(page, selector);
await PageUtils.getAttribute(page, selector, attribute);

// Forms
await PageUtils.fillForm(page, formData);
await PageUtils.submitForm(page, formSelector);

// Screenshots
await PageUtils.screenshot(page, filename);

// Vue-specific
await page.waitForVue();
await page.getVueData(componentSelector);
```

## Multi-Device Testing

Test on different devices/viewports:

```javascript
// In beforeEach or test
await browserHelper.setDevice(page, 'mobile');   // Mobile
await browserHelper.setDevice(page, 'tablet');   // Tablet
await browserHelper.setDevice(page, 'desktop');  // Desktop
```

## Browser Helper

Manages browser and page lifecycle:

```javascript
const browserHelper = new BrowserHelper();

// Initialize browser
await browserHelper.init();

// Create new page
const page = await browserHelper.createPage();

// Set device
await browserHelper.setDevice(page, 'mobile');

// Close page
await browserHelper.closePage(page);

// Close all and cleanup
await browserHelper.close();
```

## Best Practices

### 1. Use Page Objects

✅ **Do:**
```javascript
const loginPage = new LoginPage(page);
await loginPage.login('user@example.com', 'password');
```

❌ **Don't:**
```javascript
await page.type('input[type="email"]', 'user@example.com');
```

### 2. Use Meaningful Waits

✅ **Do:**
```javascript
await page.waitForSelector('.success-message');
```

❌ **Don't:**
```javascript
await page.waitForTimeout(2000); // Sleep/hardcoded waits
```

### 3. Use Explicit Selectors

✅ **Do:**
```javascript
'button[data-test="submit"]'
'.welcome-message'
```

❌ **Don't:**
```javascript
'button' // Too generic
'div > span > a' // Brittle CSS
```

### 4. Organize Tests by Feature

```
test/specs/
├── auth/
│   ├── login.spec.js
│   └── logout.spec.js
├── dashboard/
│   └── dashboard.spec.js
└── settings/
    └── settings.spec.js
```

### 5. Use Test Data

```javascript
// Use centralized test data
const creds = TestConfig.getLoginCredentials();
await loginPage.login(creds.valid.email, creds.valid.password);
```

### 6. Clear Page State

```javascript
beforeEach(async () => {
  page = await browserHelper.createPage();
  await page.goto(config.baseUrl);
  // Page is clean for each test
});
```

## Debugging Tests

### Visual Debugging

```bash
npm run test:debug
```

This runs tests with:
- Browser visible (non-headless)
- Slow motion (100ms between actions)
- Time to see what's happening

### Screenshots

```javascript
test('should capture screenshot', async () => {
  await loginPage.screenshot('login-page.png');
});
```

Screenshots saved to: `test/screenshots/`

### Console Output

Browser console messages are logged automatically:

```javascript
page.on('console', (msg) => {
  console.log(`[Browser] ${msg.type()}: ${msg.text()}`);
});
```

### DevTools

```bash
DEVTOOLS=true npm test
```

### Single Test

```bash
npx jest test/specs/login.spec.js --testNamePattern="should login"
```

## Testing Vue Components

### Wait for Vue

```javascript
await page.waitForVue();
```

### Get Component Data

```javascript
const data = await page.getVueData('.my-component');
console.log(data.message); // Access component data
```

### Emit Events

```javascript
await page.evaluate(() => {
  const component = document.querySelector('.my-component').__vue__;
  component.$emit('custom-event', { data: 'value' });
});
```

## Test Organization

### Group Related Tests

```javascript
describe('Login Page', () => {
  describe('Page Load', () => {
    test('should load successfully', async () => {
      // Test
    });
  });

  describe('Login Functionality', () => {
    test('should login with valid credentials', async () => {
      // Test
    });
  });
});
```

### Use Fixtures for Setup

```javascript
const loginUser = async (page, email, password) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);
};

test('should show dashboard after login', async () => {
  await loginUser(page, 'user@example.com', 'password');
  const dashboard = new DashboardPage(page);
  expect(await dashboard.isLoaded()).toBe(true);
});
```

## CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run test:headless
```

### Environment Setup

```bash
export BASE_URL="https://your-app.com"
export HEADLESS=true
npm test
```

## Troubleshooting

### Tests Timeout

- Increase `test.timeout` in `puppeteer.config.js`
- Check if application is running
- Verify `BASE_URL` is correct

### Selectors Not Found

- Use `npm run test:debug` to see what's happening
- Verify selectors are correct
- Check if elements load asynchronously

### Port Already in Use

```bash
lsof -i :3000
kill -9 <PID>
```

### Chrome Sandbox Error

Already configured in `puppeteer.config.js`, but if issues persist:

```bash
export NO_SANDBOX=true
npm test
```

## Examples

See example page objects and test files:

- [Login Page](test/page-objects/login-page.js) - Form interactions
- [Dashboard Page](test/page-objects/dashboard-page.js) - List operations
- [Login Tests](test/specs/login.spec.js) - Authentication testing
- [Dashboard Tests](test/specs/dashboard.spec.js) - Feature testing

## Tips & Tricks

### Multiple Windows

```javascript
const page2 = await browserHelper.createPage();
const page3 = await browserHelper.createPage();
```

### Network Idle vs Load

```javascript
// Wait for network to be quiet
await page.goto(url, { waitUntil: 'networkidle2' });

// Wait for DOM ready
await page.goto(url, { waitUntil: 'domcontentloaded' });
```

### Slow Down Tests

```bash
SLOW_MO=500 npm test
```

### Disable Headless for Debugging

```bash
HEADLESS=false npm test
```

### Custom Viewport

```javascript
await page.setViewport({ width: 1920, height: 1080 });
```

## Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Page Object Model Pattern](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)
- [Testing Best Practices](https://testingjavascript.com/)

## License

MIT

---

**Happy Testing! 🚀**

For issues or questions, check the examples in the `test/` directory.
