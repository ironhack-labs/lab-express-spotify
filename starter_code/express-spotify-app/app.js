const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require("path");
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
// use logger
app.use(morgan('combined'));

// Remember to paste here your credentials
var clientId = '0904ba7af5ea4a3cbae5c130a8fff88c',
    clientSecret = '0ab00dd676ae43a59a4069c8779f5d94';

var spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"public")));

hbs.registerPartials(path.join(__dirname,"views","partials"));

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
        console.log('Something went wrong when retrieving an access token', err);
    });


app.get("/", function(req, res){

    res.status(200)
        .render("index");
});

app.get("/artists", async function(req, res){

    let response = await spotifyApi.searchArtists(req.query.artist);

    if(response.statusCode === 200) {

        let artists = response.body.artists.items;

        res.status(200)
            .render("artists", { artists: artists});
    }

});

app.get('/albums/:artistId', async function(req, res)  {
    let response = await spotifyApi.getArtistAlbums(req.params.artistId);

    if(response.statusCode === 200) {

        let albums = response.body.items;

        res.status(200)
            .render("albums", { albums: albums});
    }
});

app.get('/tracks/:albumId', async function(req, res) {
    let response = await spotifyApi.getAlbumTracks(req.params.albumId);

    if(response.statusCode === 200) {

        let tracks = response.body.items;

        res.status(200)
            .render("tracks", { tracks: tracks});
    }
});


app.listen(3000, function(){
    console.log("Connected to server!");
});