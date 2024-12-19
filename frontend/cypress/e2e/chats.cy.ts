import axios from "axios";

type Options = {
  withResponse: boolean;
};

const defaultOptions: Options = {
  withResponse: true
};

describe("chats spec", () => {
  const frontendUrl = "https://localhost:3000";
  const backendUrl = "https://localhost:5500";

  beforeEach(() => {
    cy.visit(`${frontendUrl}/login`);

    axios.post(`${backendUrl}/reset-db`);

    cy.get("[data-testid=cy-login-form-login]").type("login2");
    cy.get("[data-testid=cy-login-form-password]").type("pass2");

    cy.get("[data-testid=cy-login-form-button]").click();
  });

  const sendMessage = (text: string, options = defaultOptions) => {
    const textInput = cy.get("[data-testid=cy-chat-footer-text-input]");
    textInput.type(text);

    const messagesContainer = cy.get("[data-testid=cy-chat-messages]");

    if (options.withResponse) {
      const responseMessage = messagesContainer.children().eq(1);
      responseMessage.realHover({ pointer: "mouse" });

      const buttons = responseMessage.children().first().children().first();
      const replyButton = buttons.children().first();
      replyButton.click();
    }

    cy.get("[data-testid=cy-chat-footer-button]").click();

    cy.contains("[data-testid=cy-chat-messages]", text);
    textInput.should("have.value", "");

    const openChatButton = cy
      .get("[data-testid=cy-chat-nav]")
      .children()
      .first()
      .children()
      .first();

    const messageText = openChatButton
      .children()
      .eq(1)
      .children()
      .eq(1)
      .children()
      .eq(1);
    messageText.should("have.text", text);
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

    sendMessage("some message", { withResponse: false });
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

    sendMessage("some message", { withResponse: false });
  });
});
