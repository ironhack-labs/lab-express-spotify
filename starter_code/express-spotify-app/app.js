const express = require('express');
const app = express();
var SpotifyWebApi = require('spotify-web-api-node');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Remember to paste here your credentials
var clientId = '03fa711509194c348f00b92a7547185a',
    clientSecret = '403e9c7bc7604f9183c44ca59d6648c4';

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

// load search page and search box
app.get('/', (req, res) => {
  res.render('index', {

  });
});

// show search result on another page
app.get('/artists', (req, res) => {
  let search = req.query.artistName;
  console.log(search);
  spotifyApi.searchArtists(search).then(result => {
    let a = result.body.artists.items;
    console.log(a)
    res.render('artists', {
      artistName: search,
      foundArtists: a
    });
  });
});

// show albums of an artist on another page
app.get('/view-albums/:id', (req, res) => {
  let artistID = req.params.id;
  console.log("debug artistI id " + artistID);
  spotifyApi.getArtistAlbums(artistID).then(result => {
     let b = result.body.items;
    res.render('view-albums', {
      viewAlbums: b
    });
  });
});

// show tracks of an album on another page
app.get('/view-albums/view-tracks/:id', (req, res) => {
  console.log(req.params.id);
  let tracks = req.params.id;
  spotifyApi.getAlbumTracks(tracks).then(result => {
    console.log(result.body);
     let c = result.body.items;
    res.render('view-tracks', {
      viewTracks: c
    });
  });
});

// Server Started
app.listen(3000, () => {
  console.log('The server is running');
});
