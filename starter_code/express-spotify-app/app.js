// Creating the const-------------------------------------------------------
//--------------------------------------------------------------------------
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const prettyjson = require('prettyjson');
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------


// Calls------------------ -------------------------------------------------
//--------------------------------------------------------------------------
app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials")
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------

//Spotify API---------------------------------------------------------------
//--------------------------------------------------------------------------
var spotifyApi = new SpotifyWebApi({
  clientId : '455d3421402141a9b8c375376fec771f',
  clientSecret : '3360ac40d1bc4e52a30043de04ff12a1'
});
// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
   .then(data => {
        spotifyApi.setAccessToken(data.body.access_token);
    }, err => {
        console.log('Something went wrong. Cannot retrieve token', err);
    }
);
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------

// ROUTES ------------------------------------------------------------------
//--------------------------------------------------------------------------
app.get("/", (req, res, next) => {
    res.render("index.hbs")
})

// -- Get artists
app.get('/artists', (req, res, next) => {
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            const artists = data.body.artists.items;
            res.render("artist.hbs", {artists})
            })
        .catch(err => {
            console.log(err);
        });
    });
// -- Get albums
app.get("/albums/:artistID", (req, res, next) => {
    const artistID = req.params.artistID;
    spotifyApi.getArtistAlbums(artistID)
        .then(data => {;
           let albums = data.body.items;
           res.render("album.hbs", {albums});
        })
        .catch(err => {
            console.log(err);
        });
})
// -- Get tracks


// -------------------------------------------------------------------------s
// -------------------------------------------------------------------------


// Listner
app.listen(3000,() => {
    console.log("Play me some tunes 🎧!")
})


