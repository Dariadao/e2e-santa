// const { defineConfig } = require("cypress");
// const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
// const createEsbuildPlugin =
//   require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;
// const addCucumberPreprocessorPlugin =
//   require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;

// module.exports = defineConfig({
//   "cypress-cucumber-preprocessor": {
//     nonGlobalStepDefinitions: false,
//     specPattern: "**/*.feature",
//   },
//   e2e: {
//     // baseUrl: "https://staging.lpitko.ru",
//     baseUrl: "https://santa-secret.ru",
//     testIsolation: false,
//     setupNodeEvents(on, config) {
//       const bundler = createBundler({
//         plugins: [createEsbuildPlugin(config)],
//       });

//       on("file:preprocessor", bundler);
//       addCucumberPreprocessorPlugin(on, config);
//       return config;
//     },
//   },
// });
const { defineConfig } = require("cypress");

const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const addCucumberPreprocessorPlugin =
  require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;
const createEsBuildPlugin =
  require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;

module.exports = defineConfig({
  "cypress-cucumber-preprocessor": {
    nonGlobalStepDefinitions: false,
    // stepDefinitions: "cypress/support/step_definitions/santa-box-create.cy.js",
  },
  e2e: {
    baseUrl: "https://santa-secret.ru",
    testIsolation: false,
    async setupNodeEvents(on, config) {
      // implement node event listeners here
      const bundler = createBundler({
        plugins: [createEsBuildPlugin(config)],
      });
      on("file:preprocessor", bundler);
      await addCucumberPreprocessorPlugin(on, config);
      return config;
    },
    specPattern: "**/*.feature",
  },
});
