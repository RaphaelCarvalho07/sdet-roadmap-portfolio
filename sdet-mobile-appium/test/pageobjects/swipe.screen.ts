import { $ } from "@wdio/globals";
import Screen from "./screen.js";

class SwipeScreen extends Screen {
  // Bottom navigation tab
  private get swipeTab() {
    return $("~Swipe");
  }

  // Title / header of the swipe screen
  private get swipeTitle() {
    return $('android=new UiSelector().text("Swipe horizontal")');
  }

  // Carousel card headers (the demo app cards have distinct titles)
  private get firstCardText() {
    return $('android=new UiSelector().textContains("FULLY OPEN SOURCE")');
  }

  private get secondCardText() {
    return $('android=new UiSelector().textContains("GREAT COMMUNITY")');
  }

  private get thirdCardText() {
    return $('android=new UiSelector().textContains("JS.FOUNDATION")');
  }

  async openSwipeScreen(): Promise<void> {
    await this.swipeTab.click();
    await this.waitForElement(this.swipeTitle);
  }

  async isFirstCardVisible(): Promise<boolean> {
    return await this.firstCardText.isDisplayed();
  }

  async isSecondCardVisible(): Promise<boolean> {
    return await this.secondCardText.isDisplayed();
  }

  async isThirdCardVisible(): Promise<boolean> {
    return await this.thirdCardText.isDisplayed();
  }

  async waitForThirdCard(): Promise<void> {
    await this.thirdCardText.waitForDisplayed({
      timeout: 5000,
      timeoutMsg: "Third carousel card was not displayed after swiping",
    });
  }
}

export default new SwipeScreen();
