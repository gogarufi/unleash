Cypress.Commands.add("getBy", (selector) => {
  return cy.get(`[data-cy-test-id="${selector}"]`);
});
