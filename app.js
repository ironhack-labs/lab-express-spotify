require('dotenv').config();


const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

  // Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    
    // Our routes go here:
    
app.get( '/', ( req, res, next ) => {
    res.render( 'home' )
} )

app.get( '/artist-search', (req, res, next) => {
    // console.log(req.query);

    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            // console.log('The received data from the API: ', data.body.artists.items);
            // console.log(data.body.artists.items)
            let artistSearched = data.body.artists.items;
            res.render('artist-search', {artistSearched})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
    })
    
app.get('/albums/:artistId', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then((data) => {
            const albums = data.body.items
            res.render('albums', {albums})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/tracks/:tracksId', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.tracksId)
        .then(data => {
            const tracks = data.body.items
            res.render('tracks', {tracks})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
