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

  const sendMessage = (text: string, withResponse = true) => {
    const textInput = cy.get("[data-testid=cy-chat-footer-text-input]");
    textInput.type(text);

    if (withResponse) {
      const messagesContainer = cy.get("[data-testid=cy-chat-messages]");
      const responseMessage = messagesContainer.children().eq(1);
      responseMessage.realHover({ pointer: "mouse" });

      const buttons = responseMessage.children().first().children().first();
      const replyButton = buttons.children().first();
      replyButton.click();
    }

    cy.get("[data-testid=cy-chat-footer-button]").click();

    cy.contains(text).should("be.visible");
    textInput.should("have.value", "");
  };

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

    sendMessage("some message");
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

    sendMessage("some message");
  });
});
