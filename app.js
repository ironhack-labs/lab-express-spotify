require('dotenv').config();
const PORT = 3000;
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

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get(`/`, (req, res) => {
    res.render(`index`)
})

app.get(`/artist-search/`, (req, res, next) => {
    spotifyApi
        .searchArtists()
        .then(data => {
            console.log('The received data from the API: ', data.body),
                res.render(`artist-search-results`, {
                    data
                })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums((req.params).artistID)
        .then(data => {
            console.log('The received data from the API: ', data.body),
                res.render(`albums`, {
                    data
                })
        })

})

app.listen(PORT, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));