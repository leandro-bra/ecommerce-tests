import { test, expect, Locator } from "@playwright/test";
import { CarrinhoPage } from "../support/pages/carrinho-page";
import { ProdutosPage } from "../support/pages/produtos-page";

test.beforeEach(async ({ page }) => {
  const produtoPage = new ProdutosPage(page);
  await produtoPage.open();
  await produtoPage.adicionarUmProdutoNoCarrinho();
});

async function extrairNumero(elementoComValor: Locator) {
  const texto = await elementoComValor.innerText();
  const valorNumerico =
    texto
      .match(/-?\d[\d.,]*/)?.[0] // pega só o número dentro do texto
      ?.replace(/\.(?=\d{3}(?:[^\d]|$))/g, "") // remove ponto de milhar
      .replace(",", ".") ?? "0";
  return Number.parseFloat(valorNumerico);
}

test.describe("Cenários de caminho feliz", () => {
  test("Deve exibir carrinho com um produto na lista", async ({ page }) => {
    const carrinhoPage = new CarrinhoPage(page);
    await carrinhoPage.open();
    await expect(carrinhoPage.tituloCarrinho).toBeVisible();
    await expect(carrinhoPage.linkDetalheProduto).toHaveAttribute(
      "href",
      "/product_details/1",
    );
    await expect(carrinhoPage.precoPrimeiroProduto).not.toBeEmpty();
    await expect(carrinhoPage.quantidadePrimeiroProduto).toHaveText("1");
    await expect(carrinhoPage.precoTotal).not.toBeEmpty();
    await expect(carrinhoPage.botaoRemoverProduto).toBeVisible();
    await expect(carrinhoPage.botaoCheckout).toBeVisible();
  });

  test("Deve exibir preço total corretamente no carrinho", async ({ page }) => {
    const carrinhoPage = new CarrinhoPage(page);
    await carrinhoPage.open();
    await expect(carrinhoPage.tituloCarrinho).toBeVisible();
    await expect(carrinhoPage.linkDetalheProduto).toHaveAttribute(
      "href",
      "/product_details/1",
    );

    const valorProduto = await extrairNumero(carrinhoPage.precoPrimeiroProduto);
    const quantidadeProduto = await extrairNumero(
      carrinhoPage.quantidadePrimeiroProduto,
    );
    const total = await extrairNumero(carrinhoPage.precoTotal);
    await expect(carrinhoPage.precoPrimeiroProduto).not.toBeEmpty();
    expect(quantidadeProduto).toEqual(1);
    expect(total).toEqual(500);
    expect(valorProduto * quantidadeProduto).toEqual(total);
  });

  test("Deve exibir preço total corretamente com 2 produtos no carrinho", async ({
    page,
  }) => {
    const produtoPage = new ProdutosPage(page);
    await produtoPage.adicionarUmProdutoNoCarrinho();

    const carrinhoPage = new CarrinhoPage(page);
    await carrinhoPage.open();
    await expect(carrinhoPage.tituloCarrinho).toBeVisible();
    await expect(carrinhoPage.linkDetalheProduto).toHaveAttribute(
      "href",
      "/product_details/1",
    );

    const valorProduto = await extrairNumero(carrinhoPage.precoPrimeiroProduto);
    const quantidadeProduto = await extrairNumero(
      carrinhoPage.quantidadePrimeiroProduto,
    );
    const total = await extrairNumero(carrinhoPage.precoTotal);
    await expect(carrinhoPage.precoPrimeiroProduto).not.toBeEmpty();
    expect(quantidadeProduto).toEqual(2);
    expect(total).toEqual(1000);
    expect(valorProduto * quantidadeProduto).toEqual(total);
  });
});
