const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const spotify = new SpotifyWebApi();
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');

var clientId = '8262b63a296a429f80909902d7b500b6',
    clientSecret = 'b1e676cfb5734409b624b11083fe661b';

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

// Logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log/access.log'), {flags: 'a'})
app.use(morgan('dev', {stream: accessLogStream}));

app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/_main');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/artists', async (req, res) => {

  const data = await spotifyApi.searchArtists(req.body.artistname);
  let artists = data.body.artists.items;
  res.render('artists', { artists });
});

app.get('/albums/:artistid', async (req, res) => {

  const data = await spotifyApi.getArtistAlbums(req.params.artistid);
  let albums = data.body.items;
  res.render('albums', { albums });
});

app.get('/tracks/:albumid', async (req, res) => {

  const data = await spotifyApi.getAlbumTracks(req.params.albumid, { limit : 25, offset : 1 });
  let tracks = data.body.items;
  res.render('tracks', { tracks });
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
