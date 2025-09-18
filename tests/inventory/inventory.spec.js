import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageobjects/LoginPage.js';
import { InventoryPage } from '../../pageobjects/InventoryPage.js';

test.describe('Inventory Page', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Melihat judul Swag Labs pada homepage', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(page.locator('.app_logo')).toHaveText(/Swag Labs/);
  });

  test('Melihat sub judul halaman Products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(page.locator(inventoryPage.productTitle)).toHaveText('Products');
  });

  test('Melihat gambar product tiap item', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const images = page.locator(inventoryPage.productImages);
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toBeVisible();
      await expect(images.nth(i)).toHaveAttribute('src', /jpg|png/);
    }
  });

  test('Melihat judul product tiap item', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const names = page.locator(inventoryPage.productNames);
    const count = await names.count();
    for (let i = 0; i < count; i++) {
      await expect(names.nth(i)).toBeVisible();
      await expect(await names.nth(i).innerText()).not.toBe('');
    }
  });

  test('Melihat deskripsi product tiap item', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const descs = page.locator(inventoryPage.productDescriptions);
    const count = await descs.count();
    for (let i = 0; i < count; i++) {
      await expect(descs.nth(i)).toBeVisible();
      await expect(await descs.nth(i).innerText()).not.toBe('');
    }
  });

  test('Melihat harga tiap product dengan format $x.xx', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const prices = page.locator(inventoryPage.productPrices);
    const count = await prices.count();
    for (let i = 0; i < count; i++) {
      await expect(prices.nth(i)).toBeVisible();
      await expect(await prices.nth(i).innerText()).toMatch(/^\$\d+\.\d{2}$/);
    }
  });

  test('Semua button Add to Cart terlihat dan enabled', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const buttons = page.locator(inventoryPage.addToCartButtons);
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toBeVisible();
      await expect(buttons.nth(i)).toBeEnabled();
    }
  });

  test('Button Add to Cart berubah menjadi Remove setelah diklik', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const buttons = page.locator(inventoryPage.addToCartButtons);
    await buttons.first().click();
    const removeButtons = page.locator(inventoryPage.removeButtons);
    await expect(removeButtons.first()).toBeVisible();
    // Pastikan hanya satu yang berubah
    expect(await removeButtons.count()).toBe(1);
  });

  test('Counter cart bertambah setelah Add to Cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const badge = page.locator(inventoryPage.cartBadge);
    await expect(badge).toHaveCount(0);
    await inventoryPage.addToCartByIndex(0);
    await expect(badge).toHaveText('1');
  });

  test('Add semua item ke cart, counter sesuai jumlah item', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addAllToCart();
    const badge = page.locator(inventoryPage.cartBadge);
    const total = await page.locator(inventoryPage.addToCartButtons).count();
    await expect(badge).toHaveText(total.toString());
  });

  test('Button Remove muncul setelah Add to Cart, dan kembali ke Add to Cart setelah diklik', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCartByIndex(0);
    let removeBtn = page.locator(inventoryPage.removeButtons).first();
    await expect(removeBtn).toBeVisible();
    await removeBtn.click();
    let addBtn = page.locator(inventoryPage.addToCartButtons).first();
    await expect(addBtn).toBeVisible();
  });

  test('Counter cart berkurang setelah Remove', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCartByIndex(0);
    await expect(page.locator(inventoryPage.cartBadge)).toHaveText('1');
    await inventoryPage.removeFromCartByIndex(0);
    await expect(page.locator(inventoryPage.cartBadge)).toHaveCount(0);
  });

  test('Counter cart tidak muncul jika semua item di-remove', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addAllToCart();
    await inventoryPage.removeAllFromCart();
    await expect(page.locator(inventoryPage.cartBadge)).toHaveCount(0);
  });

  test('Semua opsi filter terlihat', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const options = await page.locator(`${inventoryPage.filterSelect} option`).allTextContents();
    expect(options).toEqual([
      'Name (A to Z)',
      'Name (Z to A)',
      'Price (low to high)',
      'Price (high to low)'
    ]);
  });

  test('Filter Name (A to Z) mengurutkan produk ascending', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.selectFilter('Name (A to Z)');
    const names = await page.locator(inventoryPage.productNames).allTextContents();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test('Filter Name (Z to A) mengurutkan produk descending', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.selectFilter('Name (Z to A)');
    const names = await page.locator(inventoryPage.productNames).allTextContents();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('Filter Price (low to high) mengurutkan produk dari harga terendah', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.selectFilter('Price (low to high)');
    const prices = await page.locator(inventoryPage.productPrices).allTextContents();
    const priceNums = prices.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...priceNums].sort((a, b) => a - b);
    expect(priceNums).toEqual(sorted);
  });

  test('Filter Price (high to low) mengurutkan produk dari harga tertinggi', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.selectFilter('Price (high to low)');
    const prices = await page.locator(inventoryPage.productPrices).allTextContents();
    const priceNums = prices.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...priceNums].sort((a, b) => b - a);
    expect(priceNums).toEqual(sorted);
  });

  test('Footer menampilkan icon social media dan copyright', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(page.locator(inventoryPage.socialTwitter)).toBeVisible();
    await expect(page.locator(inventoryPage.socialFacebook)).toBeVisible();
    await expect(page.locator(inventoryPage.socialLinkedin)).toBeVisible();
    await expect(page.locator(inventoryPage.copyright)).toContainText('© 2025 Sauce Labs');
  });


});