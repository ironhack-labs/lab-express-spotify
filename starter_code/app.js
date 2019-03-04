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
// Remember to insert your credentials here


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    })





// The routes go here:

// Index Route
app.get('/', (req, res) => {
    res.render('index')
});

// Artist Route
app.get('/artist', (req, res) => {

    console.log(req.query.requestArtist)

    spotifyApi.searchArtists(req.query.requestArtist)

    .then(data => {
            console.log("The received data from the API: ", data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artist', { artist: data.body.artists.items });
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })

});

// Albums Route


app.get('/albums/:id', (req, res, next) => {

    console.log(req.params.id)
    spotifyApi.getArtistAlbums(req.params.id)

    .then(data => {

            console.log('Artist albums', data.body.items);
            res.render('albums', { albums: data.body.items })
        })
        .catch(err => {
            console.log("The error while searching albums occurred: ", err);
        })

});

// Tracks Route

app.get('/tracks/:id', (req, res, next) => {

    console.log(req.params.id)
    spotifyApi.getAlbumTracks(req.params.id, { limit: 5, offset: 1 })

    .then(data => {

            console.log('Artist albums tracks', data.body.items);
            res.render('tracks', { tracks: data.body.items })
        })
        .catch(err => {
            console.log("The error while searching tracks occurred: ", err);
        })

});

// app.get('/tracks/:id', (req, res) => {
//     spotifyAPI.getAlbumTracks(req.params.id)
//         .then(tracks => {
//             console.log(tracks.body.items)
//             res.render('tracks', { tracks: tracks.body.items })
//         })
// })





app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));