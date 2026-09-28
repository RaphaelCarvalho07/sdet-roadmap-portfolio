import { expect } from "@wdio/globals";
import WebviewScreen, {
  CONTEXT_NATIVE,
} from "../screenobjects/webview.screen.js";
import LoginScreen from "../screenobjects/login.screen.js";
import SwipeScreen from "../screenobjects/swipe.screen.js";

describe("📱 Mobile Hybrid Context Switching & Deep Linking", () => {
  beforeEach(async () => {
    // Ensure we start each test in the standard native context
    const currentContext = await driver.getContext();
    if (currentContext !== CONTEXT_NATIVE) {
      await WebviewScreen.switchToNativeContext();
    }
  });

  it("should switch from Native App to WebView, interact with DOM elements, and return to Native", async () => {
    // Step 1: Navigate to the WebView tab inside the native app
    await WebviewScreen.navigateToWebviewTab();

    // Step 2: Switch execution context to the embedded Webview
    const targetContext = await WebviewScreen.switchToWebviewContext();
    expect(targetContext).toMatch(/WEBVIEW/);

    // Step 3: Validate web elements inside the embedded browser DOM
    await expect(WebviewScreen.mainHeading).toBeDisplayed();
    const pageTitle = await driver.getTitle();
    expect(pageTitle).toContain("WebdriverIO");

    // Step 4: Safely transition back to the native context
    await WebviewScreen.switchToNativeContext();
    const restoredContext = await driver.getContext();
    expect(restoredContext).toBe(CONTEXT_NATIVE);

    // Step 5: Verify that native accessibility locators respond immediately
    await expect(WebviewScreen.webviewTab).toBeDisplayed();
  });

  it("should navigate directly to target screens via Deep Linking without UI traversal", async () => {
    // Deep link directly to the Login screen
    await WebviewScreen.openDeepLink("login");
    await expect(LoginScreen.inputEmail).toBeDisplayed();

    // Deep link directly to the Swipe screen
    await WebviewScreen.openDeepLink("swipe");
    await expect(SwipeScreen.swipeTitle).toBeDisplayed();
  });
});
