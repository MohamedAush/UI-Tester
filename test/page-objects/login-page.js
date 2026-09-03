/**
 * Login Page Object
 * Page object for login functionality
 */

const BasePage = require('./base-page');

class LoginPage extends BasePage {
  // Selectors
  get selectors() {
    return {
      emailInput: 'input[type="email"]',
      passwordInput: 'input[type="password"]',
      loginButton: 'button[type="submit"]',
      errorMessage: '.error-message',
      rememberCheckbox: 'input[type="checkbox"]',
      forgotPasswordLink: 'a[href*="forgot"]',
    };
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await super.goto('/login');
    await this.waitForElement(this.selectors.emailInput);
  }

  /**
   * Enter email
   */
  async enterEmail(email) {
    await this.type(this.selectors.emailInput, email);
  }

  /**
   * Enter password
   */
  async enterPassword(password) {
    await this.type(this.selectors.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await this.click(this.selectors.loginButton);
  }

  /**
   * Login with email and password
   */
  async login(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /**
   * Get error message
   */
  async getErrorMessage() {
    const exists = await this.elementExists(this.selectors.errorMessage);
    if (exists) {
      return this.getText(this.selectors.errorMessage);
    }
    return null;
  }

  /**
   * Check remember me checkbox
   */
  async rememberMe() {
    await this.click(this.selectors.rememberCheckbox);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.click(this.selectors.forgotPasswordLink);
  }

  /**
   * Verify login page is loaded
   */
  async isLoaded() {
    return this.elementExists(this.selectors.emailInput);
  }
}

module.exports = LoginPage;
