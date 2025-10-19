import '../support/commands';

describe('TC-006 HU4 – Producto no encontrado', () => {
  it('Should show error when product not found', () => {
    cy.loginAsConsumer();
    cy.get('[data-testid^="product-card-"]').first().click();
    cy.visit('http://localhost:8081/consumer/Product/nn');
    cy.contains('Producto no encontrado');
    // 7️⃣ Logout
    cy.get('a[href="/consumer/Profile"]').click();
    cy.get('[data-testid="logout-button"]').click();
  });
});
