require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

  const app = express();

  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/public'));


// Our routes go here:
app.get('/', (req, res) => res.render('home'));


app.get('/artist-search', (req, res) => {
  const {search} = req.query;
  
  spotifyApi
   
    .searchArtists(req.query.theArtistName)
    .then(data => {
    res.render('artist-search-results', { artists: data.body.artists.items });
    })
    .catch(err => console.log('The error while searching artists occurred:', err));
});



app.get('/albums/:theId', (req, res) => {
  
  spotifyApi
    .getArtistAlbums(req.params.theId)
    .then(data => {
     res.render('albums', { albums: data.body.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});






app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
