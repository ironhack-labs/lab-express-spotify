var SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

// Remember to paste here your credentials
const clientId = '5632dfe00cec441aafb8e3572f9f1fb5';
const clientSecret = 'b09e21a96ca84859b733b6895b6e1651';

let spotifyApi = new SpotifyWebApi({
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

// let a = (req,res,next) =>{
//   console.log("EL MIDDLEWARE DE MARC");
//   next();
// };

app.use(express.static('public'));

app.get('/',(req,res)=>{
  res.render('index');
});

app.get('/artists', (req, res) => {
  let artistName = req.query.artist;//name del input

  spotifyApi.searchArtists(artistName)
  .then(function(data) { //promesa - objeto data
    console.log(data.body.artists.items);
    let artistsArray = data.body.artists.items;
    res.render('artists', {artist: artistsArray});//artist nombre de la key que le damos
    //artists es la url donde tenemos que renderizar o pintar
  }, function(err) {
    console.error(err);
  });
});

app.get('/artist/:id', (req, res) => {
  let artistId = req.params.id;
  // :id con esto le decimos que esta parte de la url es variable
  spotifyApi.getArtistAlbums(artistId)
    .then(function(data) {
      let artistAlbums = data.body.items;
      console.log(data.body.items);
      res.render('artist', {albums: artistAlbums});//albums nombre de la key que
    }, function(err) {
      console.error(err);
    });
});

app.get('/album/:id', (req, res) => {
  let albumId = req.params.id;

  spotifyApi.getAlbumTracks(albumId)
    .then(function(data) {
      console.log(data.body);
      res.render("tracks", {tracks: data.body.items});
    }, function(err) {
      console.log('Something went wrong!', err);
    });
});

app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
