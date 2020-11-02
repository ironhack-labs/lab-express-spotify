require('dotenv').config(); // reads .env file, node.js provides it

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({ // an instance of the SpotifyWebApi class
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant() // http connection request 
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:


app.get('/', (req, res) => {
    res.render('index')
});

app.get('/artist-search', (req, res) => {

    let pageNum = parseInt(req.query.pageNum); // parseInt() function parses a string argument and returns an integer
    if (isNaN(pageNum) || pageNum < 1) { // isNaN() function determines whether a value is NaN or not
        pageNum = 1;
    }
    const pageSize = 6;
    const offset = (pageNum - 1) * pageSize; // OR: pageNum * pageSize - pageSize

    spotifyApi
        .searchArtists(req.query.query, { limit: pageSize, offset: offset })
        .then(data => {
            console.log('The received data from the API: ', data.body.artists,
                // JSON.stringify(data.body.artists.items, null, 2) // less readable / structured but you have the access to all properties names at once
            );
            res.render("artist-search-results", {
                data: data.body,
                query: req.query.query,
                next: pageNum + 1,
                prev: pageNum - 1,
                isFirst: pageNum <= 1,
                isLast: data.body.artists.total <= pageNum * pageSize
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:id/:pageNum', (req, res) => {

    let pageNum = parseInt(req.params.pageNum);
    if (isNaN(pageNum) || pageNum < 1) {
        pageNum = 1;
    }
    const pageSize = 6;
    const offset = (pageNum - 1) * pageSize; // OR: pageNum * pageSize - pageSize

    spotifyApi
        .getArtistAlbums(req.params.id, { limit: pageSize, offset: offset })
        .then(data => {
            console.log(data.body)
            // console.log('The received data from the API: ', data.body.items, JSON.stringify(data.body.items));
            res.render("albums", { // what we want to render on the web page
                data: data.body,
                artistId: req.params.id,
                next: pageNum + 1,
                prev: pageNum - 1,
                isFirst: pageNum <= 1,
                isLast: data.body.total <= pageNum * pageSize
            });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get('/tracks/:id', (req, res) => {


    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(data => {

            // console.log('The received data from the API: ', data.body);
            res.render("tracks", { data: data.body.items })
        })
        .catch(err => console.log('The error while searching tracks occurred: ', err));

});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
