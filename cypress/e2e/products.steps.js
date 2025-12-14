import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let response;
let payload;

// ========================================
// GIVEN - UTILISATEURS
// ========================================

Given("un utilisateur existe avec l'email {string}", (email) => {
  cy.request({
    method: "POST",
    url: "/users/register",
    body: {
      id: 1,
      name: "Test User",
      age: 25,
      email,
      password: "1235"
    },
    failOnStatusCode: false
  });
});

Given("un utilisateur existant avec l'email {string}", (email) => {
  cy.request({
    method: "POST",
    url: "/users/register",
    body: {
      id: 1,
      name: "Existing User",
      age: 30,
      email,
      password: "password123"
    },
    failOnStatusCode: false
  });
});

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

    const cookies = res.headers["set-cookie"];
    if (cookies && cookies.length > 0) {
      const sessionId = cookies[0].split(";")[0].split("=")[1];
      cy.setCookie("JSESSIONID", sessionId);
    }

    Cypress.env("userId", userId);
  });
});

Given("un payload valide contenant un id, un nom, un âge, un email et un mot de passe", () => {
  payload = {
    id: Math.floor(Math.random() * 10000),
    name: "New User",
    age: 28,
    email: `user${Date.now()}@test.com`,
    password: "securepass123"
  };
});

// ========================================
// GIVEN - PRODUITS
// ========================================

Given("plusieurs produits existent dans Firebase", () => {
  const userId = Cypress.env("userId");
  const products = [
    { id: 101, name: "Produit 1", price: 10.99, expiration: "2025-12-31" },
    { id: 102, name: "Produit 2", price: 20.50, expiration: "2025-11-30" },
    { id: 103, name: "Produit 3", price: 15.75, expiration: "2025-10-15" }
  ];

  products.forEach((product) => {
    cy.request({
      method: "POST",
      url: `/users/${userId}/products`,
      body: product,
      failOnStatusCode: false
    });
  });
});

Given("un produit avec l'id {int} existe dans Firebase", (productId) => {
  const userId = Cypress.env("userId");
  cy.request({
    method: "POST",
    url: `/users/${userId}/products`,
    body: {
      id: productId,
      name: "Produit Test",
      price: 25.00,
      expiration: "2025-12-31"
    },
    failOnStatusCode: false
  });
});

Given("un produit avec l'id {int} existe déjà", (productId) => {
  const userId = Cypress.env("userId");
  cy.request({
    method: "POST",
    url: `/users/${userId}/products`,
    body: {
      id: productId,
      name: "Produit Existant",
      price: 30.00,
      expiration: "2025-12-31"
    },
    failOnStatusCode: false
  });
});

Given("aucun produit avec l'id {int} n'existe", (productId) => {
  // Ne rien faire - le produit n'existe tout simplement pas
  cy.log(`Vérification : le produit ${productId} n'existe pas`);
});

Given("un payload valide contenant un id, un nom, un prix et une date d'expiration", () => {
  payload = {
    id: Math.floor(Math.random() * 10000),
    name: "Nouveau Produit",
    price: 45.99,
    expiration: "2026-01-15"
  };
});

Given("un payload valide contenant les nouvelles valeurs", () => {
  payload = {
    name: "Produit Modifié",
    price: 55.00,
    expiration: "2026-06-30"
  };
});

// ========================================
// WHEN - UTILISATEURS
// ========================================

When("j'appelle l'endpoint POST \\/users\\/register avec ce payload", () => {
  cy.request({
    method: "POST",
    url: "/users/register",
    body: payload,
    failOnStatusCode: false
  }).then((res) => {
    response = res;
  });
});

