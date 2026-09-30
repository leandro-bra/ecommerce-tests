import { Locator, Page } from "@playwright/test";
import { usuarioModel } from "../../fixtures/usuario.model";

export class LoginPage {
  readonly page: Page;
  readonly loginCaption: Locator;
  readonly singUpCaption: Locator;
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly userName: Locator;
  readonly signUpEmail: Locator;
  readonly signUpButton: Locator;
  readonly existEmailMessage: Locator;
  readonly incorrectCredentials: Locator;
  readonly logout: Locator;
  readonly deleteAccount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginCaption = page.getByRole("heading", {
      name: "Login to your account",
    });
    this.singUpCaption = page.getByRole("heading", {
      name: "New User Signup!",
    });
    this.loginEmail = page.locator('[data-qa="login-email"]');
    this.loginPassword = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.userName = page.locator('[data-qa="signup-name"]');
    this.signUpEmail = page.locator('[data-qa="signup-email"]');
    this.signUpButton = page.locator('[data-qa="signup-button"]');
    this.existEmailMessage = page.getByText("Email Address already exist!");
    this.incorrectCredentials = page.getByText(
      "Your email or password is incorrect!",
    );
    this.logout = page.getByRole("link", { name: "logout" });
    this.deleteAccount = page
      .getByRole("listitem")
      .filter({ hasText: "Delete Account" });
  }

  async open() {
    await this.page.goto("/login");
  }

  async realizaLogin(email: string, senha: string) {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(senha);
    await this.loginButton.click();
  }

  async iniciaCadastro(usuario: usuarioModel) {
    await this.userName.fill(usuario.nome);
    await this.signUpEmail.fill(usuario.email);
    await this.signUpButton.click();
  }
}
