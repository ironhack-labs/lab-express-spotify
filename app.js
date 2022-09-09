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

// Our routes go here:--------------------------

// index route
app.get('/', (req, res) => {
    res.render('index')
})

// artist search

app.get('/artist-search', (req, res, next) => {
    let myParam = req.params
    let myQuery = req.query
    console.log(myParam)
    console.log(myQuery)
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            let artistArray = data.body.artists.items;
            // let displayName = artist[0].name
            // console.log(displayName)


            res.render('artist-search-results', {artistArray})

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


// Artist albums route
app.get('/albums/:artistId', (req, res, next) => {
    // Get albums by a certain artist
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(function (data) {
            console.log('Artist albums', data.body.items);
            let albumsArray = data.body.items;
            // let artistArray = data.body.artist.items

            res.render('albums', {albumsArray})
        }, function (err) {
            console.error(err);
        });
})

// Album tracks
app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(function (data) {
            console.log('Album Tracks',data.body.items);
             let tracksArray = data.body.items
             res.render('track-information', {tracksArray})

        }, function (err) {
            console.log('Something went wrong!', err);
        });
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));