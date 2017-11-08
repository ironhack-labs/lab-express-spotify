const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

// Remember to paste here your credentials
var clientId = '0df1baabc4844f4bb710a666cfa92547',
    clientSecret = '6c02d3a9800d41ada84b95fe5e2f6867';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.use(morgan('dev'));


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);

app.set('layout', __dirname + '/views/layouts/main');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/',(req,res)=>{
  res.render('home');
});

app.get('/artists',(req,res)=>{
  let artist = req.query.artist;
  console.log(`Buscando por artista: ${artist}`);
  spotifyApi.searchArtists(artist)
    .then((data) => {
      console.log(data.body.artists.items);
      res.render('artists', {
        artists: data.body.artists.items
      });
    }, (err) => {
      res.render('error', {error: `It's been an error: "${err}"`});
    });
});

app.get('/albums/:artistId', (req, res) => {
  let artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId)
    .then((data) => {
      res.render('albums', { albums: data.body.items });
    },(err) => {
      res.render('error', {error: `It's been an error: "${err}"`});
    });
});

app.get('/tracks/:albumId',(req,res)=>{
  let albumId = req.params.albumId;
  spotifyApi.getAlbumTracks( albumId, { limit : 5, offset : 1 })
    .then((data) => {
      res.render('tracks', { tracks: data.body.items });
    }, (err) => {
      res.render('error', {error: `It's been an error: "${err}"`});
    });
});

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
