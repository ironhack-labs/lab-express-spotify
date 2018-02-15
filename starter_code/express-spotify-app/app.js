const SpotifyWebApi = require('spotify-web-api-node');
const express = require("express");
const path = require('path');

const morgan = require('morgan')
const expressLayouts = require("express-ejs-layouts")
// Remember to paste here your credentials
var clientId = 'd1136ee12e4b4bf5badc12723366c2d6',
    clientSecret = '1cf32bb5a2354844b1409ffb2cd0f5dd';

const app = express();

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});
app.use(morgan('dev'));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts)
app.set("layout", "layouts/main-layout")

app.set("views", __dirname + "/views")
app.set("view engine", "ejs");


// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.post("/artist", function(req, res, next){
    spotifyApi.searchArtists(req.body.term.split(" ")[0])
    .then((response) => {
        let artist = req.body.term;
        let artistInfo=response.body.artists.items
        if (artistInfo.length>0){

        res.render("artist", {artistInfo: artistInfo, artist: artist})
        } else{

        res.render("index")
        }
    }).catch((err) => {
        res.render("index")
    });
});

app.get("/artist", function(req, res, next){
    res.render("index")
});

app.get("/albums", function(req, res, next){
    res.render("index")
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then((response) => {
        let artistName = response.body.items[0].artists[0].name;
        let albumInfo = response.body.items
        res.render("albums", {artistName: artistName, albumInfo: albumInfo})
    }).catch((err) => {
        res.render("index")
    });
});

app.get('/tracks/:albumId', (req, res) => {

    spotifyApi.getAlbumTracks(req.params.albumId)
    .then((response) => {
        let trackList = response.body.items
        res.render("tracks", {trackList: trackList})
    }).catch((err) => {
        res.render("index")
    });
});

app.get("/", function(req, res, next){
    res.render("index")
});

app.listen(3000, function(err){
    if(err) console.log(err);
    console.log("Tu servidor esta funcionando");
})