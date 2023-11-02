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

app.get("/", (req, res) => {
    res.render("home-page")
})


app.get("/artist-search", (req, res) => {

    const { artist } = req.query

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            res.render("artist-search-results", { artist: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
    const { artistId } = req.params

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            // console.log(data.body.items)
            res.render("albums", { dataAlbum: data.body.items })

        })
        .catch(err => console.log("The error while searching albums occurred", err))

});

app.get("/tracks/:albumId", (req, res) => {
    const { albumId } = req.params
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            // console.log(data.body.items)
            res.render("tracks", { dataTracks: data.body.items })
        })
        .catch(err => console.log("This is an error in tracks", err))
})


app.listen(5005, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
