
describe('Check Server', function() {
  it('Test always true!', function() {
    expect(true).to.equal(true)
  })
  it('Check if http://localhost:3000/ is working', function() {
    cy.log("If this test is not working");
    cy.log("First, refresh the page");
    cy.log("Otherwise, make sure you've launch you server, for example with");
    cy.log("$ nodemon app.js");
    
    cy.visit('/');
  })
})

describe('Iteration 3 | Search for an Artist', function() {

  describe('Step 1 | Create a Homepage', function() {
    it('Check if form has attr action', function() {
      cy.get('form')
      .should('have.attr', 'action')
    })

    it('Check if the form redirects to /artists?artist=Bob', function() {
      cy.get('form input').type("Bob")
      cy.wait(1000)
      cy.get('form').submit()

      cy.url().should('include', '/artists?artist=Bob')
    })
  })

  describe('Step 2 | Display results for artist search', function() {
    it('"Bob" search: Check if we can see "Bob Marley"', function() {
      cy.contains('Bob Marley'); 
    })
    it('"Bob" search: Check if we can see "Bob Dylan"', function() {
      cy.contains('Bob Dylan'); 
    })
    it('"Red" search: Check if we can see "Red Hot Chili Peppers"', function() {
      cy.visit('/artists?artist=Red');
      cy.contains('Red Hot Chili Peppers'); 
    })
    it('"Red" search: Check if we have a link to the albums of "Red Hot Chili Peppers"', function() {
      cy.get('a[href$="albums/0L8ExT028jH3ddEcZwqJJ5"]'); 
    })
  })

})

describe('Iteration 4 | View Albums', function() {
  describe('"Red Hot Chili Peppers" albums page', function() {
    it('Go to the page', function() {
      cy.get('a[href$="albums/0L8ExT028jH3ddEcZwqJJ5"]').click(); 
    })
    it('Check if contains "The Getaway"', function() {
      cy.contains('The Getaway'); 
    })
    it('Check if contains "I\'m With You"', function() {
      cy.contains(`I'm With You`); 
    })
    it('Check if contains "Stadium Arcadium"', function() {
      cy.contains(`Stadium Arcadium`); 
    })
  })
  describe('"Shaka Ponk" albums page', function() {
    it('Go to the page', function() {
      cy.visit('albums/0VJIBKdqJygrupAxpSTk7q'); 
    })
    it('Check if contains "The Evol"', function() {
      cy.contains('The Evol'); 
    })
    it(`Check if contains "Monkeys in Bercy"`, function() {
      cy.contains(`Monkeys in Bercy`); 
    })
    it(`Check if contains "The Geeks and the Jerkin' Socks"`, function() {
      cy.contains(`The Geeks and the Jerkin' Socks`); 
    })
  })
  describe('"Red Hot Chili Peppers" albums page', function() {
    it('Go to the page', function() {
      cy.visit('albums/0L8ExT028jH3ddEcZwqJJ5'); 
    })
    it('Check if contains the link to "The Getaway"', function() {
      cy.get('a[href$="tracks/43otFXrY0bgaq5fB3GrZj6"]'); 
    })
    it('Check if contains the link to  "I\'m With You"', function() {
      cy.get('a[href$="tracks/5wZtSIvijWCMc1vlPFqAyB"]'); 
    })
    it('Check if contains the link to "Stadium Arcadium"', function() {
      cy.get('a[href$="tracks/7xl50xr9NDkd3i2kBbzsNZ"]'); 
    })
  })
})

describe('Iteration 5 | View Tracks', function() {
  describe('"The Getaway" tracks page', function() {
    it('Go to the page', function() {
      cy.get('a[href$="tracks/43otFXrY0bgaq5fB3GrZj6"]').click(); 
    })
    it('Check if contains "The Getaway"', function() {
      cy.contains('The Getaway'); 
    })
    it('Check if contains  "Dark Necessities"', function() {
      cy.contains('Dark Necessities'); 
    })
    it('Check if contains "We Turn Red"', function() {
      cy.contains('We Turn Red'); 
    })
  })

  describe('"The 2nd Law" tracks page', function() {
    it('Go to the page', function() {
      cy.visit('/tracks/3KuXEGcqLcnEYWnn3OEGy0'); 
    })
    it('Check if contains "Supremacy"', function() {
      cy.contains('Supremacy'); 
    })
    it('Check if contains  "Madness"', function() {
      cy.contains('Madness'); 
    })
    it('Check if contains "Panic Station"', function() {
      cy.contains('Panic Station'); 
    })
  })
})