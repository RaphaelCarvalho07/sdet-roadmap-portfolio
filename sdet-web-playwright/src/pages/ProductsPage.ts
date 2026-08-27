import { Page, Locator, expect } from "@playwright/test";

export class ProductsPage {
  private readonly page: Page;
  private readonly cartLink: Locator;
  private readonly productItemName: Locator;
  private readonly cartItemContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = this.page.getByTestId("shopping-cart-link");
    this.productItemName = this.page.getByTestId('inventory-item-name');
    this.cartItemContainer = this.page.locator(".cart_item");
  }
  // Actions
  async addProductToCart(productName: string): Promise<void> {
    const formattedName = productName.toLowerCase().replace(/\s+/g, "-");
    await this.page.getByTestId(`add-to-cart-${formattedName}`).click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  // Assertions
  async validateProductInCart(productName: string): Promise<void> {
    const scopedItemContainer = this.cartItemContainer.filter({ hasText: productName });

    const itemNameLocator = scopedItemContainer.locator(this.productItemName);
    await itemNameLocator.waitFor({ state: "visible" });
  }

  async validateProductsAreNotVisible(): Promise<void> {
    await expect(this.productItemName).not.toBeVisible();
  }
}
