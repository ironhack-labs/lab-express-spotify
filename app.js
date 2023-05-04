require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const router = express.Router()

// require spotify-web-api-node package here:

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
    res.render('home-page')
});

app.get('/artist-search', (req, res) => {

    const { artistName } = req.query

    spotifyApi
        .searchArtists(`${artistName}`)
        .then(data => {
            const info = data.body.artists.items
            console.log('The received data from the API: ', data.body);
            // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
             res.render('artist-search-results', { info })
            
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            res.render('albums', data.body)
            // res.send(data.body)
        })
        .catch(err => console.log(err))

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
