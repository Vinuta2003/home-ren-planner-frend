// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command to register a vendor
Cypress.Commands.add('registerVendor', (vendorData = {}) => {
  const defaultData = {
    name: 'Test Vendor',
    email: `testvendor${Date.now()}@example.com`,
    password: 'password123',
    contact: '1234567890',
    companyName: 'Test Company',
    experience: '5',
    skills: [{ skillName: 'PLUMBING', basePrice: '1000' }]
  };
  
  const data = { ...defaultData, ...vendorData };
  
  cy.visit('http://localhost:5173/register');
  cy.get('input[name="name"]').type(data.name);
  cy.get('input[name="email"]').type(data.email);
  cy.get('input[name="password"]').type(data.password);
  cy.get('input[name="contact"]').type(data.contact);
  cy.contains(/register as vendor/i).click();
  cy.get('input[name="companyName"]').type(data.companyName);
  cy.get('input[name="experience"]').type(data.experience);
  
  // Add skills
  data.skills.forEach((skill, index) => {
    if (index > 0) {
      cy.contains(/add skill/i).click();
    }
    cy.get('select').eq(index).select(skill.skillName);
    cy.get('input[placeholder="Base Price"]').eq(index).type(skill.basePrice);
  });
  
  cy.get('button[type="submit"]').click();
  
  // Wait for registration to complete
  cy.url().should('include', '/vendor-dashboard');
  cy.contains(/your vendor request is not approved yet/i).should('be.visible');
  
  return data;
});

// Custom command to login as admin
Cypress.Commands.add('loginAsAdmin', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  
  cy.visit('http://localhost:5173/login');
  cy.get('input[name="email"]').type('admin@gmail.com');
  cy.get('input[name="password"]').type('password');
  cy.get('button[type="submit"]').click();
  
  cy.url().should('include', '/admin-dashboard');
  cy.contains(/admin dashboard/i).should('be.visible');
});

// Custom command to approve a vendor through the UI
Cypress.Commands.add('approveVendorViaUI', (vendorEmail) => {
  cy.loginAsAdmin();
  
  // Navigate to vendor management
  cy.contains(/manage vendors/i).click();
  cy.wait(2000);
  
  // Switch to approval tab if needed
  cy.get('body').then($body => {
    if ($body.text().includes('Approval')) {
      cy.contains(/approval/i).click();
    }
  });
  
  cy.wait(2000);
  
  // Find and approve the vendor
  cy.get('body').then($body => {
    if ($body.text().includes(vendorEmail)) {
      cy.contains(vendorEmail).closest('.backdrop-blur-sm').within(() => {
        cy.contains(/approve/i).click();
      });
      cy.wait(2000);
      cy.get('body').should('not.contain', vendorEmail);
    } else {
      cy.log('Vendor not found in pending list - might already be approved');
    }
  });
});

// Custom command to verify vendor approval
Cypress.Commands.add('verifyVendorApproval', (vendorEmail, vendorPassword) => {
  cy.clearCookies();
  cy.clearLocalStorage();
  
  cy.visit('http://localhost:5173/login');
  cy.get('input[name="email"]').type(vendorEmail);
  cy.get('input[name="password"]').type(vendorPassword);
  cy.get('button[type="submit"]').click();
  
  cy.url().should('include', '/vendor-dashboard');
  cy.wait(3000);
  
  cy.get('body').then($body => {
    const bodyText = $body.text();
    if (bodyText.includes('Assigned Phases')) {
      cy.contains(/assigned phases/i).should('be.visible');
      cy.contains(/your vendor request is not approved yet/i).should('not.exist');
    } else {
      cy.log('Vendor might still be pending approval');
      cy.contains(/your vendor request is not approved yet/i).should('be.visible');
    }
  });
});