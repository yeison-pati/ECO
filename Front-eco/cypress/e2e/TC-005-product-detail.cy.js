import '../support/commands';

describe('TC-005 HU4 – Visualizar detalle de producto', () => {
  it('Should display full product detail info', () => {
    cy.loginAsConsumer();

    cy.get('[data-testid^="product-card-"]').first().click();
    
    cy.get('[data-testid="product-name"]').should('exist');
    cy.get('[data-testid="product-description"]').should('exist');
    cy.get('[data-testid="product-price"]').should('exist');
    cy.get('[data-testid="product-stock"]').should('exist');

    // 7️⃣ Logout
    cy.get('a[href="/consumer/Profile"]').click();
    cy.get('[data-testid="logout-button"]').click();
  });
});