const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');


// Set up
const clientId = 'b79b10bd0d1d44d3a5acc36879f307e2',
    clientSecret = 'bc73737ef95b4813a145eece06135f12';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static('public'));


app.get('/', (req,res,next) => {
  res.render('home')
})

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render('artists', {
        artists: data.body.artists.items
      });
    })
    .catch(err => {
      console.log('Something went wrong!', err);
    })
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render('albums', {
        albums: data.body.items
      });
    })
    .catch(err => {
      console.log('Something went wrong!', err);
    });
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      res.render('tracks', {
        tracks: data.body.items
      });
    })
    .catch(err => {
      console.log('Something went wrong!', err);
    });
});


app.listen(3000, () => {
  console.log("Server listening on port 3000");
})