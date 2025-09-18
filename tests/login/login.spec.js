import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageobjects/LoginPage.js';

test.describe('Login Page', () => {
  test('Halaman login terbuka dan form login terlihat', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.loginForm).toBeVisible();
  });

  test('Login dengan username dan password valid', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.fill(loginPage.usernameInput, 'standard_user');
    await expect(page.locator(loginPage.usernameInput)).toHaveValue('standard_user');
    await page.fill(loginPage.passwordInput, 'secret_sauce');
    await expect(page.locator(loginPage.passwordInput)).toHaveValue('secret_sauce');
    await page.click(loginPage.loginButton);
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Tidak bisa login jika password kosong', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.fill(loginPage.usernameInput, 'standard_user');
    await expect(page.locator(loginPage.usernameInput)).toHaveValue('standard_user');
    await page.click(loginPage.loginButton);
    await expect(loginPage.errorMessage).toHaveText(/Password is required/);
  });

  test('Tidak bisa login jika username kosong', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.fill(loginPage.passwordInput, 'secret_sauce');
    await expect(page.locator(loginPage.passwordInput)).toHaveValue('secret_sauce');
    await page.click(loginPage.loginButton);
    await expect(loginPage.errorMessage).toHaveText(/Username is required/);
  });

  test('Tidak bisa login jika username dan password kosong', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.click(loginPage.loginButton);
    await expect(loginPage.errorMessage).toHaveText(/Username is required/);
  });

  test('Tidak bisa login jika password salah', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.fill(loginPage.usernameInput, 'standard_user');
    await expect(page.locator(loginPage.usernameInput)).toHaveValue('standard_user');
    await page.fill(loginPage.passwordInput, 'secret_sauce123');
    await expect(page.locator(loginPage.passwordInput)).toHaveValue('secret_sauce123');
    await page.click(loginPage.loginButton);
    await expect(loginPage.errorMessage).toHaveText(/Username and password do not match any user/);
  });

  test('Tidak bisa akses inventory.html tanpa session', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toHaveText(/You can only access '\/inventory.html' when you are logged in/);
  });

  test('Tidak bisa akses checkout-step-one.html tanpa session', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/checkout-step-one.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toHaveText(/You can only access '\/checkout-step-one.html' when you are logged in/);
  });

  test('Tidak bisa akses checkout-step-two.html tanpa session', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/checkout-step-two.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toHaveText(/You can only access '\/checkout-step-two.html' when you are logged in/);
  });

  test('Tidak bisa akses checkout-complete.html tanpa session', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/checkout-complete.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toHaveText(/You can only access '\/checkout-complete.html' when you are logged in/);
  });

  test('Tidak bisa akses cart.html tanpa session', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/cart.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toHaveText(/You can only access '\/cart.html' when you are logged in/);
  });

  test('Tidak bisa akses inventory-item.html tanpa session', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory-item.html?id=0');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toHaveText(/You can only access '\/inventory-item.html' when you are logged in/);
  });
});