export class InventoryItemPage {
  constructor(page) {
    this.page = page;
    this.productImage = '.inventory_details_img';
    this.productTitle = '.inventory_details_name';
    this.productDesc = '.inventory_details_desc';
    this.productPrice = '.inventory_details_price';
    this.addToCartButton = 'button.btn_primary';
    this.removeButton = 'button.btn_secondary';
    this.backButton = 'button[data-test="back-to-products"]';
    this.cartBadge = '.shopping_cart_badge';
  }

  async addToCart() {
    await this.page.click(this.addToCartButton);
  }

  async removeFromCart() {
    await this.page.click(this.removeButton);
  }

  async backToProducts() {
    await this.page.click(this.backButton);
  }
}