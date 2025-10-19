import '../support/commands';

describe('TC-010 HU10 – Imagen con formato inválido', () => {
  it('Should reject invalid image format when adding product', () => {
    cy.loginAsMerchant();
    cy.loginAsMerchant();
    cy.get('[data-testid="custom-button-text"]').contains('Agregar producto').click();
    cy.get('[data-testid="add-product-name-input"]').type('Producto de prueba');
    cy.get('[data-testid="add-product-description-input"]').type('Descripción del producto de prueba');
    cy.get('[data-testid="add-product-type-input"]').type('Tipo de producto');
    cy.get('[data-testid="add-product-price-input"]').type('100');
    cy.get('[data-testid="add-product-quantity-input"]').type('1');

    const filePath = `${Cypress.config('fixturesFolder')}/Ejemplo-de-descarga-pdf.pdf`;

    cy.get('[data-testid="add-product-image-picker"]').selectFile(filePath, { force: true });

    cy.get('[data-testid="add-product-submit-button"]').click();

    cy.get('[data-testid="over-bottom"]').should('exist');
    cy.get('[data-testid="over-bottom-message"]').contains('Por favor, completa todos los campos e incluye una imagen.');
    
    cy.get('a[href="/comerce/Profile"]').click();
    cy.get('[data-testid="logout-button"]').click();
  });
});
