describe('Zmiana artykułu', () => {
  it('Uzytkownik z uprawnieniami administratora powinien móc dodać i usunąć artykuł', () => {
    cy.viewport(1280, 720);
    
    cy.visit('http://localhost:3000/');

    cy.get('[href="/login"]').click();

    cy.fixture('cypress.env').then((userData) => {
      cy.get('#email').type(userData.adminEmail, { log: false });
      cy.get('#password').type(userData.password, { log: false });

      cy.get('.login-btn').click();

      cy.url().should('include', '/account');
      cy.get('.success-info').should('contain.text', 'Poprawnie zalogowano!');
      cy.contains('.current-user', userData.adminEmail, { log: false }).should('exist'); 
    });

    cy.get('[href="/about"]').click();

    cy.get('.add-new-button > button').click();
    cy.get('.accept').click();
    cy.contains('Nowy Nagłówek').should('exist');

    cy.get(':nth-child(4) > div.edit-buttons > .decline').click()

    cy.get('.about-container > :nth-child(4)').should('not.exist');

    cy.get('.accountButtons > :nth-child(2)').click();
    cy.url().should('include', '/home');
  });
});
