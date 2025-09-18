export class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = '.cart_item';
    this.checkoutButton = '[data-test="checkout"]';
    this.removeButton = '.cart_item .btn_secondary';
  }

  async getCartItemsCount() {
    return await this.page.locator(this.cartItems).count();
  }

  async clickCheckout() {
    await this.page.click(this.checkoutButton);
  }

  async removeFirstItem() {
    await this.page.click(this.removeButton);
  }
}