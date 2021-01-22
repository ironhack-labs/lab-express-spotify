require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

  
// Our routes go here:
app.get('/', (req, res, next) => {
  res.render('index')

})


app.get('/search-artist', (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.name)
  .then(data => {
    if (data.body.artists.total == 0) {
      res.render('no-results')
  } else {
      res.render('artist-search-results', { results: data.body.artists})
  }
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
