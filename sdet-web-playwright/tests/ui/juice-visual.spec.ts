import { test, expect } from "../../src/fixtures/juiceTest";
import { AddressClient } from "../../src/api/AddressClient";
import { CardClient } from "../../src/api/CardClient";
import { ProductClient } from "../../src/api/ProductClient";
import { BasketClient } from "../../src/api/BasketClient";
import { JuiceShopPage } from "../../src/pages/JuiceShopPage";
import { JuiceProduct } from "../../src/types/product.types";

test.describe("owasp juice shop - component-level visual testing", () => {
  test(
    "should render the Delivery Address card correctly on the summary page",
    async ({ authenticatedUserPage, request, juiceSession }) => {
      const addressClient = new AddressClient(request);
      const cardClient = new CardClient(request);
      const productClient = new ProductClient(request);
      const basketClient = new BasketClient(request);
      const juiceShopPage = new JuiceShopPage(authenticatedUserPage);

      const token = juiceSession.token;
      const basketId = juiceSession.basketId;

      // 1. Seed item in the basket
      const searchResponse = await productClient.searchProducts("Apple Juice");
      expect(searchResponse.ok()).toBeTruthy();
      const searchBody = await searchResponse.json();
      const appleJuice = searchBody.data.find(
        (product: JuiceProduct) => product.name === "Apple Juice (1000ml)",
      );
      expect(appleJuice).toBeDefined();

      await basketClient.addBasketItem(token, {
        ProductId: appleJuice.id,
        BasketId: basketId,
        quantity: 1,
      });

      // 2. Seed a static, constant address (No Faker)
      const staticAddress = {
        country: "Brazil",
        fullName: "John Doe",
        mobileNum: 99999999,
        zipCode: "12345",
        streetAddress: "123 Static Avenue",
        city: "Sao Paulo",
        state: "SP",
      };
      const addressResponse = await addressClient.createAddress(token, staticAddress);
      expect(addressResponse.ok()).toBeTruthy();

      // 3. Seed a static, constant payment card (No Faker)
      const staticCard = {
        fullName: "John Doe",
        cardNum: 1111222233334444,
        expMonth: 12,
        expYear: 2090,
      };
      const cardResponse = await cardClient.createCard(token, staticCard);
      expect(cardResponse.ok()).toBeTruthy();

      // 4. Act: Navigate and progress to the order summary page
      await juiceShopPage.goToBasket();
      await juiceShopPage.clickCheckout();
      await juiceShopPage.selectAddress(staticAddress.streetAddress);
      await juiceShopPage.selectDeliveryMethod("Standard Delivery");
      await juiceShopPage.selectPaymentMethod(staticCard.fullName);

      // 5. Hide transient snackbars
      await authenticatedUserPage.addStyleTag({
        content: `
          mat-snack-bar-container,
          .mat-snack-bar-container,
          mat-mdc-snack-bar-container,
          .mat-mdc-snack-bar-container {
            display: none !important;
          }
        `,
      });

      // 6. Locate ONLY the address card container
      const addressCard = authenticatedUserPage
        .locator(".column mat-card")
        .filter({ hasText: "Delivery Address" });

      // 7. Assert: Perform UNMASKED visual validation of just the address card element
      await expect(addressCard).toHaveScreenshot("isolated-address-card.png");
    },
  );
});
