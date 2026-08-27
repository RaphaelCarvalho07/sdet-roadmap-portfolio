import { CheckoutPayload } from '../types/checkout.types';

export class CheckoutFactory {
  /**
   * Generates a completely valid and realistic set of checkout data (Object Mother base).
   */
  static async createValidCheckoutData(): Promise<CheckoutPayload> {
    const { faker } = await import('@faker-js/faker');
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      postalCode: faker.location.zipCode()
    };
  }

  /**
   * Object Mother variant: returns valid checkout data but with the first name missing.
   */
  static async createCheckoutDataWithMissingFirstName(): Promise<CheckoutPayload> {
    const data = await this.createValidCheckoutData();
    data.firstName = "";
    return data;
  }

  /**
   * Object Mother variant: returns valid checkout data but with the last name missing.
   */
  static async createCheckoutDataWithMissingLastName(): Promise<CheckoutPayload> {
    const data = await this.createValidCheckoutData();
    data.lastName = "";
    return data;
  }

  /**
   * Object Mother variant: returns valid checkout data but with the postal/zip code missing.
   */
  static async createCheckoutDataWithMissingPostalCode(): Promise<CheckoutPayload> {
    const data = await this.createValidCheckoutData();
    data.postalCode = "";
    return data;
  }
}
