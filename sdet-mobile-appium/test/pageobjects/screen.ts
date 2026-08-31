import type { ChainablePromiseElement } from "webdriverio";

/**
 * Main Screen object containing all methods, selectors, and functionality
 * shared across all mobile screens.
 */
export default class Screen {
  /**
   * Wait for an element to be displayed.
   * @param element The target WebdriverIO chainable element.
   * @param timeout Optional custom timeout in milliseconds.
   */
  public async waitForElement(
    element: ChainablePromiseElement,
    timeout: number = 10000,
  ) {
    await element.waitForDisplayed({ timeout });
  }
}
