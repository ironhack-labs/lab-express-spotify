const express = require('express');
const app = express();

var SpotifyWebApi = require('spotify-web-api-node');
const morgan     = require('morgan');

// Remember to paste here your credentials
var clientId = 'aa6b8cd49c8e425b96e178c9d8095b3f',
clientSecret = 'e43f1b74f9e64275acb88196c01e60e2';

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


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(morgan('dev'));

// let albumName; see below 

app.get("/", (req, res, next) => {
  res.render('index'); //change to index
  // console.log(req.query);
  next();
});

app.get("/artist", (req, res, next) => {
  let artist = req.query.artist;
  spotifyApi.searchArtists(artist)
  .then((response) => {
    let data = {name: artist, main: response}
    // let string= JSON.stringify(response.body.artists.items[0].images[1].url);
    // let noQuotes = string.slice(1, -1)
    // console.log(`This is string: ${string}`)
    // console.log(`This is noQuotes: ${noQuotes}`);
    res.render('artist', data);
  })
  .catch((err) => {
    console.log(err);
  });     
});

app.get('/albums/:artistId', (req, res) => {
  let artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId)
  .then((data) =>  {
    console.log('Artist albums', (data.body));
    // albumName = data.body.items  <---how to pass variable for next page? 
    // console.log(req.params)
    res.render('albums', data); 
  }, (err)  => {
    console.error(err);
  });
});

app.get('/albums/:albumName/tracks/:albumId', (req, res) => {
  let albumId = req.params.albumId;
  let albumNameSanitized = req.params.albumName;
  let albumName = decodeURI(albumNameSanitized);
  spotifyApi.getAlbumTracks(albumId)
  .then(function(response) {
    let data = {name: albumName, main: response};
    res.render('tracks', data);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});








app.listen(3000, () => {
  console.log("I'm working!");
});