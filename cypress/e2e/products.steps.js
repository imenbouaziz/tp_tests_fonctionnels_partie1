import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let response;
let payload;

// -------------------------
// ✅ GIVEN
// -------------------------

// ✅ Create user BEFORE login
Given("un utilisateur existe avec l'email {string}", (email) => {
  cy.request({
    method: "POST",
    url: "/users/register",
    body: {
      id: 1,                     // ✅ must be numeric because backend expects int
      name: "Imene",
      age: 25,
      email,
      password: "1235"
    },
    failOnStatusCode: false
  });
});

// ✅ Login using @RequestParam format
Given("je suis connecté avec l'email {string} et le mot de passe {string}", (email, password) => {
  cy.request({
    method: "POST",
    url: `/users/login?email=${email}&password=${password}`,
    failOnStatusCode: false
  }).then((res) => {

    const userId = res.body?.id;
    if (!userId) {
      throw new Error("Login failed — userId is undefined");
    }

    // ✅ Save session cookie
    const cookies = res.headers["set-cookie"];
    if (cookies && cookies.length > 0) {
      const sessionId = cookies[0].split(";")[0].split("=")[1];
      cy.setCookie("JSESSIONID", sessionId);
    }

    // ✅ Save userId for all future requests
    Cypress.env("userId", userId);
  });
});

// ✅ Create products for the logged-in user
Given("plusieurs produits existent dans Firebase", () => {
  const userId = Cypress.env("userId");

  const products = [
    { id: 101, name: "Produit 1", price: 10, expiration: "2025-01-01" },
    { id: 102, name: "Produit 2", price: 20, expiration: "2025-02-01" }
  ];

  products.forEach((p) => {
    cy.request({
      method: "POST",
      url: `/users/${userId}/products`,
      body: p,
      failOnStatusCode: false
    });
  });
});

// -------------------------
// ✅ WHEN
// -------------------------

// ✅ Global products endpoint
When("j'appelle GET \"/products/global\"", () => {
  const userId = Cypress.env("userId");

  cy.request({
    method: "GET",
    url: `/users/${userId}/products/global`,
    failOnStatusCode: false
  }).then((res) => {
    response = res;
  });
});

// -------------------------
// ✅ THEN
// -------------------------

Then("la réponse doit avoir un code {int}", (status) => {
  expect(response.status).to.eq(status);
});

Then("la réponse doit contenir une liste de produits", () => {
  expect(response.body).to.be.an("array");
  expect(response.body.length).to.be.greaterThan(0);
});
