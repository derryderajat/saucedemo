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
   metadata: {
    "project": process.env.GITHUB_REPOSITORY || "local",
    "build": process.env.GITHUB_RUN_NUMBER || Date.now().toString()
  },
  reporter: [ ['allure-playwright']],
};
