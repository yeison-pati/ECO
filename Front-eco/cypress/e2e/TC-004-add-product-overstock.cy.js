import '../support/commands';

describe('TC-004 HU5 – Agregar producto con cantidad inválida', () => {
  it('Should show warning when adding product exceeding stock', () => {
    cy.loginAsConsumer();

    // 1️⃣ Entrar al producto
    cy.get('[data-testid^="product-card-"]').first().click();

    // 2️⃣ Escribir cantidad inválida
    cy.get('[data-testid="qs-input"]').clear().type('999');
    cy.get('[data-testid="qs-input"]').should('have.value', '999');

    cy.get('[data-testid="back-button"]').click();
    cy.get('[data-testid^="product-card-"]').first().click();
    
    // 3️⃣ Click en añadir
    cy.get('[data-testid="add-to-cart-button"]').click();

    // 4️⃣ Esperar a que el modal aparezca
    cy.get('[data-testid="over-bottom"]', { timeout: 8000 })
      .should('exist')
      .and('be.visible');

    // 5️⃣ Verificar mensaje
    cy.get('[data-testid="over-bottom-message"]', { timeout: 8000 })
      .should('contain.text', 'Cantidad excede el stock disponible');

    // 6️⃣ Cerrar el modal
    cy.get('[data-testid="custom-button-text"]').click();

    // 7️⃣ Logout
    cy.get('a[href="/consumer/Profile"]').click();
    cy.get('[data-testid="logout-button"]').click();
  });
});
