import { Page, Locator, expect } from "@playwright/test";

export class CheckoutPage {
  private readonly page: Page;
  private readonly checkoutButton: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly completeHeader: Locator;
  private readonly errorContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = this.page.getByTestId("checkout");
    this.firstNameInput = this.page.getByTestId("firstName");
    this.lastNameInput = this.page.getByTestId("lastName");
    this.postalCodeInput = this.page.getByTestId("postalCode");
    this.continueButton = this.page.getByTestId("continue");
    this.finishButton = this.page.getByTestId("finish");
    this.completeHeader = this.page.getByTestId("complete-header");
    this.errorContainer = this.page.getByTestId("error");
  }

  /**
   * Starts the checkout process from the cart page (/cart.html)
   */
  async startCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Fills the step-one checkout information form and continues
   * @param firstName User's first name
   * @param lastName User's last name
   * @param postalCode User's postal/zip code
   */
  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /**
   * Finishes the checkout process on the step-two overview page
   */
  async finishCheckout(): Promise<void> {
    await this.finishButton.click();
  }

  /**
   * Asserts that the checkout has been successfully completed
   */
  async validateCheckoutComplete(): Promise<void> {
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeHeader).toHaveText("Thank you for your order!");
  }
  
  /**
   * Asserts that the checkout form displays the correct error message
   * @param expectedMessage The expected validation error text
   */
  async validateErrorMessage(expectedMessage: string): Promise<void> {
    await expect(this.errorContainer).toBeVisible();
    await expect(this.errorContainer).toContainText(expectedMessage);
  }

  /**
   * Validates the error state of an input field
   * @param fieldName The name of the input field
   */
  async validateInputErrorState(fieldName: string): Promise<void> {
    const input = this.page.getByTestId(fieldName);
    await expect(input).toBeVisible();
    await expect(input).toHaveClass(/\berror\b/);
  }

  async validateFieldError(fieldName: string, expectedMessage: string): Promise<void> {
    await this.validateErrorMessage(expectedMessage);
    await this.validateInputErrorState(fieldName);

  }
}
