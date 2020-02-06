require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

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

app.get('/', (req, res) => res.render('index'));
app.get('/artist-search', (req, res) => {
    const artistInfo = req.query.artist
    console.log(artistInfo)

    spotifyApi
        .searchArtists(artistInfo)
        .then(data => {
            // console.log('The received data from the API: ', data.body.artists.items[0].images[0].url)

            res.render('artistsearch', {
                artistas: data.body.artists.items,
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});
app.get('/albums/:artistId', (req, res, next) => {
    const id = req.params.artistId
    console.log(id)

    spotifyApi
        .getAlbum(id)
        .then(data => {
            // console.log('The received data from the API: ', data.body.items)

            res.render('artist-search-results', {
                albums: data.body.items,
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get('/album/:albumId', (req, res, next) => {
    const albumTracks = req.params.albumId
    console.log(albumTracks)

    spotifyApi
        .getAlbumTracks(albumTracks)
        .then(data => {
            console.log('The received data from the API: ', data.body.items[0])

            res.render('albums', {
                tracks: data.body.items,
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));