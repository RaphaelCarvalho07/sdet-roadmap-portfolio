import { expect } from "@wdio/globals";
import SwipeScreen from "../pageobjects/swipe.screen.js";
import Gestures from "../helpers/gestures.js";

describe("Mobile Gestures - Carousel Horizontal Swipe", () => {
  before(async () => {
    await SwipeScreen.openSwipeScreen();
  });

  it("should display the first card initially and NOT the third card", async () => {
    const isFirstVisible = await SwipeScreen.isFirstCardVisible();
    expect(isFirstVisible).toBe(true);

    const isThirdVisible = await SwipeScreen.isThirdCardVisible();
    expect(isThirdVisible).toBe(false);
  });

  it("should swipe left and reveal the subsequent cards", async () => {
    await Gestures.swipeLeft();
    await Gestures.swipeLeft();
    await SwipeScreen.waitForThirdCard();

    const isThirdVisible = await SwipeScreen.isThirdCardVisible();
    expect(isThirdVisible).toBe(true);
  });
});
