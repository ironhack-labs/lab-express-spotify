require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:

// Home page
app.get('/', (req, res, next) => {
  res.render('index');
});

// artists 
app.get('/artists', (req, res, next) => {
  let { artist } = req.query
  spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log(data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artists', {artists: data.body.artists.items})
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
});

// Albums
app.get('/albums/:id', (req, res, next) => {
  // .getArtistAlbums() code goes here
  let artistId = req.params.id;
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let items = data.body.items;
      res.render('albums', {items})
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
});


app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
