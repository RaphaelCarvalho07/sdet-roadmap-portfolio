import { Page, Locator, expect } from "@playwright/test";

export class JuiceShopPage {
  readonly page: Page;
  readonly welcomeBannerDismissButton: Locator;
  readonly cookieConsentDismissButton: Locator;
  readonly navbarAccountButton: Locator;
  readonly userProfileButton: Locator;
  readonly checkoutButton: Locator;
  readonly continueButton: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeBannerDismissButton = page.locator(
      'button[aria-label="Close Welcome Banner"]',
    );
    this.cookieConsentDismissButton = page.locator(
      'a[aria-label="dismiss cookie message"]',
    );
    this.navbarAccountButton = page.locator("#navbarAccount");
    this.userProfileButton = page.locator(
      'button[aria-label="Go to user profile"]',
    );
    this.checkoutButton = page.locator("#checkoutButton");
    this.continueButton = page
      .getByRole("button")
      .filter({ hasText: "Continue" });
    this.placeOrderButton = page
      .getByRole("button")
      .filter({ hasText: "Place your order and pay" });
  }

  /**
   * Injects the JWT token and suppresses all UI overlays in localStorage
   * BEFORE navigating to the page, bypassing login forms and popups.
   */
  async injectSessionToken(token: string, bid: string | number): Promise<void> {
    await this.page.addInitScript(
      ({
        jwtToken,
        basketId,
      }: {
        jwtToken: string;
        basketId: string | number;
      }) => {
        window.localStorage.setItem("token", jwtToken);
        window.localStorage.setItem("bid", String(basketId));
        window.sessionStorage.setItem("bid", String(basketId));
        document.cookie = "welcomebanner_status=dismiss; path=/";
        document.cookie = "cookieconsent_status=dismiss; path=/";
      },
      { jwtToken: token, basketId: bid },
    );
  }

  /**
   * Navigates to the Juice Shop home page
   */
  async navigate(): Promise<void> {
    await this.page.goto("/#/search");
  }
  /**
   * Navigates to the OWASP Juice Shop Basket page
   */
  async goToBasket(): Promise<void> {
    await this.page.goto("/#/basket");
  }

  /**
   * Asserts that a specific product is visible in the basket table
   * @param productName The name of the product expected to be in the basket
   */
  async validateItemBasket(productName: string): Promise<void> {
    const basketRow = this.page.locator("mat-row", { hasText: productName });
    await expect(basketRow).toBeVisible();
  }

  /**
   * Dismisses welcome banner and cookie overlays safely using forced DOM clicks
   */
  async dismissOverlays(): Promise<void> {
    try {
      if (await this.welcomeBannerDismissButton.isVisible({ timeout: 4000 })) {
        await this.welcomeBannerDismissButton.click({ force: true });
        await this.page
          .locator(".cdk-overlay-backdrop")
          .waitFor({ state: "detached", timeout: 4000 })
          .catch(() => {});
      }
    } catch {
      // Silently ignore if welcome banner is absent
    }

    try {
      if (await this.cookieConsentDismissButton.isVisible({ timeout: 3000 })) {
        await this.cookieConsentDismissButton.click({ force: true });
      }
    } catch {
      // Silently ignore if cookie banner is absent
    }
  }

  /**
   * Opens the account menu in the top navbar
   */
  async openAccountMenu(): Promise<void> {
    await this.navbarAccountButton.click();
  }

  /**
   * Clicks on the checkout button
   */
  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Selects the delivery address for the checkout process
   * @param streetAddress The street address of the address to select
   */
  async selectAddress(streetAddress: string): Promise<void> {
    const addressRow = this.page.locator("mat-row", { hasText: streetAddress });
    await addressRow.locator("mat-radio-button").click();
    await this.continueButton.click();
  }
  /**
   * Selects the delivery method for the checkout process
   * @param methodName The delivery method to select
   */
  async selectDeliveryMethod(methodName: string): Promise<void> {
    const deliveryRow = this.page.locator("mat-row", { hasText: methodName });
    await deliveryRow.locator("mat-radio-button").click();
    await this.continueButton.click();
  }

  /**
   * Selects the payment method for the checkout process
   * @param cardHolderName The name of the card holder to select
   */
  async selectPaymentMethod(cardHolderName: string): Promise<void> {
    const cardRow = this.page.locator("mat-row", { hasText: cardHolderName });
    await cardRow.locator("mat-radio-button").click();
    await this.continueButton.click();
  }

  /**
   * Places the order and pays for it
   */
  async placeOrderAndPay(): Promise<void> {
    await this.placeOrderButton.click();
  }

  /**
   * Performs visual validation of the Order Summary page, masking dynamic address and payment cards
   */
  async validateSummaryVisual(): Promise<void> {
    // Hide transient toast notifications/snackbars and force a fixed height on the cards
    // to prevent layout shifts while keeping test data dynamic.
    await this.page.addStyleTag({
      content: `
        mat-snack-bar-container,
        .mat-snack-bar-container,
        mat-mdc-snack-bar-container,
        .mat-mdc-snack-bar-container {
          display: none !important;
        }
        .column mat-card {
          height: 150px !important;
          overflow: hidden !important;
        }
      `,
    });

    const addressCard = this.page
      .locator(".column mat-card")
      .filter({ hasText: "Delivery Address" });
    const paymentCard = this.page
      .locator(".column mat-card")
      .filter({ hasText: "Payment Method" });

    await expect(this.page).toHaveScreenshot("order-summary.png", {
      mask: [addressCard, paymentCard],
    });
  }

  async validateOrderConfirmation(): Promise<void> {
    const confirmationOrder = this.page.getByText(
      "Thank you for your purchase",
    );
    await expect(confirmationOrder).toBeVisible();
  }
}
