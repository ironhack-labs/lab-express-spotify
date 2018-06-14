const express = require('express');
const hbs = require('hbs');
const path = require('path')

const app = express();

var SpotifyWebApi = require('spotify-web-api-node');

// From Spotify developer account
var clientId = '5d35251f2c2c4f21b5c072c99ee9934f',
    clientSecret = '4d32c3abd0444edca7c24e3859eaee62';

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



app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(__dirname + '/views/partials')


app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  let artistSearch = req.query.artist

  // console.log("*** artistsSearch: ", artistSearch)

  spotifyApi.searchArtists(artistSearch)
    .then(data => {
      let artists = data.body.artists.items
      // console.log("*** artists: ", artists)
      res.render('artists', {artists} );
    })
    .catch(err => {
      console.log(err)
    })
});

app.get('/albums/:artistID', (req, res, next) => {
  
  let artistID = req.params.artistID
  // console.log("*** artistID: ", artistID)
  
  spotifyApi.getArtistAlbums(artistID)
    .then(data => {
      let albums = data.body.items
      // console.log("*** data: ", albums)
      res.render('albums', {albums} );
    })
    .catch(err => {
      console.log(err)
    })
});

app.get('/albums/:albumID/tracks', (req, res, next) => {
  
  let albumID = req.params.albumID
  // console.log("*** albumID: ", albumID)
  
  spotifyApi.getAlbum([albumID])
    .then(data => {
      let tracks = data.body.tracks.items
      console.log("tracks ######################: ", tracks)
      res.render('tracks', {tracks} );
    })
    .catch(err => {
      console.log(err)
    })
});

// spotifyApi.getAlbumTracks(albumID)

app.listen(3000);
