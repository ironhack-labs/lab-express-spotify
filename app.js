require('dotenv').config(); // reads .env file, node.js stellt das bereit

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({ // an instance of the SpotifyWebApi class
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant() // http connection request 
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:


app.get('/', (req, res) => {
    res.render('index')
});

app.get('/artist-search', (req, res) => {

    // console.log(req.query.artist)

    spotifyApi
        .searchArtists(req.query.query)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items,
                JSON.stringify(data.body.artists.items) // less readable but you have the access to all properties names at once
            );
            res.render("artist-search-results", { data: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:id', (req, res) => {


    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(data => {
            console.log('The received data from the API: ', data.body.items, JSON.stringify(data.body.items));
            res.render("albums", { data: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get('/tracks/:id', (req, res) => {


    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render("tracks", { data: data.body.items })
        })
        .catch(err => console.log('The error while searching tracks occurred: ', err));

});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
