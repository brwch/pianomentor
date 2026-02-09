describe('Rozwiązywanie ćwiczenia', () => {
  it('Uzytkownik powinien mieć możliwość rozwiązania całego ćwiczenia i otrzymania wyniku', () => {
    cy.viewport(1280,720);
    cy.visit('http://localhost:3000/');
    
    cy.get('[href="/practise"]').click();
    cy.get('[href="/practise/1"] > .exercise-tile').click();

    let correctAnswersCount = 0;
    for (let i = 0; i < 10; i++) {
      const randomOptionIndex = Math.floor(Math.random() * 6) + 1;

      cy.get(`.options-container > :nth-child(${randomOptionIndex})`).click();
      cy.get(`.options-container > :nth-child(${randomOptionIndex})`).then(($option) => {
        if ($option.hasClass('correct')) {
          correctAnswersCount += 1;
        }
      });
      cy.get('.next-btn').click();
    }

    cy.url().should('include', '/practise');
    cy.get('.summary-screen').should('exist');
    
    cy.get('.summary-text').should(($summaryText) => {
      expect($summaryText.text()).to.include(`Twój wynik to ${correctAnswersCount}/10`);
    });

    cy.get('.restart-btn').click();
    cy.url().should('include', '/practise/1');
  });
});

