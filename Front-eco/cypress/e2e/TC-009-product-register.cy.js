describe('TC-009 HU10 – Registro exitoso de producto', () => {
  it('Should register a new product successfully', () => {
    cy.loginAsMerchant();
    cy.get('[data-testid="add-product-name-input"]').type('Frispicada');
    cy.get('[data-testid="add-product-description-input"]').type('Combo de pollo frito y acompañamientos');
    cy.get('[data-testid="add-product-type-input"]').type('Comida Rápida');
    cy.get('[data-testid="add-product-price-input"]').type('58905');
    cy.get('[data-testid="add-product-quantity-input"]').type('5');
    cy.get('[data-testid="add-product-image-picker"]').selectFile('cypress/fixtures/fris.png');
    cy.get('[data-testid="add-product-submit-button"]').click();
    cy.contains('Producto registrado correctamente');
  });
});
