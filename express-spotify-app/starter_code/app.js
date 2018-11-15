const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));


var SpotifyWebApi = require('spotify-web-api-node');


var clientId = 'e03bc90a082d47ed94a3db94020d1ffd',
  clientSecret = '2bfb20410a4d4eba97790ebe473a8ee8';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});




app.get('/', (req, res, next) => {

  res.render('home');
});

app.get('/artist', (req, res, next) => {
  //console.log(req.query)
  spotifyApi.searchArtists(req.query.artist)
  .then(data => {  
    console.log(data.body.artists.items[0])
    res.render('artist', {artists:data.body.artists.items});
  })
  .catch(err => {
    console.log(err)
  })
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log(data)
    res.render('albums', {albums:data.body});
  })
  .catch(err => {
    console.log(err)
  })
});

app.get('/albums/track/:albumID', (req, res) => {
  console.log(req.params.albumID)
  spotifyApi.getAlbumTracks(req.params.albumID)
  .then(data => {
    res.render('audio', {albums:data.body.items});
  })
  .catch(err => {
    console.log(err)
  })
});




// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });


app.listen(3000)


