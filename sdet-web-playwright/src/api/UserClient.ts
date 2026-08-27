import { APIRequestContext, APIResponse } from "@playwright/test";
import {
  JuiceUserRegistrationPayload,
  JuiceUserLoginPayload,
} from "../types/user.types";

export class UserClient {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Registers a new user via Juice Shop REST API (POST /api/Users/)
   * @param payload The payload used to create a new juice user.
   */
  async registerUser(
    payload: JuiceUserRegistrationPayload,
  ): Promise<APIResponse> {
    return await this.request.post("/api/Users/", {
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Authenticates a user via Juice Shop REST API (POST /rest/user/login)
   * Returns JWT token and authentication details
   */

  async loginUser(payload: JuiceUserLoginPayload): Promise<APIResponse> {
    return await this.request.post("/rest/user/login", {
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
