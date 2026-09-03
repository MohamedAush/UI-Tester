# Quick Start Guide

Get up and running with the UI Testing Tool in 5 minutes.

## 1. Install Dependencies

```bash
cd "untitled folder"
npm install
```

## 2. Start Your Application

Make sure your Vue.js application is running:

```bash
# In your app directory
npm run dev
# or
yarn serve
```

Your app should be running at `http://localhost:3000` (default)

## 3. Configure Base URL (if needed)

If your app runs on a different port:

```bash
export BASE_URL="http://localhost:8080"
```

## 4. Run Tests

### Quick Run
```bash
npm test
```

### With Browser Visible (Debug)
```bash
npm run test:debug
```

### Headless (CI/CD)
```bash
npm run test:headless
```

### Watch Mode (auto-rerun)
```bash
npm run test:watch
```

## 5. Create Your First Test

### Step 1: Create Page Object

Create `test/page-objects/my-page.js`:

```javascript
const BasePage = require('./base-page');

class MyPage extends BasePage {
  get selectors() {
    return {
      title: '.page-title',
      button: 'button.submit'
    };
  }

  async goto() {
    await super.goto('/my-page');
  }

  async clickButton() {
    await this.click(this.selectors.button);
  }
}

module.exports = MyPage;
```

### Step 2: Create Test File

Create `test/specs/my-page.spec.js`:

```javascript
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

  test('should load page', async () => {
    const exists = await myPage.elementExists(myPage.selectors.title);
    expect(exists).toBe(true);
  });

  test('should click button', async () => {
    await myPage.clickButton();
    // Add more assertions
  });
});
```

### Step 3: Run Your Test

```bash
npm test
```

## File Structure Reference

```
├── package.json                 # Dependencies
├── puppeteer.config.js         # Browser config
├── jest.config.js              # Test config
├── run-tests.js                # Test runner
├── generate-report.js          # Report generator
├── README.md                   # Full docs
├── QUICKSTART.md               # This file
└── test/
    ├── helpers/
    │   ├── browser.js          # Browser management
    │   └── page-utils.js       # Common utilities
    ├── page-objects/
    │   ├── base-page.js        # Base class
    │   ├── login-page.js       # Example
    │   └── dashboard-page.js   # Example
    ├── specs/
    │   ├── login.spec.js       # Example test
    │   └── dashboard.spec.js   # Example test
    └── config/
        └── test-config.js      # Test data
```

## Common Commands

```bash
# Run all tests
npm test

# Run with browser visible
npm run test:debug

# Run specific test
npx jest test/specs/login.spec.js

# Run tests matching pattern
npx jest --testNamePattern="login"

# Generate report
npm run generate:report

# Watch mode
npm run test:watch
```

## Common Page Object Methods

```javascript
// Navigation
await page.goto('/path');

// Interaction
await page.click(selector);
await page.type(selector, 'text');
await page.hover(selector);

// Assertions
const exists = await page.elementExists(selector);
const text = await page.getText(selector);

// Waiting
await page.waitForElement(selector);
await page.waitForElement(selector, 5000); // with timeout

// Screenshots
await page.screenshot('filename.png');

// Vue
await page.waitForVue();
const data = await page.getVueData('.my-component');
```

## Selectors Tips

### Best Practices
- Use `data-test` attributes: `input[data-test="email"]`
- Use semantic classes: `.welcome-message`
- Use type selectors: `button[type="submit"]`

### Avoid
- Generic: `div`, `span`
- Brittle: `div > span > p > a`
- Index-based: `:nth-child(3)`

### Add Test Attributes to Components

In your Vue components, add `data-test` attributes:

```vue
<template>
  <input data-test="email" type="email" />
  <button data-test="submit" type="submit">Submit</button>
</template>
```

Then use in tests:

```javascript
await page.type('input[data-test="email"]', 'user@example.com');
await page.click('button[data-test="submit"]');
```

## Debugging Tips

### See What's Happening
```bash
npm run test:debug
```
- Browser is visible
- Actions are slowed down
- You can pause and inspect

### Take Screenshots
```javascript
test('should show something', async () => {
  // ... test code ...
  await page.screenshot('my-screenshot.png');
});
```

Saved to: `test/screenshots/`

### Console Logs
```javascript
test('should log', async () => {
  // Logs from your app are printed automatically
  await page.goto('/');
});
```

### Check Browser Console
```javascript
page.on('console', (msg) => {
  console.log('[Browser]', msg.text());
});
```

## Troubleshooting

### "Cannot find module 'puppeteer'"
```bash
npm install
```

### "Application not found"
- Make sure your app is running: `npm run dev`
- Check BASE_URL: `export BASE_URL="http://localhost:3000"`

### "Selector not found"
- Use `npm run test:debug` to see browser
- Verify selector is correct
- Check if element loads asynchronously

### "Timeout waiting for..."
- Increase timeout in test: `waitForElement(sel, 10000)`
- Check if element exists at all
- Verify selectors are unique

## Next Steps

1. **Read Full Docs**: See [README.md](README.md)
2. **Study Examples**: Check out example tests in `test/specs/`
3. **Learn POM**: Read about Page Object Model pattern
4. **Best Practices**: Section in README.md
5. **Advanced**: Cross-browser testing, CI/CD integration

## Resources

- 📖 [README.md](README.md) - Full documentation
- 📕 [Puppeteer Docs](https://pptr.dev/)
- 🧪 [Jest Docs](https://jestjs.io/)
- 🏛️ [POM Pattern](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)

---

**Happy Testing! 🎉**

Questions? Check README.md or the example files in `test/`
