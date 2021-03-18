require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
    // redirectUri: 'http://localhost:/callback'
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res, next) => res.render("index"));

app.get('/artist-search', (req, res, next) => {

    let artistName = req.query.artist;

    spotifyApi
        .searchArtists(artistName)
        .then(data => {
            let results = data.body.artists.items
            res.render('artist-search', {artists: results});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/artist-albums/:id', (req, res, next) => {

    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(data => {
            let results = data.body.items;
            const uniqueAlbums = Array.from(new Set(results.map(a => a.name)))
            .map(name => {
                return results.find(a => a.name === name)
            })
            res.render('albums', {albums: uniqueAlbums})
        })
        .catch(err => console.log(err));
})

app.get('/tracks/:albumid', (req, res, next) => {

    let id = req.params.albumid;

    spotifyApi
        .getAlbumTracks(id, {limit : 5})
        .then(data => {
            let results = data.body.items;
            res.render('tracks', {tracks: results})
        })
        .catch(err => console.log(err));
})

// Post Requests

app.get('/search-tracks', (req, res, next) => res.render('track-search'));

app.post('/track-search-results', (req, res, next) => {
// In the future we will not use rs.render inside post routes.  Post routes will be for performing functional operations and redirecting

    spotifyApi
        .searchTracks(req.body.songname)
        .then(data => {
            res.render('Song-results', { songs: data.body.tracks.items })
        })
        .catch(err => console.log(err));    
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
