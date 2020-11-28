require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

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

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/artist-search", (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const artistInfo = data.body.artists.items;
            res.render('artist-search-results', {artistInfo})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:name/:artistId', (req, res, next) => {
    const { artistId } = req.params
    const { name } =req.params
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            const info = data.body.items
            res.render('albums', {info, name})
        })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:id', (req, res) => {
    const { id } = req.params
    spotifyApi.getAlbumTracks(id)
        .then(data => {
            const info = data.body.items
            res.render("tracks", {info})
        }
    )
})





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
