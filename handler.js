'use strict'

console.log('Loading function')

module.exports.a11yCheck = (event, context, callback) => {
  var url = event.queryStringParameters.url
  console.log("Let's check " + url)

  const wd     = require('selenium-webdriver')
  const chrome = require('selenium-webdriver/chrome')
  const Axe    = require('axe-webdriverjs')

  // Build a Chrome service, ensuring the correct path to ChromeDriver is set
  const service = new chrome.ServiceBuilder(
    '/var/task/node_modules/@serverless-chrome/lambda/dist/headless-chromium'
  ).build()

  chrome.setDefaultService(service)

  // Create our WebDriver instance
  const webdriver = new wd.Builder()
    .forBrowser('chrome')
    .withCapabilities(wd.Capabilities.chrome())
    .build()

  const axe = new Axe(webdriver)

  // Get the page
  webdriver.get(url).then(() => {
    // Run axe-core
    axe.analyze(results => {
      console.log(results)

      // BEGIN HTTP Response
      const response = {
        statusCode: 200,
        body: results,
      }

      callback(null, response)
      // END HTTP Response
    })
  }).catch(err => {
    console.log(err)
  })
}
