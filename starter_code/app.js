const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));




// setting the spotify-api goes here:

// Remember to insert your credentials here
//require('dotenv').configure()
//console.log()

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

  



// the routes go here:


//Home 

app.get("/", (req, res, next)=>{
  res.render("index")
})

//Search

app.get('/search', (req, res, next) => {
  console.log('searching for ',req.query)
  spotifyApi.searchArtists(req.query.artist) //Tupac
    .then(data => {

      console.log("The received data from the API: ", data.body.artists.items);
      //res.json(data.body) //Send back Tupacs data 
      res.render('artists.hbs', {items: data.body.artists.items} )
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})


//Albums

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
  .then(function(data) {
    console.log('Artist albums', data.body);
  }, function(err) {
    console.error(err);
  });
});
    

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
