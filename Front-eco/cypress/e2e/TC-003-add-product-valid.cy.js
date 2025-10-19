import '../support/commands';

describe('TC-003 HU5 – Agregar producto válido al carrito', () => {
  it('Should add product to cart with valid quantity', () => {
    cy.loginAsConsumer();
    cy.get('[data-testid^="product-card-"]').first().click();
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.get('[data-testid="over-bottom"]').should('exist');
    cy.get('[data-testid="over-bottom-message"]').contains('Producto añadido al carrito');
    cy.get('[data-testid="custom-button-text"]').click();

    cy.get('a[href="/consumer/Profile"]').click();
    cy.get('[data-testid="logout-button"]').click();
  });
});
