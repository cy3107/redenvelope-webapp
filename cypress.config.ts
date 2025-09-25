import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
  video: false,
  screenshotsFolder: 'cypress/screenshots',
  downloadsFolder: 'cypress/downloads',
})
