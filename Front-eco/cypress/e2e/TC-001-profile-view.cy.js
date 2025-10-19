
describe('TC-001 HU3 – Visualizar información de perfil', () => {
  it('Should display user profile information correctly', () => {
    cy.visit('http://localhost:8081');

    cy.get('[data-testid="welcome-login-button"]').click();
    cy.get('[data-testid="login-email-input"]').type('test@gmail.com');
    cy.get('[data-testid="login-password-input"]').type('1234');
    cy.get('[data-testid="login-submit-button"]').click();

    cy.get('a[href="/consumer/Profile"]').click();

    cy.get('[data-testid="name-label"]').should('not.be.empty');
    cy.get('[data-testid="email-label"]').should('not.be.empty');
    cy.get('[data-testid="address-label"]').should('not.be.empty');
    cy.get('[data-testid="phone-label"]').should('not.be.empty');
    cy.get('[data-testid="type-label"]').should('not.be.empty');

    cy.get('[data-testid="logout-button"]').click();
  });
});
