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
  reporter: [['list'], ['html', { output: 'test-results/report.html' }]],
};