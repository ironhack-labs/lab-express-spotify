require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
    });





// the routes go here:
app.get( '/artists', ( req, res, next ) => {
    spotifyApi
        .searchArtists( req.query.artists )
        .then( data  => {
           // console.log( 'SEARCH RESULT -> ', data.body.artists);
            res.render( 'artists', {artistsObject: data.body.artists.items} );
        })
        .catch( (err) => console.log( 'Error appeared:', err));
})

app.get( '/albums/:artistId', ( req, res, next ) => {
    spotifyApi
        .getArtistAlbums( req.params.artistId )
            .then( data  => {
                console.log('ALBUM RESULT ->', data.body.items[0]);
                res.render( 'albums', {albumsObject: data.body.items });
            })
            .catch( (err) => console.log('Error', err));
})

app.get( '/tracks/:albumId', ( req, res, next ) => {
    spotifyApi
        .getAlbumTracks( req.params.albumId ) 
            .then( data => {
                console.log('TRACK RESULT ->', data.body);
                res.render( 'tracks', { tracksObject: data.body})
                
            }) 
})


app.get( '/', ( req, res, next) => {
    res
        .status(200)
        .render('home')
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
