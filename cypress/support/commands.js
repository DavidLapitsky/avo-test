import config from '../integration/avo-test/data.json';

Cypress.Commands.add('chooseCity', (search_text, city) => {

  //go to city search page
  cy.visit('/');
  cy.get('.FirstSection-checkYourAddressPanel a[href="/search-address"]').click();


  //cy.visit('/search-address');

  //enter city
  cy.get('[data-testid="portal.search.searchInput"] input').type(search_text,{delay:200});
  
  //waiting when page is loaded;
  //cy.wait(5000); 
  
  //Choose exact city name
  cy.contains('[data-testid="newPortal.search.companyNameButton"] .Result-label',city).click();
  
  //waiting when page is loaded;
  //cy.wait(5000); 

  //Check city name
  cy.get('.LocationSelection-companyName').should('have.text', city);

  
});

Cypress.Commands.add('checkOut', () => {
  //Checkout
  cy.get('a[href="/cart/checkout"]').click();
});

Cypress.Commands.add('putProductToCart', () => {
  
  cy.scrollTo('bottom');
    
  cy.wait(5000);

  cy.get('.Product-container').first().as('Product');
  
  //Save Product price as an alias for future use
  cy.get('@Product').find('p.Product-price').invoke('text').as('ProductPrice');
    
  //Save Product name as an alias for future use
  cy.get('@Product').find('[data-cy="product-name"]').invoke('text').as('ProductName');

  //Add Product to the cart
  cy.get('@Product').find('[data-testid="store.addToCartButton"]').click();

});

Cypress.Commands.add('gotoCart', function () {
    //Go to the cart
    cy.visit('/cart/my-cart');
});

Cypress.Commands.add('checkCart', () => {
  //Get Product Name in a cart  
  cy.get('[aria-label="grid"] [data-cy="description-container"] [data-cy="product-name"]').invoke('text').as('CartName');

  //Get Price in a cart
  cy.get('[aria-label="grid"] div[data-cy="price-tag"]').as('CartPrice');
      
  //Check Product Name. If are not equals then show warning message
  cy.get('@CartName').then((cartname) => {
    cy.get('@ProductName').then((prodname) => {
        expect(prodname,"Product name").to.be.equal(cartname);  
        
    });
  });
  

    //Check Product Price. If are not equals then show warning message
    cy.get('@CartPrice').then( ($element) => {
    
    const prices = $element[0].innerText.split('$');

    

    cy.get('@ProductPrice').then((prodprice) => {
      const cp = parseFloat(prices[prices.length-1].replace(',', '.') );
      const pp = parseFloat(prodprice.replace('$','').replace(',', '.'));
        
      expect(pp,"Product price").to.be.equal(cp);
        
    });

  });

});


Cypress.Commands.add('checkSubTotal', function () {
  //pause
  cy.wait(3000);

  //Check subtotal sum
  cy.get('.CartTotals-cartTotalsRowContainer [data-cy="sub-total"]').invoke('text').as('subtotal');

  

  cy.get('@ProductPrice').then((prodprice) => { 
    cy.get('@subtotal').then((subtotal) => {
      const pp = parseFloat(prodprice.replace('$','').replace(',', '.'));
      const st = parseFloat(subtotal.replace('$','').replace(',', '.'));
      
      expect(pp,"Product price").to.be.equal(st);

    });
  });

});




Cypress.Commands.add('signUp', (firstName, lastName, email, phone, password) => {
  //Go to login page
  cy.visit('/my-account/auth');
  
  //Create new account button click
  cy.get('[data-cy="signin-link"]').click();

  //fill appropriated fields
  cy.get('[data-cy="form-container"] [data-cy="first-name"]').type(firstName);
  cy.get('[data-cy="form-container"] [data-cy="last-name"]').type(lastName);
  cy.get('[data-cy="form-container"] [data-testid="store.onboarding.phoneInput"] input').type(phone);
  cy.get('[data-cy="form-container"] [data-cy="email"] input').type(email);
  cy.get('[data-cy="form-container"] [data-cy="password"] input').type(password);
  
  //pause
  //cy.wait(1000);

  //Click to pseudo combo box choice button
  cy.get('[aria-label="Open"]').click();

  //pause
  //cy.wait(1000);

  //Choose first list item
  cy.get('[role="presentation"] li').first().click();

  //Create a new account
  cy.get('[data-cy="submit-btn"]').click();

});

