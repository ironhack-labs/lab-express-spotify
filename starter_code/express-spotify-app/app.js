// Get credential info from https://developer.spotify.com/
const express = require('express');
const app = express();
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
// Body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
// Partials
hbs.registerPartials(__dirname + '/views/partials');

// Remember to paste here your credentials
let clientId = 'd68cb9add3d042b68d2f41537ef1ed15',
    clientSecret = 'a184632042e84919885290fd8dab4c44';

var spotifyApi = new SpotifyWebApi({
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

// Route rendering
app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  let userQuery = req.query.artist;
  spotifyApi.searchArtists(userQuery)
    .then(artists => {
      let artistsList = artists.body.artists.items;
      // console.log(artistsList);
      res.render('artists', {artistsList});
    })
    .catch(err => {
      console.log('There was a problem');
    })
});

app.get('/albums/:artistId', (req, res) => {
  let artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId).then(
    function(albums) {
      let albumList = albums.body.items;
      // console.log('Artist albums', albums.body.items.images[0].url);
      // console.log('1st album of the artist', albums.body.items[0]);      
      // console.log('imgItems', albums.body.items[0].images[0]);
      res.render('albums', {albumList})
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get('/tracks/:albumId', (req, res) => {
  let albumId = req.params.albumId;
  spotifyApi.getAlbumTracks(albumId, { limit : 5, offset : 1 }).then(
    function(tracks) {
      // console.log('TracksList generation success');
      let tracksList = tracks.body.items;
      console.log('Album\'s tracks', tracks.body.items);
      res.render('tracks', {tracksList})
    },
    function(err) {
      console.error(err);
    }
  );
});

app.listen(3000);