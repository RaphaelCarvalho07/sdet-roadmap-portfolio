import { test, expect } from "../../src/fixtures/juiceTest";
import { BasketClient } from "../../src/api/BasketClient";
import { ProductClient } from "../../src/api/ProductClient";

test.describe("owasp Juice Shop - Hybrid E2E Session Injection", () => {
  test("should open UI pre-authenticated bypassing login form", async ({
    juiceShopPage,
  }) => {
    // 1. Open the Account Menu in the top navbar
    await juiceShopPage.openAccountMenu();

    // 2. Assert that the logged-in User Profile button is visible
    await expect(juiceShopPage.userProfileButton).toBeVisible();
  });

  test("should seed basket via API and verify item in UI basket page", async ({
    juiceShopPage,
    juiceSession,
    request,
  }) => {
    const productClient = new ProductClient(request);
    const basketClient = new BasketClient(request);

    // Arrange: Add a product to the basket via API, bypassing UI
    const searchResponse = await productClient.searchProducts("apple");
    const searchBody = await searchResponse.json();
    const targetProduct = searchBody.data[0];
    const productId = targetProduct.id;
    const productName = targetProduct.name;

    const addResponse = await basketClient.addBasketItem(juiceSession.token, {
      ProductId: productId,
      BasketId: juiceSession.basketId,
      quantity: 2,
    });
    expect(addResponse.ok()).toBeTruthy();

    // Act: Navigate to the basket page
    await juiceShopPage.goToBasket();

    // Assert: Verify the product is visible in the basket table
    await juiceShopPage.validateItemBasket(productName);
  });
});
