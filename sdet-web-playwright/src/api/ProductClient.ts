import { APIRequestContext, APIResponse } from "@playwright/test";

export class ProductClient {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Searches products via Juice Shop REST API (GET /rest/products/search?q=${query})
   * @param query The query parameter used to create a new juice user.
   */
  async searchProducts(query: string): Promise<APIResponse> {
    return await this.request.get(`/rest/products/search?q=${query}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
