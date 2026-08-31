import { expect } from "@wdio/globals";
import LoginScreen from "../pageobjects/login.screen.js";
import DialogScreen from "../pageobjects/dialog.screen.js";

describe("WDIO Native Demo App - Login Flow", () => {
  it("should navigate to login tab and submit valid credentials using Page Objects", async () => {
    // 1. Navigate to the Login screen via the bottom navigation bar
    await LoginScreen.navigateToLoginTab();

    // 2. Fill in the credentials and click the Login button
    await LoginScreen.submitLogin("test@example.com", "SuperPassword123!");

    // 3. Validate the display of the native success dialog
    await expect(DialogScreen.dialogTitle).toBeDisplayed();

    // 4. Close the native dialog
    await DialogScreen.dismissDialog();
  });
});
