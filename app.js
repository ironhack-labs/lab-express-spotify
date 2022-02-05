require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Register the location for handlebars partials here:

hbs.registerPartials(__dirname + "/views/partials");


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
// index route
app.get('/', (req, res) => {
  res.render("index", {
    doctitle: "Home Page",
    });
  });

// /artist-search route
spotifyApi
  .searchArtists('/artist-search', (req, res, next) => {
    res.render(req.query);
  })
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
