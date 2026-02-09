describe('Logowanie', () => {
  it('Uzytkownik powinien zalogować się poprawnie', () => {
    cy.viewport(1280,720);
    
    cy.visit('http://localhost:3000/');

    cy.get('[href="/login"]').click();

    cy.fixture('cypress.env').then((userData) => {
      cy.get('#email').type(userData.email, { log: false });
      cy.get('#password').type(userData.password, { log: false });


      cy.get('.login-btn').click();

      cy.url().should('include', '/account');

      cy.get('.success-info').should('contain.text', 'Poprawnie zalogowano!');
      cy.contains('.current-user', userData.email).should('exist');
      
      cy.get('.logout-btn').click();
      cy.url().should('include', '/home');
    });
  });
}); 