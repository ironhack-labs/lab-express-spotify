require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
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
    res.render('home-page')
})

app.get('/artist-search', (req, res) => {

    const { artistName } = req.query

    spotifyApi
        .searchArtists(artistName)
        .then(data => {
            //res.send(data.body.artists.items)

            res.render('artist-search-results', { artist: data.body.artists.items })

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res) => {

    const { id } = req.params

    spotifyApi.getArtistAlbums(id).then(
        function (data) {
            res.render('albums', { albums: data.body.items })
        },
        function (err) {
            console.error(err)
        }
    )
})

app.get('/view-tracks/:id', (req, res) => {
    const { id } = req.params
    // res.send(id)


    spotifyApi.getAlbumTracks(id)

        .then(function (data) {
            res.render('tracks', { track: data.body.items })
            // res.send(data.body.items)
        }, function (err) {
            console.log('Something went wrong!', err)
        })
})



app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));
