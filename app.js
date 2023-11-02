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
app.get("/", (req, res) => {

    res.render("home-page")
})

app.get("/artist-search", (req, res) => {
    const { artist } = req.query


    spotifyApi
        .searchArtists(artist)
        .then(data => {
            //console.log('The received data from the API: ', data.body.artists);
            const artistArray = { artist: data.body.artists.items }
            res.render("artist-search-results", artistArray)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));


})

app.get("/albums/:id", (req, res) => {
    const id = req.params.id
    console.log(id)

    spotifyApi.getArtistAlbums(id).then(data => {
        console.log(data.body)
        res.render("albums", data.body)

    })
        .catch(err => console.log('The error while searching albums occurred: ', err));

})

app.get("/tracks/:id", (req, res) => {
    const { id } = req.params
    console.log('----', id)

    spotifyApi
        .getAlbumTracks(id)
        .then(data => {
            console.log(data.body)
            res.render("tracks-result", data.body)

        })
        .catch(err => console.log('The error while searching tracks occurred: ', err));

})






app.listen(process.env.PORT, () => console.log(`My Spotify project running on port ${process.env.PORT} 🎧 🥁 🎸 🔊`));
// app.listen(process.env.PORT, () => console.log(`My Spotify project running on port ${process.env.PORT} 🎧 🥁 🎸 🔊`));
