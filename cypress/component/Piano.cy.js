import React from 'react'
import Piano from '../../src/piano/Piano'

describe('<Piano />', () => {
  beforeEach(() => {
    cy.viewport(1150, 350);
    cy.mount(<Piano />);
  });

  it('Renderowanie', () => {
    cy.get('.piano').should('exist');
  });

  it('Poprawne wyświetlanie podpisanych klawiszy', () => {
    cy.get('.slider').click();
    cy.get('.piano__scale').should('have.class', 'show-keys');

    cy.get('.slider').click();
    cy.get('.piano__scale').should('have.class', 'hide-keys');
  });

  it('Poprawne odtwarzanie dźwięku', () => {
    cy.get('.piano__scale li').first().click().should('have.class', 'active');
    cy.get('audio').then(($audio) => {
      expect($audio.get(0).paused).to.eq(false);
    });
  });

  it('Poprawne zatrzymywanie dźwięku', () => {
    cy.get('.piano__scale li').first().trigger('mousedown').should('have.class', 'active');
    cy.get('.piano__scale li').first().trigger('mouseup').should('not.have.class', 'active');
    cy.get('audio').then(($audio) => {
      expect($audio.get(0).paused).to.eq(true);
    });
  });

  it('Poprawne wyciszanie, odciszanie', () => {

    cy.get('.volume').click();

    cy.get('.piano__scale li').first().click()
    cy.get('audio').then(($audio) => {
      expect($audio.get(0).paused).to.eq(false);
    });

    cy.get('.volume').click();

    cy.get('audio').then(($audio) => {
      expect($audio.get(0).paused).to.eq(true);
    });
  });
});