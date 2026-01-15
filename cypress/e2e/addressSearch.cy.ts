beforeEach(() => {
  cy.visit("/");
});

describe("Address search", () => {
  it("does not show suggestions if the query has no matches", () => {
    const searchInput = "Cooper Square, New York, NY 10003, USA";

    cy.getBy("address-search-query-input").type(searchInput);

    cy.getBy("suggestions-ul-list").should("not.exist");
  });

  it("displays up to 20 suggestions", () => {
    const searchInput = "Oslo";

    cy.getBy("suggestions-ul-list").should("not.exist");

    cy.getBy("address-search-query-input").type(searchInput);

    cy.getBy("suggestions-ul-list").find("li").should("have.length", 20);
  });

  it("displays suggestions based on the query", () => {
    const searchInput = "Tro 90 Røst";

    cy.get("suggestions-ul-list").should("not.exist");

    cy.getBy("address-search-query-input").type(searchInput);

    const keys = searchInput.split(" ");

    cy.getBy("suggestions-ul-list")
      .find("li")
      .should("have.length", 2)
      .each((item) =>
        keys.forEach((key) =>
          expect(item.text()).to.match(new RegExp(key, "i")),
        ),
      );
  });

  // NOTE: This test is slow and could be faster with cy.clock, cy.tick (couldn't make it work)
  it("applies 300 milliseconds debounce for the search input", () => {
    const searchInput = "Oslo 30";

    cy.intercept("/api/address?q=*", { times: 1 }, (req) => {
      req.alias = "addressesRequest";
    });

    cy.getBy("address-search-query-input")
      .as("input")
      .type(searchInput, { delay: 290 });

    cy.wait("@addressesRequest").then((r) => {
      const q = r.request?.query?.q;
      expect(q).to.equal(searchInput);
    });

    cy.get("@input").clear();

    cy.intercept("/api/address?q=*", { times: 1 }, (req) => {
      req.alias = "addressesRequest";
    });

    cy.get("@input").type(searchInput, { delay: 310 });

    cy.wait("@addressesRequest").then((r) => {
      const label = r.request?.query?.q;
      expect(label).to.equal("Osl");
    });
  });

  it("allows to select a suggestion by clicking on it", () => {
    const searchInput = "Oslo 30";

    cy.getBy("address-search-query-input")
      .as("input")
      .should("have.value", "")
      .type(searchInput);

    cy.getBy("suggestions-ul-list")
      .find("li")
      .should("have.length", 20)
      .eq(3)
      .then((item) => {
        const suggestion = item.text();
        cy.wrap(item).click();
        cy.get("@input").should("have.value", suggestion);
      });

    cy.get("suggestions-ul-list").should("not.exist");
  });

  // NOTE: There could be more tests to cover keyboard controls (Up/Down/Enter/Escape)
});
