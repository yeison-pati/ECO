describe('TC-008 HU7 – Carrito vacío', () => {
  it('Should display empty cart message', () => {
    cy.loginAsConsumer();
    cy.get('[data-testid="cart-clean-button"]').click();
    cy.contains('El carrito está vacío');
  });
});
