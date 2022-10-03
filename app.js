require('dotenv').config();


// Retrieve an access token


const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// setting the spotify-api goes here:

/* spotifyApi
    .searchArtists(artist)
    .then(data => {
        console.log('The received data from the API: ', data.body);
        res.render("artist-search-results", { spotifyApi: data })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

 */
// Our routes go here:

app.get("/index", (req, res, next) => {
    console.log("this is the homepage");
    res.render("index");
});

app.get("/artist-search-results", (req, res) => {
    const artist = req.query.artist
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            console.log(data.body.artist);
            res.render("artist-search-results", { spotifyApi: data })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});





app.listen(3001, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'));
