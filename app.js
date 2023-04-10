require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// 1. require the body-parser
const bodyParser = require('body-parser');
// 2. let know your app you will be using it
app.use(bodyParser.urlencoded({ extended: true }));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
  });


app.get('/artist-search', (req, res, next) => {
    spotifyApi
  .searchArtists('req.query')
  .then(data => {
    console.log('The received data from the API: ', data.body);
    app.post('/artist-search', (req, res) => {
        let artista = req.body.artista;
        res.send(req.query);
      });

    res.render('artist-search-results');
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  });


app.listen(3001, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'));
