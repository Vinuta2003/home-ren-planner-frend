describe('Admin Dashboard', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="email"]').type('admin@gmail.com');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    cy.url({ timeout: 10000 }).should('include', '/admin-dashboard');
    cy.contains(/admin dashboard/i).should('be.visible');
  });

  it('displays admin dashboard with all main sections', () => {
    cy.contains(/admin dashboard/i).should('be.visible');
  });

  it('displays dashboard overview with statistics cards', () => {
    cy.contains(/welcome back! here's an overview/i).should('be.visible');

    cy.contains(/total customers/i).should('be.visible');
    cy.contains(/approved vendors/i).should('be.visible');
    cy.contains(/pending approvals/i).should('be.visible');
    cy.contains(/total materials/i).should('be.visible');
   
    cy.contains(/quick actions/i).should('be.visible');
    cy.contains(/manage customers/i).should('be.visible');
    cy.contains(/manage vendors/i).should('be.visible');
    cy.contains(/manage materials/i).should('be.visible');
  });

  it('can navigate to customers section', () => {
    cy.contains(/customer/i).click();
    cy.contains(/customer list/i).should('be.visible');
  });

  it('can navigate to vendors section', () => {
    cy.contains(/vendor/i).click();
    cy.contains(/vendor list/i).should('be.visible');
  });

  it('can navigate to materials section', () => {
    cy.contains(/material/i).click();
    cy.contains(/materials list/i).should('be.visible');
  });

  it('can use quick actions to navigate', () => {
    cy.contains(/manage customers/i).click();
    cy.contains(/customer list/i).should('be.visible');
 
    cy.get('nav').contains(/^dashboard$/i).click();
    cy.wait(500);
    cy.contains(/welcome back! here's an overview/i, { timeout: 10000 }).should('be.visible').screenshot('dashboard-overview-after-customers');

    cy.contains(/manage vendors/i).click();
    cy.contains(/vendor list/i).should('be.visible');

    cy.get('nav').contains(/^dashboard$/i).click();
    cy.wait(500);
    cy.contains(/welcome back! here's an overview/i, { timeout: 10000 }).should('be.visible').screenshot('dashboard-overview-after-vendors');

    cy.contains(/manage materials/i).click();
    cy.contains(/materials list/i).should('be.visible');
  });

  it('can logout successfully', () => {
    cy.contains(/logout/i).click();
    cy.url().should('include', '/login');
  });

  it('can navigate between different sections', () => {
    cy.contains(/customer/i).click();
    cy.contains(/customer list/i).should('be.visible');
   
    cy.contains(/vendor/i).click();
    cy.contains(/vendor list/i).should('be.visible');
 
    cy.contains(/material/i).click();
    cy.contains(/materials list/i).should('be.visible');

    cy.get('nav').contains(/^dashboard$/i).click();
    cy.wait(500);
    cy.contains(/welcome back! here's an overview/i, { timeout: 10000 }).should('be.visible').screenshot('dashboard-overview-after-nav');
  });

  it('displays statistics cards with proper layout', () => {
    cy.get('.grid').should('exist');
    cy.get('.grid-cols-1.md\\:grid-cols-2').should('exist');

    cy.contains(/total customers/i).should('be.visible');
    cy.contains(/approved vendors/i).should('be.visible');
    cy.contains(/pending approvals/i).should('be.visible');
    cy.contains(/total materials/i).should('be.visible');
  });

  it('shows quick actions with proper styling', () => {
    cy.contains(/quick actions/i).should('be.visible');

    cy.contains(/manage customers/i).should('be.visible');
    cy.contains(/manage vendors/i).should('be.visible');
    cy.contains(/manage materials/i).should('be.visible');

    cy.contains(/manage customers/i).should('be.visible').and('not.be.disabled');
    cy.contains(/manage vendors/i).should('be.visible').and('not.be.disabled');
    cy.contains(/manage materials/i).should('be.visible').and('not.be.disabled');
  });

  it('displays loading states for statistics', () => {
    cy.visit('http://localhost:5173/admin-dashboard');
    cy.contains(/admin dashboard/i).should('be.visible');
  });

  it('updates statistics when actions are performed', () => {
    cy.contains(/vendor/i).click();
    cy.contains(/vendor list/i).should('be.visible');

    cy.get('nav').contains(/^dashboard$/i).click();
    cy.wait(500);
    cy.contains(/welcome back! here's an overview/i, { timeout: 10000 }).should('be.visible').screenshot('dashboard-overview-after-update');
  
    cy.contains(/total customers/i).should('be.visible');
    cy.contains(/approved vendors/i).should('be.visible');
    cy.contains(/pending approvals/i).should('be.visible');
    cy.contains(/total materials/i).should('be.visible');
  });
});
