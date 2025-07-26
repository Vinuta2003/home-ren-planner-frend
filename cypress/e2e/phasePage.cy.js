describe('PhasePage E2E Tests (Simplified)', () => {
  const testPhaseId = 'test-phase-123';
  
  beforeEach(() => {
    const mockJwtPayload = {
      sub: 'test-user-123',
      role: 'CUSTOMER',
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
      iat: Math.floor(Date.now() / 1000)
    };
    
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
      btoa(JSON.stringify(mockJwtPayload)) + 
      '.mock-signature';

    cy.visit('/');
    
    cy.window().then((win) => {
      win.jwtDecode = () => mockJwtPayload;
      
      win.localStorage.setItem('token', mockToken);
      win.localStorage.setItem('accessToken', mockToken);
      win.localStorage.setItem('userRole', 'CUSTOMER');
      win.localStorage.setItem('role', 'CUSTOMER');
      win.localStorage.setItem('email', 'test@example.com');
      
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
    
    cy.wait(2000);

    cy.intercept('GET', `http://localhost:8080/phase/${testPhaseId}`, {
      statusCode: 200,
      body: {
        id: testPhaseId,
        phaseName: 'Foundation Work',
        description: 'Building foundation and basement',
        phaseType: 'FOUNDATION',
        startDate: '2025-01-01',
        endDate: '2025-01-15',
        phaseStatus: 'INPROGRESS',
        vendor: {
          id: 'vendor-1',
          name: 'Construction Co'
        },
        totalPhaseCost: 50000,
        totalPhaseMaterialCost: 30000,
        vendorCost: 20000,
        phaseMaterialUserResponseList: [
          {
            exposedId: 'pm-1',
            name: 'Cement Bags',
            materialExposedId: 'mat-1',
            quantity: 50,
            cost: 5000,
            unit: 'bag',
            pricePerQuantity: 100,
            totalPrice: 5000,
            phaseId: testPhaseId
          },
          {
            exposedId: 'pm-2', 
            name: 'Steel Rods',
            materialExposedId: 'mat-2',
            quantity: 20,
            cost: 8000,
            unit: 'piece',
            pricePerQuantity: 400,
            totalPrice: 8000,
            phaseId: testPhaseId
          }
        ]
      }
    }).as('getPhaseDetails');

    cy.intercept('GET', 'http://localhost:8080/api/user/materials?phaseType=FOUNDATION', {
      statusCode: 200,
      body: [
        {
          exposedId: 'material-1',
          name: 'Concrete Mix',
          description: 'High-grade concrete for foundation',
          cost: 150,
          unit: 'bag'
        },
        {
          exposedId: 'material-2',
          name: 'Rebar Steel',
          description: 'Reinforcement steel bars',
          cost: 200,
          unit: 'piece'
        }
      ]
    }).as('getMaterialsByPhaseType');

    cy.intercept('POST', '/api/user/phase/*/phase-materials', {
      statusCode: 200,
      body: { success: true, message: 'Materials added successfully' }
    }).as('addMaterials');

    cy.visit(`/phase/${testPhaseId}`);
  });

  describe('Page Loading and Authentication', () => {
    it('should load phase page when authenticated as customer', () => {
      cy.url().should('include', `/phase/${testPhaseId}`);
      
      cy.get('body', { timeout: 10000 }).should('be.visible');
      
      cy.wait('@getPhaseDetails', { timeout: 10000 }).then(() => {
        cy.contains('Phase Details').should('be.visible');
        cy.contains('Foundation Work').should('be.visible');
      });
    });

    it('should debug what is actually displayed on the page', () => {
      cy.get('body').then(($body) => {
        cy.log('Page content:', $body.text());
      });
      
      cy.get('body').should('contain.text', 'Phase');
      
      cy.get('body').should('not.contain.text', 'Error');
      cy.get('body').should('not.contain.text', '404');
      cy.get('body').should('not.contain.text', 'Not Found');
    });

    it('should display phase information correctly', () => {
      cy.wait('@getPhaseDetails', { timeout: 15000 });
      
      cy.contains('Foundation Work').should('be.visible');
      cy.contains('Building foundation and basement').should('be.visible');
      cy.contains('FOUNDATION').should('be.visible');
      cy.contains('INPROGRESS').should('be.visible');
      cy.contains('Construction Co').should('be.visible');
      
      cy.contains('₹30000').should('be.visible');
      cy.contains('₹20000').should('be.visible');
      cy.contains('₹50000').should('be.visible');
    });

    it('should display existing phase materials', () => {
      cy.wait('@getPhaseDetails');
      
      cy.wait(2000);
      
      cy.contains('Materials Added To Phase').should('be.visible');
      
      cy.get('body').then(($body) => {
        console.log('Page content:', $body.text());
      });
      
      cy.get('.rounded-2xl.shadow-md', { timeout: 10000 }).should('have.length.at.least', 1);
      
      cy.get('body', { timeout: 15000 }).should('contain.text', 'Cement Bags');
      cy.get('body', { timeout: 15000 }).should('contain.text', 'Steel Rods');
    });
  });

  describe('Add Materials Functionality', () => {
    it('should enter add materials mode when button is clicked', () => {
      cy.wait('@getPhaseDetails');
      
      cy.contains('Add Materials').click();
      
      cy.wait('@getMaterialsByPhaseType');
      
      cy.contains('Materials Available To Add').should('be.visible');
      cy.contains('Cancel').should('be.visible');
    });

    it('should display available materials in add mode', () => {
      cy.wait('@getPhaseDetails');
      
      cy.contains('Add Materials').click();
      cy.wait('@getMaterialsByPhaseType');
      
      cy.contains('Concrete Mix').should('be.visible');
      cy.contains('Rebar Steel').should('be.visible');
    });

    it('should exit add mode when cancel is clicked', () => {
      cy.wait('@getPhaseDetails');
      
      cy.contains('Add Materials').click();
      cy.wait('@getMaterialsByPhaseType');
      
      cy.contains('Materials Available To Add').should('be.visible');
      cy.contains('Cancel').click();
      
      cy.contains('Materials Available To Add').should('not.exist');
      cy.contains('Add Materials').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully when loading phase details', () => {
      // Mock API error with full backend URL
      cy.intercept('GET', `http://localhost:8080/phase/${testPhaseId}`, {
        statusCode: 500,
        body: { error: 'Internal server error' }
      }).as('getPhaseDetailsError');
      
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-jwt-token');
        win.localStorage.setItem('userRole', 'CUSTOMER');
      });
      
      cy.visit(`/phase/${testPhaseId}`);
      cy.wait('@getPhaseDetailsError');
      
      // The page should still render without crashing
      cy.contains('Phase Details').should('be.visible');
    });

    it('should handle materials API errors when entering add mode', () => {
      cy.wait('@getPhaseDetails');
      
      // Mock materials API error with full backend URL
      cy.intercept('GET', 'http://localhost:8080/api/user/materials?phaseType=FOUNDATION', {
        statusCode: 500,
        body: { error: 'Failed to fetch materials' }
      }).as('getMaterialsError');
      
      cy.contains('Add Materials').click();
      cy.wait('@getMaterialsError');
      
      cy.contains('Materials Available To Add').should('be.visible');
    });
  });

  describe('Review Modal for Completed Phases', () => {
    it('should show review modal for completed phases with vendors', () => {
      cy.intercept('GET', `http://localhost:8080/phase/${testPhaseId}`, {
        statusCode: 200,
        body: {
          id: testPhaseId,
          phaseName: 'Completed Foundation',
          description: 'Foundation work completed',
          phaseType: 'FOUNDATION',
          startDate: '2025-01-01',
          endDate: '2025-01-15',
          phaseStatus: 'COMPLETED',
          vendor: {
            id: 'vendor-1',
            name: 'Construction Co'
          },
          totalPhaseCost: 50000,
          totalPhaseMaterialCost: 30000,
          vendorCost: 20000,
          phaseMaterialList: []
        }
      }).as('getCompletedPhase');
      
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-jwt-token');
        win.localStorage.setItem('userRole', 'CUSTOMER');
      });
      
      cy.visit(`/phase/${testPhaseId}`);
      cy.wait('@getCompletedPhase');
      
      cy.get('body').should('contain', 'Completed Foundation');
    });
  });

  describe('Responsive Design', () => {
    it('should be responsive on mobile devices', () => {
      cy.viewport('iphone-x');
      cy.wait('@getPhaseDetails');
      
      cy.contains('Phase Details').should('be.visible');
      cy.contains('Foundation Work').should('be.visible');
      cy.contains('Add Materials').should('be.visible');
    });

    it('should be responsive on tablet devices', () => {
      cy.viewport('ipad-2');
      cy.wait('@getPhaseDetails');
      
      cy.contains('Phase Details').should('be.visible');
      cy.contains('Materials Added To Phase').should('be.visible');
    });
  });

  describe('Navigation and UI Interactions', () => {
    it('should show edit button and handle clicks', () => {
      cy.wait('@getPhaseDetails');
      
      cy.get('[title="Edit Phase"]').should('be.visible');
      cy.get('[title="Edit Phase"]').should('not.be.disabled');
      
      cy.get('[title="Edit Phase"]').should('have.class', 'text-blue-600');
      
      cy.get('[title="Edit Phase"]').trigger('mouseover');
      cy.get('[title="Edit Phase"]').should('have.class', 'hover:text-blue-800');
    });

    it('should handle keyboard navigation', () => {
      cy.wait('@getPhaseDetails');
      
      cy.get('button, input, [tabindex]').first().focus();
      cy.focused().should('be.visible');
      
      cy.focused().trigger('keydown', { key: 'Tab' });
      
      cy.get('button, input, [tabindex]').eq(1).should('be.visible');
      
      cy.get('[title="Edit Phase"]').focus();
      cy.focused().should('be.visible');
    });
  });

  describe('Performance and Load Testing', () => {
    it('should load within acceptable time limits', () => {
      const startTime = Date.now();
      
      cy.visit(`/phase/${testPhaseId}`);
      cy.wait('@getPhaseDetails');
      
      cy.contains('Phase Details').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(5000);
      });
    });
  });
});
