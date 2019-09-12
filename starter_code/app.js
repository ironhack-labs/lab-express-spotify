require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token

spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });

// the routes go here:

app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artist', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log("The received data from the API: ", data.body);
            let results = data.body;
            console.log(results.artists.items)

            res.render('artist', { results })
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
})

app.get('/album/:albumId', (req, res, next) => {

    console.log(req.params)
    spotifyApi.getArtistAlbums(req.params.albumId).then(data => {
        console.log('Artist albums', data.body.items[0]);
        res.render('album.hbs', { albumsToHBS: data.body.items })
    }).catch(err => {
        console.log("The error ", err);
    });
})


app.get('/track/:tracksId', (req, res, next) => {

    console.log(req.params)
    spotifyApi.getAlbumTracks(req.params.tracksId).then(data => {
        console.log('Album tracks', data.body.items[0]);
        res.render('track.hbs', { trackToHBS: data.body.items })
    }).catch(err => {
        console.log("The error ", err);
    });
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));