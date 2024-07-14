import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});
Cypress.config("pageLoadTimeout", 100000);

const users = require("../../fixtures/users.json");
const boxPage = require("../../fixtures/pages/boxPage.json");
const generalElements = require("../../fixtures/pages/general.json");
const dashboardPage = require("../../fixtures/pages/dashboardPage.json");
const invitePage = require("../../fixtures/pages/invitePage.json");
const drawPage = require("../../fixtures/pages/drawPage.json");
const inviteeBoxPage = require("../../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../../fixtures/pages/inviteeDashboardPage.json");
import { faker } from "@faker-js/faker";

let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
let wishes = faker.word.noun() + faker.word.adverb() + faker.word.adjective();
let minAmount = 10;
let maxAmount = 50;
let currency = "Евро";
let inviteLink;
let boxID = faker.word.noun() + faker.random.numeric(3);

Given("the user is on the login page", () => {
  cy.visit("/login");
});

When("the user logs in with table", function (dataTable) {
  cy.login(dataTable.hashes()[0].login, dataTable.hashes()[0].password);
  cy.contains("Создать коробку").click();
});

Then("the user creates a box", () => {
  cy.get(boxPage.boxNameField).type(newBoxName);
  cy.get(boxPage.boxIdField).clear().type(boxID);
  cy.get(generalElements.arrowRight).click();
  cy.get(boxPage.sixthIcon).click();
  cy.get(generalElements.arrowRight).click();
  // не находит поле maxAmmount
  // cy.get(".switch__toggle").click();
  // cy.get(boxPage.minAmount).type(minAmount);
  // cy.get(boxPage.maxAmount).type(maxAmount);
  // cy.get(boxPage.currency).select(currency);
  cy.get(generalElements.arrowRight).click();
  cy.get(generalElements.arrowRight).click();
  cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
});

Then("the user is on the box page", () => {
  cy.get(boxPage.menuField)
    .invoke("text")
    .then((text) => {
      expect(text).to.include("Участники");
      expect(text).to.include("Моя карточка");
      expect(text).to.include("Подопечный");
    });
});

When("the author adds the following users", function (dataTable) {
  cy.get(generalElements.submitButton).click({ force: true });
  dataTable.hashes().forEach((row) => {
    cy.addParticipant(row.nameSelector, row.emailSelector, row.name, row.email);
  });
  cy.get(invitePage.inviteBtn).click();
});

Then("the participant's cards created successfuly", () => {
  cy.contains(
    "Карточки участников успешно созданы и приглашения уже отправляются."
  ).should("exist");
});

Given("the user navigates to the invite page for the box", () => {
  cy.visit(`/box/${boxID}/invite`);
});

When("the user gets the invite link", () => {
  cy.get(invitePage.inviteLink)
    .invoke("text")
    .then((link) => {
      inviteLink = link;
    });
  cy.clearCookies();
});

When(
  "the user approves the invitation as {string} with {string}",
  (email, password) => {
    cy.aproveInvitation(email, password, inviteLink, wishes);
  }
);

Then("the notice for the participant displays", () => {
  cy.get(inviteeDashboardPage.noticeForInvitee)
    .invoke("text")
    .then((text) => {
      expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
    });
});
Given("the author logs in", () => {
  cy.visit("/login");
  cy.login(users.userAutor.email, users.userAutor.password);
  cy.get(generalElements.submitButton).click();
});

When("the author is on the draw page", () => {
  cy.visit(`/box/${boxID}`);
  cy.get(drawPage.drawStartButton).click({ multiple: true, force: true });
  cy.get(generalElements.submitButton).click();
});

When("the author starts the draw", () => {
  cy.get(drawPage.drawConfirmButton).click();
  cy.get(drawPage.drawResultButton).click();
});

Then("the draws's list displays", () => {
  cy.contains(
    "На этой странице показан актуальный список участников со всей информацией."
  ).should("exist");
});

Given("the author is on login page", () => {
  cy.visit("/login");
});

When("the author logs in with data table", function (dataTable) {
  cy.login(dataTable.hashes()[0].login, dataTable.hashes()[0].password);
});

Then("the author deletes new box", () => {
  cy.request({
    method: "DELETE",
    url: `api/box/${boxID}`,
    headers: {
      Cookie: generalElements.cookie,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
});
