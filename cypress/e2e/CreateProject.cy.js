describe('Create Project', () => {
    before(() => {
        cy.visit('http://localhost:5173/login');
    });
    it('validation of project creation', () => {
        cy.get('input[name="email"]').type('customer1@gmail.com');
        cy.get('input[name="password"]').type('password');
        cy.get('button[type="submit"]').click();
        cy.wait(8000);
        cy.get('button[class="mt-6 px-8 py-3 rounded-full bg-[#005eb8]/70 text-white font-semibold text-lg shadow-lg border-2 border-white/30 hover:bg-[#005eb8]/90 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer backdrop-blur"]').click();
        cy.wait(2);
        cy.get('input[type="text"]').type('Whole Home Renovation');
        cy.get('select[name="serviceType"]').select('WHOLE_HOUSE');
        cy.get('input[type="number"]').type('50000');
        cy.get('input[name="startDate"]').type('2025-07-24');
        cy.get('input[name="endDate"]').type('2025-08-06');
        cy.get('button[type="submit"]').click();
        cy.get('h2[class="text-2xl font-bold text-blue-900"]').should('be.visible');
        cy.contains('Add First Room').click();
        cy.get('label[for="roomName"]').type("Master Bedroom");
        cy.get('select[id="renovationType"]').select("KITCHEN_RENOVATION")
        cy.get('button[type="submit"]').click();
        cy.get('h3[class="font-bold text-lg"]').should('be.visible');
    });
    //  it('click on create project', () => {


    //   });
});