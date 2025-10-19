import '../support/commands';

describe('TC-009 HU10 – Registro exitoso de producto', () => {
  it('Should register a new product successfully', () => {
    cy.loginAsMerchant();
    cy.get('[data-testid="custom-button-text"]').contains('Agregar producto').click();
    cy.wait(1000); // Esperar a que la pantalla de agregar producto se cargue
    cy.get('[data-testid="add-product-name-input"]').type('Producto de prueba');
    cy.wait(500);
    cy.get('[data-testid="add-product-description-input"]').type('Descripción del producto de prueba');
    cy.wait(500);
    cy.get('[data-testid="add-product-type-input"]').type('Tipo de producto');
    cy.wait(500);
    cy.get('[data-testid="add-product-price-input"]').type('100');
    cy.wait(500);
    cy.get('[data-testid="add-product-quantity-input"]').type('1');
    cy.wait(500);

    const filePath = `${Cypress.config('fixturesFolder')}/test.jpg`;
    cy.wait(500);

    cy.get('[data-testid="add-product-image-picker"]').selectFile(filePath, { force: true });
    cy.wait(500);

    cy.get('[data-testid="add-product-submit-button"]').click();
    cy.wait(1000);

    cy.get('[data-testid="over-bottom"]').should('exist');
    cy.wait(500);
    cy.get('[data-testid="over-bottom-message"]').contains('¡Producto creado correctamente!');
    cy.get('[data-testid="custom-button-text"]').click({multiple: true});

    cy.get('a[href="/comerce/Profile"]').click();
    cy.get('[data-testid="logout-button"]').click();
  });
});
