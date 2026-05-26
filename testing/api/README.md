# API Testing — Karate DSL

API tests for the Exam Project backend using [Karate DSL](https://github.com/karatelabs/karate) — a BDD-style framework that combines HTTP calls and assertions in a single `.feature` file with no boilerplate code.

## Feature files

| File | Covers |
|------|--------|
| `auth.feature` | Login, invalid credentials, token extraction |
| `products.feature` | Full CRUD, admin-only protection |
| `categories.feature` | List, create, update, delete |
| `cart.feature` | Add items, checkout flow |
| `orders.feature` | User orders, admin order management |

---

## auth.feature

```gherkin
Feature: Authentication

  Background:
    * url 'http://localhost:3000'

  Scenario: Login with valid credentials
    Given path '/login'
    And request { email: 'admin@noroff.no', password: 'P@ssword2023' }
    When method POST
    Then status 200
    And match response.token == '#notnull'

  Scenario: Login with wrong password
    Given path '/login'
    And request { email: 'admin@noroff.no', password: 'wrongpassword' }
    When method POST
    Then status 401

  Scenario: Login with missing fields
    Given path '/login'
    And request { email: 'admin@noroff.no' }
    When method POST
    Then status 400
```

---

## products.feature

```gherkin
Feature: Products API

  Background:
    * url 'http://localhost:3000'
    * def auth = call read('auth.feature@validLogin')
    * def token = auth.response.token
    * header Authorization = 'Bearer ' + token

  Scenario: Get all products
    Given path '/products'
    When method GET
    Then status 200
    And match response == '#[] #object'
    And match each response contains { id: '#number', name: '#string', price: '#number' }

  Scenario: Get product by ID
    Given path '/products/1'
    When method GET
    Then status 200
    And match response.id == 1
    And match response.name == '#string'

  Scenario: Get non-existent product returns 404
    Given path '/products/99999'
    When method GET
    Then status 404

  Scenario: Create product as admin
    Given path '/products'
    And request { name: 'Test Product', price: 99.99, categoryId: 1, brandId: 1, stock: 50 }
    When method POST
    Then status 201
    And match response.id == '#number'
    And match response.name == 'Test Product'
    * def createdId = response.id

  Scenario: Update product as admin
    Given path '/products/1'
    And request { name: 'Updated Product', price: 149.99, stock: 30 }
    When method PUT
    Then status 200
    And match response.name == 'Updated Product'

  Scenario: Soft delete product as admin
    Given path '/products/1'
    When method DELETE
    Then status 200

  Scenario: Create product without token returns 401
    * header Authorization = ''
    Given path '/products'
    And request { name: 'Blocked', price: 10, stock: 5 }
    When method POST
    Then status 401

  Scenario: Search products
    Given path '/products/search'
    And request { query: 'test' }
    When method POST
    Then status 200
    And match response == '#[] #object'
```

---

## Setup

Karate runs on the JVM. No application code needed — tests are plain `.feature` files.

```bash
# Run with Maven
mvn test

# Run a single feature
mvn test -Dtest=ProductsTest

# Generate HTML report (output: target/karate-reports/)
mvn test -Dkarate.options="--format html"
```

**`karate-config.js`** (base URL and shared auth):

```javascript
function fn() {
  var config = { baseUrl: 'http://localhost:3000' };

  var result = karate.call('classpath:auth.feature@validLogin');
  config.token = result.response.token;

  return config;
}
```

> Tests target the Exam Project API. Requires a running server (`node Exam-Project/bin/www`) and seeded database (`POST /init`).
