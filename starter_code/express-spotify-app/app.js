const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');


app.use(express.static('public'));
app.use(expressLayouts);


// Remember to paste here your credentials
const clientId = '8f1e69c9802e435e997e1983ec9348d0',
    clientSecret = '4037307a11fd4f2ebc93931ea9b99e25';

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

app.get('/', (request, response, next) => {
  response.render('index');
})

app.get('/artists', (request, response, next) => {
  spotifyApi.searchArtists(request.query.artists)
    .then((data) => {
        let artists = data.body.artists.items;
      response.render('artists', {artists} );
    }, function(err) {
      console.error(err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    let albums = {
      albums: data.body.items
    };
    res.render('albums', albums);
  }, function(err) {
    console.error(err);
  });
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    let tracks = {
      tracks: data.body.items
    };
    res.render('tracks', tracks);
  }, function(err) {
    console.error(err);
  });
});

app.listen(3000, () => console.log("Running"));
