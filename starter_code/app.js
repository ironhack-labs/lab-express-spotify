const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));


// setting the spotify-api goes here:
const clientId = "79c6763d65e44ce8a7805afe8d104179";
const clientSecret = "1fffe8486cdc46e5895366697cabbd3a";

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});


// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    })



// the routes go here:
app.get('/', (req, res, next) => { res.render('index', { title: 'Home' }); });

app.get('/artists', (req, res, next) => {
    spotifyApi.searchArtists(JSON.stringify(req.query.artist))
        .then(data => {
            //console.log("The received data from the API: ", data.body;
            res.render('artists', { title: 'Search', data })
        })
        .catch(err => { console.log("The error while searching artists occurred: ", err); })
})

app.get('/albums/:id', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.id)
        .then(data => {
            //console.log("The received data from the API: ", data.body);
            res.render('albums', { title: 'Albums', data });
        })
        .catch(err => { console.log("The error while searching albums occurred: ", err); })
})

app.get('/tracks/:id', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.id)
        .then(data => {
            console.log("The received data from the API: ", data.body.items[0]);
            res.render('tracks', { title: 'Tracks', data });
        })
        .catch(err => { console.log("The error while searching tracks occurred: ", err); })
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));