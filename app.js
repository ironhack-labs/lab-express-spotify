require('dotenv').config();

const { Router } = require('express');
const express = require('express');
const hbs = require('hbs')
const SpotifyWebApi = require('spotify-web-api-node')


// require spotify-web-api-node package here:

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
// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res) => {
    res.render("home-page")
})
app.get('/artists', (req, res) => {
    const { artist } = req.query
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            const groups = data.body.artists.items


            res.render("artist-search-results", { groups }) // {groups: groups}

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})
app.get('/albums', (req, res) => {
    const albums = data.body.artists.items
    spotifyApi
        .getArtistAlbums(albums)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            const albums = data.body.artists.items


            res.send(data.body)

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.listen(5005, () => console.log('My Spotify project running on port 5000 🎧 🥁 🎸 🔊'));
