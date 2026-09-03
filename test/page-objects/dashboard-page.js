/**
 * Dashboard Page Object
 * Page object for dashboard functionality
 */

const BasePage = require('./base-page');

class DashboardPage extends BasePage {
  // Selectors
  get selectors() {
    return {
      welcomeMessage: '.welcome-message',
      userProfile: '.user-profile',
      logoutButton: 'button[data-test="logout"]',
      navigationMenu: '.nav-menu',
      searchInput: 'input[placeholder*="Search"]',
      itemsList: '.items-list',
      itemCard: '.item-card',
      addButton: 'button[data-test="add-item"]',
      deleteButton: '.delete-btn',
      editButton: '.edit-btn',
    };
  }

  /**
   * Navigate to dashboard
   */
  async goto() {
    await super.goto('/dashboard');
    await this.waitForElement(this.selectors.welcomeMessage);
  }

  /**
   * Get welcome message
   */
  async getWelcomeMessage() {
    return this.getText(this.selectors.welcomeMessage);
  }

  /**
   * Verify dashboard is loaded
   */
  async isLoaded() {
    return this.elementExists(this.selectors.welcomeMessage);
  }

  /**
   * Click logout button
   */
  async logout() {
    await this.click(this.selectors.logoutButton);
  }

  /**
   * Search for item
   */
  async search(query) {
    await this.type(this.selectors.searchInput, query);
    await this.page.keyboard.press('Enter');
    await this.waitForElement(this.selectors.itemsList);
  }

  /**
   * Get all items
   */
  async getItems() {
    const items = await this.page.$$eval(
      this.selectors.itemCard,
      (elements) =>
        elements.map((el) => ({
          text: el.textContent.trim(),
          html: el.innerHTML,
        }))
    );
    return items;
  }

  /**
   * Click add button
   */
  async clickAdd() {
    await this.click(this.selectors.addButton);
  }

  /**
   * Delete item by index
   */
  async deleteItem(index) {
    const deleteButtons = await this.page.$$(this.selectors.deleteButton);
    if (deleteButtons[index]) {
      await deleteButtons[index].click();
    }
  }

  /**
   * Edit item by index
   */
  async editItem(index) {
    const editButtons = await this.page.$$(this.selectors.editButton);
    if (editButtons[index]) {
      await editButtons[index].click();
    }
  }

  /**
   * Get user profile info
   */
  async getUserProfileInfo() {
    const profile = await this.page.$eval(
      this.selectors.userProfile,
      (el) => ({
        name: el.querySelector('.name')?.textContent,
        email: el.querySelector('.email')?.textContent,
      })
    );
    return profile;
  }
}

module.exports = DashboardPage;
