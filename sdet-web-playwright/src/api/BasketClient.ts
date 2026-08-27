import { APIRequestContext, APIResponse } from "@playwright/test";
import { JuiceAddBasketItemPayload } from "../types/basket.types";

export class BasketClient {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Adds a new basket item via Juice Shop REST API (POST /api/BasketItems/)
   * @param token The token used to authenticate the user.
   * @param payload The payload used to create a new basket item.
   */
  async addBasketItem(
    token: string,
    payload: JuiceAddBasketItemPayload,
  ): Promise<APIResponse> {
    return await this.request.post("/api/BasketItems/", {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Updates the quantity of a basket item via Juice Shop REST API (POST /api/BasketItems/:id)
   * @param token The token used to authenticate the user.
   * @param itemId The ID used to identify the basket item to be updated.
   */
  async updateBasketItemQuantity(
    token: string,
    itemId: number,
    quantity: number,
  ): Promise<APIResponse> {
    return await this.request.put(`/api/BasketItems/${itemId}`, {
      data: { quantity },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Deletes a basket item via Juice Shop REST API (POST /api/BasketItems/:id)
   * @param token The token used to authenticate the user.
   * @param itemId The ID used to identify the basket item to be deleted.
   */
  async deleteBasketItem(token: string, itemId: number): Promise<APIResponse> {
    return this.request.delete(`/api/BasketItems/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
