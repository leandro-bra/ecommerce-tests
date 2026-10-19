import { APIRequestContext, expect } from "@playwright/test";
import { usuarioModel } from "../fixtures/usuario.model";

export async function cadastraUsuario(
  request: APIRequestContext,
  usuario: usuarioModel,
) {
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
}

export async function deletaUsuario(
  request: APIRequestContext,
  email: string,
  senha: string,
) {
  const dadosConta = {
    email: email,
    password: senha,
  };
  const resposta = await request.delete("/api/deleteAccount", {
    form: dadosConta,
  });
  const corpoResposta = await resposta.text();
  expect(resposta.status()).toEqual(200);
  expect(corpoResposta).toContain("Account deleted!");
}
