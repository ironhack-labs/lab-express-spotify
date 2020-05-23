require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path')
const bodyParser = require("body-parser")
const artistSearch = require('./routes/artistSearchRoute');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

//Middleware body parser
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(path.join(__dirname, "/views/partials"));
app.use(express.static(__dirname + '/public'));

//Rutas
app.use("/artist-search", artistSearch);

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res, next) => {
    res.render('index');
    console.log("Get al index!");
});

//ruta albums
app.get("/albums/:artistId", (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(function (data) {
            console.log(data.body)
            res.render('albums', {artistAlbums: data.body.items})
        }, function (err) {
            console.error(err);
        });
})

//ruta tracks
app.get("/tracks/:albumId", (req, res, nexy) => {
    console.log(req.params)
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
        console.log(data.body)
       res.render('tracks', {tracks: data.body.items})
    })
    .catch(err => console.log(err))
})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
