// https://github.com/ironhack-labs/lab-express-spotify

require('dotenv').config();

// Iteration 2 | Express Setup-we have required all the packages we need for now:
const express = require('express');
const app = express();
const hbs = require('hbs');
const PORT = 3000
    // Iteration 1 | Spotify API Setup - 3.require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// 4, 5.setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving'))

// Iteration 3 | Search for an Artist - Step 2 | Display results for artist search
app.get('/', (req, res) => {
    res.render('main-page.hbs', { doctitle: 'Home Page' });
});

app.get('/artist-search', (req, res) => {
    console.log(req.query.name)
    spotifyApi.searchArtists(req.query.name)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            // console.log(data.body.artists.items[0].images[0])
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artist-search-results.hbs', { artists: data.body.artists.items, doctitle: 'Artist Search Results' })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

//Iteration 4 | View Albums
app.get('/albums/:artistId', (req, res) => {
    // req.params = {
    //     artistId: "",
    //     abc: ""
    // }
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(artistAlbums => {
            // console.log(artistAlbums.body);
            // console.log(artistAlbums.body.items[0].images);
            res.render('albums.hbs', { albums: artistAlbums.body.items, doctitle: 'Artist Albums' })
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
})

// Iteration 5 | View Tracks
app.get('/track/:albumId', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(albumId => {
            // console.log(artistAlbums.body);
            console.log(albumId.body.items);
            res.render('track-information.hbs', { albumsTrack: albumId.body.items, doctitle: 'Albums track' })
        })
        .catch(err => console.log('The error while searching track information occurred: ', err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));