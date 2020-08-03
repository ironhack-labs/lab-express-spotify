require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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

/* GET home page */
app.get('/', (req, res, next) => {
    res.render('index');
});

//GET artist search results

app.get("/artist-search", (req, res, next) => {
    // console.log(req.query)
    spotifyApi
        .searchArtists(req.query.query)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items[0]);
            res.render("artist-search-results", {
                artist: data.body.artists.items
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});

//GET selected artists albums

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log('Artist albums', data.body);
            res.render('albums', {
                album: data.body.items
            })
        })
        .catch(err => {
            console.error(`Error getting album: ${err}`);
        });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))