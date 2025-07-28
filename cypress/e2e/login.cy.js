const users = [
  {
    role: 'admin',
    email: 'admin@gmail.com',
    password: 'password',
    dashboardUrl: '/admin-dashboard',         
    dashboardText: /admin dashboard/i         
  },
  {
    role: 'customer',
    email: 'customer1@gmail.com',
    password: 'password',
    dashboardUrl: '/',     
    dashboardText: /RenoBase/i     
  },
  {
    role: 'vendor',
    email: 'vendor1@gmail.com',
    password: 'password',
    dashboardUrl: '/vendor-dashboard',        
    dashboardText: /your request is not approved yet/i 
  }
];

describe('Login Flow for All Roles', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('logs in successfully as admin', () => {
    cy.visit('http://localhost:5173/login');

    cy.get('input[name="email"]').type('admin@gmail.com');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 10000 }).should('include', '/admin-dashboard');
    cy.contains(/admin dashboard/i).should('be.visible');
  });

  it('logs in successfully as customer', () => {
    cy.visit('http://localhost:5173/login');

    cy.get('input[name="email"]').type('customer1@gmail.com');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 10000 }).should('include', '/');
    cy.contains(/RenoBase/i).should('be.visible');
  });

  it('registers and logs in successfully as vendor', () => {
    // First register a new vendor
    const timestamp = Date.now();
    const uniqueEmail = `testvendor${timestamp}@example.com`;
    
    cy.visit('http://localhost:5173/register');
    
    // Fill registration form
    cy.get('input[name="name"]').type('Test Vendor');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="contact"]').type('1234567890');
    
    // Select vendor role
    cy.contains(/register as vendor/i).click();
    
    // Fill vendor-specific fields
    cy.get('input[name="companyName"]').type('Test Company');
    cy.get('input[name="experience"]').type('5');
    
    // Add skill
    cy.contains(/add skill/i).click();
    cy.get('select').first().select('PLUMBING');
    cy.get('input[placeholder="Base Price"]').type('1000');
    
    // Submit registration
    cy.get('button[type="submit"]').click();
    
    // Wait for registration to complete and redirect
    cy.url({ timeout: 10000 }).should('include', '/vendor-dashboard');
    cy.contains(/your vendor request is not approved yet/i).should('be.visible');
    
    // Now logout and login with the same credentials
    cy.clearCookies();
    cy.clearLocalStorage();
    
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Should still show approval pending message
    cy.url({ timeout: 10000 }).should('include', '/vendor-dashboard');
    cy.contains(/your vendor request is not approved yet/i).should('be.visible');
  });

  it('shows error on invalid credentials', () => {
    cy.visit('http://localhost:5173/login');

    cy.get('input[name="email"]').type('wronguser@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.contains(/login unsuccessful/i).should('exist');
  });
});
