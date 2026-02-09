describe('Zmiana danych użytkownika', () => {
  it('Uzytkownik powinien móc zmienić swoje dane', () => {
    cy.viewport(1280, 720);

    cy.visit('http://localhost:3000/');

    cy.get('[href="/login"]').click();

    cy.fixture('cypress.env').then((userData) => {
      cy.get('#email').type(userData.email, { log: false });
      cy.get('#password').type(userData.password, { log: false });

      cy.get('.login-btn').click();

      cy.url().should('include', '/account');

      cy.get('.success-info').should('contain.text', 'Poprawnie zalogowano!');
      cy.contains('.current-user', userData.email).should('exist');

      cy.get('.edit-btn').click();

      cy.get(':nth-child(1) > :nth-child(2) > .change-input').clear();
 
      cy.get(':nth-child(1) > :nth-child(2) > .change-input').type('Gregory', { log: false });
      cy.get(':nth-child(3) > :nth-child(2) > .change-input').type(userData.password, { log: false });
      cy.get('.confirm-btn').click();

      cy.get('.success-info').should('contain.text', 'Dane użytkownika zostały zmienione!');      
      cy.contains('.current-user', 'Gregory').should('exist');

      cy.get('.edit-btn').click();

      cy.get(':nth-child(1) > :nth-child(2) > .change-input').clear();

      cy.get(':nth-child(1) > :nth-child(2) > .change-input').type(userData.username, { log: false });
      cy.get(':nth-child(3) > :nth-child(2) > .change-input').type(userData.password, { log: false });
      cy.get('.confirm-btn').click();

      cy.get('.success-info').should('contain.text', 'Dane użytkownika zostały zmienione!');
      cy.contains('.current-user', userData.username).should('exist');

      cy.get('.logout-btn').click();
      
      cy.url().should('include', '/home');
    });
  });
});
