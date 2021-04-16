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
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index');
})

//Iteration 3 step 2: Display results for artist search
app.get('/artist-search', (req, res) => {
    console.log(req.query.q)
    spotifyApi
    .searchArtists(req.query.q)
    .then(data => {
        res.render('artist-search-results', { searchResults: data.body.artists.items, searchString: req.query.q});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


//Iteration 4: view albums
app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(function (data) {
            console.log('Artist albums', data.body.items[0].artists[0].name);
            res.render('albums', { artistAlbums: data.body.items })
        }, function (err) {
            console.error(err);
        });
});

//Iteration 5: view tracks
app.get('/tracks/:albumId', (req, res, next) => {
    // .getAlbumTracks() code goes here
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(function (data) {
            //console.log('Album tracks', data.body);
            res.render('tracks', { albumTracks: data.body.items })
        }, function (err) {
            console.error(err);
        });
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));