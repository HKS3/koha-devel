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

        cy.buildObject("Koha::Patrons", testPatronData);
        cy.query(
            "SELECT firstname, surname FROM borrowers WHERE firstname=?",
            "Cypress"
        ).then(result => {
            expect(result[0].surname).to.equal("Test");
        });
        cy.deleteDbRow("Koha::Patrons", testPatronData);
    });

    it("should create an object when no data values are passed", () => {
        cy.query("SELECT COUNT(*) as count FROM borrowers").then(result => {
            expect(result[0].count).to.equal(53);
        });
        cy.buildObject("Koha::Patrons");
        cy.query("SELECT COUNT(*) as count FROM borrowers").then(result => {
            expect(result[0].count).to.equal(54);
        });
        cy.deleteDbRow("Koha::Patrons", null, 1);
    });

    it("should cleanup the new database rows when the 'numberofRows' parameter is passed", () => {
        cy.query("SELECT COUNT(*) as count FROM borrowers").then(result => {
            expect(result[0].count).to.equal(53);
        });
        cy.buildObject("Koha::Patrons");
        cy.buildObject("Koha::Patrons");
        cy.buildObject("Koha::Patrons");
        cy.query("SELECT COUNT(*) as count FROM borrowers").then(result => {
            expect(result[0].count).to.equal(56);
        });
        cy.deleteDbRow("Koha::Patrons", null, 3);
        cy.query("SELECT COUNT(*) as count FROM borrowers").then(result => {
            expect(result[0].count).to.equal(53);
        });
    });

    it("should cleanup the new database rows when the 'deleteParameters' parameter is passed", () => {
        const testPatronData = {
            firstname: "Cypress",
            surname: "Test",
        };
        cy.query("SELECT COUNT(*) as count FROM borrowers").then(result => {
            expect(result[0].count).to.equal(53);
        });
        cy.buildObject("Koha::Patrons", testPatronData);

        cy.query("SELECT COUNT(*) as count FROM borrowers").then(result => {
            expect(result[0].count).to.equal(54);
        });
        cy.deleteDbRow("Koha::Patrons", testPatronData);
        cy.query("SELECT COUNT(*) as count FROM borrowers").then(result => {
            expect(result[0].count).to.equal(53);
        });
    });
});
