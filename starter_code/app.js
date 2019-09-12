require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')


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
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });




// the routes go here:

app.get("/", (req, res, next)=>{
    res.render("index")
});

app.get("/artists", (req, res, next)=>{
    console.log("--------- ", req.query.artistName)
spotifyApi
    .searchArtists(req.query.artistName)
    .then(data => {
        console.log("------------------The received data from the API: ", data.body.artists.items[0].images[0].url);
        res.render("artists", {artist: data.body.artists.items})
    })
    .catch(err => {
        console.log("The error while searching artists occurred: ", err);
    });
})

app.get("/albums/:albumId", (req, res, next) => {
    console.log(req.params)

    spotifyApi.getArtistAlbums(req.params.albumId)
        .then(function (data) {
            res.render("albums", {album: data.body.items})
        }, function (err) {
            console.error(err);
        });


})

app.get("/tracks/:tracksId", (req, res, next)=>{
    console.log(req.params.tracksId)

    spotifyApi.getAlbumTracks(req.params.tracksId)
        .then(function (data) {

            console.log('Search tracks in the artist name----------', data.body.items);
            res.render("tracks", {track: data.body.items});
        }, function (err) {
            console.error(err);
        });

})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
