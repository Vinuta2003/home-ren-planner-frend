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

  users.forEach(user => {
    it(`logs in successfully as ${user.role}`, () => {
      cy.visit('http://localhost:5173/login');

      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);
      cy.get('button[type="submit"]').click();

      // For vendor, check for approval message instead of dashboard
      if (user.role === 'vendor') {
        cy.url({ timeout: 10000 }).should('include', user.dashboardUrl);
        cy.contains(user.dashboardText).should('be.visible');
      } else {
        cy.url({ timeout: 10000 }).should('include', user.dashboardUrl);
        cy.contains(user.dashboardText).should('be.visible');
      }
    });
  });

  it('shows error on invalid credentials', () => {
    cy.visit('http://localhost:5173/login');

    cy.get('input[name="email"]').type('wronguser@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.contains(/login unsuccessful/i).should('exist');
  });


});
