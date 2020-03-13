require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/',(req,res) => {
    res.render('index');
});

app.get('/artist-search', (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => res.render("artist-search-results", {data}))
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get("/albums/:id", (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.id)
    .then (data => data.body.items)
    .then (data => res.render("albums", {data}));
  })

app.get("/tracks/:id", (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then (data => {return data.body.items;})
    .then (data => res.render("tracks", {data}));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
