import React from 'react'
import CircleOfFifths from '../../src/wheel/CircleOfFifths'
import '../../src/wheel/CircleOfFifths.css';

describe('<CircleOfFifths />', () => {
  beforeEach(() => {
    cy.viewport(500, 500);
    cy.mount(<CircleOfFifths />);
  });

  it('Renderowanie', () => {
    cy.get('.circle-container').should('exist');
    cy.get('.circle').should('exist');
    cy.get('.center-circle').should('exist');
  });

  it('Czy tonacja po zaznaczeniu się podświela', () => {
    cy.get('.segment').first().click({ force: true });
    cy.get('.segment').first().should('have.class', 'selected');
    cy.get('.segment').should('have.class', 'highlighted');
    cy.get('.highlighted').should('have.length', 6);
  });

  it('Wyświetlanie poprawnych tonacji', () => {
    cy.get('.tonality-name.bold').should('have.length', 12);
  });

  it('Wyświetlanie poprawnie tonacji mollowych ', () => {
    cy.get('.segment').first().click({ force: true });
    cy.get('.tonality-name.normal').should('have.length', 5);
  });
});