Cypress.Commands.add('Login', (login,password) => {
    //fill appropriated fields
    cy.get('[data-cy="form-container"] [data-cy="email"] input').type(login);
    cy.get('[data-cy="form-container"] [data-cy="password"] input').type(password);
    cy.get('[data-testid="store.myAccount.signIn.signInBtn"]').click();
});

Cypress.Commands.add('signIn', (login,password) => {
    //go to the login page
    cy.visit('/my-account/auth');

    //fill fields needed and log in.
    cy.Login(login,password);
});

Cypress.Commands.add('openCartWidget', () => {
  
  cy.get('[data-cy="mini-cart-btn"]').click();
  

});

Cypress.Commands.add('IncreaseQty', (Value) => {
    
    cy.get('[data-cy="mini-cart-dialog"] [data-cy="dirty-count-btn"]').invoke('text').as('startQty');

    //Click Value times to button "+"
    for (let i = 0; i < Value; i++) {
        cy.get('[data-cy="mini-cart-dialog"] [data-cy="dirty-plus-btn"]').click();

    }
    //pause
    cy.wait(2000);
    
    //checking position sum
    
    //Price
    cy.get('[data-cy="mini-cart-dialog"] [data-cy="price-tag"]').as('PosPrice');
    
    //Qty
    cy.get('[data-cy="mini-cart-dialog"] [data-cy="dirty-count-btn"]').invoke('text').as('PosQty');
    
    //Row sum
    cy.get('[data-cy="mini-cart-dialog"] .CartTableProduct-total').invoke('text').as('PosSubTotal');


    //Checking that Price * Qty = Sum
    cy.get('@PosPrice').then( ($element) => {
        cy.get('@PosQty').then((posqty) => {
            cy.get('@PosSubTotal').then((subtotal) => {
                const prices = $element[0].innerText.split('$');
                const price = parseFloat(prices[prices.length-1].replace(',','.'));

                const qty = parseInt(posqty);
                const sub = parseFloat(subtotal.replace('$','').replace(',','.'));

                //Check Qty
                cy.get('@startQty').then((startQty) => {
                    expect((qty),"Qty").to.be.equal( parseInt(startQty)+Value );

                });

                expect((price * qty),"Product price * qty").to.be.equal(sub);
                
            });
        });
    });

});


Cypress.Commands.add('DecreaseQty', (Value) => {
    var genArr = Array.from({length:Value},(i)=>i+1);

    cy.get('[data-cy="mini-cart-dialog"] [data-cy="dirty-count-btn"]').invoke('text').as('startQty');
        
    //Click Value times to button "-"
    cy.wrap(genArr).each(() => {
        cy.get('[data-cy="mini-cart-dialog"] [data-cy="dirty-count-btn"]').invoke('text').then((qty) =>  {

            if (parseInt(qty) > 1 ) {
                cy.get('[data-cy="mini-cart-dialog"] [data-cy="dirty-minus-btn"]').click();
            }
            else {
                throw new Error('Cannot decrease Qty more then 1!');
            }
        });

        
    });
    
    //pause
    cy.wait(2000);
    //checking position sum
    
    //Price
    cy.get('[data-cy="mini-cart-dialog"] [data-cy="price-tag"]').as('PosPrice');
    
    //Qty
    cy.get('[data-cy="mini-cart-dialog"] [data-cy="dirty-count-btn"]').invoke('text').as('PosQty');
    
    //Row sum
    cy.get('[data-cy="mini-cart-dialog"] .CartTableProduct-total').invoke('text').as('PosSubTotal');

    //Checking that Price * Qty = Sum
    cy.get('@PosPrice').then( ($element) => {
        cy.get('@PosQty').then((posqty) => {
            cy.get('@PosSubTotal').then((subtotal) => {
                
        
                const prices = $element[0].innerText.split('$');
                const price = parseFloat(prices[prices.length-1].replace(',','.'));

                const qty = parseInt(posqty);
                const sub = parseFloat(subtotal.replace('$','').replace(',','.'));

                //Check Qty
                cy.get('@startQty').then((startQty) => {
                    expect((qty),"Qty").to.be.equal( parseInt(startQty) - Value );

                });

                expect((price * qty),"Product price * qty").to.be.equal(sub);
                
            });
        });
    });

});





