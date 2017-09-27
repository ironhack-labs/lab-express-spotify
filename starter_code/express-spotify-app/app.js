const express = require('express')
const ejs = require('ejs')
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.use(express.static('public'));
app.use(expressLayouts);

app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Remember to paste here your credentials
var clientId = 'b7cd86c7184644e9b644db2af10ed4be',
  clientSecret = '7cc3151d861242e59673c151a9c769c3';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  });


///////////
// VIEWS //
///////////

app.get('/', (req, res, next) => {
  //  let artist = req.query.artist
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  let obj = {
    artist: req.query.artist,
  }
  spotifyApi.searchArtists(obj.artist).then((response) => {
    obj.name = response.body.artists.items.map(el => el.name)
    obj.img = response.body.artists.items.map(el => {
      if (!el.images[0])
        return null
      return el.images[0].url
    })
    obj.id = response.body.artists.items.map(el => el.id)
    res.render('artists', obj);
  });
})

app.get('/albums/:artistId', (req, res, next) => {
  let albums = {
    artistId: req.params.artistId
  }
  spotifyApi.getArtistAlbums(albums.artistId).then((response) => {
    albums.name = response.body.items.map(el => el.name)
    albums.img = response.body.items.map(el => {
      if (!el.images[0])
        return null
      return el.images[0].url
    })
    albums.id = response.body.items.map(el => el.id)
    res.render('albums', albums);
  })

});

app.get('/tracks/:albumId', (req, res, next) => {
  let tracks = {
    albumId: req.params.albumId
  }
  spotifyApi.getAlbumTracks(tracks.albumId).then((response) => {
    tracks.name = response.body.items.map(el => el.name)
    tracks.preview = response.body.items.map(el => {
      if (!el.preview_url)
        return null
      return el.preview_url
    })
    res.render('tracks', tracks);

  })
})

app.listen(3000, () => {
  console.log('Up and running')
})