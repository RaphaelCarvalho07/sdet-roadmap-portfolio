import {
  JuiceUserRegistrationPayload,
  JuiceUserLoginPayload,
} from "../types/user.types";
import { JuiceAddressPayload } from "../types/address.types";
import { JuiceCardPayload } from "../types/card.types";

export class UserFactory {
  /**
   * Generates a valid dynamic payload for Juice Shop User Registration
   */
  static async createValidJuiceUserPayload(): Promise<JuiceUserRegistrationPayload> {
    const { faker } = await import("@faker-js/faker");
    const password = `Pass_${faker.string.alphanumeric(8)}`;
    return {
      email: faker.internet.email({ provider: "sdet-test.com" }).toLowerCase(),
      password: password,
      repeatPassword: password,
      securityQuestion: {
        id: 1,
        question: "Your eldest sibling's middle name?",
      },
      securityAnswer: faker.person.middleName(),
    };
  }

  /**
   * Creates a Juice Shop Login payload for a known email and password
   */
  static createJuiceLoginPayload(
    email: string,
    password: string,
  ): JuiceUserLoginPayload {
    return {
      email,
      password,
    };
  }

  /**
   * Generates a valid dynamic payload for Juice Shop Address creation
   */
  static async createValidAddressPayload(): Promise<JuiceAddressPayload> {
    const { faker } = await import("@faker-js/faker");
    return {
      fullName: faker.person.fullName(),
      mobileNum: faker.number.int({ min: 10000000, max: 99999999 }),
      zipCode: faker.location.zipCode("#####"),
      streetAddress: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
    };
  }

  /**
   * Generates a valid dynamic payload for Juice Shop Card creation
   */
  static async createValidCardPayload(): Promise<JuiceCardPayload> {
    const { faker } = await import("@faker-js/faker");
    return {
      fullName: faker.person.fullName(),
      cardNum: faker.number.int({
        min: 1000000000000000,
        max: 9999999999999999,
      }),
      expMonth: faker.number.int({ min: 1, max: 12 }),
      expYear: faker.number.int({ min: 2080, max: 2099 }),
    };
  }
}
