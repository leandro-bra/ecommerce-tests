import { Page, Locator } from "@playwright/test";

export class CarrinhoPage {
  readonly page: Page;
  readonly tituloCarrinho: Locator;
  readonly botaoCheckout: Locator;
  readonly carrinhoVazio: Locator;
  readonly primeiroProduto: Locator;
  readonly quantidadePrimeiroProduto: Locator;
  readonly precoPrimeiroProduto: Locator;
  readonly precoTotal: Locator;
  readonly botaoRemoverProduto: Locator;
  readonly linkDetalheProduto: Locator;
  readonly tituloModalCheckout: Locator;
  readonly linkLoginModalCheckout: Locator;
  readonly botaoContinuarCarrinho: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tituloCarrinho = page.getByText("Shopping Cart");
    this.botaoCheckout = page.getByText("Proceed To Checkout");
    this.carrinhoVazio = page.locator('[id="empty_cart"]');
    this.primeiroProduto = page.locator('id="product-1"');
    this.quantidadePrimeiroProduto = page.locator(".cart_quantity button");
    this.precoPrimeiroProduto = page.getByText("Rs.").first();
    this.precoTotal = page.locator(".cart_total_price");
    this.botaoRemoverProduto = page.locator(".cart_quantity_delete");
    this.linkLoginModalCheckout = page.getByRole("link", {
      name: "Register / Login",
    });
    this.botaoContinuarCarrinho = page.getByRole("button", {
      name: "Continue On Cart",
    });
    this.linkDetalheProduto = page.locator(".cart_description a").first();
    this.tituloModalCheckout = page.locator(".modal-header h4");
  }

  async open() {
    await this.page.goto("/view_cart");
  }
}
