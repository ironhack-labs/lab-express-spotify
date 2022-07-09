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

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/artist-search", (req, res) => {
    let offset = 0;
    const limit = 12;
    if(req.query.offset && req.query.offset >=0) {
        offset = req.query.offset;
    };
    
    const pageNumber = offset / limit + 1;

    spotifyApi
        .searchArtists(req.query.search, {limit: limit, offset: offset})
        .then(data => {
            data.body.searchQuery = req.query.search;
            data.body.nextOffset = +(offset) + limit;
            data.body.previousOffset = +(offset) - limit;
            if (data.body.previousOffset < 0) {
                data.body.previousOffset = 0;
            }
            if (data.body.nextOffset > data.body.artists.total) {
                data.body.nextOffset = +offset;
            }
            data.body.pageNumber = pageNumber;

            console.log('The received data from the API: ', data.body);
            res.render("artist-search-results", data);
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    let offset = 0;
    const limit = 12;
    if(req.query.offset && req.query.offset >=0) {
        offset = req.query.offset;
    };
    
    const pageNumber = offset / limit + 1;

    spotifyApi
        .getArtistAlbums(req.params.artistId, {limit: limit, offset: offset})
        .then(data => {
            data.body.artistId = req.params.artistId;
            data.body.nextOffset = +(offset) + limit;
            data.body.previousOffset = +(offset) - limit;
            if (data.body.previousOffset < 0) {
                data.body.previousOffset = 0;
            }
            if (data.body.nextOffset > data.body.total) {
                data.body.nextOffset = +offset;
            }
            data.body.pageNumber = pageNumber;
            
            console.log('The received data from the API: ', data.body);
            res.render("albums", data);
        })
        .catch(err => console.log('The error while listing albums occurred: ', err));
});

app.get('/tracks/:trackId', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.trackId)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render("tracks", data);
        })
        .catch(err => console.log('The error while listing tracks occurred: ', err));
});


app.listen(3001, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'));
