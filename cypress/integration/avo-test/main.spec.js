/// <reference types="cypress" />


import config from './data.json';
const {city, fullCity, firstName, lastName, email, password} = config;

const tests = [ [1400,728],  [368,670], [820,1180] ];

context('Test AVO', () => {
  beforeEach(() => {
    //Clear Local Storage to prevent state from being shared across tests.
    cy.clearLocalStorage(); 
    
    //Clear cookies 
    //cy.clearCookies(); 
  });

  tests.forEach(size => {
    
    it(`Add to Cart: viewport(${size[0]}, ${size[1]}  )`, () => {
      cy.viewport(size[0],size[1]);
  
      //Choose city of residence by city and full city name
      cy.chooseCity(city,fullCity);
      
      //Adding product with categoryId and productId to the cart and check it.
      cy.putProductToCart(); 
     
      cy.gotoCart();

      cy.checkCart();

      //Checkout
      cy.checkOut();

      //Log in
      cy.Login(email,password);
     

      cy.checkSubTotal();
    });

  });
    
});
