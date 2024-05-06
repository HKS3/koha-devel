import { mount } from "@cypress/vue";

describe("Test data", () => {
    beforeEach(() => {
        cy.login();
        cy.title().should("eq", "Koha staff interface");
    });

    // yarn cypress run --config video=false,screenshotOnRunFailure=false --spec t/cypress/integration/DataTest_spec.ts

    it("should create an object based on passed data and remove it", () => {
        var patron_count = 0;
        cy.query("SELECT COUNT(*) as count FROM borrowers").then(result => {
            patron_count = result[0].count;
        });

        const testPatronData = {
            firstname: "CypressTest",
            surname: "SurnameTest",
            cardnumber: "td" + Math.floor(Math.random() * 8),
        };

        cy.buildObject("Koha::Patrons", testPatronData);

        cy.query(
            "SELECT firstname, surname FROM borrowers WHERE firstname=?",
            testPatronData.firstname
        ).then(result => {
            expect(result[0].surname).to.equal(testPatronData.surname);
        });

        cy.buildObject("Koha::Patrons", testPatronData, "teardown");

        cy.query("SELECT COUNT(*) as count FROM borrowers").then(result => {
            expect(result[0].count).to.equal(patron_count);
        });
    });
});
