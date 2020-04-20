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
app.get('/', (req, res) => {
    res.render('index', {
        styles: ["style_index.css"]
    })
})

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then((data) => {
            console.log('Result of the search by artist are', data.body.artists.items);
            const artists = data.body.artists.items;
            res.render('artist-search-results', {
                artists: artists,
                styles:["style_artist.css"]
            })
        })
        .catch((err) => {
            console.log('Something went wrong!', err)
        })
})

app.get("/albums/:id", (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then((data) => {
            console.log('here the albums', data.body.items);
            const albums = data.body.items;
            res.render('albums', {
                albums: albums,
                styles: ["style_album.css"]
            })
        })
        .catch((err) => {
            console.log(err)
        })

})

app.get("/tracks/:name/:id", (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.id, {
            limit: 5
        })
        .then((data) => {
            console.log("Here the tracks of your album", data.body.items[0])
            const tracks = data.body.items;

            res.render('tracks', {
                tracks: tracks,
                styles: ["style_tracks.css"]
            })
        })
        .catch((err) => {
            console.log(err)
        })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));