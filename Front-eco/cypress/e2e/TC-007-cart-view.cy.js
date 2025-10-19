import '../support/commands';

describe('TC-007 HU7 – Visualizar productos del carrito', () => {
  it('Should show products in cart and allow quantity modification', () => {
    cy.loginAsConsumer();
    cy.get('[data-testid^="product-card-"]').first().click();
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.get('[data-testid="over-bottom"]').should('exist');
    cy.get('[data-testid="over-bottom-message"]').contains('Producto añadido al carrito');
    cy.get('[data-testid="custom-button-text"]').click();
    cy.get('[href="/consumer/Cart"]').click();

    cy.get('[data-testid^="cart-item-"]').first().should('exist');
    cy.get('[data-testid^="cart-product-image-"]').first().should('exist');
    cy.get('[data-testid^="cart-product-name-"]').first().should('exist');
    cy.get('[data-testid^="cart-product-price-"]').first().should('exist');
    cy.get('[data-testid="total-cart"]').should('exist');

    cy.get('[data-testid="qs-input"]').first().clear().type('3');
    cy.get('[data-testid="qs-input"]').first().should('have.value', '3');
-
    cy.get('[data-testid="qs-input"]').first().clear().type('5');
    cy.get('[data-testid="qs-input"]').first().should('have.value', '5');

    cy.get('[data-testid="delete-cart-button"]').click();

    //verificar que el carrito esté vacío
    cy.get('[data-testid^="cart-item-"]').should('not.exist');

    cy.get('a[href="/consumer/Profile"]').click();
    cy.get('[data-testid="logout-button"]').click();
  });
});
