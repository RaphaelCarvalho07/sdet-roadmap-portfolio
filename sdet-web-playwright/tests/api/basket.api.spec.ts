import { test, expect } from "@playwright/test";
import { BasketClient } from "../../src/api/BasketClient";
import { UserFactory } from "../../src/factories/userFactory";
import { UserClient } from "../../src/api/UserClient";
import { juiceBasketItemResponseSchema } from "../../src/schemas/basket.schema";

test.describe("owasp Juice Shop API - Basket", () => {
  let userClient: UserClient;
  let basketClient: BasketClient;
  let token: string;
  let basketId: number | string;

  test.beforeEach(
    "create a valid juice user and login",
    async ({ request }) => {
      userClient = new UserClient(request);
      basketClient = new BasketClient(request);
      const registrationPayload =
        await UserFactory.createValidJuiceUserPayload();
      const regResponse = await userClient.registerUser(registrationPayload);
      expect(regResponse.ok()).toBeTruthy();

      const loginPayload = UserFactory.createJuiceLoginPayload(
        registrationPayload.email,
        registrationPayload.password,
      );
      const loginUserResponse = await userClient.loginUser(loginPayload);
      expect(loginUserResponse.ok()).toBeTruthy();

      const loginResponseBody = await loginUserResponse.json();
      token = loginResponseBody.authentication.token;
      basketId = loginResponseBody.authentication.bid;

      expect(token).not.toBeNull();
      expect(basketId).not.toBeNull();
    },
  );

  test("should add an item to the basket successfully", async () => {
    // Arrange
    const payload = {
      ProductId: 1,
      BasketId: basketId,
      quantity: 1,
    };

    // Act
    const response = await basketClient.addBasketItem(token, payload);
    expect(response.ok()).toBeTruthy();

    // Assert
    const responseBody = await response.json();
    const parseData = juiceBasketItemResponseSchema.parse(responseBody);

    expect(parseData.status).toBe("success");
    expect(parseData.data.ProductId).toBe(1);
    expect(parseData.data.quantity).toBe(1);
  });

  test("should update basket item quantity successfully", async () => {
    // Arrange
    const payload = {
      ProductId: 1,
      BasketId: basketId,
      quantity: 1,
    };
    const addResponse = await basketClient.addBasketItem(token, payload);
    const addBody = await addResponse.json();
    const itemId = addBody.data.id;
    expect(itemId).not.toBeNull();

    // Act
    const updateResponse = await basketClient.updateBasketItemQuantity(
      token,
      itemId,
      5,
    );
    expect(updateResponse.ok()).toBeTruthy();

    // Assert
    const updateBody = await updateResponse.json();
    const parseData = juiceBasketItemResponseSchema.parse(updateBody);

    expect(parseData.status).toBe("success");
    expect(parseData.data.quantity).toBe(5);
  });

  test("should delete an item from the basket successfully", async () => {
    // Arrange
    const payload = { ProductId: 1, BasketId: basketId, quantity: 1 };
    const addResponse = await basketClient.addBasketItem(token, payload);
    const addBody = await addResponse.json();
    const itemId = addBody.data.id;

    // Act
    const deleteResponse = await basketClient.deleteBasketItem(token, itemId);

    // Assert
    expect(deleteResponse.ok()).toBeTruthy();
  });
});
