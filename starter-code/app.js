require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:



// Our routes go here:

app.get("/index", (req, res) => {
    res.render('index')
});

app.get('/artist-result', (req, res) => {

    let {
        artist
    } = req.query

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            let artistsData = data.body.artists
            res.render('artist-result', artistsData)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {

    let artistId = req.params.artistId
    spotifyApi
        .getArtistAlbums(artistId).then(artistAlbums => res.render('albums', artistAlbums.body))
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));