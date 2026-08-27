import { test, expect } from "../../src/fixtures/juiceTest";
import { ProductClient } from "../../src/api/ProductClient";
import { BasketClient } from "../../src/api/BasketClient";
import { AddressClient } from "../../src/api/AddressClient";
import { JuiceProduct } from "../../src/types/product.types";
import { CardClient } from "../../src/api/CardClient";
import { UserFactory } from "../../src/factories/userFactory";

test.describe("owasp juice shop - hybrid checkout flow", () => {
  test("should complete a checkout flow using seeded API data", async ({
    juiceShopPage,
    juiceSession,
    request,
  }) => {
    // Arrange
    const productClient = new ProductClient(request);
    const basketClient = new BasketClient(request);
    const addressClient = new AddressClient(request);
    const cardClient = new CardClient(request);

    const token = juiceSession.token;
    const basketId = juiceSession.basketId;

    const searchResponse = await productClient.searchProducts("Apple Juice");
    expect(searchResponse.ok()).toBeTruthy();
    const searchBody = await searchResponse.json();
    const appleJuice = searchBody.data.find(
      (product: JuiceProduct) => product.name === "Apple Juice (1000ml)",
    );
    expect(appleJuice).toBeDefined();

    const addResponse = await basketClient.addBasketItem(token, {
      ProductId: appleJuice.id,
      BasketId: basketId,
      quantity: 1,
    });
    expect(addResponse.ok()).toBeTruthy();

    const addressPayload = await UserFactory.createValidAddressPayload();
    const addressResponse = await addressClient.createAddress(
      token,
      addressPayload,
    );
    expect(addressResponse.ok()).toBeTruthy();

    const cardPayload = await UserFactory.createValidCardPayload();
    const cardResponse = await cardClient.createCard(token, cardPayload);
    expect(cardResponse.ok()).toBeTruthy();

    // Act
    await juiceShopPage.goToBasket();
    await juiceShopPage.clickCheckout();
    await juiceShopPage.selectAddress(addressPayload.streetAddress);
    await juiceShopPage.selectDeliveryMethod("Standard Delivery");
    await juiceShopPage.selectPaymentMethod(cardPayload.fullName);
    await juiceShopPage.validateSummaryVisual();
    await juiceShopPage.placeOrderAndPay();

    // Assert
    await juiceShopPage.validateOrderConfirmation();
  });
});
