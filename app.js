require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

// retrieve access token
spotifyApi
    .clientCredentialsGrant()
    .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
    .catch((err) =>
        console.log('something went wrong while retrieving access token', err)
    );

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artist-search', async (req, res) => {
    try {
        const { body } = await spotifyApi.searchArtists(req.query.search);
        const { items: result } = body.artists;
        res.render('artist-search-result', { result });
    } catch (error) {
        console.log(error);
    }
});

app.get('/albums/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = await spotifyApi.getArtistAlbums(id);
        const result = body.items;
        res.render('albums', { result, artistId: id });
    } catch (err) {
        console.log(err);
    }
});

app.get('/albums/:id/tracks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = await spotifyApi.getAlbumTracks(id);
        const result = body.items;
        res.render('tracks', { result });
    } catch (err) {
        console.log(err);
    }
});

app.listen(3000, () =>
    console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
