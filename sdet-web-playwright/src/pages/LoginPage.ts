import { Page, Locator } from "@playwright/test";

export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = this.page.getByTestId("username");
    this.passwordInput = this.page.getByTestId("password");
    this.loginButton = this.page.getByTestId("login-button");
  }

  async navigate(): Promise<void> {
    await this.page.goto("");
  }
  // Actions
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
