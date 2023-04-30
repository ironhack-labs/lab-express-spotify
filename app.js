require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
require('spotify-web-api-node');

// const SpotifyWebApi = require('spotify-web-api-node');
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
app.get('/', function(req, res) {
    const content = 'Este es el contenido de la página';
    res.render('home', { layout: 'layout', content: content });

});



app.get('/artist-search', function(req, res) {
    const { search } = req.query;
    spotifyApi
        .searchArtists(search)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            const artists = data.body.artists.items;
            res.render('artist-search-results', { layout: 'layout', artists: artists });

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.get('/albums/:artistId', function(req, res) {
    const { artistId } = req.params;
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            const albums = data.body.items;
            res.render('albums', { layout: 'layout', albums: albums });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:albumId', function(req, res) {
    const { albumId } = req.params;
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            const tracks = data.body.items;
            res.render('tracks', { layout: 'layout', tracks: tracks });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));