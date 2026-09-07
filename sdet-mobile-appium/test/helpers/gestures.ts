import { driver } from "@wdio/globals";

interface Point {
  x: number;
  y: number;
}

interface PercentagePoint {
  x: number; // 0.0 to 1.0 (e.g. 0.5 = 50%)
  y: number; // 0.0 to 1.0
}

class Gestures {
  /**
   * Executes a pointer gesture swipe from relative starting coordinates to relative end coordinates.
   * @param from Start percentage coordinate { x: 0.8, y: 0.5 }
   * @param to End percentage coordinate { x: 0.2, y: 0.5 }
   * @param duration Duration in ms of the swipe drag
   */
  static async swipe(
    from: PercentagePoint,
    to: PercentagePoint,
    duration = 1000,
  ): Promise<void> {
    const { width, height } = await driver.getWindowRect();

    const startPixel: Point = {
      x: Math.round(width * from.x),
      y: Math.round(height * from.y),
    };

    const endPixel: Point = {
      x: Math.round(width * to.x),
      y: Math.round(height * to.y),
    };

    await driver
      .action("pointer", {
        parameters: { pointerType: "touch" },
      })
      .move({ x: startPixel.x, y: startPixel.y, duration: 0 })
      .down({ button: 0 })
      .pause(100) // Small pause for the touch to register before dragging
      .move({ x: endPixel.x, y: endPixel.y, duration })
      .up({ button: 0 })
      .perform();

    // Small stabilization pause after gesture completes
    await driver.pause(500);
  }

  /**
   * Swipes horizontally from right to left (standard next card in carousel).
   */
  static async swipeLeft(): Promise<void> {
    await this.swipe({ x: 0.85, y: 0.7 }, { x: 0.15, y: 0.7 }, 800);
  }

  /**
   * Swipes horizontally from left to right (previous card in carousel).
   */
  static async swipeRight(): Promise<void> {
    await this.swipe({ x: 0.15, y: 0.7 }, { x: 0.85, y: 0.7 }, 800);
  }

  /**
   * Swipes vertically upwards (scroll down page content).
   */
  static async swipeUp(): Promise<void> {
    await this.swipe({ x: 0.5, y: 0.8 }, { x: 0.5, y: 0.2 });
  }

  /**
   * Swipes vertically downwards (scroll up page content).
   */
  static async swipeDown(): Promise<void> {
    await this.swipe({ x: 0.5, y: 0.2 }, { x: 0.5, y: 0.8 });
  }
}

export default Gestures;
