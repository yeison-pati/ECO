describe('TC-002 HU3 – Error al cargar perfil', () => {
  describe('TC-002 HU3 – Error al visualizar perfil sin datos de usuario', () => {
    it('Should show error message when user data is not available in profile', () => {
      cy.visit('http://localhost:8081');

      // Login exitoso
      cy.get('[data-testid="welcome-login-button"]').click();
      cy.get('[data-testid="login-email-input"]').type('test@gmail.com');
      cy.get('[data-testid="login-password-input"]').type('1234');
      cy.get('[data-testid="login-submit-button"]').click();

      cy.get('a[href="/consumer/Profile"]').click();

      cy.get('[data-testid="noData-label"]', { timeout: 5000 })
        .should('be.visible')
        .and('contain.text', 'No pudimos recuperar tu información en este momento');

      cy.get('[data-testid="name-label"]').should('not.exist');
      cy.get('[data-testid="email-label"]').should('not.exist');
      cy.get('[data-testid="phone-label"]').should('not.exist');
    });
  });
});
