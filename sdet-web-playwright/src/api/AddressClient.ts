import { APIRequestContext, APIResponse } from "@playwright/test";

import { JuiceAddressPayload } from "../types/address.types";

export class AddressClient {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }
  /**
   * Adds a new address via Juice Shop REST API (POST /api/Addresss/)
   * @param token The token used to authenticate the user.
   * @param payload The payload used to create a new address.
   */
  async createAddress(
    token: string,
    payload: JuiceAddressPayload,
  ): Promise<APIResponse> {
    return this.request.post("/api/Addresss/", {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }
}
