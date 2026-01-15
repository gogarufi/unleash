declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy-test-id attribute.
     * @example cy.getBy('address-input')
     */
    getBy(selector: string): Chainable<JQuery<HTMLElement>>;
  }
}
