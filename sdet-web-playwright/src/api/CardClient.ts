import { APIRequestContext, APIResponse } from "@playwright/test";

import { JuiceCardPayload } from "../types/card.types";

export class CardClient {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createCard(
    token: string,
    payload: JuiceCardPayload,
  ): Promise<APIResponse> {
    return this.request.post("/api/Cards", {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }
}
