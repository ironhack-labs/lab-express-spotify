require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

// Config partials

hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token'])
    }).catch(err => {
        console.error('something went wrong ', err);
    });
// Our routes go here:


app.get('/', (req, res, next) => {
    res.render("home")
});

app.get("/artist-search", (req, res, next) => {
    const { search: artist } = req.query;
    spotifyApi
        .searchArtists(artist).then((data) => {
            //console.log(data.body.artists.items);
            res.render("resultsArtist", { albums: data.body.artists.items });
        }).catch((err) => {
            console.log(err);
            res.send("err");
        });
});


app.get("/albums/:artistId", (req, res) => {
    const { artistId } = req.params;
    spotifyApi.getArtistAlbums(artistId)
        .then((data) => {
            //console.log(data.body);
            res.render("albumsList", { albums: data.body.items });
        }).catch((error) => {
            console.log(err);
            res.send("err");
        });
});

app.get("/tracks/:albumId", (req, res, next) => {
    const { albumId } = req.params;

    spotifyApi.getAlbumTracks(albumId)
        .then(data => {
            //console.log(data)
            res.render('tracks', { tracks: data.body.items });
        })
        .catch((err) => {
            console.log(err);
            res.send("err");
        });
});
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));