require('dotenv').config();

const { query } = require('express');
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

app.get('/', (req, res) => {
    res.render('index')
})


app.get('/artist-search', (req, res) => {

    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const artists = data.body.artists.items
            res.render('artist-search-results', { artists })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/albums/:artistId', (req, res, next) => {


    spotifyApi

        .getArtistAlbums(req.query.artist)
        .then(data => {
            const artistID = data.body.artists.items[0].id
            console.log('The received data from the API: ', data.body.artists.items[0].id)
            res.render('albums', { artistID })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})



app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));



// console.log('EL ARTISTA ES:', req.query.artist)
// console.log('The received data from the API: ', data.body.artists.items);
// console.log('The received data from the API: ', data.body.artists.items[0].id)