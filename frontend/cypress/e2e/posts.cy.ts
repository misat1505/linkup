import axios from "axios";

describe("posts spec", () => {
  const frontendUrl = "http://localhost:3000";
  const backendUrl = "http://localhost:5500";

  beforeEach(() => {
    cy.visit(`${frontendUrl}/login`);

    axios.post(`${backendUrl}/reset-db`);

    cy.get("[data-testid=cy-login-form-login]").type("login2");
    cy.get("[data-testid=cy-login-form-password]").type("pass2");

    cy.get("[data-testid=cy-login-form-button]").click();
  });

  it("should create a post", () => {
    cy.get("[data-testid=cy-nav-trigger]").click();
    cy.get("[data-testid=cy-nav-sheet-item-posts]").click();

    cy.get("[data-testid=cy-redirect-to-create-post-btn]").click();

    const textarea = cy
      .get("[data-testid=cy-post-editor]")
      .children()
      .eq(1)
      .children()
      .first()
      .children()
      .first()
      .children()
      .eq(1);

    textarea.type("## My post");

    const saveButton = cy
      .get("[data-testid=cy-post-editor]")
      .children()
      .first()
      .children()
      .eq(1)
      .children()
      .last()
      .children()
      .first();

    saveButton.click();

    // is visible on posts page
    cy.get("[data-testid=cy-nav-trigger]").click();
    cy.get("[data-testid=cy-nav-sheet-item-posts]").click();
    cy.contains("My post").should("be.visible");

    // is visible on home page
    cy.get("[data-testid=cy-nav-trigger]").click();
    cy.get("[data-testid=cy-nav-sheet-item-home]").click();
    cy.contains("My post").should("be.visible");
  });
});
