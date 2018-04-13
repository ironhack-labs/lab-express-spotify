const express = require( "express" );
const app = express();
const hbs = require ("hbs" );
const port = 3000;

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'b37baceee18f4ff999f6359fc4085d24',
    clientSecret = '699a16ffa96e408c840cf8232ece061b';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(err => {
    console.log('Something went wrong when retrieving an access token', err);
});


app.set( "view engine", "hbs" );
app.set( "views", __dirname + "/views/" );
app.set( "view options", {layout: "/layouts/layout"});

app.use( express.static( "public" ));

hbs.registerPartials( __dirname + "/views/partials/" );


// ROUTES
// -------------------------------------------------

app.get( "/", ( req, res, next ) => {
    res.render( "home-page" );
});

app.get( "/artists", ( req, res, next ) => {
    spotifyApi.searchArtists( req.query.artist )
    .then( data => {
        console.log( data.body.artists.items );
        res.locals.artist = data.body.artists.items;
        res.render( "artists" );
    })
    .catch( err => {
        console.log( "FUQ", err );
    })
});

app.get( "/albums/:artistId", ( req, res ) => {
    spotifyApi.getArtistAlbums( req.query.album )
    .then( data => {
        res.render( "albums" );
    })
    .catch( err => {

    })
});

// -------------------------------------------------

app.listen( port, () => {
    console.log( `Server listening on port ${port}` )
});