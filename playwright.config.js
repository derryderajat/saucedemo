const { defineConfig } = require('@playwright/test');

module.exports = {
  testDir: 'tests',
  timeout: 30000,
  use: {
    browserName: 'chromium',
    headless: true,
    launchOptions: {
      slowMo: 50,
    },
    screenshot:'on'
  },
  reporter: [ ['allure-playwright']],
};