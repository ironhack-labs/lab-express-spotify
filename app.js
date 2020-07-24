require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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


//app.get para hacer el render de index con el formulario. 
app.get("/", (req, res, next) => {
    res.render("index");
});

// una vez apretamos el botón del formulario, le decimos que es lo que tiene que hacer
app.get('/artist-search', (req, res, next) => {

    //hacemos una variable con el resultado de artist dentro del formulario

    let {
        artist
    } = req.query;
    spotifyApi
        .searchArtists(artist)

        .then(data => {
            /*  console.log('The received data from the API: ', data.body);
             console.log(data.body.artists.items) */
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artist-search-results', {
                data: data.body.artists.items
            });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artistId', (req, res, next) => {

    let albums = req.params.artistId;
    console.log(req.params)
    console.log(albums)
    spotifyApi
        .getArtistAlbums(albums)

        .then(data => {
            console.log(data.body.items)
            res.render('albums', {
                data: data.body.items
            });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:albumId', (req, res, next) => {

    let tracks = req.params.albumId;
    /*   console.log(req.params)
      console.log(albums) */
    spotifyApi
        .getAlbumTracks(tracks)

        .then(data => {
            console.log(data.body.items)
            res.render('tracks', {
                data: data.body.items
            });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));