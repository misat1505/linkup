import axios from "axios";

describe("chats spec", () => {
  const frontendUrl = "https://localhost:3000";
  const backendUrl = "https://localhost:5500";

  beforeEach(() => {
    axios.post(`${backendUrl}/reset-db`);

    cy.visit(`${frontendUrl}/login`);

    cy.get("[data-testid=cy-login-form-login]").type("login2");
    cy.get("[data-testid=cy-login-form-password]").type("pass2");

    cy.get("[data-testid=cy-login-form-button]").click();
  });

  it("sends message to chat", () => {
    cy.get("[data-testid=cy-nav-trigger]").click();
    cy.get("[data-testid=cy-nav-sheet-item-chats]").click();

    const openChatButton = cy
      .get("[data-testid=cy-chat-nav]")
      .children()
      .eq(1)
      .children()
      .first();

    openChatButton.click();

    const messageContent = "some message";
    const textInput = cy.get("[data-testid=cy-chat-footer-text-input]");
    textInput.type(messageContent);

    cy.get("[data-testid=cy-chat-footer-button]").click();

    cy.contains(messageContent).should("be.visible");
    textInput.should("have.value", "");
  });

  it("sends message to chat - searchbox navigation", () => {
    const navbarInput = cy.get("[data-testid=cy-nav-search-input]");
    navbarInput.click();
    navbarInput.type("jane");

    const results = cy
      .get("[data-testid=cy-nav-search-results]")
      .children()
      .eq(1);
    const firstResult = results.children().first();
    const buttons = firstResult.children().eq(1);
    const createChatButton = buttons.children().eq(1);

    createChatButton.click();

    const messageContent = "some message";
    const textInput = cy.get("[data-testid=cy-chat-footer-text-input]");
    textInput.type(messageContent);

    cy.get("[data-testid=cy-chat-footer-button]").click();

    cy.contains(messageContent).should("be.visible");
    textInput.should("have.value", "");
  });
});
