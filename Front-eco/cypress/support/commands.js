Cypress.Commands.add('loginAsConsumer', () => {
  cy.visit('http://localhost:8081');
  cy.get('[data-testid="welcome-login-button"]').click();
  cy.get('[data-testid="login-email-input"]').type('test@gmail.com');
  cy.get('[data-testid="login-password-input"]').type('1234');
  cy.get('[data-testid="login-submit-button"]').click();
});

Cypress.Commands.add('loginAsMerchant', () => {
  cy.visit('http://localhost:8081');
  cy.get('[data-testid="welcome-login-button"]').click();
  cy.get('[data-testid="login-email-input"]').type('frisby@gmail.com');
  cy.get('[data-testid="login-password-input"]').type('1234');
  cy.get('[data-testid="login-submit-button"]').click();
});
