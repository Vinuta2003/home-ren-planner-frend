describe('PhaseList E2E Tests', () => {
  const testRoomId = 'test-room-123';
  const mockPhases = [
    {
      id: 'phase-1',
      phaseName: 'Foundation Work',
      startDate: '2025-01-01',
      endDate: '2025-01-15',
      phaseStatus: 'INPROGRESS'
    },
    {
      id: 'phase-2',
      phaseName: 'Framing',
      startDate: '2025-01-16',
      endDate: '2025-02-01',
      phaseStatus: 'NOTSTARTED'
    },
    {
      id: 'phase-3',
      phaseName: 'Electrical Work',
      startDate: '2025-02-02',
      endDate: '2025-02-15',
      phaseStatus: 'INSPECTION'
    }
  ];

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
    cy.wait(1000);
  });

  describe('Phase List Rendering', () => {
    it('should load and display phases correctly', () => {
      cy.intercept('GET', `http://localhost:8080/phase/room/${testRoomId}`, {
        statusCode: 200,
        body: mockPhases
      }).as('getPhases');

      cy.visit(`/phase/room/${testRoomId}`);
      cy.wait('@getPhases');
      cy.contains('Foundation Work').should('be.visible');
      cy.contains('Framing').should('be.visible');
      cy.contains('Electrical Work').should('be.visible');
    });

    it('should show content after API call completes', () => {
      cy.intercept('GET', `http://localhost:8080/phase/room/${testRoomId}`, {
        statusCode: 200,
        body: mockPhases,
        delay: 1000
      }).as('getPhases');

      cy.visit(`/phase/room/${testRoomId}`);
      cy.contains('Foundation Work').should('not.exist');
      cy.wait('@getPhases');
      cy.contains('Foundation Work').should('be.visible');
      cy.contains('Framing').should('be.visible');
    });

    it('should display phases when data is loaded', () => {
      cy.intercept('GET', `http://localhost:8080/phase/room/${testRoomId}`, {
        statusCode: 200,
        body: mockPhases
      }).as('getPhases');

      cy.visit(`/phase/room/${testRoomId}`);
      cy.wait('@getPhases');
      cy.contains('h1', 'Phases').should('be.visible');
      cy.contains('Foundation Work').should('be.visible');
      cy.contains('Framing').should('be.visible');
      cy.contains('Electrical Work').should('be.visible');
      cy.contains('Start Date: 01-01-2025').should('be.visible');
      cy.contains('End Date: 15-01-2025').should('be.visible');
      cy.contains('INPROGRESS').should('have.class', 'bg-green-100');
      cy.contains('NOTSTARTED').should('have.class', 'bg-red-100');
      cy.contains('INSPECTION').should('have.class', 'bg-yellow-100');
    });

    it('should display empty state when no phases exist', () => {
      cy.intercept('GET', `http://localhost:8080/phase/room/${testRoomId}`, {
        statusCode: 200,
        body: []
      }).as('getEmptyPhases');

      cy.visit(`/phase/room/${testRoomId}`);
      cy.wait('@getEmptyPhases');

      cy.contains('No phases found. Create one now!').should('be.visible');
    });

    it('should handle API error gracefully', () => {
      cy.intercept('GET', `http://localhost:8080/phase/room/${testRoomId}`, {
        statusCode: 500,
        body: { error: 'Internal server error' }
      }).as('getPhaseError');

      cy.visit(`/phase/room/${testRoomId}`);
      cy.wait('@getPhaseError');
      cy.contains('No phases found. Create one now!').should('be.visible');
    });
  });

  describe('Phase Navigation', () => {
    beforeEach(() => {
      cy.intercept('GET', `http://localhost:8080/phase/room/${testRoomId}`, {
        statusCode: 200,
        body: mockPhases
      }).as('getPhases');

      cy.visit(`/phase/room/${testRoomId}`);
      cy.wait('@getPhases');
    });

    it('should navigate to phase details when phase is clicked', () => {
      cy.intercept('GET', 'http://localhost:8080/phase/phase-1', {
        statusCode: 200,
        body: mockPhases[0]
      }).as('getPhaseDetails');
      cy.contains('Foundation Work').click();
      cy.url().should('include', '/phase/phase-1');
    });

    it('should navigate to phase form when create button is clicked', () => {
      cy.get('button.fixed.bottom-6.right-6').click();
      cy.url().should('include', `/phase-form/${testRoomId}`);
    });

    it('should show create phase tooltip on hover', () => {
      cy.get('button.fixed.bottom-6.right-6').trigger('mouseover');
      cy.contains('Create Phase').should('be.visible');
    });
  });

  describe('Phase Deletion', () => {
    beforeEach(() => {
      cy.intercept('GET', `http://localhost:8080/phase/room/${testRoomId}`, {
        statusCode: 200,
        body: mockPhases
      }).as('getPhases');

      cy.visit(`/phase/room/${testRoomId}`);
      cy.wait('@getPhases');
    });

    it('should show delete modal when delete button is clicked', () => {
      cy.get('[title="Delete Phase"]').first().click();
      cy.contains('Confirm Deletion').should('be.visible');
      cy.contains('Are you sure you want to delete this phase?').should('be.visible');
      cy.contains('button', 'Cancel').should('be.visible');
      cy.contains('button', 'Delete').should('be.visible');
    });

    it('should close modal when cancel is clicked', () => {
      cy.get('[title="Delete Phase"]').first().click();
      cy.contains('button', 'Cancel').click();
      cy.contains('Confirm Deletion').should('not.exist');
    });

    it('should delete phase when confirmed', () => {
      cy.intercept('DELETE', 'http://localhost:8080/phase/delete/phase-1', {
        statusCode: 200
      }).as('deletePhase');
      cy.intercept('GET', `http://localhost:8080/phase/room/${testRoomId}`, {
        statusCode: 200,
        body: mockPhases.slice(1)
      }).as('getUpdatedPhases');
      cy.get('[title="Delete Phase"]').first().click();
      cy.contains('button', 'Delete').click();
      cy.wait('@deletePhase');
      cy.wait('@getUpdatedPhases');
      cy.contains('Confirm Deletion').should('not.exist');
      cy.contains('Foundation Work').should('not.exist');
      cy.contains('Framing').should('be.visible');
    });

    it('should handle delete error gracefully', () => {
      cy.intercept('DELETE', 'http://localhost:8080/phase/delete/phase-1', {
        statusCode: 500,
        body: { error: 'Delete failed' }
      }).as('deletePhaseError');
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('windowAlert');
      });
      cy.get('[title="Delete Phase"]').first().click();
      cy.contains('button', 'Delete').click();
      cy.wait('@deletePhaseError');
      cy.get('@windowAlert').should('have.been.calledWith', 'Error deleting phase');
      cy.contains('Confirm Deletion').should('not.exist');
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      cy.intercept('GET', `http://localhost:8080/phase/room/${testRoomId}`, {
        statusCode: 200,
        body: mockPhases
      }).as('getPhases');
    });

    it('should display correctly on mobile devices', () => {
      cy.viewport('iphone-x');
      cy.visit(`/phase/room/${testRoomId}`);
      cy.wait('@getPhases');
      cy.contains('Foundation Work').should('be.visible');
      cy.get('button.fixed.bottom-6.right-6').should('be.visible');
      cy.get('.bg-blue-100.border.border-blue-300').should('have.length', 3);
    });

    it('should display correctly on tablet devices', () => {
      cy.viewport('ipad-2');
      cy.visit(`/phase/room/${testRoomId}`);
      cy.wait('@getPhases');
      cy.contains('Foundation Work').should('be.visible');
      cy.get('button.fixed.bottom-6.right-6').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      cy.intercept('GET', `http://localhost:8080/phase/room/${testRoomId}`, {
        statusCode: 200,
        body: mockPhases
      }).as('getPhases');

      cy.visit(`/phase/room/${testRoomId}`);
      cy.wait('@getPhases');
    });

    it('should have proper heading structure', () => {
      cy.get('h1').should('contain', 'Phases');
      cy.get('h3').should('have.length', 3);
    });

    it('should have accessible delete buttons', () => {
      cy.get('[title="Delete Phase"]').should('have.length', 3);
      cy.get('[title="Delete Phase"]').each(($btn) => {
        cy.wrap($btn).should('have.attr', 'title', 'Delete Phase');
      });
    });

    it('should support keyboard navigation', () => {
      cy.get('a').first().focus();
      cy.focused().should('contain', 'Foundation Work');
      
      cy.get('[title="Delete Phase"]').first().focus();
      cy.focused().should('have.attr', 'title', 'Delete Phase');
      
      cy.get('button.fixed.bottom-6.right-6').focus();
      cy.focused().should('exist');
      
      cy.get('button.fixed.bottom-6.right-6').focus().click();
      cy.url().should('include', `/phase-form/${testRoomId}`);
    });
  });

  describe('Data Refresh', () => {
    it('should refresh data when navigating back to the page', () => {
      let callCount = 0;
      cy.intercept('GET', `http://localhost:8080/phase/room/${testRoomId}`, (req) => {
        callCount++;
        req.reply({
          statusCode: 200,
          body: callCount === 1 ? mockPhases : [...mockPhases, {
            id: 'phase-4',
            phaseName: 'New Phase',
            startDate: '2025-03-01',
            endDate: '2025-03-15',
            phaseStatus: 'NOTSTARTED'
          }]
        });
      }).as('getPhases');

      cy.visit(`/phase/room/${testRoomId}`);
      cy.wait('@getPhases');
      cy.contains('Foundation Work').should('be.visible');

      cy.visit('/');
      cy.visit(`/phase/room/${testRoomId}`);
      cy.wait('@getPhases');
      cy.contains('New Phase').should('be.visible');
    });
  });
});
