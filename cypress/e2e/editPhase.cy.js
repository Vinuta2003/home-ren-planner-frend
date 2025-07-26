describe('EditPhase Component', () => {
  const testPhaseId = 'test-phase-123';
  
  const mockPhaseData = {
    id: testPhaseId,
    phaseName: 'Civil Construction',
    description: 'Foundation and structural work',
    startDate: '2025-03-01',
    endDate: '2025-03-15',
    phaseStatus: 'INPROGRESS',
    phaseType: 'CIVIL'
  };
  
  const mockPhaseStatuses = ['NOTSTARTED', 'INPROGRESS', 'COMPLETED', 'INSPECTION'];

  beforeEach(() => {
    const mockJwtPayload = {
      sub: 'test@example.com',
      role: 'CUSTOMER',
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
      iat: Math.floor(Date.now() / 1000)
    };
    
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
      Buffer.from(JSON.stringify(mockJwtPayload)).toString('base64') + 
      '.mock-signature';

    cy.visit('/');
    
    cy.window().then((win) => {
      win.jwtDecode = () => mockJwtPayload;
      
      win.localStorage.setItem('token', mockToken);
      win.localStorage.setItem('accessToken', mockToken);
      win.localStorage.setItem('userRole', 'CUSTOMER');
      win.localStorage.setItem('role', 'CUSTOMER');
      win.localStorage.setItem('email', 'test@example.com');
      
      // Add the critical persist:root data that PhaseForm uses
      const persistData = {
        email: '"test@example.com"',
        role: '"CUSTOMER"',
        accessToken: `"${mockToken}"`,
        url: 'null',
        _persist: '{"version":-1,"rehydrated":true}'
      };
      win.localStorage.setItem('persist:root', JSON.stringify(persistData));
    });
    
    cy.reload();
    cy.wait(1000);

    cy.intercept('GET', `http://localhost:8080/phase/${testPhaseId}`, {
      statusCode: 200,
      body: mockPhaseData
    }).as('getPhaseData');

    cy.intercept('GET', 'http://localhost:8080/api/enums/phase-statuses', {
      statusCode: 200,
      body: mockPhaseStatuses
    }).as('getPhaseStatuses');
  });

  describe('Component Loading', () => {
    it('should load and display the edit phase form with existing data', () => {
      cy.visit(`/editphase/${testPhaseId}`);
      cy.wait('@getPhaseData');
      cy.wait('@getPhaseStatuses');

      cy.contains('h1', 'Edit Phase').should('be.visible');

      cy.get('input[name="phaseName"]').should('have.value', mockPhaseData.phaseName);
      cy.get('textarea[name="description"]').should('have.value', mockPhaseData.description);
      cy.get('input[name="startDate"]').should('have.value', mockPhaseData.startDate);
      cy.get('input[name="endDate"]').should('have.value', mockPhaseData.endDate);
      cy.get('select[name="phaseStatus"]').should('have.value', mockPhaseData.phaseStatus);

      console.log('SUCCESS: EditPhase form loaded with existing data');
      cy.log('✓ EditPhase form loaded and populated correctly');
    });

    it('should show loading state when phase data is not available', () => {
      cy.intercept('GET', `http://localhost:8080/phase/${testPhaseId}`, {
        statusCode: 200,
        body: null,
        delay: 1000
      }).as('getPhaseDataDelayed');

      cy.visit(`/editphase/${testPhaseId}`);
      
      cy.contains('Loading...').should('be.visible');
      
      cy.log('✓ Loading state displayed correctly');
    });

    it('should handle API errors gracefully when loading phase data', () => {
      cy.intercept('GET', `http://localhost:8080/phase/${testPhaseId}`, {
        statusCode: 404,
        body: { error: 'Phase not found' }
      }).as('getPhaseDataError');
      cy.intercept('GET', 'http://localhost:8080/api/enums/phase-statuses', {
        statusCode: 200,
        body: mockPhaseStatuses
      }).as('getPhaseStatusesSuccess');

      cy.visit(`/editphase/${testPhaseId}`);
      
      cy.wait('@getPhaseDataError');
      cy.wait('@getPhaseStatusesSuccess');
      
      cy.get('input[name="phaseName"]').should('have.value', '');
      cy.get('textarea[name="description"]').should('have.value', '');
      cy.get('input[name="startDate"]').should('have.value', '');
      cy.get('input[name="endDate"]').should('have.value', '');
      
      cy.get('select[name="phaseStatus"]').should('be.visible');
      
      cy.log('✓ API error handled gracefully with empty form values');
    });
  });

  describe('Form Field Interactions', () => {
    beforeEach(() => {
      cy.visit(`/editphase/${testPhaseId}`);
      cy.wait('@getPhaseData');
      cy.wait('@getPhaseStatuses');
    });

    it('should allow editing all form fields', () => {
      const updatedData = {
        phaseName: 'Updated Civil Work',
        description: 'Updated foundation and structural work',
        startDate: '2025-04-01',
        endDate: '2025-04-20',
        phaseStatus: 'COMPLETED'
      };

      cy.get('input[name="phaseName"]').clear().type(updatedData.phaseName);
      cy.get('textarea[name="description"]').clear().type(updatedData.description);
      cy.get('input[name="startDate"]').clear().type(updatedData.startDate);
      cy.get('input[name="endDate"]').clear().type(updatedData.endDate);
      cy.get('select[name="phaseStatus"]').select(updatedData.phaseStatus);

      cy.get('input[name="phaseName"]').should('have.value', updatedData.phaseName);
      cy.get('textarea[name="description"]').should('have.value', updatedData.description);
      cy.get('input[name="startDate"]').should('have.value', updatedData.startDate);
      cy.get('input[name="endDate"]').should('have.value', updatedData.endDate);
      cy.get('select[name="phaseStatus"]').should('have.value', updatedData.phaseStatus);

      console.log('SUCCESS: All form fields can be edited');
      cy.log('✓ All form fields are editable and update correctly');
    });

    it('should populate phase status dropdown with available options', () => {
      cy.get('select[name="phaseStatus"]').within(() => {
        mockPhaseStatuses.forEach(status => {
          cy.get(`option[value="${status}"]`).should('exist');
        });
      });

      cy.get('select[name="phaseStatus"]').select('COMPLETED');
      cy.get('select[name="phaseStatus"]').should('have.value', 'COMPLETED');

      cy.get('select[name="phaseStatus"]').select('NOTSTARTED');
      cy.get('select[name="phaseStatus"]').should('have.value', 'NOTSTARTED');

      cy.log('✓ Phase status dropdown populated and functional');
    });

    it('should handle empty field values gracefully', () => {
      cy.get('input[name="phaseName"]').clear();
      cy.get('textarea[name="description"]').clear();
      cy.get('input[name="startDate"]').clear();
      cy.get('input[name="endDate"]').clear();
      cy.get('input[name="phaseName"]').should('have.value', '');
      cy.get('textarea[name="description"]').should('have.value', '');
      cy.get('input[name="startDate"]').should('have.value', '');
      cy.get('input[name="endDate"]').should('have.value', '');

      cy.log('✓ Empty field values handled gracefully');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      cy.visit(`/editphase/${testPhaseId}`);
      cy.wait('@getPhaseData');
      cy.wait('@getPhaseStatuses');
    });

    it('should successfully update phase data and navigate to phase page', () => {
      const updatedData = {
        ...mockPhaseData,
        phaseName: 'Updated Phase Name',
        description: 'Updated description'
      };

      // Mock successful update
      cy.intercept('PUT', `http://localhost:8080/phase/${testPhaseId}`, {
        statusCode: 200,
        body: updatedData
      }).as('updatePhase');

      // Mock the phase detail page that we'll navigate to after update
      cy.intercept('GET', `http://localhost:8080/phase/${testPhaseId}`, {
        statusCode: 200,
        body: updatedData
      }).as('getUpdatedPhase');


      cy.get('input[name="phaseName"]').clear().type(updatedData.phaseName);
      cy.get('textarea[name="description"]').clear().type(updatedData.description);


      cy.get('button[type="submit"]').click();

      cy.wait('@updatePhase').then((interception) => {
        expect(interception.request.body).to.deep.include({
          phaseName: updatedData.phaseName,
          description: updatedData.description
        });
      });

      cy.wait(1000);

      cy.url().should('include', `/phase/${testPhaseId}`);

      console.log('SUCCESS: Phase updated and navigation successful');
      cy.log('✓ Phase update and navigation completed successfully');
    });

    it('should handle update errors and show alert', () => {
      cy.intercept('PUT', `http://localhost:8080/phase/${testPhaseId}`, {
        statusCode: 500,
        body: { error: 'Update failed' }
      }).as('updatePhaseError');

      cy.window().then((win) => {
        cy.stub(win, 'alert').as('windowAlert');
        cy.stub(win.console, 'error').as('consoleError');
      });

      cy.get('input[name="phaseName"]').clear().type('Updated Name');
      cy.get('button[type="submit"]').click();

      cy.wait('@updatePhaseError');
      cy.get('@consoleError').should('have.been.calledWith', 'Phase update error:', Cypress.sinon.match.any);
      cy.get('@windowAlert').should('have.been.calledWith', 'Failed to update phase.');

      cy.url().should('include', `/editphase/${testPhaseId}`);

      console.log('SUCCESS: Update error handled correctly');
      cy.log('✓ Update error handled with proper alert and logging');
    });

    it('should send complete phase data in update request', () => {
      cy.intercept('PUT', `http://localhost:8080/phase/${testPhaseId}`, {
        statusCode: 200,
        body: mockPhaseData
      }).as('updatePhaseComplete');
      cy.get('input[name="phaseName"]').clear().type('Modified Name');

      cy.get('button[type="submit"]').click();

      cy.wait('@updatePhaseComplete').then((interception) => {
        const requestBody = interception.request.body;
        expect(requestBody).to.have.property('phaseName', 'Modified Name');
        expect(requestBody).to.have.property('description', mockPhaseData.description);
        expect(requestBody).to.have.property('startDate', mockPhaseData.startDate);
        expect(requestBody).to.have.property('endDate', mockPhaseData.endDate);
        expect(requestBody).to.have.property('phaseStatus', mockPhaseData.phaseStatus);
      });

      cy.log('✓ Complete phase data sent in update request');
    });
  });

  describe('Navigation and User Interactions', () => {
    beforeEach(() => {
      cy.visit(`/editphase/${testPhaseId}`);
      cy.wait('@getPhaseData');
      cy.wait('@getPhaseStatuses');
    });

    it('should navigate to phase page when Cancel button is clicked', () => {
      // Mock the phase detail page that Cancel button navigates to
      cy.intercept('GET', `http://localhost:8080/phase/${testPhaseId}`, {
        statusCode: 200,
        body: mockPhaseData
      }).as('getPhaseDetail');

      // Mock any other APIs that might be called on the phase detail page
      cy.intercept('GET', 'http://localhost:8080/api/enums/phase-statuses', {
        statusCode: 200,
        body: mockPhaseStatuses
      }).as('getPhaseStatusesForDetail');

      cy.get('button').contains('Cancel').click();
      
      // Wait a moment for navigation to complete
      cy.wait(1000);
      
      cy.url().should('include', `/phase/${testPhaseId}`);

      console.log('SUCCESS: Cancel button navigation works');
      cy.log('✓ Cancel button navigates to phase page');
    });

    it('should have proper button styling and hover effects', () => {
      cy.get('button[type="submit"]')
        .should('have.class', 'bg-green-600')
        .should('have.class', 'hover:bg-green-700')
        .should('contain.text', 'Save Changes');
      cy.get('button').contains('Cancel')
        .should('have.class', 'bg-gray-500')
        .should('have.class', 'hover:bg-gray-600');

      cy.log('✓ Button styling and classes are correct');
    });

    it('should maintain form state during user interactions', () => {
      cy.get('input[name="phaseName"]').clear().type('Test Phase Name');
      cy.get('textarea[name="description"]').clear().type('Test description');

      cy.get('h1').click();
      cy.get('input[name="phaseName"]').should('have.value', 'Test Phase Name');
      cy.get('textarea[name="description"]').should('have.value', 'Test description');

      cy.log('✓ Form state maintained during interactions');
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      cy.visit(`/editphase/${testPhaseId}`);
      cy.wait('@getPhaseData');
      cy.wait('@getPhaseStatuses');
    });

    it('should display properly on mobile devices', () => {
      cy.viewport(375, 667); // iPhone SE
      cy.get('form').should('be.visible');
      cy.get('.grid').should('have.class', 'grid-cols-1');
      cy.get('input[name="phaseName"]').should('be.visible');
      cy.get('textarea[name="description"]').should('be.visible');
      cy.get('input[name="startDate"]').should('be.visible');
      cy.get('input[name="endDate"]').should('be.visible');
      cy.get('select[name="phaseStatus"]').should('be.visible');

      cy.log('✓ Mobile responsive design works correctly');
    });

    it('should display properly on tablet devices', () => {
      cy.viewport(768, 1024); // iPad
      cy.get('form').should('be.visible');
      cy.get('.sm\\:grid-cols-2').should('be.visible');
      cy.get('.sm\\:col-span-2').should('be.visible');

      cy.log('✓ Tablet responsive design works correctly');
    });

    it('should display properly on desktop devices', () => {
      cy.viewport(1280, 720); // Desktop
      cy.get('form').should('be.visible');
      cy.get('.sm\\:grid-cols-2').should('be.visible');
      cy.get('.max-w-5xl').should('be.visible');
      cy.get('.gap-6').should('be.visible');

      cy.log('✓ Desktop responsive design works correctly');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      cy.visit(`/editphase/${testPhaseId}`);
      cy.wait('@getPhaseData');
      cy.wait('@getPhaseStatuses');
    });

    it('should have proper form labels and structure', () => {
      cy.get('label').contains('Phase Name').should('be.visible');
      cy.get('label').contains('Description').should('be.visible');
      cy.get('label').contains('Start Date').should('be.visible');
      cy.get('label').contains('End Date').should('be.visible');
      cy.get('label').contains('Status').should('be.visible');

      cy.get('form').should('exist');
      cy.get('input[name="phaseName"]').should('have.attr', 'type', 'text');
      cy.get('input[name="startDate"]').should('have.attr', 'type', 'date');
      cy.get('input[name="endDate"]').should('have.attr', 'type', 'date');

      cy.log('✓ Form labels and structure are accessible');
    });

    it('should support keyboard navigation', () => {
      console.log('=== EDITPHASE ACCESSIBILITY KEYBOARD NAVIGATION TEST ===');
      cy.log('Testing keyboard navigation through EditPhase form fields');

      cy.get('input[name="phaseName"]').focus();
      cy.focused().should('have.attr', 'name', 'phaseName');
      cy.log('✓ Phase name field is focusable');

      cy.get('textarea[name="description"]').focus();
      cy.focused().should('have.attr', 'name', 'description');
      cy.log('✓ Description field is focusable');

      cy.get('input[name="startDate"]').focus();
      cy.focused().should('have.attr', 'name', 'startDate');
      cy.log('✓ Start date field is focusable');

      cy.get('input[name="endDate"]').focus();
      cy.focused().should('have.attr', 'name', 'endDate');
      cy.log('✓ End date field is focusable');

      cy.get('select[name="phaseStatus"]').focus();
      cy.focused().should('have.attr', 'name', 'phaseStatus');
      cy.log('✓ Phase status select is focusable');

      cy.get('button[type="submit"]').focus();
      cy.focused().should('contain.text', 'Save Changes');
      cy.log('✓ Save Changes button is focusable');

      cy.get('button').contains('Cancel').focus();
      cy.focused().should('contain.text', 'Cancel');
      cy.log('✓ Cancel button is focusable');

      console.log('SUCCESS: All EditPhase form fields are keyboard accessible');
      cy.log('SUCCESS: EditPhase keyboard navigation accessibility test completed');
    });

    it('should have proper heading hierarchy', () => {
      cy.get('h1').should('contain.text', 'Edit Phase');
      cy.get('h1').should('have.class', 'text-2xl');
      cy.get('h1').should('have.class', 'font-bold');

      cy.log('✓ Proper heading hierarchy maintained');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle invalid phase ID gracefully', () => {
      const invalidPhaseId = 'invalid-phase-id';
      
      cy.intercept('GET', `http://localhost:8080/phase/${invalidPhaseId}`, {
        statusCode: 404,
        body: { error: 'Phase not found' }
      }).as('getPhaseNotFound');

      cy.intercept('GET', 'http://localhost:8080/api/enums/phase-statuses', {
        statusCode: 200,
        body: mockPhaseStatuses
      }).as('getPhaseStatusesSuccess');

      cy.visit(`/editphase/${invalidPhaseId}`);
      cy.wait('@getPhaseNotFound');
      cy.wait('@getPhaseStatusesSuccess');

      cy.get('input[name="phaseName"]').should('have.value', '');
      cy.get('textarea[name="description"]').should('have.value', '');
      cy.get('input[name="startDate"]').should('have.value', '');
      cy.get('input[name="endDate"]').should('have.value', '');
      
      cy.get('select[name="phaseStatus"]').should('be.visible');
      
      cy.get('h1').should('contain.text', 'Edit Phase');
      cy.get('button[type="submit"]').should('be.visible');
      cy.get('button').contains('Cancel').should('be.visible');

      cy.log('✓ Invalid phase ID handled gracefully with empty form');
    });

    it('should handle network timeouts', () => {
      cy.intercept('GET', `http://localhost:8080/phase/${testPhaseId}`, {
        statusCode: 200,
        body: mockPhaseData,
        delay: 5000 
      }).as('getPhaseDataSlow');

      cy.intercept('GET', 'http://localhost:8080/api/enums/phase-statuses', {
        statusCode: 200,
        body: mockPhaseStatuses
      }).as('getPhaseStatusesNormal');

      cy.visit(`/editphase/${testPhaseId}`);
      
      cy.get('h1').should('contain.text', 'Edit Phase');
      cy.get('input[name="phaseName"]').should('be.visible').and('have.value', '');
      
      cy.wait('@getPhaseDataSlow', { timeout: 10000 });
      cy.wait('@getPhaseStatusesNormal');
      
      cy.get('input[name="phaseName"]').should('have.value', mockPhaseData.phaseName);
      cy.get('textarea[name="description"]').should('have.value', mockPhaseData.description);

      cy.log('✓ Network timeout handled - form displays then populates when data loads');
    });

    it('should handle malformed API responses', () => {
      cy.intercept('GET', `http://localhost:8080/phase/${testPhaseId}`, {
        statusCode: 200,
        body: { invalidData: 'malformed' }
      }).as('getMalformedData');

      cy.visit(`/editphase/${testPhaseId}`);
      cy.wait('@getMalformedData');

      cy.get('input[name="phaseName"]').should('have.value', '');
      cy.get('textarea[name="description"]').should('have.value', '');

      cy.log('✓ Malformed API response handled gracefully');
    });
  });
});
