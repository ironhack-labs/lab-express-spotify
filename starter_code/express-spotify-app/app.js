// EXPRESS
const express = require('express');
const app = express();

// MIDDLEWARE: ejs
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// MIDDLEWARE: express-ejs-layouts
app.use(express.static('public'));
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layouts/index');

// MIDDLEWARE: Bodyparser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// MIDDLEWARE: Morgan
const morgan     = require('morgan');
app.use(morgan('dev'));

// MIDDLEWARE: Spotify
const SpotifyWebApi = require('spotify-web-api-node');
const spotify = new SpotifyWebApi();


/**
 * SPOTIFY AUTHENTIFICATION
 */
const spotifyCredentials = require('./private/spotify-auth');

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId : spotifyCredentials.clientId,
  clientSecret : spotifyCredentials.clientSecret
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


/**
 * ROUTES
 */

/* / route */
app.get('/', (request, response, next) => {
  // Render the / page
  response.render('index');
});


/* /artists route */
app.get('/artists', (request, response, next) => {
  // Retrieve form data
  let artistKeyword = request.query.artist;

  // SPOTIFY API CALL: Search artists by name
  spotifyApi.searchArtists(artistKeyword, {}, (err, data) => {
    if (err) throw err;

    // Retrieve the artists in the search result
    let searchArtistsResult = {
      artists: data.body.artists.items,
      searchKeywords: artistKeyword
    };
  
    // Render the artists page
    response.render('artists', searchArtistsResult);
  }); 
});


/* /albums route */
app.get('/albums/:artistId', (request, response, next) => {
  // Retrieve the artists ID
  let artistId = request.params.artistId;

  // SPOTIFY API CALL: retrieve all the albums of the artist
  spotifyApi.getArtistAlbums(artistId, {}, (err, data) => {
    if (err) throw err;

    // Retrieve the artist albums
    let artistAlbums = {
      artistName: data.body.items[0].artists[0].name,
      album: data.body.items
    };

    // Render the /albums page
    response.render('albums', artistAlbums);
  });
});


/* /tracks route */
app.get('/tracks/:albumName/:albumId', (request, response, next) => {
  // Retrieve the album name and ID
  let albumName = request.params.albumName;
  let albumId = request.params.albumId;

  // SPOTIFY API CALL: retrieve all the tracks of the album
  spotifyApi.getAlbumTracks(albumId, {}, (err, data) => {
    if (err) throw err;

    // Retrieve the artist albums
    let albumTracks = {
      artistName: data.body.items[0].artists[0].name,
      albumName: albumName,
      tracks: data.body.items
    };

    // Render the /tracks page
    response.render('tracks', albumTracks);
  });
});


// Server Started
app.listen(3000, () => {
  console.log('My first app listening on port 3000!')
});