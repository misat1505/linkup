import axios from "axios";

describe("login spec", () => {
  const frontendUrl = "https://localhost:3000";
  const backendUrl = "https://localhost:5500";

  beforeEach(() => {
    cy.visit(`${frontendUrl}/login`);
    axios.post(`${backendUrl}/reset-db`);
  });

  it("logs in existing user and redirects to main page", () => {
    cy.get("[data-testid=cy-login-form-login]").type("login2");
    cy.get("[data-testid=cy-login-form-password]").type("pass2");

    cy.get("[data-testid=cy-login-form-button]").click();

    cy.url().should("eq", `${frontendUrl}/`);
  });

  it("shouldn't log in non-existent user and stays on login", () => {
    cy.get("[data-testid=cy-login-form-login]").type("not-exist");
    cy.get("[data-testid=cy-login-form-password]").type("not-exist");

    cy.get("[data-testid=cy-login-form-button]").click();

    cy.url().should("eq", `${frontendUrl}/login`);
  });
});
