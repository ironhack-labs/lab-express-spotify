require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// register partials for handlebars
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID, //aqui ira nuestro client ID guardado en el documento .env
    clientSecret: process.env.CLIENT_SECRET //aqui ira nuestro client secret guardado en el documento .env
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get("/", (req, res, next) => {
    res.render('home');
});
app.get("/artist-search", (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.images);
            //What we want to do after receiving the data from the API
            let artist = data.body.artists.items;
            res.render('artist-search-results', artist);

        })
        .catch(err => console.log("The error while searching artists ocurred: ", err));
});

app.get("/albums/:artistId", (req, res, next) => {
    let idArtist = req.params.artistId;
    spotifyApi.getArtistAlbums(idArtist)
        .then(
            function (data) {
                console.log('Artist albums', data.body);
                let albums = data.body.items;
                res.render('albums', albums);
            });
});

app.get("/track-information/:albumId", (req, res, next) => {
    let idAlbum = req.params.albumId;
    spotifyApi
        .getAlbumTracks(idAlbum, {
            limit: 5,
            offset: 1
        })
        .then(data => {
            let tracks = data.body.items;
            console.log(data.body.items)
            res.render('track-information', tracks)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));