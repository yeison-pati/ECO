// cypress/e2e/auth-flow.cy.js
// Example Cypress tests for ECO Front-End app

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Adjust URL based on your Expo/React Native web setup
    cy.visit('http://localhost:8081'); // or your dev server URL
  });

  describe('Login', () => {
    it('should display welcome screen with login and register buttons', () => {
      cy.get('[data-testid="welcome-login-button"]').should('be.visible');
      cy.get('[data-testid="welcome-register-button"]').should('be.visible');
    });

    it('should navigate to login screen', () => {
      cy.get('[data-testid="welcome-login-button"]').click();
      cy.get('[data-testid="login-email-input"]').should('be.visible');
      cy.get('[data-testid="login-password-input"]').should('be.visible');
      cy.get('[data-testid="login-submit-button"]').should('be.visible');
    });

    it('should show validation error for invalid email', () => {
      cy.get('[data-testid="welcome-login-button"]').click();
      cy.get('[data-testid="login-email-input"]').type('invalid-email');
      cy.get('[data-testid="login-password-input"]').type('password123');
      cy.get('[data-testid="login-submit-button"]').click();
      // Add assertion for error message visibility
    });

    it('should login successfully with valid credentials', () => {
      cy.get('[data-testid="welcome-login-button"]').click();
      cy.get('[data-testid="login-email-input"]').type('test@gmail.com');
      cy.get('[data-testid="login-password-input"]').type('1234');
      cy.get('[data-testid="login-submit-button"]').click();
      
      // Verify navigation to home (adjust based on user role)
      cy.get('[data-testid="consumer-home-logout-button"]', { timeout: 10000 })
        .should('be.visible');
    });

    it('should navigate to register from login screen', () => {
      cy.get('[data-testid="welcome-login-button"]').click();
      cy.get('[data-testid="login-register-link"]').click();
      cy.get('[data-testid="register-name-input"]').should('be.visible');
    });
  });

  describe('Registration', () => {
    beforeEach(() => {
      cy.get('[data-testid="welcome-register-button"]').click();
    });

    it('should display all registration form fields', () => {
      cy.get('[data-testid="register-name-input"]').should('be.visible');
      cy.get('[data-testid="register-email-input"]').should('be.visible');
      cy.get('[data-testid="register-password-input"]').should('be.visible');
      cy.get('[data-testid="register-password-confirm-input"]').should('be.visible');
      cy.get('[data-testid="register-phone-country-code"]').should('be.visible');
      cy.get('[data-testid="register-phone-phone-number"]').should('be.visible');
      cy.get('[data-testid="register-next-button"]').should('be.visible');
    });

    it('should validate email format', () => {
      cy.get('[data-testid="register-name-input"]').type('John Doe');
      cy.get('[data-testid="register-email-input"]').type('invalid-email');
      cy.get('[data-testid="register-password-input"]').type('password123');
      cy.get('[data-testid="register-password-confirm-input"]').type('password123');
      cy.get('[data-testid="register-phone-phone-number"]').type('3001234567');
      cy.get('[data-testid="register-next-button"]').click();
      
      // Add assertion for email validation error
    });

    it('should validate password match', () => {
      cy.get('[data-testid="register-name-input"]').type('John Doe');
      cy.get('[data-testid="register-email-input"]').type('test@example.com');
      cy.get('[data-testid="register-password-input"]').type('password123');
      cy.get('[data-testid="register-password-confirm-input"]').type('different-password');
      cy.get('[data-testid="register-phone-phone-number"]').type('3001234567');
      cy.get('[data-testid="register-next-button"]').click();
      
      // Add assertion for password mismatch error
    });

    it('should complete registration and navigate to profile selection', () => {
      cy.get('[data-testid="register-name-input"]').type('John Doe');
      cy.get('[data-testid="register-email-input"]').type('newuser@example.com');
      cy.get('[data-testid="register-password-input"]').type('password123');
      cy.get('[data-testid="register-password-confirm-input"]').type('password123');
      cy.get('[data-testid="register-phone-phone-number"]').type('3001234567');
      cy.get('[data-testid="register-next-button"]').click();
      
      // Verify navigation to profile selection
      cy.get('[data-testid="select-profile-consumer-button"]').should('be.visible');
      cy.get('[data-testid="select-profile-merchant-button"]').should('be.visible');
      cy.get('[data-testid="select-profile-delivery-button"]').should('be.visible');
    });

    it('should select consumer profile and complete registration', () => {
      // Fill registration form
      cy.get('[data-testid="register-name-input"]').type('Consumer User');
      cy.get('[data-testid="register-email-input"]').type('consumer@example.com');
      cy.get('[data-testid="register-password-input"]').type('password123');
      cy.get('[data-testid="register-password-confirm-input"]').type('password123');
      cy.get('[data-testid="register-phone-phone-number"]').type('3001234567');
      cy.get('[data-testid="register-next-button"]').click();
      
      // Select consumer profile
      cy.get('[data-testid="select-profile-consumer-button"]').click();
      
      // Verify navigation to consumer home
      cy.get('[data-testid="consumer-home-logout-button"]', { timeout: 10000 })
        .should('be.visible');
    });
  });

  describe('Commerce Registration', () => {
    it('should complete commerce registration with documents', () => {
      // First complete basic registration
      cy.get('[data-testid="welcome-register-button"]').click();
      cy.get('[data-testid="register-name-input"]').type('My Business');
      cy.get('[data-testid="register-email-input"]').type('business@example.com');
      cy.get('[data-testid="register-password-input"]').type('password123');
      cy.get('[data-testid="register-password-confirm-input"]').type('password123');
      cy.get('[data-testid="register-phone-phone-number"]').type('3001234567');
      cy.get('[data-testid="register-next-button"]').click();
      
      // Select merchant profile
      cy.get('[data-testid="select-profile-merchant-button"]').click();
      
      // Fill commerce registration
      cy.get('[data-testid="register-commerce-nit-input"]').should('be.visible');
      cy.get('[data-testid="register-commerce-nit-input"]').type('1234567890');
      
      // Note: File upload testing may require additional setup
      // cy.get('[data-testid="register-commerce-camara-comercio-picker"]').click();
      // cy.get('[data-testid="register-commerce-rut-picker"]').click();
      
      cy.get('[data-testid="register-commerce-submit-button"]').should('be.visible');
    });
  });
});

