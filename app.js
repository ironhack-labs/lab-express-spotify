require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const PORT = process.env.PORT || 3000;
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
    res.render('index')
})

app.get('/artist-search', (req, res) => {

    const { artist } = req.query

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

            const artistData = data.body.artists.items

            res.render('artist-search-results', { artistData })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artist_id', (req, res) => {

    const { artist_id } = req.params

    spotifyApi
        .getArtistAlbums(artist_id)
        .then(data => {

            const albumsData = data.body.items

            res.render('albums', { albumsData })
        })
        .catch(err => console.log(err))
})

app.get('/tracks/:album_id', (req, res) => {

    const { album_id } = req.params

    spotifyApi
        .getAlbumTracks(album_id)
        .then(data => {

            const tracksData = data.body.items

            res.render('tracks', { tracksData })
        })
        .catch(err => console.log(err))


})


app.listen(PORT, () => console.log(`My Spotify project running on port ${PORT} 🎧 🥁 🎸 🔊`));
