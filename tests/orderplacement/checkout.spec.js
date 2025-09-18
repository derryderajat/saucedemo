import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageobjects/LoginPage.js';
import { InventoryPage } from '../../pageobjects/InventoryPage.js';
import { CartPage } from '../../pageobjects/CartPage.js';

test.describe('Order Placement & Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Cart kosong jika belum ada produk', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/.*cart.html/);
    await expect(page.locator(cartPage.cartItems)).toHaveCount(0);
  });

  test('Checkout 1 produk sampai selesai', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addFirstItemToCart();
    await expect(page.locator(inventoryPage.cartBadge)).toHaveText('1');
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/.*cart.html/);
    await expect(page.locator(cartPage.cartItems)).toHaveCount(1);

    await cartPage.clickCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    // Isi data checkout
    await page.fill('[data-test="firstName"]', 'Derry');
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('Derry');
    await page.fill('[data-test="lastName"]', 'Derajat');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('Derajat');
    await page.fill('[data-test="postalCode"]', '44444');
    await expect(page.locator('[data-test="postalCode"]')).toHaveValue('44444');

    await page.click('[data-test="continue"]');
    await expect(page).toHaveURL(/.*checkout-step-two.html/);

    await page.click('[data-test="finish"]');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });
});