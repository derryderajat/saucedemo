export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.cartIcon = '.shopping_cart_link';
    this.cartBadge = '.shopping_cart_badge';
    this.inventoryItems = '.inventory_item';
    this.productTitle = '.title';
    this.productNames = '.inventory_item_name';
    this.productDescriptions = '.inventory_item_desc';
    this.productPrices = '.inventory_item_price';
    this.productImages = '.inventory_item_img img';
    this.addToCartButtons = '.btn_inventory';
    this.removeButtons = '.btn_secondary';
    this.filterSelect = '[data-test="product_sort_container"]';
    this.footer = '.footer';
    this.socialTwitter = '.social_twitter a';
    this.socialFacebook = '.social_facebook a';
    this.socialLinkedin = '.social_linkedin a';
    this.copyright = '.footer_copy';
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
  }

  async addToCartByIndex(index) {
    await this.page.locator(this.addToCartButtons).nth(index).click();
  }

  async removeFromCartByIndex(index) {
    await this.page.locator(this.removeButtons).nth(index).click();
  }

  async addAllToCart() {
    const count = await this.page.locator(this.addToCartButtons).count();
    for (let i = 0; i < count; i++) {
      await this.addToCartByIndex(i);
    }
  }

  async removeAllFromCart() {
    const count = await this.page.locator(this.removeButtons).count();
    for (let i = 0; i < count; i++) {
      await this.removeFromCartByIndex(0); // always remove first, list updates
    }
  }

  async selectFilter(optionText) {
    await this.page.selectOption(this.filterSelect, { label: optionText });
  }

  async addFirstItemToCart() {
    await this.page.locator(this.addToCartButtons).first().click();
  }

  async openCart() {
    await this.page.click(this.cartIcon);
  }
}