import { test, expect } from "@playwright/test";
import { UserClient } from "../../src/api/UserClient";
import { UserFactory } from "../../src/factories/userFactory";
import {
  juiceUserRegistrationResponseSchema,
  juiceUserLoginResponseSchema,
} from "../../src/schemas/user.schema";

let userClient: UserClient;

test.beforeEach(async ({ request }) => {
  userClient = new UserClient(request);
});

test.describe("owasp Juice Shop API - User Management & Auth", () => {
  test("should successfully register a new user and validate API contract", async () => {
    // Arrange: Generate dynamic registration payload
    const registrationPayload = await UserFactory.createValidJuiceUserPayload();

    // Action: Register user via REST API (POST /api/Users/)
    const response = await userClient.registerUser(registrationPayload);
    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    // Assert: Zod Contract Validation
    juiceUserRegistrationResponseSchema.parse(responseBody);

    // Assert: Business Data Validation
    expect(responseBody.status).toBe("success");
    expect(responseBody.data.email).toBe(registrationPayload.email);
  });

  test("should successfully authenticate a user and return JWT token", async () => {
    // Arrange: Register a dynamic user first
    const registrationPayload = await UserFactory.createValidJuiceUserPayload();
    await userClient.registerUser(registrationPayload);

    // Action: Login using the created user credentials (POST /rest/user/login)
    const loginPayload = UserFactory.createJuiceLoginPayload(
      registrationPayload.email,
      registrationPayload.password,
    );
    const response = await userClient.loginUser(loginPayload);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Assert: Zod Contract Validation for Login JWT response
    juiceUserLoginResponseSchema.parse(responseBody);

    // Assert: Business Data Validation
    expect(responseBody.authentication.umail).toBe(registrationPayload.email);
    expect(responseBody.authentication.token.length).toBeGreaterThan(20);
  });
});
