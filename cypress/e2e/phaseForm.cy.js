describe('PhaseForm', () => {
    const exposedId = '11111111-1111-1111-1111-111111111111';
  
    beforeEach(() => {
      // Mock room API
      cy.intercept('GET', `**/rooms/${exposedId}`, {
        statusCode: 200,
        body: {
          id: exposedId,
          renovationType: 'KITCHEN_RENOVATION',
        },
      }).as('getRoom');
  
      // Mock phase-statuses API
      cy.intercept('GET', '**/api/enums/phase-statuses', {
        statusCode: 200,
        body: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'],
      }).as('getPhaseStatuses');
  
      // Mock phase types API
      cy.intercept('GET', '**/phase/phases/by-renovation-type/KITCHEN_RENOVATION', {
        statusCode: 200,
        body: ['CIVIL', 'ELECTRICAL', 'PAINTING'],
      }).as('getPhaseTypes');
  
      // Mock phase exists API
      cy.intercept('GET', '**/phase/phase/exists**', {
        statusCode: 200,
        body: false,
      }).as('checkPhaseExists');
  
      // Mock create phase API
      cy.intercept('POST', '**/phase', {
        statusCode: 201,
      }).as('createPhase');
  
      // Mock review post API
      cy.intercept('POST', '**/api/vendor-reviews/reviews', {
        statusCode: 200,
      }).as('postReview');
  
      // Visit the page
      cy.visit(`/phase-form/${exposedId}?vendorId=abcd-1234&vendorName=SampleVendor`, {
        onBeforeLoad(win) {
          win.localStorage.clear();
        }
      });
  
      cy.wait(['@getRoom', '@getPhaseStatuses', '@getPhaseTypes']);
    });
  
    it('fills out the form and submits successfully', () => {
      // Fill basic inputs
      cy.get('input[name="phaseName"]').type('Test Phase');
      cy.get('textarea[name="description"]').type('Test description');
  
      // Select Phase Type
      cy.get('select[name="phaseType"]').select('CIVIL');
  
      // Vendor name auto-filled from query param
      cy.get('input[name="vendorName"]').should('have.value', 'SampleVendor');
  
      // Select Phase Status
      cy.get('select[name="phaseStatus"]').select('COMPLETED');
  
      // Pick start and end dates
      const today = new Date().toISOString().split("T")[0];
      cy.get('input[name="startDate"]').type(today);
      cy.get('input[name="endDate"]').type(today);
  
      // Fill review
      cy.get('textarea[placeholder="Write your comment"]').type('Great job!');
      cy.get('button').contains('★').eq(4).click(); // Click 5 stars
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Should make API calls
      cy.wait('@checkPhaseExists');
      cy.wait('@postReview');
  
      // Confirm redirect (replace with your expected path)
      cy.url().should('include', `/phase/room/${exposedId}`);
    });
  });
  