When("j'appelle POST \\/users\\/register avec un payload contenant le même email", () => {
  cy.request({
    method: "POST",
    url: "/users/register",
    body: {
      id: 2,
      name: "Duplicate User",
      age: 27,
      email: "test@mail.com",
      password: "password456"
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res;
  });
});

// ========================================
// WHEN - PRODUITS
// ========================================

When("j'appelle GET {string}", (endpoint) => {
  const userId = Cypress.env("userId");
  const fullUrl = `/users/${userId}${endpoint}`;
  
  cy.request({
    method: "GET",
    url: fullUrl,
    failOnStatusCode: false
  }).then((res) => {
    response = res;
  });
});

When("j'appelle POST {string} avec ce payload", (endpoint) => {
  const userId = Cypress.env("userId");
  const fullUrl = `/users/${userId}${endpoint}`;
  
  cy.request({
    method: "POST",
    url: fullUrl,
    body: payload,
    failOnStatusCode: false
  }).then((res) => {
    response = res;
  });
});

When("j'appelle POST {string} avec un payload contenant le même id", (endpoint) => {
  const userId = Cypress.env("userId");
  const fullUrl = `/users/${userId}${endpoint}`;
  
  cy.request({
    method: "POST",
    url: fullUrl,
    body: {
      id: 101,
      name: "Produit Duplicate",
      price: 10.00,
      expiration: "2025-12-31"
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res;
  });
});

When("j'appelle DELETE {string}", (endpoint) => {
  const userId = Cypress.env("userId");
  const fullUrl = `/users/${userId}${endpoint}`;
  
  cy.request({
    method: "DELETE",
    url: fullUrl,
    failOnStatusCode: false
  }).then((res) => {
    response = res;
  });
});

When("j'appelle PUT {string} avec ce payload", (endpoint) => {
  const userId = Cypress.env("userId");
  const fullUrl = `/users/${userId}${endpoint}`;
  
  cy.request({
    method: "PUT",
    url: fullUrl,
    qs: {
      name: payload.name,
      price: payload.price,
      expiration_date: payload.expiration
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res;
  });
});

When("j'appelle PUT {string} avec un payload valide", (endpoint) => {
  const userId = Cypress.env("userId");
  const fullUrl = `/users/${userId}${endpoint}`;
  
  cy.request({
    method: "PUT",
    url: fullUrl,
    qs: {
      name: "Produit Test",
      price: 100.00,
      expiration_date: "2026-12-31"
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res;
  });
});

// ========================================
// THEN - ASSERTIONS
// ========================================

Then("la réponse doit avoir un code {int}", (statusCode) => {
  expect(response.status).to.eq(statusCode);
});

Then("la réponse doit contenir une liste de produits", () => {
  expect(response.body).to.be.an("array");
  expect(response.body.length).to.be.greaterThan(0);
});

Then("la réponse doit contenir les informations du produit", () => {
  expect(response.body).to.have.property("id");
  expect(response.body).to.have.property("name");
  expect(response.body).to.have.property("price");
});

Then("l'utilisateur doit être enregistré dans Firebase", () => {
  expect(response.status).to.eq(200);
  cy.log("Utilisateur enregistré avec succès");
});

Then("le message d'erreur doit indiquer que l'email est déjà utilisé", () => {
  expect(response.status).to.eq(409);
});

Then("le produit doit être enregistré dans Firebase", () => {
  const userId = Cypress.env("userId");
  cy.request({
    method: "GET",
    url: `/users/${userId}/products/global`,
    failOnStatusCode: false
  }).then((res) => {
    const productExists = res.body.some(p => p.id === payload.id);
    expect(productExists).to.be.true;
  });
});

Then("le produit doit être supprimé de Firebase", () => {
  const userId = Cypress.env("userId");
  cy.request({
    method: "GET",
    url: `/users/${userId}/products/global`,
    failOnStatusCode: false
  }).then((res) => {
    const productExists = res.body.some(p => p.id === 101);
    expect(productExists).to.be.false;
  });
});

Then("les informations du produit doivent être mises à jour dans Firebase", () => {
  const userId = Cypress.env("userId");
  cy.request({
    method: "GET",
    url: `/users/${userId}/products/101`,
    failOnStatusCode: false
  }).then((res) => {
    expect(res.body.name).to.eq(payload.name);
    expect(res.body.price).to.eq(payload.price);
  });
});