require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
//Iteration 1________________________________
const SpotifyWebApi = require('spotify-web-api-node')
//End of Iteration 1________________________________


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
//Iteration 1________________________________
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token:
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
//End of Iteration 1________________________________

// Our routes go here:
//Iteration 3___________
//Step 1: create a homepage:
app.get('/', (req, res) => {
    +
    res.render('index.hbs')
})

app.get('/artist-search', (req, res) => {
    console.log(req.query.body)
    spotifyApi
        .searchArtists(req.query.artistName)
        .then((data) => {
            console.log(data);
            res.render('artist-search-results', {
                artist: data.body.artists.items
            })
        })
        .catch(err => console.log(err));
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId, {
            limit: 3
        })
        .then((data) => {
            res.render('albums', {
                album: data.body.items
            })
        })
        .catch(err => console.log(err))
});

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then((data) => {
            console.log('Album tracks', data.body);
            res.render('tracks.hbs', {
                tracks: data.body
            })
        })
        .catch(err => console.log('The error occurred while getting the tracks:', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));