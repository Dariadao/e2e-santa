const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const drawPage = require("../fixtures/pages/drawPage.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");
import { faker } from "@faker-js/faker";

Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

Cypress.config("pageLoadTimeout", 100000);

describe("user can create a box and run it", () => {
  //пользователь 1 логинится
  //пользователь 1 создает коробку
  //пользователь 1 получает приглашение
  //пользователь 2 переходит по приглашению
  //пользователь 2 заполняет анкету
  //пользователь 3 переходит по приглашению
  //пользователь 3 заполняет анкету
  //пользователь 4 переходит по приглашению
  //пользователь 4 заполняет анкету
  //пользователь 1 логинится
  //пользователь 1 запускает жеребьевку
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let wishes = faker.word.noun() + faker.word.adverb() + faker.word.adjective();
  let minAmount = 10;
  let maxAmount = 50;
  let currency = "Евро";
  let inviteLink;
  let boxID = faker.word.noun() + faker.random.numeric(3);

  it("user logins and create a box", () => {
    cy.visit("/login");
    cy.login(users.userAutor.email, users.userAutor.password);
    cy.contains("Создать коробку").click();
    cy.get(boxPage.boxNameField).type(newBoxName);
    cy.get(boxPage.boxIdField).clear().type(boxID);
    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.sixthIcon).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(".switch__toggle").click();
    cy.get(boxPage.minAmount).type(minAmount);
    cy.get(boxPage.maxAnount).type(maxAmount);
    cy.get(boxPage.currency).select(currency);
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
    cy.get(boxPage.menuField)
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });

  it("add participants manually", () => {
    cy.get(generalElements.submitButton).click();
    cy.addParticipant(
      invitePage.nameFirstRaw,
      invitePage.emailFirstRaw,
      users.user4.name,
      users.user4.email
    );
    cy.addParticipant(
      invitePage.nameSecondRaw,
      invitePage.emailSecondRaw,
      users.user5.name,
      users.user5.email
    );
    cy.addParticipant(
      invitePage.nameThirdRaw,
      invitePage.emailThirdRaw,
      users.user6.name,
      users.user6.email
    );
    cy.get(invitePage.inviteBtn).click();
    cy.contains(
      "Карточки участников успешно созданы и приглашения уже отправляются."
    ).should("exist");
  });

  it("add participants by sending a link", () => {
    cy.visit(`/box/${boxID}/invite`);
    cy.get(invitePage.inviteLink)
      .invoke("text")
      .then((link) => {
        inviteLink = link;
      });
    cy.clearCookies();
  });

  it("approve as user1", () => {
    cy.aproveInvitation(
      users.user1.email,
      users.user1.password,
      inviteLink,
      wishes
    );
    cy.clearCookies();
  });
  it("approve as user2", () => {
    cy.aproveInvitation(
      users.user2.email,
      users.user2.password,
      inviteLink,
      wishes
    );
    cy.clearCookies();
  });
  it("approve as user3", () => {
    cy.aproveInvitation(
      users.user3.email,
      users.user3.password,
      inviteLink,
      wishes
    );
    cy.clearCookies();
  });

  it("draw for participiants", () => {
    cy.visit("/login");
    cy.login(users.userAutor.email, users.userAutor.password);
    cy.get(generalElements.submitButton).click();
    cy.visit(`/box/${boxID}`);
    cy.get(drawPage.drawStartButton).click({ multiple: true, force: true });
    cy.get(generalElements.submitButton).click();
    cy.get(drawPage.drawConfirmButton).click();
    cy.get(drawPage.drawResultButton).click();
    cy.contains(
      "На этой странице показан актуальный список участников со всей информацией."
    ).should("exist");
  });

  after("delete box", () => {
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
});

// after("delete box", () => {
// cy.get(
//   '.layout-1__header-wrapper-fixed > .layout-1__header > .header > .header__items > .layout-row-start > [href="/account/boxes"] > .header-item > .header-item__text > .txt--med'
// ).click();
// cy.contains(newBoxName).click({ force: true });
// cy.get(
//   ".layout-1__header-wrapper-fixed > .layout-1__header-secondary > .header-secondary > .header-secondary__right-item > .toggle-menu-wrapper > .toggle-menu-button > .toggle-menu-button--inner"
// ).click();
// cy.contains("Архивация и удаление").click({ force: true });
// cy.get(":nth-child(2) > .form-page-group__main > .frm-wrapper > .frm").type(
//   "Удалить коробку"
// );
// cy.get(generalElements.deleteBtn).click({ multiple: true });
// });
// });
