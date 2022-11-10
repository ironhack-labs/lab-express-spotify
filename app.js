require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path')
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));





app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => {

    const { artista } = req.query
    console.log('Hemos buscado ------', artista)

    spotifyApi
        .searchArtists(artista)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            res.render('search-results', { artist: data.body.artists.items })
        })

        .catch(err => console.log('The error while searching artists occurred: ', err));
})
app.get('/albums/:artistId', (req, res) => {
    const { artistId } = req.params

    spotifyApi
        // .findById(artistId)
        .getArtistAlbums(artistId)

        .then(
            function (data) {
                console.log('albums', data.body.items);
                res.render('albums', { albums: data.body.items })
            },
            function (err) {
                console.error(err);
            }

        );
})


app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));
