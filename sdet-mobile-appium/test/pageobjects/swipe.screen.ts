import { $ } from "@wdio/globals";
import Screen from "./screen.js";
import Gestures from "../helpers/gestures.js";

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

  get hiddenText() {
    return $('android=new UiSelector().text("You found me!!!")');
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

  async scrollToHiddenText(maxScrolls: number = 5): Promise<void> {
    let scrolls = 0;
    while (!(await this.hiddenText.isDisplayed()) && scrolls < maxScrolls) {
      if (scrolls === 0) {
        // 1st scroll: Carousel is in lower viewport; swipe in upper safe zone
        await Gestures.swipe({ x: 0.5, y: 0.35 }, { x: 0.5, y: 0.05 }, 400);
      } else {
        // Subsequent scrolls: Carousel moved to top; swipe in lower safe zone
        await Gestures.swipe({ x: 0.5, y: 0.8 }, { x: 0.5, y: 0.35 }, 400);
      }
      scrolls++;
    }

    if (!(await this.hiddenText.isDisplayed())) {
      throw new Error(
        `Element was not found after ${maxScrolls} scroll attempts.`,
      );
    }
  }
}

export default new SwipeScreen();
