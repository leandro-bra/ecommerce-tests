import { test, expect, APIRequestContext } from "@playwright/test";
import { LoginPage } from "../support/pages/login-page";
import usuarios from "./../fixtures/usuarios.json";
import { usuarioModel } from "../fixtures/usuario.model";
import { CadastroPage } from "../support/pages/cadastro-page";
import { deletaUsuario } from "../support/api-support";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
});

test.describe("Caminho feliz", () => {
  test("Deve cadastrar novo usuário com sucesso", async ({ page, request }) => {
    let usuario = {
      ...usuarios.usuarioSucesso,
    } as usuarioModel;

    const emailRandon = faker.internet.email;
    usuario.email = emailRandon({ firstName: usuario.primeiroNome });

    const loginPage = new LoginPage(page);
    const cadastroPage = new CadastroPage(page);

    await expect(loginPage.singUpCaption).toBeVisible();
    await loginPage.iniciaCadastro(usuario);
    await expect(cadastroPage.accountInfoCaption).toBeVisible();
    await cadastroPage.realizaCadastro(usuario);
    await expect(cadastroPage.accountCreated).toBeVisible();
    await deletaUsuario(request, usuario.email, usuario.senha);
  });
});

test.describe("Campos obrigatórios", () => {
  test("Deve exibir mensagem de campo obrigatório ao tentar criar conta sem preencher campo 'Name'", async ({
    page,
  }) => {
    let usuario = {
      ...usuarios.usuarioSucesso,
    } as usuarioModel;
    const emailRandon = faker.internet.email;
    usuario.email = emailRandon({ firstName: usuario.primeiroNome });
    usuario.nome = "";

    const loginPage = new LoginPage(page);

    await loginPage.iniciaCadastro(usuario);
    const mensagem = await loginPage.userName.evaluate((element) => {
      if (element instanceof HTMLInputElement) {
        return element.validationMessage;
      }
      throw new Error("O elemento não é um input de formulário");
    });
    expect(mensagem).not.toBe("");
  });

  test("Deve exibir mensagem de campo obrigatório ao tentar criar conta sem preencher campo 'Email Adress'", async ({
    page,
  }) => {
    let usuario = {
      ...usuarios.usuarioSucesso,
    } as usuarioModel;
    usuario.email = "";

    const loginPage = new LoginPage(page);

    await loginPage.iniciaCadastro(usuario);
    const mensagem = await loginPage.signUpEmail.evaluate((element) => {
      if (element instanceof HTMLInputElement) {
        return element.validationMessage;
      }
      throw new Error("O elemento não é um input de formulário");
    });
    expect(mensagem).not.toBeNull();
  });

  const usuario = { ...usuarios.usuarioSucesso } as usuarioModel;

  const camposObrigatorios = [
    "senha",
    "primeiroNome",
    "sobrenome",
    "endereco",
    "estado",
    "cidade",
    "cep",
    "celular",
  ] as const satisfies readonly (keyof usuarioModel)[];

  camposObrigatorios.forEach((chave) => {
    test(`Deve exibir mensagem 'Preencha esse campo' ao tentar concluir cadastro sem preencher campo ${chave}`, async ({
      page,
    }) => {
      const usuarioSemCampo = {
        ...usuario,
        email: `${usuario.primeiroNome.toLowerCase()}-${Date.now()}-${Math.random()
          .toString(10)
          .slice(2)}@example.com`,
        [chave]: "",
      } as usuarioModel;
      const loginPage = new LoginPage(page);
      const paginaCadastro = new CadastroPage(page);

      await loginPage.iniciaCadastro(usuarioSemCampo);
      await paginaCadastro.realizaCadastro(usuarioSemCampo);

      const elementoPorCampo = {
        senha: paginaCadastro.inputPassword,
        primeiroNome: paginaCadastro.inputFirstName,
        sobrenome: paginaCadastro.inputLastName,
        endereco: paginaCadastro.inputAdress,
        estado: paginaCadastro.inputState,
        cidade: paginaCadastro.inputCity,
        cep: paginaCadastro.inputZipCode,
        celular: paginaCadastro.inputMobileNumber,
      };
      const elemento = elementoPorCampo[chave];
      const mensagem = await elemento.evaluate((element) => {
        if (element instanceof HTMLInputElement) {
          return element.validationMessage;
        }
        throw new Error("O elemento não é um input de formulário");
      });

      await expect(mensagem).not.toBe("");
    });
  });
});

test.describe("Excessão", () => {
  test("Deve informar quando um usuario já esta cadastrado", async ({
    request,
    page,
  }) => {
    let usuario = {
      ...usuarios.usuarioSucesso,
    } as usuarioModel;
    usuario.email = faker.internet.email({ firstName: usuario.nome });
    const dadosConta = {
      name: usuario.nome,
      email: usuario.email,
      password: usuario.senha,
      title: usuario.genero,
      birth_date: usuario.diaNascimento,
      birth_month: usuario.mesNascimento,
      birth_year: usuario.anoNascimento,
      firstname: usuario.primeiroNome,
      lastname: usuario.sobrenome,
      company: usuario.empresa,
      address1: usuario.endereco,
      address2: usuario.complemento,
      country: usuario.pais,
      zipcode: usuario.cep,
      state: usuario.estado,
      city: usuario.cidade,
      mobile_number: usuario.celular,
    };

    const resposta = await request.post("/api/createAccount", {
      form: dadosConta,
    });
    expect(resposta.status()).toEqual(200);
    const corpoResposta = await resposta.text();
    expect(corpoResposta).toContain("User created!");

    const loginPage = new LoginPage(page);
    await loginPage.iniciaCadastro(usuario);
    await expect(loginPage.existEmailMessage).toContainText(
      "Email Address already exist!",
    );

    await deletaUsuario(request, usuario.email, usuario.senha)
  });
});
