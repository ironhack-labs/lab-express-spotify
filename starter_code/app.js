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
            const artists = data.body.artists;
            artists.items.forEach(i => console.log(i));
            res.render('artist.hbs', artists);
        })
        .catch(err => {
            console.log(err);
        });
    });

app.get('/albums', (req, res) => {
    spotifyApi.getArtistAlbums(req.query.artistId)
        .then(data => {
            const albums = data.body;
            albums.items.forEach(i => console.log(i));
            res.render('albums', albums);
        })
        .catch(err => {
            console.log(err);
        });
    });



app.get("albums/:artistID", (req, res, next) => {
    let artistID = req.query.artistID;
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
