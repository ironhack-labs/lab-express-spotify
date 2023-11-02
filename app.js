require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});


spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res) => {

    res.render("home-page")
})

app.get("/artist-search", (req, res) => {
    const { artist } = req.query

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            const artists = data.body.artists.items
            // console.log("Trying to see the object", artists[0].images[0].url)
            res.render('artist-search-results', { artists })

        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:id', (req, res) => {
    const { id } = req.params


    spotifyApi
        .getArtistAlbums(id)
        .then(data => {
            console.log("ESTOS SON LOS ALBUNES DEL ARTISTA AL QUE HAS HECHO CLICK", data.body)
            const albums = data.body.items
            res.render('albums', { albums })

        })
        .catch(err => console.log('The error while searching albums occurred: ', err))

});
app.get('/tracks/:id', (req, res) => {
    const { id } = req.params


    spotifyApi
        .getAlbumTracks(id)
        .then(data => {
            console.log("ESTOS SON LOS tracksDEL ARTISTA AL QUE HAS HECHO CLICK", data.body)
            const tracks = data.body.items
            res.render('tracks', { tracks })

        })
        .catch(err => console.log('The error while searching albums occurred: ', err))

});
app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));
