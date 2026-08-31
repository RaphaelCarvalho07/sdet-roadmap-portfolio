import { $ } from "@wdio/globals";
import Screen from "./screen.js";

/**
 * Screen object containing locators and action methods for the Login screen.
 */
class LoginScreen extends Screen {
  public get tabLogin() {
    return $("~Login");
  }

  public get inputEmail() {
    return $("~input-email");
  }

  public get inputPassword() {
    return $("~input-password");
  }

  public get btnLoginSubmit() {
    return $("~button-LOGIN");
  }

  public async navigateToLoginTab() {
    await this.tabLogin.click();
    await this.waitForElement(this.inputEmail);
  }

  public async submitLogin(email: string, password: string) {
    await this.inputEmail.setValue(email);
    await this.inputPassword.setValue(password);
    await this.btnLoginSubmit.click();
  }
}

export default new LoginScreen();
