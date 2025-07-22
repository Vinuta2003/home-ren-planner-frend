describe('Vendor List Display', () => {
  const baseUrl = 'http://localhost:5173';

  beforeEach(() => {
    // Intercepting API call to return mock vendor data
    cy.intercept('GET', '/api/vendor-reviews/by-phaseType*', {
      statusCode: 200,
      body: [
        {
          id: '1',
          name: 'John Doe',
          companyName: 'BuildPro',
          experience: 5,
          basePrice: 1000,
          rating: 4.5,
          pic: '',
          reviews: [
            {
              reviewerName: 'Alice',
              rating: 4.5,
              comment: 'Great work!',
              createdAt: new Date().toISOString(),
            },
          ],
        },
      ],
    }).as('getVendors');

    // Visit the vendor list page directly
    cy.visit(`${baseUrl}/vendor-list?phaseType=ELECTRICAL`);
  });

  it('should load vendors and display them', () => {
    cy.wait('@getVendors');
    cy.contains('Vendor List for Phase Type: ELECTRICAL');
    cy.contains('John Doe');
    cy.contains('BuildPro');
    cy.contains('₹1000');
  });

  it('should open vendor profile when "View Profile" is clicked', () => {
    cy.wait('@getVendors');
    cy.contains('View Profile').click();

    cy.contains('John Doe');
    cy.contains('Experience: 5 years');
    cy.contains('Company: BuildPro');
    cy.contains('Great work!');
    cy.contains('Select this Vendor');
  });

  it('should navigate to phase form with selected vendor', () => {
    cy.wait('@getVendors');
    cy.contains('Select Vendor').click();

    cy.url().should('include', '/phase-form');
    cy.url().should('include', 'vendorId=1');
  });
});
