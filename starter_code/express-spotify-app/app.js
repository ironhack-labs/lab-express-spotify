const express = require('express');
const app = express();
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

//const bodyParser = require("body-parser");

app.use(express.static("public"));

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

/* hbs.registerPartials(__dirname + '/views/partials'); */

//app.use(bodyParser.urlencoded({ extended: false }));

const clientId = '80fbfd97506b48a2869f20097f7da2cf',
    clientSecret = 'fceb560324554b7c8c071952064f56c0';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
        console.log('Something went wrong when retrieving an access token', err);
    });


app.get("/", (req, res, next) => {
    res.render("home");
});

app.get("/search", (req, res, next) => {
    let artistSearch = req.query.artist;
    spotifyApi.searchArtists(artistSearch)
        .then(data => {
            let artistItems = data.body.artists.items;
            res.render("artists", { artist: artistItems });
        })
        .catch(err => {
            console.error(err);
        });
});

app.get("/albums/:artistId", (req, res) => {
    //artistParam puede ser cualquier nombre
    //params es el mismo siempre
    let artistParam = req.params.artistId;
    spotifyApi.getArtistAlbums(artistParam)
        .then(data => {
            let albumsItems = data.body.items;
            res.render("albums", { album: albumsItems });
        })
        .catch(err => {
            console.error(err);
        });
});

app.get("/tracks/:albumId", (req, res) => {
    let albumParam = req.params.albumId;
    spotifyApi.getAlbumTracks(albumParam)
        .then(data => {
            let tracksItems = data.body.items;
            res.render("tracks", { tracks: tracksItems });
        })
        .catch(err => {
            console.error(err);
        });
});

app.listen(3000, () => {
    console.log("Escuchando en 3000");
});