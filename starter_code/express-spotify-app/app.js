var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

// Remember to paste here your credentials
var clientId = '20335f8304054be1b06c8060226627d8',
  clientSecret = 'e83da69959cc4d5488124855f1ac9093';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artist/', (req, res, next) => {
  let artist = req.query.artist;
  spotifyApi.searchArtists(artist)
    .then(data => {
      let artistObj = data.body.artists.items
      res.render('artist', {
        artistObj
      })

    })
    .catch(err => {
      console.log(err)
    })
});

app.get('/albums/:artistId', (req, res) => {
  let artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId).then(data => {
      let albumObj = data.body.items;
      res.render('albums', {
        albumObj
      })

    })
    .catch(err => {
      console.log(err)
    })

});

app.get('/tracks/:albumId', (req, res) => {
  let albumId = req.params.albumId;
  spotifyApi.getAlbumTracks(albumId).then(data => {
      let tracksObj = data.body.items;
      res.render('tracks', {
        tracksObj
      })
      console.log(tracksObj)
    })
    .catch(err => {
      console.log(err)
    })

});

app.listen(3000, () => {
  console.log('listening on port 3000!')
});