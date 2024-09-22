import axios from "axios";

describe("login spec", () => {
  const frontendUrl = "https://localhost:3000";
  const backendUrl = "https://localhost:5500";

  beforeEach(async () => {
    await axios.post(`${backendUrl}/reset-db`);
  });

  it("logs in existing user and redirects to main page", () => {
    cy.visit(`${frontendUrl}/login`);

    cy.get("[data-testid=cy-login-form-login]").type("login2");
    cy.get("[data-testid=cy-login-form-password]").type("pass2");

    cy.get("[data-testid=cy-login-form-button]").click();

    cy.url().should("eq", `${frontendUrl}/`);
  });

  it("shouldn't log in non-existent user and stays on login", () => {
    cy.visit(`${frontendUrl}/login`);

    cy.get("[data-testid=cy-login-form-login]").type("not-exist");
    cy.get("[data-testid=cy-login-form-password]").type("not-exist");

    cy.get("[data-testid=cy-login-form-button]").click();

    cy.url().should("eq", `${frontendUrl}/login`);
  });
});
