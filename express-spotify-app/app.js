
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require("path");
const SpotifyWebApi = require('spotify-web-api-node');
const PORT = 3000;

// Remember to paste here your credentials
const clientId = '62ff5ab4fb0b440c9ab6aad80eafc4ac',
    clientSecret = '3a11edf4624148b492426484742b720b';

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


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

app.get('/', function (req, res) {
  res.render('home')
})

app.get("/artists", (req, res, next) => {
  
  let artist = req.query.artist;

  spotifyApi.searchArtists(artist)
    .then(data => {
      console.log(data.body.artists.items)
      res.render('artists', { artists: data.body.artists.items });
    })
    .catch(err => {
      console.error(err);
    })
});


app.get("/albums/:artistId", (req, res, next) => {
  let album = req.params.artistId
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {           
      res.render('albums', { albums: data.body.items });
    })
    .catch(err => {
      res.send(err);
    });
});



app.listen(PORT, () => {
  console.log('CONNECTED')
});