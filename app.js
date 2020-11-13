require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

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
});

app.get('/artist-search', (req, res) => {
    spotifyApi.searchArtists(req.query.q.toLowerCase())
    .then(data => {
        // console.log(data.body.artists.items)
        res.render('artist-search-results', { artist: data.body.artists.items }) 
      })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.id)
    .then(data => {
        console.log(data.body.items[0].images)
        res.render('albums', { album: data.body.items }) 
      })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:id', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then(data => {
        // console.log(data.body.items[0].preview_url)
        res.render('tracks', { track: data.body.items }) 
      })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

// app.get('/artist-search', async (req, res) => {
//     const searchedArtists = await spotifyApi.searchArtists(req.query.q.toLowerCase())
//     res.render('artist-search-results', { artist: data.body.artists.items }) 
// })

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
