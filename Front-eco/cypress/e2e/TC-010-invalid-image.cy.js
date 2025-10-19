describe('TC-010 HU10 – Imagen con formato inválido', () => {
  it('Should reject invalid image format when adding product', () => {
    cy.loginAsMerchant();
    cy.get('[data-testid="add-product-name-input"]').type('Frispicada Inválida');
    cy.get('[data-testid="add-product-description-input"]').type('Archivo con formato incorrecto');
    cy.get('[data-testid="add-product-type-input"]').type('Comida Rápida');
    cy.get('[data-testid="add-product-price-input"]').type('58905');
    cy.get('[data-testid="add-product-quantity-input"]').type('5');
    cy.get('[data-testid="add-product-image-picker"]').selectFile('cypress/fixtures/archivo.pdf');
    cy.get('[data-testid="add-product-submit-button"]').click();
    cy.contains('formato de imagen incorrecto');
  });
});
