const express = require('express');
const hbs = require('hbs');
// const path = require('path')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// credentials
clientId: 'fcecfc72172e4cd267473117a17cbd4d',
    clientSecret: 'a6338157c9bb5ac9c71924cb2940e1a7';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});


// retrieving an access token

spotifyApi
    .clientCredentialsGrant().then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });

// setting the spotify-api goes here:

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/artists", (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log("The received data from the API: ", data.body);
            res.render("artists", {
                artists: data.body.artists.items
            });
                  // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
});

app.get("/albums/:artistId", (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId).then(data => {
        console.log("The received data from the API album: ", data.body);
        res.render("albums", {
            albums: data.body.items
        });
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId).then(data => {
        console.log("The received data from the API album: ", data.body);
        res.render("albums", {
            tracks: data.body.items
        });
    });
});

// the routes go here:

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
