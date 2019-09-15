require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
// Client ID 88afe061ad304d00aed5e5a0675f6e0d
// Client Secret 3973244f11e34c01a0c9c3e96ebba002
CLIENT_ID = '88afe061ad304d00aed5e5a0675f6e0d'
CLIENT_SECRET = '3973244f11e34c01a0c9c3e96ebba002'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET
});


// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });




// the routes go here:
app.get('/', (req, res, next) => {
    // console.log(req);
    res.render('index');
});


app.get('/artists', (req, res, next) => {
    // console.log(req.query);
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            // console.log("The received data from the API: ", data.body.artists.items);
            // console.log(data)
            res.render('artists', {
                artist: data.body.artists.items
            });
            // res.send(data.body.artists);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
});


// ask about this album id 
app.get("/albums/:albumId", (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi.getArtistAlbums(req.params.albumId)
        .then(function (data) {

            // console.log('Artist albums', data.body.items);
            res.render('albums', { albums : data.body.items })

        }, function (err) {
            console.error(err);
        });
    // console.log(req.params)
});


app.get("/tracks/:trackId", (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi.getAlbumTracks(req.params.trackId)
        .then(function (track) {

            console.log('Artist tracks', track.body);
            res.render('tracks', { tracks : track.body.items })

        }, function (err) {
            console.error(err);
        });
});









app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));