const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
var clientId = 'fb51551663fc475c86b74bc8489cd02d',
   clientSecret = "7458cec514ca49fda735f136502ad462";

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.set('view options', { layout: '/layouts/layout' });
hbs.registerPartials(__dirname + '/views/partials');

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res) => {
  res.render(`home`);
});

app.get('/artists', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then((data) => {
      let artistsArray = [];
      data.body.artists.items.forEach(e => {
        artistsArray.push(e);
      });
      res.render('artists', {artistsArray});
    })
    .catch(e => {
     console.log(e);
    });
  });

     app.get('/albums/:artistId', (req, res) => {
      spotifyApi.getArtistAlbums(req.params.artistId)
      .then((data) => {
        // console.log(data)
        let albumsArray = [];
        data.body.items.forEach(e => {
          albumsArray.push(e);
        });
        res.render('albums', {albumsArray});
      })
      .catch(e => {
        console.log(e);
      });
    });

    app.get('/tracks/:albumId', (req, res) => {
      spotifyApi.getAlbumTracks(req.params.albumId)
      .then((data) => {
        // console.log(data)
        let tracksArray = [];
        data.body.items.forEach(e => {
          tracksArray.push(e);
        });
        res.render('tracks', {tracksArray});
      })
      .catch(e => {
        console.log(e);
      });
    });
    app.listen(3000);