describe('Shopping Flow', () => {
  beforeEach(() => {
    // Login as consumer first
    cy.visit('http://localhost:19006');
    cy.get('[data-testid="welcome-login-button"]').click();
    cy.get('[data-testid="login-email-input"]').type('consumer@example.com');
    cy.get('[data-testid="login-password-input"]').type('password123');
    cy.get('[data-testid="login-submit-button"]').click();
    cy.get('[data-testid="consumer-home-logout-button"]', { timeout: 10000 }).should('be.visible');
  });

  describe('Product Browsing', () => {
    it('should display product cards on home screen', () => {
      // Product cards use dynamic IDs like product-card-{id}
      cy.get('[data-testid^="product-card-"]').should('have.length.greaterThan', 0);
    });

    it('should navigate to product details', () => {
      cy.get('[data-testid^="product-card-"]').first().click();
      // Add assertions for product details page
    });
  });

  describe('Shopping Cart', () => {
    it('should add product to cart', () => {
      cy.get('[data-testid^="product-card-"]').first().click();
      // Assuming navigation to product detail page with add to cart button
      // Add assertions based on your product detail screen structure
    });

    it('should manage cart items', () => {
      // Navigate to cart (adjust based on your navigation)
      // cy.get('[data-testid="nav-cart"]').click(); // Example if you have nav
      
      // Increase quantity
      cy.get('[data-testid^="cart-item-quantity"]').first().within(() => {
        cy.get('[data-testid$="-increase"]').click();
        cy.get('[data-testid$="-value"]').should('contain', '2');
      });
      
      // Decrease quantity
      cy.get('[data-testid^="cart-item-quantity"]').first().within(() => {
        cy.get('[data-testid$="-decrease"]').click();
        cy.get('[data-testid$="-value"]').should('contain', '1');
      });
    });

    it('should clear cart', () => {
      cy.get('[data-testid="cart-clean-button"]').click();
      // Add assertion for empty cart state
    });

    it('should proceed to payment', () => {
      cy.get('[data-testid="cart-proceed-button"]').click();
      cy.get('[data-testid="payment-back-button"]').should('be.visible');
      cy.get('[data-testid="payment-confirm-button"]').should('be.visible');
    });

    it('should complete order', () => {
      cy.get('[data-testid="cart-proceed-button"]').click();
      cy.get('[data-testid="payment-confirm-button"]').click();
      // Add assertions for order confirmation
    });
  });
});

describe('Commerce Flow', () => {
  beforeEach(() => {
    // Login as merchant
    cy.visit('http://localhost:19006');
    cy.get('[data-testid="welcome-login-button"]').click();
    cy.get('[data-testid="login-email-input"]').type('merchant@example.com');
    cy.get('[data-testid="login-password-input"]').type('password123');
    cy.get('[data-testid="login-submit-button"]').click();
    // Wait for merchant home to load
    cy.wait(2000);
  });

  describe('Product Management', () => {
    it('should display add product form', () => {
      // Navigate to add product page (adjust based on your navigation)
      cy.get('[data-testid="add-product-name-input"]').should('be.visible');
      cy.get('[data-testid="add-product-description-input"]').should('be.visible');
      cy.get('[data-testid="add-product-type-input"]').should('be.visible');
      cy.get('[data-testid="add-product-price-input"]').should('be.visible');
      cy.get('[data-testid="add-product-quantity-input"]').should('be.visible');
      cy.get('[data-testid="add-product-image-picker"]').should('be.visible');
      cy.get('[data-testid="add-product-submit-button"]').should('be.visible');
    });

    it('should create new product', () => {
      cy.get('[data-testid="add-product-name-input"]').type('Fresh Apples');
      cy.get('[data-testid="add-product-description-input"]').type('Organic red apples');
      cy.get('[data-testid="add-product-type-input"]').type('Fruits');
      cy.get('[data-testid="add-product-price-input"]').type('1500');
      cy.get('[data-testid="add-product-quantity-input"]').type('50');
      
      // Note: Image upload may require additional setup
      // cy.get('[data-testid="add-product-image-picker"]').click();
      
      cy.get('[data-testid="add-product-submit-button"]').click();
      // Add assertion for success message
    });

    it('should validate required fields', () => {
      cy.get('[data-testid="add-product-submit-button"]').click();
      // Add assertion for validation error
    });
  });
});

describe('Phone Input Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:19006');
    cy.get('[data-testid="welcome-register-button"]').click();
  });

  it('should allow country code selection', () => {
    cy.get('[data-testid="register-phone-country-code"]').click();
    // Modal should open with country list
    // cy.get('[data-testid="register-phone-country-CO"]').click(); // Example for Colombia
  });

  it('should validate phone number format', () => {
    cy.get('[data-testid="register-phone-phone-number"]').type('123'); // Too short
    // Add assertion for validation error
  });

  it('should accept valid phone number', () => {
    cy.get('[data-testid="register-phone-phone-number"]')
      .type('3001234567')
      .should('have.value', '3001234567');
  });
});
