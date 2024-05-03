import { mount } from "@cypress/vue";

describe("Test data", () => {
    beforeEach(() => {
        cy.login();
        cy.title().should("eq", "Koha staff interface");
    });

    it("should create an object based on passed data", () => {
        const testPatronData = {
            firstname: "Cypress",
            surname: "Test",
        };
        
        cy.exec(`perl t/cypress/support/cypress_patron.pl --setup ${patron}`);
        cy.exec(buildCommand)
        cy.query(
            "SELECT firstname, surname FROM borrowers WHERE firstname=?",
            "Cypress"
        ).then(result => {
            expect(result[0].surname).to.equal('Test');
        });
        cy.exec(`perl t/cypress/support/cypress_patron.pl --teardown ${patron}`);

    });

   
});
