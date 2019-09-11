require('dotenv').config()
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials('views/partials')
app.use(express.static(__dirname + '/public'));
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.IH_SE_CLIENT_ID,
    clientSecret: process.env.IH_SE_CLIENT_SECRET
});


spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });


app.get('/', (req, res, next) => {
    res.render('index')
})

app.get('/artists', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artistName)
        .then(data => {
            res.render('artists', { items: data.body.artists.items })
        })
        .catch(err => {
            res.status(404).send(err)
        });
})

app.get('/albums/:id', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(data => {
            res.render('albums', { items: data.body.items })
        })
        .catch(err => {
            res.status(404).send(err)
        });
})

app.get('/tracks/:id', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(data => {
            res.render('tracks', { items: data.body.items })
        })
        .catch(err => {
            res.status(404).send(err)
        });
})
app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));