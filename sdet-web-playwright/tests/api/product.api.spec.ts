import { test, expect } from "@playwright/test";
import { ProductClient } from "../../src/api/ProductClient";
import { juiceProductSearchResponseSchema } from "../../src/schemas/product.schema";

test.describe("owasp Juice Shop API - Product", () => {
  test("should search for products and validate API response contract", async ({
    request,
  }) => {
    //Arrange
    const productClient = new ProductClient(request);
    const searchTerm = "apple";

    //Act
    const response = await productClient.searchProducts(searchTerm);
    expect(response.ok()).toBeTruthy();

    const searchResponse = await response.json();

    //Assert
    const parsedData = juiceProductSearchResponseSchema.parse(searchResponse);
    expect(parsedData.data.length).toBeGreaterThan(0);
    expect(parsedData.data[0].name).toBeDefined();
    expect(parsedData.data[0].name).toBe("Apple Juice (1000ml)");
  });
});
