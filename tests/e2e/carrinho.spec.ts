import { test, expect } from "@playwright/test";
import { CarrinhoPage } from "../support/pages/carrinho-page";
import { ProdutosPage } from "../support/pages/produtos-page";

test.describe("Cenários de caminho feliz", () => {
  test("Deve exibir carrinho com um produto na lista", async ({ page }) => {
    const produtoPage = new ProdutosPage(page);
    await produtoPage.open();
    await produtoPage.adicionarUmProdutoNoCarrinho();

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
});
