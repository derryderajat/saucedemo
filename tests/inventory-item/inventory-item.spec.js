import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageobjects/LoginPage.js';
import { InventoryPage } from '../../pageobjects/InventoryPage.js';
import { InventoryItemPage } from '../../pageobjects/InventoryItemPage.js';

test.describe('Inventory Item Detail', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Dapat melihat detail product dari judul di list products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await page.locator(inventoryPage.productNames).first().click();
    await expect(page).toHaveURL(/inventory-item.html/);
  });

  test('Dapat melihat detail product dari judul di cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCartByIndex(0);
    await inventoryPage.openCart();
    const cartProduct = page.locator('.cart_item .inventory_item_name').first();
    await cartProduct.click();
    await expect(page).toHaveURL(/inventory-item.html/);
  });

  test('Detail product menampilkan gambar, judul, deskripsi, harga', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await page.locator(inventoryPage.productNames).first().click();
    const itemPage = new InventoryItemPage(page);
    await expect(page.locator(itemPage.productImage)).toBeVisible();
    await expect(page.locator(itemPage.productTitle)).toBeVisible();
    await expect(page.locator(itemPage.productDesc)).toBeVisible();
    await expect(page.locator(itemPage.productPrice)).toBeVisible();
    await expect(await page.locator(itemPage.productPrice).innerText()).toMatch(/^\$\d+\.\d{2}$/);
  });

  test('Button add to cart terlihat jika belum ditambahkan', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await page.locator(inventoryPage.productNames).first().click();
    const itemPage = new InventoryItemPage(page);
    await expect(page.locator(itemPage.addToCartButton)).toBeVisible();
  });

  test('Button berubah jadi remove setelah add to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await page.locator(inventoryPage.productNames).first().click();
    const itemPage = new InventoryItemPage(page);
    await itemPage.addToCart();
    await expect(page.locator(itemPage.removeButton)).toBeVisible();
  });

  test('Counter cart bertambah setelah add to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await page.locator(inventoryPage.productNames).first().click();
    const itemPage = new InventoryItemPage(page);
    await itemPage.addToCart();
    await expect(page.locator(itemPage.cartBadge)).toHaveText('1');
  });

  test('Counter cart berkurang setelah remove', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await page.locator(inventoryPage.productNames).first().click();
    const itemPage = new InventoryItemPage(page);
    await itemPage.addToCart();
    await expect(page.locator(itemPage.cartBadge)).toHaveText('1');
    await itemPage.removeFromCart();
    await expect(page.locator(itemPage.cartBadge)).toHaveCount(0);
  });

  test('Kembali ke list product dari halaman detail', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await page.locator(inventoryPage.productNames).first().click();
    const itemPage = new InventoryItemPage(page);
    await itemPage.backToProducts();
    await expect(page).toHaveURL(/inventory.html/);
  });
});