require('dotenv').config();
//we have required all the packages we need for now:
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
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

//Iteration 3, Step 1 (Create a Homepage)
app.get('/', (req, res, next) => {
    res.render('index');
  });

//Iteration 3, Step 2 (Display results for artist search)
app.get('/artist-search', (req, res, next) => {
    spotifyApi.searchArtists(req.query.artist) 
    .then(function(data) {
      console.log('Artist information', data.body.artists.items);
        res.render('artist-search-results', {data: data.body.artists.items} );
    }, function(err) {
      console.error(err);
    });
})

//Iteration 4, View albums
app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(function(data) {
        console.log('Artist albums', data.body.items);
        res.render('albums', {data: data.body.items})
        },
        function(err) {
          console.error(err);
        }
      );
  });

  //Iteration 5, View tracks
  app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(function(data) {
        console.log(data.body.items);
        res.render('tracks', {data:data.body.items})
        }, 
        function(err) {
            console.log('Something went wrong!', err);
  })
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
