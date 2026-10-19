import { expect, Locator, Page } from "@playwright/test";
import { usuarioModel } from "../../fixtures/usuario.model";

export class CadastroPage {
  readonly page: Page;
  readonly accountInfoCaption: Locator;
  readonly genderMaleRadio: Locator;
  readonly genderFemaleRadio: Locator;
  readonly inputName: Locator;
  readonly inputEmail: Locator;
  readonly inputPassword: Locator;
  readonly dayOfBirth: Locator;
  readonly monthOfBirth: Locator;
  readonly yearOfBirth: Locator;
  readonly checkboxNewsLetter: Locator;
  readonly checkboxOffers: Locator;
  readonly adressInfoCaption: Locator;
  readonly inputFirstName: Locator;
  readonly inputLastName: Locator;
  readonly inputCompany: Locator;
  readonly inputAdress: Locator;
  readonly inputAdressTwo: Locator;
  readonly selectCountry: Locator;
  readonly inputState: Locator;
  readonly inputCity: Locator;
  readonly inputZipCode: Locator;
  readonly inputMobileNumber: Locator;
  readonly buttonCreateAccount: Locator;
  readonly accountCreated: Locator;
  readonly buttonContinue: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountInfoCaption = page.getByRole("heading", {
      name: "Enter Account Information",
    });
    this.genderMaleRadio = page.getByRole("radio", { name: "Mr" });
    this.genderFemaleRadio = page.getByRole("radio", { name: "Mrs" });
    this.inputName = page.locator('[data-qa="name"]');
    this.inputEmail = page.locator('[data-qa="email"]');
    this.inputPassword = page.getByRole("textbox", { name: "password" });
    this.dayOfBirth = page.locator("css=#days");
    this.monthOfBirth = page.locator('[data-qa="months"]');
    this.yearOfBirth = page.locator('[data-qa="years"]');
    this.checkboxNewsLetter = page.locator("css=#newsletter");
    this.checkboxOffers = page.locator("css=#optin");
    this.adressInfoCaption = page.getByRole("heading", {
      name: "Address Information",
    });
    this.inputFirstName = page.locator('[data-qa="first_name"]');
    this.inputLastName = page.locator('[data-qa="last_name"]');
    this.inputCompany = page.locator('[data-qa="company"]');
    this.inputAdress = page.locator('[data-qa="address"]');
    this.inputAdressTwo = page.locator('[data-qa="address2"]');
    this.selectCountry = page.locator('[data-qa="country"]');
    this.inputState = page.locator('[data-qa="state"]');
    this.inputCity = page.locator('[data-qa="city"]');
    this.inputZipCode = page.locator('[data-qa="zipcode"]');
    this.inputMobileNumber = page.locator('[data-qa="mobile_number"]');
    this.buttonCreateAccount = page.locator('[data-qa="create-account"]');
    this.accountCreated = page.locator('[data-qa="account-created"]');
    this.buttonContinue = page.locator('[data-qa="continue-button"]');
  }

  async realizaCadastro(usuario: usuarioModel) {
    if (usuario.genero == "Mr") {
      await this.genderMaleRadio.click();
    } else if (usuario.genero == "Mrs") {
      await this.genderFemaleRadio.click();
    }

    await expect(this.inputName).toHaveValue(usuario.nome);
    await expect(this.inputEmail).toHaveValue(usuario.email);
    await this.inputPassword.fill(usuario.senha);
    await this.dayOfBirth.selectOption(usuario.diaNascimento);
    await this.monthOfBirth.selectOption(usuario.mesNascimento);
    await this.yearOfBirth.selectOption(usuario.anoNascimento);
    await this.inputFirstName.fill(usuario.primeiroNome);
    await this.inputLastName.fill(usuario.sobrenome);
    await this.inputCompany.fill(usuario.empresa);
    await this.inputAdress.fill(usuario.endereco);
    await this.selectCountry.selectOption(usuario.pais);
    await this.inputState.fill(usuario.estado);
    await this.inputCity.fill(usuario.cidade);
    await this.inputZipCode.fill(usuario.cep);
    await this.inputMobileNumber.fill(usuario.celular);
    await this.buttonCreateAccount.click();

  }






}
