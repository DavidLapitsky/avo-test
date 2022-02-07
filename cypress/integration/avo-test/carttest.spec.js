 /// <reference types="cypress" />


import config from './data.json';
const {city, fullCity, firstName, lastName, email, password} = config;


context('Test AVO', () => {
    before(() => {
        cy.viewport(1400,728);

    }); 


    beforeEach(() => {
      //Clear Local Storage to prevent state from being shared across tests.
      cy.clearLocalStorage(); 
      
    });


    it(`Add to Cart`, () => {
  
      //Choose city of residence by city and full city name
      cy.chooseCity(city,fullCity);
      
      //Adding product with categoryId and productId to the cart and check it.
      cy.putProductToCart(); 
    });

    it(`Increase Qty`, () => {
      
        //Choose city of residence by city and full city name
        cy.chooseCity(city,fullCity);
        
        //Adding product with categoryId and productId to the cart and check it.
        cy.putProductToCart(); 

        cy.openCartWidget();

        cy.IncreaseQty(3);
    });

    it(`Decrease Qty`, () => {
      
        cy.viewport(1400,728);
    
        //Choose city of residence by city and full city name
        cy.chooseCity(city,fullCity);
        
        //Adding product with categoryId and productId to the cart and check it.
        cy.putProductToCart(); 

        //Open cart widget
        cy.openCartWidget();

        //Click "+" 3 times
        cy.IncreaseQty(3);
        
        //Click "-" 3 times
        cy.DecreaseQty(2);

    });

    
});