require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

  spotifyApi
  .searchArtists(("/artist/:id", (req,res,next) => {
    spotifyApi.searchArtists(req.params.id)
  }))
  .then( data => {
    console.log('The received data from the API: ', data.body);
    res.render('artist-search-results',data)
  })
  .catch(err => console.log('The error while searching for atists ocuured: ', err));
// Our routes go here:

app.get("/", (req,res,next) => {
  res.render("home")
});

app.get("/artist-search", (req,res,next) => {

  let filter;

  const result= req.query.artistName;

  res.render("artist-search-results")
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
