import { $ } from "@wdio/globals";

export const CONTEXT_NATIVE = "NATIVE_APP";
export const CONTEXT_WEBVIEW_REGEX = /WEBVIEW_com\.wdiodemoapp|WEBVIEW/;

class WebviewScreen {
  /**
   * Native locators (accessible only while in NATIVE_APP context)
   */
  get webviewTab() {
    return $("~Webview");
  }

  get nativeContainer() {
    return $("android.webkit.WebView");
  }

  /**
   * Web DOM locators (accessible only while inside WEBVIEW context)
   * The demo app embeds the official WebdriverIO documentation page.
   */
  get heroSubtitle() {
    return $(".hero__subtitle");
  }

  get mainHeading() {
    return $("h1");
  }

  get navbarTitle() {
    return $(".navbar__title");
  }

  /**
   * Navigate to the WebView tab via native bottom navigation bar.
   */
  async navigateToWebviewTab(): Promise<void> {
    await this.webviewTab.waitForDisplayed({ timeout: 10000 });
    await this.webviewTab.click();
    await this.nativeContainer.waitForDisplayed({ timeout: 15000 });
  }

  /**
   * Polls until the WebView context is discovered by Appium, then switches execution into it.
   */
  async switchToWebviewContext(timeoutMs = 20000): Promise<string> {
    await driver.waitUntil(
      async () => {
        const contexts = (await driver.getContexts()) as string[];
        return contexts.some((ctx) => CONTEXT_WEBVIEW_REGEX.test(ctx));
      },
      {
        timeout: timeoutMs,
        timeoutMsg: `WebView context did not register within ${timeoutMs}ms. Available contexts: ${JSON.stringify(await driver.getContexts())}`,
        interval: 1000,
      },
    );

    const contexts = (await driver.getContexts()) as string[];
    const targetContext = contexts.find((ctx) =>
      CONTEXT_WEBVIEW_REGEX.test(ctx),
    )!;
    await driver.switchContext(targetContext);
    return targetContext;
  }

  /**
   * Safely switches back to the native application context.
   */
  async switchToNativeContext(): Promise<void> {
    await driver.switchContext(CONTEXT_NATIVE);
  }

  /**
   * Executes a direct deep link intent to open a screen instantly without UI navigation.
   *
   * @param route - Target route in the demo app (e.g. 'webview', 'swipe', 'login', 'forms')
   */
  async openDeepLink(route: string): Promise<void> {
    const deepLinkUrl = `wdio://${route}`;
    await driver.execute("mobile: deepLink", {
      url: deepLinkUrl,
      package: "com.wdiodemoapp",
    });
  }
}

export default new WebviewScreen();
