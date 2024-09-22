import axios from "axios";

describe("signup spec", () => {
  const frontendUrl = "https://localhost:3000";
  const backendUrl = "https://localhost:5500";

  beforeEach(async () => {
    await axios.post(`${backendUrl}/reset-db`);
  });

  it("creates new user and redirects to home page", () => {
    cy.visit(`${frontendUrl}/signup`);

    cy.get("[data-testid=cy-signup-form-firstName]").type("John");
    cy.get("[data-testid=cy-signup-form-lastName]").type("Doe");
    cy.get("[data-testid=cy-signup-form-login]").type("login4");
    cy.get("[data-testid=cy-signup-form-password]").type("pass4");
    cy.get("[data-testid=cy-signup-form-confirmPassword]").type("pass4");

    cy.get("[data-testid=cy-signup-form-button]").click();

    cy.url().should("eq", `${frontendUrl}/`);
  });

  it("shouldn't create new user when login already exists", () => {
    cy.visit(`${frontendUrl}/signup`);

    cy.get("[data-testid=cy-signup-form-firstName]").type("John");
    cy.get("[data-testid=cy-signup-form-lastName]").type("Doe");
    cy.get("[data-testid=cy-signup-form-login]").type("login2");
    cy.get("[data-testid=cy-signup-form-password]").type("pass4");
    cy.get("[data-testid=cy-signup-form-confirmPassword]").type("pass4");

    cy.get("[data-testid=cy-signup-form-button]").click();

    cy.url().should("eq", `${frontendUrl}/signup`);
    cy.contains("Login already taken.").should("be.visible");
  });

  it("shouldn't create new user when given passwords don't match", () => {
    cy.visit(`${frontendUrl}/signup`);

    cy.get("[data-testid=cy-signup-form-firstName]").type("John");
    cy.get("[data-testid=cy-signup-form-lastName]").type("Doe");
    cy.get("[data-testid=cy-signup-form-login]").type("login4");
    cy.get("[data-testid=cy-signup-form-password]").type("pass4");
    cy.get("[data-testid=cy-signup-form-confirmPassword]").type("pass44");

    cy.get("[data-testid=cy-signup-form-button]").click();

    cy.url().should("eq", `${frontendUrl}/signup`);
    cy.contains("Passwords don't match").should("be.visible");
  });
});
