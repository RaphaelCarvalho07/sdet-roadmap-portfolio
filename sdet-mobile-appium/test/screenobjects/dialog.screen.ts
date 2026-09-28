import { $ } from "@wdio/globals";
import Screen from "./screen.js";

/**
 * Screen object representing native alert dialogs and system modals.
 */

class DialogScreen extends Screen {
  /**
   * Locators for the native alert dialog.
   * Uses native Android UIAutomator selectors for system-level elements.
   */

  public get dialogTitle() {
    return $('android=new UiSelector().text("Success")');
  }

  public get btnOk() {
    return $('android=new UiSelector().text("OK")');
  }

  /**
   * Clicks the confirmation button to dismiss the dialog.
   */
  public async dismissDialog() {
    await this.btnOk.click();
  }
}

export default new DialogScreen();
