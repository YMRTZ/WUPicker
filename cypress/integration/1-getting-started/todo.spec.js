/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('WUPicker2', () => {
  it('Has a header', () => {
    cy.visit('http://localhost:8080/#/');
    cy.get('header');
  });
  it('Has a functioning Select tab', () => {
    cy.get('a').contains('Select').and('have.class', 'q-tab__label').click();
    cy.url().should('eq', 'http://localhost:8080/#/select');
  });
  it('Has an empty Select section', () => {
    cy.wait(3000);
    cy.get('div')
      .should('have.class', 'q-list')
      .children()
      .contains('HAB')
      .should('not.exist');
    cy.get('div')
      .should('have.class', 'q-list')
      .children()
      .contains('QNG')
      .should('not.exist');
  });
  it('Has a functioning Upload tab', () => {
    cy.get('a').contains('Upload').and('have.class', 'q-tab__label').click();
    cy.url().should('eq', 'http://localhost:8080/#/upload');
  });
  it('Uploads files', () => {
    cy.get('input')
      .should('have.class', 'fileInputButton')
      .attachFile('HAB/HAB.png');
    cy.get('button').contains('Submit').click();
    cy.wait(3000);
    cy.get('input')
      .should('have.class', 'fileInputButton')
      .attachFile('HAB/old/HAB.png');
    cy.get('button').contains('Submit').click();
    cy.wait(3000);
    cy.get('input')
      .should('have.class', 'fileInputButton')
      .attachFile('QNG/QNG.png');
    cy.get('button').contains('Submit').click();
    cy.wait(3000);
    cy.get('input')
      .should('have.class', 'fileInputButton')
      .attachFile('QNG/old/QNG.png');
    cy.get('button').contains('Submit').click();
    cy.wait(3000);
  });
  it('Has files properly listed', () => {
    cy.get('a').contains('Select').and('have.class', 'q-tab__label').click();
    cy.get('div')
      .should('have.class', 'q-list')
      .children()
      .contains('HAB')
      .click();
    cy.wait(3000);
    cy.get('img')
      .should('have.class', 'q-img__image')
      .its('length')
      .should('eq', 2);
    cy.get('div')
      .should('have.class', 'q-list')
      .children()
      .contains('QNG')
      .click();
    cy.wait(3000);
    cy.get('img')
      .should('have.class', 'q-img__image')
      .its('length')
      .should('eq', 2);
  });
});
