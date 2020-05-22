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

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:
app.get('/', (req, res) => {
    res.render("index", {
        data: "Busca tu artista favorito:"
    })
})

app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artistName)
        .then(data => {
            console.log('data from API: ', data.body.artists.items)
            res.render('artist-search-results', {
                artists: data.body.artists.items
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
    console.log('data', req.query)

})




app.get('/albums/:artistId', (req, res, next) => {
    artistId = req.params.artistId

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            console.log('data from API: ', data.body.items)
            res.render('albums', {
                albums: data.body.items
            })
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
    console.log('data', req.query)


});

app.get("/tracks/:albumId", (req, res, next) => {
    albumId = req.params.albumId
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => res.render('tracks', {
            tracks: data.body.items
        }))
        .catch(err => console.log('The error while searching tracks occurred: ', err))
    console.log('data', req.params)

})






app.listen(3003, () => console.log('My Spotify project running on port 3003 gracias a Marce 🎧 🥁 🎸 🔊'));