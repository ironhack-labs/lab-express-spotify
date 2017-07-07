const express = require('express');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
app.use(morgan('dev', {stream: accessLogStream}))

var clientId = '524a0b707548469289f0462119a494fd',
    clientSecret = '4168a2834ac04d1bb138867da63e8700';

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
        console.log('Something went wrong when retrieving an access token', err);
  });

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended : true }));

app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('home');
});


app.post('/artists', (req, res) => {
   let searchName = req.body.artist;
   spotifyApi.searchArtists(searchName, {}, (err, data) => {
    if (err) throw err;
      let artists = data.body.artists.items;
      res.render('artists', { artists, searchName });   
    }); 
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    let albums = data.body.items;
    res.render('albums', { albums });
  }, function(err) {
    console.error(err);
  });
});

app.get('/tracks/:trackId', (req, res) => {
 spotifyApi.getAlbumTracks(req.params.trackId, { limit : 5, offset : 1 })
  .then(function(data) {
     let tracks = data.body.items;
     res.render('tracks', { tracks });
  }, function(err) {
  });
});


app.listen(process.env.PORT || 3000, () => {
    console.log('Listening in port 3000');
});