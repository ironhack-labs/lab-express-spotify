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
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index');
  });

app.get('/search', (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search-results',
       {artists: data.body.artists.items});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  });

  app.get('/albums/:id', (req, res, next) => {
    // console.log(req.params)
    const artistId = req.params.id

    spotifyApi
    .getArtistAlbums(artistId)
    .then(
        function(data) {
        //   console.log('Artist id', data.body.artists.items.id);
          res.render('albums',
       {albums: data.body.items,
        artist: data.body.items[0].artists[0].name,
    });
       console.log(data.body)
        },
        function(err) {
          console.error(err);
        }
      );

  });

  app.get('/tracks/:id', (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.id)
    .then(function(data) {
        console.log(req.params.id);
        res.render('tracks',
        {tracks: data.body.items});
        // console.log(data.body.items);
      }, function(err) {
        console.log('Something went wrong!', err);
      });
    
  })
  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
