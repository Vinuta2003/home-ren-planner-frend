import { phaseId } from "../../fixtures/phaseId";

const customer = {
  email: 'raomukund87@gmail.com',
  password: 'password',
};

const phase = {
  id: phaseId,
  type: "CIVIL",
  status: "INSPECTION",
};

const material = {
  name: "Cement",
  unit: "/ KG",
  pricePerUnit: "₹50",
};

describe("Material", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get('input[name="email"]').type(customer.email);
    cy.get('input[name="password"]').type(customer.password);
    cy.get('button[type="submit"]').click();
    cy.wait(5000);
    cy.visit(`/phase/${phase.id}`);
    cy.get('#add-materials-btn').click();
  });

  const getMaterialCard = () => cy.get(`[data-testid="material-card-${material.name}"]`);

  it('should render material name, price, unit and Add button', () => {
    getMaterialCard().within(() => {
      cy.get('.text-xl').contains(material.name);
      cy.get('span').contains(material.pricePerUnit);
      cy.get('span').contains(material.unit);
      cy.get('button').contains('Add');
    });
  });

  it('should add material on Add button click', () => {
    getMaterialCard().within(() => {
      cy.get('button').contains('Add').click();
      cy.get('input[type="number"]').should('have.value', '1');
      cy.get('[data-testid="increment-btn"]').should('exist');
      cy.get('[data-testid="decrement-btn"]').should('exist');
      cy.get('button').contains('Remove').should('exist');
    });
  });

  it('should increment quantity on increment button click', () => {
    getMaterialCard().within(() => {
      cy.get('button').contains('Add').click();
      cy.get('[data-testid="increment-btn"]').click();
      cy.get('input[type="number"]').should('have.value', '2');
    });
  });

  it('should decrement quantity but not go below 1', () => {
    getMaterialCard().within(() => {
      cy.get('button').contains('Add').click();
      cy.get('[data-testid="increment-btn"]').click();
      cy.get('[data-testid="decrement-btn"]').click();
      cy.get('input[type="number"]').should('have.value', '1');
      cy.get('[data-testid="decrement-btn"]').click();
      cy.get('input[type="number"]').should('have.value', '1');
    });
  });

  it('should reset to 1 if input is set to 0', () => {
    getMaterialCard().within(() => {
      cy.get('button').contains('Add').click();
      cy.get('input[type="number"]').clear().type('0').blur();
      cy.get('input[type="number"]').should('have.value', '1');
    });
  });

  it('should remove material if input is empty', () => {
    getMaterialCard().within(() => {
      cy.get('button').contains('Add').click();
      cy.get('input[type="number"]').clear().blur();
      cy.get('button').contains('Remove').should('exist');
    });
  });

  it('should remove material on Remove button click', () => {
    getMaterialCard().within(() => {
      cy.get('button').contains('Add').click();
      cy.get('button').contains('Remove').click();
      cy.get('button').contains('Add').should('exist');
      cy.get('input[type="number"]').should('not.exist');
    });
  });

  it('should add material with quantity 1 if quantity is empty and increment is clicked', () => {
    getMaterialCard().within(() => {
      cy.get('button').contains('Add').click();
      cy.get('input[type="number"]').clear();
      cy.get('[data-testid="increment-btn"]').click();
      cy.get('input[type="number"]').should('have.value', '1');
    });
  });

  it('should update quantity to 1 if input is set to 0 and material exists', () => {
    getMaterialCard().within(() => {
      cy.get('button').contains('Add').click();
      cy.get('input[type="number"]').clear().type('0').blur();
      cy.get('input[type="number"]').should('have.value', '1');
    });
  });

  it('should update quantity if input is changed and material already exists', () => {
    getMaterialCard().within(() => {
      cy.get('button').contains('Add').click();
      cy.get('input[type="number"]').clear().type('4').blur();
      cy.get('input[type="number"]').should('have.value', '4');
    });
  });

  it('should add material if input is given directly and material does not exist', () => {
    getMaterialCard().within(() => {
      cy.get('button').contains('Add').click();
      cy.get('button').contains('Remove').click();
      cy.get('button').contains('Add').click();
      cy.get('input[type="number"]').clear().type('3').blur();
      cy.get('input[type="number"]').should('have.value', '3');
    });
  });

  it('should handle backspace in middle of quantity input correctly and increment to 2', () => {
    getMaterialCard().within(() => {
        cy.get('button').contains('Add').click();
        cy.get('input[type="number"]').clear().type('10');
        cy.get('input[type="number"]').focus().type('{moveToStart}{rightArrow}{backspace}');
        cy.get('input[type="number"]').should('have.value', '1');
        cy.get('input[type="number"]').blur();
        cy.get('[data-testid="increment-btn"]').click();
        cy.get('input[type="number"]').should('have.value', '2');
    });
  });


  it('should allow appending 0 after 1 to make 10 and increment to 11', () => {
    getMaterialCard().within(() => {
        cy.get('button').contains('Add').click();
        cy.get('input[type="number"]').clear().type('1');
        cy.get('input[type="number"]').type('{moveToEnd}0');
        cy.get('input[type="number"]').should('have.value', '10');
        cy.get('[data-testid="increment-btn"]').click();
        cy.get('input[type="number"]').should('have.value', '11');
    });
  });

});
