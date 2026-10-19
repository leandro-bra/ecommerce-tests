import { test, expect } from "@playwright/test";
import { LoginPage } from "../support/pages/login-page";
import { usuarioModel } from "../fixtures/usuario.model";
import usuarios from "./../fixtures/usuarios.json";
import { cadastraUsuario, deletaUsuario } from "../support/api-support";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
});

test.describe("Cenários de caminho feliz", () => {
  test("Deve realizar login com sucesso", async ({ page, request }) => {
    const loginPage = new LoginPage(page);
    let usuario = {
      ...usuarios.usuarioSucesso,
    } as usuarioModel;
    usuario.email = faker.internet.email({ firstName: usuario.nome });
    await cadastraUsuario(request, usuario);
    await loginPage.realizaLogin(usuario.email, usuario.senha);
    await expect(loginPage.logout).toBeVisible();
    await expect(loginPage.deleteAccount).toBeVisible();
    await deletaUsuario(request, usuario.email, usuario.senha);
  });
});

test.describe("Cenários de excessão", () => {
  test("Deve apresentar mensagem de falha ao tentar realizar login com Email não cadastrado", async ({
    page,
    request,
  }) => {
    let usuario = { ...usuarios.usuarioSucesso } as usuarioModel;
    usuario.email = faker.internet.email({ firstName: usuario.nome });
    await cadastraUsuario(request, usuario);
    const emailInvalido = "null@email.null";
    const loginPage = new LoginPage(page);
    await loginPage.realizaLogin(emailInvalido, usuario.senha);
    await expect(loginPage.incorrectCredentials).toBeVisible();
    await deletaUsuario(request, usuario.email, usuario.senha);
  });

  test("Deve apresentar mensagem de falha ao tentar realizar login com Senha incorreta", async ({
    page,
    request,
  }) => {
    let usuario = { ...usuarios.usuarioSucesso } as usuarioModel;
    usuario.email = faker.internet.email({ firstName: usuario.nome });
    await cadastraUsuario(request, usuario);
    const senhaInvalida = "invalidPassword";
    const loginPage = new LoginPage(page);
    await loginPage.realizaLogin(usuario.email, senhaInvalida);
    await expect(loginPage.incorrectCredentials).toBeVisible();
    await deletaUsuario(request, usuario.email, usuario.senha);
  });
});
