import { test, expect } from "@playwright/test";
import { ProdutosPage } from "../support/pages/produtos-page";

test.beforeEach(async ({ page }) => {
  const produtoPage = new ProdutosPage(page);
  await produtoPage.open();
});

test.describe("Cenários de caminho feliz", () => {
  test("Deve adicionar um produto no carrinho", async ({ page }) => {
    const produtoPage = new ProdutosPage(page);
    await expect(produtoPage.titleAllProducts).toBeVisible();
    await produtoPage.adicionarUmProdutoNoCarrinho();
  });
});
