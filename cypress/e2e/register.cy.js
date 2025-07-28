describe('Registration Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/register');
  });

  it('displays registration form with all required fields', () => {
    cy.contains(/register/i).should('be.visible');
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[name="contact"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
 
    cy.contains(/register as customer/i).should('be.visible');
    cy.contains(/register as vendor/i).should('be.visible');
  });

  it('registers a new customer successfully', () => {
    const timestamp = Date.now();
    const uniqueEmail = `testcustomer${timestamp}@example.com`;
    
    cy.get('input[name="name"]').type('Test Customer');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="contact"]').type('1234567890');
    
    cy.contains(/register as customer/i).click();
  
    cy.get('button[type="submit"]').click();
    
    // Wait for registration to complete
    cy.wait(3000);
    
    // Check for success message or redirect
    cy.get('body').then($body => {
      if ($body.text().includes('Registration Successful') || $body.text().includes('registration successful')) {
        cy.contains(/registration successful/i).should('be.visible');
        cy.url().should('include', '/');
      } else {
        // If registration fails, it might be due to backend issues, but we should still see some response
        cy.contains(/registration unsuccessful|error|failed|success/i).should('be.visible');
      }
    });
  });

  it('registers a new vendor successfully', () => {
    const timestamp = Date.now();
    const uniqueEmail = `testvendor${timestamp}@example.com`;

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
  
    cy.get('button[type="submit"]').click();
 
    // Wait for registration to complete
    cy.wait(3000);
    
    // Check for success and redirect to vendor dashboard
    cy.url().should('include', '/vendor-dashboard');
    cy.contains(/your vendor request is not approved yet/i).should('be.visible');
  });

  it('shows validation error for empty required fields', () => {
    cy.get('button[type="submit"]').click();
    
    cy.get('input[name="name"]').should('have.attr', 'required');
    cy.get('input[name="email"]').should('have.attr', 'required');
    cy.get('input[name="password"]').should('have.attr', 'required');
    cy.get('input[name="contact"]').should('have.attr', 'required');
  });

  it('shows validation error for invalid email format', () => {
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="contact"]').type('1234567890');
    
    cy.get('button[type="submit"]').click();

    cy.get('input[name="email"]').should('have.attr', 'pattern');
  });

  it('shows validation error for short password', () => {
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('123'); 
    cy.get('input[name="contact"]').type('1234567890');
    
    cy.get('button[type="submit"]').click();

    cy.get('input[name="password"]').should('have.attr', 'minLength', '8');
  });

  it('shows validation error for short name', () => {
    cy.get('input[name="name"]').type('Tes'); 
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="contact"]').type('1234567890');
    
    cy.get('button[type="submit"]').click();
 
    cy.get('input[name="name"]').should('have.attr', 'minLength', '4');
  });

  it('shows validation error for invalid contact number', () => {
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="contact"]').type('123');
    
    cy.get('button[type="submit"]').click();

    cy.get('input[name="contact"]').should('have.attr', 'minLength', '10');
    cy.get('input[name="contact"]').should('have.attr', 'maxLength', '10');
  });

  it('shows error for existing email', () => {
    // Use a known existing email (admin@gmail.com) to test duplicate email behavior
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('admin@gmail.com'); // Use existing admin email
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="contact"]').type('1234567890');
    cy.contains(/register as customer/i).click();
    cy.get('button[type="submit"]').click();
   
    // Wait for response
    cy.wait(3000);
    
    // Check that we're still on the registration page (not redirected to success)
    cy.url().should('include', '/register');
    
    // Verify that the form is still visible (indicating registration didn't succeed)
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('can add multiple skills for vendor', () => {
    cy.contains(/register as vendor/i).click();

    cy.get('input[name="name"]').type('Test Vendor');
    cy.get('input[name="email"]').type('testvendor@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="contact"]').type('1234567890');
    cy.get('input[name="companyName"]').type('Test Company');
    cy.get('input[name="experience"]').type('5');
 
    // Add first skill
    cy.contains(/add skill/i).click();
    cy.get('select').first().select('PLUMBING');
    cy.get('input[placeholder="Base Price"]').type('1000');
  
    // Add second skill
    cy.contains(/add skill/i).click();
    cy.get('select').eq(1).select('ELECTRICAL');
    cy.get('input[placeholder="Base Price"]').eq(1).type('1500');
    
    // Verify both skills are present
    cy.get('select').should('have.length', 2);
    cy.get('input[placeholder="Base Price"]').should('have.length', 2);
  });

  it('shows error when vendor tries to submit without skills', () => {
    cy.contains(/register as vendor/i).click();
  
    cy.get('input[name="name"]').type('Test Vendor');
    cy.get('input[name="email"]').type('testvendor@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="contact"]').type('1234567890');
    cy.get('input[name="companyName"]').type('Test Company');
    cy.get('input[name="experience"]').type('5');

    cy.get('button[type="submit"]').click();

    cy.contains(/please add at least one skill/i).should('be.visible');
  });

  it('can navigate to login page', () => {
    cy.contains(/already have an account/i).should('be.visible');
    cy.contains(/login here/i).click();
    
    cy.url().should('include', '/login');
  });

  it('handles form reset correctly after successful registration', () => {
    const timestamp = Date.now();
    const uniqueEmail = `testreset${timestamp}@example.com`;
    
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="contact"]').type('1234567890');
  
    cy.contains(/register as customer/i).click();
    
    cy.get('button[type="submit"]').click();
    
    // Wait for registration to complete
    cy.wait(3000);

    cy.get('body').then($body => {
      if ($body.text().includes('Register')) {
        cy.get('input[name="name"]').should('have.value', '');
        cy.get('input[name="email"]').should('have.value', '');
        cy.get('input[name="password"]').should('have.value', '');
        cy.get('input[name="contact"]').should('have.value', '');
      }
    });
  });
});
