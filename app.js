require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const { get } = require('spotify-web-api-node/src/http-manager');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/artist-search', (req, res) => {
    spotifyApi
    .searchArtists('Love')
    .then((data) => {
        console.log('The received data from the API: ', data.body)
        res.json(data.body.artists.items)
    })
    .catch((err) => console.error('The error while searching artists occurred: ', err))
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi
    .getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
    .then((data) => {
        console.log('The received data from the API: ', data.body)
        res.json(data.body.items)
    })
    .catch((err) => console.error('The error while searching artists occurred: ', err))
});



const PORT = process.env.PORT
app.listen(PORT, () => console.log('My Spotify project running on port 5000 🎧 🥁 🎸 🔊'));
