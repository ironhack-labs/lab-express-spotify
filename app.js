require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
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
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', async(req, res) => {
    const {
        artistName
    } = req.query;
    const {
        body: {
            artists: {
                items
            }
        }
    } = await spotifyApi.searchArtists(artistName);
    res.render('artist-search-result', {
        items
    })
});

app.get('/artist/:artistId', async(req, res) => {
    const {
        artistId
    } = req.params;
    const {
        body: {
            items
        }
    } = await spotifyApi.getArtistAlbums(artistId);
    res.render('albums', {
        items
    })
})

app.get('/album/:albumId', async(req, res) => {
    const {
        albumId
    } = req.params;
    const {
        body: {
            items
        }
    } = await spotifyApi.getAlbumTracks(albumId);
    res.render('tracks', {
        items
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));