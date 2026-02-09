describe('Rozwiązywanie ćwiczenia rozpoznawania akordów', () => {
  it('Uzytkownik powinien mieć możliwość rozwiązania ćwiczenia z wykorzystaniem wirtualnego pianina', () => {
    cy.viewport(1280, 720);
    cy.visit('http://localhost:3000/');

    cy.get('[href="/practise"]').click();
    cy.get('[href="/practise/17"] > .exercise-tile').click();

    let correctAnswersCount = 0;

    const solveExercise = () => {
      const selectedIndexes = [];

      for (let clickCount = 0; clickCount < 6; clickCount++) {
        let randomOptionIndex;

        do {
          // Losuj od 2 do 38
          randomOptionIndex = Math.floor(Math.random() * 37) + 2;
        } while (selectedIndexes.includes(randomOptionIndex));

        selectedIndexes.push(randomOptionIndex);

        cy.get(`.piano__scale > :nth-child(${randomOptionIndex})`).click();
      }

      // Sprawdź, czy wszystkie trzy wybrane elementy są poprawne
      cy.get('.selected-keys-container > :nth-child(1), .selected-keys-container > :nth-child(2), .selected-keys-container > :nth-child(3)').should(($options) => {
        const areAllCorrect = $options.toArray().every(option => Cypress.$(option).hasClass('correct'));
        if (areAllCorrect) {
          correctAnswersCount += 1;
        }
      });
    };

    for (let i = 0; i < 10; i++) {
      solveExercise();
      cy.get('.next-btn').should('be.visible');
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
