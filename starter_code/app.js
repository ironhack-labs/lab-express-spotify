require('dotenv').config()
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");//es posible que haya ue bajarlo
const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
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
app.get("/", (req, res, next) => {
    res.render("index");
    
});
app.post('/artist', (req, res) => {
    let name = req.body.artist;
    // console.log(req.body)
    spotifyApi
    .searchArtists(name)
        .then(data => {
            let returnedArtists = data.body.artists.items
            res.render("artist", {returnedArtists})
            console.log("The received data from the API: ", data.body.artists);
            
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
        
});

app.get("/albums/:id", (req, res) => {
    let artistId = req.params.id;
    spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
        let returnedAlbums = data.body.items
        res.render("albums", {returnedAlbums});
    })
});

app.get("/album/:id", (req, res) => {
    let albumId = req.params.id;
    spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
        let returnedTracks = data.body.items
        res.render("tracks", {returnedTracks});
    })
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
// Collapse



