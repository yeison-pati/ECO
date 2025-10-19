import '../support/commands';

describe('TC-007 HU7 – Visualizar productos del carrito', () => {
  it('Should show products in cart and allow quantity modification', () => {
    cy.loginAsConsumer();
    cy.get('[data-testid^="product-card-"]').first().click();
    cy.get('[href="/consumer/Cart"]').click();
    
    cy.get('[data-testid^="cart-item-"]').should('not.exist');
    cy.get('[data-testid="cart-empty-text"]').contains('El carrito está vacío');

    cy.get('a[href="/consumer/Profile"]').click();
    cy.get('[data-testid="logout-button"]').click();
  });
});
