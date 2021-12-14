require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node'); 

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token: ', error));

// Our routes go here:
app.get('/', function (req, res, next) {
    res.render('index');
});

app.get('/artist-search', function (req, res, next) {
    console.log("req.query", req.query);
    spotifyApi
        .searchArtists(req.query.artistsearch)
        .then(data => {
            console.log("data.body.artists.items", data.body.artists.items);
            res.render("artist-search-results", { 
                artists: data.body.artists.items,
                searchQuery: req.query.artistsearch
            });
        })
        .catch(err => console.log("An error occurred while searching for artist: ", err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
