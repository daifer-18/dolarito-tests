const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Configuración para evitar problemas de IPv6
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    // Configurar para usar IPv4
    hosts: {
      '*.dolarito.ar': '127.0.0.1'
    }
  },
})
