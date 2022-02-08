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

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artist-search', (req, res) => {
    const search = req.query.search;
    spotifyApi.searchArtists(search)
        .then(match => {
            const artists = match.body.artists.items;
            res.render('artist-search-results', { artists })
        })
        .catch(error => console.log(error));
})

app.get('/albums/:artistId', (req, res) => {
    const { artistId } = req.params;
    spotifyApi.getArtistAlbums(artistId, { limit: 10 })
        .then(match => {
            const albums = match.body.items;
            res.render('albums', { albums })
        })
        .catch(error => console.log(error));
})

app.get('/tracks/:albumId', (req, res) => {
    const { albumId } = req.params;
    spotifyApi.getAlbumTracks(albumId)
        .then(match => {
            const tracks = match.body.items;
            res.render('tracks', { tracks })
        })
        .catch(error => console.log(error));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
