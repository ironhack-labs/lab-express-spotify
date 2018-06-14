var SpotifyWebApi = require('spotify-web-api-node');

var clientId = '8a44dea9abd24fc1a43e2255522c259e',
    clientSecret = '2d55f88122194fa69cef94030081cfbe';

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

const express       = require('express');
const path          = require('path');
const hbs           = require('hbs');
const bodyParser    = require('body-parser');

const app = express();

app.set( 'view engine', 'hbs' );
app.set( 'views', path.join( __dirname, 'views' ) )
hbs.registerPartials( __dirname + '/views/partials' );

app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( bodyParser.urlencoded( { extended: true } ) );


app.get('/', (req, res) => {
  res.render('index');
} );

app.get('/artists', (req, res) => {
  let artistName = req.query.artist;
  spotifyApi.searchArtists( artistName )
    .then(data => {
      let spotifyResponse = data.body.artists.items;
      let artistsArr = spotifyResponse.map( (artist) => (
        { id: artist.id, name: artist.name, image: artist.images[0] ? artist.images[0].url : null }
      ) );
      console.log( artistsArr );
      res.render( 'artists', { artists: artistsArr } );
    })
    .catch(err => {
      console.log( err );
    })
});

app.get('/albums/:artistId', (req, res) => {
  let artistId = req.params.artistId;
  spotifyApi.getArtistAlbums( artistId )
    .then(data => {
      let albumsArr = data.body.items;
      let artistName = albumsArr[0].artists[0]['name'];
      res.render( 'albums', { albums: albumsArr, artist: { name: artistName } } );
    })
    .catch(err => {
      console.log( err );
    })
});

app.get('/tracks/:albumId', (req, res) => {
  let albumId = req.params.albumId;
  spotifyApi.getAlbumTracks( albumId )
    .then(data => {
      let tracks = data.body.items;
      res.render('tracks', { tracks })
    })
    .catch(err => {
      console.log( err );
    })
});

app.listen(3000, () => {
  console.log("APP listening on port 3000...enjoy!");
});