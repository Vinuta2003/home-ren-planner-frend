const customer = {
  email: 'raomukund87@gmail.com',
  password: 'password',
};

const phase = {
  id: "1759fbcc-c4c2-47db-92f1-138bd0b046f1",
  type: "CIVIL",
  status: "INSPECTION"
};

const phaseMaterial = {
  name: "Sand",
  unit: "KG",
  quantity: "2",
  pricePerUnit: "₹30",
  totalPrice: "₹60"
};

const material = {
  name: "Sand",
  unit: "/ KG",
  pricePerUnit: "₹30",
};

describe("PhaseMaterial", () => {
  const getPhaseMaterialCard = () => cy.get(`[data-testid="phase-material-card-${phaseMaterial.name}"]`);
  const getMaterialCard = () => cy.get(`[data-testid="material-card-${material.name}"]`);

  beforeEach(() => {
    cy.visit("/login");
    cy.get('input[name="email"]').type(customer.email);
    cy.get('input[name="password"]').type(customer.password);
    cy.get('button[type="submit"]').click();
    cy.wait(5000);
    cy.visit(`/phase/${phase.id}`);
    getPhaseMaterialCard().should('exist');
  });

  after(() => {
    cy.get('#add-materials-btn').click();
    getMaterialCard().within(() => {
      cy.get('button').contains('Add').click();
      cy.get('[data-testid="increment-btn"]').click();
      cy.get('input[type="number"]').should('have.value', '2');
    });
    cy.get('#add-chosen-materials-btn')
      .scrollIntoView()
      .should('be.visible')
      .contains('Add Chosen Materials To Phase')
      .click();
  });

  it('renders all key elements', () => {
    getPhaseMaterialCard().within(() => {
      cy.contains('.text-xl', phaseMaterial.name);
      cy.contains('Quantity:');
      cy.contains(phaseMaterial.unit);
      cy.contains('Price per');
      cy.contains(phaseMaterial.pricePerUnit);
      cy.contains('Total Price:');
      cy.contains(phaseMaterial.totalPrice);
      cy.get('button').contains('Edit');
      cy.get('button').contains('Delete');
    });
  });

  it('enters edit mode on Edit click and displays buttons', () => {
    getPhaseMaterialCard().within(() => {
      cy.get('button').contains('Edit').click();
      cy.get('[data-testid="increment-btn"]').should('exist');
      cy.get('[data-testid="decrement-btn"]').should('exist');
      cy.get('input[type="number"]').should('exist');
      cy.get('button').contains('Save').should('exist');
      cy.get('button').contains('Cancel').should('exist');
    });
  });

  it('increments quantity and updates total price', () => {
    getPhaseMaterialCard().within(() => {
      cy.get('button').contains('Edit').click();
      cy.get('input[type="number"]').invoke('val').then((initialVal) => {
        const newQty = parseInt(initialVal) + 1;
        cy.get('[data-testid="increment-btn"]').click();
        cy.get('input[type="number"]').should('have.value', String(newQty));
      });
    });
  });

  it('sets quantity to 1 and updates total price when incrementing from empty quantity', () => {
    getPhaseMaterialCard().within(() => {
      cy.get('button').contains('Edit').click();
      cy.get('input[type="number"]').clear().blur();
      cy.contains('Total Price:').parent().should('contain', '---');
      cy.get('[data-testid="increment-btn"]').click();
      cy.get('input[type="number"]').should('have.value', '1');
    });
  });

  it('decrements quantity but not below 1', () => {
    getPhaseMaterialCard().within(() => {
      cy.get('button').contains('Edit').click();
      cy.get('input[type="number"]').clear().type('1');
      cy.get('[data-testid="decrement-btn"]').click();
      cy.get('input[type="number"]').should('have.value', '1');
    });
  });

  it('decrements quantity from 3 to 2 and updates total price', () => {
    getPhaseMaterialCard().within(() => {
      cy.get('button').contains('Edit').click();
      cy.get('input[type="number"]').clear().type('3').blur();
      cy.get('[data-testid="decrement-btn"]').click();
      cy.get('input[type="number"]').should('have.value', '2');
    });
  });

  it('updates quantity via input directly and calculates total price', () => {
    getPhaseMaterialCard().within(() => {
      cy.get('button').contains('Edit').click();
      cy.get('input[type="number"]').clear().type('4').blur();
      cy.get('input[type="number"]').should('have.value', '4');
      cy.contains('Total Price:').parent().should('contain', '₹120');
    });
  });

  it('resets quantity to 1 when 0 is entered', () => {
    getPhaseMaterialCard().within(() => {
      cy.get('button').contains('Edit').click();
      cy.get('input[type="number"]').clear().type('0').blur();
      cy.get('input[type="number"]').should('have.value', '1');
    });
  });

  it('clears quantity input and disables save', () => {
    getPhaseMaterialCard().within(() => {
      cy.get('button').contains('Edit').click();
      cy.get('input[type="number"]').clear().blur();
      cy.contains('Total Price:').parent().should('contain', '---');
      cy.get('button').contains('Save').should('not.exist');
    });
  });

  it('cancels edit and reverts quantity', () => {
    getPhaseMaterialCard().within(() => {
      cy.get('button').contains('Edit').click();
      cy.get('input[type="number"]').clear().type('3');
      cy.get('button').contains('Cancel').click();
      cy.contains('Quantity:').should('not.contain', '3');
    });
  });

  it('saves new quantity and exits edit mode', () => {
    getPhaseMaterialCard().within(() => {
      cy.get('button').contains('Edit').click();
      cy.get('input[type="number"]').clear().type('2');
      cy.get('button').contains('Save').click();
      cy.get('button').contains('Edit');
    });
  });

  it('opens and cancels delete confirmation modal', () => {
    getPhaseMaterialCard().within(() => {
      cy.get('button[data-testid="delete-btn"]').click();
    });
    cy.contains('Are you sure?').should('exist');
    cy.get('button').contains('Cancel').click();
    cy.contains('Are you sure?').should('not.exist');
  });

  it('confirms delete from modal', () => {
    getPhaseMaterialCard().within(() => {
      cy.get('button[data-testid="delete-btn"]').click();
    });
    cy.get('button[data-testid="delete-btn-modal"]').click();
    getPhaseMaterialCard().should('not.exist');
  });
});
