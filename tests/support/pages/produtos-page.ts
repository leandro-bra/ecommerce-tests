import { Locator, Page, expect } from "@playwright/test";

//Mapear elementos da página produtos
//Tonar elementos da página produto visiveis
export class ProdutosPage {
  readonly page: Page;
  readonly inputBuscaProduto: Locator;
  readonly titleAllProducts: Locator;
  readonly buttonBuscaProduto: Locator;
  readonly buttonAddToCartPrimeiroProduto: Locator;
  readonly produtoOverlay: Locator;
  readonly titleProductAdded: Locator;
  readonly messageProductAdded: Locator;
  readonly buttonContinue: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputBuscaProduto = page.getByRole("textbox", {
      name: "Search Product",
    });
    this.produtoOverlay = page.locator(".product-image-wrapper").first();
    this.titleAllProducts = page.getByRole("heading", { name: "All Products" });
    this.buttonAddToCartPrimeiroProduto = page.locator(
      '.productinfo a.add-to-cart[data-product-id="1"]',
    );
    this.buttonBuscaProduto = page.locator("#submit_search");
    this.titleProductAdded = page.getByRole("heading", { name: "Added!" });
    this.messageProductAdded = page.getByText("Your product has been added");
    this.buttonContinue = page.getByRole("button", {
      name: "Continue Shopping",
    });
  }

  async open() {
    await this.page.goto("/products");
  }

  async adicionarUmProdutoNoCarrinho() {
    await this.buttonAddToCartPrimeiroProduto.click();
    await expect(this.titleProductAdded).toBeVisible();
    await expect(this.messageProductAdded).toBeVisible();
    await this.buttonContinue.click();
  }
}
