const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
// const bootstrap = require('bootstrap');
// const jQuery = require('');
const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '130309a175f5439691f29b71820e47a5',
      clientSecret = 'a833cbef9f5d42aba52ae37462f2b66c';

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


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', __dirname + '/views/layout/main-layout');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(express.static('public'));

app.get('/',(req,res)=>{
  res.render('index');
});

app.get('/artist', (req,res)=>{
  let artistSearch = req.query.artist;
  spotifyApi.searchArtists(artistSearch)
  .then(function(data) {
    let artistResult = data.body.artists.items;
    console.log(artistResult);
    res.render('artist', {artists: artistResult});
  }, function(err) {
    console.error(err);
  });
});

app.get('/artist/:id', (req,res)=>{
  let artistId = req.params.id;
  spotifyApi.getArtistAlbums(artistId)
  .then(function(data) {
    // let artistAlbums
    console.log(data.body.items);
    res.render('albums', {albums: data.body.items});
  }, function(err) {
    console.error(err);
  });
});

app.get('/albums/:id', (req,res)=>{
  let albumId = req.params.id;
  spotifyApi.getAlbumTracks(albumId)
  .then(function(data) {
    res.render('tracks', {tracks: data.body.items});
  }, function(err) {
    console.error(err);
  });
});


app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
