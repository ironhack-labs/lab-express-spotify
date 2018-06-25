const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const request = require('request');

app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials")


// ROUTES --------------------------------
app.get("/", (req, res, next) => {
    res.render("index.hbs")
})


app.get('/artists', (req, res, next) => {
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            //res.send(data.body.artists);     //check if API connected
            let artists = data.body.artists.items;
            //res.send(artists.images);
            res.render("artist.hbs", {artists})
            })
        .catch(err => {
            console.log(err);
        });
    });


app.get("/albums/:artistID", (req, res, next) => {
    const artistID = req.params.artistID;
    spotifyApi.getArtistAlbums(artistID)
        .then(data => {
           //res.send(data);
           let albums = data.body.items;
           res.render("album.hbs", {albums});
        })
        .catch(err => {
            console.log(err);
        });
})

app.get("/tracks/:albumID", (req, res, next) => {
    const albumID = req.params.albumID;
    spotifyApi.getAlbumTracks(albumID)
    .then(function(data) {
        let tracks = data.body.items;
        //res.send(tracks);
        res.render("tracks.hbs", {tracks})
    }, function(err) {
        console.log('Something went wrong!', err);
  });
})



// Listner
app.listen(3000,() => {
    console.log("Server started!")
})


//---------------------------------------------------------------
// Spotify API

const clientID = "cf1fe2d1c64b47229d696729510290e6";
clientSecret = "91a6da4e7315444c8cdbf57756d4378f";

var spotifyApi = new SpotifyWebApi({
  clientId : clientID,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
   .then(data => {
        spotifyApi.setAccessToken(data.body.access_token);
    }, err => {
        console.log('Something went wrong', err);
    }
);
