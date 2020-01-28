require('dotenv').config();

const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const hbs = require('hbs');

// require spotify-web-api-node package here:

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

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);

app.get('/artists', (req, res, next) => {
  let {artist} = req.query
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      let items = data.body.artists.items;
      console.log(items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artists', {items})
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:id', (req, res, next) => {
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
  // .getArtistAlbums() code goes here
});

app.get('/tracks/:id', (req, res, next) => {
  let tracksId = req.params.id;
  spotifyApi
    .getAlbumTracks(tracksId)
    .then(data => {
      console.log('The received data from the TRACKS: ', data.body);
      let items = data.body.items;
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('tracks', {items})
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/', (req, res, next) => res.render('index'));